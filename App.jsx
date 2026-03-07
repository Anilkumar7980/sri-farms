import { useState, useEffect, useRef, useCallback } from "react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { LayoutDashboard, Building2, Package, ClipboardList, Bell, CalendarDays, Cpu, History, Video, ImageIcon, LogOut, Plus, X, Check, AlertTriangle, AlertCircle, Info, TrendingUp, TrendingDown, Bird, Scale, Activity, Eye, EyeOff, Edit2, Trash2, Camera, Upload, RefreshCw, Copy, Search, Leaf, CheckCircle, MapPin, BookOpen, Zap, Star, Flame, Droplets, Thermometer, Wind, ChevronRight, Users2, KeyRound, UserPlus, ShieldCheck } from "lucide-react";
import { supabase, signIn, signOut, getProfile, DB, Users } from "./supabase.js";

/* ══════════════════════════════════════════════════════
   GLOBAL STYLES
══════════════════════════════════════════════════════ */
const G = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300&family=JetBrains+Mono:wght@400;500;700&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
html,body{height:100%;font-family:'DM Sans',sans-serif;background:#060D1A;color:#E2E8F0}
::-webkit-scrollbar{width:4px;height:4px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:rgba(99,179,237,0.3);border-radius:99px}
::-webkit-scrollbar-thumb:hover{background:rgba(99,179,237,0.6)}

@keyframes float{0%,100%{transform:translateY(0px)}50%{transform:translateY(-8px)}}
@keyframes bob{0%,100%{transform:translateY(0) rotate(0deg)}25%{transform:translateY(-3px) rotate(-1deg)}75%{transform:translateY(-3px) rotate(1deg)}}
@keyframes blink{0%,90%,100%{transform:scaleY(1)}95%{transform:scaleY(0.1)}}
@keyframes wag{0%,100%{transform:rotate(0deg)}50%{transform:rotate(8deg)}}
@keyframes pulse-ring{0%{transform:scale(0.9);opacity:1}100%{transform:scale(1.6);opacity:0}}
@keyframes glow-pulse{0%,100%{box-shadow:0 0 15px rgba(59,130,246,0.3)}50%{box-shadow:0 0 35px rgba(59,130,246,0.7)}}
@keyframes slide-right{from{transform:translateX(-20px);opacity:0}to{transform:none;opacity:1}}
@keyframes fade-up{from{transform:translateY(16px);opacity:0}to{transform:none;opacity:1}}
@keyframes fade-in{from{opacity:0}to{opacity:1}}
@keyframes count-up{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
@keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
@keyframes ticker{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes badge-pop{0%{transform:scale(0)}70%{transform:scale(1.2)}100%{transform:scale(1)}}
@keyframes blob-drift{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(30px,-20px) scale(1.1)}66%{transform:translate(-20px,10px) scale(0.9)}}
@keyframes alert-flash{0%,100%{background:rgba(239,68,68,0.1)}50%{background:rgba(239,68,68,0.25)}}
@keyframes confetti-fall{0%{transform:translateY(-10px) rotate(0deg);opacity:1}100%{transform:translateY(100vh) rotate(720deg);opacity:0}}
@keyframes wing-flap{0%,100%{transform:rotate(0deg)}50%{transform:rotate(-15deg)}}
@keyframes progress-fill{from{width:0}to{width:var(--w)}}

.float{animation:float 3s ease-in-out infinite}
.bob{animation:bob 2s ease-in-out infinite}
.fade-up{animation:fade-up 0.35s ease forwards}
.fade-in{animation:fade-in 0.25s ease forwards}
.slide-right{animation:slide-right 0.3s ease forwards}
.spin{animation:spin 1s linear infinite}
.badge-pop{animation:badge-pop 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards}
`;

/* ══════════════════════════════════════════════════════
   DESIGN TOKENS
══════════════════════════════════════════════════════ */
const D = {
  bg0:"#060D1A", bg1:"#0A1628", bg2:"#0F1F3D",
  glass:"rgba(255,255,255,0.04)", glassBorder:"rgba(255,255,255,0.08)",
  blue:"#3B82F6", blueG:"rgba(59,130,246,0.2)", blueD:"#1D4ED8",
  green:"#10B981", greenG:"rgba(16,185,129,0.2)",
  red:"#EF4444", redG:"rgba(239,68,68,0.2)",
  amber:"#F59E0B", amberG:"rgba(245,158,11,0.2)",
  purple:"#8B5CF6", purpleG:"rgba(139,92,246,0.2)",
  text:"#F1F5F9", muted:"#94A3B8", dim:"#475569",
  border:"rgba(255,255,255,0.07)",
};

/* ══════════════════════════════════════════════════════
   TRANSLATIONS
══════════════════════════════════════════════════════ */
const T = {
  en:{ appName:"Sri Farms", tagline:"Smart Farm Intelligence", gita:"You have a right to perform your prescribed duties, but never claim the fruits of your actions.", login:"Sign In", username:"Username", password:"Password", signout:"Sign Out", dashboard:"Dashboard", sheds:"Sheds", batches:"Batches", report:"Daily Report", alerts:"Alerts", weekly:"Weekly", aiPredict:"AI Predict", history:"History", cctv:"CCTV", photos:"Photos", team:"Team", liveBirds:"Live Birds", fcr:"FCR", avgWeight:"Avg Weight", mortality:"Mortality %", addShed:"Add Shed", addBatch:"Start Batch", submitReport:"Submit Report", morning:"Morning", evening:"Evening", save:"Save", cancel:"Cancel", close:"Close", critical:"Critical", warning:"Warning", info:"Info", ok:"OK", allSheds:"All Sheds", noAlerts:"All Clear!", markAllRead:"Mark All Read", unread:"Unread", read:"Read", loading:"Analysing…", analyze:"AI Analysis", reanalyze:"Re-Analyse", editedBy:"Edited by Farm Owner", readOnly:"Read Only", roles:{owner:"Farm Owner",supervisor:"Supervisor",manager:"Cluster Manager",worker:"Worker"} },
  te:{ appName:"శ్రీ ఫార్మ్స్", tagline:"స్మార్ట్ ఫార్మ్ ఇంటెలిజెన్స్", gita:"కర్మలు చేయుటకు నీకు హక్కు ఉన్నది, కానీ ఫలితాలను ఆశించకు.", login:"లాగిన్", username:"వినియోగదారు", password:"పాస్‌వర్డ్", signout:"లాగ్ అవుట్", dashboard:"డాష్‌బోర్డ్", sheds:"షెడ్లు", batches:"బ్యాచ్‌లు", report:"నివేదిక", alerts:"హెచ్చరికలు", weekly:"వారపు", aiPredict:"AI అంచనా", history:"చరిత్ర", cctv:"CCTV", photos:"ఫోటోలు", team:"బృందం", liveBirds:"జీవిత పక్షులు", fcr:"FCR", avgWeight:"సగటు బరువు", mortality:"మరణాల రేటు", addShed:"షెడ్ జోడించు", addBatch:"బ్యాచ్ ప్రారంభించు", submitReport:"సమర్పించు", morning:"ఉదయం", evening:"సాయంత్రం", save:"సేవ్", cancel:"రద్దు", close:"మూసివేయి", critical:"విమర్శాత్మక", warning:"హెచ్చరిక", info:"సమాచారం", ok:"సరే", allSheds:"అన్ని షెడ్లు", noAlerts:"సురక్షితంగా ఉంది!", markAllRead:"అన్నీ చదివారు", unread:"చదవని", read:"చదివిన", loading:"విశ్లేషిస్తోంది…", analyze:"AI విశ్లేషణ", reanalyze:"మళ్ళీ విశ్లేషించు", editedBy:"ఫార్మ్ యజమాని సవరించారు", readOnly:"చదవడానికి మాత్రమే", roles:{owner:"ఫార్మ్ యజమాని",supervisor:"సూపర్‌వైజర్",manager:"మేనేజర్",worker:"కార్మికుడు"} },
  hi:{ appName:"श्री फार्म्स", tagline:"स्मार्ट फार्म इंटेलिजेंस", gita:"कर्म करने का अधिकार तुम्हारा है, फल की इच्छा मत रखो।", login:"लॉग इन", username:"उपयोगकर्ता", password:"पासवर्ड", signout:"साइन आउट", dashboard:"डैशबोर्ड", sheds:"शेड", batches:"बैच", report:"दैनिक रिपोर्ट", alerts:"अलर्ट", weekly:"साप्ताहिक", aiPredict:"AI पूर्वानुमान", history:"इतिहास", cctv:"CCTV", photos:"फोटो", team:"टीम", liveBirds:"जीवित पक्षी", fcr:"FCR", avgWeight:"औसत वजन", mortality:"मृत्यु दर", addShed:"शेड जोड़ें", addBatch:"बैच शुरू", submitReport:"रिपोर्ट दर्ज", morning:"सुबह", evening:"शाम", save:"सहेजें", cancel:"रद्द", close:"बंद", critical:"गंभीर", warning:"चेतावनी", info:"जानकारी", ok:"ठीक है", allSheds:"सभी शेड", noAlerts:"सब ठीक है!", markAllRead:"सभी पढ़े", unread:"अपठित", read:"पढ़ा", loading:"विश्लेषण…", analyze:"AI विश्लेषण", reanalyze:"पुनः विश्लेषण", editedBy:"फार्म मालिक द्वारा संपादित", readOnly:"केवल पढ़ें", roles:{owner:"फार्म मालिक",supervisor:"सुपरवाइजर",manager:"मैनेजर",worker:"कर्मचारी"} },
  mai:{ appName:"श्री फार्म्स", tagline:"स्मार्ट फार्म इंटेलिजेंस", gita:"कर्म करबाक अधिकार अहाँक अछि, फलक इच्छा नहि राखू।", login:"लॉग इन", username:"उपयोगकर्ता", password:"पासवर्ड", signout:"साइन आउट", dashboard:"डैशबोर्ड", sheds:"शेड", batches:"बैच", report:"रिपोर्ट", alerts:"अलर्ट", weekly:"साप्ताहिक", aiPredict:"AI अनुमान", history:"इतिहास", cctv:"CCTV", photos:"फोटो", team:"टीम", liveBirds:"जीवित पक्षी", fcr:"FCR", avgWeight:"औसत वजन", mortality:"मृत्यु दर", addShed:"शेड जोड़ू", addBatch:"बैच शुरू", submitReport:"रिपोर्ट दर्ज", morning:"सकाल", evening:"सांझ", save:"सहेजू", cancel:"रद्द", close:"बंद", critical:"गंभीर", warning:"चेतावनी", info:"जानकारी", ok:"ठीक", allSheds:"सभ शेड", noAlerts:"सब ठीक अछि!", markAllRead:"सभ पढ़ल", unread:"अपठित", read:"पढ़ल", loading:"विश्लेषण…", analyze:"AI विश्लेषण", reanalyze:"फेर विश्लेषण", editedBy:"फार्म मालिक द्वारा", readOnly:"केवल पढ़बाक", roles:{owner:"फार्म मालिक",supervisor:"सुपरवाइजर",manager:"मैनेजर",worker:"कर्मचारी"} }
};

/* ══════════════════════════════════════════════════════
   AUTH & SEED DATA
══════════════════════════════════════════════════════ */
// Demo account emails — must be created in Supabase Auth (see SETUP.md)
const DEMO_ACCOUNTS = [
  {email:"owner@srifarms.in",  pass:"Farm@2025", name:"Farm Owner",  role:"owner",      icon:"👑",  lang:"te"},
  {email:"ravi@srifarms.in",   pass:"Shed@123",  name:"Ravi Kumar",  role:"supervisor", icon:"🧑\u200d🌾", lang:"en"},
  {email:"suresh@srifarms.in", pass:"Mgr@2025",  name:"Suresh Babu", role:"manager",    icon:"👔",  lang:"hi"},
  {email:"ram@srifarms.in",    pass:"Work@001",  name:"Ram Singh",   role:"worker",     icon:"👷",  lang:"mai"},
];

function batchDay(s){return Math.max(1,Math.floor((new Date()-new Date(s))/86400000)+1);}
function expectedWeight(d){return 40+d*62;}

/* ══════════════════════════════════════════════════════
   ANIMATED BROILER HEN SVG
══════════════════════════════════════════════════════ */
function HenLogo({size=52,animated=true}){
  return(
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={animated?{animation:"bob 2.5s ease-in-out infinite"}:{}}>
      {/* Body */}
      <ellipse cx="50" cy="62" rx="28" ry="22" fill="#F59E0B"/>
      <ellipse cx="50" cy="62" rx="28" ry="22" fill="url(#bodyGrad)"/>
      {/* Wing */}
      <ellipse cx="38" cy="65" rx="18" ry="12" fill="#D97706"
        style={animated?{transformOrigin:"38px 60px",animation:"wing-flap 1.8s ease-in-out infinite"}:{}}/>
      <ellipse cx="38" cy="65" rx="18" ry="12" fill="url(#wingGrad)"
        style={animated?{transformOrigin:"38px 60px",animation:"wing-flap 1.8s ease-in-out infinite"}:{}}/>
      {/* Tail feathers */}
      <ellipse cx="76" cy="55" rx="10" ry="6" fill="#92400E" transform="rotate(-30 76 55)"/>
      <ellipse cx="80" cy="60" rx="10" ry="5" fill="#B45309" transform="rotate(-15 80 60)"/>
      <ellipse cx="78" cy="66" rx="9" ry="5" fill="#D97706" transform="rotate(5 78 66)"/>
      {/* Neck */}
      <ellipse cx="34" cy="46" rx="11" ry="14" fill="#F59E0B"/>
      {/* Head */}
      <circle cx="28" cy="32" r="16" fill="#FBBF24"/>
      {/* Comb */}
      <ellipse cx="20" cy="16" rx="5" ry="7" fill="#EF4444"/>
      <ellipse cx="26" cy="14" rx="5" ry="8" fill="#EF4444"/>
      <ellipse cx="32" cy="15" rx="4" ry="6" fill="#EF4444"/>
      {/* Wattle */}
      <ellipse cx="18" cy="34" rx="5" ry="7" fill="#EF4444"
        style={animated?{transformOrigin:"18px 30px",animation:"wag 1.5s ease-in-out infinite"}:{}}/>
      <ellipse cx="22" cy="36" rx="4" ry="6" fill="#DC2626"
        style={animated?{transformOrigin:"22px 32px",animation:"wag 1.5s ease-in-out infinite 0.2s"}:{}}/>
      {/* Beak */}
      <path d="M14 29 L8 31 L14 34 Z" fill="#F97316"/>
      {/* Eye */}
      <circle cx="23" cy="27" r="4" fill="#1E293B"/>
      <circle cx="23" cy="27" r="4" fill="#1E293B"
        style={animated?{transformOrigin:"23px 27px",animation:"blink 4s ease-in-out infinite"}:{}}/>
      <circle cx="24" cy="26" r="1.5" fill="white"/>
      {/* Feet */}
      <line x1="38" y1="83" x2="34" y2="94" stroke="#F97316" strokeWidth="3" strokeLinecap="round"/>
      <line x1="34" y1="94" x2="28" y2="97" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="34" y1="94" x2="34" y2="99" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="34" y1="94" x2="40" y2="99" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="52" y1="83" x2="56" y2="94" stroke="#F97316" strokeWidth="3" strokeLinecap="round"/>
      <line x1="56" y1="94" x2="50" y2="99" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="56" y1="94" x2="56" y2="99" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="56" y1="94" x2="62" y2="99" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round"/>
      {/* Spots/texture */}
      <circle cx="55" cy="58" r="3" fill="rgba(217,119,6,0.5)"/>
      <circle cx="60" cy="65" r="2" fill="rgba(217,119,6,0.5)"/>
      <circle cx="48" cy="70" r="2.5" fill="rgba(217,119,6,0.4)"/>
      {/* Gloss */}
      <ellipse cx="21" cy="28" rx="8" ry="5" fill="rgba(255,255,255,0.2)" transform="rotate(-20 21 28)"/>
      <defs>
        <linearGradient id="bodyGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="rgba(255,255,255,0.15)"/>
          <stop offset="100%" stopColor="rgba(0,0,0,0.1)"/>
        </linearGradient>
        <linearGradient id="wingGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="rgba(255,255,255,0.1)"/>
          <stop offset="100%" stopColor="rgba(0,0,0,0.15)"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ══════════════════════════════════════════════════════
   BACKGROUND AMBIENT BLOBS
══════════════════════════════════════════════════════ */
function AmbientBg(){
  return(
    <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0,overflow:"hidden"}}>
      <div style={{position:"absolute",top:"-20%",left:"-10%",width:"60vw",height:"60vw",borderRadius:"50%",
        background:"radial-gradient(circle,rgba(59,130,246,0.07) 0%,transparent 70%)",
        animation:"blob-drift 18s ease-in-out infinite"}}/>
      <div style={{position:"absolute",bottom:"-20%",right:"-10%",width:"50vw",height:"50vw",borderRadius:"50%",
        background:"radial-gradient(circle,rgba(16,185,129,0.06) 0%,transparent 70%)",
        animation:"blob-drift 22s ease-in-out infinite reverse"}}/>
      <div style={{position:"absolute",top:"40%",left:"40%",width:"30vw",height:"30vw",borderRadius:"50%",
        background:"radial-gradient(circle,rgba(139,92,246,0.04) 0%,transparent 70%)",
        animation:"blob-drift 15s ease-in-out infinite 5s"}}/>
      {/* Grid overlay */}
      <div style={{position:"absolute",inset:0,backgroundImage:"linear-gradient(rgba(99,179,237,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(99,179,237,0.03) 1px,transparent 1px)",backgroundSize:"60px 60px"}}/>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   ANIMATED NUMBER
══════════════════════════════════════════════════════ */
function AnimNum({value,duration=600}){
  const [display,setDisplay]=useState(0);
  const target=parseFloat(String(value).replace(/,/g,""))||0;
  const isDecimal=String(value).includes(".")||String(value).includes("%");
  useEffect(()=>{
    let start=0,startTime=null;
    const step=ts=>{
      if(!startTime)startTime=ts;
      const p=Math.min((ts-startTime)/duration,1);
      const ease=1-Math.pow(1-p,3);
      const cur=start+(target-start)*ease;
      setDisplay(isDecimal?+cur.toFixed(2):Math.round(cur));
      if(p<1)requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  },[value]);
  return <span>{typeof display==="number"&&!isDecimal?display.toLocaleString("en-IN"):display}</span>;
}

/* ══════════════════════════════════════════════════════
   GLASS CARD
══════════════════════════════════════════════════════ */
function GCard({children,style={},glow,title,action,noPad}){
  const glowColor={blue:D.blue,green:D.green,red:D.red,amber:D.amber}[glow]||D.blue;
  return(
    <div style={{
      background:"rgba(255,255,255,0.035)",
      border:`1px solid ${D.glassBorder}`,
      borderRadius:18,
      padding:noPad?0:"22px 24px",
      backdropFilter:"blur(12px)",
      position:"relative",
      overflow:"hidden",
      boxShadow:glow?`0 0 30px ${glowColor}15,inset 0 1px 0 rgba(255,255,255,0.07)`:"inset 0 1px 0 rgba(255,255,255,0.05)",
      transition:"transform 0.2s,box-shadow 0.2s",
      ...style
    }}
    onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-1px)";e.currentTarget.style.boxShadow=glow?`0 8px 40px ${glowColor}25,inset 0 1px 0 rgba(255,255,255,0.08)`:"0 8px 30px rgba(0,0,0,0.3),inset 0 1px 0 rgba(255,255,255,0.07)";}}
    onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow=glow?`0 0 30px ${glowColor}15,inset 0 1px 0 rgba(255,255,255,0.07)`:"inset 0 1px 0 rgba(255,255,255,0.05)";}}>
      {glow&&<div style={{position:"absolute",top:0,left:0,right:0,height:1,background:`linear-gradient(90deg,transparent,${glowColor}60,transparent)`}}/>}
      {(title||action)&&<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
        <span style={{fontSize:13,fontWeight:700,color:D.muted,textTransform:"uppercase",letterSpacing:"0.06em"}}>{title}</span>
        {action}
      </div>}
      {children}
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   KPI STAT CARD
══════════════════════════════════════════════════════ */
function StatCard({label,value,unit,sub,icon:Icon,color="blue",delta,trend}){
  const colors={blue:{a:D.blue,g:D.blueG,t:"#93C5FD"},green:{a:D.green,g:D.greenG,t:"#6EE7B7"},red:{a:D.red,g:D.redG,t:"#FCA5A5"},amber:{a:D.amber,g:D.amberG,t:"#FCD34D"},purple:{a:D.purple,g:D.purpleG,t:"#C4B5FD"}};
  const col=colors[color]||colors.blue;
  return(
    <div style={{background:"rgba(255,255,255,0.03)",border:`1px solid ${D.glassBorder}`,borderRadius:18,padding:"20px 22px",position:"relative",overflow:"hidden",cursor:"default",transition:"all 0.2s"}}
      onMouseEnter={e=>{e.currentTarget.style.background="rgba(255,255,255,0.06)";e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow=`0 12px 40px ${col.a}20`;}}
      onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,0.03)";e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="";}}>
      {/* Glow orb */}
      <div style={{position:"absolute",top:-20,right:-20,width:100,height:100,borderRadius:"50%",background:col.g,filter:"blur(25px)"}}/>
      <div style={{position:"absolute",top:0,right:0,bottom:0,left:0,background:`linear-gradient(135deg,${col.a}04 0%,transparent 60%)`}}/>
      <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,transparent,${col.a}80,transparent)`}}/>
      <div style={{position:"relative",zIndex:1}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
          <span style={{fontSize:12,fontWeight:600,color:D.muted,textTransform:"uppercase",letterSpacing:"0.07em"}}>{label}</span>
          {Icon&&<div style={{width:36,height:36,borderRadius:10,background:col.g,border:`1px solid ${col.a}30`,display:"grid",placeItems:"center"}}><Icon size={16} color={col.a}/></div>}
        </div>
        <div style={{display:"flex",alignItems:"baseline",gap:6,marginBottom:8}}>
          <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:30,fontWeight:700,color:col.t,letterSpacing:"-0.03em"}}>
            <AnimNum value={value}/>
          </span>
          {unit&&<span style={{fontSize:14,color:D.muted}}>{unit}</span>}
        </div>
        {(delta!==undefined||sub)&&<div style={{display:"flex",alignItems:"center",gap:6,fontSize:12}}>
          {delta!==undefined&&(delta>=0
            ?<><TrendingUp size={12} color={D.green}/><span style={{color:D.green,fontWeight:600}}>+{Math.abs(delta)}%</span></>
            :<><TrendingDown size={12} color={D.red}/><span style={{color:D.red,fontWeight:600}}>{delta}%</span></>)}
          {sub&&<span style={{color:D.muted}}>{sub}</span>}
        </div>}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   PILL / BADGE
