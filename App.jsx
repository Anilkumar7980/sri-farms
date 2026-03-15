import { useState, useEffect, useRef, useCallback } from "react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { LayoutDashboard, Building2, Package, ClipboardList, Bell, CalendarDays, Cpu, History, Video, ImageIcon, LogOut, Plus, X, Check, AlertTriangle, AlertCircle, Info, TrendingUp, TrendingDown, Bird, Scale, Activity, Eye, EyeOff, Edit2, Trash2, Camera, Upload, RefreshCw, Copy, Search, Leaf, CheckCircle, MapPin, BookOpen, Zap, Star, Flame, Droplets, Thermometer, Wind, ChevronRight, Timer, Shield, Users2, KeyRound, UserPlus, ShieldCheck } from "lucide-react";

/* ══════════════════════════════════════════════════════
   GLOBAL STYLES
══════════════════════════════════════════════════════ */
const G = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Rajdhani:wght@500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
html,body{height:100%;font-family:'Plus Jakarta Sans',sans-serif;background:#0D1117;color:#E2E8F0}
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

/* ── MOBILE RESPONSIVE ─────────────────────────────── */
@media (max-width: 768px) {
  .desktop-only { display: none !important; }
  .mobile-sidebar { transform: translateX(-100%) !important; }
  .mobile-sidebar.open { transform: translateX(0) !important; }
  .mobile-overlay.open { display: block !important; }
  .mobile-only { display: flex !important; }
  .main-content { margin-left: 0 !important; padding-bottom: 80px !important; }
}
@media (min-width: 769px) {
  .mobile-only { display: none !important; }
  .mobile-overlay { display: none !important; }
  .mobile-sidebar { transform: none !important; }
}
@keyframes slide-in-left { from{transform:translateX(-100%)} to{transform:translateX(0)} }
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
@media(max-width:768px){.desktop-only{display:none!important}.mobile-only{display:flex!important}.sidebar-wrap{transform:translateX(-100%)!important}.sidebar-wrap.open{transform:translateX(0)!important}.main-wrap{margin-left:0!important;padding-bottom:72px}}
@media(min-width:769px){.mobile-only{display:none!important}}
.sidebar-wrap{transform:translateX(-100%);transition:transform 0.28s cubic-bezier(0.16,1,0.3,1)}
.sidebar-wrap.open{transform:translateX(0)!important}
.mob-overlay.open{display:block!important}
.mobile-only{display:none}
.mob-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,0.65);z-index:99}

`;

/* ══════════════════════════════════════════════════════
   DESIGN TOKENS
══════════════════════════════════════════════════════ */
const D = {
  bg0:"#0D1117",       // GitHub dark — familiar, professional
  bg1:"#161B22",
  bg2:"#1C2430",
  card:"rgba(255,255,255,0.05)",
  glass:"rgba(255,255,255,0.05)",
  glassBorder:"rgba(255,255,255,0.09)",
  border:"rgba(255,255,255,0.09)",
  // Warm amber — harvest gold (primary)
  amber:"#F59E0B", amberV:"#F59E0B", amberG:"rgba(245,158,11,0.15)", amberL:"#FCD34D", amberD:"#D97706",
  // Growth green
  green:"#22C55E", greenG:"rgba(34,197,94,0.15)", greenL:"#4ADE80",
  teal:"#22C55E", tealG:"rgba(34,197,94,0.15)",
  // Info blue
  blue:"#3B82F6", blueG:"rgba(59,130,246,0.15)", blueD:"#1D4ED8",
  // Alert red
  red:"#EF4444", redG:"rgba(239,68,68,0.15)",
  // Purple
  purple:"#A855F7", purpleG:"rgba(168,85,247,0.15)",
  // Text
  text:"#E6EDF3", muted:"#7D8590", dim:"#484F58",
};

/* ══════════════════════════════════════════════════════
   TRANSLATIONS
══════════════════════════════════════════════════════ */
const T = {
  en:{ appName:"Sri Farms", tagline:"Smart Farm Intelligence", gita:"You have a right to perform your prescribed duties, but never claim the fruits of your actions.", login:"Sign In", username:"Username", password:"Password", signout:"Sign Out", dashboard:"Dashboard", sheds:"Sheds", batches:"Batches", report:"Daily Report", alerts:"Alerts", weekly:"Weekly", aiPredict:"AI Predict", history:"History", cctv:"CCTV", photos:"Photos", bills:"Bill Scanner", vaccination:"Vaccination", biosecurity:"Biosecurity", weightlog:"Weight Log", disposal:"Disposal", vaccination:"Vaccination", bills:"Bill Scanner", biosecurity:"Biosecurity", weightlog:"Weight Log", disposal:"Disposal Log", liveBirds:"Live Birds", fcr:"FCR", avgWeight:"Avg Weight", mortality:"Mortality %", addShed:"Add Shed", addBatch:"Start Batch", submitReport:"Submit Report", morning:"Morning", evening:"Evening", save:"Save", cancel:"Cancel", close:"Close", critical:"Critical", warning:"Warning", info:"Info", ok:"OK", allSheds:"All Sheds", noAlerts:"All Clear!", markAllRead:"Mark All Read", unread:"Unread", read:"Read", loading:"Analysing…", analyze:"AI Analysis", reanalyze:"Re-Analyse", editedBy:"Edited by Farm Owner", readOnly:"Read Only", roles:{owner:"Farm Owner",supervisor:"Supervisor",manager:"Cluster Manager",worker:"Worker"} },
  te:{ appName:"శ్రీ ఫార్మ్స్", tagline:"స్మార్ట్ ఫార్మ్ ఇంటెలిజెన్స్", gita:"కర్మలు చేయుటకు నీకు హక్కు ఉన్నది, కానీ ఫలితాలను ఆశించకు.", login:"లాగిన్", username:"వినియోగదారు", password:"పాస్వర్డ్", signout:"లాగ్ అవుట్", dashboard:"డాష్బోర్డ్", sheds:"షెడ్లు", batches:"బ్యాచ్లు", report:"నివేదిక", alerts:"హెచ్చరికలు", weekly:"వారపు", aiPredict:"AI అంచనా", history:"చరిత్ర", cctv:"CCTV", photos:"ఫోటోలు", bills:"బిల్ స్కానర్", vaccination:"వ్యాక్సినేషన్", biosecurity:"జీవ భద్రత", weightlog:"బరువు లాగ్", disposal:"నిర్మూలన", vaccination:"వ్యాక్సినేషన్", bills:"బిల్ స్కానర్", biosecurity:"జీవ భద్రత", weightlog:"బరువు", disposal:"నిర్మూలన", liveBirds:"జీవిత పక్షులు", fcr:"FCR", avgWeight:"సగటు బరువు", mortality:"మరణాల రేటు", addShed:"షెడ్ జోడించు", addBatch:"బ్యాచ్ ప్రారంభించు", submitReport:"సమర్పించు", morning:"ఉదయం", evening:"సాయంత్రం", save:"సేవ్", cancel:"రద్దు", close:"మూసివేయి", critical:"విమర్శాత్మక", warning:"హెచ్చరిక", info:"సమాచారం", ok:"సరే", allSheds:"అన్ని షెడ్లు", noAlerts:"సురక్షితంగా ఉంది!", markAllRead:"అన్నీ చదివారు", unread:"చదవని", read:"చదివిన", loading:"విశ్లేషిస్తోంది…", analyze:"AI విశ్లేషణ", reanalyze:"మళ్ళీ విశ్లేషించు", editedBy:"ఫార్మ్ యజమాని సవరించారు", readOnly:"చదవడానికి మాత్రమే", roles:{owner:"ఫార్మ్ యజమాని",supervisor:"సూపర్వైజర్",manager:"మేనేజర్",worker:"కార్మికుడు"} },
  hi:{ appName:"श्री फार्म्स", tagline:"स्मार्ट फार्म इंटेलिजेंस", gita:"कर्म करने का अधिकार तुम्हारा है, फल की इच्छा मत रखो।", login:"लॉग इन", username:"उपयोगकर्ता", password:"पासवर्ड", signout:"साइन आउट", dashboard:"डैशबोर्ड", sheds:"शेड", batches:"बैच", report:"दैनिक रिपोर्ट", alerts:"अलर्ट", weekly:"साप्ताहिक", aiPredict:"AI पूर्वानुमान", history:"इतिहास", cctv:"CCTV", photos:"फोटो", bills:"बिल स्कैनर", vaccination:"टीकाकरण", biosecurity:"जैव सुरक्षा", weightlog:"वजन लॉग", disposal:"निपटान", vaccination:"टीकाकरण", bills:"बिल स्कैनर", biosecurity:"जैव सुरक्षा", weightlog:"वजन लॉग", disposal:"निपटान", vaccination:"टीकाकरण", bills:"बिल स्कैनर", biosecurity:"जैव सुरक्षा", weightlog:"वजन लॉग", disposal:"निपटान", liveBirds:"जीवित पक्षी", fcr:"FCR", avgWeight:"औसत वजन", mortality:"मृत्यु दर", addShed:"शेड जोड़ें", addBatch:"बैच शुरू", submitReport:"रिपोर्ट दर्ज", morning:"सुबह", evening:"शाम", save:"सहेजें", cancel:"रद्द", close:"बंद", critical:"गंभीर", warning:"चेतावनी", info:"जानकारी", ok:"ठीक है", allSheds:"सभी शेड", noAlerts:"सब ठीक है!", markAllRead:"सभी पढ़े", unread:"अपठित", read:"पढ़ा", loading:"विश्लेषण…", analyze:"AI विश्लेषण", reanalyze:"पुनः विश्लेषण", editedBy:"फार्म मालिक द्वारा संपादित", readOnly:"केवल पढ़ें", roles:{owner:"फार्म मालिक",supervisor:"सुपरवाइजर",manager:"मैनेजर",worker:"कर्मचारी"} },
  mai:{ appName:"श्री फार्म्स", tagline:"स्मार्ट फार्म इंटेलिजेंस", gita:"कर्म करबाक अधिकार अहाँक अछि, फलक इच्छा नहि राखू।", login:"लॉग इन", username:"उपयोगकर्ता", password:"पासवर्ड", signout:"साइन आउट", dashboard:"डैशबोर्ड", sheds:"शेड", batches:"बैच", report:"रिपोर्ट", alerts:"अलर्ट", weekly:"साप्ताहिक", aiPredict:"AI अनुमान", history:"इतिहास", cctv:"CCTV", photos:"फोटो", bills:"बिल स्कैनर", vaccination:"टीकाकरण", biosecurity:"जैव सुरक्षा", weightlog:"वजन लॉग", disposal:"निपटान", liveBirds:"जीवित पक्षी", fcr:"FCR", avgWeight:"औसत वजन", mortality:"मृत्यु दर", addShed:"शेड जोड़ू", addBatch:"बैच शुरू", submitReport:"रिपोर्ट दर्ज", morning:"सकाल", evening:"सांझ", save:"सहेजू", cancel:"रद्द", close:"बंद", critical:"गंभीर", warning:"चेतावनी", info:"जानकारी", ok:"ठीक", allSheds:"सभ शेड", noAlerts:"सब ठीक अछि!", markAllRead:"सभ पढ़ल", unread:"अपठित", read:"पढ़ल", loading:"विश्लेषण…", analyze:"AI विश्लेषण", reanalyze:"फेर विश्लेषण", editedBy:"फार्म मालिक द्वारा", readOnly:"केवल पढ़बाक", roles:{owner:"फार्म मालिक",supervisor:"सुपरवाइजर",manager:"मैनेजर",worker:"कर्मचारी"} }
};

/* ══════════════════════════════════════════════════════
   AUTH & SEED DATA
══════════════════════════════════════════════════════ */
// Production: only farm owner login. Team members managed via TeamTab.
const USERS = [
  {user:"anilkumard369e@gmail.com",pass:"farm@2025",role:"owner",lang:"te",name:"Farm Owner",icon:"👑"},
];

const TODAY = new Date();
const MAX_DAYS=35;
function batchDay(s){return Math.max(1,Math.floor((new Date()-new Date(s))/86400000)+1);}
function expectedWeight(d){const W={1:45,3:80,5:130,7:185,10:330,14:560,18:900,21:1150,24:1450,28:1780,30:2000,32:2180,35:2400};const days=Object.keys(W).map(Number).sort((a,b)=>a-b);if(W[d])return W[d];for(let i=0;i<days.length-1;i++){if(d>=days[i]&&d<=days[i+1]){const t=(d-days[i])/(days[i+1]-days[i]);return Math.round(W[days[i]]+t*(W[days[i+1]]-W[days[i]]))}}return W[35];}

// No seed data — app starts clean

const STORE={
  async get(k,fb){try{const r=await window.storage.get("sf5_"+k);return r?JSON.parse(r.value):fb;}catch{return fb;}},
  async set(k,v){try{await window.storage.set("sf5_"+k,JSON.stringify(v));}catch{}}
};
function HenLogo({size=52,animated=true,glowing=false}){
  const [imgErr,setImgErr]=useState(false);
  const style=animated?{animation:"bob 2.5s ease-in-out infinite",filter:glowing?"drop-shadow(0 0 14px rgba(245,158,11,0.9)) drop-shadow(0 2px 6px rgba(0,0,0,0.6))":"drop-shadow(0 3px 6px rgba(0,0,0,0.5))"}:{filter:"drop-shadow(0 2px 4px rgba(0,0,0,0.4))"};
  if(!imgErr){
    return <img
      src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Chicken_portrait.jpg/200px-Chicken_portrait.jpg"
      alt="broiler hen"
      width={size} height={size}
      onError={()=>setImgErr(true)}
      style={{...style,width:size,height:size,borderRadius:"50%",objectFit:"cover",objectPosition:"center top",flexShrink:0}}
    />;
  }
  // Fallback: realistic SVG hen
  return(
    <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style={style}>
      <circle cx="50" cy="50" r="48" fill="#D97706"/>
      <ellipse cx="50" cy="58" rx="30" ry="24" fill="#F59E0B"/>
      <ellipse cx="50" cy="58" rx="30" ry="24" fill="url(#hg1)"/>
      <ellipse cx="36" cy="62" rx="20" ry="14" fill="#D97706"/>
      <circle cx="34" cy="30" r="17" fill="#FCD34D"/>
      <ellipse cx="24" cy="16" rx="5" ry="7" fill="#EF4444"/>
      <ellipse cx="30" cy="13" rx="6" ry="9" fill="#EF4444"/>
      <ellipse cx="37" cy="15" rx="5" ry="7" fill="#EF4444"/>
      <ellipse cx="19" cy="33" rx="5" ry="7" fill="#DC2626" style={animated?{transformOrigin:"19px 28px",animation:"wag 1.6s ease-in-out infinite"}:{}}/>
      <path d="M15 28 L8 30 L15 33Z" fill="#F97316"/>
      <circle cx="28" cy="26" r="5" fill="#1E293B"/>
      <circle cx="28" cy="26" r="4" fill="#1E293B" style={animated?{transformOrigin:"28px 26px",animation:"blink 4s ease-in-out infinite"}:{}}/>
      <circle cx="29.5" cy="24.5" r="1.5" fill="rgba(255,255,255,0.9)"/>
      <ellipse cx="75" cy="52" rx="10" ry="5" fill="#92400E" transform="rotate(-30 75 52)"/>
      <ellipse cx="79" cy="59" rx="10" ry="4.5" fill="#B45309" transform="rotate(-10 79 59)"/>
      <ellipse cx="23" cy="27" rx="8" ry="5" fill="rgba(255,255,255,0.2)" transform="rotate(-25 23 27)"/>
      <line x1="38" y1="82" x2="33" y2="94" stroke="#F97316" strokeWidth="3" strokeLinecap="round"/>
      <line x1="33" y1="94" x2="27" y2="98" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="33" y1="94" x2="39" y2="98" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="52" y1="82" x2="57" y2="94" stroke="#F97316" strokeWidth="3" strokeLinecap="round"/>
      <line x1="57" y1="94" x2="51" y2="98" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="57" y1="94" x2="63" y2="98" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round"/>
      <defs>
        <radialGradient id="hg1" cx="40%" cy="35%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.2)"/>
          <stop offset="100%" stopColor="rgba(0,0,0,0.15)"/>
        </radialGradient>
      </defs>
    </svg>
  );
}

/* ══════════════════════════════════════════════════════
   ANIMATED BROILER HEN SVG
══════════════════════════════════════════════════════ */


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
  const gc={amber:"#F59E0B",teal:"#22C55E",green:"#22C55E",red:"#EF4444",purple:"#A855F7",blue:"#3B82F6"};
  const gl=gc[glow]||"#F59E0B";
  return(
    <div style={{background:"rgba(22,27,34,0.85)",border:`1px solid ${glow?gl+"28":"rgba(255,255,255,0.08)"}`,borderRadius:14,padding:noPad?0:"20px 22px",backdropFilter:"blur(20px)",position:"relative",overflow:"hidden",transition:"border-color 0.2s,box-shadow 0.2s",boxShadow:glow?`0 4px 24px ${gl}10`:"none",...style}}
    onMouseEnter={e=>{e.currentTarget.style.borderColor=glow?gl+"45":"rgba(255,255,255,0.14)";e.currentTarget.style.boxShadow=glow?`0 8px 32px ${gl}18`:"0 4px 20px rgba(0,0,0,0.3)";}}
    onMouseLeave={e=>{e.currentTarget.style.borderColor=glow?gl+"28":"rgba(255,255,255,0.08)";e.currentTarget.style.boxShadow=glow?`0 4px 24px ${gl}10`:"none";}}>
      {glow&&<div style={{position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,transparent,${gl}55,transparent)`}}/>}
      {(title||action)&&<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <div style={{display:"flex",alignItems:"center",gap:7}}>
          <div style={{width:3,height:12,borderRadius:99,background:glow?gl:"rgba(255,255,255,0.3)"}}/>
          <span style={{fontSize:11,fontWeight:700,color:"#7D8590",textTransform:"uppercase",letterSpacing:"0.08em"}}>{title}</span>
        </div>
        {action}
      </div>}
      {children}
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   KPI STAT CARD
══════════════════════════════════════════════════════ */
function StatCard({label,value,unit,sub,icon:Icon,color="amber",delta,live=false}){
  const cols={
    amber:{a:"#F59E0B",g:"rgba(245,158,11,0.1)",t:"#FCD34D"},
    green:{a:"#22C55E",g:"rgba(34,197,94,0.1)",t:"#86EFAC"},
    teal:{a:"#22C55E",g:"rgba(34,197,94,0.1)",t:"#86EFAC"},
    red:{a:"#EF4444",g:"rgba(239,68,68,0.1)",t:"#FCA5A5"},
    blue:{a:"#3B82F6",g:"rgba(59,130,246,0.1)",t:"#93C5FD"},
    purple:{a:"#A855F7",g:"rgba(168,85,247,0.1)",t:"#D8B4FE"},
  };
  const col=cols[color]||cols.amber;
  return(
    <div style={{background:"rgba(22,27,34,0.85)",border:`1px solid rgba(255,255,255,0.08)`,borderRadius:14,padding:"16px 18px",position:"relative",overflow:"hidden",cursor:"default",transition:"all 0.2s"}}
      onMouseEnter={e=>{e.currentTarget.style.borderColor=col.a+"40";e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow=`0 8px 24px ${col.a}18`;}}
      onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,0.08)";e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="";}}>
      <div style={{position:"absolute",top:-20,right:-20,width:80,height:80,borderRadius:"50%",background:col.g,filter:"blur(20px)"}}/>
      <div style={{position:"relative",zIndex:1}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
          <div style={{display:"flex",alignItems:"center",gap:5}}>
            {live&&<div style={{width:6,height:6,borderRadius:"50%",background:"#22C55E",boxShadow:"0 0 6px #22C55E",animation:"pulse-ring 1.8s ease-out infinite"}}/>}
            <span style={{fontSize:10,fontWeight:700,color:"#7D8590",textTransform:"uppercase",letterSpacing:"0.08em"}}>{label}</span>
          </div>
          {Icon&&<div style={{width:32,height:32,borderRadius:9,background:col.g,display:"grid",placeItems:"center"}}><Icon size={14} color={col.a}/></div>}
        </div>
        <div style={{display:"flex",alignItems:"baseline",gap:4,marginBottom:6}}>
          <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:26,fontWeight:700,color:col.t,letterSpacing:"-0.02em",lineHeight:1}}><AnimNum value={value} decimals={String(value).includes(".")?2:0}/></span>
          {unit&&<span style={{fontSize:12,color:"#7D8590"}}>{unit}</span>}
        </div>
        {(delta!==undefined||sub)&&<div style={{display:"flex",alignItems:"center",gap:4,fontSize:11}}>
          {delta!==undefined&&(delta>=0?<><TrendingUp size={10} color="#22C55E"/><span style={{color:"#22C55E",fontWeight:600}}>+{Math.abs(delta)}%</span></>:<><TrendingDown size={10} color="#EF4444"/><span style={{color:"#EF4444",fontWeight:600}}>{delta}%</span></>)}
          {sub&&<span style={{color:"#484F58"}}>{sub}</span>}
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
    primary:{bg:`linear-gradient(135deg,${"#3B82F6"},${"#1D4ED8"})`,text:"#fff",border:"transparent",shadow:`0 4px 15px ${"#3B82F6"}40`},
    success:{bg:`linear-gradient(135deg,${D.green},#059669)`,text:"#fff",border:"transparent",shadow:`0 4px 15px ${D.green}40`},
    danger:{bg:`linear-gradient(135deg,${D.red},#DC2626)`,text:"#fff",border:"transparent",shadow:`0 4px 15px ${D.red}40`},
    outline:{bg:"rgba(255,255,255,0.06)",text:D.text,border:D.border,shadow:"none"},
    ghost:{bg:"transparent",text:D.muted,border:"transparent",shadow:"none"},
    amber:{bg:`linear-gradient(135deg,${D.amber},#D97706)`,text:"#000",border:"transparent",shadow:`0 4px 15px rgba(245,158,11,0.4)`},
    amber:{bg:`linear-gradient(135deg,${D.amber},#D97706)`,text:"#fff",border:"transparent",shadow:`0 4px 15px ${D.amber}40`},
  };
  const s=v[variant]||v.primary;
  const p=size==="sm"?"6px 14px":size==="lg"?"14px 28px":"10px 20px";
  const fs=size==="sm"?12:size==="lg"?15:13;
  return <button onClick={onClick} disabled={disabled||loading} style={{background:s.bg,color:s.text,border:`1px solid ${s.border}`,borderRadius:10,padding:p,fontSize:fs,fontWeight:600,cursor:(disabled||loading)?"not-allowed":"pointer",opacity:(disabled||loading)?0.5:1,display:"inline-flex",alignItems:"center",gap:7,fontFamily:"'Plus Jakarta Sans',sans-serif",transition:"all 0.18s",boxShadow:s.shadow,letterSpacing:"0.01em",...style}}
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
        style={{width:"100%",padding:unit?"10px 44px 10px 14px":"10px 14px",borderRadius:10,border:`1.5px solid ${borderCol}`,fontSize:14,color:readOnly?"#64748B":D.text,background:readOnly?"rgba(255,255,255,0.02)":"rgba(255,255,255,0.05)",fontFamily:"'Plus Jakarta Sans',sans-serif",outline:"none",transition:"border-color 0.18s, background 0.18s",backdropFilter:"blur(4px)"}}/>
      {unit&&<span style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",fontSize:12,color:D.muted,fontWeight:500}}>{unit}</span>}
    </div>
  </div>;
}

