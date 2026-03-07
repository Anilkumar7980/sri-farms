// ═══════════════════════════════════════════════════════════
// SRI FARMS — USER MANAGEMENT EDGE FUNCTION
//
// HOW TO DEPLOY (no coding needed):
// 1. Go to Supabase Dashboard
// 2. Click "Edge Functions" in left sidebar
// 3. Click "Create a new function"
// 4. Name it exactly: manage-users
// 5. Paste this ENTIRE file content
// 6. Click "Deploy"
// ═══════════════════════════════════════════════════════════

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Create admin client using service role (has full access)
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    // Verify the caller is the farm owner
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user: callerUser }, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !callerUser) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check caller is owner
    const { data: callerProfile } = await supabaseAdmin
      .from("profiles").select("role").eq("id", callerUser.id).single();

    if (!callerProfile || callerProfile.role !== "owner") {
      return new Response(JSON.stringify({ error: "Only Farm Owner can manage users" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const { action } = body;

    // ── CREATE USER ──────────────────────────────────────
    if (action === "create") {
      const { email, password, name, role, icon, default_lang, phone } = body;

      // Create auth user
      const { data: newAuthUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true, // skip email verification
      });

      if (createError) {
        return new Response(JSON.stringify({ error: createError.message }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Create profile
      const { data: profile, error: profileError } = await supabaseAdmin
        .from("profiles")
        .insert({
          id: newAuthUser.user.id,
          name,
          role,
          icon: icon || roleIcon(role),
          default_lang: default_lang || "en",
          phone: phone || "",
        })
        .select().single();

      if (profileError) {
        // Rollback: delete auth user if profile creation failed
        await supabaseAdmin.auth.admin.deleteUser(newAuthUser.user.id);
        return new Response(JSON.stringify({ error: profileError.message }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ success: true, user: { ...profile, email } }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ── UPDATE USER (role, name, password) ───────────────
    if (action === "update") {
      const { userId, name, role, phone, default_lang, newPassword } = body;

      // Update profile
      const { error: profileError } = await supabaseAdmin
        .from("profiles")
        .update({ name, role, phone, default_lang, icon: roleIcon(role) })
        .eq("id", userId);

      if (profileError) {
        return new Response(JSON.stringify({ error: profileError.message }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Update password if provided
      if (newPassword && newPassword.length >= 6) {
        const { error: passError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
          password: newPassword,
        });
        if (passError) {
          return new Response(JSON.stringify({ error: passError.message }), {
            status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
      }

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ── DELETE USER ──────────────────────────────────────
    if (action === "delete") {
      const { userId } = body;

      await supabaseAdmin.from("profiles").delete().eq("id", userId);
      await supabaseAdmin.auth.admin.deleteUser(userId);

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ── LIST USERS ───────────────────────────────────────
    if (action === "list") {
      const { data: profiles } = await supabaseAdmin
        .from("profiles").select("*").order("created_at");

      // Get emails from auth
      const { data: { users: authUsers } } = await supabaseAdmin.auth.admin.listUsers();
      const emailMap = {};
      authUsers.forEach(u => { emailMap[u.id] = u.email; });

      const result = (profiles || []).map(p => ({ ...p, email: emailMap[p.id] || "" }));

      return new Response(JSON.stringify({ success: true, users: result }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Unknown action" }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

function roleIcon(role) {
  return { owner: "👑", supervisor: "🧑‍🌾", manager: "👔", worker: "👷" }[role] || "👤";
}