══════════════════════════════════════════════════════ */
function Pill({label,color="blue",size="sm"}){
  const map={critical:{bg:"rgba(239,68,68,0.15)",text:"#FCA5A5",border:"rgba(239,68,68,0.3)"},warning:{bg:"rgba(245,158,11,0.15)",text:"#FCD34D",border:"rgba(245,158,11,0.3)"},info:{bg:"rgba(59,130,246,0.15)",text:"#93C5FD",border:"rgba(59,130,246,0.3)"},ok:{bg:"rgba(16,185,129,0.15)",text:"#6EE7B7",border:"rgba(16,185,129,0.3)"},active:{bg:"rgba(16,185,129,0.15)",text:"#6EE7B7",border:"rgba(16,185,129,0.3)"},closed:{bg:"rgba(100,116,139,0.15)",text:"#94A3B8",border:"rgba(100,116,139,0.3)"},blue:{bg:"rgba(59,130,246,0.15)",text:"#93C5FD",border:"rgba(59,130,246,0.3)"}};
  const s=map[color]||map.blue;
  return <span style={{background:s.bg,color:s.text,border:`1px solid ${s.border}`,fontSize:size==="xs"?10:11,fontWeight:700,padding:size==="xs"?"2px 7px":"3px 10px",borderRadius:99,letterSpacing:"0.04em",textTransform:"uppercase",whiteSpace:"nowrap"}}>{label}</span>;
}

/* ══════════════════════════════════════════════════════
   BUTTON
══════════════════════════════════════════════════════ */
function Btn({children,onClick,variant="primary",size="md",disabled,style={},icon:Icon,loading}){
  const v={
    primary:{bg:`linear-gradient(135deg,${D.blue},${D.blueD})`,text:"#fff",border:"transparent",shadow:`0 4px 15px ${D.blue}40`},
    success:{bg:`linear-gradient(135deg,${D.green},#059669)`,text:"#fff",border:"transparent",shadow:`0 4px 15px ${D.green}40`},
    danger:{bg:`linear-gradient(135deg,${D.red},#DC2626)`,text:"#fff",border:"transparent",shadow:`0 4px 15px ${D.red}40`},
    outline:{bg:"rgba(255,255,255,0.06)",text:D.text,border:D.glassBorder,shadow:"none"},
    ghost:{bg:"transparent",text:D.muted,border:"transparent",shadow:"none"},
    amber:{bg:`linear-gradient(135deg,${D.amber},#D97706)`,text:"#fff",border:"transparent",shadow:`0 4px 15px ${D.amber}40`},
  };
  const s=v[variant]||v.primary;
  const p=size==="sm"?"6px 14px":size==="lg"?"14px 28px":"10px 20px";
  const fs=size==="sm"?12:size==="lg"?15:13;
  return <button onClick={onClick} disabled={disabled||loading} style={{background:s.bg,color:s.text,border:`1px solid ${s.border}`,borderRadius:10,padding:p,fontSize:fs,fontWeight:600,cursor:(disabled||loading)?"not-allowed":"pointer",opacity:(disabled||loading)?0.5:1,display:"inline-flex",alignItems:"center",gap:7,fontFamily:"'DM Sans',sans-serif",transition:"all 0.18s",boxShadow:s.shadow,letterSpacing:"0.01em",...style}}
    onMouseEnter={e=>{if(!disabled&&!loading){e.currentTarget.style.filter="brightness(1.15)";e.currentTarget.style.transform="scale(1.02)";e.currentTarget.style.boxShadow=s.shadow.replace("40","70");}}}
    onMouseLeave={e=>{e.currentTarget.style.filter="";e.currentTarget.style.transform="";e.currentTarget.style.boxShadow=s.shadow;}}>
    {loading?<div className="spin" style={{width:14,height:14,border:`2px solid rgba(255,255,255,0.3)`,borderTopColor:"#fff",borderRadius:"50%"}}/>:Icon&&<Icon size={size==="sm"?13:15}/>}
    {children}
  </button>;
}