function FSelect({label,value,onChange,options,required}){
  return <div style={{display:"flex",flexDirection:"column",gap:6}}>
    {label&&<label style={{fontSize:11,fontWeight:700,color:D.muted,textTransform:"uppercase",letterSpacing:"0.07em"}}>{label}{required&&<span style={{color:D.red}}> *</span>}</label>}
    <select value={value} onChange={e=>onChange(e.target.value)} style={{padding:"10px 14px",borderRadius:10,border:"1.5px solid rgba(255,255,255,0.1)",fontSize:14,color:D.text,background:"rgba(255,255,255,0.05)",fontFamily:"'Plus Jakarta Sans',sans-serif",outline:"none",cursor:"pointer",backdropFilter:"blur(4px)"}}>
      {options.map(o=>typeof o==="string"?<option key={o} value={o} style={{background:"#161B22"}}>{o}</option>:<option key={o.value} value={o.value} style={{background:"#161B22"}}>{o.label}</option>)}
    </select>
  </div>;
}

/* ══════════════════════════════════════════════════════
   MODAL
══════════════════════════════════════════════════════ */
function Modal({title,children,onClose,width=560}){
  return <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",zIndex:1000,display:"grid",placeItems:"center",padding:20,backdropFilter:"blur(8px)"}} onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
    <div className="fade-up" style={{background:"#161B22",border:`1px solid ${D.border}`,borderRadius:22,width:"100%",maxWidth:width,maxHeight:"90vh",overflow:"auto",padding:30,boxShadow:"0 25px 80px rgba(0,0,0,0.5)"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
        <h3 style={{fontSize:18,fontWeight:700,color:D.text,fontFamily:"'Rajdhani',sans-serif"}}>{title}</h3>
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
  {id:"vaccination",icon:Shield,role:["owner","supervisor","manager"]},
  {id:"bills",icon:Zap,role:["owner","supervisor","manager"]},
  {id:"biosecurity",icon:Leaf,role:["owner","supervisor","manager","worker"]},
  {id:"weightlog",icon:Scale,role:["owner","supervisor","manager"]},
  {id:"disposal",icon:Trash2,role:["owner","supervisor","manager","worker"]},
  {id:"weekly",icon:CalendarDays,role:["owner","supervisor"]},
  {id:"aiPredict",icon:Cpu,role:["owner","supervisor"]},
  {id:"history",icon:History,role:["owner","supervisor"]},
  {id:"cctv",icon:Video,role:["owner","supervisor"]},
  {id:"photos",icon:ImageIcon,role:["owner","supervisor","manager","worker"]},
  {id:"team",icon:Users2,role:["owner"]},
];


function Sidebar({tab,setTab,user,lang,setLang,alerts,onSignOut}){
  const t=T[lang];
  const unread=alerts.filter(a=>!a.read).length;
  const navItems=NAV.filter(n=>n.role.includes(user?.role||"worker"));

  const groups=[
    {label:"Farm",color:"#F59E0B",items:["dashboard","sheds","batches","report","alerts"]},
    {label:"Health & Safety",color:"#22C55E",items:["vaccination","biosecurity","disposal"]},
    {label:"Analytics",color:"#3B82F6",items:["weightlog","weekly","history","aiPredict"]},
    {label:"Operations",color:"#A855F7",items:["bills","cctv","photos"]},
    {label:"Admin",color:"#EF4444",items:["team"]},
  ];

  return <div style={{width:"100%",maxWidth:300,height:"100%",background:"#0D1117",display:"flex",flexDirection:"column",borderRight:"1px solid rgba(255,255,255,0.08)"}}>

    {/* Logo header */}
    <div style={{padding:"18px 16px 14px",borderBottom:"1px solid rgba(255,255,255,0.07)",background:"linear-gradient(135deg,rgba(245,158,11,0.07),rgba(13,17,23,0))"}}>
      <div style={{display:"flex",alignItems:"center",gap:11}}>
        <div style={{position:"relative",flexShrink:0}}>
          <HenLogo size={44} animated glowing/>
          <div style={{position:"absolute",bottom:1,right:1,width:10,height:10,borderRadius:"50%",background:"#22C55E",border:"2px solid #0D1117"}}/>
        </div>
        <div>
          <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:17,fontWeight:700,color:"#FCD34D",letterSpacing:"0.03em"}}>{t.appName}</div>
          <div style={{fontSize:9,color:"rgba(245,158,11,0.55)",fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase",marginTop:1}}>Smart Farm System</div>
        </div>
      </div>
    </div>

    {/* User card */}
    <div style={{margin:"10px 12px 4px",padding:"10px 12px",background:"rgba(245,158,11,0.07)",borderRadius:11,border:"1px solid rgba(245,158,11,0.12)"}}>
      <div style={{display:"flex",alignItems:"center",gap:9}}>
        <div style={{width:34,height:34,borderRadius:9,background:"rgba(245,158,11,0.12)",display:"grid",placeItems:"center",fontSize:18,flexShrink:0}}>{user?.icon||"👤"}</div>
        <div style={{minWidth:0}}>
          <div style={{fontSize:13,fontWeight:700,color:"#E6EDF3",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{user?.name}</div>
          <div style={{fontSize:10,color:"#F59E0B",fontWeight:500,textTransform:"capitalize"}}>{t.roles?.[user?.role]||user?.role}</div>
        </div>
      </div>
    </div>

    {/* Scrollable nav */}
    <div style={{flex:1,overflowY:"auto",WebkitOverflowScrolling:"touch",padding:"6px 10px 8px"}}>
      {groups.map(group=>{
        const groupItems=navItems.filter(n=>group.items.includes(n.id));
        if(!groupItems.length)return null;
        return <div key={group.label} style={{marginBottom:4}}>
          <div style={{fontSize:9,fontWeight:800,color:group.color+"80",textTransform:"uppercase",letterSpacing:"0.12em",padding:"8px 8px 4px",display:"flex",alignItems:"center",gap:5}}>
            <div style={{width:12,height:1.5,background:group.color+"60",borderRadius:99}}/>
            {group.label}
          </div>
          {groupItems.map(n=>{
            const active=tab===n.id;
            const Icon=n.icon;
            const label=t[n.id]||n.id;
            const hasBadge=n.id==="alerts"&&unread>0;
            return <button key={n.id} onClick={()=>setTab(n.id)}
              style={{display:"flex",alignItems:"center",gap:10,padding:"10px 10px",borderRadius:10,border:"none",cursor:"pointer",width:"100%",textAlign:"left",background:active?"rgba(245,158,11,0.12)":"transparent",position:"relative",transition:"background 0.15s",marginBottom:1.5}}
              onMouseEnter={e=>{if(!active)e.currentTarget.style.background="rgba(255,255,255,0.05)";}}
              onMouseLeave={e=>{if(!active)e.currentTarget.style.background="transparent";}}>
              {active&&<div style={{position:"absolute",left:0,top:"15%",bottom:"15%",width:3,borderRadius:"0 3px 3px 0",background:"#F59E0B",boxShadow:"0 0 6px #F59E0B"}}/>}
              <div style={{width:30,height:30,borderRadius:8,background:active?"rgba(245,158,11,0.18)":"rgba(255,255,255,0.05)",display:"grid",placeItems:"center",flexShrink:0}}>
                <Icon size={14} color={active?"#FCD34D":"#7D8590"}/>
              </div>
              <span style={{fontSize:13,fontWeight:active?600:400,color:active?"#FCD34D":"#94A3B8",flex:1}}>{label}</span>
              {hasBadge&&<span style={{background:"#EF4444",color:"#fff",borderRadius:99,fontSize:9,fontWeight:800,padding:"2px 7px",minWidth:18,textAlign:"center",boxShadow:"0 0 5px #EF4444"}}>{unread}</span>}
            </button>;
          })}
        </div>;
      })}
    </div>

    {/* Footer */}
    <div style={{padding:"10px 12px 16px",borderTop:"1px solid rgba(255,255,255,0.07)"}}>
      <div style={{display:"flex",gap:4,marginBottom:10,background:"rgba(255,255,255,0.04)",borderRadius:9,padding:4}}>
        {[["en","EN"],["te","TE"],["hi","HI"],["mai","MA"]].map(([l,lbl])=>(
          <button key={l} onClick={()=>setLang(l)} style={{flex:1,padding:"5px 0",borderRadius:7,border:"none",background:lang===l?"rgba(245,158,11,0.2)":"transparent",color:lang===l?"#FCD34D":"#7D8590",fontSize:11,fontWeight:700,cursor:"pointer"}}>{lbl}</button>
        ))}
      </div>
      <button onClick={onSignOut} style={{width:"100%",padding:"9px",borderRadius:10,border:"1px solid rgba(255,255,255,0.08)",background:"transparent",cursor:"pointer",color:"#7D8590",fontSize:13,fontWeight:500,display:"flex",alignItems:"center",justifyContent:"center",gap:7,fontFamily:"'Plus Jakarta Sans',sans-serif",transition:"all 0.15s"}}
        onMouseEnter={e=>{e.currentTarget.style.background="rgba(239,68,68,0.08)";e.currentTarget.style.color="#FCA5A5";}}
        onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.color="#7D8590";}}>
        <LogOut size={14}/>{t.signout}
      </button>
    </div>
  </div>;
}


function TopBar({user,tab,lang,alerts,onMenuClick}){
  const t=T[lang];
  const [clock,setClock]=useState(new Date());
  useEffect(()=>{const x=setInterval(()=>setClock(new Date()),1000);return()=>clearInterval(x);},[]);
  const unread=alerts.filter(a=>!a.read).length;
  const time=clock.toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit",second:"2-digit"});

  return <div style={{background:"rgba(13,17,23,0.95)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(255,255,255,0.07)",padding:"0 20px",height:56,display:"flex",alignItems:"center",gap:12,position:"sticky",top:0,zIndex:50}}>
    {/* Hamburger mobile */}
    <button onClick={onMenuClick} style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,padding:"7px 9px",cursor:"pointer",color:"#E6EDF3",flexShrink:0}}>
      <div style={{width:16,height:2,background:"#E6EDF3",marginBottom:3,borderRadius:2}}/>
      <div style={{width:11,height:2,background:"#E6EDF3",marginBottom:3,borderRadius:2}}/>
      <div style={{width:16,height:2,background:"#E6EDF3",borderRadius:2}}/>
    </button>

    {/* Page title */}
    <div className="desktop-only" style={{flex:1}}>
      <h1 style={{fontFamily:"'Rajdhani',sans-serif",fontSize:18,fontWeight:700,color:"#E6EDF3",letterSpacing:"0.04em"}}>{t[tab]||tab}</h1>
      <p style={{fontSize:10,color:"#7D8590",letterSpacing:"0.04em",marginTop:1}}>Sri Farms · Chittoor District · Andhra Pradesh</p>
    </div>
    <div className="mobile-only" style={{flex:1,display:"none"}}>
      <span style={{fontFamily:"'Rajdhani',sans-serif",fontSize:16,fontWeight:700,color:"#FCD34D"}}>{t[tab]||tab}</span>
    </div>

    {/* Right controls */}
    <div style={{display:"flex",alignItems:"center",gap:8}}>
      {/* Live clock */}
      <div style={{display:"flex",alignItems:"center",gap:6,padding:"5px 11px",background:"rgba(34,197,94,0.08)",border:"1px solid rgba(34,197,94,0.2)",borderRadius:99}}>
        <div style={{width:6,height:6,borderRadius:"50%",background:"#22C55E",boxShadow:"0 0 6px #22C55E",animation:"pulse-ring 2s ease-out infinite"}}/>
        <span style={{fontSize:11,fontWeight:600,color:"#86EFAC",fontFamily:"'JetBrains Mono',monospace"}}>{time}</span>
      </div>
      {/* Unread alerts */}
      {unread>0&&<div style={{display:"flex",alignItems:"center",gap:5,padding:"5px 10px",background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.25)",borderRadius:99}}>
        <Bell size={12} color="#EF4444"/>
        <span style={{fontSize:11,fontWeight:700,color:"#EF4444"}}>{unread}</span>
      </div>}
      {/* User avatar */}
      <div style={{width:32,height:32,borderRadius:9,background:"rgba(245,158,11,0.12)",border:"1px solid rgba(245,158,11,0.25)",display:"grid",placeItems:"center",fontSize:15,cursor:"default"}} title={user?.name}>
        {user?.icon||"👤"}
      </div>
    </div>
  </div>;
}


function GitaStrip({lang}){
  const t=T[lang];
  return <div style={{background:"rgba(168,85,247,0.05)",borderBottom:"1px solid rgba(168,85,247,0.1)",padding:"6px 20px",display:"flex",alignItems:"center",gap:8,overflow:"hidden"}}>
    <BookOpen size={11} color="#C084FC" style={{flexShrink:0}}/>
    <p style={{fontSize:11,color:"rgba(192,132,252,0.75)",fontStyle:"italic",overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis",flex:1}}>{t.gita}</p>
    <span style={{fontSize:9,color:"rgba(192,132,252,0.35)",whiteSpace:"nowrap",fontWeight:700,letterSpacing:"0.08em",flexShrink:0}}>BG 2.47</span>
  </div>;
}


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
  return <div style={{background:"rgba(22,27,34,0.98)",border:`1px solid ${D.border}`,borderRadius:10,padding:"10px 14px",fontSize:12,backdropFilter:"blur(12px)"}}>
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
        <button key={f.id} onClick={()=>setFilter(f.id)} style={{padding:"7px 18px",borderRadius:99,border:`1.5px solid ${filter===f.id?"#3B82F6":"rgba(255,255,255,0.1)"}`,background:filter===f.id?"rgba(59,130,246,0.2)":"rgba(255,255,255,0.05)",color:filter===f.id?"#93C5FD":"#94A3B8",fontSize:13,fontWeight:600,cursor:"pointer",transition:"all 0.15s",backdropFilter:"blur(4px)"}}>{f.label}</button>
      ))}
    </div>


    {/* Harvest Countdown Banner */}
    {(()=>{
      const activeBatches=batches.filter(b=>b.status==="active");
      if(!activeBatches.length)return null;
      const ub=activeBatches.reduce((a,b)=>batchDay(a.startDate)>batchDay(b.startDate)?a:b,activeBatches[0]);
      const d=batchDay(ub.startDate);const remaining=Math.max(0,MAX_DAYS-d);
      const shed=sheds.find(s=>s.id===ub.shed);const pct=Math.min((d/MAX_DAYS)*100,100);
      const urgCol=remaining<=5?D.red:remaining<=10?D.amber:D.green;
      return <div style={{background:"rgba(245,158,11,0.06)",border:"1px solid rgba(245,158,11,0.2)",borderRadius:16,padding:"12px 18px",marginBottom:18,display:"flex",alignItems:"center",gap:14,overflow:"hidden",position:"relative"}}>
        <div style={{position:"absolute",inset:0,background:"linear-gradient(90deg,transparent,rgba(245,158,11,0.04),transparent)",animation:"shimmer 3s linear infinite",backgroundSize:"200% 100%"}}/>
        <div style={{width:40,height:40,borderRadius:11,background:"rgba(245,158,11,0.12)",display:"grid",placeItems:"center",flexShrink:0,position:"relative"}}><Flame size={18} color={D.amber}/></div>
        <div style={{flex:1,minWidth:0,position:"relative"}}>
          <div style={{fontSize:9,color:D.muted,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:3}}>{shed?.name} · Batch #{ub.batchNo} · {MAX_DAYS}-Day Harvest Cycle</div>
          <div style={{display:"flex",alignItems:"baseline",gap:6,marginBottom:5}}>
            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:22,fontWeight:700,color:urgCol,lineHeight:1}}>{remaining}</span>
            <span style={{fontSize:12,color:D.muted}}>days to harvest</span>
            <span style={{fontSize:11,color:D.dim}}>· Day {d}/{MAX_DAYS}</span>
          </div>
          <div style={{background:"rgba(255,255,255,0.05)",borderRadius:99,height:5,overflow:"hidden"}}>
            <div style={{background:`linear-gradient(90deg,${D.amber},${urgCol})`,height:"100%",width:`${pct}%`,borderRadius:99,transition:"width 1s ease",boxShadow:`0 0 8px ${urgCol}80`}}/>
          </div>
        </div>
        {remaining<=5&&<div style={{padding:"5px 12px",background:"rgba(239,68,68,0.15)",border:"1px solid rgba(239,68,68,0.35)",borderRadius:99,fontSize:10,fontWeight:800,color:D.red,whiteSpace:"nowrap",flexShrink:0}}>🔥 HARVEST SOON</div>}
      </div>;
    })()}
    {/* KPI row */}
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:14,marginBottom:24}}>
      <StatCard label={t.liveBirds} value={totalBirds} icon={Bird} color="blue" delta={-1.2} sub="vs last batch"/>
      <StatCard label={t.fcr} value={avgFCR} icon={Activity} color={+avgFCR>2?"red":+avgFCR>1.75?"amber":"green"} delta={2.1} sub="feed conv. ratio"/>
      <StatCard label={t.avgWeight} value={avgWeight} unit="g" icon={Scale} color={avgWeight<expectedWeight(20)*0.88?"red":"green"} delta={1.8} sub="body weight"/>
      <StatCard label={t.mortality} value={mortRate} unit="%" icon={AlertTriangle} color={+mortRate>5?"red":+mortRate>3?"amber":"green"} delta={-0.5} sub="death rate"/>
    </div>

    {/* Charts */}
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(min(100%,420px),1fr))",gap:16,marginBottom:24}}>
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


    {/* Flock Health Score */}
    {(()=>{
      const score=Math.max(0,Math.min(100,Math.round(100-(+mortRate*8)-(+avgFCR>2?15:+avgFCR>1.75?8:0))));
      const col=score>=80?D.green:score>=60?D.amber:D.red;
      const r=34;const circ=2*Math.PI*r;const dash=circ*(score/100);
      return <GCard style={{marginBottom:18,display:"flex",alignItems:"center",gap:18,padding:"16px 20px"}}>
        <div style={{position:"relative",width:80,height:80,flexShrink:0}}>
          <svg width={80} height={80} viewBox="0 0 100 100" style={{transform:"rotate(-90deg)"}}>
            <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10"/>
            <circle cx="50" cy="50" r={r} fill="none" stroke={col} strokeWidth="10" strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" style={{filter:`drop-shadow(0 0 5px ${col})`}}/>
          </svg>
          <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:18,fontWeight:700,color:col,lineHeight:1}}>{score}</span>
            <span style={{fontSize:7,color:D.muted,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.05em",marginTop:1}}>HEALTH</span>
          </div>
        </div>
        <div style={{flex:1}}>
          <div style={{fontSize:10,color:D.muted,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:4}}>Overall Flock Health Score</div>
          <div style={{fontSize:22,fontWeight:800,color:col,marginBottom:4,fontFamily:"'JetBrains Mono',monospace"}}>{score>=80?"EXCELLENT":score>=60?"GOOD":"NEEDS ATTENTION"}</div>
          <div style={{fontSize:11,color:D.muted}}>Mortality: {mortRate}% · FCR: {avgFCR} · Avg Weight: {avgWeight}g</div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:6,flexShrink:0}}>
          {[[t.mortality,mortRate+"%",+mortRate>5?"critical":+mortRate>2?"warning":"ok"],[t.fcr,avgFCR,+avgFCR>2?"critical":+avgFCR>1.75?"warning":"ok"],["Weight",avgWeight+"g",avgWeight<900?"warning":"ok"]].map(([l,v,c])=>(
            <div key={l} style={{display:"flex",alignItems:"center",gap:7}}>
              <span style={{fontSize:10,color:D.muted,width:55}}>{l}</span>
              <Pill label={v} color={c} size="xs"/>
            </div>
          ))}
        </div>
      </GCard>;
    })()}
    {/* Shed table + alerts */}
    <div style={{display:"grid",gridTemplateColumns:"1.5fr 1fr",gap:16}}>
      <GCard title="Per-Shed Status">
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead>
            <tr style={{borderBottom:`1px solid ${D.border}`}}>
              {["Shed","Day","Birds","Weight","Mort.","Temp","FCR"].map(h=><th key={h} style={{padding:"8px 10px",textAlign:"left",color:D.muted,fontWeight:700,fontSize:11,textTransform:"uppercase",letterSpacing:"0.06em"}}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {activeSheds.map(shed=>{
              const rep=latestReports.find(r=>r.shed===shed.id);
              const bat=batches.find(b=>b.shed===shed.id&&b.status==="active");
              const day=bat?batchDay(bat.startDate):"\u2014";
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
            const bc={critical:D.red,warning:D.amber,info:"#3B82F6",ok:D.green}[a.type];
            const ic={critical:<AlertCircle size={14} color={D.red}/>,warning:<AlertTriangle size={14} color={D.amber}/>,info:<Info size={14} color={"#3B82F6"}/>,ok:<CheckCircle size={14} color={D.green}/>};
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
  const [confirmDeactivate,setConfirmDeactivate]=useState(null);
  const [confirmDelete,setConfirmDelete]=useState(null);
  const [toast,setToast]=useState(null);

  const save=async()=>{
    if(!form.name||!form.location||!form.supervisor)return;
    const updated=editShed?sheds.map(s=>s.id===editShed.id?{...s,...form}:s):[...sheds,{...form,id:"shed_"+Date.now(),createdAt:new Date().toISOString().split("T")[0]}];
    setSheds(updated);await STORE.set("sheds",updated);setShowAdd(false);setEditShed(null);setForm(blank);
  };
  const deactivate=async(shed)=>{
    const u=sheds.map(s=>s.id===shed.id?{...s,active:false}:s);
    setSheds(u);await STORE.set("sheds",u);
    setConfirmDeactivate(null);
    setToast({message:`${shed.name} deactivated. You can now delete it.`,type:"success"});
  };
  const deleteShed=async(shed)=>{
    // Prevent delete if active batch exists
    const activeBatch=batches.find(b=>b.shed===shed.id&&b.status==="active");
    if(activeBatch){setToast({message:"Close the active batch first before deleting this shed.",type:"error"});setConfirmDelete(null);return;}
    const u=sheds.filter(s=>s.id!==shed.id);
    setSheds(u);await STORE.set("sheds",u);
    setConfirmDelete(null);
    setToast({message:`${shed.name} permanently deleted.`,type:"success"});
  };

  return <div className="fade-up">
    {toast&&<Toast message={toast.message} type={toast.type} onClose={()=>setToast(null)}/>}
    {canEdit&&<div style={{marginBottom:22,display:"flex",justifyContent:"flex-end"}}><Btn icon={Plus} onClick={()=>{setForm(blank);setShowAdd(true);}}>{t.addShed}</Btn></div>}
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))",gap:16}}>
      {sheds.map(shed=>{
        const bat=batches.find(b=>b.shed===shed.id&&b.status==="active");
        const day=bat?batchDay(bat.startDate):null;
        const pct=day?Math.min((day/MAX_DAYS)*100,100):0;
        return <GCard key={shed.id} noPad style={{opacity:shed.active?1:0.5}}>
          {/* Shed card header */}
          <div style={{padding:"18px 22px 16px",borderBottom:`1px solid ${D.border}`}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
              <div>
                <h3 style={{fontFamily:"'Rajdhani',sans-serif",fontSize:18,fontWeight:800,color:"#fff",marginBottom:4}}>{shed.name}</h3>
                <div style={{display:"flex",alignItems:"center",gap:5,fontSize:12,color:D.muted}}><MapPin size={11}/>{shed.location}, {shed.district}</div>
              </div>
              <Pill label={shed.active?"Active":"Inactive"} color={shed.active?"active":"closed"}/>
            </div>
          </div>
          <div style={{padding:"16px 22px"}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
              {[["Capacity",shed.capacity.toLocaleString()+" birds"],["Area",shed.area+" sq ft"],["Supervisor",shed.supervisor],["Batch Day",day?`Day ${day} / 42`:"No active batch"]].map(([l,v])=>(
                <div key={l} style={{background:"rgba(255,255,255,0.04)",borderRadius:10,padding:"10px 12px",border:"1px solid rgba(255,255,255,0.06)"}}>
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
                <div style={{background:`linear-gradient(90deg,${"#3B82F6"},#60A5FA)`,borderRadius:99,height:"100%",width:`${pct}%`,boxShadow:`0 0 8px ${"#3B82F6"}`,transition:"width 0.5s"}}/>
              </div>
            </div>}
            {canEdit&&<div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              {shed.active&&<>
                <Btn variant="outline" size="sm" icon={Edit2} onClick={()=>{setEditShed(shed);setForm(shed);setShowAdd(true);}}>Edit</Btn>
                <Btn variant="ghost" size="sm" icon={AlertTriangle} onClick={()=>setConfirmDeactivate(shed)}>Deactivate</Btn>
              </>}
              {!shed.active&&<>
                <Btn variant="outline" size="sm" icon={Edit2} onClick={()=>{setEditShed(shed);setForm(shed);setShowAdd(true);}}>Edit</Btn>
                <Btn variant="success" size="sm" icon={Check} onClick={async()=>{const u=sheds.map(s=>s.id===shed.id?{...s,active:true}:s);setSheds(u);await STORE.set("sheds",u);setToast({message:`${shed.name} reactivated!`,type:"success"});}}>Reactivate</Btn>
                <Btn variant="danger" size="sm" icon={Trash2} onClick={()=>setConfirmDelete(shed)}>Delete</Btn>
              </>}
            </div>}
          </div>
        </GCard>;
      })}
    </div>
    {/* Deactivate confirm */}
    {confirmDeactivate&&<Modal title="Deactivate Shed?" onClose={()=>setConfirmDeactivate(null)} width={440}>
      <div style={{textAlign:"center",padding:"10px 0 16px"}}>
        <div style={{width:60,height:60,borderRadius:"50%",background:"rgba(245,158,11,0.12)",border:"1px solid rgba(245,158,11,0.3)",display:"grid",placeItems:"center",margin:"0 auto 16px"}}>
          <AlertTriangle size={28} color={D.amber}/>
        </div>
        <h3 style={{fontSize:17,fontWeight:800,color:"#fff",marginBottom:8}}>Deactivate "{confirmDeactivate.name}"?</h3>
        <p style={{fontSize:13,color:D.muted,lineHeight:1.7,marginBottom:6}}>This shed will be marked as <strong style={{color:D.amber}}>Inactive</strong> and removed from daily reporting.</p>
        <p style={{fontSize:12,color:D.muted,marginBottom:20}}>After deactivating, you will get the option to <strong style={{color:D.red}}>permanently delete</strong> it.</p>
        <div style={{padding:"10px 16px",background:"rgba(245,158,11,0.07)",border:"1px solid rgba(245,158,11,0.2)",borderRadius:12,marginBottom:20,fontSize:12,color:"#FCD34D",textAlign:"left"}}>
          ⚠ Make sure to close any active batches in this shed before deactivating.
        </div>
        <div style={{display:"flex",gap:10,justifyContent:"center"}}>
          <Btn variant="outline" onClick={()=>setConfirmDeactivate(null)}>Cancel</Btn>
          <Btn variant="amber" icon={AlertTriangle} onClick={()=>deactivate(confirmDeactivate)}>Yes, Deactivate</Btn>
        </div>
      </div>
    </Modal>}

    {/* Delete confirm */}
    {confirmDelete&&<Modal title="Permanently Delete Shed?" onClose={()=>setConfirmDelete(null)} width={440}>
      <div style={{textAlign:"center",padding:"10px 0 16px"}}>
        <div style={{width:60,height:60,borderRadius:"50%",background:"rgba(239,68,68,0.12)",border:"1px solid rgba(239,68,68,0.3)",display:"grid",placeItems:"center",margin:"0 auto 16px"}}>
          <Trash2 size={28} color={D.red}/>
        </div>
        <h3 style={{fontSize:17,fontWeight:800,color:"#fff",marginBottom:8}}>Delete "{confirmDelete.name}"?</h3>
        <p style={{fontSize:13,color:D.muted,lineHeight:1.7,marginBottom:16}}>This will <strong style={{color:D.red}}>permanently delete</strong> the shed. This action <strong style={{color:D.red}}>cannot be undone</strong>.</p>
        <div style={{padding:"12px 16px",background:"rgba(239,68,68,0.08)",border:"1px solid rgba(239,68,68,0.25)",borderRadius:12,marginBottom:20,textAlign:"left"}}>
          <p style={{fontSize:12,color:"#FCA5A5",fontWeight:700,marginBottom:6}}>⚠ This will also affect:</p>
          <p style={{fontSize:12,color:D.muted}}>· All daily reports linked to this shed</p>
          <p style={{fontSize:12,color:D.muted}}>· All batch records for this shed</p>
          <p style={{fontSize:12,color:D.muted}}>· All alerts generated for this shed</p>
        </div>
        <div style={{display:"flex",gap:10,justifyContent:"center"}}>
          <Btn variant="outline" onClick={()=>setConfirmDelete(null)}>Cancel — Keep Shed</Btn>
          <Btn variant="danger" icon={Trash2} onClick={()=>deleteShed(confirmDelete)}>Yes, Delete Forever</Btn>
        </div>
      </div>
    </Modal>}

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
function BatchesTab({batches,setBatches,sheds,lang,prepLogs={},setPrepLogs=()=>{}}){
  const t=T[lang];
  const [showForm,setShowForm]=useState(false);
  const [form,setForm]=useState({shed:"",chicks:19800,startDate:new Date().toISOString().split("T")[0],batchNo:8});
  const activeSheds=sheds.filter(s=>s.active);

  const startBatch=async()=>{
    if(!form.shed)return;
    if(batches.find(b=>b.shed===form.shed&&b.status==="active")){alert("Close existing batch first");return;}
    const u=[...batches,{id:"batch_"+Date.now(),...form,chicks:+form.chicks,batchNo:+form.batchNo,status:"active",closedDate:null}];
    setBatches(u);await STORE.set("batches",u);setShowForm(false);
  };
  const closeBatch=async(id)=>{const u=batches.map(b=>b.id===id?{...b,status:"closed",closedDate:new Date().toISOString().split("T")[0]}:b);setBatches(u);await STORE.set("batches",u);};

  return <div className="fade-up">
    <div style={{marginBottom:22,display:"flex",justifyContent:"flex-end"}}><Btn icon={Plus} onClick={()=>setShowForm(true)}>{t.addBatch}</Btn></div>
    {activeSheds.map(shed=>{
      const shedBatches=batches.filter(b=>b.shed===shed.id).sort((a,b)=>b.batchNo-a.batchNo);
      const active=shedBatches.find(b=>b.status==="active");
      const day=active?batchDay(active.startDate):null;
      const pct=day?Math.min((day/MAX_DAYS)*100,100):0;
      return <GCard key={shed.id} style={{marginBottom:16}} title={shed.name}
        action={active?<Pill label={`Day ${day} · Active`} color="active"/>:<Pill label="No Active Batch" color="closed"/>}>
        {active&&<div style={{marginBottom:16}}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:16}}>
            {[["Batch",`#${active.batchNo}`],["Chicks In",active.chicks.toLocaleString()],["Started",active.startDate],["Days Left",Math.max(0,MAX_DAYS-day)+"d"]].map(([l,v])=>(
              <div key={l} style={{background:"rgba(255,255,255,0.05)",borderRadius:12,padding:"12px 16px",border:"1px solid rgba(255,255,255,0.06)"}}>
                <div style={{fontSize:10,color:D.muted,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em"}}>{l}</div>
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:20,fontWeight:800,color:"#fff",marginTop:6}}>{v}</div>
              </div>
            ))}
          </div>
          {/* Circular-ish progress */}
          <div style={{marginBottom:12}}>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:7}}>
              <span style={{color:D.muted}}>Progress toward Day 35 harvest</span>
              <span style={{fontFamily:"'JetBrains Mono',monospace",fontWeight:700,color:"#93C5FD"}}>{day}/{MAX_DAYS} · {pct.toFixed(0)}%</span>
            </div>
            <div style={{background:"rgba(255,255,255,0.05)",borderRadius:99,height:12,overflow:"hidden",position:"relative"}}>
              <div style={{background:`linear-gradient(90deg,${"#3B82F6"},#60A5FA,${D.green})`,borderRadius:99,height:"100%",width:`${pct}%`,transition:"width 0.6s",boxShadow:`0 0 12px ${"#3B82F6"}80`}}/>
              {[25,50,75].map(m=><div key={m} style={{position:"absolute",left:`${m}%`,top:0,bottom:0,width:1,background:"rgba(255,255,255,0.15)"}}/>)}
            </div>
          </div>
          <Btn variant="danger" size="sm" onClick={()=>closeBatch(active.id)}>Close Batch (Harvest Complete)</Btn>
        </div>}
        {shedBatches.filter(b=>b.status==="closed").slice(0,3).length>0&&<div>
          <p style={{fontSize:11,color:D.muted,fontWeight:700,marginBottom:10,textTransform:"uppercase",letterSpacing:"0.06em"}}>History</p>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
            <thead><tr style={{borderBottom:`1px solid ${D.border}`}}>
              {["Batch","Start","Closed","Chicks","Status"].map(h=><th key={h} style={{padding:"7px 10px",textAlign:"left",color:D.muted,fontWeight:700,fontSize:11,textTransform:"uppercase"}}>{h}</th>)}
            </tr></thead>
            <tbody>{shedBatches.filter(b=>b.status==="closed").slice(0,3).map(b=>(
              <tr key={b.id} style={{borderBottom:`1px solid rgba(255,255,255,0.04)`}}>
                <td style={{padding:"9px 10px",fontWeight:700,color:"#fff"}}>#{b.batchNo}</td>
                <td style={{padding:"9px 10px",color:D.muted}}>{b.startDate}</td>
                <td style={{padding:"9px 10px",color:D.muted}}>{b.closedDate||"\u2014"}</td>
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
    const updR=[report,...reports];setReports(updR);await STORE.set("reports",updR);
    const newAlerts=[];const shedName=sheds.find(s=>s.id===form.shed)?.name||"";
    if(+form.mortality>40)newAlerts.push({id:Date.now()+1,type:"critical",shed:form.shed,title:"High Mortality Alert",desc:`${form.mortality} deaths in ${shedName}`,time:now,read:false});
    else if(+form.mortality>28)newAlerts.push({id:Date.now()+2,type:"warning",shed:form.shed,title:"Mortality Warning",desc:`${form.mortality} deaths in ${shedName}`,time:now,read:false});
    if(+form.temp>32)newAlerts.push({id:Date.now()+3,type:"critical",shed:form.shed,title:"High Temperature Alert",desc:`${form.temp}°C in ${shedName}`,time:now,read:false});
    else if(+form.temp>30)newAlerts.push({id:Date.now()+4,type:"warning",shed:form.shed,title:"Temperature Warning",desc:`${form.temp}°C in ${shedName}`,time:now,read:false});
    if(wfRatio&&+wfRatio<1.8)newAlerts.push({id:Date.now()+5,type:"warning",shed:form.shed,title:"Low Water:Feed Ratio",desc:`Ratio ${wfRatio}x in ${shedName}`,time:now,read:false});
    if(weightWarn)newAlerts.push({id:Date.now()+6,type:"warning",shed:form.shed,title:"Below Expected Weight",desc:`${form.weight}g — below 88% of expected ${expW}g`,time:now,read:false});
    if(newAlerts.length){const u=[...newAlerts,...alerts];setAlerts(u);await STORE.set("alerts",u);}
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
                {label:"Batch Day",value:day?`Day ${day}`:"Select shed",icon:"🐣",sub:day?`of ${MAX_DAYS}`:null},
                {label:"Live Birds",value:liveBirds!==null?liveBirds.toLocaleString():"\u2014",icon:"🐔",sub:form.mortality!==""?`${baseBirds?.toLocaleString()} − ${form.mortality}`:null},
                {label:"Submitted At",value:timeNow,icon:"🕐",sub:"Live clock"},
              ].map(f=><div key={f.label} style={{background:"rgba(255,255,255,0.05)",borderRadius:12,padding:"12px 14px",border:"1px solid rgba(255,255,255,0.07)",position:"relative",overflow:"hidden"}}>
                <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,transparent,${"#3B82F6"}60,transparent)`}}/>
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
                background:mortWarn==="critical"?"rgba(239,68,68,0.08)":mortWarn==="warning"?"rgba(245,158,11,0.08)":"rgba(255,255,255,0.05)",
                outline:"none",transition:"all 0.2s",letterSpacing:"-0.02em",
                boxShadow:mortWarn==="critical"?`0 0 30px ${D.red}30`:mortWarn==="warning"?`0 0 30px ${D.amber}30`:"none"
              }}/>
            <div style={{marginTop:8,fontSize:13,color:D.muted}}>Number of bird deaths today</div>
            <WarnBanner warn={mortWarn} msg={mortWarn==="critical"?"🚨 CRITICAL: More than 40 deaths/day!":"⚠️ WARNING: 28–40 deaths/day — approaching threshold"}/>
            {form.mortality!==""&&liveBirds!==null&&<div style={{marginTop:10,padding:"8px 16px",background:"rgba(59,130,246,0.1)",borderRadius:10,border:"1px solid rgba(59,130,246,0.2)",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
              <Bird size={14} color={"#3B82F6"}/>
              <span style={{fontSize:13,color:"#93C5FD",fontWeight:600}}>
                Live count: <strong style={{fontFamily:"'JetBrains Mono',monospace"}}>{baseBirds?.toLocaleString()}</strong> − <strong>{form.mortality}</strong> = <strong style={{color:"#6EE7B7"}}>{liveBirds.toLocaleString()} birds</strong>
              </span>
            </div>}
          </div>
        </GCard>

        {/* Optional fields */}
        {day&&(liveBirds||baseBirds)&&form.shed&&(()=>{const sug=getDailyFeedSuggestion(day,liveBirds||baseBirds||0);return <div style={{background:"rgba(34,197,94,0.07)",border:"1px solid rgba(34,197,94,0.2)",borderRadius:14,padding:"13px 16px",marginBottom:14}}><div style={{fontSize:10,fontWeight:700,color:"#86EFAC",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:10,display:"flex",alignItems:"center",gap:6}}><Leaf size={11}/>Feed Recommendation - Day {day}</div><div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>{[["Per Bird",sug.gPerBird+"g","#FCD34D"],["Total Feed",sug.totalKg+" kg","#86EFAC"],["Feed Type",sug.feedType,"#93C5FD"]].map(([l,v,col])=><div key={l} style={{background:"rgba(255,255,255,0.04)",borderRadius:10,padding:"10px",textAlign:"center"}}><div style={{fontSize:9,color:"#7D8590",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:4}}>{l}</div><div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:15,fontWeight:700,color:col}}>{v}</div></div>)}</div><p style={{fontSize:10,color:"#7D8590",marginTop:8}}>Based on {(liveBirds||baseBirds||0).toLocaleString()} birds</p></div>;})()} <GCard title="Additional Observations" action={<Pill label="Optional" color="info"/>}>
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
            {day&&(()=>{const rec=getFeedType(day);const wrong=form.feedtype&&form.feedtype!==rec.name;return <div style={{marginTop:6,padding:"7px 12px",background:wrong?"rgba(239,68,68,0.1)":"rgba(16,185,129,0.08)",border:`1px solid ${wrong?"rgba(239,68,68,0.3)":"rgba(16,185,129,0.2)"}`,borderRadius:10,fontSize:11}}>
              <span style={{color:wrong?D.red:D.green,fontWeight:700}}>{wrong?"⚠ Recommended:":"✓ Correct:"} {rec.name}</span>
              <span style={{color:D.muted,marginLeft:6}}>{rec.note}</span>
            </div>;})()} 
            <FSelect label="Litter Condition" value={form.litter} onChange={v=>setForm({...form,litter:v})} options={["Good","Fair","Poor"]}/>
            <div style={{gridColumn:"span 2"}}>
              <FInput label="Medicine / Vaccine" value={form.medicine} onChange={v=>setForm({...form,medicine:v})} placeholder="Optional — enter any medicine given today"/>
            </div>
            <div style={{gridColumn:"span 2"}}>
              <label style={{fontSize:11,fontWeight:700,color:D.muted,textTransform:"uppercase",letterSpacing:"0.07em",display:"block",marginBottom:6}}>Health Observation</label>
              <textarea value={form.health} onChange={e=>setForm({...form,health:e.target.value})} rows={2} placeholder="Normal / note any observations..."
                style={{width:"100%",padding:"10px 14px",borderRadius:10,border:"1.5px solid rgba(255,255,255,0.1)",fontSize:14,color:D.text,background:"rgba(255,255,255,0.05)",fontFamily:"'Plus Jakarta Sans',sans-serif",resize:"vertical",outline:"none",backdropFilter:"blur(4px)"}}/>
            </div>
            <div style={{gridColumn:"span 2"}}>
              <label style={{fontSize:11,fontWeight:700,color:D.muted,textTransform:"uppercase",letterSpacing:"0.07em",display:"block",marginBottom:6}}>Unusual Event</label>
              <textarea value={form.event} onChange={e=>setForm({...form,event:e.target.value})} rows={2} placeholder="Any unusual events..."
                style={{width:"100%",padding:"10px 14px",borderRadius:10,border:"1.5px solid rgba(255,255,255,0.1)",fontSize:14,color:D.text,background:"rgba(255,255,255,0.05)",fontFamily:"'Plus Jakarta Sans',sans-serif",resize:"vertical",outline:"none",backdropFilter:"blur(4px)"}}/>
            </div>
          </div>
          <div style={{marginTop:20,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span style={{fontSize:12,color:D.muted}}>Will record at: <strong style={{color:"#93C5FD",fontFamily:"'JetBrains Mono',monospace"}}>{timeNow}</strong></span>
            <Btn icon={Check} size="lg" onClick={submit} disabled={!form.shed||form.mortality===""} style={{minWidth:200,justifyContent:"center"}}>
              {t.submitReport}
            </Btn>
            {lastReport&&<WhatsAppAlertBtn report={lastReport} shed={sheds.find(s=>s.id===lastReport.shed)}/>}
          </div>
        </GCard>
      </div>

      {/* Right panel */}
      <div style={{display:"flex",flexDirection:"column",gap:16}}>
        {/* Threshold reference */}
        <GCard title="KPI Thresholds">
          {[{label:"Mortality/day",w:">28 birds",c:">40 birds"},{label:"Temperature",w:">30°C",c:">32°C"},{label:"Water:Feed",w:"<1.8x",c:"<1.5x"},{label:"Body Weight",w:"<88% expected",c:""}].map(item=>(
            <div key={item.label} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 0",borderBottom:`1px solid ${D.border}`}}>
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
            <div key={r.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:`1px solid ${D.border}`}}>
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
  const markAll=async()=>{const u=alerts.map(a=>({...a,read:true}));setAlerts(u);await STORE.set("alerts",u);};
  const markOne=async(id)=>{const u=alerts.map(a=>a.id===id?{...a,read:true}:a);setAlerts(u);await STORE.set("alerts",u);};
  const unread=alerts.filter(a=>!a.read);const read=alerts.filter(a=>a.read);
  const iconMap={critical:<AlertCircle size={18} color={D.red}/>,warning:<AlertTriangle size={18} color={D.amber}/>,info:<Info size={18} color={"#3B82F6"}/>,ok:<CheckCircle size={18} color={D.green}/>};
  const AlRow=({a})=>{
    const bg={critical:"rgba(239,68,68,0.08)",warning:"rgba(245,158,11,0.08)",info:"rgba(59,130,246,0.08)",ok:"rgba(16,185,129,0.08)"}[a.type];
    const bc={critical:D.red,warning:D.amber,info:"#3B82F6",ok:D.green}[a.type];
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
          {[["Deaths",totalMort,D.red],["Avg Weight",avgW+"g","#3B82F6"],["Total Feed",totalFeed+"kg",D.text],["Avg Temp",avgTemp+"°C",+avgTemp>32?D.red:+avgTemp>30?D.amber:D.green],["Reports",reps.length,D.muted]].map(([l,v,c])=>(
            <div key={l} style={{background:"rgba(255,255,255,0.05)",borderRadius:12,padding:"12px 14px",border:"1px solid rgba(255,255,255,0.06)"}}>
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
  const [form,setForm]=useState({shed:"",fcr:"",totalFeed:"",mortality:"",dailyGain:"",targetDay:MAX_DAYS});
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
              <div key={it.l} style={{background:"rgba(255,255,255,0.05)",border:`1px solid ${gc(it.m,parseFloat(it.v))}30`,borderRadius:14,padding:"16px 18px",borderTop:`3px solid ${gc(it.m,parseFloat(it.v))}`}}>
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
        <thead><tr style={{borderBottom:`1px solid ${D.border}`}}>{["Time","Shed","Proj. Weight","Proj. FCR","EPI","Days Left"].map(h=><th key={h} style={{padding:"8px 10px",textAlign:"left",color:D.muted,fontWeight:700,fontSize:11,textTransform:"uppercase"}}>{h}</th>)}</tr></thead>
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
  const saveEdit=async()=>{const u=reports.map(r=>r.id===editForm.id?{...editForm,editedAt:new Date().toISOString(),editedBy:"Farm Owner"}:r);setReports(u);await STORE.set("reports",u);setSelected(u.find(r=>r.id===editForm.id));setEditMode(false);setToast({message:"Report updated!",type:"success"});};
  return <div className="fade-up">
    {toast&&<Toast message={toast.message} type={toast.type} onClose={()=>setToast(null)}/>}
    <div style={{display:"flex",gap:12,marginBottom:18,flexWrap:"wrap"}}>
      <div style={{position:"relative",flex:1,minWidth:200}}>
        <Search size={14} color={D.muted} style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)"}}/>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by date or supervisor..."
          style={{width:"100%",padding:"9px 12px 9px 34px",borderRadius:10,border:"1.5px solid rgba(255,255,255,0.1)",fontSize:14,fontFamily:"'Plus Jakarta Sans',sans-serif",outline:"none",background:"rgba(255,255,255,0.05)",color:D.text,backdropFilter:"blur(4px)"}}/>
      </div>
      <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
        {[{id:"all",label:t.allSheds},...sheds.filter(s=>s.active).map(s=>({id:s.id,label:s.name}))].map(f=>(
          <button key={f.id} onClick={()=>setFilter(f.id)} style={{padding:"7px 14px",borderRadius:99,border:`1.5px solid ${filter===f.id?"rgba(59,130,246,0.5)":"rgba(255,255,255,0.08)"}`,background:filter===f.id?"rgba(59,130,246,0.15)":"rgba(255,255,255,0.05)",color:filter===f.id?"#93C5FD":D.muted,fontSize:13,fontWeight:600,cursor:"pointer"}}>{f.label}</button>
        ))}
      </div>
    </div>
    <GCard noPad>
      <div style={{overflowX:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead><tr style={{borderBottom:`1px solid ${D.border}`}}>{["Date","Shed","Day","Session","Birds","Mort.","Weight","Temp","FCR","Lang","Status"].map(h=><th key={h} style={{padding:"11px 12px",textAlign:"left",color:D.muted,fontWeight:700,fontSize:11,textTransform:"uppercase",letterSpacing:"0.05em",whiteSpace:"nowrap"}}>{h}</th>)}</tr></thead>
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
          <div key={l} style={{background:"rgba(255,255,255,0.05)",borderRadius:10,padding:"10px 14px",border:"1px solid rgba(255,255,255,0.07)"}}>
            <div style={{fontSize:10,color:D.muted,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em"}}>{l}</div>
            <div style={{fontSize:14,fontWeight:700,color:"#fff",marginTop:4}}>{v||"\u2014"}</div>
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
          <textarea value={editForm.event} onChange={e=>setEditForm({...editForm,event:e.target.value})} rows={3} style={{width:"100%",padding:"10px 14px",borderRadius:10,border:"1.5px solid rgba(255,255,255,0.1)",fontSize:14,color:D.text,background:"rgba(255,255,255,0.05)",fontFamily:"'Plus Jakarta Sans',sans-serif",resize:"vertical",outline:"none"}}/>
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
  const add=async()=>{if(!form.name||!form.shed)return;const u=[...cameras,{...form,id:"cam_"+Date.now(),active:true}];setCameras(u);await STORE.set("cctv",u);setShowAdd(false);setForm({shed:"",name:"",url:""});};
  const remove=async(id)=>{const u=cameras.filter(c=>c.id!==id);setCameras(u);await STORE.set("cctv",u);};
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
  const upload=e=>{const file=e.target.files[0];if(!file||file.size>5*1024*1024){alert("Max 5MB");return;}const r=new FileReader();r.onload=async ev=>{const p={id:"photo_"+Date.now(),shed,caption,date:new Date().toISOString().split("T")[0],src:ev.target.result,uploadedAt:new Date().toISOString()};const u=[p,...photos];setPhotos(u);await STORE.set("photos",u);setCaption("");setShed("");};r.readAsDataURL(file);e.target.value="";};
  const del=async id=>{const u=photos.filter(p=>p.id!==id);setPhotos(u);await STORE.set("photos",u);setSelected(null);};
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
        <button key={f.id} onClick={()=>setFilter(f.id)} style={{padding:"6px 14px",borderRadius:99,border:`1.5px solid ${filter===f.id?"rgba(59,130,246,0.5)":"rgba(255,255,255,0.08)"}`,background:filter===f.id?"rgba(59,130,246,0.15)":"rgba(255,255,255,0.05)",color:filter===f.id?"#93C5FD":D.muted,fontSize:13,fontWeight:600,cursor:"pointer"}}>{f.label}</button>
      ))}
    </div>
    {filtered.length===0&&<div style={{textAlign:"center",padding:"80px",color:D.muted}}><ImageIcon size={56} color="rgba(59,130,246,0.2)" style={{margin:"0 auto 16px"}}/><p style={{fontSize:15,fontWeight:600}}>{t.noPhotos||"No photos yet"}</p></div>}
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:14}}>
      {filtered.map(photo=>(
        <div key={photo.id} onClick={()=>setSelected(photo)} style={{borderRadius:14,overflow:"hidden",cursor:"pointer",border:`1px solid ${D.border}`,transition:"all 0.2s"}}
          onMouseEnter={e=>{e.currentTarget.style.transform="scale(1.03)";e.currentTarget.style.boxShadow=`0 12px 35px rgba(0,0,0,0.4)`;}}
          onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="";}}>
          <img src={photo.src} alt={photo.caption} style={{width:"100%",height:160,objectFit:"cover",display:"block"}}/>
          <div style={{padding:"10px 12px",background:"rgba(22,27,34,0.98)"}}>
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
   FEATURE 1 — VACCINATION TRACKER 💉
══════════════════════════════════════════════════════ */
const VACC_SCHEDULE=[
  {day:1, name:"Marek's Disease",type:"Live",route:"Subcutaneous (at hatchery)",color:"purple",icon:"💉",note:"Done at hatchery before delivery"},
  {day:5, name:"IBD (Gumboro)",type:"Live",route:"Eye drop / Drinking water",color:"teal",icon:"👁️",note:"Dilute in cool water, withdraw for 2hrs before"},
  {day:7, name:"Newcastle Disease (ND-Lasota)",type:"Live",route:"Drinking water",color:"blue",icon:"💧",note:"Withdraw water 2hrs before. Mix with cold water."},
  {day:14,name:"IBD Booster (Intermediate)",type:"Live",route:"Drinking water",color:"teal",icon:"💧",note:"Use clean drinkers, withdraw water 2hrs before"},
  {day:18,name:"Newcastle ND Booster",type:"Live",route:"Drinking water",color:"blue",icon:"💧",note:"Last ND vaccination for the batch"},
  {day:21,name:"Vitamin & Electrolyte Supplement",type:"Supplement",route:"Drinking water",color:"green",icon:"🌿",note:"Give for 3 days to boost immunity"},
  {day:28,name:"Deworming (if needed)",type:"Medicine",route:"Drinking water / Feed",color:"amber",icon:"⚕️",note:"Only if worm load observed. Consult vet."},
];

function VaccinationTab({batches,sheds,vaccLogs,setVaccLogs,lang}){
  const t=T[lang];
  const [selectedBatch,setSelectedBatch]=useState("");
  const [toast,setToast]=useState(null);
  const activeBatches=batches.filter(b=>b.status==="active");
  const batch=batches.find(b=>b.id===selectedBatch);
  const shed=sheds.find(s=>s.id===batch?.shed);
  const day=batch?batchDay(batch.startDate):0;

  const logVacc=async(vaccDay,vaccName)=>{
    const key=selectedBatch+"_"+vaccDay;
    const updated={...vaccLogs,[key]:{done:true,date:new Date().toISOString(),by:"Supervisor"}};
    setVaccLogs(updated);
    await STORE.set("vaccLogs",updated);
    setToast({message:`✓ ${vaccName} logged!`,type:"success"});
  };
  const isDone=(vaccDay)=>!!vaccLogs[selectedBatch+"_"+vaccDay];
  const isOverdue=(vaccDay)=>day>vaccDay&&!isDone(vaccDay);
  const isDue=(vaccDay)=>Math.abs(day-vaccDay)<=1&&!isDone(vaccDay);

  return <div className="fade-up">
    {toast&&<Toast message={toast.message} type={toast.type} onClose={()=>setToast(null)}/>}
    <div style={{marginBottom:22}}>
      <GCard>
        <div style={{display:"flex",alignItems:"center",gap:14,flexWrap:"wrap"}}>
          <div style={{flex:1,minWidth:200}}>
            <FSelect label="Select Batch" value={selectedBatch} onChange={setSelectedBatch}
              options={[{value:"",label:"Choose active batch…"},...activeBatches.map(b=>({value:b.id,label:`Batch #${b.batchNo} — ${sheds.find(s=>s.id===b.shed)?.name||b.shed}`}))]}/>
          </div>
          {batch&&<div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
            <div style={{background:"rgba(6,182,212,0.1)",border:"1px solid rgba(6,182,212,0.25)",borderRadius:12,padding:"10px 16px",textAlign:"center"}}>
              <div style={{fontSize:9,color:D.muted,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em"}}>Current Day</div>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:22,fontWeight:700,color:"#67E8F9"}}>{day}</div>
            </div>
            <div style={{background:"rgba(16,185,129,0.1)",border:"1px solid rgba(16,185,129,0.25)",borderRadius:12,padding:"10px 16px",textAlign:"center"}}>
              <div style={{fontSize:9,color:D.muted,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em"}}>Shed</div>
              <div style={{fontSize:14,fontWeight:700,color:"#6EE7B7"}}>{shed?.name}</div>
            </div>
            <div style={{background:"rgba(245,158,11,0.1)",border:"1px solid rgba(245,158,11,0.25)",borderRadius:12,padding:"10px 16px",textAlign:"center"}}>
              <div style={{fontSize:9,color:D.muted,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em"}}>Done</div>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:22,fontWeight:700,color:"#FCD34D"}}>{VACC_SCHEDULE.filter(v=>isDone(v.day)).length}/{VACC_SCHEDULE.length}</div>
            </div>
          </div>}
        </div>
      </GCard>
    </div>

    {/* Vaccination timeline */}
    <div style={{display:"flex",flexDirection:"column",gap:10}}>
      {VACC_SCHEDULE.map((v,i)=>{
        const done=selectedBatch&&isDone(v.day);
        const overdue=selectedBatch&&isOverdue(v.day);
        const due=selectedBatch&&isDue(v.day);
        const future=selectedBatch&&day<v.day-1;
        const logEntry=vaccLogs[selectedBatch+"_"+v.day];
        const cols={purple:"rgba(139,92,246,",teal:"rgba(6,182,212,",blue:"rgba(59,130,246,",green:"rgba(16,185,129,",amber:"rgba(245,158,11,"};
        const tc={purple:"#C4B5FD",teal:"#67E8F9",blue:"#93C5FD",green:"#6EE7B7",amber:"#FCD34D"};
        const bc=cols[v.color]||cols.teal;
        const textCol=tc[v.color]||tc.teal;
        const bgAlpha=done?"0.08":overdue?"0.12":due?"0.15":"0.04";
        const borderAlpha=done?"0.2":overdue?"0.4":due?"0.5":"0.1";
        return <div key={v.day} style={{background:`${bc}${bgAlpha})`,border:`1.5px solid ${bc}${borderAlpha})`,borderRadius:16,padding:"16px 20px",position:"relative",overflow:"hidden",transition:"all 0.2s"}}>
          {due&&!done&&<div style={{position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,transparent,${textCol},transparent)`,animation:"shimmer 2s linear infinite",backgroundSize:"200% 100%"}}/>}
          <div style={{display:"flex",alignItems:"center",gap:14,flexWrap:"wrap"}}>
            {/* Day badge */}
            <div style={{width:54,height:54,borderRadius:14,background:`${bc}0.15)`,border:`1.5px solid ${bc}0.3)`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <div style={{fontSize:8,color:D.muted,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em"}}>DAY</div>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:18,fontWeight:800,color:textCol,lineHeight:1}}>{v.day}</div>
            </div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4,flexWrap:"wrap"}}>
                <span style={{fontSize:15,fontWeight:800,color:"#fff"}}>{v.icon} {v.name}</span>
                {done&&<Pill label="✓ Done" color="ok" size="xs"/>}
                {overdue&&!done&&<Pill label="⚠ OVERDUE" color="critical" size="xs"/>}
                {due&&!done&&<Pill label="📅 DUE TODAY" color="warning" size="xs"/>}
                {future&&<Pill label={`In ${v.day-day} days`} color="info" size="xs"/>}
                {!selectedBatch&&<Pill label={`Day ${v.day}`} color="closed" size="xs"/>}
                <Pill label={v.type} color={v.color==="purple"?"purple":v.color==="teal"?"teal":v.color==="green"?"ok":v.color==="amber"?"warning":"info"} size="xs"/>
              </div>
              <div style={{fontSize:12,color:D.muted,marginBottom:3}}>Route: <strong style={{color:D.text}}>{v.route}</strong></div>
              <div style={{fontSize:11,color:D.dim}}>{v.note}</div>
              {done&&logEntry&&<div style={{fontSize:10,color:D.green,marginTop:4,fontWeight:600}}>✓ Logged: {new Date(logEntry.date).toLocaleDateString("en-IN")} by {logEntry.by}</div>}
            </div>
            {selectedBatch&&!done&&(due||overdue)&&(
              <Btn variant={overdue?"danger":"primary"} size="sm" icon={Check} onClick={()=>logVacc(v.day,v.name)}>
                {overdue?"Log Now (Overdue)":"Log Done"}
              </Btn>
            )}
            {selectedBatch&&!done&&!due&&!overdue&&!future&&(
              <Btn variant="outline" size="sm" icon={Check} onClick={()=>logVacc(v.day,v.name)}>Log</Btn>
            )}
          </div>
        </div>;
      })}
    </div>

    {!selectedBatch&&<div style={{textAlign:"center",padding:"40px",color:D.muted,fontSize:13,marginTop:10}}>
      ↑ Select an active batch above to track vaccinations
    </div>}
  </div>;
}

/* ══════════════════════════════════════════════════════
   FEATURE 2+3+8 — SHED PREP CHECKLIST / FEED SCHEDULER / WEIGHT LOG
   (Integrated into existing tabs, shown as new sub-components)
══════════════════════════════════════════════════════ */
const SHED_PREP_ITEMS=[
  {id:"clean",label:"Shed cleaned and washed",icon:"🧹"},
  {id:"fumigate",label:"Fumigation done (Formalin + KMnO4)",icon:"💨"},
  {id:"litter",label:"Fresh litter spread (4–6 inches)",icon:"🌾"},
  {id:"brooder",label:"Brooders tested and working",icon:"🔥"},
  {id:"temp",label:"Pre-heated to 32–35°C",icon:"🌡️"},
  {id:"drinkers",label:"Drinkers filled and cleaned",icon:"💧"},
  {id:"feeders",label:"Feeders filled with Pre-Starter",icon:"🍽️"},
  {id:"paper",label:"Paper spread on floor (first 3 days)",icon:"📄"},
  {id:"footbath",label:"Footbath active at entrance",icon:"🦶"},
  {id:"repair",label:"Nets and curtains repaired",icon:"🔧"},
];

function ShedPrepChecklist({batchId,prepLogs,setPrepLogs}){
  const done=(id)=>!!prepLogs[batchId+"_"+id];
  const toggle=async(id)=>{
    const key=batchId+"_"+id;
    const updated={...prepLogs,[key]:!prepLogs[key]};
    setPrepLogs(updated);
    await STORE.set("prepLogs",updated);
  };
  const total=SHED_PREP_ITEMS.length;
  const completed=SHED_PREP_ITEMS.filter(i=>done(i.id)).length;
  const pct=Math.round((completed/total)*100);
  return <div style={{marginTop:16,padding:"16px 18px",background:"rgba(16,185,129,0.06)",border:"1px solid rgba(16,185,129,0.2)",borderRadius:16}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
      <div style={{display:"flex",alignItems:"center",gap:7}}>
        <div style={{width:3,height:14,borderRadius:99,background:D.green,boxShadow:`0 0 8px ${D.green}`}}/>
        <span style={{fontSize:11,fontWeight:700,color:"#6EE7B7",textTransform:"uppercase",letterSpacing:"0.1em"}}>Shed Preparation Checklist</span>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:8}}>
        <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:13,fontWeight:700,color:pct===100?D.green:D.amber}}>{completed}/{total}</span>
        {pct===100&&<Pill label="READY TO START" color="ok" size="xs"/>}
      </div>
    </div>
    <div style={{background:"rgba(255,255,255,0.05)",borderRadius:99,height:4,overflow:"hidden",marginBottom:12}}>
      <div style={{background:`linear-gradient(90deg,${D.green},#34D399)`,height:"100%",width:`${pct}%`,borderRadius:99,transition:"width 0.5s"}}/>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7}}>
      {SHED_PREP_ITEMS.map(item=>(
        <button key={item.id} onClick={()=>toggle(item.id)}
          style={{display:"flex",alignItems:"center",gap:9,padding:"9px 12px",borderRadius:11,border:`1px solid ${done(item.id)?"rgba(16,185,129,0.3)":"rgba(255,255,255,0.07)"}`,background:done(item.id)?"rgba(16,185,129,0.1)":"rgba(255,255,255,0.04)",cursor:"pointer",textAlign:"left",transition:"all 0.15s"}}>
          <div style={{width:20,height:20,borderRadius:6,border:`2px solid ${done(item.id)?D.green:"rgba(255,255,255,0.2)"}`,background:done(item.id)?D.green:"transparent",display:"grid",placeItems:"center",flexShrink:0,transition:"all 0.15s"}}>
            {done(item.id)&&<Check size={12} color="#000"/>}
          </div>
          <span style={{fontSize:11,color:done(item.id)?D.text:D.muted,fontWeight:done(item.id)?600:400}}>{item.icon} {item.label}</span>
        </button>
      ))}
    </div>
  </div>;
}

function getDailyFeedSuggestion(day,liveBirds){const g=day<=3?12:day<=7?22:day<=10?38:day<=14?58:day<=18?82:day<=21?98:day<=24?112:day<=28?128:day<=30?140:152;const totalKg=Math.round((g*liveBirds)/1000);const ft=day<=10?"Pre-Starter":day<=21?"Starter":day<=28?"Grower":"Finisher";return{gPerBird:g,totalKg,feedType:ft};}
function getFeedType(day){
  if(day<=10)return{name:"Pre-Starter",color:"purple",note:"Fine crumble, high protein 22–24%"};
  if(day<=21)return{name:"Starter",color:"teal",note:"Crumble, 20–22% protein"};
  if(day<=28)return{name:"Grower",color:"amber",note:"Pellet, 18–20% protein"};
  return{name:"Finisher",color:"green",note:"Pellet, 17–18% protein. No medication."};
}

/* ══════════════════════════════════════════════════════
   FEATURE 5 — BILL SCANNER & EXPENSE AI ANALYZER 🧾
══════════════════════════════════════════════════════ */
function BillAnalyzerTab({batches,sheds,lang}){
  const t=T[lang];
  const [bills,setBills]=useState([]);
  const [analyzing,setAnalyzing]=useState(false);
  const [selectedShed,setSelectedShed]=useState("");
  const [selectedBatch,setSelectedBatch]=useState("");
  const [aiReport,setAiReport]=useState(null);
  const [aiLoading,setAiLoading]=useState(false);
  const [toast,setToast]=useState(null);
  const [previewImg,setPreviewImg]=useState(null);
  const [editBill,setEditBill]=useState(null);
  const [showManual,setShowManual]=useState(false);
  const [listening,setListening]=useState(false);
  const [voiceField,setVoiceField]=useState(null);
  const [vendorSuggestions,setVendorSuggestions]=useState([]);
  const [showSuggestions,setShowSuggestions]=useState(false);
  const fileRef=useRef(null);
  const cameraRef=useRef(null);
  const recognitionRef=useRef(null);

  const blankManual={vendor:"",amount:"",category:"Other",date:new Date().toISOString().split("T")[0],items:"",notes:"",paymentMode:"PhonePe"};
  const [manualForm,setManualForm]=useState(blankManual);

  useEffect(()=>{STORE.get("bills_v2",[]).then(setBills);},[]);

  // When shed changes, reset batch
  useEffect(()=>{setSelectedBatch("");},[selectedShed]);

  const allBatches=batches.filter(b=>b.status==="active"||b.status==="closed");
  const shedBatches=selectedShed?allBatches.filter(b=>b.shed===selectedShed):allBatches;
  const batchBills=bills.filter(b=>b.batchId===selectedBatch);
  const batch=batches.find(b=>b.id===selectedBatch);
  const shed=sheds.find(s=>s.id===selectedShed||s.id===batch?.shed);

  // ── Bill name suggestions for entire poultry cycle ──────
  const BILL_SUGGESTIONS={
    "Feed":[
      "Pre-Starter Feed (Day 1-10)",
      "Starter Feed (Day 10-21)",
      "Grower Feed (Day 21-28)",
      "Finisher Feed (Day 28-35)",
      "Emergency Feed Purchase",
    ],
    "Medicine/Vaccine":[
      "IBD Vaccine (Day 5)",
      "Newcastle Disease Vaccine (Day 7)",
      "IBD Booster Vaccine (Day 14)",
      "Lasota ND Booster (Day 18-21)",
      "Vitamin & Electrolyte Supplement",
      "Coccidiosis Medicine",
      "Antibiotic Course",
      "Liver Tonic",
      "Multi-Vitamin Supplement",
      "Deworming Medicine",
      "Anti-stress Powder",
      "Probiotic Supplement",
    ],
    "Chicks":[
      "Day-Old Chick Purchase",
      "Chick Transportation Charge",
      "Hatchery Invoice",
    ],
    "Labour":[
      "Daily Labour Payment",
      "Shed Cleaning Labour",
      "Catching Labour (Harvest Day)",
      "Litter Removal Labour",
      "Feeding Labour (Weekly)",
      "Night Watchman Payment",
      "Supervisor Weekly Wages",
    ],
    "Electricity":[
      "APSPDCL Electricity Bill",
      "Generator Fuel (Diesel)",
      "Generator Repair/Service",
      "Brooder Electricity Cost",
      "Fan & Ventilation Power",
    ],
    "Water":[
      "Borewell Motor Electricity",
      "Water Tanker Charge",
      "Nipple Drinker Repair",
      "Water Treatment Chemical",
    ],
    "Equipment":[
      "Feeder Purchase/Repair",
      "Drinker/Nipple Replacement",
      "Brooder Gas/Heater",
      "Tarpaulin/Curtain Purchase",
      "Rice Husk/Litter Purchase",
      "Weighing Scale Repair",
      "CCTV Camera Repair",
      "Shed Repair & Maintenance",
      "Wire/Netting Repair",
    ],
    "Transport":[
      "Chick Transport Vehicle",
      "Feed Delivery Charge",
      "Bird Catching Vehicle Hire",
      "Medicine Delivery Charge",
    ],
    "Biosecurity":[
      "Disinfectant Purchase (Virocid/Formalin)",
      "Footbath Chemical Refill",
      "Lime Powder Purchase",
      "Protective Gear (Masks/Gloves)",
    ],
    "Other":[
      "Poultry Insurance Premium",
      "Veterinary Doctor Visit",
      "Shed Rent/Lease",
      "Loan Interest Payment",
      "Gunny Bags Purchase",
      "Weighment Charges (Harvest)",
      "Market Commission",
    ],
  };

  const ALL_SUGGESTIONS=Object.values(BILL_SUGGESTIONS).flat();

  const filterSuggestions=(text)=>{
    if(!text||text.length<2){setVendorSuggestions([]);setShowSuggestions(false);return;}
    const lower=text.toLowerCase();
    const matches=ALL_SUGGESTIONS.filter(s=>s.toLowerCase().includes(lower));
    // Also add suggestions from current category
    const catMatches=(BILL_SUGGESTIONS[manualForm.category]||[]).filter(s=>!matches.includes(s)).slice(0,3);
    setVendorSuggestions([...matches,...catMatches].slice(0,8));
    setShowSuggestions(true);
  };
  const grouped=batchBills.reduce((acc,bill)=>{const cat=bill.category||"Other";if(!acc[cat])acc[cat]={total:0,count:0,bills:[]};acc[cat].total+=+bill.amount||0;acc[cat].count++;acc[cat].bills.push(bill);return acc;},{});
  const totalExpense=batchBills.reduce((s,b)=>s+(+b.amount||0),0);

  // ── Voice Input ─────────────────────────────────────────
  const startVoice=(field,setter)=>{
    const SpeechRecognition=window.SpeechRecognition||window.webkitSpeechRecognition;
    if(!SpeechRecognition){setToast({message:"Voice not supported on this browser",type:"error"});return;}
    const rec=new SpeechRecognition();
    rec.lang="te-IN";  // Telugu by default, also works for Hindi/English
    rec.interimResults=false;
    rec.maxAlternatives=1;
    recognitionRef.current=rec;
    setListening(true);
    setVoiceField(field);
    rec.onresult=(e)=>{
      const transcript=e.results[0][0].transcript;
      setter(transcript);
      setListening(false);
      setVoiceField(null);
      setToast({message:"Got it: "+transcript,type:"success"});
    };
    rec.onerror=()=>{setListening(false);setVoiceField(null);setToast({message:"Could not hear clearly, try again",type:"error"});};
    rec.onend=()=>{setListening(false);setVoiceField(null);};
    rec.start();
  };
  const stopVoice=()=>{recognitionRef.current?.stop();setListening(false);setVoiceField(null);};

  // ── AI Bill Scan ─────────────────────────────────────────
  const scanBill=async(imageBase64,mimeType)=>{
    setAnalyzing(true);
    try{
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:600,messages:[{role:"user",content:[{type:"image",source:{type:"base64",media_type:mimeType,data:imageBase64}},{type:"text",text:"Analyze this poultry farm bill/receipt. Extract: vendor name, date, total rupee amount, category (Feed/Medicine/Chicks/Labour/Electricity/Water/Equipment/Transport/Other), key items. Return ONLY JSON: {\"vendor\":\"\",\"date\":\"\",\"amount\":0,\"category\":\"\",\"items\":[\"\"],\"notes\":\"\",\"confidence\":\"high\"}"}]}]})});
      const data=await res.json();
      const text=data.content?.map(x=>x.text||"").join("").trim();
      try{return JSON.parse(text.replace(/```json|```/g,"").trim());}
      catch{return{vendor:"Unknown",date:"",amount:0,category:"Other",items:[],notes:"Could not read",confidence:"low"};}
    }catch(e){return{vendor:"Unknown",date:"",amount:0,category:"Other",items:[],notes:"Scan failed",confidence:"low"};}
    finally{setAnalyzing(false);}
  };

  const handleFile=async(file)=>{
    if(!file)return;
    const reader=new FileReader();
    reader.onload=async(ev)=>{
      const dataUrl=ev.target.result;
      setPreviewImg(dataUrl);
      const extracted=await scanBill(dataUrl.split(",")[1],file.type||"image/jpeg");
      setEditBill({id:"bill_"+Date.now(),batchId:selectedBatch,src:dataUrl,scannedAt:new Date().toISOString(),...extracted,amount:extracted.amount||0});
    };
    reader.readAsDataURL(file);
  };

  const saveBill=async(bill)=>{
    const updated=[bill,...bills];
    setBills(updated);await STORE.set("bills_v2",updated);
    setEditBill(null);setPreviewImg(null);
    setToast({message:"Expense saved!",type:"success"});
  };

  const saveManual=async()=>{
    if(!manualForm.vendor||!manualForm.amount)return setToast({message:"Enter vendor and amount",type:"error"});
    const bill={id:"bill_"+Date.now(),batchId:selectedBatch,vendor:manualForm.vendor,amount:+manualForm.amount,category:manualForm.category,date:manualForm.date,items:manualForm.items?[manualForm.items]:[],notes:manualForm.notes,paymentMode:manualForm.paymentMode,src:null,scannedAt:new Date().toISOString(),confidence:"manual"};
    const updated=[bill,...bills];
    setBills(updated);await STORE.set("bills_v2",updated);
    setShowManual(false);setManualForm(blankManual);
    setToast({message:"Expense added!",type:"success"});
  };

  const deleteBill=async(id)=>{const u=bills.filter(b=>b.id!==id);setBills(u);await STORE.set("bills",u);};

  const analyzeAll=async()=>{
    if(!batchBills.length)return;
    setAiLoading(true);
    const summary=Object.entries(grouped).map(([cat,g])=>cat+": Rs."+g.total.toLocaleString()+" ("+g.count+" bills)").join(", ");
    const topBills=batchBills.sort((a,b)=>b.amount-a.amount).slice(0,5).map(b=>b.vendor+" - "+b.category+": Rs."+Number(b.amount).toLocaleString()).join("; ");
    const ln={en:"English",te:"Telugu",hi:"Hindi",mai:"Maithili"};
    try{
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:800,messages:[{role:"user",content:"Sri Farms Chittoor AP broiler batch #"+batch?.batchNo+". Total expenses: Rs."+totalExpense.toLocaleString()+". Breakdown: "+summary+". Top bills: "+topBills+". Birds: "+batch?.chicks?.toLocaleString()+". Cost per bird: Rs."+(batch?.chicks?Math.round(totalExpense/batch.chicks):0)+". Analyze in "+ln[lang]+": 1) Where is money going most? 2) Which costs are too high vs AP standards? 3) How to reduce next cycle? 4) 3 action items to improve profit. Be specific with amounts."}]})});
      const data=await res.json();
      setAiReport(data.content?.map(x=>x.text||"").join("")||"Analysis failed.");
    }catch(e){setAiReport("AI unavailable: "+e.message);}
    setAiLoading(false);
  };

  const PAYMENT_ICONS={"PhonePe":"📱","GPay":"📱","Cash":"💵","Bank Transfer":"🏦","Cheque":"📝","Other":"💳"};
  const CAT_COL={"Feed":"#F59E0B","Medicine/Vaccine":"#22C55E","Chicks":"#A855F7","Labour":"#3B82F6","Electricity":"#FCD34D","Water":"#67E8F9","Equipment":"#F97316","Transport":"#94A3B8","Other":"#7D8590"};

  // Voice input field component (with optional suggestion dropdown)
  const VoiceInput=({label,value,onChange,placeholder,type="text",required,withSuggestions=false})=>{
    const isThisListening=listening&&voiceField===label;
    const showDrop=withSuggestions&&showSuggestions&&vendorSuggestions.length>0;
    return <div style={{display:"flex",flexDirection:"column",gap:5,position:"relative"}}>
      <label style={{fontSize:10,fontWeight:700,color:"#7D8590",textTransform:"uppercase",letterSpacing:"0.1em"}}>{label}{required&&<span style={{color:"#EF4444"}}> *</span>}</label>
      <div style={{display:"flex",gap:6}}>
        <input type={type} value={value||""} autoComplete="off"
          onChange={e=>{onChange(e.target.value);if(withSuggestions)filterSuggestions(e.target.value);}}
          onFocus={()=>{if(withSuggestions&&value&&value.length>=2)filterSuggestions(value);}}
          onBlur={()=>setTimeout(()=>setShowSuggestions(false),200)}
          placeholder={placeholder}
          style={{flex:1,padding:"10px 13px",borderRadius:10,border:"1.5px solid rgba(255,255,255,0.1)",fontSize:14,color:"#E6EDF3",background:"rgba(255,255,255,0.05)",fontFamily:"'Plus Jakarta Sans',sans-serif",outline:"none"}}/>
        <button onClick={()=>isThisListening?stopVoice():startVoice(label,(v)=>{onChange(v);if(withSuggestions)filterSuggestions(v);})}
          style={{width:40,height:40,borderRadius:10,border:"none",background:isThisListening?"rgba(239,68,68,0.2)":"rgba(245,158,11,0.12)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,borderWidth:1,borderStyle:"solid",borderColor:isThisListening?"rgba(239,68,68,0.4)":"rgba(245,158,11,0.25)"}}
          title="Tap to speak">
          {isThisListening?<span style={{fontSize:16}}>🔴</span>:<span style={{fontSize:16}}>🎤</span>}
        </button>
      </div>
      {isThisListening&&<p style={{fontSize:11,color:"#FCA5A5",fontWeight:600}}>Listening... speak now</p>}
      {showDrop&&<div style={{position:"absolute",top:"100%",left:0,right:50,background:"#161B22",border:"1px solid rgba(245,158,11,0.3)",borderRadius:11,zIndex:200,maxHeight:220,overflowY:"auto",boxShadow:"0 8px 24px rgba(0,0,0,0.5)",marginTop:3}}>
        <div style={{padding:"7px 12px 4px",fontSize:9,fontWeight:700,color:"#7D8590",textTransform:"uppercase",letterSpacing:"0.1em",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>Suggested Bill Names</div>
        {vendorSuggestions.map((s,i)=><button key={i} onMouseDown={()=>{onChange(s);setShowSuggestions(false);}}
          style={{display:"block",width:"100%",textAlign:"left",padding:"9px 14px",border:"none",background:"transparent",cursor:"pointer",fontSize:12,color:"#E6EDF3",fontFamily:"'Plus Jakarta Sans',sans-serif",transition:"background 0.1s"}}
          onMouseEnter={e=>e.currentTarget.style.background="rgba(245,158,11,0.1)"}
          onMouseLeave={e=>e.currentTarget.style.background="transparent"}>{s}</button>)}
      </div>}
    </div>;
  };

  // Category-based quick suggestions panel
  const CategorySuggestions=({category,onPick})=>{
    const catBills=BILL_SUGGESTIONS[category]||[];
    if(!catBills.length)return null;
    return <div style={{marginBottom:14}}>
      <div style={{fontSize:10,fontWeight:700,color:"#7D8590",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:8,display:"flex",alignItems:"center",gap:5}}>
        <Leaf size={10}/> Common bills for {category}
      </div>
      <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
        {catBills.map((name,i)=><button key={i} onClick={()=>onPick(name)}
          style={{padding:"5px 11px",borderRadius:99,border:"1px solid rgba(245,158,11,0.25)",background:"rgba(245,158,11,0.06)",cursor:"pointer",fontSize:11,color:"#FCD34D",fontWeight:500,transition:"all 0.15s",whiteSpace:"nowrap"}}
          onMouseEnter={e=>{e.currentTarget.style.background="rgba(245,158,11,0.15)";e.currentTarget.style.borderColor="rgba(245,158,11,0.5)";}}
          onMouseLeave={e=>{e.currentTarget.style.background="rgba(245,158,11,0.06)";e.currentTarget.style.borderColor="rgba(245,158,11,0.25)";}}>
          {name}
        </button>)}
      </div>
    </div>;
  };

  return <div className="fade-up">
    {toast&&<Toast message={toast.message} type={toast.type} onClose={()=>setToast(null)}/>}

    {/* Shed + Batch selector */}
    <GCard style={{marginBottom:16}}>
      {sheds.length===0||allBatches.length===0?
        <div style={{textAlign:"center",padding:"20px 10px",color:"#7D8590"}}>
          <div style={{fontSize:32,marginBottom:8}}>🏚️</div>
          <p style={{fontSize:13,fontWeight:700,color:"#E6EDF3",marginBottom:4}}>{sheds.length===0?"No Sheds Added Yet":"No Batches Started Yet"}</p>
          <p style={{fontSize:11,lineHeight:1.7}}>{sheds.length===0?"Go to Sheds tab to add your first shed, then start a batch.":"Go to Batches tab and start a batch first."}</p>
        </div>
      :<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:selectedShed||selectedBatch?14:0}}>
        <FSelect label="Select Shed" value={selectedShed} onChange={setSelectedShed}
          options={[{value:"",label:"-- Select Shed --"},...sheds.map(s=>({value:s.id,label:s.name}))]}/>
        <FSelect label="Select Batch" value={selectedBatch} onChange={setSelectedBatch}
          options={[{value:"",label:selectedShed?(shedBatches.length?"-- Select Batch --":"No batches for this shed"):"-- Select Shed First --"},...shedBatches.map(b=>({value:b.id,label:"Batch #"+b.batchNo+" ("+b.status+")"}))]
        }/>
      </div>}
      {selectedBatch&&<div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginTop:14}}>
        {[["Bills",batchBills.length,"#67E8F9"],["Total Spent","Rs."+totalExpense.toLocaleString(),"#FCA5A5"],["Per Bird",batch?.chicks?"Rs."+Math.round(totalExpense/batch.chicks):"--","#FCD34D"]].map(([l,v,col])=>(
          <div key={l} style={{background:"rgba(255,255,255,0.04)",borderRadius:11,padding:"11px 13px",textAlign:"center",border:"1px solid rgba(255,255,255,0.07)"}}>
            <div style={{fontSize:9,color:"#7D8590",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:4}}>{l}</div>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:16,fontWeight:700,color:col}}>{v}</div>
          </div>
        ))}
      </div>}
    </GCard>

    {selectedBatch&&sheds.length>0&&allBatches.length>0&&<>
      {/* 3 action buttons */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:16}}>
        {/* Manual entry */}
        <button onClick={()=>setShowManual(true)}
          style={{padding:"14px 10px",borderRadius:14,border:"1.5px solid rgba(245,158,11,0.3)",background:"rgba(245,158,11,0.07)",cursor:"pointer",textAlign:"center",transition:"all 0.2s"}}
          onMouseEnter={e=>e.currentTarget.style.background="rgba(245,158,11,0.14)"}
          onMouseLeave={e=>e.currentTarget.style.background="rgba(245,158,11,0.07)"}>
          <div style={{fontSize:24,marginBottom:5}}>✍️</div>
          <div style={{fontSize:12,fontWeight:700,color:"#FCD34D",lineHeight:1.3}}>Add Expense</div>
          <div style={{fontSize:10,color:"#7D8590",marginTop:3}}>PhonePe / Cash / Any</div>
        </button>
        {/* Camera scan */}
        <button onClick={()=>cameraRef.current?.click()}
          style={{padding:"14px 10px",borderRadius:14,border:"1.5px solid rgba(34,197,94,0.3)",background:"rgba(34,197,94,0.07)",cursor:"pointer",textAlign:"center",transition:"all 0.2s"}}
          onMouseEnter={e=>e.currentTarget.style.background="rgba(34,197,94,0.14)"}
          onMouseLeave={e=>e.currentTarget.style.background="rgba(34,197,94,0.07)"}>
          <div style={{fontSize:24,marginBottom:5}}>📷</div>
          <div style={{fontSize:12,fontWeight:700,color:"#86EFAC",lineHeight:1.3}}>Scan Bill</div>
          <div style={{fontSize:10,color:"#7D8590",marginTop:3}}>AI reads automatically</div>
        </button>
        {/* Upload */}
        <button onClick={()=>fileRef.current?.click()}
          style={{padding:"14px 10px",borderRadius:14,border:"1.5px solid rgba(59,130,246,0.3)",background:"rgba(59,130,246,0.07)",cursor:"pointer",textAlign:"center",transition:"all 0.2s"}}
          onMouseEnter={e=>e.currentTarget.style.background="rgba(59,130,246,0.14)"}
          onMouseLeave={e=>e.currentTarget.style.background="rgba(59,130,246,0.07)"}>
          <div style={{fontSize:24,marginBottom:5}}>📂</div>
          <div style={{fontSize:12,fontWeight:700,color:"#93C5FD",lineHeight:1.3}}>Upload Photo</div>
          <div style={{fontSize:10,color:"#7D8590",marginTop:3}}>From gallery</div>
        </button>
      </div>
      <input type="file" ref={fileRef} accept="image/*" onChange={e=>handleFile(e.target.files[0])} style={{display:"none"}}/>
      <input type="file" ref={cameraRef} accept="image/*" capture="environment" onChange={e=>handleFile(e.target.files[0])} style={{display:"none"}}/>

      {/* Scanning indicator */}
      {analyzing&&<div style={{display:"flex",alignItems:"center",gap:12,padding:"14px 16px",background:"rgba(245,158,11,0.08)",border:"1px solid rgba(245,158,11,0.25)",borderRadius:13,marginBottom:14}}>
        <div className="spin" style={{width:28,height:28,border:"3px solid rgba(245,158,11,0.2)",borderTopColor:"#F59E0B",borderRadius:"50%",flexShrink:0}}/>
        <div><div style={{fontSize:13,fontWeight:700,color:"#FCD34D"}}>AI Reading Your Bill...</div><div style={{fontSize:11,color:"#7D8590"}}>Extracting amount, vendor, category</div></div>
      </div>}

      {/* Expense breakdown */}
      {batchBills.length>0&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:16}}>
        <GCard title="Category Breakdown" glow="amber">
          {Object.entries(grouped).sort((a,b)=>b[1].total-a[1].total).map(([cat,g])=>{
            const pct=totalExpense?Math.round(g.total/totalExpense*100):0;
            const col=CAT_COL[cat]||"#7D8590";
            return <div key={cat} style={{marginBottom:10}}>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:4}}>
                <span style={{color:"#E6EDF3",fontWeight:600}}>{cat}</span>
                <span style={{fontFamily:"'JetBrains Mono',monospace",fontWeight:700,color:col}}>Rs.{g.total.toLocaleString()} <span style={{color:"#484F58",fontWeight:400}}>({pct}%)</span></span>
              </div>
              <div style={{background:"rgba(255,255,255,0.06)",borderRadius:99,height:5,overflow:"hidden"}}>
                <div style={{background:col,height:"100%",width:pct+"%",borderRadius:99,transition:"width 0.6s ease"}}/>
              </div>
            </div>;
          })}
        </GCard>

        <GCard glow="purple" title="AI Analysis">
          {!aiReport&&!aiLoading&&<div style={{textAlign:"center",padding:"16px 0"}}>
            <Cpu size={32} color="rgba(168,85,247,0.4)" style={{margin:"0 auto 10px"}}/>
            <p style={{fontSize:11,color:"#7D8590",marginBottom:12}}>Analyze expenses for next batch improvement</p>
            <Btn icon={Cpu} onClick={analyzeAll} variant="outline" size="sm" style={{width:"100%",justifyContent:"center"}}>Analyze with AI</Btn>
          </div>}
          {aiLoading&&<div style={{display:"flex",alignItems:"center",gap:10,padding:"12px 0"}}>
            <div className="spin" style={{width:22,height:22,border:"2px solid rgba(168,85,247,0.3)",borderTopColor:"#A855F7",borderRadius:"50%",flexShrink:0}}/>
            <span style={{fontSize:12,color:"#C084FC"}}>Analyzing {batchBills.length} expenses...</span>
          </div>}
          {aiReport&&<div>
            <p style={{fontSize:11,color:"#E6EDF3",lineHeight:1.8,whiteSpace:"pre-line",maxHeight:220,overflowY:"auto"}}>{aiReport}</p>
            <Btn variant="ghost" size="sm" icon={RefreshCw} onClick={()=>{setAiReport(null);analyzeAll();}} style={{marginTop:8}}>Re-Analyze</Btn>
          </div>}
        </GCard>
      </div>}

      {/* Bills list */}
      {batchBills.length===0?<div style={{textAlign:"center",padding:"50px 20px",color:"#7D8590"}}>
        <div style={{fontSize:44,marginBottom:12}}>🧾</div>
        <p style={{fontSize:14,fontWeight:700,color:"#E6EDF3",marginBottom:6}}>No expenses recorded yet</p>
        <p style={{fontSize:12,lineHeight:1.7}}>Tap the buttons above to add expenses manually, scan a bill, or upload a photo</p>
      </div>:
      <GCard title={"All Expenses ("+batchBills.length+")"} noPad>
        {batchBills.sort((a,b)=>new Date(b.scannedAt)-new Date(a.scannedAt)).map(bill=>{
          const col=CAT_COL[bill.category]||"#7D8590";
          const pmIcon=PAYMENT_ICONS[bill.paymentMode]||"💳";
          return <div key={bill.id} style={{padding:"13px 16px",borderBottom:"1px solid rgba(255,255,255,0.05)",display:"flex",alignItems:"center",gap:12}}>
            {bill.src?<img src={bill.src} alt="" style={{width:42,height:36,objectFit:"cover",borderRadius:8,flexShrink:0,border:"1px solid rgba(255,255,255,0.1)"}}/>
              :<div style={{width:42,height:36,borderRadius:8,background:col+"15",border:"1px solid "+col+"30",display:"grid",placeItems:"center",flexShrink:0,fontSize:18}}>{pmIcon}</div>}
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:13,fontWeight:700,color:"#E6EDF3",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{bill.vendor||"Unknown"}</div>
              <div style={{fontSize:10,color:"#7D8590",marginTop:2,display:"flex",gap:8,flexWrap:"wrap"}}>
                <span style={{color:col+"CC",fontWeight:600}}>{bill.category}</span>
                <span>{bill.date}</span>
                {bill.paymentMode&&<span>{pmIcon} {bill.paymentMode}</span>}
              </div>
            </div>
            <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:5,flexShrink:0}}>
              <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:15,fontWeight:700,color:"#FCD34D"}}>Rs.{Number(bill.amount).toLocaleString()}</span>
              <button onClick={()=>deleteBill(bill.id)} style={{background:"none",border:"none",cursor:"pointer",color:"#484F58",padding:2}}>
                <Trash2 size={13}/>
              </button>
            </div>
          </div>;
        })}
      </GCard>}
    </>}

    {!selectedBatch&&<div style={{textAlign:"center",padding:"60px 20px",color:"#7D8590"}}>
      <div style={{fontSize:48,marginBottom:14}}>🧾</div>
      <p style={{fontSize:14,fontWeight:700,color:"#E6EDF3",marginBottom:6}}>Bill Scanner & Expense Tracker</p>
      <p style={{fontSize:12,lineHeight:1.7}}>Select a batch above to track all expenses</p>
    </div>}

    {/* Manual Expense Modal */}
    {showManual&&<Modal title="Add Expense" onClose={()=>{setShowManual(false);setManualForm(blankManual);}} width={500}>
      <div style={{display:"flex",flexDirection:"column",gap:13}}>
        {/* Payment mode selector */}
        <div>
          <label style={{fontSize:10,fontWeight:700,color:"#7D8590",textTransform:"uppercase",letterSpacing:"0.1em",display:"block",marginBottom:9}}>Payment Method</label>
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            {[["PhonePe","📱","#6366F1"],["GPay","📱","#34D399"],["Cash","💵","#F59E0B"],["Bank Transfer","🏦","#3B82F6"],["Cheque","📝","#94A3B8"],["Other","💳","#7D8590"]].map(([mode,icon,col])=>(
              <button key={mode} onClick={()=>setManualForm({...manualForm,paymentMode:mode})}
                style={{padding:"8px 12px",borderRadius:10,border:"1.5px solid "+(manualForm.paymentMode===mode?col+"70":"rgba(255,255,255,0.08)"),background:manualForm.paymentMode===mode?col+"18":"rgba(255,255,255,0.03)",cursor:"pointer",display:"flex",alignItems:"center",gap:5,transition:"all 0.15s"}}>
                <span style={{fontSize:14}}>{icon}</span>
                <span style={{fontSize:11,fontWeight:700,color:manualForm.paymentMode===mode?col:"#7D8590"}}>{mode}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Category */}
        <div>
          <label style={{fontSize:10,fontWeight:700,color:"#7D8590",textTransform:"uppercase",letterSpacing:"0.1em",display:"block",marginBottom:9}}>Category</label>
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            {["Feed","Medicine/Vaccine","Chicks","Labour","Electricity","Water","Equipment","Transport","Biosecurity","Other"].map(cat=>{
              const col=CAT_COL[cat]||"#7D8590";
              return <button key={cat} onClick={()=>{setManualForm({...manualForm,category:cat});setShowSuggestions(false);}}
                style={{padding:"6px 12px",borderRadius:9,border:"1.5px solid "+(manualForm.category===cat?col+"60":"rgba(255,255,255,0.07)"),background:manualForm.category===cat?col+"12":"transparent",cursor:"pointer",fontSize:11,fontWeight:700,color:manualForm.category===cat?col:"#7D8590",transition:"all 0.15s"}}>{cat}</button>;
            })}
          </div>
        </div>

        {/* Smart bill name suggestions based on selected category */}
        <CategorySuggestions category={manualForm.category} onPick={name=>{setManualForm({...manualForm,vendor:name});setShowSuggestions(false);}}/>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <VoiceInput label="Bill Name / Vendor" value={manualForm.vendor} onChange={v=>setManualForm({...manualForm,vendor:v})} placeholder="Type or pick suggestion above..." required withSuggestions={true}/>
          <VoiceInput label="Amount (Rs.)" value={manualForm.amount} onChange={v=>setManualForm({...manualForm,amount:v})} placeholder="e.g. 4500" type="number" required/>
          <FInput label="Date" value={manualForm.date} onChange={v=>setManualForm({...manualForm,date:v})} type="date"/>
          <VoiceInput label="Items / Description" value={manualForm.items} onChange={v=>setManualForm({...manualForm,items:v})} placeholder="What was bought?"/>
        </div>

        <div style={{display:"flex",flexDirection:"column",gap:5}}>
          <label style={{fontSize:10,fontWeight:700,color:"#7D8590",textTransform:"uppercase",letterSpacing:"0.1em",display:"flex",alignItems:"center",gap:6}}>
            Notes (Optional)
            <button onClick={()=>startVoice("Notes",v=>setManualForm({...manualForm,notes:v}))}
              style={{width:28,height:28,borderRadius:8,border:"1px solid rgba(245,158,11,0.25)",background:"rgba(245,158,11,0.08)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13}}>
              {listening&&voiceField==="Notes"?"🔴":"🎤"}
            </button>
          </label>
          <textarea value={manualForm.notes} onChange={e=>setManualForm({...manualForm,notes:e.target.value})} rows={2} placeholder="Any notes..."
            style={{padding:"10px 13px",borderRadius:10,border:"1.5px solid rgba(255,255,255,0.1)",fontSize:13,color:"#E6EDF3",background:"rgba(255,255,255,0.05)",fontFamily:"'Plus Jakarta Sans',sans-serif",resize:"vertical",outline:"none"}}/>
        </div>

        <div style={{padding:"10px 13px",background:"rgba(99,102,241,0.07)",border:"1px solid rgba(99,102,241,0.2)",borderRadius:11,fontSize:12,color:"#A5B4FC",display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontSize:16}}>💡</span> Tap the <span style={{fontSize:14}}>🎤</span> mic button next to any field to speak instead of typing. Works in Telugu, Hindi, and English.
        </div>

        <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
          <Btn variant="outline" onClick={()=>{setShowManual(false);setManualForm(blankManual);}}>Cancel</Btn>
          <Btn icon={Check} onClick={saveManual}>Save Expense</Btn>
        </div>
      </div>
    </Modal>}

    {/* AI-extracted bill review modal */}
    {editBill&&<Modal title="Review Scanned Bill" onClose={()=>{setEditBill(null);setPreviewImg(null);}} width={540}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        {previewImg&&<div style={{gridColumn:"span 2"}}>
          <img src={previewImg} alt="bill" style={{width:"100%",maxHeight:180,objectFit:"contain",borderRadius:11,border:"1px solid rgba(255,255,255,0.1)"}}/>
          <div style={{marginTop:7,display:"flex",alignItems:"center",gap:6}}>
            <Pill label={editBill.confidence==="high"?"High Confidence":editBill.confidence==="medium"?"Medium Confidence":"Low - Please verify"} color={editBill.confidence==="high"?"ok":editBill.confidence==="medium"?"warning":"critical"} size="xs"/>
            <span style={{fontSize:10,color:"#7D8590"}}>AI extracted - correct if needed</span>
          </div>
        </div>}
        <VoiceInput label="Vendor" value={editBill.vendor||""} onChange={v=>setEditBill({...editBill,vendor:v})}/>
        <FInput label="Amount (Rs.)" value={editBill.amount||""} onChange={v=>setEditBill({...editBill,amount:v})} type="number" required/>
        <FInput label="Date" value={editBill.date||""} onChange={v=>setEditBill({...editBill,date:v})} type="date"/>
        <FSelect label="Category" value={editBill.category||"Other"} onChange={v=>setEditBill({...editBill,category:v})}
          options={["Feed","Medicine/Vaccine","Chicks","Labour","Electricity","Water","Equipment","Transport","Other"]}/>
      </div>
      <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:16}}>
        <Btn variant="outline" onClick={()=>{setEditBill(null);setPreviewImg(null);}}>Discard</Btn>
        <Btn icon={Check} onClick={()=>saveBill(editBill)}>Save Bill</Btn>
      </div>
    </Modal>}
  </div>;
}

/* ══════════════════════════════════════════════════════
   FEATURE 7 — BIOSECURITY LOG 🔒
══════════════════════════════════════════════════════ */
function BiosecurityTab({sheds,batches,lang}){
  const [logs,setLogs]=useState([]);
  const [form,setForm]=useState({shed:"",date:new Date().toISOString().split("T")[0],footbathChanged:false,visitorCount:0,visitorNames:"",vehiclesNear:false,disinfectionDone:false,waterTested:false,litterCondition:"Good",ammoniaSafe:true,notes:""});
  const [toast,setToast]=useState(null);

  useEffect(()=>{STORE.get("biosecLogs",[]).then(setLogs);},[]);

  const submit=async()=>{
    if(!form.shed)return;
    const entry={...form,id:Date.now(),submittedAt:new Date().toISOString()};
    const updated=[entry,...logs];
    setLogs(updated);
    await STORE.set("biosecLogs",updated);
    setForm(prev=>({...prev,visitorCount:0,visitorNames:"",vehiclesNear:false,notes:""}));
    setToast({message:"Biosecurity log saved!",type:"success"});
  };

  const score=(log)=>{
    let s=100;
    if(!log.footbathChanged)s-=15;
    if(log.vehiclesNear)s-=20;
    if(log.visitorCount>2)s-=10;
    if(!log.disinfectionDone)s-=15;
    if(!log.ammoniaSafe)s-=20;
    if(log.litterCondition==="Poor")s-=20;
    else if(log.litterCondition==="Fair")s-=10;
    return Math.max(0,s);
  };

  return <div className="fade-up">
    {toast&&<Toast message={toast.message} type={toast.type} onClose={()=>setToast(null)}/>}
    <div style={{display:"grid",gridTemplateColumns:"1fr 360px",gap:18}}>
      <GCard title="Daily Biosecurity Check" glow="teal">
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
          <FSelect label="Shed" value={form.shed} onChange={v=>setForm({...form,shed:v})} required
            options={[{value:"",label:"Select shed…"},...sheds.filter(s=>s.active).map(s=>({value:s.id,label:s.name}))]}/>
          <FInput label="Date" value={form.date} onChange={v=>setForm({...form,date:v})} type="date"/>
          <FInput label="Visitor Count" value={form.visitorCount} onChange={v=>setForm({...form,visitorCount:+v})} type="number" placeholder="0"/>
          <FInput label="Visitor Names" value={form.visitorNames} onChange={v=>setForm({...form,visitorNames:v})} placeholder="If any"/>
          <FSelect label="Litter Condition" value={form.litterCondition} onChange={v=>setForm({...form,litterCondition:v})} options={["Good","Fair","Poor"]}/>
          <div/>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
          {[
            {key:"footbathChanged",label:"🦶 Footbath changed today",ok:form.footbathChanged},
            {key:"disinfectionDone",label:"🧴 Shed disinfection done",ok:form.disinfectionDone},
            {key:"waterTested",label:"💧 Drinkers cleaned & checked",ok:form.waterTested},
            {key:"ammoniaSafe",label:"👃 Ammonia level safe (no eye sting)",ok:form.ammoniaSafe},
            {key:"vehiclesNear",label:"🚛 Vehicles parked near shed",ok:!form.vehiclesNear,invert:true},
          ].map(item=>(
            <button key={item.key} onClick={()=>setForm({...form,[item.key]:!form[item.key]})}
              style={{display:"flex",alignItems:"center",gap:9,padding:"10px 13px",borderRadius:11,border:`1px solid ${item.ok?"rgba(16,185,129,0.3)":"rgba(239,68,68,0.3)"}`,background:item.ok?"rgba(16,185,129,0.08)":"rgba(239,68,68,0.06)",cursor:"pointer",textAlign:"left",transition:"all 0.15s"}}>
              <div style={{width:20,height:20,borderRadius:6,border:`2px solid ${item.ok?D.green:D.red}`,background:item.ok?D.green:"transparent",display:"grid",placeItems:"center",flexShrink:0}}>
                {item.ok&&<Check size={12} color="#000"/>}
              </div>
              <span style={{fontSize:11,fontWeight:600,color:item.ok?D.text:D.muted}}>{item.label}</span>
            </button>
          ))}
        </div>
        <div style={{marginBottom:14}}>
          <label style={{fontSize:10,fontWeight:700,color:D.muted,textTransform:"uppercase",letterSpacing:"0.1em",display:"block",marginBottom:6}}>Notes / Observations</label>
          <textarea value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} rows={2} placeholder="Any biosecurity concerns today..."
            style={{width:"100%",padding:"10px 14px",borderRadius:11,border:"1.5px solid rgba(255,255,255,0.1)",fontSize:13,color:D.text,background:"rgba(255,255,255,0.05)",fontFamily:"'Plus Jakarta Sans',sans-serif",resize:"vertical",outline:"none"}}/>
        </div>
        <Btn icon={Check} onClick={submit} disabled={!form.shed} style={{width:"100%",justifyContent:"center"}}>Submit Biosecurity Log</Btn>
      </GCard>

      <div>
        <GCard title="Recent Logs" style={{marginBottom:14}}>
          {logs.slice(0,5).map(log=>{
            const s=score(log);
            const shedName=sheds.find(x=>x.id===log.shed)?.name||log.shed;
            return <div key={log.id} style={{padding:"10px 0",borderBottom:"1px solid rgba(255,255,255,0.05)"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                <span style={{fontSize:13,fontWeight:700,color:"#fff"}}>{shedName}</span>
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:14,fontWeight:700,color:s>=80?D.green:s>=60?D.amber:D.red}}>{s}</div>
                  <Pill label={s>=80?"SAFE":s>=60?"CAUTION":"RISK"} color={s>=80?"ok":s>=60?"warning":"critical"} size="xs"/>
                </div>
              </div>
              <div style={{fontSize:10,color:D.muted}}>{log.date} · {log.visitorCount} visitors · Litter: {log.litterCondition}</div>
            </div>;
          })}
          {logs.length===0&&<p style={{fontSize:12,color:D.muted,textAlign:"center",padding:"20px 0"}}>No logs yet</p>}
        </GCard>
        <GCard title="Biosecurity Rules" glow="teal">
          {[["Change footbath daily","Kills pathogens at entrance"],["No outside vehicles near shed","Prevents disease transfer"],["Visitors < 3/day","Minimum foot traffic"],["Ammonia check every morning",">20ppm = danger level"],["Disinfect after each visit","Spray visitors' shoes"]].map(([r,d])=>(
            <div key={r} style={{padding:"8px 0",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
              <div style={{fontSize:12,fontWeight:700,color:"#fff"}}>{r}</div>
              <div style={{fontSize:10,color:D.muted}}>{d}</div>
            </div>
          ))}
        </GCard>
      </div>
    </div>
  </div>;
}

/* ══════════════════════════════════════════════════════
   FEATURE 8 — WEIGHT SAMPLING LOG 📏
══════════════════════════════════════════════════════ */
function WeightSamplingTab({batches,sheds,lang}){
  const [samplings,setSamplings]=useState([]);
  const [form,setForm]=useState({shed:"",weights:"",sampleSize:50});
  const [toast,setToast]=useState(null);

  useEffect(()=>{STORE.get("weightSamples",[]).then(setSamplings);},[]);

  const submit=async()=>{
    if(!form.shed||!form.weights)return;
    const wArr=form.weights.replace(/[\r\n]+/g,",").split(",").map(s=>parseFloat(s.trim())).filter(n=>!isNaN(n)&&n>0);
    if(wArr.length<5){setToast({message:"Enter at least 5 weights",type:"error"});return;}
    const avg=Math.round(wArr.reduce((s,w)=>s+w,0)/wArr.length);
    const min=Math.min(...wArr);const max=Math.max(...wArr);
    const variance=Math.round(Math.sqrt(wArr.reduce((s,w)=>s+(w-avg)*(w-avg),0)/wArr.length));
    const batch=batches.find(b=>b.shed===form.shed&&b.status==="active");
    const day=batch?batchDay(batch.startDate):0;
    const expected=expectedWeight(day);
    const pct=Math.round((avg/expected)*100);
    const entry={id:Date.now(),shed:form.shed,date:new Date().toISOString().split("T")[0],day,count:wArr.length,avg,min,max,variance,expected,pct,submittedAt:new Date().toISOString()};
    const updated=[entry,...samplings];
    setSamplings(updated);
    await STORE.set("weightSamples",updated);
    setForm({shed:"",weights:"",sampleSize:50});
    setToast({message:`Sample: Avg ${avg}g (${pct}% of expected)`,type:pct>=88?"success":"error"});
  };

  return <div className="fade-up">
    {toast&&<Toast message={toast.message} type={toast.type} onClose={()=>setToast(null)}/>}
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18}}>
      <GCard title="Enter Weight Sample" glow="amber">
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <FSelect label="Shed" value={form.shed} onChange={v=>setForm({...form,shed:v})} required
            options={[{value:"",label:"Select shed…"},...sheds.filter(s=>s.active).map(s=>({value:s.id,label:s.name}))]}/>
          <FInput label="Sample Size" value={form.sampleSize} onChange={v=>setForm({...form,sampleSize:+v})} type="number"/>
          <div>
            <label style={{fontSize:10,fontWeight:700,color:D.muted,textTransform:"uppercase",letterSpacing:"0.1em",display:"block",marginBottom:6}}>
              Individual Weights (grams) — Enter one per line or comma-separated *
            </label>
            <textarea value={form.weights} onChange={e=>setForm({...form,weights:e.target.value})} rows={8}
              placeholder={"1850, 1920, 1780, 1900, 1860..."}
              style={{width:"100%",padding:"10px 14px",borderRadius:11,border:"1.5px solid rgba(245,158,11,0.3)",fontSize:13,color:D.text,background:"rgba(245,158,11,0.04)",fontFamily:"'JetBrains Mono',monospace",resize:"vertical",outline:"none"}}/>
          </div>
          <Btn icon={Scale} onClick={submit} disabled={!form.shed||!form.weights} style={{width:"100%",justifyContent:"center"}}>Calculate Average</Btn>
        </div>
      </GCard>

      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        <GCard title="Sampling History">
          {samplings.length===0&&<p style={{fontSize:12,color:D.muted,textAlign:"center",padding:"20px 0"}}>No samples yet</p>}
          {samplings.slice(0,6).map(s=>{
            const shedName=sheds.find(x=>x.id===s.shed)?.name||s.shed;
            const ok=s.pct>=88;
            return <div key={s.id} style={{padding:"10px 0",borderBottom:"1px solid rgba(255,255,255,0.05)"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:4}}>
                <div>
                  <span style={{fontSize:13,fontWeight:700,color:"#fff"}}>{shedName}</span>
                  <span style={{fontSize:11,color:D.muted,marginLeft:8}}>Day {s.day} · {s.date}</span>
                </div>
                <Pill label={ok?"ON TRACK":"BELOW TARGET"} color={ok?"ok":"warning"} size="xs"/>
              </div>
              <div style={{display:"flex",gap:14,fontSize:11}}>
                <span style={{color:"#FCD34D",fontFamily:"'JetBrains Mono',monospace",fontWeight:700}}>Avg: {s.avg}g</span>
                <span style={{color:D.muted}}>Expected: {s.expected}g</span>
                <span style={{color:ok?D.green:D.red,fontWeight:700}}>{s.pct}%</span>
              </div>
              <div style={{marginTop:5,background:"rgba(255,255,255,0.05)",borderRadius:99,height:4,overflow:"hidden"}}>
                <div style={{background:`linear-gradient(90deg,${ok?D.green:D.red},${ok?"#34D399":"#F87171"})`,height:"100%",width:`${Math.min(s.pct,100)}%`,borderRadius:99}}/>
              </div>
              <div style={{fontSize:10,color:D.dim,marginTop:3}}>Min: {s.min}g · Max: {s.max}g · CV: {s.variance}g · n={s.count}</div>
            </div>;
          })}
        </GCard>
        <GCard title="Weight Targets by Day" glow="amber">
          {[[1,40],[5,200],[7,280],[10,400],[14,600],[18,900],[21,1100],[25,1400],[28,1600],[32,1900],[35,2100]].map(([d,w])=>(
            <div key={d} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
              <span style={{fontSize:12,color:D.muted}}>Day {d}</span>
              <div style={{display:"flex",gap:8}}>
                <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:12,fontWeight:700,color:"#FCD34D"}}>{w}g</span>
                <span style={{fontSize:11,color:D.dim}}>floor: {Math.round(w*0.88)}g</span>
              </div>
            </div>
          ))}
        </GCard>
      </div>
    </div>
  </div>;
}