/* ══════════════════════════════════════════════════════
   INPUT FIELD
══════════════════════════════════════════════════════ */
function FInput({label,value,onChange,type="text",placeholder,required,readOnly,unit,warn,style={}}){
  const [focus,setFocus]=useState(false);
  const borderCol=warn==="critical"?D.red:warn==="warning"?D.amber:focus?"rgba(59,130,246,0.7)":"rgba(255,255,255,0.1)";
  return <div style={{display:"flex",flexDirection:"column",gap:6,...style}}>
    {label&&<label style={{fontSize:11,fontWeight:700,color:D.muted,textTransform:"uppercase",letterSpacing:"0.07em"}}>{label}{required&&<span style={{color:D.red}}> *</span>}</label>}
    <div style={{position:"relative"}}>
      <input type={type} value={value} onChange={e=>onChange&&onChange(e.target.value)} placeholder={placeholder} readOnly={readOnly} onFocus={()=>setFocus(true)} onBlur={()=>setFocus(false)}
        style={{width:"100%",padding:unit?"10px 44px 10px 14px":"10px 14px",borderRadius:10,border:`1.5px solid ${borderCol}`,fontSize:14,color:readOnly?"#64748B":D.text,background:readOnly?"rgba(255,255,255,0.02)":"rgba(255,255,255,0.05)",fontFamily:"'DM Sans',sans-serif",outline:"none",transition:"border-color 0.18s, background 0.18s",backdropFilter:"blur(4px)"}}/>
      {unit&&<span style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",fontSize:12,color:D.muted,fontWeight:500}}>{unit}</span>}
    </div>
  </div>;
}

function FSelect({label,value,onChange,options,required}){
  return <div style={{display:"flex",flexDirection:"column",gap:6}}>
    {label&&<label style={{fontSize:11,fontWeight:700,color:D.muted,textTransform:"uppercase",letterSpacing:"0.07em"}}>{label}{required&&<span style={{color:D.red}}> *</span>}</label>}
    <select value={value} onChange={e=>onChange(e.target.value)} style={{padding:"10px 14px",borderRadius:10,border:"1.5px solid rgba(255,255,255,0.1)",fontSize:14,color:D.text,background:"rgba(255,255,255,0.05)",fontFamily:"'DM Sans',sans-serif",outline:"none",cursor:"pointer",backdropFilter:"blur(4px)"}}>
      {options.map(o=>typeof o==="string"?<option key={o} value={o} style={{background:"#0F1F3D"}}>{o}</option>:<option key={o.value} value={o.value} style={{background:"#0F1F3D"}}>{o.label}</option>)}
    </select>
  </div>;
}

/* ══════════════════════════════════════════════════════
   MODAL
══════════════════════════════════════════════════════ */
function Modal({title,children,onClose,width=560}){
  return <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",zIndex:1000,display:"grid",placeItems:"center",padding:20,backdropFilter:"blur(8px)"}} onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
    <div className="fade-up" style={{background:"#0F1F3D",border:`1px solid ${D.glassBorder}`,borderRadius:22,width:"100%",maxWidth:width,maxHeight:"90vh",overflow:"auto",padding:30,boxShadow:"0 25px 80px rgba(0,0,0,0.5)"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
        <h3 style={{fontSize:18,fontWeight:700,color:D.text,fontFamily:"'Syne',sans-serif"}}>{title}</h3>
        <button onClick={onClose} style={{background:"rgba(255,255,255,0.08)",border:"none",cursor:"pointer",color:D.muted,padding:8,borderRadius:8,display:"grid",placeItems:"center"}}><X size={18}/></button>
      </div>
      {children}
    </div>
  </div>;
}

/* ══════════════════════════════════════════════════════
   TOAST
══════════════════════════════════════════════════════ */
function Toast({message,type="success",onClose}){
  useEffect(()=>{const t=setTimeout(onClose,3500);return()=>clearTimeout(t);},[]);
  const isErr=type==="error";
  return <div className="fade-up" style={{position:"fixed",bottom:28,right:28,zIndex:2000,background:isErr?"rgba(239,68,68,0.95)":"rgba(16,185,129,0.95)",backdropFilter:"blur(12px)",color:"#fff",borderRadius:14,padding:"14px 20px",fontSize:14,fontWeight:600,display:"flex",alignItems:"center",gap:10,boxShadow:`0 12px 40px ${isErr?D.red:D.green}40`,border:`1px solid ${isErr?"rgba(239,68,68,0.5)":"rgba(16,185,129,0.5)"}`}}>
    {isErr?<AlertCircle size={18}/>:<CheckCircle size={18}/>}{message}
  </div>;
}

/* ══════════════════════════════════════════════════════
   CONFETTI
══════════════════════════════════════════════════════ */
function Confetti({active}){
  if(!active)return null;
  const pieces=Array.from({length:30},(_,i)=>({id:i,left:Math.random()*100,color:["#3B82F6","#10B981","#F59E0B","#EF4444","#8B5CF6"][i%5],size:6+Math.random()*8,delay:Math.random()*1.5}));
  return <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:9999}}>
    {pieces.map(p=><div key={p.id} style={{position:"absolute",left:`${p.left}%`,top:-10,width:p.size,height:p.size,background:p.color,borderRadius:2,animation:`confetti-fall ${1.5+Math.random()}s ease-in ${p.delay}s forwards`}}/>)}
  </div>;
}

/* ══════════════════════════════════════════════════════
   LIVE TICKER
══════════════════════════════════════════════════════ */
function LiveTicker({reports,sheds}){
  const latest=sheds.map(s=>{const r=reports.filter(x=>x.shed===s.id).sort((a,b)=>b.id-a.id)[0];return r?`${s.name}: ${r.birds.toLocaleString()} birds · ${r.weight}g · ${r.temp}°C`:null;}).filter(Boolean);
  if(!latest.length)return null;
  const text=latest.join("   ·   ");
  return <div style={{background:"rgba(59,130,246,0.08)",borderBottom:`1px solid rgba(59,130,246,0.15)`,padding:"5px 0",overflow:"hidden",position:"relative"}}>
    <div style={{display:"flex",gap:0,width:"max-content",animation:"ticker 30s linear infinite"}}>
      {[text,text].map((t,i)=><div key={i} style={{whiteSpace:"nowrap",padding:"0 40px",fontSize:12,color:"#93C5FD",fontFamily:"'JetBrains Mono',monospace"}}>
        <span style={{color:D.green,marginRight:12}}>●</span>{t}<span style={{color:D.green,margin:"0 12px"}}>●</span>{t}
      </div>)}
    </div>
  </div>;
}

/* ══════════════════════════════════════════════════════
   SIDEBAR
══════════════════════════════════════════════════════ */
const NAV=[
  {id:"dashboard",icon:LayoutDashboard,role:["owner","supervisor","manager","worker"]},
  {id:"sheds",icon:Building2,role:["owner","supervisor","manager","worker"]},
  {id:"batches",icon:Package,role:["owner","supervisor","manager","worker"]},
  {id:"report",icon:ClipboardList,role:["owner","supervisor","manager","worker"]},
  {id:"alerts",icon:Bell,role:["owner","supervisor","manager","worker"]},
  {id:"weekly",icon:CalendarDays,role:["owner","supervisor","manager","worker"]},
  {id:"aiPredict",icon:Cpu,role:["owner","supervisor"]},
  {id:"history",icon:History,role:["owner","supervisor"]},
  {id:"cctv",icon:Video,role:["owner","supervisor"]},
  {id:"photos",icon:ImageIcon,role:["owner","supervisor","manager","worker"]},
  {id:"team",icon:Users2,role:["owner"]},
];

function Sidebar({tab,setTab,user,lang,setLang,alerts,onSignOut}){
  const t=T[lang];
  const unread=alerts.filter(a=>!a.read).length;
  const navItems=NAV.filter(n=>n.role.includes(user.role));
  return(
    <div style={{width:240,minHeight:"100vh",background:"rgba(6,13,26,0.95)",backdropFilter:"blur(20px)",display:"flex",flexDirection:"column",position:"fixed",left:0,top:0,bottom:0,zIndex:100,borderRight:`1px solid ${D.glassBorder}`}}>
      {/* Logo section */}
      <div style={{padding:"24px 20px 18px",borderBottom:`1px solid ${D.glassBorder}`,display:"flex",alignItems:"center",gap:14}}>
        <div style={{position:"relative"}}>
          <HenLogo size={52} animated={true}/>
          <div style={{position:"absolute",bottom:-2,right:-2,width:14,height:14,borderRadius:"50%",background:D.green,border:"2px solid #060D1A",animation:"pulse-ring 2s ease-out infinite"}}/>
          <div style={{position:"absolute",bottom:-2,right:-2,width:14,height:14,borderRadius:"50%",background:D.green,border:"2px solid #060D1A"}}/>
        </div>
        <div>
          <div style={{fontFamily:"'Syne',sans-serif",fontSize:18,fontWeight:800,color:"#fff",letterSpacing:"-0.02em"}}>{t.appName}</div>
          <div style={{fontSize:10,color:"#4ADE80",fontWeight:600,letterSpacing:"0.04em",textTransform:"uppercase"}}>{t.tagline}</div>
        </div>
      </div>

      {/* User card */}
      <div style={{margin:"14px 14px 6px",padding:"12px 14px",background:"rgba(59,130,246,0.08)",borderRadius:12,border:"1px solid rgba(59,130,246,0.15)"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:36,height:36,borderRadius:10,background:"rgba(255,255,255,0.07)",display:"grid",placeItems:"center",fontSize:18}}>{user.icon}</div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:13,fontWeight:700,color:"#fff",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{user.name}</div>
            <div style={{fontSize:11,color:"#93C5FD"}}>{t.roles[user.role]}</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{flex:1,padding:"8px 10px",overflowY:"auto",display:"flex",flexDirection:"column",gap:2}}>
        {navItems.map(n=>{
          const active=tab===n.id;
          const Icon=n.icon;
          const label=t[n.id]||n.id;
          const showBadge=n.id==="alerts"&&unread>0;
          return <button key={n.id} onClick={()=>setTab(n.id)} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 12px",borderRadius:10,border:"none",cursor:"pointer",width:"100%",textAlign:"left",background:active?"rgba(59,130,246,0.15)":"transparent",position:"relative",transition:"background 0.15s"}}>
            {active&&<div style={{position:"absolute",left:0,top:"15%",bottom:"15%",width:3,background:D.blue,borderRadius:"0 3px 3px 0",boxShadow:`0 0 10px ${D.blue}`}}/>}
            <div style={{width:32,height:32,borderRadius:8,background:active?"rgba(59,130,246,0.2)":"rgba(255,255,255,0.04)",display:"grid",placeItems:"center",transition:"all 0.15s",flexShrink:0}}>
              <Icon size={16} color={active?"#93C5FD":"#64748B"}/>
            </div>
            <span style={{fontSize:13,fontWeight:active?700:500,color:active?"#E2E8F0":"#64748B",flex:1}}>{label}</span>
            {showBadge&&<span className="badge-pop" style={{background:D.red,color:"#fff",borderRadius:99,fontSize:10,fontWeight:700,padding:"2px 7px",minWidth:20,textAlign:"center",boxShadow:`0 0 8px ${D.red}`}}>{unread}</span>}
          </button>;
        })}
      </nav>

      {/* Lang + signout */}
      <div style={{padding:"14px 14px 20px",borderTop:`1px solid ${D.glassBorder}`}}>
        <div style={{display:"flex",gap:4,marginBottom:10}}>
          {[["en","EN"],["te","తె"],["hi","हि"],["mai","म"]].map(([l,lbl])=>(
            <button key={l} onClick={()=>setLang(l)} style={{flex:1,padding:"5px 0",borderRadius:7,fontSize:11,fontWeight:700,cursor:"pointer",border:`1px solid ${lang===l?"rgba(59,130,246,0.5)":"rgba(255,255,255,0.08)"}`,background:lang===l?"rgba(59,130,246,0.2)":"transparent",color:lang===l?"#93C5FD":"#475569",transition:"all 0.15s"}}>{lbl}</button>
          ))}
        </div>
        <button onClick={onSignOut} style={{width:"100%",padding:"9px",borderRadius:10,border:"1px solid rgba(255,255,255,0.08)",background:"rgba(255,255,255,0.04)",cursor:"pointer",color:"#64748B",fontSize:13,fontWeight:600,display:"flex",alignItems:"center",justifyContent:"center",gap:7,fontFamily:"'DM Sans',sans-serif"}}>
          <LogOut size={14}/>{t.signout}
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   TOPBAR
══════════════════════════════════════════════════════ */
function TopBar({user,tab,lang,alerts}){
  const t=T[lang];
  const [clock,setClock]=useState(new Date());
  useEffect(()=>{const x=setInterval(()=>setClock(new Date()),1000);return()=>clearInterval(x);},[]);
  const unread=alerts.filter(a=>!a.read).length;
  const time=clock.toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit",second:"2-digit"});
  const date=clock.toLocaleDateString("en-IN",{weekday:"short",day:"numeric",month:"short",year:"numeric"});
  return(
    <div style={{background:"rgba(6,13,26,0.8)",backdropFilter:"blur(20px)",borderBottom:`1px solid ${D.glassBorder}`,padding:"0 28px",height:64,display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:50}}>
      <div>
        <h1 style={{fontFamily:"'Syne',sans-serif",fontSize:20,fontWeight:800,color:"#fff",letterSpacing:"-0.02em"}}>{t[tab]||tab}</h1>
        <p style={{fontSize:11,color:D.muted}}>Sri Farms · Chittoor District, Andhra Pradesh</p>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:12}}>
        {/* Live indicator */}
        <div style={{display:"flex",alignItems:"center",gap:8,padding:"6px 14px",background:"rgba(16,185,129,0.1)",borderRadius:99,border:"1px solid rgba(16,185,129,0.25)"}}>
          <div style={{width:7,height:7,borderRadius:"50%",background:D.green,boxShadow:`0 0 8px ${D.green}`,animation:"pulse-ring 1.8s ease-out infinite"}}/>
          <span style={{fontSize:12,fontWeight:700,color:"#6EE7B7",fontFamily:"'JetBrains Mono',monospace"}}>{time}</span>
        </div>
        <div style={{fontSize:12,color:D.muted,display:"flex",alignItems:"center",gap:5}}>
          <CalendarDays size={13}/>{date}
        </div>
        {unread>0&&(
          <div style={{display:"flex",alignItems:"center",gap:5,padding:"5px 12px",background:D.redG,borderRadius:99,border:`1px solid ${D.red}40`}}>
            <Bell size={13} color={D.red}/><span style={{fontSize:12,fontWeight:700,color:D.red}}>{unread} alert{unread>1?"s":""}</span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   GITA STRIP
══════════════════════════════════════════════════════ */
function GitaStrip({lang}){
  const t=T[lang];
  return <div style={{background:"rgba(139,92,246,0.08)",borderBottom:"1px solid rgba(139,92,246,0.15)",padding:"7px 28px",display:"flex",alignItems:"center",gap:10}}>
    <BookOpen size={13} color="#C4B5FD"/>
    <p style={{fontSize:12,color:"#A78BFA",fontStyle:"italic",overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis"}}>{t.gita}</p>
    <span style={{fontSize:11,color:"rgba(167,139,250,0.6)",whiteSpace:"nowrap",fontWeight:600}}>— BG 2.47</span>
  </div>;
}

/* ══════════════════════════════════════════════════════
   BUILD CHART DATA
══════════════════════════════════════════════════════ */
function buildWeightChart(reports,shedId){
  const f=shedId==="all"?reports:reports.filter(r=>r.shed===shedId);
  const m={};f.forEach(r=>{if(!m[r.day]||r.weight>m[r.day])m[r.day]=r.weight;});
  return Object.entries(m).sort((a,b)=>+a[0]-+b[0]).slice(-10).map(([d,w])=>({day:"D"+d,actual:w,expected:expectedWeight(+d)}));
}
function buildFeedChart(reports,shedId){
  const f=shedId==="all"?reports:reports.filter(r=>r.shed===shedId);
  const m={};f.forEach(r=>{m[r.date]=(m[r.date]||0)+r.feed;});
  return Object.entries(m).sort((a,b)=>a[0]>b[0]?1:-1).slice(-8).map(([d,f])=>({date:d.slice(5),feed:f}));
}

/* ══════════════════════════════════════════════════════
   CUSTOM CHART TOOLTIP
══════════════════════════════════════════════════════ */
function ChartTip({active,payload,label}){
  if(!active||!payload?.length)return null;
  return <div style={{background:"rgba(15,31,61,0.95)",border:`1px solid ${D.glassBorder}`,borderRadius:10,padding:"10px 14px",fontSize:12,backdropFilter:"blur(12px)"}}>
    <p style={{color:D.muted,marginBottom:6,fontWeight:600}}>{label}</p>
    {payload.map((p,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:6,color:p.color||D.text}}>
      <div style={{width:8,height:8,borderRadius:"50%",background:p.color}}/>
      <span>{p.name}: </span><strong>{p.value?.toLocaleString()}{p.name?.includes("Weight")?"g":p.name?.includes("Feed")?"kg":""}</strong>
    </div>)}
  </div>;
}

/* ══════════════════════════════════════════════════════
   DASHBOARD
══════════════════════════════════════════════════════ */
function DashboardTab({reports,sheds,batches,alerts,lang}){
  const t=T[lang];
  const [filter,setFilter]=useState("all");
  const activeSheds=sheds.filter(s=>s.active);
  const latestReports=(()=>{const m={};reports.forEach(r=>{if(!m[r.shed]||r.id>m[r.shed].id)m[r.shed]=r;});return Object.values(m);})();
  const filtered=filter==="all"?latestReports:latestReports.filter(r=>r.shed===filter);
  const totalBirds=filtered.reduce((s,r)=>s+r.birds,0);
  const avgWeight=filtered.length?Math.round(filtered.reduce((s,r)=>s+r.weight,0)/filtered.length):0;
  const totalMort=filtered.reduce((s,r)=>s+r.mortality,0);
  const mortPct=filtered.reduce((s,r)=>s+r.birds+r.mortality,0);
  const mortRate=mortPct?((totalMort/mortPct)*100).toFixed(2):"0.00";
  const avgFCR=filtered.length?(filtered.reduce((s,r)=>s+(r.feed/(r.birds*r.weight/1000)),0)/filtered.length).toFixed(2):"0.00";
  const weightData=buildWeightChart(reports,filter);
  const feedData=buildFeedChart(reports,filter);
  const recentAlerts=alerts.slice(0,4);

  return <div className="fade-up">
    {/* Filter pills */}
    <div style={{display:"flex",gap:8,marginBottom:24,flexWrap:"wrap"}}>
      {[{id:"all",label:t.allSheds},...activeSheds.map(s=>({id:s.id,label:s.name}))].map(f=>(
        <button key={f.id} onClick={()=>setFilter(f.id)} style={{padding:"7px 18px",borderRadius:99,border:`1.5px solid ${filter===f.id?D.blue:"rgba(255,255,255,0.1)"}`,background:filter===f.id?"rgba(59,130,246,0.2)":"rgba(255,255,255,0.04)",color:filter===f.id?"#93C5FD":"#94A3B8",fontSize:13,fontWeight:600,cursor:"pointer",transition:"all 0.15s",backdropFilter:"blur(4px)"}}>{f.label}</button>
      ))}
    </div>

    {/* KPI row */}
    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,marginBottom:24}}>
      <StatCard label={t.liveBirds} value={totalBirds} icon={Bird} color="blue" delta={-1.2} sub="vs last batch"/>
      <StatCard label={t.fcr} value={avgFCR} icon={Activity} color={+avgFCR>2?"red":+avgFCR>1.75?"amber":"green"} delta={2.1} sub="feed conv. ratio"/>
      <StatCard label={t.avgWeight} value={avgWeight} unit="g" icon={Scale} color={avgWeight<expectedWeight(20)*0.88?"red":"green"} delta={1.8} sub="body weight"/>
      <StatCard label={t.mortality} value={mortRate} unit="%" icon={AlertTriangle} color={+mortRate>5?"red":+mortRate>3?"amber":"green"} delta={-0.5} sub="death rate"/>
    </div>

    {/* Charts */}
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:24}}>
      <GCard title="Weight Growth" action={<Pill label="Last 10 Days" color="blue"/>}>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={weightData} margin={{top:5,right:10,bottom:0,left:0}}>
            <defs>
              <linearGradient id="wg1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.3}/>
                <stop offset="100%" stopColor="#3B82F6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="wg2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10B981" stopOpacity={0.2}/>
                <stop offset="100%" stopColor="#10B981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false}/>
            <XAxis dataKey="day" tick={{fontSize:11,fill:"#64748B"}} axisLine={false} tickLine={false}/>
            <YAxis tick={{fontSize:11,fill:"#64748B"}} axisLine={false} tickLine={false} width={45}/>
            <Tooltip content={<ChartTip/>}/>
            <Area type="monotone" dataKey="actual" name="Actual Weight" stroke="#3B82F6" fill="url(#wg1)" strokeWidth={2.5} dot={false}/>
            <Area type="monotone" dataKey="expected" name="Expected Weight" stroke="#10B981" fill="url(#wg2)" strokeWidth={2} strokeDasharray="4 4" dot={false}/>
          </AreaChart>
        </ResponsiveContainer>
      </GCard>

      <GCard title="Feed Consumption" action={<Pill label="Daily kg" color="blue"/>}>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={feedData} margin={{top:5,right:10,bottom:0,left:0}}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false}/>
            <XAxis dataKey="date" tick={{fontSize:11,fill:"#64748B"}} axisLine={false} tickLine={false}/>
            <YAxis tick={{fontSize:11,fill:"#64748B"}} axisLine={false} tickLine={false} width={50}/>
            <Tooltip content={<ChartTip/>}/>
            <Bar dataKey="feed" name="Feed" fill="#3B82F6" radius={[5,5,0,0]} opacity={0.8}/>
          </BarChart>
        </ResponsiveContainer>
      </GCard>
    </div>

    {/* Shed table + alerts */}
    <div style={{display:"grid",gridTemplateColumns:"1.5fr 1fr",gap:16}}>
      <GCard title="Per-Shed Status">
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead>
            <tr style={{borderBottom:`1px solid ${D.glassBorder}`}}>
              {["Shed","Day","Birds","Weight","Mort.","Temp","FCR"].map(h=><th key={h} style={{padding:"8px 10px",textAlign:"left",color:D.muted,fontWeight:700,fontSize:11,textTransform:"uppercase",letterSpacing:"0.06em"}}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {activeSheds.map(shed=>{
              const rep=latestReports.find(r=>r.shed===shed.id);
              const bat=batches.find(b=>b.shed===shed.id&&b.status==="active");
              const day=bat?batchDay(bat.startDate):"—";
              if(!rep)return null;
              const fcr=(rep.feed/(rep.birds*rep.weight/1000)).toFixed(2);
              const tC=rep.temp>32?D.red:rep.temp>30?D.amber:D.green;
              const mC=rep.mortality>40?D.red:rep.mortality>28?D.amber:D.green;
              return <tr key={shed.id} style={{borderBottom:`1px solid rgba(255,255,255,0.04)`,transition:"background 0.12s"}}
                onMouseEnter={e=>e.currentTarget.style.background="rgba(59,130,246,0.06)"}
                onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <td style={{padding:"11px 10px",fontWeight:700,color:"#fff"}}>{shed.name}</td>
                <td style={{padding:"11px 10px",color:D.muted,fontFamily:"'JetBrains Mono',monospace",fontSize:12}}>{day}</td>
                <td style={{padding:"11px 10px",fontFamily:"'JetBrains Mono',monospace",fontSize:12}}>{rep.birds.toLocaleString()}</td>
                <td style={{padding:"11px 10px",fontFamily:"'JetBrains Mono',monospace",fontSize:12}}>{rep.weight}g</td>
                <td style={{padding:"11px 10px",fontWeight:700,color:mC}}>{rep.mortality}</td>
                <td style={{padding:"11px 10px",fontWeight:700,color:tC}}>{rep.temp}°C</td>
                <td style={{padding:"11px 10px",fontFamily:"'JetBrains Mono',monospace",fontSize:12,fontWeight:700,color:+fcr>2?D.red:+fcr>1.75?D.amber:D.green}}>{fcr}</td>
              </tr>;
            })}
          </tbody>
        </table>
      </GCard>

      <GCard title="Live Alerts" action={<Pill label={`${recentAlerts.filter(a=>!a.read).length} New`} color={recentAlerts.filter(a=>!a.read).length>0?"critical":"ok"}/>} glow={recentAlerts.some(a=>!a.read&&a.type==="critical")?"red":undefined}>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {recentAlerts.length===0&&<p style={{fontSize:13,color:D.muted,textAlign:"center",padding:"20px 0"}}>{t.noAlerts}</p>}
          {recentAlerts.map(a=>{
            const bg={critical:"rgba(239,68,68,0.1)",warning:"rgba(245,158,11,0.1)",info:"rgba(59,130,246,0.1)",ok:"rgba(16,185,129,0.1)"}[a.type];
            const bc={critical:D.red,warning:D.amber,info:D.blue,ok:D.green}[a.type];
            const ic={critical:<AlertCircle size={14} color={D.red}/>,warning:<AlertTriangle size={14} color={D.amber}/>,info:<Info size={14} color={D.blue}/>,ok:<CheckCircle size={14} color={D.green}/>};
            return <div key={a.id} style={{background:bg,borderRadius:10,padding:"10px 12px",border:`1px solid ${bc}22`,opacity:a.read?0.55:1,animation:!a.read&&a.type==="critical"?"alert-flash 2s ease-in-out infinite":"none"}}>
              <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:2}}>
                {ic[a.type]}<span style={{fontSize:13,fontWeight:700,color:"#fff"}}>{a.title}</span>
                {!a.read&&<div style={{marginLeft:"auto",width:7,height:7,borderRadius:"50%",background:D.red,flexShrink:0,boxShadow:`0 0 6px ${D.red}`}}/>}
              </div>
              <p style={{fontSize:11,color:D.muted}}>{a.desc}</p>
            </div>;
          })}
        </div>
      </GCard>
    </div>
  </div>;
}