/* ══════════════════════════════════════════════════════
   FEATURE 9 — MORTALITY DISPOSAL LOG 🪣
══════════════════════════════════════════════════════ */
function MortalityDisposalTab({reports,sheds,lang}){
  const [disposalLogs,setDisposalLogs]=useState([]);
  const [form,setForm]=useState({shed:"",date:new Date().toISOString().split("T")[0],count:0,method:"Compost Pit",location:"",supervisor:"",notes:""});
  const [toast,setToast]=useState(null);

  useEffect(()=>{STORE.get("disposalLogs",[]).then(setDisposalLogs);},[]);

  const submit=async()=>{
    if(!form.shed||!form.count)return;
    const entry={...form,id:Date.now(),count:+form.count,submittedAt:new Date().toISOString()};
    const updated=[entry,...disposalLogs];
    setDisposalLogs(updated);
    await STORE.set("disposalLogs",updated);
    setForm(prev=>({...prev,count:0,notes:""}));
    setToast({message:`Disposal log saved — ${form.count} birds`,type:"success"});
  };

  const totalDisposed=disposalLogs.reduce((s,l)=>s+(+l.count||0),0);

  return <div className="fade-up">
    {toast&&<Toast message={toast.message} type={toast.type} onClose={()=>setToast(null)}/>}
    <div style={{display:"grid",gridTemplateColumns:"1fr 380px",gap:18}}>
      <GCard title="Log Mortality Disposal" glow="red">
        <div style={{padding:"10px 14px",background:"rgba(239,68,68,0.06)",border:"1px solid rgba(239,68,68,0.2)",borderRadius:12,marginBottom:16,fontSize:12,color:"#FCA5A5",lineHeight:1.7}}>
          <strong>⚠ Legal Requirement:</strong> All dead birds must be disposed of within 24 hours. Approved methods: Compost Pit, Deep Burial (2+ feet), Incineration. Do not throw on open ground.
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <FSelect label="Shed" value={form.shed} onChange={v=>setForm({...form,shed:v})} required
            options={[{value:"",label:"Select shed…"},...sheds.filter(s=>s.active).map(s=>({value:s.id,label:s.name}))]}/>
          <FInput label="Date" value={form.date} onChange={v=>setForm({...form,date:v})} type="date"/>
          <FInput label="Number of Dead Birds" value={form.count} onChange={v=>setForm({...form,count:v})} type="number" required/>
          <FSelect label="Disposal Method" value={form.method} onChange={v=>setForm({...form,method:v})}
            options={["Compost Pit","Deep Burial","Incineration","Biogas Pit","Lime Treatment"]}/>
          <FInput label="Location / Pit Number" value={form.location} onChange={v=>setForm({...form,location:v})} placeholder="e.g. Pit #2, North end"/>
          <FInput label="Supervisor Name" value={form.supervisor} onChange={v=>setForm({...form,supervisor:v})} placeholder="Who did this?"/>
          <div style={{gridColumn:"span 2"}}>
            <label style={{fontSize:10,fontWeight:700,color:D.muted,textTransform:"uppercase",letterSpacing:"0.1em",display:"block",marginBottom:6}}>Notes</label>
            <textarea value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} rows={2}
              placeholder="Any observations about the dead birds (disease signs, injuries...)"
              style={{width:"100%",padding:"10px 14px",borderRadius:11,border:"1.5px solid rgba(255,255,255,0.1)",fontSize:13,color:D.text,background:"rgba(255,255,255,0.05)",fontFamily:"'Plus Jakarta Sans',sans-serif",resize:"vertical",outline:"none"}}/>
          </div>
        </div>
        <Btn icon={Check} onClick={submit} disabled={!form.shed||!form.count} variant="danger" style={{width:"100%",justifyContent:"center",marginTop:16}}>Log Disposal</Btn>
      </GCard>

      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        <GCard glow="red">
          <div style={{textAlign:"center",padding:"8px 0"}}>
            <div style={{fontSize:10,color:D.muted,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:8}}>Total Birds Disposed (All Time)</div>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:36,fontWeight:800,color:D.red}}>{totalDisposed.toLocaleString()}</div>
          </div>
        </GCard>
        <GCard title="Disposal Log">
          {disposalLogs.length===0&&<p style={{fontSize:12,color:D.muted,textAlign:"center",padding:"20px 0"}}>No disposal logs yet</p>}
          {disposalLogs.slice(0,8).map(log=>(
            <div key={log.id} style={{padding:"9px 0",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                <span style={{fontSize:13,fontWeight:700,color:"#fff"}}>{sheds.find(s=>s.id===log.shed)?.name||log.shed}</span>
                <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:13,fontWeight:700,color:D.red}}>{log.count} birds</span>
              </div>
              <div style={{fontSize:10,color:D.muted}}>{log.date} · {log.method} · {log.location||"Location not specified"}</div>
            </div>
          ))}
        </GCard>
      </div>
    </div>
  </div>;
}

/* ══════════════════════════════════════════════════════
   FEATURE 10 — WHATSAPP ALERT HELPER
   (Used in ReportTab submission — no separate tab needed)
══════════════════════════════════════════════════════ */
function WhatsAppAlertBtn({report,shed,owner}){
  const critical=report.mortality>40||report.temp>32;
  const warning=!critical&&(report.mortality>28||report.temp>30);
  if(!critical&&!warning)return null;
  const emoji=critical?"🚨":"⚠️";
  const mort=+report.mortality;const tmp=+report.temp;
    const lines=[emoji+" SRI FARMS ALERT","","Shed: "+(shed?.name||""),"Date: "+report.date+" | Day "+report.day,"",mort>40?"Mortality: "+mort+" birds (CRITICAL - URGENT)":mort>28?"Mortality: "+mort+" birds (WARNING)":"",tmp>32?"Temperature: "+tmp+"C (CRITICAL)":tmp>30?"Temperature: "+tmp+"C (WARNING)":"","","Submitted by: "+report.supervisor,"Sri Farms Management System"].filter((l,i,arr)=>!(l===""&&arr[i-1]===""));
  const msg=encodeURIComponent(lines.join("\n"));
  return <a href={`https://wa.me/?text=${msg}`} target="_blank" rel="noreferrer"
    style={{display:"inline-flex",alignItems:"center",gap:7,padding:"10px 18px",background:critical?"rgba(239,68,68,0.15)":"rgba(245,158,11,0.15)",border:`1px solid ${critical?"rgba(239,68,68,0.4)":"rgba(245,158,11,0.4)"}`,borderRadius:11,textDecoration:"none",fontSize:13,fontWeight:700,color:critical?D.red:D.amber,transition:"all 0.2s"}}
    onMouseEnter={e=>e.currentTarget.style.background=critical?"rgba(239,68,68,0.25)":"rgba(245,158,11,0.25)"}
    onMouseLeave={e=>e.currentTarget.style.background=critical?"rgba(239,68,68,0.15)":"rgba(245,158,11,0.15)"}>
    📱 Send WhatsApp Alert to Owner
  </a>;
}