/* ══════════════════════════════════════════════════════
   SHEDS TAB
══════════════════════════════════════════════════════ */
function ShedsTab({sheds,setSheds,user,lang,batches}){
  const t=T[lang];
  const [showAdd,setShowAdd]=useState(false);
  const [editShed,setEditShed]=useState(null);
  const blank={name:"",location:"",district:"Chittoor",state:"Andhra Pradesh",gps:"",supervisor:"",supervisorPhone:"",manager:"",managerPhone:"",capacity:20000,area:"",notes:"",active:true};
  const [form,setForm]=useState(blank);
  const canEdit=user.role==="owner";

  const save=async()=>{
    if(!form.name||!form.location||!form.supervisor)return;
    const updated=editShed?sheds.map(s=>s.id===editShed.id?{...s,...form}:s):[...sheds,{...form,id:"shed_"+Date.now(),createdAt:new Date().toISOString().split("T")[0]}];
    setSheds(updated);await DB.upsertShed(updated.find(s=>s.id===(editShed?.id||"new"))||updated[updated.length-1]);setShowAdd(false);setEditShed(null);setForm(blank);
  };
  const deactivate=async(id)=>{const u=sheds.map(s=>s.id===id?{...s,active:false}:s);setSheds(u);await DB.upsertShed({...sheds.find(s=>s.id===id),active:false});};

  return <div className="fade-up">
    {canEdit&&<div style={{marginBottom:22,display:"flex",justifyContent:"flex-end"}}><Btn icon={Plus} onClick={()=>{setForm(blank);setShowAdd(true);}}>{t.addShed}</Btn></div>}
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))",gap:16}}>
      {sheds.map(shed=>{
        const bat=batches.find(b=>b.shed===shed.id&&b.status==="active");
        const day=bat?batchDay(bat.startDate):null;
        const pct=day?Math.min((day/42)*100,100):0;
        return <GCard key={shed.id} noPad style={{opacity:shed.active?1:0.5}}>
          {/* Shed card header */}
          <div style={{padding:"18px 22px 16px",borderBottom:`1px solid ${D.glassBorder}`}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
              <div>
                <h3 style={{fontFamily:"'Syne',sans-serif",fontSize:18,fontWeight:800,color:"#fff",marginBottom:4}}>{shed.name}</h3>
                <div style={{display:"flex",alignItems:"center",gap:5,fontSize:12,color:D.muted}}><MapPin size={11}/>{shed.location}, {shed.district}</div>
              </div>
              <Pill label={shed.active?"Active":"Inactive"} color={shed.active?"active":"closed"}/>
            </div>
          </div>
          <div style={{padding:"16px 22px"}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
              {[["Capacity",shed.capacity.toLocaleString()+" birds"],["Area",shed.area+" sq ft"],["Supervisor",shed.supervisor],["Batch Day",day?`Day ${day} / 42`:"No active batch"]].map(([l,v])=>(
                <div key={l} style={{background:"rgba(255,255,255,0.03)",borderRadius:10,padding:"10px 12px",border:"1px solid rgba(255,255,255,0.06)"}}>
                  <div style={{fontSize:10,color:D.muted,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:3}}>{l}</div>
                  <div style={{fontSize:13,fontWeight:700,color:"#fff"}}>{v}</div>
                </div>
              ))}
            </div>
            {bat&&<div style={{marginBottom:14}}>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:6,color:D.muted}}>
                <span>Batch #{bat.batchNo} Progress</span>
                <span style={{fontFamily:"'JetBrains Mono',monospace",fontWeight:700,color:"#93C5FD"}}>{pct.toFixed(0)}%</span>
              </div>
              <div style={{background:"rgba(255,255,255,0.06)",borderRadius:99,height:6,overflow:"hidden"}}>
                <div style={{background:`linear-gradient(90deg,${D.blue},#60A5FA)`,borderRadius:99,height:"100%",width:`${pct}%`,boxShadow:`0 0 8px ${D.blue}`,transition:"width 0.5s"}}/>
              </div>
            </div>}
            {canEdit&&shed.active&&<div style={{display:"flex",gap:8}}>
              <Btn variant="outline" size="sm" icon={Edit2} onClick={()=>{setEditShed(shed);setForm(shed);setShowAdd(true);}}>Edit</Btn>
              <Btn variant="ghost" size="sm" onClick={()=>deactivate(shed.id)}>Deactivate</Btn>
            </div>}
          </div>
        </GCard>;
      })}
    </div>
    {(showAdd||editShed)&&<Modal title={editShed?"Edit Shed":t.addShed} onClose={()=>{setShowAdd(false);setEditShed(null);setForm(blank);}} width={600}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        <FInput label="Shed Name" value={form.name} onChange={v=>setForm({...form,name:v})} required/>
        <FInput label="Location/Village" value={form.location} onChange={v=>setForm({...form,location:v})} required/>
        <FInput label="District" value={form.district} onChange={v=>setForm({...form,district:v})}/>
        <FInput label="State" value={form.state} onChange={v=>setForm({...form,state:v})}/>
        <FInput label="Supervisor Name" value={form.supervisor} onChange={v=>setForm({...form,supervisor:v})} required/>
        <FInput label="Supervisor Phone" value={form.supervisorPhone} onChange={v=>setForm({...form,supervisorPhone:v})}/>
        <FInput label="Manager Name" value={form.manager} onChange={v=>setForm({...form,manager:v})}/>
        <FInput label="Manager Phone" value={form.managerPhone} onChange={v=>setForm({...form,managerPhone:v})}/>
        <FInput label="Shed Capacity" value={form.capacity} onChange={v=>setForm({...form,capacity:+v})} type="number"/>
        <FInput label="Shed Area (sq ft)" value={form.area} onChange={v=>setForm({...form,area:v})}/>
        <FInput label="GPS Coordinates" value={form.gps} onChange={v=>setForm({...form,gps:v})} placeholder="lat, lng (optional)" style={{gridColumn:"span 2"}}/>
      </div>
      <div style={{display:"flex",gap:10,marginTop:20,justifyContent:"flex-end"}}>
        <Btn variant="outline" onClick={()=>{setShowAdd(false);setEditShed(null);}}>{t.cancel}</Btn>
        <Btn onClick={save}>{t.save}</Btn>
      </div>
    </Modal>}
  </div>;
}

/* ══════════════════════════════════════════════════════
   BATCHES TAB
══════════════════════════════════════════════════════ */
function BatchesTab({batches,setBatches,sheds,lang}){
  const t=T[lang];
  const [showForm,setShowForm]=useState(false);
  const [form,setForm]=useState({shed:"",chicks:19800,startDate:new Date().toISOString().split("T")[0],batchNo:8});
  const activeSheds=sheds.filter(s=>s.active);

  const startBatch=async()=>{
    if(!form.shed)return;
    if(batches.find(b=>b.shed===form.shed&&b.status==="active")){alert("Close existing batch first");return;}
    const u=[...batches,{id:"batch_"+Date.now(),...form,chicks:+form.chicks,batchNo:+form.batchNo,status:"active",closedDate:null}];
    setBatches(u);await DB.upsertBatch(u[u.length-1]);setShowForm(false);
  };
  const closeBatch=async(id)=>{const closed={...batches.find(b=>b.id===id),status:"closed",closedDate:new Date().toISOString().split("T")[0]};const u=batches.map(b=>b.id===id?closed:b);setBatches(u);await DB.upsertBatch(closed);};

  return <div className="fade-up">
    <div style={{marginBottom:22,display:"flex",justifyContent:"flex-end"}}><Btn icon={Plus} onClick={()=>setShowForm(true)}>{t.addBatch}</Btn></div>
    {activeSheds.map(shed=>{
      const shedBatches=batches.filter(b=>b.shed===shed.id).sort((a,b)=>b.batchNo-a.batchNo);
      const active=shedBatches.find(b=>b.status==="active");
      const day=active?batchDay(active.startDate):null;
      const pct=day?Math.min((day/42)*100,100):0;
      return <GCard key={shed.id} style={{marginBottom:16}} title={shed.name}
        action={active?<Pill label={`Day ${day} · Active`} color="active"/>:<Pill label="No Active Batch" color="closed"/>}>
        {active&&<div style={{marginBottom:16}}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:16}}>
            {[["Batch",`#${active.batchNo}`],["Chicks In",active.chicks.toLocaleString()],["Started",active.startDate],["Days Left",Math.max(0,42-day)+"d"]].map(([l,v])=>(
              <div key={l} style={{background:"rgba(255,255,255,0.04)",borderRadius:12,padding:"12px 16px",border:"1px solid rgba(255,255,255,0.06)"}}>
                <div style={{fontSize:10,color:D.muted,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em"}}>{l}</div>
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:20,fontWeight:800,color:"#fff",marginTop:6}}>{v}</div>
              </div>
            ))}
          </div>
          {/* Circular-ish progress */}
          <div style={{marginBottom:12}}>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:7}}>
              <span style={{color:D.muted}}>Progress toward Day 42 harvest</span>
              <span style={{fontFamily:"'JetBrains Mono',monospace",fontWeight:700,color:"#93C5FD"}}>{day}/42 · {pct.toFixed(0)}%</span>
            </div>
            <div style={{background:"rgba(255,255,255,0.05)",borderRadius:99,height:12,overflow:"hidden",position:"relative"}}>
              <div style={{background:`linear-gradient(90deg,${D.blue},#60A5FA,${D.green})`,borderRadius:99,height:"100%",width:`${pct}%`,transition:"width 0.6s",boxShadow:`0 0 12px ${D.blue}80`}}/>
              {[25,50,75].map(m=><div key={m} style={{position:"absolute",left:`${m}%`,top:0,bottom:0,width:1,background:"rgba(255,255,255,0.15)"}}/>)}
            </div>
          </div>
          <Btn variant="danger" size="sm" onClick={()=>closeBatch(active.id)}>Close Batch (Harvest Complete)</Btn>
        </div>}
        {shedBatches.filter(b=>b.status==="closed").slice(0,3).length>0&&<div>
          <p style={{fontSize:11,color:D.muted,fontWeight:700,marginBottom:10,textTransform:"uppercase",letterSpacing:"0.06em"}}>History</p>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
            <thead><tr style={{borderBottom:`1px solid ${D.glassBorder}`}}>
              {["Batch","Start","Closed","Chicks","Status"].map(h=><th key={h} style={{padding:"7px 10px",textAlign:"left",color:D.muted,fontWeight:700,fontSize:11,textTransform:"uppercase"}}>{h}</th>)}
            </tr></thead>
            <tbody>{shedBatches.filter(b=>b.status==="closed").slice(0,3).map(b=>(
              <tr key={b.id} style={{borderBottom:`1px solid rgba(255,255,255,0.04)`}}>
                <td style={{padding:"9px 10px",fontWeight:700,color:"#fff"}}>#{b.batchNo}</td>
                <td style={{padding:"9px 10px",color:D.muted}}>{b.startDate}</td>
                <td style={{padding:"9px 10px",color:D.muted}}>{b.closedDate||"—"}</td>
                <td style={{padding:"9px 10px",fontFamily:"'JetBrains Mono',monospace",fontSize:12}}>{b.chicks.toLocaleString()}</td>
                <td style={{padding:"9px 10px"}}><Pill label="Closed" color="closed"/></td>
              </tr>
            ))}</tbody>
          </table>
        </div>}
      </GCard>;
    })}
    {showForm&&<Modal title="Start New Batch" onClose={()=>setShowForm(false)}>
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        <FSelect label="Shed" value={form.shed} onChange={v=>setForm({...form,shed:v})} required options={[{value:"",label:"Select shed..."},...activeSheds.map(s=>({value:s.id,label:s.name}))]}/>
        <FInput label="Batch Number" value={form.batchNo} onChange={v=>setForm({...form,batchNo:v})} type="number"/>
        <FInput label="Chicks Placed" value={form.chicks} onChange={v=>setForm({...form,chicks:v})} type="number"/>
        <FInput label="Start Date" value={form.startDate} onChange={v=>setForm({...form,startDate:v})} type="date"/>
        <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:6}}>
          <Btn variant="outline" onClick={()=>setShowForm(false)}>{t.cancel}</Btn>
          <Btn onClick={startBatch}>{t.addBatch}</Btn>
        </div>
      </div>
    </Modal>}
  </div>;
}