/* ══════════════════════════════════════════════════════
   TEAM TAB
══════════════════════════════════════════════════════ */
function TeamTab({lang,teamUsers=[],setTeamUsers=()=>{}}){
  const t=T[lang];
  const [showForm,setShowForm]=useState(false);
  const [editUser,setEditUser]=useState(null);
  const [toast,setToast]=useState(null);
  const [confirmDelete,setConfirmDelete]=useState(null);
  const blank={name:"",email:"",phone:"",role:"worker",default_lang:"en",password:"",confirmPassword:""};
  const [form,setForm]=useState(blank);
  const [showPass,setShowPass]=useState(false);

  const ROLE_BG={owner:"rgba(245,158,11,0.08)",supervisor:"rgba(34,197,94,0.08)",manager:"rgba(59,130,246,0.08)",worker:"rgba(168,85,247,0.08)"};
  const ROLE_COL={owner:"#FCD34D",supervisor:"#86EFAC",manager:"#93C5FD",worker:"#D8B4FE"};
  const ROLE_IC={owner:"👑",supervisor:"🧑",manager:"👔",worker:"👷"};

  const save=()=>{
    if(!form.name)return setToast({message:"Name is required",type:"error"});
    if(!editUser&&!form.password)return setToast({message:"Password is required",type:"error"});
    if(form.password&&form.password!==form.confirmPassword)return setToast({message:"Passwords do not match",type:"error"});
    if(form.password&&form.password.length<6)return setToast({message:"Password must be at least 6 characters",type:"error"});
    if(editUser){
      setTeamUsers(u=>u.map(x=>x.id===editUser.id?{...x,...form}:x));
      setToast({message:form.name+" updated!",type:"success"});
    }else{
      setTeamUsers(u=>[...u,{...form,id:"user_"+Date.now()}]);
      setToast({message:form.name+" added to team!",type:"success"});
    }
    setShowForm(false);setEditUser(null);setForm(blank);
  };

  const remove=(u)=>{
    setTeamUsers(prev=>prev.filter(x=>x.id!==u.id));
    setConfirmDelete(null);
    setToast({message:u.name+" removed",type:"success"});
  };

  return <div className="fade-up">
    {toast&&<Toast message={toast.message} type={toast.type} onClose={()=>setToast(null)}/>}

    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
      <div>
        <h2 style={{fontFamily:"'Rajdhani',sans-serif",fontSize:20,fontWeight:700,color:"#E6EDF3"}}>Team Management</h2>
        <p style={{fontSize:12,color:"#7D8590",marginTop:3}}>Create accounts and assign roles for your farm team</p>
      </div>
      <Btn icon={Plus} onClick={()=>{setForm(blank);setEditUser(null);setShowForm(true);}}>Add Member</Btn>
    </div>

    {/* Role overview */}
    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:20}}>
      {[{role:"owner",desc:"Full access to everything"},{role:"supervisor",desc:"Reports, AI, CCTV"},{role:"manager",desc:"Dashboard & reports"},{role:"worker",desc:"Submit reports only"}].map(r=>(
        <div key={r.role} style={{background:ROLE_BG[r.role],border:"1px solid rgba(255,255,255,0.07)",borderRadius:12,padding:"12px 14px"}}>
          <div style={{fontSize:18,marginBottom:5}}>{ROLE_IC[r.role]}</div>
          <div style={{fontSize:12,fontWeight:700,color:ROLE_COL[r.role],textTransform:"capitalize",marginBottom:3}}>{r.role}</div>
          <p style={{fontSize:10,color:"#7D8590",lineHeight:1.5}}>{r.desc}</p>
        </div>
      ))}
    </div>

    {/* Users list */}
    <div style={{display:"flex",flexDirection:"column",gap:10}}>
      {teamUsers.length===0&&<div style={{textAlign:"center",padding:"60px",color:"#7D8590"}}>
        <Users2 size={44} color="rgba(245,158,11,0.2)" style={{margin:"0 auto 12px"}}/>
        <p style={{fontSize:14,fontWeight:600,color:"#E6EDF3"}}>No team members yet</p>
        <p style={{fontSize:12,marginTop:5}}>Click "Add Member" to create accounts</p>
      </div>}
      {teamUsers.map(u=>(
        <div key={u.id} style={{background:"rgba(22,27,34,0.85)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:14,padding:"16px 18px",display:"flex",alignItems:"center",gap:14,transition:"border-color 0.2s"}}
          onMouseEnter={e=>e.currentTarget.style.borderColor="rgba(245,158,11,0.25)"}
          onMouseLeave={e=>e.currentTarget.style.borderColor="rgba(255,255,255,0.08)"}>
          <div style={{width:44,height:44,borderRadius:12,background:ROLE_BG[u.role]||"rgba(255,255,255,0.06)",display:"grid",placeItems:"center",fontSize:20,flexShrink:0}}>{ROLE_IC[u.role]||"👤"}</div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4,flexWrap:"wrap"}}>
              <span style={{fontSize:15,fontWeight:700,color:"#E6EDF3"}}>{u.name}</span>
              <Pill label={u.role} color={u.role==="owner"?"warning":u.role==="supervisor"?"ok":u.role==="manager"?"info":"purple"}/>
            </div>
            <div style={{fontSize:11,color:"#7D8590"}}>{u.email||"No email"}{u.phone?" · "+u.phone:""}</div>
          </div>
          <div style={{display:"flex",gap:7,flexShrink:0}}>
            <Btn variant="outline" size="sm" icon={Edit2} onClick={()=>{setEditUser(u);setForm({...u,password:"",confirmPassword:""});setShowForm(true);}}>Edit</Btn>
            <Btn variant="danger" size="sm" icon={Trash2} onClick={()=>setConfirmDelete(u)}>Remove</Btn>
          </div>
        </div>
      ))}
    </div>

    {/* Add/Edit Modal */}
    {showForm&&<Modal title={editUser?"Edit Member":"Add Team Member"} onClose={()=>{setShowForm(false);setForm(blank);}} width={500}>
      <div style={{display:"flex",flexDirection:"column",gap:13}}>
        <div>
          <label style={{fontSize:10,fontWeight:700,color:"#7D8590",textTransform:"uppercase",letterSpacing:"0.1em",display:"block",marginBottom:9}}>Role *</label>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7}}>
            {["owner","supervisor","manager","worker"].map(r=>(
              <button key={r} onClick={()=>setForm({...form,role:r})}
                style={{padding:"9px 12px",borderRadius:10,border:`2px solid ${form.role===r?ROLE_COL[r]:"rgba(255,255,255,0.07)"}`,background:form.role===r?ROLE_BG[r]:"rgba(255,255,255,0.03)",cursor:"pointer",textAlign:"left",transition:"all 0.15s"}}>
                <div style={{fontSize:15,marginBottom:2}}>{ROLE_IC[r]}</div>
                <div style={{fontSize:11,fontWeight:700,color:form.role===r?ROLE_COL[r]:"#7D8590",textTransform:"capitalize"}}>{r}</div>
              </button>
            ))}
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <FInput label="Full Name" value={form.name} onChange={v=>setForm({...form,name:v})} required placeholder="e.g. Ravi Kumar"/>
          <FInput label="Phone" value={form.phone||""} onChange={v=>setForm({...form,phone:v})} placeholder="9876543210"/>
          <FInput label="Email" value={form.email||""} onChange={v=>setForm({...form,email:v})} type="email" placeholder="ravi@srifarms.in" readOnly={!!editUser}/>
          <FSelect label="Language" value={form.default_lang||"en"} onChange={v=>setForm({...form,default_lang:v})}
            options={[{value:"en",label:"English"},{value:"te",label:"Telugu"},{value:"hi",label:"Hindi"},{value:"mai",label:"Maithili"}]}/>
        </div>
        <div style={{padding:"13px 15px",background:"rgba(245,158,11,0.06)",borderRadius:12,border:"1px solid rgba(245,158,11,0.15)"}}>
          <div style={{fontSize:10,fontWeight:700,color:"#F59E0B",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:9,display:"flex",alignItems:"center",gap:5}}>
            <Shield size={11}/>{editUser?"Reset Password (blank = keep current)":"Set Password *"}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <FInput label="Password" value={form.password} onChange={v=>setForm({...form,password:v})} type={showPass?"text":"password"} placeholder="Min 6 chars"/>
            <FInput label="Confirm" value={form.confirmPassword} onChange={v=>setForm({...form,confirmPassword:v})} type={showPass?"text":"password"} placeholder="Re-enter"/>
          </div>
          <button onClick={()=>setShowPass(!showPass)} style={{marginTop:7,fontSize:11,color:"#FCD34D",background:"none",border:"none",cursor:"pointer",fontWeight:600,display:"flex",alignItems:"center",gap:5}}>
            {showPass?<EyeOff size={12}/>:<Eye size={12}/>}{showPass?"Hide":"Show"}
          </button>
          {form.password&&form.confirmPassword&&<p style={{fontSize:11,marginTop:6,fontWeight:700,color:form.password===form.confirmPassword?"#86EFAC":"#FCA5A5"}}>{form.password===form.confirmPassword?"Passwords match":"Passwords do not match"}</p>}
        </div>
        <div style={{display:"flex",gap:9,justifyContent:"flex-end"}}>
          <Btn variant="outline" onClick={()=>{setShowForm(false);setForm(blank);}}>Cancel</Btn>
          <Btn icon={Check} onClick={save}>{editUser?"Save Changes":"Add to Team"}</Btn>
        </div>
      </div>
    </Modal>}

    {/* Delete confirm */}
    {confirmDelete&&<Modal title="Remove Member?" onClose={()=>setConfirmDelete(null)} width={400}>
      <div style={{textAlign:"center",padding:"8px 0 14px"}}>
        <div style={{fontSize:40,marginBottom:10}}>{ROLE_IC[confirmDelete.role]||"👤"}</div>
        <p style={{fontSize:15,fontWeight:700,color:"#E6EDF3",marginBottom:6}}>{confirmDelete.name}</p>
        <p style={{fontSize:12,color:"#7D8590",marginBottom:20}}>This will permanently delete their account.</p>
        <div style={{display:"flex",gap:10,justifyContent:"center"}}>
          <Btn variant="outline" onClick={()=>setConfirmDelete(null)}>Cancel</Btn>
          <Btn variant="danger" icon={Trash2} onClick={()=>remove(confirmDelete)}>Yes, Remove</Btn>
        </div>
      </div>
    </Modal>}
  </div>;
}


/* ══════════════════════════════════════════════════════
   LOGIN PAGE
══════════════════════════════════════════════════════ */
function LoginPage({onLogin,lang,setLang}){
  const [u,setU]=useState("");
  const [p,setP]=useState("");
  const [show,setShow]=useState(false);
  const [err,setErr]=useState("");
  const [loading,setLoading]=useState(false);
  const t=T[lang];

  const tryLogin=()=>{
    if(!u||!p)return setErr("Please enter username and password.");
    setLoading(true);setErr("");
    setTimeout(()=>{
      const found=USERS.find(x=>x.user===u&&x.pass===p);
      if(found){setLang(found.lang);onLogin(found);}
      else{setErr("Invalid username or password.");setLoading(false);}
    },600);
  };

  return <div style={{minHeight:"100vh",background:"#0D1117",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"20px",fontFamily:"'Plus Jakarta Sans',sans-serif",position:"relative",overflow:"hidden"}}>
    <style>{G}</style>
    <AmbientBg/>

    {/* Background farm grid */}
    <div style={{position:"fixed",inset:0,backgroundImage:"linear-gradient(rgba(245,158,11,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(245,158,11,0.03) 1px,transparent 1px)",backgroundSize:"40px 40px",pointerEvents:"none"}}/>

    <div style={{width:"100%",maxWidth:420,position:"relative",zIndex:1}}>

      {/* Gita strip */}
      <div style={{background:"rgba(168,85,247,0.08)",border:"1px solid rgba(168,85,247,0.15)",borderRadius:12,padding:"11px 16px",marginBottom:20,display:"flex",gap:9,alignItems:"flex-start"}}>
        <BookOpen size={13} color="#C084FC" style={{marginTop:2,flexShrink:0}}/>
        <div>
          <p style={{fontSize:11,color:"#C084FC",lineHeight:1.7,fontStyle:"italic"}}>{t.gita}</p>
          <p style={{fontSize:9,color:"rgba(192,132,252,0.5)",marginTop:4,fontWeight:700,letterSpacing:"0.1em"}}>BHAGAVAD GITA 2.47</p>
        </div>
      </div>

      {/* Main card */}
      <div style={{background:"rgba(22,27,34,0.95)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:20,overflow:"hidden",boxShadow:"0 24px 64px rgba(0,0,0,0.5)"}}>

        {/* Top amber bar */}
        <div style={{height:3,background:"linear-gradient(90deg,#D97706,#F59E0B,#FCD34D,#F59E0B,#D97706)"}}/>

        {/* Hero section */}
        <div style={{padding:"28px 32px 24px",textAlign:"center",borderBottom:"1px solid rgba(255,255,255,0.06)",background:"linear-gradient(135deg,rgba(245,158,11,0.06),rgba(22,27,34,0))" }}>
          <div style={{display:"flex",justifyContent:"center",marginBottom:14}}>
            <div style={{position:"relative"}}>
              <div style={{position:"absolute",inset:-10,borderRadius:"50%",background:"radial-gradient(circle,rgba(245,158,11,0.18),transparent 70%)",animation:"breathe 3s ease-in-out infinite"}}/>
              <HenLogo size={64} animated={true} glowing={true}/>
            </div>
          </div>
          <h1 style={{fontFamily:"'Rajdhani',sans-serif",fontSize:28,fontWeight:700,color:"#FCD34D",letterSpacing:"0.04em",marginBottom:3}}>{t.appName}</h1>
          <p style={{fontSize:11,color:"#7D8590",fontWeight:500,letterSpacing:"0.06em",textTransform:"uppercase"}}>Chittoor District, Andhra Pradesh</p>
        </div>

        {/* Form section */}
        <div style={{padding:"24px 32px 28px"}}>

          {/* Language selector */}
          <div style={{display:"flex",gap:5,marginBottom:20,background:"rgba(255,255,255,0.03)",borderRadius:10,padding:4}}>
            {[["en","EN"],["te","TE"],["hi","HI"],["mai","MA"]].map(([l,lbl])=>(
              <button key={l} onClick={()=>setLang(l)} style={{flex:1,padding:"6px 4px",borderRadius:7,border:"none",background:lang===l?"rgba(245,158,11,0.2)":"transparent",color:lang===l?"#FCD34D":"#7D8590",fontSize:11,fontWeight:700,cursor:"pointer",transition:"all 0.15s",letterSpacing:"0.06em"}}>{lbl}</button>
            ))}
          </div>

          <div style={{display:"flex",flexDirection:"column",gap:13}}>
            {/* Username */}
            <div style={{display:"flex",flexDirection:"column",gap:6}}>
              <label style={{fontSize:10,fontWeight:700,color:"#7D8590",textTransform:"uppercase",letterSpacing:"0.1em"}}>{t.username}</label>
              <input value={u} onChange={e=>setU(e.target.value)} placeholder="anilkumard369e@gmail.com" autoComplete="username"
                style={{padding:"11px 14px",borderRadius:10,border:`1.5px solid ${u?"rgba(245,158,11,0.4)":"rgba(255,255,255,0.1)"}`,fontSize:14,color:"#E6EDF3",background:"rgba(255,255,255,0.04)",fontFamily:"'Plus Jakarta Sans',sans-serif",outline:"none",transition:"border-color 0.2s"}}/>
            </div>
            {/* Password */}
            <div style={{display:"flex",flexDirection:"column",gap:6}}>
              <label style={{fontSize:10,fontWeight:700,color:"#7D8590",textTransform:"uppercase",letterSpacing:"0.1em"}}>{t.password}</label>
              <div style={{position:"relative"}}>
                <input type={show?"text":"password"} value={p} onChange={e=>setP(e.target.value)} onKeyDown={e=>e.key==="Enter"&&tryLogin()} placeholder="Enter password"
                  style={{width:"100%",padding:"11px 44px 11px 14px",borderRadius:10,border:`1.5px solid ${p?"rgba(245,158,11,0.4)":"rgba(255,255,255,0.1)"}`,fontSize:14,color:"#E6EDF3",background:"rgba(255,255,255,0.04)",fontFamily:"'Plus Jakarta Sans',sans-serif",outline:"none",transition:"border-color 0.2s"}}/>
                <button onClick={()=>setShow(!show)} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:"#7D8590"}}>{show?<EyeOff size={15}/>:<Eye size={15}/>}</button>
              </div>
            </div>

            {err&&<div style={{padding:"9px 13px",background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.25)",borderRadius:9,fontSize:12,color:"#FCA5A5",fontWeight:600}}>{err}</div>}

            <button onClick={tryLogin} disabled={loading} style={{padding:"12px",borderRadius:11,background:loading?"rgba(245,158,11,0.5)":"linear-gradient(135deg,#F59E0B,#D97706)",color:"#000",border:"none",fontSize:14,fontWeight:800,cursor:loading?"not-allowed":"pointer",fontFamily:"'Rajdhani',sans-serif",letterSpacing:"0.06em",transition:"all 0.2s",marginTop:2,display:"flex",alignItems:"center",justifyContent:"center",gap:8,boxShadow:loading?"none":"0 4px 16px rgba(245,158,11,0.35)"}}>
              {loading?<><div className="spin" style={{width:14,height:14,border:"2px solid rgba(0,0,0,0.3)",borderTopColor:"#000",borderRadius:"50%"}}/> SIGNING IN...</>:"SIGN IN"}
            </button>
          </div>

          {/* Demo accounts */}

        </div>
      </div>

      <p style={{textAlign:"center",fontSize:10,color:"#484F58",marginTop:16,letterSpacing:"0.05em"}}>Sri Farms Management System v3.0</p>
    </div>
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
  const [teamUsers,setTeamUsers]=useState([]);
  const [vaccLogs,setVaccLogs]=useState({});
  const [prepLogs,setPrepLogs]=useState({});
  const [bills,setBills]=useState([]);
  const [loaded,setLoaded]=useState(false);
  const [sidebarOpen,setSidebarOpen]=useState(false);

  useEffect(()=>{
    (async()=>{
      try{
        const[s,b,r,a,cv,ph,vl,pl,bl]=await Promise.all([
          STORE.get("sheds",[]),STORE.get("batches",[]),STORE.get("reports",[]),
          STORE.get("alerts",[]),STORE.get("cctv",[]),STORE.get("photos",[]),
          STORE.get("vaccLogs",{}),STORE.get("prepLogs",{}),STORE.get("bills_v2",[])
        ]);
        setSheds(Array.isArray(s)?s:[]);
        setBatches(Array.isArray(b)?b:[]);
        setReports(Array.isArray(r)?r:[]);
        setAlerts(Array.isArray(a)?a:[]);
        setCameras(Array.isArray(cv)?cv:[]);
        setPhotos(Array.isArray(ph)?ph:[]);
        setVaccLogs(vl&&typeof vl==="object"?vl:{});
        setPrepLogs(pl&&typeof pl==="object"?pl:{});
        setBills(Array.isArray(bl)?bl:[]);
      }catch(e){
        console.error("Storage load error:",e);
        // Still continue with empty data - no get stuck
      }finally{
        setLoaded(true);
      }
    })();
  },[]);

  if(!loaded)return <div style={{minHeight:"100vh",background:"#0D1117",display:"grid",placeItems:"center"}}>
    <style>{G}</style>
    <AmbientBg/>
    <div style={{textAlign:"center",position:"relative",zIndex:1}}>
      <div style={{marginBottom:20}}><HenLogo size={80} animated={true}/></div>
      <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:22,fontWeight:800,color:"#fff",marginBottom:6}}>Sri Farms</div>
      <div style={{width:40,height:3,background:`linear-gradient(90deg,${"#3B82F6"},${D.green})`,borderRadius:99,margin:"0 auto 16px",animation:"shimmer 1.5s ease-in-out infinite",backgroundSize:"200% 100%"}}/>
      <p style={{fontSize:13,color:D.muted}}>Loading farm data…</p>
    </div>
  </div>;

  if(!user)return <LoginPage onLogin={setUser} lang={lang} setLang={setLang}/>;

  const t=T[lang];
  const PAGE={
    dashboard:<DashboardTab reports={reports} sheds={sheds} batches={batches} alerts={alerts} lang={lang}/>,
    sheds:<ShedsTab sheds={sheds} setSheds={setSheds} user={user} lang={lang} batches={batches}/>,
    batches:<BatchesTab batches={batches} setBatches={setBatches} sheds={sheds} lang={lang} prepLogs={prepLogs} setPrepLogs={setPrepLogs}/>,
    report:<ReportTab sheds={sheds} batches={batches} reports={reports} setReports={setReports} setAlerts={setAlerts} alerts={alerts} user={user} lang={lang}/>,
    alerts:<AlertsTab alerts={alerts} setAlerts={setAlerts} sheds={sheds} lang={lang}/>,
    weekly:<WeeklyTab reports={reports} sheds={sheds} lang={lang}/>,
    aiPredict:<AIPredictTab sheds={sheds} batches={batches} reports={reports} lang={lang}/>,
    history:<HistoryTab reports={reports} setReports={setReports} sheds={sheds} user={user} lang={lang}/>,
    cctv:<CCTVTab cameras={cameras} setCameras={setCameras} sheds={sheds} user={user} lang={lang}/>,
    photos:<PhotosTab photos={photos} setPhotos={setPhotos} sheds={sheds} lang={lang}/>,
    vaccination:<VaccinationTab batches={batches} sheds={sheds} vaccLogs={vaccLogs} setVaccLogs={setVaccLogs} lang={lang}/>,
    bills:<BillAnalyzerTab batches={batches} sheds={sheds} lang={lang}/>,
    biosecurity:<BiosecurityTab sheds={sheds} batches={batches} lang={lang}/>,
    weightlog:<WeightSamplingTab batches={batches} sheds={sheds} lang={lang}/>,
    disposal:<MortalityDisposalTab reports={reports} sheds={sheds} lang={lang}/>,
    team:<TeamTab lang={lang} teamUsers={teamUsers} setTeamUsers={setTeamUsers}/>,
  };

  return <div style={{display:"flex",minHeight:"100vh",background:"#0D1117",fontFamily:"'Plus Jakarta Sans',sans-serif",overflow:"hidden"}}>
    <style>{G}</style>
    <AmbientBg/>
    <div className={"mob-overlay"+(sidebarOpen?" open":"")} onClick={()=>setSidebarOpen(false)}
      style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.65)",zIndex:99}}/>
    <div className={"sidebar-wrap"+(sidebarOpen?" open":"")} style={{position:"fixed",left:0,top:0,bottom:0,zIndex:100,width:300}}>
      <Sidebar tab={tab} setTab={x=>{setTab(x);setSidebarOpen(false);}} user={user} lang={lang} setLang={setLang} alerts={alerts} onSignOut={()=>setUser(null)}/>
    </div>
    <div className="main-wrap" style={{flex:1,marginLeft:0,display:"flex",flexDirection:"column",minHeight:"100vh",position:"relative",zIndex:1,maxWidth:"100vw",overflowX:"hidden"}}>
      <TopBar user={user} tab={tab} lang={lang} alerts={alerts} onMenuClick={()=>setSidebarOpen(!sidebarOpen)}/>
      <LiveTicker reports={reports} sheds={sheds}/>
      <GitaStrip lang={lang}/>
      <main style={{flex:1,padding:"clamp(14px,3vw,22px) clamp(14px,3vw,24px)",paddingBottom:"90px",overflowX:"hidden"}}>
        {PAGE[tab]||<p style={{color:"#7D8590",padding:20}}>Page not found</p>}
      </main>
      <footer style={{padding:"9px 20px",borderTop:"1px solid rgba(255,255,255,0.06)",display:"flex",justifyContent:"space-between",alignItems:"center",background:"rgba(13,17,23,0.8)"}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <HenLogo size={18} animated={false}/>
          <span style={{fontSize:10,color:"#484F58",fontFamily:"'JetBrains Mono',monospace",letterSpacing:"0.04em"}}>SRI FARMS v3 · CHITTOOR DISTRICT</span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:5}}>
          <div style={{width:5,height:5,borderRadius:"50%",background:"#22C55E",boxShadow:"0 0 5px #22C55E"}}/>
          <span style={{fontSize:10,color:"#484F58",fontFamily:"'JetBrains Mono',monospace"}}>ONLINE</span>
        </div>
      </footer>
      <div style={{position:"fixed",bottom:0,left:0,right:0,background:"rgba(13,17,23,0.97)",backdropFilter:"blur(20px)",borderTop:"1px solid rgba(255,255,255,0.07)",zIndex:90,padding:"6px 0 8px",display:"none"}}>
        <div style={{display:"flex",justifyContent:"space-around"}}>
          {NAV.filter(n=>n.role.includes(user?.role||"worker")).slice(0,4).map(n=>{
            const Icon=n.icon;const active=tab===n.id;
            const hasBadge=n.id==="alerts"&&alerts.filter(a=>!a.read).length>0;
            return <button key={n.id} onClick={()=>setTab(n.id)} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3,padding:"5px 2px",border:"none",background:"transparent",cursor:"pointer",position:"relative"}}>
              {hasBadge&&<div style={{position:"absolute",top:2,right:"22%",width:6,height:6,borderRadius:"50%",background:"#EF4444"}}/>}
              <Icon size={18} color={active?"#FCD34D":"#484F58"}/>
              <span style={{fontSize:9,fontWeight:active?700:400,color:active?"#FCD34D":"#484F58"}}>{(T[lang]?.[n.id]||n.id).slice(0,6).toUpperCase()}</span>
            </button>;
          })}
          <button onClick={()=>setSidebarOpen(true)} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3,padding:"5px 2px",border:"none",background:"transparent",cursor:"pointer"}}>
            <div style={{display:"flex",flexDirection:"column",gap:3,height:18,justifyContent:"center",alignItems:"center"}}>
              {[16,11,16].map((w,i)=><div key={i} style={{width:w,height:1.5,background:"#484F58",borderRadius:2}}/>)}
            </div>
            <span style={{fontSize:9,color:"#484F58"}}>MORE</span>
          </button>
        </div>
      </div>
    </div>
  </div>;}