/* ══════════════════════════════════════════════════════
   DAILY REPORT TAB — REDESIGNED
══════════════════════════════════════════════════════ */
function ReportTab({sheds,batches,reports,setReports,setAlerts,alerts,user,lang}){
  const t=T[lang];
  const blank={shed:"",session:"Morning",mortality:"",weight:"",temp:"",feed:"",water:"",feedtype:"Grower",medicine:"",health:"",litter:"Good",event:""};
  const [form,setForm]=useState(blank);
  const [toast,setToast]=useState(null);
  const [clock,setClock]=useState(new Date());
  const [confetti,setConfetti]=useState(false);
  const activeSheds=sheds.filter(s=>s.active);

  useEffect(()=>{const x=setInterval(()=>setClock(new Date()),1000);return()=>clearInterval(x);},[]);

  const activeBatch=batches.find(b=>b.shed===form.shed&&b.status==="active");
  const day=activeBatch?batchDay(activeBatch.startDate):null;
  const todayISO=clock.toISOString().split("T")[0];
  const todayFmt=clock.toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"});
  const timeNow=clock.toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:true});

  const lastReport=reports.filter(r=>r.shed===form.shed).sort((a,b)=>b.id-a.id)[0];
  const baseBirds=lastReport?lastReport.birds:activeBatch?activeBatch.chicks:null;
  const liveBirds=baseBirds!==null&&form.mortality!==""?Math.max(0,baseBirds-+form.mortality):baseBirds;

  const mortWarn=+form.mortality>40?"critical":+form.mortality>28?"warning":null;
  const tempWarn=+form.temp>32?"critical":+form.temp>30?"warning":null;
  const wfRatio=form.feed&&form.water?(+form.water/+form.feed).toFixed(2):null;
  const wfWarn=wfRatio&&+wfRatio<1.5?"critical":wfRatio&&+wfRatio<1.8?"warning":null;
  const expW=day?expectedWeight(day):null;
  const weightWarn=form.weight&&expW&&+form.weight<expW*0.88?"warning":null;

  const submit=async()=>{
    if(!form.shed||form.mortality==="")return;
    const now=new Date().toISOString();
    const report={id:Date.now(),...form,date:todayISO,submittedAt:now,day:day||0,supervisor:user.name,birds:liveBirds||0,mortality:+form.mortality,weight:+form.weight,temp:+form.temp,feed:+form.feed,water:+form.water,lang,editedAt:null,editedBy:null};
    const saved=await DB.insertReport(report);const updR=[saved,...reports];setReports(updR);
    const newAlerts=[];const shedName=sheds.find(s=>s.id===form.shed)?.name||"";
    if(+form.mortality>40)newAlerts.push({id:Date.now()+1,type:"critical",shed:form.shed,title:"High Mortality Alert",desc:`${form.mortality} deaths in ${shedName}`,time:now,read:false});
    else if(+form.mortality>28)newAlerts.push({id:Date.now()+2,type:"warning",shed:form.shed,title:"Mortality Warning",desc:`${form.mortality} deaths in ${shedName}`,time:now,read:false});
    if(+form.temp>32)newAlerts.push({id:Date.now()+3,type:"critical",shed:form.shed,title:"High Temperature Alert",desc:`${form.temp}°C in ${shedName}`,time:now,read:false});
    else if(+form.temp>30)newAlerts.push({id:Date.now()+4,type:"warning",shed:form.shed,title:"Temperature Warning",desc:`${form.temp}°C in ${shedName}`,time:now,read:false});
    if(wfRatio&&+wfRatio<1.8)newAlerts.push({id:Date.now()+5,type:"warning",shed:form.shed,title:"Low Water:Feed Ratio",desc:`Ratio ${wfRatio}x in ${shedName}`,time:now,read:false});
    if(weightWarn)newAlerts.push({id:Date.now()+6,type:"warning",shed:form.shed,title:"Below Expected Weight",desc:`${form.weight}g — below 88% of expected ${expW}g`,time:now,read:false});
    if(newAlerts.length){const saved=await Promise.all(newAlerts.map(a=>DB.insertAlert(a)));setAlerts(a=>[...saved,...a]);}
    setForm(blank);setConfetti(true);setTimeout(()=>setConfetti(false),3000);
    setToast({message:"Report submitted successfully!",type:"success"});
  };

  const WarnBanner=({warn,msg})=>warn?<div style={{display:"flex",alignItems:"center",gap:7,padding:"8px 12px",background:warn==="critical"?"rgba(239,68,68,0.12)":"rgba(245,158,11,0.12)",border:`1px solid ${warn==="critical"?D.red:D.amber}30`,borderRadius:9,marginTop:6}}>
    <AlertTriangle size={13} color={warn==="critical"?D.red:D.amber}/>
    <span style={{fontSize:12,color:warn==="critical"?D.red:D.amber,fontWeight:700}}>{msg}</span>
  </div>:null;

  return <div className="fade-up">
    {toast&&<Toast message={toast.message} type={toast.type} onClose={()=>setToast(null)}/>}
    <Confetti active={confetti}/>
    <div style={{display:"grid",gridTemplateColumns:"1fr 340px",gap:20}}>
      <div>
        {/* Shed + session selector */}
        <GCard style={{marginBottom:16}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
            <FSelect label="Select Shed" value={form.shed} onChange={v=>setForm({...form,shed:v})} required options={[{value:"",label:"Choose shed..."},...activeSheds.map(s=>({value:s.id,label:s.name}))]}/>
            <FSelect label="Session" value={form.session} onChange={v=>setForm({...form,session:v})} options={[t.morning,t.evening]}/>
          </div>
        </GCard>

        {/* AUTO-FILL BANNER */}
        <div style={{background:"rgba(6,13,26,0.8)",border:"1px solid rgba(59,130,246,0.25)",borderRadius:18,padding:2,marginBottom:16,backdropFilter:"blur(12px)"}}>
          <div style={{background:`linear-gradient(135deg,rgba(59,130,246,0.12),rgba(16,185,129,0.08))`,borderRadius:16,padding:"16px 20px"}}>
            <div style={{fontSize:10,fontWeight:800,color:"#60A5FA",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:14,display:"flex",alignItems:"center",gap:6}}>
              <Zap size={12}/> Auto-Filled — No Entry Required
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12}}>
              {[
                {label:"Date",value:todayFmt,icon:"📅",sub:"Today"},
                {label:"Batch Day",value:day?`Day ${day}`:"Select shed",icon:"🐣",sub:day?`of 42`:null},
                {label:"Live Birds",value:liveBirds!==null?liveBirds.toLocaleString():"—",icon:"🐔",sub:form.mortality!==""?`${baseBirds?.toLocaleString()} − ${form.mortality}`:null},
                {label:"Submitted At",value:timeNow,icon:"🕐",sub:"Live clock"},
              ].map(f=><div key={f.label} style={{background:"rgba(255,255,255,0.04)",borderRadius:12,padding:"12px 14px",border:"1px solid rgba(255,255,255,0.07)",position:"relative",overflow:"hidden"}}>
                <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,transparent,${D.blue}60,transparent)`}}/>
                <div style={{fontSize:10,color:D.muted,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:6}}>{f.icon} {f.label}</div>
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:f.label==="Submitted At"?13:17,fontWeight:800,color:"#93C5FD",letterSpacing:"-0.01em"}}>{f.value}</div>
                {f.sub&&<div style={{fontSize:10,color:D.muted,marginTop:4}}>{f.sub}</div>}
              </div>)}
            </div>
          </div>
        </div>

        {/* Mortality — THE MAIN INPUT */}
        <GCard glow={mortWarn==="critical"?"red":mortWarn==="warning"?"amber":undefined} style={{marginBottom:16}}>
          <div style={{textAlign:"center",padding:"4px 0 8px"}}>
            <div style={{fontSize:12,fontWeight:800,color:D.muted,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:16,display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
              <div style={{width:8,height:8,borderRadius:"50%",background:D.red,boxShadow:`0 0 8px ${D.red}`}}/>
              Mortality Today — Enter Manually
              <div style={{width:8,height:8,borderRadius:"50%",background:D.red,boxShadow:`0 0 8px ${D.red}`}}/>
            </div>
            <input type="number" value={form.mortality} onChange={e=>setForm({...form,mortality:e.target.value})} placeholder="0"
              min="0" autoFocus style={{
                width:"100%",padding:"18px",borderRadius:14,textAlign:"center",
                border:`2px solid ${mortWarn==="critical"?D.red:mortWarn==="warning"?D.amber:"rgba(255,255,255,0.12)"}`,
                fontSize:38,fontFamily:"'JetBrains Mono',monospace",fontWeight:700,
                color:mortWarn==="critical"?D.red:mortWarn==="warning"?D.amber:"#fff",
                background:mortWarn==="critical"?"rgba(239,68,68,0.08)":mortWarn==="warning"?"rgba(245,158,11,0.08)":"rgba(255,255,255,0.04)",
                outline:"none",transition:"all 0.2s",letterSpacing:"-0.02em",
                boxShadow:mortWarn==="critical"?`0 0 30px ${D.red}30`:mortWarn==="warning"?`0 0 30px ${D.amber}30`:"none"
              }}/>
            <div style={{marginTop:8,fontSize:13,color:D.muted}}>Number of bird deaths today</div>
            <WarnBanner warn={mortWarn} msg={mortWarn==="critical"?"🚨 CRITICAL: More than 40 deaths/day!":"⚠️ WARNING: 28–40 deaths/day — approaching threshold"}/>
            {form.mortality!==""&&liveBirds!==null&&<div style={{marginTop:10,padding:"8px 16px",background:"rgba(59,130,246,0.1)",borderRadius:10,border:"1px solid rgba(59,130,246,0.2)",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
              <Bird size={14} color={D.blue}/>
              <span style={{fontSize:13,color:"#93C5FD",fontWeight:600}}>
                Live count: <strong style={{fontFamily:"'JetBrains Mono',monospace"}}>{baseBirds?.toLocaleString()}</strong> − <strong>{form.mortality}</strong> = <strong style={{color:"#6EE7B7"}}>{liveBirds.toLocaleString()} birds</strong>
              </span>
            </div>}
          </div>
        </GCard>

        {/* Optional fields */}
        <GCard title="Additional Observations" action={<Pill label="Optional" color="info"/>}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
            <div>
              <FInput label="Sample Weight" value={form.weight} onChange={v=>setForm({...form,weight:v})} type="number" unit="g" warn={weightWarn}/>
              <WarnBanner warn={weightWarn} msg={`Below 88% of expected ${expW}g`}/>
            </div>
            <div>
              <FInput label="Temperature" value={form.temp} onChange={v=>setForm({...form,temp:v})} type="number" unit="°C" warn={tempWarn}/>
              <WarnBanner warn={tempWarn} msg={tempWarn==="critical"?"CRITICAL: >32°C!":"WARNING: 30–32°C"}/>
            </div>
            <FInput label="Feed Consumed" value={form.feed} onChange={v=>setForm({...form,feed:v})} type="number" unit="kg"/>
            <div>
              <FInput label="Water Consumed" value={form.water} onChange={v=>setForm({...form,water:v})} type="number" unit="L"/>
              {wfRatio&&<WarnBanner warn={wfWarn} msg={`W:F ratio ${wfRatio}x${wfWarn?" — below target":" ✓"}`}/>}
            </div>
            <FSelect label="Feed Type" value={form.feedtype} onChange={v=>setForm({...form,feedtype:v})} options={["Pre-Starter","Starter","Grower","Finisher"]}/>
            <FSelect label="Litter Condition" value={form.litter} onChange={v=>setForm({...form,litter:v})} options={["Good","Fair","Poor"]}/>
            <div style={{gridColumn:"span 2"}}>
              <FInput label="Medicine / Vaccine" value={form.medicine} onChange={v=>setForm({...form,medicine:v})} placeholder="Optional — enter any medicine given today"/>
            </div>
            <div style={{gridColumn:"span 2"}}>
              <label style={{fontSize:11,fontWeight:700,color:D.muted,textTransform:"uppercase",letterSpacing:"0.07em",display:"block",marginBottom:6}}>Health Observation</label>
              <textarea value={form.health} onChange={e=>setForm({...form,health:e.target.value})} rows={2} placeholder="Normal / note any observations..."
                style={{width:"100%",padding:"10px 14px",borderRadius:10,border:"1.5px solid rgba(255,255,255,0.1)",fontSize:14,color:D.text,background:"rgba(255,255,255,0.04)",fontFamily:"'DM Sans',sans-serif",resize:"vertical",outline:"none",backdropFilter:"blur(4px)"}}/>
            </div>
            <div style={{gridColumn:"span 2"}}>
              <label style={{fontSize:11,fontWeight:700,color:D.muted,textTransform:"uppercase",letterSpacing:"0.07em",display:"block",marginBottom:6}}>Unusual Event</label>
              <textarea value={form.event} onChange={e=>setForm({...form,event:e.target.value})} rows={2} placeholder="Any unusual events..."
                style={{width:"100%",padding:"10px 14px",borderRadius:10,border:"1.5px solid rgba(255,255,255,0.1)",fontSize:14,color:D.text,background:"rgba(255,255,255,0.04)",fontFamily:"'DM Sans',sans-serif",resize:"vertical",outline:"none",backdropFilter:"blur(4px)"}}/>
            </div>
          </div>
          <div style={{marginTop:20,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span style={{fontSize:12,color:D.muted}}>Will record at: <strong style={{color:"#93C5FD",fontFamily:"'JetBrains Mono',monospace"}}>{timeNow}</strong></span>
            <Btn icon={Check} size="lg" onClick={submit} disabled={!form.shed||form.mortality===""} style={{minWidth:200,justifyContent:"center"}}>
              {t.submitReport}
            </Btn>
          </div>
        </GCard>
      </div>

      {/* Right panel */}
      <div style={{display:"flex",flexDirection:"column",gap:16}}>
        {/* Threshold reference */}
        <GCard title="KPI Thresholds">
          {[{label:"Mortality/day",w:">28 birds",c:">40 birds"},{label:"Temperature",w:">30°C",c:">32°C"},{label:"Water:Feed",w:"<1.8x",c:"<1.5x"},{label:"Body Weight",w:"<88% expected",c:""}].map(item=>(
            <div key={item.label} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 0",borderBottom:`1px solid ${D.glassBorder}`}}>
              <span style={{fontSize:12,fontWeight:700,color:D.text}}>{item.label}</span>
              <div style={{display:"flex",gap:6}}>
                {item.w&&<Pill label={item.w} color="warning" size="xs"/>}
                {item.c&&<Pill label={item.c} color="critical" size="xs"/>}
              </div>
            </div>
          ))}
        </GCard>

        {/* Expected weight today */}
        {day&&expW&&<GCard glow="blue">
          <div style={{textAlign:"center",padding:"8px 0"}}>
            <div style={{fontSize:11,color:D.muted,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:12}}>Expected Weight · Day {day}</div>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:42,fontWeight:800,color:"#93C5FD",letterSpacing:"-0.03em",lineHeight:1}}>{expW}<span style={{fontSize:18,color:D.muted}}>g</span></div>
            <div style={{marginTop:12,padding:"8px 14px",background:"rgba(239,68,68,0.1)",borderRadius:10,fontSize:12,color:"#FCA5A5",fontWeight:600}}>
              88% threshold: {Math.round(expW*0.88)}g
            </div>
            <div style={{marginTop:8,fontSize:11,color:D.muted}}>Formula: 40 + ({day} × 62) = {expW}g</div>
          </div>
        </GCard>}

        {/* Recent submissions */}
        <GCard title="Recent Submissions">
          {reports.filter(r=>r.shed===form.shed).sort((a,b)=>b.id-a.id).slice(0,4).map(r=>(
            <div key={r.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:`1px solid ${D.glassBorder}`}}>
              <div>
                <div style={{fontSize:13,fontWeight:700,color:"#fff"}}>{r.date} · {r.session}</div>
                <div style={{fontSize:11,color:D.muted}}>{r.mortality} deaths · {r.weight}g · {r.temp}°C</div>
              </div>
              <Pill label={`Day ${r.day}`} color="blue" size="xs"/>
            </div>
          ))}
          {!form.shed&&<p style={{fontSize:12,color:D.muted,textAlign:"center",padding:"10px 0"}}>Select a shed to see recent reports</p>}
        </GCard>
      </div>
    </div>
  </div>;
}

/* ══════════════════════════════════════════════════════
   ALERTS TAB
══════════════════════════════════════════════════════ */
function AlertsTab({alerts,setAlerts,sheds,lang}){
  const t=T[lang];
  const markAll=async()=>{setAlerts(a=>a.map(x=>({...x,read:true})));await DB.markAllAlertsRead();};
  const markOne=async(id)=>{setAlerts(a=>a.map(x=>x.id===id?{...x,read:true}:x));await DB.updateAlert(id,{read:true});};
  const unread=alerts.filter(a=>!a.read);const read=alerts.filter(a=>a.read);
  const iconMap={critical:<AlertCircle size={18} color={D.red}/>,warning:<AlertTriangle size={18} color={D.amber}/>,info:<Info size={18} color={D.blue}/>,ok:<CheckCircle size={18} color={D.green}/>};
  const AlRow=({a})=>{
    const bg={critical:"rgba(239,68,68,0.08)",warning:"rgba(245,158,11,0.08)",info:"rgba(59,130,246,0.08)",ok:"rgba(16,185,129,0.08)"}[a.type];
    const bc={critical:D.red,warning:D.amber,info:D.blue,ok:D.green}[a.type];
    return <div style={{background:bg,border:`1px solid ${bc}25`,borderRadius:14,padding:"14px 16px",opacity:a.read?0.55:1,animation:!a.read&&a.type==="critical"?"alert-flash 2s ease-in-out infinite":"none"}}>
      <div style={{display:"flex",alignItems:"flex-start",gap:12}}>
        <div style={{marginTop:1,flexShrink:0}}>{iconMap[a.type]}</div>
        <div style={{flex:1}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span style={{fontSize:14,fontWeight:700,color:"#fff"}}>{a.title}</span>
            <span style={{fontSize:11,color:D.muted,fontFamily:"'JetBrains Mono',monospace"}}>{new Date(a.time).toLocaleTimeString("en-IN",{hour12:true,hour:"numeric",minute:"2-digit"})}</span>
          </div>
          <p style={{fontSize:12,color:D.muted,marginTop:4}}>{a.desc}</p>
          <div style={{display:"flex",gap:8,marginTop:8,alignItems:"center"}}>
            <Pill label={a.type} color={a.type}/><span style={{fontSize:11,color:D.muted}}>{sheds.find(s=>s.id===a.shed)?.name||a.shed}</span>
            {!a.read&&<button onClick={()=>markOne(a.id)} style={{marginLeft:"auto",fontSize:12,color:"#93C5FD",background:"none",border:"none",cursor:"pointer",fontWeight:700}}>Mark read</button>}
          </div>
        </div>
      </div>
    </div>;
  };
  return <div className="fade-up">
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:22}}>
      <div style={{display:"flex",gap:10}}><Pill label={`${unread.length} Unread`} color={unread.length>0?"critical":"ok"}/><Pill label={`${read.length} Read`} color="closed"/></div>
      {unread.length>0&&<Btn variant="outline" size="sm" icon={Check} onClick={markAll}>{t.markAllRead}</Btn>}
    </div>
    {unread.length>0&&<div style={{marginBottom:24}}><h3 style={{fontSize:12,fontWeight:800,color:D.muted,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:12}}>{t.unread}</h3><div style={{display:"flex",flexDirection:"column",gap:10}}>{unread.map(a=><AlRow key={a.id} a={a}/>)}</div></div>}
    {read.length>0&&<div><h3 style={{fontSize:12,fontWeight:800,color:D.dim,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:12}}>{t.read}</h3><div style={{display:"flex",flexDirection:"column",gap:8}}>{read.map(a=><AlRow key={a.id} a={a}/>)}</div></div>}
    {alerts.length===0&&<div style={{textAlign:"center",padding:"80px 0"}}>
      <CheckCircle size={56} color={D.green} style={{margin:"0 auto 16px",opacity:0.6}}/>
      <p style={{fontSize:16,fontWeight:700,color:D.text}}>{t.noAlerts}</p>
      <p style={{fontSize:13,color:D.muted,marginTop:6}}>All thresholds within safe range</p>
    </div>}
  </div>;
}

/* ══════════════════════════════════════════════════════
   WEEKLY TAB
══════════════════════════════════════════════════════ */
function WeeklyTab({reports,sheds,lang}){
  const t=T[lang];
  const [analyses,setAnalyses]=useState({});
  const [loading,setLoading]=useState({});
  const weeks=(()=>{const m={};reports.forEach(r=>{const d=new Date(r.date);const mon=new Date(d);mon.setDate(d.getDate()-d.getDay()+1);const k=mon.toISOString().split("T")[0];if(!m[k])m[k]=[];m[k].push(r);});return Object.entries(m).sort((a,b)=>b[0]>a[0]?1:-1);})();
  const analyze=async(wk,reps)=>{
    setLoading(l=>({...l,[wk]:true}));
    const totalMort=reps.reduce((s,r)=>s+r.mortality,0);
    const avgW=Math.round(reps.reduce((s,r)=>s+r.weight,0)/reps.length);
    const totalFeed=reps.reduce((s,r)=>s+r.feed,0);
    const avgTemp=(reps.reduce((s,r)=>s+r.temp,0)/reps.length).toFixed(1);
    const shN=[...new Set(reps.map(r=>sheds.find(s=>s.id===r.shed)?.name||r.shed))].join(", ");
    const ln={en:"English",te:"Telugu",hi:"Hindi",mai:"Maithili"};
    try{
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:600,messages:[{role:"user",content:`You are a broiler farm expert for Sri Farms, Chittoor District, AP. Week of ${wk}: sheds ${shN}, ${reps.length} reports, ${totalMort} deaths, avg weight ${avgW}g, total feed ${totalFeed}kg, avg temp ${avgTemp}°C. Give 3-5 bullet analysis with ✅⚠️🔴. No prices. Reply in ${ln[lang]||"English"}.`}]})});
      const d=await res.json();setAnalyses(a=>({...a,[wk]:d.content?.map(c=>c.text||"").join("")||"Unable to analyze."}));
    }catch{setAnalyses(a=>({...a,[wk]:"AI analysis unavailable."}))}
    setLoading(l=>({...l,[wk]:false}));
  };
  return <div className="fade-up">
    {weeks.length===0&&<p style={{color:D.muted,textAlign:"center",padding:"60px 0"}}>No reports yet.</p>}
    {weeks.map(([wk,reps])=>{
      const totalMort=reps.reduce((s,r)=>s+r.mortality,0);
      const avgW=Math.round(reps.reduce((s,r)=>s+r.weight,0)/reps.length);
      const totalFeed=reps.reduce((s,r)=>s+r.feed,0);
      const avgTemp=(reps.reduce((s,r)=>s+r.temp,0)/reps.length).toFixed(1);
      const shN=[...new Set(reps.map(r=>sheds.find(s=>s.id===r.shed)?.name||r.shed))];
      const an=analyses[wk];const ld=loading[wk];
      return <GCard key={wk} style={{marginBottom:18}} title={`Week of ${wk}`} action={<div style={{display:"flex",gap:6}}>{shN.map(n=><Pill key={n} label={n} color="blue" size="xs"/>)}</div>}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:12,marginBottom:16}}>
          {[["Deaths",totalMort,D.red],["Avg Weight",avgW+"g",D.blue],["Total Feed",totalFeed+"kg",D.text],["Avg Temp",avgTemp+"°C",+avgTemp>32?D.red:+avgTemp>30?D.amber:D.green],["Reports",reps.length,D.muted]].map(([l,v,c])=>(
            <div key={l} style={{background:"rgba(255,255,255,0.04)",borderRadius:12,padding:"12px 14px",border:"1px solid rgba(255,255,255,0.06)"}}>
              <div style={{fontSize:10,color:D.muted,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em"}}>{l}</div>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:18,fontWeight:800,color:c,marginTop:6}}>{v}</div>
            </div>
          ))}
        </div>
        {an&&<div style={{background:"rgba(139,92,246,0.08)",border:"1px solid rgba(139,92,246,0.2)",borderRadius:12,padding:"14px 16px",marginBottom:14}}>
          <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:8}}><Cpu size={14} color="#A78BFA"/><span style={{fontSize:12,fontWeight:700,color:"#A78BFA",textTransform:"uppercase",letterSpacing:"0.05em"}}>AI Analysis</span></div>
          <p style={{fontSize:13,color:D.text,lineHeight:1.9,whiteSpace:"pre-line"}}>{an}</p>
        </div>}
        <Btn variant={an?"outline":"amber"} size="sm" icon={ld?RefreshCw:Cpu} onClick={()=>analyze(wk,reps)} loading={ld}>
          {ld?t.loading:an?t.reanalyze:t.analyze}
        </Btn>
      </GCard>;
    })}
  </div>;
}

/* ══════════════════════════════════════════════════════
   AI PREDICTOR
══════════════════════════════════════════════════════ */
function AIPredictTab({sheds,batches,reports,lang}){
  const t=T[lang];
  const [form,setForm]=useState({shed:"",fcr:"",totalFeed:"",mortality:"",dailyGain:"",targetDay:42});
  const [result,setResult]=useState(null);const [loading,setLoading]=useState(false);
  const [aiText,setAiText]=useState("");const [history,setHistory]=useState([]);
  const activeSheds=sheds.filter(s=>s.active);
  const activeBatch=batches.find(b=>b.shed===form.shed&&b.status==="active");
  const latestReport=reports.filter(r=>r.shed===form.shed).sort((a,b)=>b.id-a.id)[0];
  const currentDay=activeBatch?batchDay(activeBatch.startDate):0;
  const daysLeft=Math.max(0,form.targetDay-currentDay);
  const currentWeight=latestReport?.weight||0;

  const run=async()=>{
    if(!form.shed||!form.fcr||!form.dailyGain)return;
    setLoading(true);
    const projWeight=currentWeight+(+form.dailyGain*daysLeft);
    const surv=activeBatch?(((activeBatch.chicks-+form.mortality)/activeBatch.chicks)*100).toFixed(1):97;
    const projFCR=(((+form.totalFeed)+(activeBatch?((activeBatch.chicks-+form.mortality)*(projWeight/1000)*(+form.fcr-1)):0))/((activeBatch?activeBatch.chicks-+form.mortality:100)*(projWeight/1000))).toFixed(2);
    const epi=Math.round((projWeight/1000*+surv)*100/(+projFCR*form.targetDay/100));
    const r={projWeight:Math.round(projWeight),projFCR,epi,daysLeft,currentDay,survivability:surv};
    setResult(r);setHistory(h=>[{...r,shed:form.shed,ts:new Date().toLocaleTimeString()},...h].slice(0,10));
    const sn=sheds.find(s=>s.id===form.shed)?.name||"";
    const ln={en:"English",te:"Telugu",hi:"Hindi",mai:"Maithili"};
    try{
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:500,messages:[{role:"user",content:`Sri Farms batch predictor for ${sn}: Day ${currentDay}, ${daysLeft} days left, current ${currentWeight}g, gain ${form.dailyGain}g/day, projected ${r.projWeight}g, FCR ${form.fcr}→${projFCR}, mortality ${form.mortality}, EPI ${epi}. Give 3-4 management tips for remaining days. Reply in ${ln[lang]||"English"}. No prices.`}]})});
      const d=await res.json();setAiText(d.content?.map(c=>c.text||"").join("")||"");
    }catch{setAiText("AI unavailable.")}
    setLoading(false);
  };

  const gc=(m,v)=>{if(m==="fcr")return+v>2?D.red:+v>1.75?D.amber:D.green;if(m==="epi")return+v>350?D.green:+v>300?D.amber:D.red;if(m==="weight")return+v>2200?D.green:+v>1800?D.amber:D.red;return D.text;};

  return <div className="fade-up">
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
      <GCard title="Batch Parameters">
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <FSelect label="Shed" value={form.shed} onChange={v=>setForm({...form,shed:v})} options={[{value:"",label:"Select shed..."},...activeSheds.map(s=>({value:s.id,label:s.name}))]}/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <FInput label="Current FCR" value={form.fcr} onChange={v=>setForm({...form,fcr:v})} type="number" placeholder="1.65"/>
            <FInput label="Total Feed (kg)" value={form.totalFeed} onChange={v=>setForm({...form,totalFeed:v})} type="number"/>
            <FInput label="Mortality Count" value={form.mortality} onChange={v=>setForm({...form,mortality:v})} type="number" placeholder="0"/>
            <FInput label="Daily Gain (g/day)" value={form.dailyGain} onChange={v=>setForm({...form,dailyGain:v})} type="number"/>
            <FInput label="Target Day" value={form.targetDay} onChange={v=>setForm({...form,targetDay:+v})} type="number"/>
            <div style={{display:"flex",flexDirection:"column",gap:6}}>
              <label style={{fontSize:11,fontWeight:700,color:D.muted,textTransform:"uppercase",letterSpacing:"0.07em"}}>Current Status</label>
              <div style={{padding:"10px 14px",borderRadius:10,border:"1px solid rgba(59,130,246,0.25)",background:"rgba(59,130,246,0.08)",fontFamily:"'JetBrains Mono',monospace",fontSize:14,fontWeight:700,color:"#93C5FD"}}>Day {currentDay} · {daysLeft}d left</div>
            </div>
          </div>
          <Btn icon={loading?RefreshCw:Cpu} onClick={run} loading={loading} style={{width:"100%",justifyContent:"center",padding:"13px"}} size="lg">
            {loading?t.loading:t.runPredict||"Run Prediction"}
          </Btn>
        </div>
      </GCard>

      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        {result&&<div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}>
            {[{l:"Projected Weight",v:result.projWeight+"g",m:"weight"},{l:"Projected FCR",v:result.projFCR,m:"fcr"},{l:"EPI Score",v:result.epi,m:"epi"},{l:"Days Left",v:result.daysLeft,m:"days"}].map(it=>(
              <div key={it.l} style={{background:"rgba(255,255,255,0.04)",border:`1px solid ${gc(it.m,parseFloat(it.v))}30`,borderRadius:14,padding:"16px 18px",borderTop:`3px solid ${gc(it.m,parseFloat(it.v))}`}}>
                <div style={{fontSize:10,color:D.muted,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:8}}>{it.l}</div>
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:24,fontWeight:800,color:gc(it.m,parseFloat(it.v))}}>{it.v}</div>
              </div>
            ))}
          </div>
          {aiText&&<GCard glow="purple">
            <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:10}}><Cpu size={14} color="#A78BFA"/><span style={{fontSize:12,fontWeight:700,color:"#A78BFA",textTransform:"uppercase",letterSpacing:"0.05em"}}>AI Recommendations</span></div>
            <p style={{fontSize:13,color:D.text,lineHeight:1.9,whiteSpace:"pre-line"}}>{aiText}</p>
          </GCard>}
        </div>}
        {!result&&<GCard style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",minHeight:300}}>
          <div style={{textAlign:"center",color:D.muted}}>
            <Cpu size={44} color="rgba(59,130,246,0.3)" style={{margin:"0 auto 14px"}}/>
            <p style={{fontSize:14,fontWeight:600}}>Enter parameters and run prediction</p>
          </div>
        </GCard>}
      </div>
    </div>
    {history.length>0&&<GCard title="Prediction History (Session)" style={{marginTop:20}}>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
        <thead><tr style={{borderBottom:`1px solid ${D.glassBorder}`}}>{["Time","Shed","Proj. Weight","Proj. FCR","EPI","Days Left"].map(h=><th key={h} style={{padding:"8px 10px",textAlign:"left",color:D.muted,fontWeight:700,fontSize:11,textTransform:"uppercase"}}>{h}</th>)}</tr></thead>
        <tbody>{history.map((h,i)=><tr key={i} style={{borderBottom:`1px solid rgba(255,255,255,0.04)`}}>
          <td style={{padding:"9px 10px",color:D.muted,fontFamily:"'JetBrains Mono',monospace",fontSize:12}}>{h.ts}</td>
          <td style={{padding:"9px 10px",fontWeight:700,color:"#fff"}}>{sheds.find(s=>s.id===h.shed)?.name||h.shed}</td>
          <td style={{padding:"9px 10px",fontFamily:"'JetBrains Mono',monospace"}}>{h.projWeight}g</td>
          <td style={{padding:"9px 10px",fontFamily:"'JetBrains Mono',monospace",color:gc("fcr",h.projFCR)}}>{h.projFCR}</td>
          <td style={{padding:"9px 10px",fontFamily:"'JetBrains Mono',monospace",color:gc("epi",h.epi)}}>{h.epi}</td>
          <td style={{padding:"9px 10px"}}>{h.daysLeft}d</td>
        </tr>)}</tbody>
      </table>
    </GCard>}
  </div>;
}

/* ══════════════════════════════════════════════════════
   HISTORY TAB
══════════════════════════════════════════════════════ */
function HistoryTab({reports,setReports,sheds,user,lang}){
  const t=T[lang];
  const [filter,setFilter]=useState("all");const [search,setSearch]=useState("");
  const [selected,setSelected]=useState(null);const [editMode,setEditMode]=useState(false);
  const [editForm,setEditForm]=useState(null);const [toast,setToast]=useState(null);
  const canEdit=user.role==="owner";
  const filtered=reports.filter(r=>filter==="all"||r.shed===filter).filter(r=>!search||r.date.includes(search)||r.supervisor.toLowerCase().includes(search.toLowerCase())).sort((a,b)=>b.id-a.id);
  const saveEdit=async()=>{const updates={...editForm,edited_at:new Date().toISOString(),edited_by:"Farm Owner"};const saved=await DB.updateReport(editForm.id,updates);const u=reports.map(r=>r.id===editForm.id?saved:r);setReports(u);setSelected(saved);setEditMode(false);setToast({message:"Report updated!",type:"success"});};
  return <div className="fade-up">
    {toast&&<Toast message={toast.message} type={toast.type} onClose={()=>setToast(null)}/>}
    <div style={{display:"flex",gap:12,marginBottom:18,flexWrap:"wrap"}}>
      <div style={{position:"relative",flex:1,minWidth:200}}>
        <Search size={14} color={D.muted} style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)"}}/>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by date or supervisor..."
          style={{width:"100%",padding:"9px 12px 9px 34px",borderRadius:10,border:"1.5px solid rgba(255,255,255,0.1)",fontSize:14,fontFamily:"'DM Sans',sans-serif",outline:"none",background:"rgba(255,255,255,0.04)",color:D.text,backdropFilter:"blur(4px)"}}/>
      </div>
      <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
        {[{id:"all",label:t.allSheds},...sheds.filter(s=>s.active).map(s=>({id:s.id,label:s.name}))].map(f=>(
          <button key={f.id} onClick={()=>setFilter(f.id)} style={{padding:"7px 14px",borderRadius:99,border:`1.5px solid ${filter===f.id?"rgba(59,130,246,0.5)":"rgba(255,255,255,0.08)"}`,background:filter===f.id?"rgba(59,130,246,0.15)":"rgba(255,255,255,0.04)",color:filter===f.id?"#93C5FD":D.muted,fontSize:13,fontWeight:600,cursor:"pointer"}}>{f.label}</button>
        ))}
      </div>
    </div>
    <GCard noPad>
      <div style={{overflowX:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead><tr style={{borderBottom:`1px solid ${D.glassBorder}`}}>{["Date","Shed","Day","Session","Birds","Mort.","Weight","Temp","FCR","Lang","Status"].map(h=><th key={h} style={{padding:"11px 12px",textAlign:"left",color:D.muted,fontWeight:700,fontSize:11,textTransform:"uppercase",letterSpacing:"0.05em",whiteSpace:"nowrap"}}>{h}</th>)}</tr></thead>
          <tbody>
            {filtered.slice(0,30).map(r=>{
              const fcr=(r.feed/(r.birds*r.weight/1000)).toFixed(2);
              const tC=r.temp>32?D.red:r.temp>30?D.amber:D.green;const mC=r.mortality>40?D.red:r.mortality>28?D.amber:D.green;
              return <tr key={r.id} onClick={()=>setSelected(r)} style={{borderBottom:`1px solid rgba(255,255,255,0.04)`,cursor:"pointer",transition:"background 0.12s"}}
                onMouseEnter={e=>e.currentTarget.style.background="rgba(59,130,246,0.06)"}
                onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <td style={{padding:"11px 12px",fontWeight:700,color:"#fff",fontFamily:"'JetBrains Mono',monospace",fontSize:12}}>{r.date}</td>
                <td style={{padding:"11px 12px"}}>{sheds.find(s=>s.id===r.shed)?.name||r.shed}</td>
                <td style={{padding:"11px 12px",color:D.muted}}>{r.day}</td>
                <td style={{padding:"11px 12px"}}><Pill label={r.session} color="info" size="xs"/></td>
                <td style={{padding:"11px 12px",fontFamily:"'JetBrains Mono',monospace",fontSize:12}}>{r.birds.toLocaleString()}</td>
                <td style={{padding:"11px 12px",fontWeight:700,color:mC}}>{r.mortality}</td>
                <td style={{padding:"11px 12px",fontFamily:"'JetBrains Mono',monospace",fontSize:12}}>{r.weight}g</td>
                <td style={{padding:"11px 12px",fontWeight:700,color:tC}}>{r.temp}°C</td>
                <td style={{padding:"11px 12px",fontFamily:"'JetBrains Mono',monospace",fontSize:12,color:+fcr>2?D.red:+fcr>1.75?D.amber:D.green}}>{fcr}</td>
                <td style={{padding:"11px 12px"}}><Pill label={r.lang||"en"} color="info" size="xs"/></td>
                <td style={{padding:"11px 12px"}}>{r.editedAt?<Pill label="Edited" color="warning" size="xs"/>:<Pill label="Original" color="ok" size="xs"/>}</td>
              </tr>;
            })}
          </tbody>
        </table>
        {filtered.length===0&&<p style={{textAlign:"center",padding:"40px",color:D.muted}}>No reports found.</p>}
      </div>
    </GCard>
    {selected&&!editMode&&<Modal title={`Report — ${selected.date}`} onClose={()=>setSelected(null)} width={640}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        {[["Date",selected.date],["Session",selected.session],["Batch Day",selected.day],["Supervisor",selected.supervisor],["Live Birds",selected.birds.toLocaleString()],["Mortality",selected.mortality],["Weight",selected.weight+"g"],["Temperature",selected.temp+"°C"],["Feed",selected.feed+"kg"],["Water",selected.water+"L"],["Feed Type",selected.feedtype],["Litter",selected.litter]].map(([l,v])=>(
          <div key={l} style={{background:"rgba(255,255,255,0.04)",borderRadius:10,padding:"10px 14px",border:"1px solid rgba(255,255,255,0.07)"}}>
            <div style={{fontSize:10,color:D.muted,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em"}}>{l}</div>
            <div style={{fontSize:14,fontWeight:700,color:"#fff",marginTop:4}}>{v||"—"}</div>
          </div>
        ))}
      </div>
      {selected.editedAt&&<div style={{marginTop:14,padding:"10px 14px",background:"rgba(245,158,11,0.1)",borderRadius:10,border:"1px solid rgba(245,158,11,0.2)"}}><p style={{fontSize:12,color:D.amber,fontWeight:600}}>{t.editedBy} · {new Date(selected.editedAt).toLocaleString()}</p></div>}
      <div style={{marginTop:18,display:"flex",justifyContent:"flex-end",gap:8}}>
        <Btn variant="outline" size="sm" onClick={()=>setSelected(null)}>{t.close}</Btn>
        {canEdit&&<Btn icon={Edit2} size="sm" onClick={()=>{setEditForm({...selected});setEditMode(true);}}>Edit</Btn>}
        {!canEdit&&<Pill label={t.readOnly} color="info"/>}
      </div>
    </Modal>}
    {editMode&&editForm&&<Modal title="Edit Report" onClose={()=>setEditMode(false)} width={600}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        <FInput label="Live Birds" value={editForm.birds} onChange={v=>setEditForm({...editForm,birds:+v})} type="number"/>
        <FInput label="Mortality" value={editForm.mortality} onChange={v=>setEditForm({...editForm,mortality:+v})} type="number"/>
        <FInput label="Weight (g)" value={editForm.weight} onChange={v=>setEditForm({...editForm,weight:+v})} type="number"/>
        <FInput label="Temperature (°C)" value={editForm.temp} onChange={v=>setEditForm({...editForm,temp:+v})} type="number"/>
        <FInput label="Feed (kg)" value={editForm.feed} onChange={v=>setEditForm({...editForm,feed:+v})} type="number"/>
        <FInput label="Water (L)" value={editForm.water} onChange={v=>setEditForm({...editForm,water:+v})} type="number"/>
        <div style={{gridColumn:"span 2"}}>
          <label style={{fontSize:11,fontWeight:700,color:D.muted,textTransform:"uppercase",letterSpacing:"0.07em",display:"block",marginBottom:6}}>Event / Notes</label>
          <textarea value={editForm.event} onChange={e=>setEditForm({...editForm,event:e.target.value})} rows={3} style={{width:"100%",padding:"10px 14px",borderRadius:10,border:"1.5px solid rgba(255,255,255,0.1)",fontSize:14,color:D.text,background:"rgba(255,255,255,0.04)",fontFamily:"'DM Sans',sans-serif",resize:"vertical",outline:"none"}}/>
        </div>
      </div>
      <div style={{marginTop:18,display:"flex",justifyContent:"flex-end",gap:8}}>
        <Btn variant="outline" onClick={()=>setEditMode(false)}>{t.cancel}</Btn>
        <Btn icon={Check} onClick={saveEdit}>{t.save}</Btn>
      </div>
    </Modal>}
  </div>;
}

/* ══════════════════════════════════════════════════════
   CCTV TAB
══════════════════════════════════════════════════════ */
function CCTVTab({cameras,setCameras,sheds,user,lang}){
  const t=T[lang];const [showAdd,setShowAdd]=useState(false);
  const [form,setForm]=useState({shed:"",name:"",url:""});const [copied,setCopied]=useState(null);
  const canEdit=user.role==="owner"||user.role==="supervisor";
  const add=async()=>{if(!form.name||!form.shed)return;const saved=await DB.insertCCTV({...form,id:"cam_"+Date.now(),active:true});setCameras(c=>[...c,saved]);setShowAdd(false);setForm({shed:"",name:"",url:""});};
  const remove=async(id)=>{setCameras(c=>c.filter(x=>x.id!==id));await DB.deleteCCTV(id);};
  const copy=(url,id)=>{navigator.clipboard.writeText(url).then(()=>{setCopied(id);setTimeout(()=>setCopied(null),2000);});};
  return <div className="fade-up">
    {canEdit&&<div style={{marginBottom:20,display:"flex",justifyContent:"flex-end"}}><Btn icon={Plus} onClick={()=>setShowAdd(true)}>{t.addCamera}</Btn></div>}
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))",gap:16}}>
      {cameras.map(cam=>(
        <GCard key={cam.id} noPad>
          <div style={{height:200,background:"rgba(0,0,0,0.5)",position:"relative",borderRadius:"18px 18px 0 0",overflow:"hidden"}}>
            {cam.url&&(cam.url.startsWith("http")?<iframe src={cam.url} title={cam.name} style={{width:"100%",height:"100%",border:"none"}} sandbox="allow-same-origin allow-scripts"/>
              :<div style={{display:"grid",placeItems:"center",height:"100%",textAlign:"center",padding:20}}><div><Video size={36} color="rgba(255,255,255,0.3)" style={{marginBottom:10}}/><p style={{color:"rgba(255,255,255,0.6)",fontSize:13,fontWeight:600}}>RTSP — Open in VLC/NVR</p></div></div>)}
            {!cam.url&&<div style={{display:"grid",placeItems:"center",height:"100%",background:"rgba(6,13,26,0.8)"}}><div style={{textAlign:"center"}}><Camera size={40} color="rgba(255,255,255,0.15)" style={{marginBottom:12}}/><p style={{color:"rgba(255,255,255,0.3)",fontSize:13}}>No stream configured</p></div></div>}
            <div style={{position:"absolute",top:10,left:10,background:"rgba(0,0,0,0.7)",borderRadius:99,padding:"4px 10px",display:"flex",alignItems:"center",gap:5,backdropFilter:"blur(8px)"}}>
              <div style={{width:7,height:7,borderRadius:"50%",background:cam.url?D.green:D.red,boxShadow:`0 0 6px ${cam.url?D.green:D.red}`}}/>
              <span style={{fontSize:11,color:"#fff",fontWeight:700}}>{cam.url?"LIVE":"OFFLINE"}</span>
            </div>
          </div>
          <div style={{padding:"14px 18px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
              <div><h4 style={{fontSize:14,fontWeight:700,color:"#fff"}}>{cam.name}</h4><p style={{fontSize:12,color:D.muted}}>{sheds.find(s=>s.id===cam.shed)?.name||cam.shed}</p></div>
              {canEdit&&<button onClick={()=>remove(cam.id)} style={{background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.2)",borderRadius:8,padding:7,cursor:"pointer",color:D.red,display:"grid",placeItems:"center"}}><Trash2 size={14}/></button>}
            </div>
            {cam.url&&<Btn variant="outline" size="sm" icon={copied===cam.id?Check:Copy} onClick={()=>copy(cam.url,cam.id)}>{copied===cam.id?"Copied!":t.copyUrl||"Copy URL"}</Btn>}
          </div>
        </GCard>
      ))}
    </div>
    {showAdd&&<Modal title={t.addCamera||"Add Camera"} onClose={()=>setShowAdd(false)}>
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        <FInput label="Camera Name" value={form.name} onChange={v=>setForm({...form,name:v})} required/>
        <FSelect label="Shed" value={form.shed} onChange={v=>setForm({...form,shed:v})} required options={[{value:"",label:"Select shed..."},...sheds.filter(s=>s.active).map(s=>({value:s.id,label:s.name}))]}/>
        <FInput label="Stream URL" value={form.url} onChange={v=>setForm({...form,url:v})} placeholder="http:// or rtsp://..."/>
        <div style={{background:"rgba(59,130,246,0.08)",borderRadius:10,padding:"10px 14px",border:"1px solid rgba(59,130,246,0.15)"}}><p style={{fontSize:12,color:"#93C5FD",fontWeight:600}}>HTTP/MJPEG/HLS play inline · RTSP needs VLC/NVR</p></div>
        <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}><Btn variant="outline" onClick={()=>setShowAdd(false)}>{t.cancel}</Btn><Btn onClick={add}>{t.save}</Btn></div>
      </div>
    </Modal>}
  </div>;
}

/* ══════════════════════════════════════════════════════
   PHOTOS TAB
══════════════════════════════════════════════════════ */
function PhotosTab({photos,setPhotos,sheds,lang}){
  const t=T[lang];const [filter,setFilter]=useState("all");const [selected,setSelected]=useState(null);
  const [caption,setCaption]=useState("");const [shed,setShed]=useState("");const fileRef=useRef(null);
  const upload=async e=>{const file=e.target.files[0];if(!file||file.size>5*1024*1024){alert("Max 5MB");return;}try{const saved=await DB.uploadPhoto(file,shed,caption);setPhotos(p=>[saved,...p]);setCaption("");setShed("");}catch(err){alert("Upload failed: "+err.message);}e.target.value="";};
  const del=async(id,path)=>{await DB.deletePhoto(id,path);setPhotos(p=>p.filter(x=>x.id!==id));setSelected(null);};
  const filtered=filter==="all"?photos:photos.filter(p=>p.shed===filter);
  return <div className="fade-up">
    <GCard style={{marginBottom:20}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr auto",gap:12,alignItems:"end"}}>
        <FSelect label="Shed Tag" value={shed} onChange={setShed} options={[{value:"",label:"All Sheds"},...sheds.filter(s=>s.active).map(s=>({value:s.id,label:s.name}))]}/>
        <FInput label="Caption" value={caption} onChange={setCaption} placeholder="Describe this photo..."/>
        <div style={{paddingBottom:0}}><input type="file" ref={fileRef} accept="image/*" onChange={upload} style={{display:"none"}}/><Btn icon={Upload} onClick={()=>fileRef.current?.click()}>{t.uploadPhoto||"Upload"}</Btn></div>
      </div>
    </GCard>
    <div style={{display:"flex",gap:8,marginBottom:16}}>
      {[{id:"all",label:t.allSheds},...sheds.filter(s=>s.active).map(s=>({id:s.id,label:s.name}))].map(f=>(
        <button key={f.id} onClick={()=>setFilter(f.id)} style={{padding:"6px 14px",borderRadius:99,border:`1.5px solid ${filter===f.id?"rgba(59,130,246,0.5)":"rgba(255,255,255,0.08)"}`,background:filter===f.id?"rgba(59,130,246,0.15)":"rgba(255,255,255,0.04)",color:filter===f.id?"#93C5FD":D.muted,fontSize:13,fontWeight:600,cursor:"pointer"}}>{f.label}</button>
      ))}
    </div>
    {filtered.length===0&&<div style={{textAlign:"center",padding:"80px",color:D.muted}}><ImageIcon size={56} color="rgba(59,130,246,0.2)" style={{margin:"0 auto 16px"}}/><p style={{fontSize:15,fontWeight:600}}>{t.noPhotos||"No photos yet"}</p></div>}
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:14}}>
      {filtered.map(photo=>(
        <div key={photo.id} onClick={()=>setSelected(photo)} style={{borderRadius:14,overflow:"hidden",cursor:"pointer",border:`1px solid ${D.glassBorder}`,transition:"all 0.2s"}}
          onMouseEnter={e=>{e.currentTarget.style.transform="scale(1.03)";e.currentTarget.style.boxShadow=`0 12px 35px rgba(0,0,0,0.4)`;}}
          onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="";}}>
          <img src={photo.src} alt={photo.caption} style={{width:"100%",height:160,objectFit:"cover",display:"block"}}/>
          <div style={{padding:"10px 12px",background:"rgba(15,31,61,0.95)"}}>
            <p style={{fontSize:13,fontWeight:700,color:"#fff",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{photo.caption||"No caption"}</p>
            <p style={{fontSize:11,color:D.muted,marginTop:2}}>{sheds.find(s=>s.id===photo.shed)?.name||"General"} · {photo.date}</p>
          </div>
        </div>
      ))}
    </div>
    {selected&&<Modal title={selected.caption||"Photo"} onClose={()=>setSelected(null)} width={800}>
      <img src={selected.src} alt={selected.caption} style={{width:"100%",borderRadius:12,maxHeight:"60vh",objectFit:"contain"}}/>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:14}}>
        <p style={{fontSize:13,color:D.muted}}>{sheds.find(s=>s.id===selected.shed)?.name||"General"} · {selected.date}</p>
        <Btn variant="danger" size="sm" icon={Trash2} onClick={()=>del(selected.id)}>Delete</Btn>
      </div>
    </Modal>}
  </div>;
}

/* ══════════════════════════════════════════════════════
   LOGIN PAGE
══════════════════════════════════════════════════════ */
function LoginPage({onLogin,lang,setLang}){
  const [email,setEmail]=useState("");const [p,setP]=useState("");const [show,setShow]=useState(false);const [err,setErr]=useState("");const [logging,setLogging]=useState(false);
  const [particles]=useState(()=>Array.from({length:20},(_,i)=>({id:i,x:Math.random()*100,y:Math.random()*100,size:2+Math.random()*4,delay:Math.random()*5})));
  const t=T[lang];
  const tryLogin=async()=>{
    if(!email||!p)return;
    setLogging(true);setErr("");
    try{
      await signIn(email,p);
      const{data:{user:authUser}}=await supabase.auth.getUser();
      const profile=await getProfile(authUser.id);
      setLang(profile.default_lang||"en");
      onLogin({...profile,email:authUser.email});
    }catch(e){setErr("Login failed: please check console");}
    setLogging(false);
  };
  // Allow click-to-fill demo accounts
  const fillDemo=(acc)=>{setEmail(acc.email);setP(acc.pass);};
  return <div style={{minHeight:"100vh",background:D.bg0,display:"grid",placeItems:"center",padding:20,position:"relative",overflow:"hidden"}}>
    <style>{G}</style>
    <AmbientBg/>
    {/* Floating particles */}
    {particles.map(pk=><div key={pk.id} style={{position:"fixed",left:`${pk.x}%`,top:`${pk.y}%`,width:pk.size,height:pk.size,borderRadius:"50%",background:"rgba(59,130,246,0.4)",animation:`float ${3+pk.delay}s ease-in-out infinite ${pk.delay}s`,pointerEvents:"none"}}/>)}

    <div style={{width:"100%",maxWidth:480,position:"relative",zIndex:1}}>
      {/* Gita quote */}
      <div style={{background:"rgba(139,92,246,0.1)",border:"1px solid rgba(139,92,246,0.2)",borderRadius:14,padding:"12px 18px",marginBottom:24,backdropFilter:"blur(12px)"}}>
        <div style={{display:"flex",gap:10,alignItems:"flex-start"}}><BookOpen size={14} color="#A78BFA" style={{marginTop:2,flexShrink:0}}/><p style={{fontSize:12,color:"#A78BFA",lineHeight:1.7,fontStyle:"italic"}}>{t.gita}</p></div>
        <p style={{fontSize:10,color:"rgba(167,139,250,0.5)",marginTop:6,textAlign:"right",fontWeight:600}}>— Bhagavad Gita 2.47</p>
      </div>

      {/* Card */}
      <div style={{background:"rgba(15,31,61,0.85)",border:`1px solid ${D.glassBorder}`,borderRadius:24,padding:"36px 40px",backdropFilter:"blur(24px)",boxShadow:"0 30px 100px rgba(0,0,0,0.5)"}}>
        {/* Hen + title */}
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",marginBottom:30}}>
          <div style={{position:"relative",marginBottom:12}}>
            <div style={{position:"absolute",inset:-12,borderRadius:"50%",background:"radial-gradient(circle,rgba(245,158,11,0.15) 0%,transparent 70%)"}}/>
            <HenLogo size={72} animated={true}/>
          </div>
          <div style={{fontFamily:"'Syne',sans-serif",fontSize:26,fontWeight:800,color:"#fff",letterSpacing:"-0.02em"}}>{t.appName}</div>
          <div style={{fontSize:12,color:"#10B981",fontWeight:600,letterSpacing:"0.08em",textTransform:"uppercase",marginTop:3}}>{t.tagline}</div>
          <div style={{fontSize:11,color:D.muted,marginTop:5}}>Chittoor District · Andhra Pradesh</div>
        </div>

        {/* Lang */}
        <div style={{display:"flex",gap:6,marginBottom:22}}>
          {[["en","English"],["te","తెలుగు"],["hi","हिंदी"],["mai","मैथिली"]].map(([l,lbl])=>(
            <button key={l} onClick={()=>setLang(l)} style={{flex:1,padding:"7px 4px",borderRadius:9,border:`1.5px solid ${lang===l?"rgba(59,130,246,0.5)":"rgba(255,255,255,0.08)"}`,background:lang===l?"rgba(59,130,246,0.2)":"transparent",color:lang===l?"#93C5FD":"#475569",fontSize:11,fontWeight:700,cursor:"pointer",transition:"all 0.15s"}}>{lbl}</button>
          ))}
        </div>

        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <FInput label="Email" value={email} onChange={setEmail} type="email" placeholder="Enter username"/>
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            <label style={{fontSize:11,fontWeight:700,color:D.muted,textTransform:"uppercase",letterSpacing:"0.07em"}}>{t.password}</label>
            <div style={{position:"relative"}}>
              <input type={show?"text":"password"} value={p} onChange={e=>setP(e.target.value)} onKeyDown={e=>e.key==="Enter"&&tryLogin()} placeholder="Enter password"
                style={{width:"100%",padding:"10px 44px 10px 14px",borderRadius:10,border:"1.5px solid rgba(255,255,255,0.1)",fontSize:14,color:D.text,background:"rgba(255,255,255,0.05)",fontFamily:"'DM Sans',sans-serif",outline:"none"}}/>
              <button onClick={()=>setShow(!show)} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:D.muted}}>{show?<EyeOff size={16}/>:<Eye size={16}/>}</button>
            </div>
          </div>
          {err&&<p style={{fontSize:12,color:D.red,fontWeight:600}}>{err}</p>}
          <Btn onClick={tryLogin} size="lg" loading={logging} style={{width:"100%",justifyContent:"center",marginTop:4}}>{logging?"Signing in…":t.login}</Btn>
        </div>

        {/* Demo accounts */}
        <div style={{marginTop:24,borderTop:`1px solid ${D.glassBorder}`,paddingTop:20}}>
          <p style={{fontSize:11,color:D.muted,fontWeight:700,marginBottom:12,textTransform:"uppercase",letterSpacing:"0.07em"}}>Demo Accounts — Click to Auto-Fill</p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            {DEMO_ACCOUNTS.map(usr=>(
              <button key={usr.user} onClick={()=>fillDemo(usr)} style={{padding:"10px 12px",borderRadius:12,border:`1px solid ${D.glassBorder}`,background:"rgba(255,255,255,0.04)",cursor:"pointer",textAlign:"left",transition:"all 0.15s"}}
                onMouseEnter={e=>{e.currentTarget.style.background="rgba(59,130,246,0.12)";e.currentTarget.style.borderColor="rgba(59,130,246,0.3)";}}
                onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,0.04)";e.currentTarget.style.borderColor=D.glassBorder;}}>
                <div style={{fontSize:13,fontWeight:700,color:"#fff"}}>{usr.icon} {usr.name}</div>
                <div style={{fontSize:11,color:D.muted,marginTop:2,fontFamily:"'JetBrains Mono',monospace"}}>{usr.user}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>;
}


/* ══════════════════════════════════════════════════════
   TEAM TAB — Owner creates & manages all users
══════════════════════════════════════════════════════ */
function TeamTab({lang,currentUser}){
  const t=T[lang];
  const [teamUsers,setTeamUsers]=useState([]);
  const [loading,setLoading]=useState(true);
  const [showForm,setShowForm]=useState(false);
  const [editUser,setEditUser]=useState(null);
  const [toast,setToast]=useState(null);
  const [saving,setSaving]=useState(false);
  const [confirmDelete,setConfirmDelete]=useState(null);

  const blank={name:"",email:"",phone:"",role:"worker",default_lang:"en",password:"",confirmPassword:""};
  const [form,setForm]=useState(blank);
  const [showPass,setShowPass]=useState(false);

  const ROLE_COLORS={owner:"rgba(245,158,11,0.15)",supervisor:"rgba(16,185,129,0.15)",manager:"rgba(59,130,246,0.15)",worker:"rgba(139,92,246,0.15)"};
  const ROLE_TEXT={owner:"#FCD34D",supervisor:"#6EE7B7",manager:"#93C5FD",worker:"#C4B5FD"};
  const ROLE_ICONS={owner:"👑",supervisor:"🧑‍🌾",manager:"👔",worker:"👷"};

  const loadUsers=async()=>{
    setLoading(true);
    try{const d=await Users.list();setTeamUsers(d.users||[]);}
    catch(e){setToast({message:"Failed to load users: "+e.message,type:"error"});}
    setLoading(false);
  };

  useEffect(()=>{loadUsers();},[]);

  const openCreate=()=>{setForm(blank);setEditUser(null);setShowForm(true);};
  const openEdit=(u)=>{setForm({...u,password:"",confirmPassword:""});setEditUser(u);setShowForm(true);};

  const save=async()=>{
    if(!form.name||!form.email||!form.role)return setToast({message:"Name, email and role are required",type:"error"});
    if(!editUser&&!form.password)return setToast({message:"Password is required for new users",type:"error"});
    if(form.password&&form.password!==form.confirmPassword)return setToast({message:"Passwords do not match",type:"error"});
    if(form.password&&form.password.length<6)return setToast({message:"Password must be at least 6 characters",type:"error"});
    setSaving(true);
    try{
      if(editUser){
        await Users.update(editUser.id,{name:form.name,role:form.role,phone:form.phone,default_lang:form.default_lang,newPassword:form.password||undefined});
        setToast({message:`${form.name} updated successfully!`,type:"success"});
      }else{
        await Users.create({name:form.name,email:form.email,phone:form.phone,role:form.role,default_lang:form.default_lang,password:form.password});
        setToast({message:`${form.name} added to Sri Farms!`,type:"success"});
      }
      await loadUsers();setShowForm(false);setForm(blank);
    }catch(e){setToast({message:"Error: "+e.message,type:"error"});}
    setSaving(false);
  };

  const deleteUser=async(u)=>{
    setSaving(true);
    try{
      await Users.remove(u.id);
      setTeamUsers(prev=>prev.filter(x=>x.id!==u.id));
      setToast({message:`${u.name} removed from team`,type:"success"});
    }catch(e){setToast({message:"Error: "+e.message,type:"error"});}
    setConfirmDelete(null);setSaving(false);
  };

  const LANG_LABELS={en:"English",te:"తెలుగు",hi:"हिंदी",mai:"मैथिली"};

  return <div className="fade-up">
    {toast&&<Toast message={toast.message} type={toast.type} onClose={()=>setToast(null)}/>}

    {/* Header */}
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
      <div>
        <h2 style={{fontFamily:"'Syne',sans-serif",fontSize:22,fontWeight:800,color:"#fff"}}>Team Management</h2>
        <p style={{fontSize:13,color:D.muted,marginTop:4}}>Create accounts, assign roles and set passwords for your farm workers</p>
      </div>
      <Btn icon={UserPlus} onClick={openCreate} size="lg">Add Team Member</Btn>
    </div>

    {/* Role legend */}
    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:24}}>
      {[
        {role:"owner",desc:"Full access. Can manage all users, sheds, reports and settings."},
        {role:"supervisor",desc:"Can view AI predictions, history, CCTV. Can submit reports."},
        {role:"manager",desc:"Can view reports and dashboard. Cannot access AI or CCTV."},
        {role:"worker",desc:"Can submit daily reports and view photos only."},
      ].map(r=><div key={r.role} style={{background:ROLE_COLORS[r.role],border:`1px solid ${ROLE_TEXT[r.role]}30`,borderRadius:14,padding:"14px 16px"}}>
        <div style={{fontSize:18,marginBottom:6}}>{ROLE_ICONS[r.role]}</div>
        <div style={{fontSize:13,fontWeight:800,color:ROLE_TEXT[r.role],textTransform:"capitalize",marginBottom:4}}>{r.role}</div>
        <p style={{fontSize:11,color:D.muted,lineHeight:1.6}}>{r.desc}</p>
      </div>)}
    </div>

    {/* Users list */}
    {loading?<div style={{textAlign:"center",padding:"60px",color:D.muted}}>
      <div className="spin" style={{width:32,height:32,border:"3px solid rgba(59,130,246,0.3)",borderTopColor:D.blue,borderRadius:"50%",margin:"0 auto 16px"}}/>
      Loading team members...
    </div>:<div style={{display:"flex",flexDirection:"column",gap:12}}>
      {teamUsers.map(u=>{
        const isMe=u.id===currentUser.id;
        return <div key={u.id} style={{background:"rgba(255,255,255,0.04)",border:`1px solid ${D.glassBorder}`,borderRadius:16,padding:"18px 22px",display:"flex",alignItems:"center",gap:16,transition:"all 0.2s"}}
          onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.07)"}
          onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,0.04)"}>
          {/* Avatar */}
          <div style={{width:52,height:52,borderRadius:14,background:ROLE_COLORS[u.role],border:`1px solid ${ROLE_TEXT[u.role]}30`,display:"grid",placeItems:"center",fontSize:22,flexShrink:0}}>{ROLE_ICONS[u.role]}</div>
          {/* Info */}
          <div style={{flex:1,minWidth:0}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4,flexWrap:"wrap"}}>
              <span style={{fontSize:16,fontWeight:800,color:"#fff"}}>{u.name}</span>
              {isMe&&<span style={{fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:99,background:"rgba(59,130,246,0.2)",color:"#93C5FD",border:"1px solid rgba(59,130,246,0.3)"}}>YOU</span>}
              <Pill label={u.role} color={u.role==="owner"?"warning":u.role==="supervisor"?"ok":u.role==="manager"?"info":"blue"}/>
              <span style={{fontSize:11,color:D.muted}}>{LANG_LABELS[u.default_lang]||u.default_lang}</span>
            </div>
            <div style={{display:"flex",gap:16,fontSize:12,color:D.muted,flexWrap:"wrap"}}>
              <span>📧 {u.email}</span>
              {u.phone&&<span>📞 {u.phone}</span>}
            </div>
          </div>
          {/* Actions - can't delete yourself */}
          {!isMe&&<div style={{display:"flex",gap:8,flexShrink:0}}>
            <Btn variant="outline" size="sm" icon={Edit2} onClick={()=>openEdit(u)}>Edit</Btn>
            <Btn variant="danger" size="sm" icon={Trash2} onClick={()=>setConfirmDelete(u)}>Remove</Btn>
          </div>}
          {isMe&&<div style={{padding:"6px 14px",borderRadius:99,fontSize:11,fontWeight:700,color:"#6EE7B7",background:"rgba(16,185,129,0.1)",border:"1px solid rgba(16,185,129,0.2)",flexShrink:0}}>
            <ShieldCheck size={12} style={{display:"inline",marginRight:4}}/>Farm Owner
          </div>}
        </div>;
      })}
      {teamUsers.length===0&&<div style={{textAlign:"center",padding:"60px",color:D.muted}}>
        <Users2 size={48} color="rgba(59,130,246,0.2)" style={{margin:"0 auto 16px"}}/>
        <p style={{fontSize:15,fontWeight:600}}>No team members yet</p>
        <p style={{fontSize:13,marginTop:6}}>Click "Add Team Member" to create your first account</p>
      </div>}
    </div>}

    {/* Add/Edit Modal */}
    {showForm&&<Modal title={editUser?"Edit Team Member":"Add New Team Member"} onClose={()=>{setShowForm(false);setForm(blank);}} width={540}>
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        {/* Role selector - visual cards */}
        <div>
          <label style={{fontSize:11,fontWeight:700,color:D.muted,textTransform:"uppercase",letterSpacing:"0.07em",display:"block",marginBottom:10}}>Role <span style={{color:D.red}}>*</span></label>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            {["owner","supervisor","manager","worker"].map(r=><button key={r} onClick={()=>setForm({...form,role:r})}
              style={{padding:"10px 14px",borderRadius:12,border:`2px solid ${form.role===r?ROLE_TEXT[r]:"rgba(255,255,255,0.08)"}`,background:form.role===r?ROLE_COLORS[r]:"rgba(255,255,255,0.03)",cursor:"pointer",textAlign:"left",transition:"all 0.15s"}}>
              <div style={{fontSize:16,marginBottom:3}}>{ROLE_ICONS[r]}</div>
              <div style={{fontSize:12,fontWeight:700,color:form.role===r?ROLE_TEXT[r]:"#94A3B8",textTransform:"capitalize"}}>{r}</div>
            </button>)}
          </div>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
          <FInput label="Full Name" value={form.name} onChange={v=>setForm({...form,name:v})} required placeholder="e.g. Ravi Kumar"/>
          <FInput label="Phone Number" value={form.phone||""} onChange={v=>setForm({...form,phone:v})} placeholder="9876543210"/>
          <FInput label="Email Address" value={form.email} onChange={v=>setForm({...form,email:v})} required placeholder="ravi@srifarms.in" readOnly={!!editUser} type="email"
            style={{gridColumn:editUser?"span 1":"span 1"}}/>
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            <label style={{fontSize:11,fontWeight:700,color:D.muted,textTransform:"uppercase",letterSpacing:"0.07em"}}>App Language</label>
            <select value={form.default_lang||"en"} onChange={e=>setForm({...form,default_lang:e.target.value})}
              style={{padding:"10px 14px",borderRadius:10,border:"1.5px solid rgba(255,255,255,0.1)",fontSize:14,color:D.text,background:"rgba(255,255,255,0.05)",fontFamily:"'DM Sans',sans-serif",outline:"none"}}>
              <option value="en" style={{background:"#0F1F3D"}}>English</option>
              <option value="te" style={{background:"#0F1F3D"}}>తెలుగు</option>
              <option value="hi" style={{background:"#0F1F3D"}}>हिंदी</option>
              <option value="mai" style={{background:"#0F1F3D"}}>मैथिली</option>
            </select>
          </div>
        </div>

        {/* Password section */}
        <div style={{padding:"16px",background:"rgba(59,130,246,0.06)",borderRadius:12,border:"1px solid rgba(59,130,246,0.15)"}}>
          <div style={{fontSize:12,fontWeight:700,color:"#93C5FD",marginBottom:12,display:"flex",alignItems:"center",gap:6}}>
            <KeyRound size={13}/>{editUser?"Reset Password (leave blank to keep current)":"Set Password"}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <div style={{position:"relative"}}>
              <FInput label={editUser?"New Password":"Password"} value={form.password} onChange={v=>setForm({...form,password:v})}
                type={showPass?"text":"password"} placeholder="Min 6 characters" required={!editUser}/>
            </div>
            <FInput label="Confirm Password" value={form.confirmPassword} onChange={v=>setForm({...form,confirmPassword:v})}
              type={showPass?"text":"password"} placeholder="Re-enter password"/>
          </div>
          <button onClick={()=>setShowPass(!showPass)} style={{marginTop:8,fontSize:12,color:"#93C5FD",background:"none",border:"none",cursor:"pointer",fontWeight:600,display:"flex",alignItems:"center",gap:5}}>
            {showPass?<EyeOff size={13}/>:<Eye size={13}/>}{showPass?"Hide":"Show"} passwords
          </button>
          {form.password&&form.confirmPassword&&form.password!==form.confirmPassword&&<p style={{fontSize:12,color:D.red,marginTop:6,fontWeight:600}}>⚠ Passwords do not match</p>}
          {form.password&&form.password===form.confirmPassword&&form.password.length>=6&&<p style={{fontSize:12,color:D.green,marginTop:6,fontWeight:600}}>✓ Password looks good</p>}
        </div>
      </div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:20}}>
        <p style={{fontSize:12,color:D.muted}}>This person will login with their email + password</p>
        <div style={{display:"flex",gap:10}}>
          <Btn variant="outline" onClick={()=>{setShowForm(false);setForm(blank);}}>Cancel</Btn>
          <Btn icon={saving?RefreshCw:Check} loading={saving} onClick={save}>{editUser?"Save Changes":"Add to Team"}</Btn>
        </div>
      </div>
    </Modal>}

    {/* Delete confirm */}
    {confirmDelete&&<Modal title="Remove Team Member?" onClose={()=>setConfirmDelete(null)} width={420}>
      <div style={{textAlign:"center",padding:"8px 0 16px"}}>
        <div style={{fontSize:48,marginBottom:12}}>{ROLE_ICONS[confirmDelete.role]}</div>
        <p style={{fontSize:16,fontWeight:700,color:"#fff",marginBottom:6}}>{confirmDelete.name}</p>
        <p style={{fontSize:13,color:D.muted,marginBottom:20}}>This will permanently delete their account and they will no longer be able to login.</p>
        <div style={{display:"flex",gap:10,justifyContent:"center"}}>
          <Btn variant="outline" onClick={()=>setConfirmDelete(null)}>Cancel</Btn>
          <Btn variant="danger" icon={Trash2} loading={saving} onClick={()=>deleteUser(confirmDelete)}>Yes, Remove</Btn>
        </div>
      </div>
    </Modal>}
  </div>;
}

/* ══════════════════════════════════════════════════════
   MAIN APP
══════════════════════════════════════════════════════ */
export default function App(){
  const [user,setUser]=useState(null);const [lang,setLang]=useState("en");const [tab,setTab]=useState("dashboard");
  const [sheds,setSheds]=useState([]);const [batches,setBatches]=useState([]);
  const [reports,setReports]=useState([]);const [alerts,setAlerts]=useState([]);
  const [cameras,setCameras]=useState([]);const [photos,setPhotos]=useState([]);
  const [loaded,setLoaded]=useState(false);

  // Restore session on page reload
  useEffect(()=>{
    supabase.auth.getSession().then(async({data:{session}})=>{
      if(session){
        try{
          const profile=await getProfile(session.user.id);
          setUser({...profile,email:session.user.email});
          setLang(profile.default_lang||"en");
        }catch{}
      }
      setLoaded(true);
    });
    // Listen for auth changes
    const{data:{subscription}}=supabase.auth.onAuthStateChange(async(event,session)=>{
      if(event==="SIGNED_OUT"){setUser(null);setSheds([]);setBatches([]);setReports([]);setAlerts([]);setCameras([]);setPhotos([]);}
    });
    return()=>subscription.unsubscribe();
  },[]);

  // Load all data when user logs in
  useEffect(()=>{
    if(!user)return;
    (async()=>{
      try{
        const[s,b,r,a,cam,ph]=await Promise.all([DB.getSheds(),DB.getBatches(),DB.getReports(),DB.getAlerts(),DB.getCCTV(),DB.getPhotos()]);
        setSheds(s);setBatches(b);setReports(r);setAlerts(a);setCameras(cam);setPhotos(ph);
      }catch(err){console.error("Data load error:",err);}
    })();
  },[user]);

  // Realtime: new alerts and reports pushed to all clients
  useEffect(()=>{
    if(!user)return;
    const channel=supabase.channel("farm-realtime")
      .on("postgres_changes",{event:"INSERT",schema:"public",table:"alerts"},(payload)=>{
        const a={...payload.new,shed:payload.new.shed_id};
        setAlerts(prev=>[a,...prev]);
      })
      .on("postgres_changes",{event:"INSERT",schema:"public",table:"reports"},(payload)=>{
        const r={...payload.new,shed:payload.new.shed_id};
        setReports(prev=>[r,...prev]);
      })
      .on("postgres_changes",{event:"UPDATE",schema:"public",table:"alerts"},(payload)=>{
        const a={...payload.new,shed:payload.new.shed_id};
        setAlerts(prev=>prev.map(x=>x.id===a.id?a:x));
      })
      .subscribe();
    return()=>supabase.removeChannel(channel);
  },[user]);

  if(!loaded)return <div style={{minHeight:"100vh",background:D.bg0,display:"grid",placeItems:"center"}}>
    <style>{G}</style>
    <AmbientBg/>
    <div style={{textAlign:"center",position:"relative",zIndex:1}}>
      <div style={{marginBottom:20}}><HenLogo size={80} animated={true}/></div>
      <div style={{fontFamily:"'Syne',sans-serif",fontSize:22,fontWeight:800,color:"#fff",marginBottom:6}}>Sri Farms</div>
      <div style={{width:40,height:3,background:`linear-gradient(90deg,${D.blue},${D.green})`,borderRadius:99,margin:"0 auto 16px",animation:"shimmer 1.5s ease-in-out infinite",backgroundSize:"200% 100%"}}/>
      <p style={{fontSize:13,color:D.muted}}>Loading farm data…</p>
    </div>
  </div>;

  if(!user)return <LoginPage onLogin={setUser} lang={lang} setLang={setLang}/>;

  const t=T[lang];
  const PAGE={
    dashboard:<DashboardTab reports={reports} sheds={sheds} batches={batches} alerts={alerts} lang={lang}/>,
    sheds:<ShedsTab sheds={sheds} setSheds={setSheds} user={user} lang={lang} batches={batches}/>,
    batches:<BatchesTab batches={batches} setBatches={setBatches} sheds={sheds} lang={lang}/>,
    report:<ReportTab sheds={sheds} batches={batches} reports={reports} setReports={setReports} setAlerts={setAlerts} alerts={alerts} user={user} lang={lang}/>,
    alerts:<AlertsTab alerts={alerts} setAlerts={setAlerts} sheds={sheds} lang={lang}/>,
    weekly:<WeeklyTab reports={reports} sheds={sheds} lang={lang}/>,
    aiPredict:<AIPredictTab sheds={sheds} batches={batches} reports={reports} lang={lang}/>,
    history:<HistoryTab reports={reports} setReports={setReports} sheds={sheds} user={user} lang={lang}/>,
    cctv:<CCTVTab cameras={cameras} setCameras={setCameras} sheds={sheds} user={user} lang={lang}/>,
    photos:<PhotosTab photos={photos} setPhotos={setPhotos} sheds={sheds} lang={lang}/>,
    team:<TeamTab lang={lang} currentUser={user}/>,
  };

  return <div style={{display:"flex",minHeight:"100vh",background:D.bg0,fontFamily:"'DM Sans',sans-serif"}}>
    <style>{G}</style>
    <AmbientBg/>
    <Sidebar tab={tab} setTab={setTab} user={user} lang={lang} setLang={setLang} alerts={alerts} onSignOut={async()=>{await signOut();setUser(null);}}/>
    <div style={{flex:1,marginLeft:240,display:"flex",flexDirection:"column",minHeight:"100vh",position:"relative",zIndex:1}}>
      <TopBar user={user} tab={tab} lang={lang} alerts={alerts}/>
      <LiveTicker reports={reports} sheds={sheds}/>
      <GitaStrip lang={lang}/>
      <main style={{flex:1,padding:"24px 28px",overflow:"auto"}}>
        {PAGE[tab]||<p style={{color:D.muted}}>Page not found</p>}
      </main>
      <footer style={{padding:"12px 28px",borderTop:`1px solid ${D.glassBorder}`,display:"flex",justifyContent:"space-between",alignItems:"center",background:"rgba(6,13,26,0.6)",backdropFilter:"blur(12px)"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <HenLogo size={24} animated={false}/>
          <span style={{fontSize:12,color:D.muted}}>Sri Farms · Chittoor District, AP · Private & Confidential</span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:6,fontSize:12,color:D.muted}}>
          <div style={{width:6,height:6,borderRadius:"50%",background:D.green,boxShadow:`0 0 6px ${D.green}`}}/>
          All systems operational
        </div>
      </footer>
    </div>
  </div>;
}
