import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, Legend, ReferenceLine } from "recharts";

/*
 ╔══════════════════════════════════════════════════════════════╗
 ║  NEXT WAVE — Development Operations Platform                ║
 ║  Architecture v3.0                                          ║
 ║                                                             ║
 ║  Module Map (future file extraction):                       ║
 ║  ┌─ @config/theme.ts      — Design tokens & colors         ║
 ║  ┌─ @lib/formatters.ts    — Currency, date, percent         ║
 ║  ┌─ @lib/financial.ts     — Financial computation engine    ║
 ║  ┌─ @models/project.ts    — Project data model & factory    ║
 ║  ┌─ @models/tools.ts      — Tool registry                  ║
 ║  ┌─ @components/shared/*  — Reusable UI primitives          ║
 ║  ┌─ @tools/proforma/*     — Pro Forma Analyzer              ║
 ║  ┌─ @tools/website/*      — Website Generator               ║
 ║  ┌─ @tools/scheduler/*    — Development Scheduler           ║
 ║  ┌─ @data/samples.ts      — Demo project data               ║
 ║  ┌─ @app/shell.tsx        — App shell, nav, routing         ║
 ║  ┌─ @app/workspace.tsx    — Project workspace + tabs        ║
 ║  ┌─ @app/home.tsx         — Home / project list             ║
 ║  └─ @app/forms.tsx        — Project create/edit forms       ║
 ╚══════════════════════════════════════════════════════════════╝
*/


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// @config/theme — Design Tokens
// Future: extract to src/config/theme.ts
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━


const C = {
  bg: "#F3F2F0", surface: "#FFFFFF", surfaceAlt: "#F0EFED",
  border: "#E4E2DE", borderLight: "#ECEAE6",
  text: "#1A1917", textMid: "#4A4845", textMuted: "#7D7B76",
  accent: "#3B8BCA", accentSoft: "rgba(59,139,202,0.08)",
  positive: "#5B8C6A", positiveSoft: "rgba(91,140,106,0.08)",
  negative: "#C4564B", negativeSoft: "rgba(196,86,75,0.08)",
  warn: "#C4943A", blue: "#4A6FA5",
};
const font = '"DM Sans", system-ui, -apple-system, sans-serif';

const NW_LOGO = "data:image/jpeg;base64,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";
const NW_LOGO_TAG = "data:image/jpeg;base64,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";
const $ = (v) => v >= 1e6 ? `$${(v/1e6).toFixed(1)}M` : v >= 1e3 ? `$${(v/1e3).toFixed(0)}K` : `$${v.toFixed(0)}`;
const $f = (v) => `$${v.toLocaleString("en-US",{maximumFractionDigits:0})}`;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// @models/project — Project Data Model & Factory
// Future: extract to src/models/project.ts
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function createProject(overrides = {}) {
  return {
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    project_info: { name: "", address: "", city: "", state: "", development_type: "Modular Residential", lot_count: 0, notes: "", ...overrides.project_info },
    financials: { total_budget: 0, land_cost: 0, target_price_per_home: 0, estimated_revenue: 0, ...overrides.financials },
    timeline: { start_date: "", estimated_completion: "", milestones: [], ...overrides.timeline },
    tool_outputs: { financial_models: [], schedules: [], floor_plans: [], websites: [], documents: [], reports: [], ...overrides.tool_outputs },
    activity: overrides.activity || [],
  };
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// @models/tools — Tool Registry
// Future: extract to src/models/tools.ts
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const TOOL_REGISTRY = [
  { id: "proforma", name: "Pro Forma Analyzer", description: "Financial feasibility & scenario modeling", icon: "📊", category: "Financial", output_key: "financial_models", status: "active", component: ProFormaTool },
  { id: "scheduler", name: "Development Scheduler", description: "Build and manage construction timelines", icon: "📅", category: "Planning", output_key: "schedules", status: "active", component: DevelopmentScheduler },
  { id: "floorplan", name: "Floor Plan Studio", description: "Manipulate and assign floor plans to lots", icon: "📐", category: "Design", output_key: "floor_plans", status: "coming_soon", component: null },
  { id: "website", name: "Website Generator", description: "Generate a marketing website per development", icon: "🌐", category: "Marketing", output_key: "websites", status: "active", component: WebsiteGeneratorTool },
  { id: "reports", name: "Report Builder", description: "Generate project summary reports", icon: "📄", category: "Reporting", output_key: "reports", status: "coming_soon", component: null },
];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// @tools/proforma — Pro Forma Analyzer
// Future: extract to src/tools/proforma/ProFormaTool.tsx
// Dependencies: C, font, $, $f, pct, mult, monthLabel
// Contract: { project, onSave, onClose } → saves to project.tool_outputs.financial_models
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const pct = (v) => `${(v*100).toFixed(2)}%`;
const mult = (v) => `${v.toFixed(2)}x`;
function monthLabel(mo) {
  const names=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const startMonth=1; const startYear=2026;
  const totalMonths=startMonth+mo-1;
  const year=startYear+Math.floor(totalMonths/12);
  return `${names[totalMonths%12]} ${year}`;
}

// ─── Carousel ───
function PFCarousel({ children }) {
  const [idx, setIdx] = useState(0);
  const count = children.length;
  const go = (d) => setIdx((i) => (i + d + count) % count);
  return (
    <div style={{ position: "relative" }}>
      <div style={{ overflow: "hidden", borderRadius: "16px", border: `1px solid ${C.border}`, background: C.surface, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
        <div style={{ display: "flex", transition: "transform 0.5s cubic-bezier(0.4,0,0.2,1)", transform: `translateX(-${idx*100}%)` }}>
          {children.map((child, i) => (
            <div key={i} style={{ minWidth: "100%", padding: "36px 40px" }}>{child}</div>
          ))}
        </div>
      </div>
      {[[-1,"left","←"],[1,"right","→"]].map(([dir,side,arrow]) => (
        <button key={side} onClick={() => go(dir)} style={{
          position:"absolute",top:"50%",[side]:"-26px",transform:"translateY(-50%)",
          width:"52px",height:"52px",borderRadius:"50%",border:`1px solid ${C.border}`,
          background:C.surface,color:C.text,fontSize:"20px",cursor:"pointer",
          display:"flex",alignItems:"center",justifyContent:"center",
          boxShadow:"0 2px 8px rgba(0,0,0,0.06)",fontFamily:font,transition:"all 0.2s",
        }}
          onMouseOver={e=>{e.currentTarget.style.background=C.surfaceAlt;e.currentTarget.style.boxShadow="0 4px 12px rgba(0,0,0,0.1)";}}
          onMouseOut={e=>{e.currentTarget.style.background=C.surface;e.currentTarget.style.boxShadow="0 2px 8px rgba(0,0,0,0.06)";}}
        >{arrow}</button>
      ))}
      <div style={{ display:"flex",justifyContent:"center",gap:"10px",marginTop:"18px" }}>
        {Array.from({length:count},(_,i) => (
          <button key={i} onClick={() => setIdx(i)} style={{
            width:idx===i?"28px":"10px",height:"10px",borderRadius:"5px",border:"none",cursor:"pointer",
            background:idx===i?C.accent:C.border,transition:"all 0.3s cubic-bezier(0.4,0,0.2,1)",
          }} />
        ))}
      </div>
    </div>
  );
}

function PFStat({ label, value, color, size="lg" }) {
  const isLg = size === "lg";
  return (<div>
    <div style={{ fontSize:isLg?"36px":"24px",fontWeight:700,color:color||C.text,letterSpacing:"-0.03em",lineHeight:1.1,fontVariantNumeric:"tabular-nums" }}>{value}</div>
    <div style={{ fontSize:isLg?"15px":"13px",color:C.textMid,marginTop:isLg?"8px":"6px",fontWeight:600,letterSpacing:"0.01em",textTransform:"uppercase" }}>{label}</div>
  </div>);
}

function PFCostRow({ label, value, pctVal, barColor }) {
  return (<div style={{ display:"flex",alignItems:"center",gap:"16px",padding:"10px 0",borderBottom:`1px solid ${C.borderLight}` }}>
    <div style={{ flex:1,fontSize:"15px",color:C.textMid,fontWeight:500 }}>{label}</div>
    <div style={{ width:"120px" }}><div style={{ height:"6px",borderRadius:"3px",background:C.surfaceAlt,overflow:"hidden" }}>
      <div style={{ height:"100%",width:`${Math.min(pctVal*100,100)}%`,borderRadius:"3px",background:barColor||C.accent,transition:"width 0.6s" }} />
    </div></div>
    <div style={{ width:"110px",textAlign:"right",fontSize:"15px",fontWeight:600,color:C.text,fontVariantNumeric:"tabular-nums" }}>{$f(value)}</div>
  </div>);
}

// ─── Input Box Component ───
function PFInputBox({ label, value, type="currency", onChange, helper }) {
  const [focused, setFocused] = useState(false);
  const [raw, setRaw] = useState("");
  const display = () => {
    if (type === "currency") return value ? `$${Number(value).toLocaleString("en-US")}` : "$0";
    if (type === "percent") return `${(value * 100).toFixed(2)}%`;
    if (type === "sf") return `${Number(value).toLocaleString("en-US")} SF`;
    if (type === "months") return `${value} mo`;
    if (type === "month") return `Month ${value}`;
    if (type === "date") return String(value);
    return `${value}`;
  };
  const parse = (str) => {
    if (type === "date") return str;
    const cleaned = str.replace(/[^0-9.\-]/g, "");
    const n = parseFloat(cleaned);
    if (isNaN(n)) return value;
    if (type === "percent") return n / 100;
    return n;
  };
  const startEdit = () => {
    setFocused(true);
    if (type === "percent") setRaw((value * 100).toString());
    else if (type === "date") setRaw(String(value));
    else setRaw(value.toString());
  };
  const commit = () => { setFocused(false); onChange(parse(raw)); };
  return (
    <div style={{ marginBottom: "16px" }}>
      <label style={{ display: "block", fontSize: "12px", color: C.textMid, fontWeight: 500, marginBottom: "5px", letterSpacing: "0.01em" }}>{label}</label>
      {focused ? (
        <input autoFocus value={raw} onChange={e => setRaw(e.target.value)}
          onBlur={commit} onKeyDown={e => e.key === "Enter" && commit()}
          style={{ width: "100%", padding: "9px 12px", fontSize: "14px", fontWeight: 600, border: `1.5px solid ${C.accent}`, borderRadius: "8px", outline: "none", fontFamily: font, color: C.text, background: "#fff", fontVariantNumeric: "tabular-nums" }} />
      ) : (
        <div onClick={startEdit} style={{ width: "100%", padding: "9px 12px", fontSize: "14px", fontWeight: 600, border: `1px solid ${C.border}`, borderRadius: "8px", cursor: "text", fontFamily: font, color: C.text, background: C.surface, fontVariantNumeric: "tabular-nums", transition: "border-color 0.15s" }}
          onMouseOver={e => e.currentTarget.style.borderColor = C.textMuted}
          onMouseOut={e => e.currentTarget.style.borderColor = C.border}
        >{display()}</div>
      )}
      {helper && <div style={{ fontSize: "11px", color: C.textMuted, marginTop: "4px", fontStyle: "italic" }}>{helper}</div>}
    </div>
  );
}

function PFSectionHeader({ children }) {
  return (
    <div style={{ fontSize: "11px", fontWeight: 700, color: C.accent, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "14px", marginTop: "8px", paddingBottom: "8px", borderBottom: `1.5px solid ${C.borderLight}` }}>{children}</div>
  );
}

// ─── AI Chat (floating) ───
function PFAIChat({ assumptions, metrics, scenario }) {
  const [msgs, setMsgs] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const ref = useRef(null);
  useEffect(() => { if (ref.current) ref.current.scrollTop = ref.current.scrollHeight; }, [msgs]);
  const send = useCallback(async () => {
    if (!input.trim()||loading) return;
    const q=input.trim();setInput("");setMsgs(m=>[...m,{r:"u",t:q}]);setLoading(true);
    const sys=`You are an AI deal analyst for a Pro Forma analysis. Scenario: ${scenario}. Total Capital: ${$f(metrics.totalCapital)}, Purchase XIRR: ${pct(metrics.purchaseXirr)}, Non-Purchase XIRR: ${pct(metrics.nonPurchaseXirr)}, Break-Even: ${$f(metrics.breakEvenPrice)}, Safety: ${pct(metrics.marginOfSafety)}, Net Return: ${$f(metrics.totalReturn)}, RM Return: ${$f(metrics.rmReturn)}. ${assumptions.marketRateUnits+assumptions.affordableUnits} homes, ${assumptions.projectMonths}mo. Be concise (2-3 sentences), use numbers.`;
    try {
      const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:800,system:sys,messages:[{role:"user",content:q}]})});
      const d=await r.json();
      setMsgs(m=>[...m,{r:"a",t:d.content?.map(b=>b.text||"").join("")||"Error."}]);
    } catch{setMsgs(m=>[...m,{r:"a",t:"Connection issue."}]);}
    setLoading(false);
  },[input,loading,assumptions,metrics,scenario]);
  return (
    <div style={{ display:"flex",flexDirection:"column",height:"380px" }}>
      <div ref={ref} style={{ flex:1,overflowY:"auto",padding:"16px",display:"flex",flexDirection:"column",gap:"8px" }}>
        {msgs.length===0&&(<div style={{ textAlign:"center",padding:"24px 8px",color:C.textMuted,fontSize:"13px" }}>
          <div style={{ fontSize:"20px",marginBottom:"8px",opacity:0.5 }}>✦</div>
          Ask about returns, risks, or scenarios
          <div style={{ display:"flex",flexWrap:"wrap",gap:"6px",justifyContent:"center",marginTop:"12px" }}>
            {["Is this deal attractive?","Break-even timing?","Key risks?"].map(q=>(
              <button key={q} onClick={()=>setInput(q)} style={{ padding:"6px 12px",borderRadius:"20px",border:`1px solid ${C.border}`,background:"transparent",fontSize:"12px",color:C.textMid,cursor:"pointer",fontFamily:font }}>{q}</button>
            ))}
          </div>
        </div>)}
        {msgs.map((m,i)=>(<div key={i} style={{ alignSelf:m.r==="u"?"flex-end":"flex-start",maxWidth:"85%" }}>
          <div style={{ padding:"10px 14px",borderRadius:m.r==="u"?"16px 16px 4px 16px":"16px 16px 16px 4px",background:m.r==="u"?C.accent:C.surfaceAlt,color:m.r==="u"?"#fff":C.text,fontSize:"13px",lineHeight:1.5 }}>{m.t}</div>
        </div>))}
        {loading&&<div style={{ alignSelf:"flex-start",fontSize:"13px",color:C.textMuted,padding:"8px 14px" }}>Thinking...</div>}
      </div>
      <div style={{ padding:"10px 16px",borderTop:`1px solid ${C.borderLight}` }}>
        <div style={{ display:"flex",gap:"8px",alignItems:"center" }}>
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()}
            placeholder="Ask about the deal..." style={{ flex:1,border:`1px solid ${C.border}`,borderRadius:"24px",padding:"8px 16px",fontSize:"13px",fontFamily:font,outline:"none",color:C.text,background:C.surfaceAlt }} />
          <button onClick={send} disabled={!input.trim()} style={{ width:"34px",height:"34px",borderRadius:"50%",border:"none",background:input.trim()?C.accent:C.border,color:"#fff",cursor:input.trim()?"pointer":"default",fontSize:"15px",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>↑</button>
        </div>
      </div>
    </div>
  );
}

// ─── XIRR: Newton-Raphson solver ───
function xirrDate(year, month, day) { return new Date(year, month - 1, day || 1); }
function xirrLastDay(year, month) { return new Date(year, month, 0).getDate(); }
function xirrSolve(cashflows) {
  if (!cashflows.length) return 0;
  const d0 = cashflows[0].date.getTime();
  const dayFrac = (d) => (d.getTime() - d0) / 86400000 / 365;
  const fracs = cashflows.map(cf => dayFrac(cf.date));
  const amounts = cashflows.map(cf => cf.amount);
  let rate = 0.1;
  for (let iter = 0; iter < 200; iter++) {
    let npv = 0, dnpv = 0;
    for (let i = 0; i < amounts.length; i++) {
      const t = fracs[i];
      const disc = Math.pow(1 + rate, t);
      if (!isFinite(disc) || disc === 0) break;
      npv += amounts[i] / disc;
      dnpv -= t * amounts[i] / (disc * (1 + rate));
    }
    if (Math.abs(dnpv) < 1e-20) break;
    const newRate = rate - npv / dnpv;
    if (Math.abs(newRate - rate) < 1e-12) return newRate;
    rate = newRate;
  }
  return rate;
}

// ─── Calculation engine ───
function calcScenario(a, resalePrice, affordableResalePrice) {
  const mktU=Math.max(a.marketRateUnits,0), affU=Math.max(a.affordableUnits,0), totalUnits=mktU+affU, months=Math.max(a.projectMonths,1);
  const mktCostPerSF=a.marketCostPerSF||0, affCostPerSF=a.affordableCostPerSF||0;
  const purchaseCost=(a.purchasePrice||0)+(a.permittingCosts||0);
  const capMkt=Math.min(a.capitalMarketUnits||0,mktU);
  const capAff=Math.min(a.capitalAffordableUnits||0,affU);
  const capProd=(capMkt*a.marketSF*mktCostPerSF)+(capAff*a.affordableSF*affCostPerSF);
  const procMkt=mktU-capMkt, procAff=affU-capAff;
  const procProd=(procMkt*a.marketSF*mktCostPerSF)+(procAff*a.affordableSF*affCostPerSF);
  const siteMiscCosts=a.siteWork||0;
  const totalCapital=purchaseCost+capProd+siteMiscCosts;
  const affResale=affordableResalePrice!=null?affordableResalePrice:(a.affordableResaleMid||0);
  const gross=(mktU*resalePrice)+(affU*affResale);
  const netSales=gross*(1-a.commissionRate);
  const prefPurchase=purchaseCost*a.prefRatePurchase/12*months;
  const prefSite=siteMiscCosts*a.prefRateOther/12*Math.max(months-a.monthSiteWorkCapital,0);
  const prefModular=capProd*a.prefRateOther/12*Math.max(months-a.monthModularCapital,0);
  const totalPref=prefPurchase+prefSite+prefModular;
  const totalReturn=netSales-totalCapital-procProd-totalPref;
  const returnPct=totalCapital>0?totalReturn/totalCapital:0;
  const rmProfit=totalReturn*a.rmProfitShare;
  const lpProfit=totalReturn*(1-a.rmProfitShare);
  const rmReturn=rmProfit+totalPref;
  const purchaseXirrReturn=purchaseCost+prefPurchase;
  const xirrStart=xirrDate(a.xirrStartYear,a.xirrStartMonth,a.xirrStartDay||1);
  const xirrExit=xirrDate(a.xirrExitYear,a.xirrExitMonth,a.xirrExitDay||xirrLastDay(a.xirrExitYear,a.xirrExitMonth));
  const purchaseXirr=purchaseCost>0?xirrSolve([{date:xirrStart,amount:-purchaseCost},{date:xirrExit,amount:purchaseXirrReturn}]):0;
  const purchaseEqMult=purchaseCost>0?prefPurchase/purchaseCost:0;
  const purchaseHoldMonths=Math.round((xirrExit-xirrStart)/86400000/30.44);
  const nonPurchaseCapital=totalCapital-purchaseCost;
  const nonPurchaseXirrReturn=nonPurchaseCapital+rmReturn+prefSite+prefModular;
  const npDate=new Date(a.xirrStartYear,a.xirrStartMonth-1+(a.monthSiteWorkCapital||0),a.xirrStartDay||1);
  const nonPurchaseXirr=nonPurchaseCapital>0?xirrSolve([{date:npDate,amount:-nonPurchaseCapital},{date:xirrExit,amount:nonPurchaseXirrReturn}]):0;
  const nonPurchaseEqMult=nonPurchaseCapital>0?(nonPurchaseXirrReturn-nonPurchaseCapital)/nonPurchaseCapital:0;
  const nonPurchaseHoldMonths=Math.round((xirrExit-npDate)/86400000/30.44);
  const nc=1-a.commissionRate;
  const be=(mktU>0&&nc>0)?((totalCapital+procProd+totalPref)-(affU*affResale*nc))/(mktU*nc):0;
  const cushion=resalePrice-be, safety=resalePrice>0?cushion/resalePrice:0;
  const ss=Math.min(a.monthModularCapital+3,months), sell=Math.max(months-ss+1,1);
  const avgNet=totalUnits>0?netSales/totalUnits:0;
  const allCosts=totalCapital+procProd+totalPref;
  const uBE=avgNet>0?allCosts/avgNet:totalUnits;
  const mSell=totalUnits>0?Math.ceil((uBE/totalUnits)*sell):sell;
  const beMo=Math.min(ss+mSell-1,months);
  return {resalePrice,gross,netSales,capProd,procProd,siteMiscCosts,totalCapital,purchaseCost,
    prefPurchase,prefSite,prefModular,totalPref,totalReturn,returnPct,
    rmProfit,lpProfit,rmReturn,commission:gross*a.commissionRate,
    purchaseXirrReturn,purchaseXirr,purchaseEqMult,purchaseHoldMonths,
    nonPurchaseCapital,nonPurchaseXirrReturn,nonPurchaseHoldMonths,nonPurchaseXirr,nonPurchaseEqMult,
    be,cushion,safety,beMo,mktCostPerSF,affCostPerSF,capMkt,capAff,totalUnits,salesStartMonth:ss};
}

// ─── Excel Export ───
function crc32(data){let crc=0xFFFFFFFF;for(let i=0;i<data.length;i++){crc^=data[i];for(let j=0;j<8;j++)crc=(crc>>>1)^(crc&1?0xEDB88320:0);}return(crc^0xFFFFFFFF)>>>0;}
function buildZip(files){const te=new TextEncoder();const entries=files.map(f=>({name:te.encode(f.name),data:te.encode(f.content)}));let offset=0;const localHeaders=[],centralHeaders=[],offsets=[];for(const e of entries){offsets.push(offset);const lh=new Uint8Array(30+e.name.length);const dv=new DataView(lh.buffer);dv.setUint32(0,0x04034b50,true);dv.setUint16(4,20,true);dv.setUint16(8,0,true);dv.setUint32(14,crc32(e.data),true);dv.setUint32(18,e.data.length,true);dv.setUint32(22,e.data.length,true);dv.setUint16(26,e.name.length,true);lh.set(e.name,30);localHeaders.push(lh);offset+=lh.length+e.data.length;}const cdStart=offset;for(let i=0;i<entries.length;i++){const e=entries[i];const ch=new Uint8Array(46+e.name.length);const dv=new DataView(ch.buffer);dv.setUint32(0,0x02014b50,true);dv.setUint16(4,20,true);dv.setUint16(6,20,true);dv.setUint16(10,0,true);dv.setUint32(16,crc32(e.data),true);dv.setUint32(20,e.data.length,true);dv.setUint32(24,e.data.length,true);dv.setUint16(28,e.name.length,true);dv.setUint32(42,offsets[i],true);ch.set(e.name,46);centralHeaders.push(ch);offset+=ch.length;}const cdSize=offset-cdStart;const eocd=new Uint8Array(22);const ev=new DataView(eocd.buffer);ev.setUint32(0,0x06054b50,true);ev.setUint16(8,entries.length,true);ev.setUint16(10,entries.length,true);ev.setUint32(12,cdSize,true);ev.setUint32(16,cdStart,true);const parts=[];for(let i=0;i<entries.length;i++){parts.push(localHeaders[i]);parts.push(entries[i].data);}for(const ch of centralHeaders)parts.push(ch);parts.push(eocd);let total=0;for(const p2 of parts)total+=p2.length;const result=new Uint8Array(total);let pos=0;for(const p2 of parts){result.set(p2,pos);pos+=p2.length;}return result;}

function downloadPFExcel(a, projectName) {
  const lo=calcScenario(a,a.marketResaleLow,a.affordableResaleLow), mi=calcScenario(a,a.marketResaleMid,a.affordableResaleMid), hi=calcScenario(a,a.marketResaleHigh,a.affordableResaleHigh);
  const p2=v=>`${(v*100).toFixed(2)}%`;
  const escX=v=>String(v).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
  const xirrStartDate=`${a.xirrStartMonth}/${a.xirrStartDay||1}/${a.xirrStartYear}`;
  const xirrExitDate=`${a.xirrExitMonth}/${a.xirrExitDay||new Date(a.xirrExitYear,a.xirrExitMonth,0).getDate()}/${a.xirrExitYear}`;
  const styles = `<Styles>
<Style ss:ID="Default"><Font ss:FontName="Arial" ss:Size="11" ss:Color="#1A1A1A"/></Style>
<Style ss:ID="h1"><Font ss:FontName="Arial" ss:Size="14" ss:Bold="1" ss:Color="#FFFFFF"/><Interior ss:Color="#2C3345" ss:Pattern="Solid"/></Style>
<Style ss:ID="hdr"><Font ss:FontName="Arial" ss:Size="11" ss:Bold="1" ss:Color="#FFFFFF"/><Interior ss:Color="#2C3345" ss:Pattern="Solid"/><Alignment ss:Horizontal="Left"/></Style>
<Style ss:ID="hdrC"><Font ss:FontName="Arial" ss:Size="11" ss:Bold="1" ss:Color="#FFFFFF"/><Interior ss:Color="#2C3345" ss:Pattern="Solid"/><Alignment ss:Horizontal="Center"/></Style>
<Style ss:ID="d"><Font ss:FontName="Arial" ss:Size="10" ss:Color="#333333"/><Borders><Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/></Borders></Style>
<Style ss:ID="dB"><Font ss:FontName="Arial" ss:Size="10" ss:Bold="1" ss:Color="#1A1A1A"/><Borders><Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/></Borders></Style>
<Style ss:ID="dBM"><Font ss:FontName="Arial" ss:Size="10" ss:Bold="1" ss:Color="#1A1A1A"/><Borders><Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="2"/></Borders></Style>
<Style ss:ID="dC"><Font ss:FontName="Arial" ss:Size="10" ss:Color="#333333"/><Alignment ss:Horizontal="Center"/><Borders><Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/></Borders></Style>
<Style ss:ID="$"><Font ss:FontName="Arial" ss:Size="10" ss:Color="#333333"/><NumberFormat ss:Format="_($ * #,##0.00_);_($ * (#,##0.00);_($ * &quot;-&quot;_);_(@_)"/><Alignment ss:Horizontal="Center"/><Borders><Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/></Borders></Style>
<Style ss:ID="$B"><Font ss:FontName="Arial" ss:Size="10" ss:Bold="1" ss:Color="#1A1A1A"/><NumberFormat ss:Format="_($ * #,##0.00_);_($ * (#,##0.00);_($ * &quot;-&quot;_);_(@_)"/><Alignment ss:Horizontal="Center"/><Borders><Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="2"/></Borders></Style>
</Styles>`;
  const c=(v,s)=>`<Cell ss:StyleID="${s}"><Data ss:Type="${typeof v==='number'?'Number':'String'}">${typeof v==='number'?v:escX(v)}</Data></Cell>`;
  const sp=`<Row ss:Height="15"><Cell/></Row>`;
  const R=(...cells)=>`<Row ss:Height="18">${cells.join("")}</Row>`;
  const R1=(label)=>`<Row ss:Height="32">${c(label,"h1")}</Row>`;
  const proFormaSheet = `<Worksheet ss:Name="Pro Forma"><Table ss:DefaultColumnWidth="100">
<Column ss:Width="350"/><Column ss:Width="160"/><Column ss:Width="160"/><Column ss:Width="160"/>
${sp}
${R(c("","hdr"),c("LOW","hdrC"),c("MIDDLE","hdrC"),c("HIGH","hdrC"))}
${R(c("PURCHASE & PERMITTING","dB"),c(lo.purchaseCost,"$"),c(mi.purchaseCost,"$"),c(hi.purchaseCost,"$"))}
${R(c("CAPITAL PRODUCTION","dB"),c(lo.capProd,"$"),c(mi.capProd,"$"),c(hi.capProd,"$"))}
${R(c("SITE & MISC COSTS","dB"),c(lo.siteMiscCosts,"$"),c(mi.siteMiscCosts,"$"),c(hi.siteMiscCosts,"$"))}
${R(c("TOTAL CAPITAL REQUIRED","dBM"),c(lo.totalCapital,"$B"),c(mi.totalCapital,"$B"),c(hi.totalCapital,"$B"))}
${sp}
${R(c("GROSS SALES","dB"),c(lo.gross,"$"),c(mi.gross,"$"),c(hi.gross,"$"))}
${R(c("NET SALES","dB"),c(lo.netSales,"$"),c(mi.netSales,"$"),c(hi.netSales,"$"))}
${R(c("TOTAL RETURN","dBM"),c(lo.totalReturn,"$B"),c(mi.totalReturn,"$B"),c(hi.totalReturn,"$B"))}
${R(c("Return %","dB"),c(p2(lo.returnPct),"dC"),c(p2(mi.returnPct),"dC"),c(p2(hi.returnPct),"dC"))}
${R(c("Purchase Capital XIRR","dB"),c(p2(lo.purchaseXirr),"dC"),c(p2(mi.purchaseXirr),"dC"),c(p2(hi.purchaseXirr),"dC"))}
${R(c("Non-Purchase XIRR","dB"),c(p2(lo.nonPurchaseXirr),"dC"),c(p2(mi.nonPurchaseXirr),"dC"),c(p2(hi.nonPurchaseXirr),"dC"))}
</Table></Worksheet>`;
  const xml = `<?xml version="1.0"?><?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
${styles}${proFormaSheet}
</Workbook>`;
  const blob=new Blob([xml],{type:"application/vnd.ms-excel"});
  const url=URL.createObjectURL(blob);const link=document.createElement("a");
  link.href=url;link.download=`${projectName||"ProForma"}_Analysis.xls`;link.click();URL.revokeObjectURL(url);
}

const PF_DEFAULT_ASSUMPTIONS = {
  purchasePrice:0,permittingCosts:0,
  siteWork:0,
  marketRateUnits:0,affordableUnits:0,
  capitalMarketUnits:0,capitalAffordableUnits:0,
  marketSF:0,affordableSF:0,
  marketCostPerSF:180,affordableCostPerSF:150,
  monthSiteWorkCapital:12,monthModularCapital:15,
  prefRatePurchase:0.12,prefRateOther:0.12,
  projectMonths:48,
  commissionRate:0.04,rmProfitShare:0.70,
  marketResaleLow:0,marketResaleMid:0,marketResaleHigh:0,
  affordableResaleLow:0,affordableResaleMid:0,affordableResaleHigh:0,
  xirrStartYear:2026,xirrStartMonth:5,xirrStartDay:1,
  xirrExitYear:2029,xirrExitMonth:4,xirrExitDay:30,
};

// ─── Main Pro Forma Tool (Plugin Contract) ───
function ProFormaTool({ project, onSave, onClose }) {
  const info = project.project_info;
  const fin = project.financials;
  const [scenario, setScenario] = useState("Middle");
  const [chatOpen, setChatOpen] = useState(false);
  const [inputsOpen, setInputsOpen] = useState(false);
  const [a, setA] = useState(() => ({
    ...PF_DEFAULT_ASSUMPTIONS,
    purchasePrice: fin.land_cost || 0,
    marketRateUnits: Math.round((info.lot_count || 0) * 0.75),
    affordableUnits: Math.round((info.lot_count || 0) * 0.25),
    marketResaleLow: (fin.target_price_per_home || 0) * 0.9,
    marketResaleMid: fin.target_price_per_home || 0,
    marketResaleHigh: (fin.target_price_per_home || 0) * 1.1,
  }));
  const u = (k, v) => setA(p => ({ ...p, [k]: v }));

  const m = useMemo(() => {
    const res=scenario==="Low"?a.marketResaleLow:scenario==="Middle"?a.marketResaleMid:a.marketResaleHigh;
    const affRes=scenario==="Low"?(a.affordableResaleLow||0):scenario==="Middle"?(a.affordableResaleMid||0):(a.affordableResaleHigh||0);
    const mktU=Math.max(a.marketRateUnits,0), affU=Math.max(a.affordableUnits,0), totalUnits=mktU+affU, months=Math.max(a.projectMonths,1);
    const mktCostPerSF=a.marketCostPerSF||0, affCostPerSF=a.affordableCostPerSF||0;
    const purchaseCost=(a.purchasePrice||0)+(a.permittingCosts||0);
    const capMkt=Math.min(a.capitalMarketUnits||0,mktU), capAff=Math.min(a.capitalAffordableUnits||0,affU);
    const capitalProductionCost=(capMkt*a.marketSF*mktCostPerSF)+(capAff*a.affordableSF*affCostPerSF);
    const procMkt=mktU-capMkt, procAff=affU-capAff;
    const proceedsProductionCost=(procMkt*a.marketSF*mktCostPerSF)+(procAff*a.affordableSF*affCostPerSF);
    const siteMiscCosts=a.siteWork||0;
    const totalCapital=purchaseCost+capitalProductionCost+siteMiscCosts;
    const grossSales=(mktU*res)+(affU*affRes);
    const commission=grossSales*a.commissionRate;
    const netSales=grossSales-commission;
    const prefPurchase=purchaseCost*a.prefRatePurchase/12*months;
    const prefSite=siteMiscCosts*a.prefRateOther/12*Math.max(months-a.monthSiteWorkCapital,0);
    const prefModular=capitalProductionCost*a.prefRateOther/12*Math.max(months-a.monthModularCapital,0);
    const totalPref=prefPurchase+prefSite+prefModular;
    const totalReturn=netSales-totalCapital-proceedsProductionCost-totalPref;
    const returnPct=totalCapital>0?totalReturn/totalCapital:0;
    const rmProfit=totalReturn*a.rmProfitShare;
    const lpProfit=totalReturn*(1-a.rmProfitShare);
    const rmReturn=rmProfit+totalPref;
    const purchaseXirrReturn=purchaseCost+prefPurchase;
    const xirrStart=xirrDate(a.xirrStartYear,a.xirrStartMonth,a.xirrStartDay||1);
    const xirrExit=xirrDate(a.xirrExitYear,a.xirrExitMonth,a.xirrExitDay||xirrLastDay(a.xirrExitYear,a.xirrExitMonth));
    const purchaseXirr=purchaseCost>0?xirrSolve([{date:xirrStart,amount:-purchaseCost},{date:xirrExit,amount:purchaseXirrReturn}]):0;
    const purchaseHoldMonths=Math.round((xirrExit-xirrStart)/86400000/30.44);
    const nonPurchaseCapital=totalCapital-purchaseCost;
    const nonPurchaseXirrReturn=nonPurchaseCapital+rmReturn+prefSite+prefModular;
    const npDate=new Date(a.xirrStartYear,a.xirrStartMonth-1+(a.monthSiteWorkCapital||0),a.xirrStartDay||1);
    const nonPurchaseXirr=nonPurchaseCapital>0?xirrSolve([{date:npDate,amount:-nonPurchaseCapital},{date:xirrExit,amount:nonPurchaseXirrReturn}]):0;
    const nonPurchaseHoldMonths=Math.round((xirrExit-npDate)/86400000/30.44);
    const netCommRate=1-a.commissionRate;
    const allCosts=totalCapital+proceedsProductionCost+totalPref;
    const affRevNet=affU*affRes*netCommRate;
    const breakEvenPrice=(mktU>0&&netCommRate>0)?(allCosts-affRevNet)/(mktU*netCommRate):0;
    const cushionAboveBreakEven=res-breakEvenPrice;
    const marginOfSafety=res>0?cushionAboveBreakEven/res:0;
    const salesStartMonth=Math.min(a.monthModularCapital+3,months);
    const sellingMonths=Math.max(months-salesStartMonth+1,1);
    const avgNetPrice=totalUnits>0?netSales/totalUnits:0;
    const unitsToBreakEven=avgNetPrice>0?allCosts/avgNetPrice:totalUnits;
    const monthsToSell=totalUnits>0?Math.ceil((unitsToBreakEven/totalUnits)*sellingMonths):sellingMonths;
    const breakevenMonth=Math.min(salesStartMonth+monthsToSell-1,months);
    const sensitivityPer50K=mktU*50000*netCommRate;
    const drop5pct=grossSales*0.05*netCommRate;
    return { purchaseCost,capitalProductionCost,proceedsProductionCost,siteMiscCosts,totalCapital,
      grossSales,commission,netSales,prefPurchase,prefSite,prefModular,totalPref,
      totalReturn,returnPct,rmProfit,lpProfit,rmReturn,
      purchaseXirr,purchaseHoldMonths,nonPurchaseXirr,nonPurchaseHoldMonths,nonPurchaseCapital,nonPurchaseXirrReturn,
      breakEvenPrice,cushionAboveBreakEven,marginOfSafety,salesStartMonth,breakevenMonth,sensitivityPer50K,drop5pct };
  }, [a, scenario]);

  const res=scenario==="Low"?a.marketResaleLow:scenario==="Middle"?a.marketResaleMid:a.marketResaleHigh;
  const costs=[
    {label:"Land & Permits",val:m.purchaseCost,color:C.blue},
    {label:"Capital Production",val:m.capitalProductionCost,color:"#7DA68A"},
    {label:"Site & Construction",val:m.siteMiscCosts,color:"#6B8EBF"},
    {label:"Proceeds Production",val:m.proceedsProductionCost,color:"#8DA47D"},
    {label:"Commission",val:m.commission,color:"#B8A88A"},
    {label:"Preferred Return",val:m.totalPref,color:C.warn},
  ];
  const totalAllCosts=m.totalCapital+m.proceedsProductionCost+m.commission+m.totalPref;

  const handleSave = () => {
    onSave({
      id: crypto.randomUUID(), created_at: new Date().toISOString(), tool_id: "proforma",
      label: `${scenario} Scenario — ${info.name}`,
      data: { scenario, assumptions: { ...a }, computed: {
        grossSales: m.grossSales, totalReturn: m.totalReturn, returnPct: m.returnPct,
        breakEvenPrice: m.breakEvenPrice, marginOfSafety: m.marginOfSafety,
        rmReturn: m.rmReturn, purchaseXirr: m.purchaseXirr, nonPurchaseXirr: m.nonPurchaseXirr,
        totalCapital: m.totalCapital, netProfit: m.totalReturn,
        margin: (m.returnPct * 100).toFixed(1),
      }},
    });
  };

  return (
    <div>
      {/* Tool Header */}
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20,flexWrap:"wrap",gap:10 }}>
        <div style={{ display:"flex",alignItems:"center",gap:14 }}>
          <button onClick={onClose} style={{ padding:"8px 16px",borderRadius:"8px",border:`1px solid ${C.border}`,background:C.surface,color:C.textMid,fontSize:"13px",fontWeight:600,cursor:"pointer",fontFamily:font }}>← Back</button>
          <div>
            <div style={{ fontSize:"18px",fontWeight:700,color:C.text }}>Pro Forma Analyzer</div>
            <div style={{ fontSize:"12px",color:C.textMuted }}>{info.name} — {info.city}, {info.state}</div>
          </div>
        </div>
        <div style={{ display:"flex",gap:8 }}>
          <button onClick={()=>setInputsOpen(!inputsOpen)} style={{ padding:"10px 20px",borderRadius:"8px",border:"none",background:inputsOpen?C.positive:C.blue,color:"#fff",fontSize:"13px",fontWeight:600,cursor:"pointer",fontFamily:font }}>
            {inputsOpen?"Close Editor":"Edit Assumptions"}</button>
          <button onClick={()=>downloadPFExcel(a, info.name)} style={{ padding:"10px 20px",borderRadius:"8px",border:`1px solid ${C.border}`,background:C.surface,color:C.textMid,fontSize:"13px",fontWeight:600,cursor:"pointer",fontFamily:font }}>
            Export Excel</button>
          <button onClick={handleSave} style={{ padding:"10px 20px",borderRadius:"8px",border:"none",background:C.accent,color:"#fff",fontSize:"13px",fontWeight:600,cursor:"pointer",fontFamily:font }}>
            Save to Project</button>
        </div>
      </div>

      {/* Summary */}
      <div style={{ fontSize:"17px",color:C.textMid,lineHeight:1.6,marginBottom:24,fontWeight:400 }}>
        Over <b style={{color:C.text}}>{a.projectMonths} months</b>, this project is projected to generate{" "}
        <b style={{color:m.totalReturn>0?C.positive:C.negative}}>{$(m.totalReturn)} total return</b>{" "}
        ({pct(m.returnPct)} ROI). Break-even requires a market home price of{" "}
        <b style={{color:C.warn}}>{$(m.breakEvenPrice)}</b>
        <span style={{color:C.textMuted}}> — {pct(m.marginOfSafety)} below the {scenario.toLowerCase()} price of {$(res)}.</span>
      </div>

      {/* KPI Row */}
      <div style={{ display:"grid",gridTemplateColumns:"repeat(5, 1fr)",gap:16,marginBottom:24 }}>
        {[
          {label:"Total Return",value:$(m.totalReturn),color:m.totalReturn>0?C.positive:C.negative},
          {label:"Return on Capital",value:pct(m.returnPct),color:C.text},
          {label:"Break-Even Price",value:$(m.breakEvenPrice),color:C.warn,sub:"min market home price"},
          {label:"Safety Margin",value:pct(m.marginOfSafety),color:m.marginOfSafety>0.15?C.positive:C.negative},
          {label:"Project Duration",value:`${a.projectMonths} mo`,color:C.blue},
        ].map((k,i)=>(
          <div key={i} style={{ background:C.surface,borderRadius:"14px",padding:"24px 28px",border:`1px solid ${C.border}` }}>
            <div style={{ fontSize:"32px",fontWeight:700,color:k.color,letterSpacing:"-0.03em",fontVariantNumeric:"tabular-nums",lineHeight:1 }}>{k.value}</div>
            <div style={{ fontSize:"12px",color:C.textMuted,marginTop:8,fontWeight:500,textTransform:"uppercase",letterSpacing:"0.04em" }}>{k.label}</div>
            {k.sub && <div style={{ fontSize:"11px",color:C.textMuted,marginTop:"2px" }}>{k.sub}</div>}
          </div>
        ))}
      </div>

      {/* Scenario Selector */}
      <div style={{ display:"flex",justifyContent:"center",marginBottom:24 }}>
        <div style={{ background:C.surface,borderRadius:"10px",display:"flex",padding:"3px",border:`1px solid ${C.border}` }}>
          {["Low","Middle","High"].map(s=>(
            <button key={s} onClick={()=>setScenario(s)} style={{
              padding:"10px 28px",borderRadius:"8px",border:"none",
              background:scenario===s?C.accent:"transparent",color:scenario===s?"#fff":C.textMuted,
              fontSize:"13px",fontWeight:600,cursor:"pointer",fontFamily:font,transition:"all 0.25s",
            }}>{s} Scenario</button>
          ))}
        </div>
      </div>

      {/* Inputs Panel */}
      {inputsOpen && (
        <div style={{ background:C.surface,borderRadius:"14px",border:`1px solid ${C.border}`,padding:"28px 32px",marginBottom:24 }}>
          <div style={{ fontSize:"15px",fontWeight:700,color:C.text,marginBottom:"6px" }}>Assumptions</div>
          <div style={{ fontSize:"12px",color:C.textMuted,marginBottom:"24px" }}>Click any value to edit. All outputs update automatically.</div>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 48px" }}>
            <div>
              <PFSectionHeader>Project Costs</PFSectionHeader>
              <PFInputBox label="Purchase Price" value={a.purchasePrice} type="currency" onChange={v=>u("purchasePrice",v)} />
              <PFInputBox label="Permitting Costs" value={a.permittingCosts} type="currency" onChange={v=>u("permittingCosts",v)}
                helper={`Total purchase & permitting: $${((a.purchasePrice||0)+(a.permittingCosts||0)).toLocaleString()}`} />
              <PFInputBox label="Site Work Costs" value={a.siteWork} type="currency" onChange={v=>u("siteWork",v)} />
              <PFSectionHeader>Unit Counts</PFSectionHeader>
              <PFInputBox label="Market Homes" value={a.marketRateUnits} type="integer" onChange={v=>u("marketRateUnits",v)} />
              <PFInputBox label="Market Homes Needing Capital" value={a.capitalMarketUnits} type="integer" onChange={v=>u("capitalMarketUnits",v)}
                helper={`${Math.max(a.marketRateUnits - a.capitalMarketUnits, 0)} using proceeds`} />
              <PFInputBox label="Affordable Homes" value={a.affordableUnits} type="integer" onChange={v=>u("affordableUnits",v)} />
              <PFInputBox label="Affordable Homes Needing Capital" value={a.capitalAffordableUnits} type="integer" onChange={v=>u("capitalAffordableUnits",v)}
                helper={`${Math.max(a.affordableUnits - a.capitalAffordableUnits, 0)} using proceeds`} />
              <PFSectionHeader>Square Footage & Cost</PFSectionHeader>
              <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 16px" }}>
                <PFInputBox label="Market SF / Home" value={a.marketSF} type="sf" onChange={v=>u("marketSF",v)} />
                <PFInputBox label="Affordable SF / Home" value={a.affordableSF} type="sf" onChange={v=>u("affordableSF",v)} />
                <PFInputBox label="Market Cost / SF" value={a.marketCostPerSF} type="integer" onChange={v=>u("marketCostPerSF",v)} />
                <PFInputBox label="Affordable Cost / SF" value={a.affordableCostPerSF} type="integer" onChange={v=>u("affordableCostPerSF",v)} />
              </div>
            </div>
            <div>
              <PFSectionHeader>Sale Prices</PFSectionHeader>
              <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 16px" }}>
                <PFInputBox label="Market Resale (Low)" value={a.marketResaleLow} type="currency" onChange={v=>u("marketResaleLow",v)} />
                <PFInputBox label="Affordable Resale (Low)" value={a.affordableResaleLow} type="currency" onChange={v=>u("affordableResaleLow",v)} />
                <PFInputBox label="Market Resale (Mid)" value={a.marketResaleMid} type="currency" onChange={v=>u("marketResaleMid",v)} />
                <PFInputBox label="Affordable Resale (Mid)" value={a.affordableResaleMid} type="currency" onChange={v=>u("affordableResaleMid",v)} />
                <PFInputBox label="Market Resale (High)" value={a.marketResaleHigh} type="currency" onChange={v=>u("marketResaleHigh",v)} />
                <PFInputBox label="Affordable Resale (High)" value={a.affordableResaleHigh} type="currency" onChange={v=>u("affordableResaleHigh",v)} />
              </div>
              <PFSectionHeader>Timing</PFSectionHeader>
              <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 16px" }}>
                <PFInputBox label="Project Duration (Months)" value={a.projectMonths} type="months" onChange={v=>u("projectMonths",v)} />
                <PFInputBox label="Site Work Capital Month" value={a.monthSiteWorkCapital} type="month" onChange={v=>u("monthSiteWorkCapital",v)} />
                <PFInputBox label="Modular Capital Month" value={a.monthModularCapital} type="month" onChange={v=>u("monthModularCapital",v)}
                  helper={`Sales begin Month ${Math.min((a.monthModularCapital||0) + 3, a.projectMonths)}`} />
              </div>
              <PFSectionHeader>Terms</PFSectionHeader>
              <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 16px" }}>
                <PFInputBox label="Pref Rate (Purchase)" value={a.prefRatePurchase} type="percent" onChange={v=>u("prefRatePurchase",v)} />
                <PFInputBox label="Pref Rate (Other)" value={a.prefRateOther} type="percent" onChange={v=>u("prefRateOther",v)} />
                <PFInputBox label="RM Profit Share" value={a.rmProfitShare} type="percent" onChange={v=>u("rmProfitShare",v)} />
                <PFInputBox label="Commission Rate" value={a.commissionRate} type="percent" onChange={v=>u("commissionRate",v)} />
              </div>
              <PFSectionHeader>XIRR Dates</PFSectionHeader>
              <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 12px" }}>
                <PFInputBox label="Deploy Date" value={`${a.xirrStartMonth||1}/${a.xirrStartDay||1}/${a.xirrStartYear||2026}`} type="date"
                  onChange={v=>{const p=String(v).split(/[\/\-]/);if(p.length===3){u("xirrStartMonth",parseInt(p[0])||1);u("xirrStartDay",parseInt(p[1])||1);u("xirrStartYear",parseInt(p[2])||2026);}}}
                  helper="Purchase capital deploy (M/D/YYYY)" />
                <PFInputBox label="Exit Date" value={`${a.xirrExitMonth||4}/${a.xirrExitDay||30}/${a.xirrExitYear||2029}`} type="date"
                  onChange={v=>{const p=String(v).split(/[\/\-]/);if(p.length===3){u("xirrExitMonth",parseInt(p[0])||1);u("xirrExitDay",parseInt(p[1])||1);u("xirrExitYear",parseInt(p[2])||2029);}}}
                  helper="Return/exit date (M/D/YYYY)" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Carousel Panels */}
      <PFCarousel>
        {/* Returns */}
        <div>
          <div style={{ fontSize:"15px",fontWeight:700,color:C.textMid,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:24 }}>Returns & Distribution</div>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:32 }}>
            <PFStat label="Total Return" value={$(m.totalReturn)} color={m.totalReturn>0?C.positive:C.negative} />
            <PFStat label="Return on Capital" value={pct(m.returnPct)} />
            <PFStat label="Purchase Capital Return" value={pct(m.purchaseXirr)} color={C.blue} />
            <PFStat label="Other Capital Return" value={pct(m.nonPurchaseXirr)} color={m.nonPurchaseXirr>0.2?C.positive:C.warn} />
          </div>
          <div style={{ marginTop:28,padding:"20px 24px",background:C.surfaceAlt,borderRadius:12 }}>
            <div style={{ fontSize:"13px",fontWeight:600,color:C.textMid,marginBottom:14,textTransform:"uppercase",letterSpacing:"0.04em" }}>Return Waterfall</div>
            {[
              {label:"Gross Sales",value:m.grossSales,color:C.positive},
              {label:`Less Commission (${pct(a.commissionRate)})`,value:-m.commission,color:C.textMuted},
              {label:"Net Sales",value:m.netSales,color:C.text,bold:true},
              {label:"Less Total Capital Required",value:-m.totalCapital,color:C.textMuted},
              {label:"Less Proceeds-Funded Production",value:-m.proceedsProductionCost,color:C.textMuted},
              {label:`Less Pref on Purchase (${pct(a.prefRatePurchase)} × ${a.projectMonths}mo)`,value:-m.prefPurchase,color:C.textMuted},
              {label:`Less Pref on Site (${pct(a.prefRateOther)} × ${Math.max(a.projectMonths-a.monthSiteWorkCapital,0)}mo)`,value:-m.prefSite,color:C.textMuted},
              {label:`Less Pref on Modular (${pct(a.prefRateOther)} × ${Math.max(a.projectMonths-a.monthModularCapital,0)}mo)`,value:-m.prefModular,color:C.textMuted},
              {label:"Total Return",value:m.totalReturn,color:m.totalReturn>0?C.positive:C.negative,bold:true},
              {label:`RM Profit Share (${pct(a.rmProfitShare)})`,value:m.rmProfit,color:C.accent},
              {label:"+ All Preferred Returns",value:m.totalPref,color:C.accent},
              {label:"RM Total Return",value:m.rmReturn,color:C.accent,bold:true},
              {label:`Annual Return % on Purchase Capital (${m.purchaseHoldMonths}mo)`,value:null,pctValue:pct(m.purchaseXirr),color:C.blue},
              {label:`Annual Return % on Other Capital (${m.nonPurchaseHoldMonths}mo)`,value:null,pctValue:pct(m.nonPurchaseXirr),color:m.nonPurchaseXirr>0.2?C.positive:C.warn},
            ].map((row,i)=>(
              <div key={i} style={{ display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 0",borderTop:row.bold?`1.5px solid ${C.border}`:(i>0?`1px solid ${C.borderLight}`:"none"),marginTop:row.bold?"6px":"0" }}>
                <span style={{ fontSize:"13px",color:row.bold?C.text:C.textMid,fontWeight:row.bold?700:500 }}>{row.label}</span>
                <span style={{ fontSize:"14px",fontWeight:row.bold?700:600,color:row.color,fontVariantNumeric:"tabular-nums" }}>
                  {row.pctValue ? row.pctValue : <>{row.value<0?"−":""}{$f(Math.abs(row.value))}</>}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Breakeven */}
        <div>
          <div style={{ fontSize:"15px",fontWeight:700,color:C.textMid,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:24 }}>Breakeven Analysis</div>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:32,marginBottom:32 }}>
            <PFStat label="Break-Even Home Price" value={$f(m.breakEvenPrice)} color={C.warn} />
            <PFStat label="Price Cushion" value={$f(m.cushionAboveBreakEven)} color={m.cushionAboveBreakEven>0?C.positive:C.negative} />
            <PFStat label="Margin of Safety" value={pct(m.marginOfSafety)} color={m.marginOfSafety>0.15?C.positive:C.negative} />
            <PFStat label="Break-Even Month" value={`Month ${m.breakevenMonth}`} color={C.blue} />
          </div>
          <div style={{ fontSize:"14px",color:C.textMid,marginBottom:"10px",fontWeight:500 }}>
            Project timeline — {a.projectMonths} months total, sales begin Month {m.salesStartMonth}
          </div>
          <div style={{ position:"relative",height:36,background:C.surfaceAlt,borderRadius:18,overflow:"hidden" }}>
            <div style={{ position:"absolute",left:0,top:0,bottom:0,width:`${((m.salesStartMonth-1)/a.projectMonths)*100}%`,background:"rgba(192,86,75,0.15)",borderRadius:"18px 0 0 18px" }} />
            <div style={{ position:"absolute",left:`${((m.salesStartMonth-1)/a.projectMonths)*100}%`,top:0,bottom:0,width:`${(Math.max(m.breakevenMonth-m.salesStartMonth+1,0)/a.projectMonths)*100}%`,background:"rgba(196,148,58,0.2)" }} />
            {m.breakevenMonth<a.projectMonths&&<div style={{ position:"absolute",left:`${(m.breakevenMonth/a.projectMonths)*100}%`,top:0,bottom:0,right:0,background:"rgba(91,140,106,0.15)",borderRadius:"0 18px 18px 0" }} />}
            <div style={{ position:"absolute",left:`${Math.min((m.breakevenMonth/a.projectMonths)*100,100)}%`,top:4,bottom:4,width:3,borderRadius:2,background:C.text,transform:"translateX(-1px)" }} />
          </div>
          <div style={{ display:"flex",justifyContent:"space-between",marginTop:8,fontSize:"13px",color:C.textMid }}>
            <span style={{ fontWeight:500 }}>Capital Deploy (M1–{m.salesStartMonth-1})</span>
            <span style={{ color:C.warn,fontWeight:700 }}>Break-even: {monthLabel(m.breakevenMonth)}</span>
            <span style={{ color:C.positive,fontWeight:500 }}>{m.breakevenMonth<a.projectMonths?"Profit Zone":""}</span>
          </div>
        </div>

        {/* Cost Stack */}
        <div>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:20 }}>
            <div style={{ fontSize:"15px",fontWeight:700,color:C.textMid,textTransform:"uppercase",letterSpacing:"0.06em" }}>Cost Stack</div>
            <div style={{ fontSize:"26px",fontWeight:700,color:C.text,fontVariantNumeric:"tabular-nums" }}>{$f(totalAllCosts)} <span style={{ fontSize:"14px",fontWeight:500,color:C.textMid }}>total all-in costs</span></div>
          </div>
          <div style={{ display:"flex",height:12,borderRadius:6,overflow:"hidden",marginBottom:20 }}>
            {costs.map((c2,i)=>(<div key={i} style={{ width:`${(c2.val/totalAllCosts)*100}%`,background:c2.color,transition:"width 0.6s" }} />))}
          </div>
          {costs.map((c2,i)=>(<PFCostRow key={i} label={c2.label} value={c2.val} pctVal={c2.val/totalAllCosts} barColor={c2.color} />))}
        </div>

        {/* Exit */}
        <div>
          <div style={{ fontSize:"15px",fontWeight:700,color:C.textMid,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:24 }}>Exit Snapshot</div>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:32,marginBottom:32 }}>
            <PFStat label="Gross Revenue" value={$(m.grossSales)} />
            <PFStat label="Net After Commission" value={$(m.grossSales-m.commission)} />
            <PFStat label="Break-Even Market Price" value={$f(m.breakEvenPrice)} color={C.warn} size="sm" />
            <PFStat label={`${scenario} Market Price`} value={$f(res)} color={C.positive} size="sm" />
          </div>
          <div style={{ padding:"18px 22px",background:C.surfaceAlt,borderRadius:10 }}>
            <div style={{ fontSize:"14px",color:C.textMid,marginBottom:6,fontWeight:600 }}>Sensitivity</div>
            <div style={{ fontSize:"15px",color:C.text,lineHeight:1.6 }}>
              A <b>5% drop</b> in revenue would reduce net proceeds by <b style={{color:C.negative}}>{$(m.drop5pct)}</b>.
              Each <b>$50K</b> change in market home price shifts profit by <b style={{color:C.blue}}>{$(m.sensitivityPer50K)}</b>.
            </div>
          </div>
        </div>
      </PFCarousel>

      {/* Floating AI Chat */}
      <div style={{ position:"fixed",bottom:"24px",right:"24px",zIndex:200 }}>
        {chatOpen&&(
          <div style={{ width:"360px",borderRadius:"16px",border:`1px solid ${C.border}`,boxShadow:"0 16px 48px rgba(0,0,0,0.12)",background:C.surface,marginBottom:"12px",overflow:"hidden" }}>
            <div style={{ padding:"12px 16px",borderBottom:`1px solid ${C.borderLight}`,display:"flex",alignItems:"center",justifyContent:"space-between" }}>
              <div style={{ display:"flex",alignItems:"center",gap:"8px" }}>
                <div style={{ width:"8px",height:"8px",borderRadius:"50%",background:C.accent }} />
                <span style={{ fontSize:"13px",fontWeight:600 }}>Deal Analyst</span>
              </div>
              <button onClick={()=>setChatOpen(false)} style={{ border:"none",background:"transparent",fontSize:"18px",color:C.textMuted,cursor:"pointer",lineHeight:1 }}>×</button>
            </div>
            <PFAIChat assumptions={a} metrics={m} scenario={scenario} />
          </div>
        )}
        <button onClick={()=>setChatOpen(!chatOpen)} style={{
          width:"48px",height:"48px",borderRadius:"50%",border:`1px solid ${C.border}`,
          background:chatOpen?C.accent:C.surface,color:chatOpen?"#fff":C.accent,
          fontSize:"18px",cursor:"pointer",boxShadow:"0 2px 12px rgba(0,0,0,0.08)",
          display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.2s",marginLeft:"auto",fontFamily:font,
        }}>✦</button>
      </div>
    </div>
  );
}


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// WEBSITE GENERATOR TOOL (Full Plugin)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const FALLBACK_IMGS = [
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1800&q=80',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
  'https://images.unsplash.com/photo-1615529182904-14819c35db37?w=700&q=80',
  'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=700&q=80',
  'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=700&q=80',
];
const DEV_HERO_FB = 'https://images.unsplash.com/photo-1448630360428-65456885c650?w=1800&q=80';
const LOT_FB = [
  'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80',
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80',
  'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800&q=80',
  'https://images.unsplash.com/photo-1576941089067-2de3c901e126?w=800&q=80',
];
const esc = s => String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');

function WebsiteGeneratorTool({ project, onSave, onClose }) {
  const info = project.project_info;
  const fin = project.financials;
  const [tab, setTab] = useState("dev"); // "single" | "dev"
  const [previewHtml, setPreviewHtml] = useState(null);
  const [previewSlug, setPreviewSlug] = useState("");
  const [generated, setGenerated] = useState([]);
  const iframeRef = useRef(null);

  // ─── Single Property State ───
  const [single, setSingle] = useState({
    address: info.address || "", city: info.city || "", state: info.state || "",
    price: fin.target_price_per_home ? "$" + fin.target_price_per_home.toLocaleString() : "",
    status: "Active", beds: "", baths: "", sqft: "", acres: "",
    description: "", neighborhood: "", neighborhoodName: info.city ? `${info.city}, ${info.state}` : "",
    mapUrl: "", agentName: "", agentDre: "", agentPhone: "", agentEmail: "",
    brokerage: "Next Wave", agentPhoto: "",
    feat1: "", feat2: "", feat3: "",
    images: new Array(6).fill(""),
    details: Array.from({length:7}, () => ({k:"", v:""})),
    nearby: Array.from({length:5}, () => ({k:"", v:""})),
  });
  const sSet = (k, v) => setSingle(p => ({...p, [k]: v}));

  // ─── Development State ───
  const [dev, setDev] = useState({
    name: info.name || "", city: info.city || "", state: info.state || "",
    priceFrom: fin.target_price_per_home ? "$" + Math.round(fin.target_price_per_home * 0.9).toLocaleString() : "",
    priceTo: fin.target_price_per_home ? "$" + Math.round(fin.target_price_per_home * 1.1).toLocaleString() : "",
    totalLots: info.lot_count ? String(info.lot_count) : "",
    available: "", completion: "",
    heroImage: "", description: info.notes || "", neighborhood: "",
    featTitle1: "Architecture", featTitle2: "Community",
    feat1: "", feat2: "",
    mapUrl: "", agentName: "", agentTitle: "Sales Director",
    agentPhone: "", agentEmail: "", brokerage: "Next Wave", agentPhoto: "",
    nearby: Array.from({length:4}, () => ({k:"", v:""})),
  });
  const dSet = (k, v) => setDev(p => ({...p, [k]: v}));

  // ─── Lots State ───
  const [lots, setLots] = useState([]);
  const [lotCounter, setLotCounter] = useState(0);
  const [openLots, setOpenLots] = useState({});

  const addLot = () => {
    const id = lotCounter;
    setLots(p => [...p, { id, addr:"", price:"", beds:"", baths:"", sqft:"", status:"Available", desc:"", feats:"", images:["","","",""] }]);
    setLotCounter(id + 1);
    setOpenLots(p => ({...p, [id]: true}));
  };
  const removeLot = (id) => setLots(p => p.filter(l => l.id !== id));
  const toggleLot = (id) => setOpenLots(p => ({...p, [id]: !p[id]}));
  const updateLot = (id, k, v) => setLots(p => p.map(l => l.id === id ? {...l, [k]: v} : l));
  const updateLotImg = (id, idx, v) => setLots(p => p.map(l => {
    if (l.id !== id) return l;
    const imgs = [...l.images]; imgs[idx] = v; return {...l, images: imgs};
  }));

  // ─── Build Single HTML ───
  const buildSingleHTML = () => {
    const s = single;
    const imgs = s.images.map((im, i) => im || FALLBACK_IMGS[i]);
    const details = s.details.filter(d => d.k && d.v);
    const nearby = s.nearby.filter(n => n.k);
    const feats = [
      {title:'Architecture & Interiors', items: s.feat1.split('\n').filter(Boolean)},
      {title:'Kitchen & Living', items: s.feat2.split('\n').filter(Boolean)},
      {title:'Grounds & Amenities', items: s.feat3.split('\n').filter(Boolean)},
    ].filter(f => f.items.length);
    const descParas = (s.description || 'A stunning private residence.').split(/\n\n+/).filter(Boolean);
    const detailRows = details.map(r => `<div class="od"><span class="dk">${esc(r.k)}</span><span class="dv">${esc(r.v)}</span></div>`).join('');
    const descHTML = descParas.map(p => `<p>${esc(p)}</p>`).join('');
    const galImgs = [0,1,2,3,4].map((i,n) => `<div class="gi g${n+1}"><img src="${esc(imgs[i])}" alt=""></div>`).join('');
    const featHTML = feats.length ? feats.map(fg => `<div class="fg"><p class="fgt">${esc(fg.title)}</p><ul class="fl">${fg.items.map(it => `<li>${esc(it)}</li>`).join('')}</ul></div>`).join('') : '';
    const nearbyHTML = nearby.map(n => `<li><span>${esc(n.k)}</span><span>${esc(n.v)}</span></li>`).join('');
    const acresStat = s.acres ? `<div class="hs"><span class="hsv">${esc(s.acres)}</span><span class="hsl">Acres</span></div>` : '';
    return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>${esc(s.address)} — ${esc(s.brokerage)}</title>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300&family=Jost:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}:root{--w:#FAFAF8;--b:#111110;--g1:#EFEFEF;--g2:#CCCCCC;--g4:#888888;--g6:#444444;--sf:'Cormorant Garamond',Georgia,serif;--ss:'Jost',sans-serif}html{scroll-behavior:smooth}body{background:var(--w);color:var(--b);font-family:var(--ss)}section{padding:80px 0}.ct{max-width:1100px;margin:0 auto;padding:0 48px}.sl{font-size:13px;letter-spacing:.25em;text-transform:uppercase;color:var(--g4);margin-bottom:18px;font-weight:700}.st{font-family:var(--sf);font-size:clamp(36px,4vw,56px);font-weight:700;line-height:1.1}.dv-line{width:50px;height:3px;background:var(--g2);margin:22px 0}.hero{position:relative;height:85vh;min-height:600px;overflow:hidden;display:flex;align-items:flex-end}.hi{position:absolute;inset:0;background:url('${esc(imgs[0])}') center/cover}.ho{position:absolute;inset:0;background:linear-gradient(to top,rgba(10,10,9,.7) 0%,transparent 60%)}.hc{position:relative;z-index:2;padding:0 48px 56px;width:100%}.ha{font-family:var(--sf);font-size:clamp(42px,5vw,72px);font-weight:700;color:#fff;line-height:1.1;margin-bottom:24px}.hs-wrap{display:flex;flex-wrap:wrap}.hs{padding:14px 28px;border:1px solid rgba(255,255,255,.2);text-align:center}.hsv{font-family:var(--sf);font-size:30px;font-weight:700;color:#fff;display:block}.hsl{font-size:12px;letter-spacing:.15em;text-transform:uppercase;color:rgba(255,255,255,.75);margin-top:4px;display:block}.hp{font-family:var(--sf);font-size:clamp(24px,3vw,36px);font-weight:700;color:#fff;margin-top:22px}.og{display:grid;grid-template-columns:1fr 1fr;gap:60px;margin-top:48px}.ot p{font-size:17px;line-height:1.8;color:var(--g6);margin-bottom:18px}.oa{border-left:1px solid var(--g2);padding-left:40px}.od{display:flex;justify-content:space-between;padding:14px 0;border-bottom:1px solid var(--g2)}.od:first-child{border-top:1px solid var(--g2)}.dk{font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:var(--g4);font-weight:700}.dv{font-family:var(--sf);font-size:20px;font-weight:700}.gal{background:var(--g1);padding:60px 0}.gg{display:grid;grid-template-columns:repeat(12,1fr);grid-template-rows:300px 220px;gap:4px;padding:0 48px}.gi{overflow:hidden}.gi img{width:100%;height:100%;object-fit:cover}.g1{grid-column:1/8;grid-row:1}.g2{grid-column:8/13;grid-row:1}.g3{grid-column:1/5;grid-row:2}.g4{grid-column:5/9;grid-row:2}.g5{grid-column:9/13;grid-row:2}.feat{background:var(--w)}.fg-wrap{display:grid;grid-template-columns:repeat(3,1fr);margin-top:48px;border:1px solid var(--g2)}.fg{padding:32px;border-right:1px solid var(--g2)}.fg:last-child{border-right:none}.fgt{font-size:13px;letter-spacing:.18em;text-transform:uppercase;margin-bottom:20px;font-weight:700}.fl{list-style:none}.fl li{font-size:16px;color:#333;line-height:1.6;padding:9px 0;border-bottom:1px solid var(--g1);display:flex;align-items:center;gap:10px}.fl li::before{content:'';width:5px;height:5px;border-radius:50%;background:var(--g4);flex-shrink:0}.nb{list-style:none}.nb li{display:flex;justify-content:space-between;padding:13px 0;border-bottom:1px solid var(--g2);font-size:16px}.nb li span:first-child{color:var(--g6);font-weight:600}.nb li span:last-child{font-family:var(--sf);font-size:18px;font-weight:700}.con{background:var(--b);padding:80px 0}.con .ct{color:#fff}.an{font-family:var(--sf);font-size:28px;font-weight:700;color:#fff;margin-bottom:6px}footer{background:var(--b);border-top:1px solid rgba(255,255,255,.07);padding:28px 48px;display:flex;justify-content:space-between}footer p{font-size:13px;color:rgba(255,255,255,.4)}@media(max-width:900px){.og{grid-template-columns:1fr;gap:32px}.oa{border-left:none;border-top:1px solid var(--g2);padding:24px 0 0}.gg{grid-template-columns:1fr 1fr;grid-template-rows:repeat(3,180px);padding:0 24px}.g1{grid-column:1/3;grid-row:1}.g2{grid-column:1;grid-row:2}.g3{grid-column:2;grid-row:2}.g4{grid-column:1;grid-row:3}.g5{grid-column:2;grid-row:3}.fg-wrap{grid-template-columns:1fr}footer{flex-direction:column;gap:8px;text-align:center}}</style></head><body>
<section class="hero"><div class="hi"></div><div class="ho"></div><div class="hc"><p style="font-size:13px;letter-spacing:.25em;text-transform:uppercase;color:rgba(255,255,255,.7);margin-bottom:14px;font-weight:700">Exclusive Listing</p><h1 class="ha">${esc(s.address)}<br>${esc(s.city)}, ${esc(s.state)}</h1><div class="hs-wrap"><div class="hs"><span class="hsv">${esc(s.beds)}</span><span class="hsl">Bedrooms</span></div><div class="hs"><span class="hsv">${esc(s.baths)}</span><span class="hsl">Bathrooms</span></div><div class="hs"><span class="hsv">${esc(s.sqft)}</span><span class="hsl">Sq. Ft.</span></div>${acresStat}</div><p class="hp">${esc(s.price)}</p></div></section>
<section><div class="ct"><p class="sl">The Residence</p><h2 class="st">Refined Living in ${esc(s.city)}</h2><div class="dv-line"></div><div class="og"><div class="ot">${descHTML}</div><div class="oa">${detailRows}</div></div></div></section>
<section class="gal"><div style="padding:0 48px;margin-bottom:36px"><p class="sl">Photography</p><h2 class="st">The Detail</h2></div><div class="gg">${galImgs}</div></section>
${feats.length ? `<section class="feat"><div class="ct"><p class="sl">Highlights</p><h2 class="st">Exceptional Features</h2><div class="dv-line"></div><div class="fg-wrap">${featHTML}</div></div></section>` : ''}
<section style="background:var(--g1)"><div class="ct"><p class="sl">Location</p><h2 class="st">${esc(s.neighborhoodName)}</h2><div class="dv-line"></div>${s.neighborhood ? `<p style="font-size:17px;line-height:1.8;color:var(--g6);margin-top:24px">${esc(s.neighborhood)}</p>` : ''}${nearbyHTML ? `<ul class="nb" style="margin-top:24px">${nearbyHTML}</ul>` : ''}</div></section>
<section class="con"><div class="ct"><p class="sl" style="color:rgba(255,255,255,.5)">Contact</p><p class="an">${esc(s.agentName)}</p><p style="font-size:13px;color:rgba(255,255,255,.5);margin-top:4px">${esc(s.brokerage)}${s.agentDre ? ' · ' + esc(s.agentDre) : ''}</p>${s.agentPhone ? `<p style="margin-top:16px;color:rgba(255,255,255,.7)">${esc(s.agentPhone)}</p>` : ''}${s.agentEmail ? `<p style="color:rgba(255,255,255,.7)">${esc(s.agentEmail)}</p>` : ''}</div></section>
<footer><p>© ${new Date().getFullYear()} ${esc(s.brokerage)} · All Rights Reserved</p></footer></body></html>`;
  };

  // ─── Build Dev HTML ───
  const buildDevHTML = () => {
    const d = dev;
    const priceRange = d.priceTo ? `${esc(d.priceFrom)} – ${esc(d.priceTo)}` : esc(d.priceFrom);
    const stats = [d.totalLots ? `<strong>${esc(d.totalLots)}</strong> Total Lots` : '', d.available ? `<strong>${esc(d.available)}</strong> Available` : '', d.completion ? `Est. <strong>${esc(d.completion)}</strong>` : ''].filter(Boolean).join(' &nbsp;·&nbsp; ');
    const f1 = d.feat1.split('\n').filter(Boolean).map(f => `<li>${esc(f)}</li>`).join('');
    const f2 = d.feat2.split('\n').filter(Boolean).map(f => `<li>${esc(f)}</li>`).join('');
    const nbHTML = d.nearby.filter(n => n.k).map(n => `<li><span>${esc(n.k)}</span><span>${esc(n.v)}</span></li>`).join('');
    const hero = d.heroImage || DEV_HERO_FB;
    const statusClr = {'Available':'#4ade80','Reserved':'#facc15','Sold':'#f87171','Coming Soon':'#94a3b8'};
    const lotCards = lots.map((lot, idx) => {
      const imgs = lot.images.map((im, i) => im || LOT_FB[i % LOT_FB.length]);
      const c = statusClr[lot.status] || '#94a3b8';
      const specs = [lot.beds ? `${esc(lot.beds)} Bed` : '', lot.baths ? `${esc(lot.baths)} Bath` : '', lot.sqft ? `${esc(lot.sqft)} SF` : ''].filter(Boolean).join(' · ');
      const featsH = lot.feats ? lot.feats.split('\n').filter(Boolean).map(f => `<span style="display:inline-block;font-size:13px;background:#f0f0ee;padding:5px 12px;border-radius:2px;margin:2px">${esc(f)}</span>`).join(' ') : '';
      return `<div style="background:#fff;margin-bottom:2px"><div style="height:260px;overflow:hidden;position:relative"><img src="${esc(imgs[0])}" style="width:100%;height:100%;object-fit:cover" alt=""><span style="position:absolute;top:12px;right:12px;font-size:11px;letter-spacing:.12em;text-transform:uppercase;padding:4px 10px;border-radius:2px;font-weight:700;background:${c}20;color:${c};border:1px solid ${c}40">${esc(lot.status)}</span></div><div style="display:grid;grid-template-columns:repeat(4,1fr);gap:2px;height:64px">${imgs.slice(0,4).map(im => `<div style="overflow:hidden"><img src="${esc(im)}" style="width:100%;height:100%;object-fit:cover" alt=""></div>`).join('')}</div><div style="padding:22px 26px 28px"><div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px"><div><h3 style="font-family:'Cormorant Garamond',serif;font-size:24px;font-weight:700">${esc(lot.addr || `Lot ${idx+1}`)}</h3><div style="font-size:14px;color:#666;margin-top:4px">${specs}</div></div><div style="font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:700;white-space:nowrap">${esc(lot.price || 'Price on Request')}</div></div>${lot.desc ? `<p style="font-size:16px;line-height:1.7;color:#444;margin-bottom:14px">${esc(lot.desc)}</p>` : ''}${featsH ? `<div style="margin-bottom:16px">${featsH}</div>` : ''}</div></div>`;
    }).join('');
    return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>${esc(d.name)} — ${esc(d.brokerage)}</title>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300&family=Jost:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}:root{--w:#FAFAF8;--b:#111110;--g1:#EFEFEF;--g2:#CCCCCC;--g4:#888888;--g6:#444444;--sf:'Cormorant Garamond',Georgia,serif;--ss:'Jost',sans-serif}html{scroll-behavior:smooth}body{background:var(--w);color:var(--b);font-family:var(--ss)}section{padding:80px 0}.ct{max-width:1100px;margin:0 auto;padding:0 48px}.sl{font-size:13px;letter-spacing:.25em;text-transform:uppercase;color:var(--g4);margin-bottom:18px;font-weight:700}.st{font-family:var(--sf);font-size:clamp(36px,4vw,56px);font-weight:700;line-height:1.1}.dv-line{width:50px;height:3px;background:var(--g2);margin:22px 0}.hero{position:relative;height:80vh;min-height:550px;overflow:hidden;display:flex;align-items:flex-end}.hi{position:absolute;inset:0;background:url('${esc(hero)}') center/cover}.ho{position:absolute;inset:0;background:linear-gradient(to top,rgba(8,8,7,.8) 0%,transparent 55%)}.hc{position:relative;z-index:2;padding:0 56px 60px;width:100%}.nb{list-style:none}.nb li{display:flex;justify-content:space-between;padding:13px 0;border-bottom:1px solid var(--g2);font-size:16px}.nb li span:first-child{color:var(--g6);font-weight:600}.nb li span:last-child{font-family:var(--sf);font-size:18px;font-weight:700}.con{background:var(--b);padding:80px 0}.con .ct{color:#fff}footer{background:var(--b);border-top:1px solid rgba(255,255,255,.07);padding:28px 48px}footer p{font-size:13px;color:rgba(255,255,255,.4)}@media(max-width:900px){.ct{padding:0 24px}footer{text-align:center}}</style></head><body>
<section class="hero"><div class="hi"></div><div class="ho"></div><div class="hc"><p style="font-size:13px;letter-spacing:.25em;text-transform:uppercase;color:rgba(255,255,255,.7);margin-bottom:14px;font-weight:700">A Next Wave Development</p><h1 style="font-family:var(--sf);font-size:clamp(48px,6vw,88px);font-weight:700;color:#fff;line-height:1;margin-bottom:10px">${esc(d.name)}</h1><p style="font-size:16px;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.7);margin-bottom:28px">${esc(d.city)}, ${esc(d.state)}</p>${stats ? `<p style="font-size:15px;color:rgba(255,255,255,.8);margin-bottom:22px">${stats}</p>` : ''}<p style="font-family:var(--sf);font-size:clamp(24px,2.5vw,36px);font-weight:700;color:#fff">${priceRange}</p></div></section>
<section><div class="ct"><p class="sl">The Development</p><h2 class="st">${esc(d.name)}</h2><div class="dv-line"></div>${d.description ? d.description.split(/\n\n+/).map(p => `<p style="font-size:17px;line-height:1.8;color:var(--g6);margin-top:16px">${esc(p)}</p>`).join('') : ''}${(f1||f2) ? `<div style="display:grid;grid-template-columns:1fr 1fr;border:1px solid var(--g2);margin-top:40px"><div style="padding:28px;border-right:1px solid var(--g2)"><p style="font-size:13px;letter-spacing:.18em;text-transform:uppercase;font-weight:700;margin-bottom:16px">${esc(d.featTitle1)}</p><ul style="list-style:none">${f1}</ul></div><div style="padding:28px"><p style="font-size:13px;letter-spacing:.18em;text-transform:uppercase;font-weight:700;margin-bottom:16px">${esc(d.featTitle2)}</p><ul style="list-style:none">${f2}</ul></div></div>` : ''}</div></section>
${lotCards ? `<section style="background:var(--g1)"><div class="ct"><p class="sl">Available Residences</p><h2 class="st">The Collection</h2><div class="dv-line"></div></div><div style="max-width:1100px;margin:0 auto;padding:0 48px;display:grid;grid-template-columns:repeat(auto-fill,minmax(440px,1fr));gap:2px">${lotCards}</div></section>` : ''}
${nbHTML ? `<section><div class="ct"><p class="sl">Location</p><h2 class="st">${esc(d.city)}, ${esc(d.state)}</h2><div class="dv-line"></div>${d.neighborhood ? `<p style="font-size:17px;line-height:1.8;color:var(--g6);margin-bottom:24px">${esc(d.neighborhood)}</p>` : ''}<ul class="nb">${nbHTML}</ul></div></section>` : ''}
<section class="con"><div class="ct"><p class="sl" style="color:rgba(255,255,255,.5)">Sales Inquiries</p><p style="font-family:var(--sf);font-size:28px;font-weight:700;color:#fff">${esc(d.agentName)}</p><p style="font-size:13px;color:rgba(255,255,255,.5);margin-top:4px">${esc(d.agentTitle)} · ${esc(d.brokerage)}</p>${d.agentPhone ? `<p style="margin-top:14px;color:rgba(255,255,255,.7)">${esc(d.agentPhone)}</p>` : ''}${d.agentEmail ? `<p style="color:rgba(255,255,255,.7)">${esc(d.agentEmail)}</p>` : ''}</div></section>
<footer><p>© ${new Date().getFullYear()} ${esc(d.brokerage)} · All Rights Reserved</p></footer></body></html>`;
  };

  const generate = () => {
    const html = tab === "single" ? buildSingleHTML() : buildDevHTML();
    const name = tab === "single" ? (single.address || "property") : (dev.name || "development");
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    setPreviewHtml(html);
    setPreviewSlug(slug);
    setGenerated(p => [{html, label: name, type: tab, slug}, ...p]);
  };

  const downloadHtml = (html, slug) => {
    let b64 = btoa(unescape(encodeURIComponent(html)));
    const a = document.createElement("a");
    a.href = "data:text/html;base64," + b64;
    a.download = slug + ".html";
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  };

  const handleSave = () => {
    if (!previewHtml) return;
    onSave({
      id: crypto.randomUUID(), created_at: new Date().toISOString(), tool_id: "website",
      label: `${tab === "single" ? "Single Property" : "Development"} — ${tab === "single" ? single.address : dev.name}`,
      data: { type: tab, slug: previewSlug, htmlLength: previewHtml.length },
    });
  };

  // ─── Shared form helpers ───
  const fld = (label, value, onChange, placeholder="", type="text") => (
    <div style={{ marginBottom: 10 }}>
      <label style={{ display:"block",fontSize:10,letterSpacing:"0.18em",textTransform:"uppercase",color:C.textMuted,fontWeight:600,marginBottom:5 }}>{label}</label>
      {type === "textarea" ? (
        <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          style={{ width:"100%",padding:"8px 11px",background:C.surfaceAlt,border:`1px solid ${C.border}`,borderRadius:4,color:C.text,fontSize:13,fontFamily:font,outline:"none",resize:"vertical",minHeight:68 }} />
      ) : (
        <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          style={{ width:"100%",padding:"8px 11px",background:C.surfaceAlt,border:`1px solid ${C.border}`,borderRadius:4,color:C.text,fontSize:13,fontFamily:font,outline:"none" }} />
      )}
    </div>
  );
  const row2 = (a, b) => <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10 }}>{a}{b}</div>;
  const secTitle = (t) => <div style={{ fontSize:10,letterSpacing:"0.3em",textTransform:"uppercase",color:C.accent,marginBottom:12,fontWeight:600,display:"flex",alignItems:"center",gap:10 }}>{t}<div style={{ flex:1,height:1,background:C.border }} /></div>;

  const formPanel = { background:C.surface, borderRight:`1px solid ${C.border}`, overflowY:"auto", padding:"22px 28px 50px", maxHeight:"calc(100vh - 200px)" };
  const previewPanel = { flex:1, background:"#E8EDF4", padding:22, overflowY:"auto", maxHeight:"calc(100vh - 200px)" };
  const tabBtn = (t, label) => (
    <button onClick={() => setTab(t)} style={{
      padding:"9px 22px",fontSize:11,fontWeight:500,letterSpacing:"0.18em",textTransform:"uppercase",
      cursor:"pointer",background:"transparent",border:"none",borderBottom: tab===t ? `2px solid ${C.accent}` : "2px solid transparent",
      color: tab===t ? C.accent : C.textMuted,fontFamily:font,transition:"all 0.2s",
    }}>{label}</button>
  );

  return (
    <div>
      {/* Header */}
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:0,flexWrap:"wrap",gap:8 }}>
        <div style={{ display:"flex",alignItems:"center",gap:12 }}>
          <button onClick={onClose} style={{ padding:"8px 16px",borderRadius:8,border:`1px solid ${C.border}`,background:C.surface,color:C.textMid,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:font }}>← Back</button>
          <div><div style={{ fontSize:18,fontWeight:700,color:C.text }}>Website Generator</div><div style={{ fontSize:12,color:C.textMuted }}>{info.name}</div></div>
        </div>
        <div style={{ display:"flex",gap:8 }}>
          {previewHtml && <button onClick={() => downloadHtml(previewHtml, previewSlug)} style={{ padding:"10px 20px",borderRadius:8,border:`1px solid ${C.border}`,background:C.surface,color:C.textMid,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:font }}>Download HTML</button>}
          {previewHtml && <button onClick={handleSave} style={{ padding:"10px 20px",borderRadius:8,border:"none",background:C.accent,color:"#fff",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:font }}>Save to Project</button>}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display:"flex",borderBottom:`1px solid ${C.border}`,marginBottom:0 }}>
        {tabBtn("single","Single Property")}
        {tabBtn("dev","Development Landing")}
      </div>

      {/* Layout */}
      <div style={{ display:"grid",gridTemplateColumns:"480px 1fr",minHeight:500 }}>
        {/* Form */}
        <div style={formPanel}>
          {tab === "single" && (<>
            {secTitle("Property Info")}
            {fld("Address", single.address, v => sSet("address",v), "2847 Elmwood Dr")}
            {row2(fld("City",single.city,v=>sSet("city",v),"Burlington"), fld("State",single.state,v=>sSet("state",v),"NC"))}
            {row2(fld("Price",single.price,v=>sSet("price",v),"$219,000"), fld("Status",single.status,v=>sSet("status",v),"Active"))}
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:8 }}>
              {fld("Beds",single.beds,v=>sSet("beds",v),"4")}
              {fld("Baths",single.baths,v=>sSet("baths",v),"3")}
              {fld("Sq Ft",single.sqft,v=>sSet("sqft",v),"2,400")}
              {fld("Acres",single.acres,v=>sSet("acres",v),"")}
            </div>
            {secTitle("Description")}
            {fld("Overview","" + single.description,v=>sSet("description",v),"Property description...","textarea")}
            {fld("Neighborhood",single.neighborhood,v=>sSet("neighborhood",v),"","textarea")}
            {secTitle("Key Features")}
            {fld("Architecture (one per line)",single.feat1,v=>sSet("feat1",v),"","textarea")}
            {fld("Kitchen & Living (one per line)",single.feat2,v=>sSet("feat2",v),"","textarea")}
            {fld("Grounds (one per line)",single.feat3,v=>sSet("feat3",v),"","textarea")}
            {secTitle("Images (URLs)")}
            {single.images.map((im,i) => (
              <input key={i} value={im} onChange={e => { const imgs=[...single.images]; imgs[i]=e.target.value; sSet("images",imgs); }}
                placeholder={["Hero/Exterior","Living Room","Kitchen","Bedroom","Bathroom","Pool/Grounds"][i] + " URL"}
                style={{ width:"100%",padding:"6px 10px",background:C.surfaceAlt,border:`1px solid ${C.border}`,borderRadius:4,color:C.text,fontSize:11,fontFamily:font,outline:"none",marginBottom:6 }} />
            ))}
            {secTitle("Agent")}
            {row2(fld("Name",single.agentName,v=>sSet("agentName",v)), fld("License",single.agentDre,v=>sSet("agentDre",v)))}
            {row2(fld("Phone",single.agentPhone,v=>sSet("agentPhone",v)), fld("Email",single.agentEmail,v=>sSet("agentEmail",v)))}
            {fld("Brokerage",single.brokerage,v=>sSet("brokerage",v),"Next Wave")}
          </>)}

          {tab === "dev" && (<>
            {secTitle("Development Info")}
            {fld("Development Name",dev.name,v=>dSet("name",v),info.name||"The Elmwood Collection")}
            {row2(fld("City",dev.city,v=>dSet("city",v)), fld("State",dev.state,v=>dSet("state",v)))}
            {row2(fld("Price From",dev.priceFrom,v=>dSet("priceFrom",v)), fld("Price To",dev.priceTo,v=>dSet("priceTo",v)))}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
              {fld("Total Lots",dev.totalLots,v=>dSet("totalLots",v))}
              {fld("Available",dev.available,v=>dSet("available",v))}
              {fld("Completion",dev.completion,v=>dSet("completion",v))}
            </div>
            {secTitle("Hero Image")}
            {fld("Hero Image URL",dev.heroImage,v=>dSet("heroImage",v),"https://...")}
            {secTitle("Description")}
            {fld("Overview",dev.description,v=>dSet("description",v),"","textarea")}
            {fld("Neighborhood",dev.neighborhood,v=>dSet("neighborhood",v),"","textarea")}
            {secTitle("Community Features")}
            {row2(fld("Column 1 Title",dev.featTitle1,v=>dSet("featTitle1",v)), fld("Column 2 Title",dev.featTitle2,v=>dSet("featTitle2",v)))}
            {row2(fld("Column 1 (one/line)",dev.feat1,v=>dSet("feat1",v),"","textarea"), fld("Column 2 (one/line)",dev.feat2,v=>dSet("feat2",v),"","textarea"))}
            {secTitle("Nearby Places")}
            {dev.nearby.map((n,i) => (
              <div key={i} style={{display:"grid",gridTemplateColumns:"1fr 80px",gap:8,marginBottom:6}}>
                <input value={n.k} onChange={e => { const nb=[...dev.nearby]; nb[i]={...nb[i],k:e.target.value}; dSet("nearby",nb); }}
                  placeholder="Place" style={{ padding:"6px 10px",background:C.surfaceAlt,border:`1px solid ${C.border}`,borderRadius:4,color:C.text,fontSize:12,fontFamily:font,outline:"none" }} />
                <input value={n.v} onChange={e => { const nb=[...dev.nearby]; nb[i]={...nb[i],v:e.target.value}; dSet("nearby",nb); }}
                  placeholder="Time" style={{ padding:"6px 10px",background:C.surfaceAlt,border:`1px solid ${C.border}`,borderRadius:4,color:C.text,fontSize:12,fontFamily:font,outline:"none" }} />
              </div>
            ))}
            {secTitle("Sales Contact")}
            {row2(fld("Name",dev.agentName,v=>dSet("agentName",v)), fld("Title",dev.agentTitle,v=>dSet("agentTitle",v)))}
            {row2(fld("Phone",dev.agentPhone,v=>dSet("agentPhone",v)), fld("Email",dev.agentEmail,v=>dSet("agentEmail",v)))}
            {fld("Brokerage",dev.brokerage,v=>dSet("brokerage",v),"Next Wave")}

            {secTitle("Lots / Homes")}
            {lots.map((lot, idx) => (
              <div key={lot.id} style={{ background:C.surface,border:`1px solid ${C.border}`,borderRadius:4,marginBottom:8,overflow:"hidden" }}>
                <div onClick={() => toggleLot(lot.id)} style={{ display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 14px",cursor:"pointer",borderBottom: openLots[lot.id] ? `1px solid ${C.border}` : "none" }}>
                  <div><div style={{ fontSize:14,fontWeight:600 }}>Lot {idx+1}</div><div style={{ fontSize:11,color:C.textMuted }}>{lot.addr || lot.price || "Click to expand"}</div></div>
                  <span style={{ color:C.textMuted,transform:openLots[lot.id]?"rotate(180deg)":"none",transition:"transform 0.2s",display:"inline-block" }}>⌃</span>
                </div>
                {openLots[lot.id] && (
                  <div style={{ padding:14 }}>
                    {row2(fld("Address",lot.addr,v=>updateLot(lot.id,"addr",v)), fld("Price",lot.price,v=>updateLot(lot.id,"price",v)))}
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:6}}>
                      {fld("Beds",lot.beds,v=>updateLot(lot.id,"beds",v))}
                      {fld("Baths",lot.baths,v=>updateLot(lot.id,"baths",v))}
                      {fld("Sq Ft",lot.sqft,v=>updateLot(lot.id,"sqft",v))}
                      <div style={{marginBottom:10}}>
                        <label style={{display:"block",fontSize:10,letterSpacing:"0.18em",textTransform:"uppercase",color:C.textMuted,fontWeight:600,marginBottom:5}}>Status</label>
                        <select value={lot.status} onChange={e=>updateLot(lot.id,"status",e.target.value)} style={{width:"100%",padding:"8px 10px",background:C.surfaceAlt,border:`1px solid ${C.border}`,borderRadius:4,color:C.text,fontSize:12,fontFamily:font}}>
                          <option>Available</option><option>Reserved</option><option>Sold</option><option>Coming Soon</option>
                        </select>
                      </div>
                    </div>
                    {fld("Description",lot.desc,v=>updateLot(lot.id,"desc",v),"","textarea")}
                    {fld("Features (one/line)",lot.feats,v=>updateLot(lot.id,"feats",v),"","textarea")}
                    <div style={{fontSize:10,letterSpacing:"0.15em",textTransform:"uppercase",color:C.textMuted,fontWeight:600,marginBottom:6}}>Images (URLs)</div>
                    {lot.images.map((im,i) => (
                      <input key={i} value={im} onChange={e=>updateLotImg(lot.id,i,e.target.value)} placeholder={`Image ${i+1} URL`}
                        style={{width:"100%",padding:"5px 8px",background:C.surfaceAlt,border:`1px solid ${C.border}`,borderRadius:4,color:C.text,fontSize:11,fontFamily:font,outline:"none",marginBottom:4}} />
                    ))}
                    <button onClick={() => removeLot(lot.id)} style={{ marginTop:8,padding:"5px 12px",background:"transparent",border:`1px solid ${C.border}`,color:C.textMuted,fontSize:10,letterSpacing:"0.12em",textTransform:"uppercase",cursor:"pointer",borderRadius:4,fontFamily:font }}>Remove Lot</button>
                  </div>
                )}
              </div>
            ))}
            <button onClick={addLot} style={{ width:"100%",padding:10,background:"transparent",border:`1px dashed ${C.border}`,color:C.textMuted,fontSize:11,fontWeight:600,letterSpacing:"0.18em",textTransform:"uppercase",cursor:"pointer",borderRadius:4,fontFamily:font,marginTop:4 }}>+ Add Lot / Home</button>
          </>)}

          <button onClick={generate} style={{ width:"100%",marginTop:18,padding:14,background:C.accent,border:"none",color:"#fff",fontFamily:font,fontSize:12,fontWeight:600,letterSpacing:"0.2em",textTransform:"uppercase",cursor:"pointer",borderRadius:4 }}>
            ⚡ Generate {tab === "single" ? "Property" : "Development"} Website
          </button>
        </div>

        {/* Preview */}
        <div style={previewPanel}>
          <div style={{ fontSize:11,letterSpacing:"0.18em",textTransform:"uppercase",color:C.textMuted,fontWeight:600,marginBottom:14 }}>Live Preview</div>
          {!previewHtml ? (
            <div style={{ display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:300,gap:10 }}>
              <div style={{ fontSize:40,opacity:0.12 }}>🏛</div>
              <div style={{ fontSize:13,color:C.textMuted,textAlign:"center",lineHeight:1.6 }}>Your generated website will appear here.<br/>Fill in the form and click Generate.</div>
            </div>
          ) : (
            <div style={{ background:C.bg,border:`1px solid ${C.border}`,borderRadius:4,overflow:"hidden",boxShadow:"0 16px 48px rgba(0,0,0,0.08)" }}>
              <div style={{ background:C.surface,padding:"7px 12px",display:"flex",alignItems:"center",gap:5,borderBottom:`1px solid ${C.border}` }}>
                <div style={{ width:9,height:9,borderRadius:"50%",background:"#FF5F57" }} />
                <div style={{ width:9,height:9,borderRadius:"50%",background:"#FEBC2E" }} />
                <div style={{ width:9,height:9,borderRadius:"50%",background:"#28C840" }} />
                <div style={{ flex:1,background:C.surfaceAlt,borderRadius:2,padding:"3px 10px",fontSize:11,color:C.textMuted,marginLeft:6 }}>{previewSlug}.html</div>
              </div>
              <iframe ref={iframeRef} srcDoc={previewHtml} style={{ width:"100%",height:600,border:"none",display:"block" }} title="preview" />
            </div>
          )}
          {generated.length > 0 && (
            <div style={{ marginTop:18 }}>
              <div style={{ fontSize:10,letterSpacing:"0.2em",textTransform:"uppercase",color:C.textMuted,fontWeight:600,marginBottom:10 }}>Generated Sites</div>
              {generated.map((g, i) => (
                <div key={i} style={{ background:C.surface,border:`1px solid ${C.border}`,borderRadius:4,padding:"11px 14px",display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5 }}>
                  <div><div style={{ fontSize:14,fontWeight:600,color:C.text }}>{g.label}<span style={{ fontSize:9,letterSpacing:"0.12em",textTransform:"uppercase",padding:"2px 7px",borderRadius:2,marginLeft:7,background:g.type==="dev"?"rgba(100,180,255,0.13)":"rgba(59,139,202,0.1)",color:g.type==="dev"?"#4A6FA5":C.accent }}>{g.type==="dev"?"Development":"Single"}</span></div></div>
                  <div style={{ display:"flex",gap:6 }}>
                    <button onClick={() => { setPreviewHtml(g.html); setPreviewSlug(g.slug); }} style={{ padding:"5px 12px",fontSize:10,letterSpacing:"0.1em",textTransform:"uppercase",fontFamily:font,fontWeight:600,cursor:"pointer",borderRadius:4,background:"transparent",border:`1px solid ${C.border}`,color:C.textMuted }}>Preview</button>
                    <button onClick={() => downloadHtml(g.html, g.slug)} style={{ padding:"5px 12px",fontSize:10,letterSpacing:"0.1em",textTransform:"uppercase",fontFamily:font,fontWeight:600,cursor:"pointer",borderRadius:4,background:C.accent,border:`1px solid ${C.accent}`,color:"#fff" }}>Download</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// @tools/scheduler — Development Scheduler
// Future: extract to src/tools/scheduler/DevelopmentScheduler.tsx
// Contract: { project, onSave, onClose } → saves to project.tool_outputs.schedules
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const PHASE_COLORS = ["#3B8BCA", "#5B8C6A", "#D4913B", "#8B6CC1", "#C4564B"];

// ─── Utility Functions ───
const fmt = (n) => "$" + Math.round(n).toLocaleString("en-US");
const fmtK = (n) => n >= 1_000_000 ? "$" + (n / 1_000_000).toFixed(1) + "M" : "$" + Math.round(n / 1_000).toLocaleString() + "K";
const schedMonthLabel = (m) => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return months[(m - 1) % 12];
};
const monthYearLabel = (m, startYear = 2025) => {
  const yr = startYear + Math.floor((m - 1) / 12);
  return `${schedMonthLabel(m)} '${String(yr).slice(2)}`;
};

// ─── Sample Data ───
const createMeadowCreek = () => ({
  id: "meadow-creek-village",
  name: "Meadow Creek Village",
  location: "Burlington, NC",
  totalLots: 64,
  targetMonths: 24,
  startYear: 2025,
  phases: [
    {
      id: "p1",
      name: "Land Acquisition",
      startMonth: 1,
      endMonth: 1,
      color: PHASE_COLORS[0],
      lineItems: [
        { id: "li1", name: "Land Purchase", cost: 1200000, startMonth: 1, duration: 1 },
        { id: "li2", name: "Earnest Money & Due Diligence", cost: 85000, startMonth: 1, duration: 1 },
        { id: "li3", name: "Closing Costs & Title", cost: 65000, startMonth: 1, duration: 1 },
      ],
    },
    {
      id: "p2",
      name: "Entitlement & Permitting",
      startMonth: 2,
      endMonth: 4,
      color: PHASE_COLORS[1],
      lineItems: [
        { id: "li4", name: "Rezoning & Platting", cost: 95000, startMonth: 2, duration: 2 },
        { id: "li5", name: "Civil Engineering & Survey", cost: 120000, startMonth: 2, duration: 3 },
        { id: "li6", name: "Permit Fees & Impact Fees", cost: 70000, startMonth: 3, duration: 2 },
      ],
    },
    {
      id: "p3",
      name: "Site Work & Infrastructure",
      startMonth: 4,
      endMonth: 10,
      color: PHASE_COLORS[2],
      lineItems: [
        { id: "li7", name: "Mass Grading", cost: 680000, startMonth: 4, duration: 3 },
        { id: "li8", name: "Roads & Paving", cost: 820000, startMonth: 5, duration: 5 },
        { id: "li9", name: "Water & Sewer Utilities", cost: 640000, startMonth: 5, duration: 4 },
        { id: "li10", name: "Electrical & Gas Infrastructure", cost: 380000, startMonth: 6, duration: 4 },
        { id: "li11", name: "Stormwater Management", cost: 280000, startMonth: 7, duration: 3 },
      ],
    },
    {
      id: "p4",
      name: "Vertical Construction",
      startMonth: 8,
      endMonth: 21,
      color: PHASE_COLORS[3],
      isBatched: true,
      batchConfig: { batchSize: 16, batchCount: 4, staggerMonths: 3, durationPerBatch: 4, costPerUnit: 52000 },
      lineItems: [
        { id: "li12", name: "Batch 1 — Lots 1–16 (Foundation, Set, Finish)", cost: 832000, startMonth: 8, duration: 4 },
        { id: "li13", name: "Batch 2 — Lots 17–32", cost: 832000, startMonth: 11, duration: 4 },
        { id: "li14", name: "Batch 3 — Lots 33–48", cost: 832000, startMonth: 14, duration: 4 },
        { id: "li15", name: "Batch 4 — Lots 49–64", cost: 832000, startMonth: 17, duration: 4 },
      ],
    },
    {
      id: "p5",
      name: "Sales & Closeout",
      startMonth: 10,
      endMonth: 24,
      color: PHASE_COLORS[4],
      lineItems: [
        { id: "li16", name: "Marketing & Sales Office", cost: 145000, startMonth: 10, duration: 14 },
        { id: "li17", name: "Model Home Costs", cost: 78000, startMonth: 10, duration: 2 },
        { id: "li18", name: "Closing & Title Fees", cost: 96000, startMonth: 14, duration: 10 },
        { id: "li19", name: "Warranty Reserves", cost: 118000, startMonth: 16, duration: 8 },
      ],
    },
  ],
});

// ─── Compute capital flows from project ───
function computeCapitalData(project) {
  const maxMonth = project.targetMonths;
  const monthly = Array.from({ length: maxMonth }, () => 0);
  const phaseMonthly = {};

  project.phases.forEach((phase) => {
    phaseMonthly[phase.id] = Array.from({ length: maxMonth }, () => 0);
    phase.lineItems.forEach((li) => {
      const perMonth = li.cost / li.duration;
      for (let m = li.startMonth; m < li.startMonth + li.duration && m <= maxMonth; m++) {
        monthly[m - 1] += perMonth;
        phaseMonthly[phase.id][m - 1] += perMonth;
      }
    });
  });

  let cumulative = 0;
  let peak = 0;
  const data = monthly.map((val, i) => {
    cumulative += val;
    if (cumulative > peak) peak = cumulative;
    return {
      month: i + 1,
      label: monthYearLabel(i + 1, project.startYear),
      monthly: Math.round(val),
      cumulative: Math.round(cumulative),
    };
  });

  project.phases.forEach((phase) => {
    data.forEach((d, i) => {
      d[`phase_${phase.id}`] = Math.round(phaseMonthly[phase.id][i]);
    });
  });

  const totalCost = project.phases.reduce((s, p) => s + p.lineItems.reduce((s2, li) => s2 + li.cost, 0), 0);
  return { data, totalCost, peakCapital: peak, monthly, phaseMonthly };
}

// ─── Styled Components ───
const Card = ({ children, style, onClick }) => (
  <div onClick={onClick} style={{ background: C.surface, borderRadius: "10px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", padding: "20px", ...style }}>
    {children}
  </div>
);

const Badge = ({ children, color = C.accent }) => (
  <span style={{ display: "inline-block", fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20, background: color + "18", color, letterSpacing: "0.02em" }}>
    {children}
  </span>
);

const TabBar = ({ tabs, active, onChange }) => (
  <div style={{ display: "flex", gap: 2, background: C.borderLight, borderRadius: 8, padding: 3 }}>
    {tabs.map((t) => (
      <button key={t.id} onClick={() => onChange(t.id)} style={{
        flex: 1, padding: "9px 16px", border: "none", borderRadius: 6, cursor: "pointer",
        background: active === t.id ? C.surface : "transparent", color: active === t.id ? C.text : C.textMuted,
        fontWeight: active === t.id ? 600 : 500, fontSize: 13, fontFamily: font,
        boxShadow: active === t.id ? "0 1px 3px rgba(0,0,0,0.08)" : "none", transition: "all 0.2s",
      }}>{t.label}</button>
    ))}
  </div>
);

const InputField = ({ label, value, onChange, type = "text", prefix, suffix, width }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 4, width: width || "auto" }}>
    {label && <label style={{ fontSize: 11, fontWeight: 600, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</label>}
    <div style={{ display: "flex", alignItems: "center", border: `1px solid ${C.border}`, borderRadius: "6px", overflow: "hidden", background: C.surface }}>
      {prefix && <span style={{ padding: "7px 0 7px 10px", color: C.textMuted, fontSize: 13 }}>{prefix}</span>}
      <input type={type} value={value} onChange={onChange} style={{
        border: "none", outline: "none", padding: "7px 10px", fontSize: 13, fontFamily: font,
        background: "transparent", color: C.text, width: "100%",
      }} />
      {suffix && <span style={{ padding: "7px 10px 7px 0", color: C.textMuted, fontSize: 12 }}>{suffix}</span>}
    </div>
  </div>
);

// ─── Phase Editor Modal ───
function PhaseEditor({ phase, onSave, onClose, phaseIndex }) {
  const [edited, setEdited] = useState(JSON.parse(JSON.stringify(phase)));

  const updateLineItem = (idx, field, value) => {
    const items = [...edited.lineItems];
    items[idx] = { ...items[idx], [field]: field === "name" ? value : Number(value) || 0 };
    setEdited({ ...edited, lineItems: items });
  };

  const addLineItem = () => {
    setEdited({
      ...edited,
      lineItems: [...edited.lineItems, { id: `li_new_${Date.now()}`, name: "New Item", cost: 0, startMonth: edited.startMonth, duration: 1 }],
    });
  };

  const removeLineItem = (idx) => {
    setEdited({ ...edited, lineItems: edited.lineItems.filter((_, i) => i !== idx) });
  };

  const phaseTotal = edited.lineItems.reduce((s, li) => s + li.cost, 0);

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, backdropFilter: "blur(3px)" }}>
      <div style={{ background: C.surface, borderRadius: 14, width: "min(680px, 95vw)", maxHeight: "85vh", overflow: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
        <div style={{ padding: "20px 24px", borderBottom: `1px solid ${C.borderLight}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: C.text }}>Edit Phase</h3>
            <p style={{ margin: "2px 0 0", fontSize: 12, color: C.textMuted }}>Modify phase details and line items</p>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: C.textMuted, padding: 4 }}>✕</button>
        </div>
        <div style={{ padding: 24 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 20 }}>
            <InputField label="Phase Name" value={edited.name} onChange={(e) => setEdited({ ...edited, name: e.target.value })} width="100%" />
            <InputField label="Start Month" type="number" value={edited.startMonth} onChange={(e) => setEdited({ ...edited, startMonth: Number(e.target.value) })} />
            <InputField label="End Month" type="number" value={edited.endMonth} onChange={(e) => setEdited({ ...edited, endMonth: Number(e.target.value) })} />
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <h4 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: C.text }}>Line Items</h4>
            <span style={{ fontSize: 13, fontWeight: 600, color: C.accent }}>Total: {$f(phaseTotal)}</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {edited.lineItems.map((li, idx) => (
              <div key={li.id} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 0.6fr 0.6fr 32px", gap: 8, alignItems: "end" }}>
                <InputField label={idx === 0 ? "Name" : undefined} value={li.name} onChange={(e) => updateLineItem(idx, "name", e.target.value)} />
                <InputField label={idx === 0 ? "Cost" : undefined} prefix="$" type="number" value={li.cost} onChange={(e) => updateLineItem(idx, "cost", e.target.value)} />
                <InputField label={idx === 0 ? "Start Mo." : undefined} type="number" value={li.startMonth} onChange={(e) => updateLineItem(idx, "startMonth", e.target.value)} />
                <InputField label={idx === 0 ? "Duration" : undefined} type="number" value={li.duration} suffix="mo" onChange={(e) => updateLineItem(idx, "duration", e.target.value)} />
                <button onClick={() => removeLineItem(idx)} style={{
                  background: "none", border: "none", color: C.negative, cursor: "pointer", fontSize: 16, padding: "6px 0", marginBottom: 1,
                }}>×</button>
              </div>
            ))}
          </div>

          <button onClick={addLineItem} style={{
            marginTop: 12, padding: "8px 16px", border: `1px dashed ${C.border}`, borderRadius: "6px",
            background: "transparent", color: C.accent, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: font, width: "100%",
          }}>+ Add Line Item</button>
        </div>

        <div style={{ padding: "16px 24px", borderTop: `1px solid ${C.borderLight}`, display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ padding: "9px 20px", border: `1px solid ${C.border}`, borderRadius: "6px", background: C.surface, color: C.text, fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: font }}>Cancel</button>
          <button onClick={() => onSave(edited)} style={{ padding: "9px 24px", border: "none", borderRadius: "6px", background: C.accent, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: font }}>Save Changes</button>
        </div>
      </div>
    </div>
  );
}

// ─── Gantt Timeline ───
function GanttTimeline({ project }) {
  const maxMonth = project.targetMonths;
  const months = Array.from({ length: maxMonth }, (_, i) => i + 1);

  return (
    <div style={{ overflowX: "auto" }}>
      <div style={{ minWidth: Math.max(700, maxMonth * 44) }}>
        {/* Month headers */}
        <div style={{ display: "flex", marginLeft: 180, marginBottom: 6 }}>
          {months.map((m) => (
            <div key={m} style={{ flex: 1, textAlign: "center", fontSize: 10, fontWeight: 600, color: C.textMuted, minWidth: 36 }}>
              {monthYearLabel(m, project.startYear)}
            </div>
          ))}
        </div>

        {/* Phase bars */}
        {project.phases.map((phase, pi) => {
          const startPct = ((phase.startMonth - 1) / maxMonth) * 100;
          const widthPct = ((phase.endMonth - phase.startMonth + 1) / maxMonth) * 100;
          const phaseTotal = phase.lineItems.reduce((s, li) => s + li.cost, 0);

          return (
            <div key={phase.id} style={{ display: "flex", alignItems: "center", marginBottom: 6, height: 44 }}>
              <div style={{ width: 180, flexShrink: 0, paddingRight: 14 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: C.text, lineHeight: 1.2 }}>{phase.name}</div>
                <div style={{ fontSize: 10, color: C.textMuted }}>{$f(phaseTotal)}</div>
              </div>
              <div style={{ flex: 1, position: "relative", height: "100%", background: C.surfaceAlt, borderRadius: 6 }}>
                {/* Grid lines */}
                {months.map((m) => (
                  <div key={m} style={{ position: "absolute", left: `${((m - 1) / maxMonth) * 100}%`, top: 0, bottom: 0, width: 1, background: C.borderLight }} />
                ))}
                {/* Phase bar */}
                <div style={{
                  position: "absolute", left: `${startPct}%`, width: `${widthPct}%`,
                  top: 6, bottom: 6, background: phase.color + "22", border: `1.5px solid ${phase.color}`,
                  borderRadius: 5, display: "flex", alignItems: "center", paddingLeft: 8, overflow: "hidden",
                }}>
                  <span style={{ fontSize: 10, fontWeight: 600, color: phase.color, whiteSpace: "nowrap" }}>
                    Mo {phase.startMonth}–{phase.endMonth}
                  </span>
                </div>
                {/* Line item sub-bars */}
                {phase.lineItems.map((li, idx) => {
                  const liStart = ((li.startMonth - 1) / maxMonth) * 100;
                  const liWidth = (li.duration / maxMonth) * 100;
                  return (
                    <div key={li.id} style={{
                      position: "absolute", left: `${liStart}%`, width: `${liWidth}%`,
                      bottom: 3, height: 3, background: phase.color, borderRadius: 2, opacity: 0.5,
                    }} />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Capital S-Curve Chart ───
function CapitalCurve({ capitalData, project }) {
  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 14px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)", fontSize: 12 }}>
        <div style={{ fontWeight: 700, marginBottom: 6, color: C.text }}>{payload[0]?.payload?.label}</div>
        {payload.map((p, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: 20, marginBottom: 2 }}>
            <span style={{ color: p.color }}>{p.name}</span>
            <span style={{ fontWeight: 600, color: C.text }}>{$f(p.value)}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={capitalData.data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
        <defs>
          <linearGradient id="cumGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={C.accent} stopOpacity={0.15} />
            <stop offset="95%" stopColor={C.accent} stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={C.borderLight} />
        <XAxis dataKey="label" tick={{ fontSize: 10, fill: C.textMuted }} tickLine={false} axisLine={{ stroke: C.borderLight }} interval={1} />
        <YAxis tickFormatter={(v) => $(v)} tick={{ fontSize: 10, fill: C.textMuted }} tickLine={false} axisLine={false} width={60} />
        <Tooltip content={<CustomTooltip />} />
        <Area type="monotone" dataKey="cumulative" name="Cumulative Capital" stroke={C.accent} strokeWidth={2.5} fill="url(#cumGrad)" dot={false} />
        <Bar dataKey="monthly" name="Monthly Spend" fill={C.accent} opacity={0.25} radius={[3, 3, 0, 0]} />
        <ReferenceLine y={capitalData.peakCapital} stroke={C.negative} strokeDasharray="5 5" strokeWidth={1} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// ─── Monthly Capital Table ───
function CapitalTable({ capitalData, project }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 12 }}>
        <thead>
          <tr>
            <th style={{ textAlign: "left", padding: "10px 12px", borderBottom: `2px solid ${C.border}`, color: C.textMuted, fontWeight: 600, fontSize: 11, position: "sticky", left: 0, background: C.surface, zIndex: 1 }}>Phase</th>
            {capitalData.data.map((d) => (
              <th key={d.month} style={{ textAlign: "right", padding: "10px 8px", borderBottom: `2px solid ${C.border}`, color: C.textMuted, fontWeight: 600, fontSize: 10, whiteSpace: "nowrap", minWidth: 70 }}>
                {d.label}
              </th>
            ))}
            <th style={{ textAlign: "right", padding: "10px 12px", borderBottom: `2px solid ${C.border}`, color: C.text, fontWeight: 700, fontSize: 11 }}>Total</th>
          </tr>
        </thead>
        <tbody>
          {project.phases.map((phase) => {
            const phaseTotal = phase.lineItems.reduce((s, li) => s + li.cost, 0);
            return (
              <tr key={phase.id}>
                <td style={{ padding: "8px 12px", borderBottom: `1px solid ${C.borderLight}`, fontWeight: 600, color: C.text, whiteSpace: "nowrap", position: "sticky", left: 0, background: C.surface, zIndex: 1 }}>
                  <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: 2, background: phase.color, marginRight: 8 }} />
                  {phase.name}
                </td>
                {capitalData.data.map((d) => {
                  const val = d[`phase_${phase.id}`] || 0;
                  return (
                    <td key={d.month} style={{ textAlign: "right", padding: "8px 8px", borderBottom: `1px solid ${C.borderLight}`, color: val > 0 ? C.text : C.borderLight, fontVariantNumeric: "tabular-nums" }}>
                      {val > 0 ? $f(val) : "—"}
                    </td>
                  );
                })}
                <td style={{ textAlign: "right", padding: "8px 12px", borderBottom: `1px solid ${C.borderLight}`, fontWeight: 700, color: C.text }}>{$f(phaseTotal)}</td>
              </tr>
            );
          })}
          {/* Totals row */}
          <tr>
            <td style={{ padding: "10px 12px", fontWeight: 700, color: C.text, borderTop: `2px solid ${C.border}`, position: "sticky", left: 0, background: C.surface, zIndex: 1 }}>Monthly Total</td>
            {capitalData.data.map((d) => (
              <td key={d.month} style={{ textAlign: "right", padding: "10px 8px", fontWeight: 700, color: d.monthly > 0 ? C.accent : C.borderLight, borderTop: `2px solid ${C.border}`, fontVariantNumeric: "tabular-nums" }}>
                {d.monthly > 0 ? $f(d.monthly) : "—"}
              </td>
            ))}
            <td style={{ textAlign: "right", padding: "10px 12px", fontWeight: 700, color: C.accent, borderTop: `2px solid ${C.border}` }}>{$f(capitalData.totalCost)}</td>
          </tr>
          {/* Cumulative row */}
          <tr>
            <td style={{ padding: "8px 12px", fontWeight: 600, color: C.textMuted, position: "sticky", left: 0, background: C.surface, zIndex: 1 }}>Cumulative</td>
            {capitalData.data.map((d) => (
              <td key={d.month} style={{ textAlign: "right", padding: "8px 8px", color: C.textMuted, fontSize: 11, fontVariantNumeric: "tabular-nums" }}>
                {d.cumulative > 0 ? $(d.cumulative) : "—"}
              </td>
            ))}
            <td style={{ textAlign: "right", padding: "8px 12px", fontWeight: 700, color: C.text }}>{$f(capitalData.totalCost)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

// ─── Phase Card for detail view ───
function PhaseCard({ phase, onEdit, capitalData }) {
  const [expanded, setExpanded] = useState(false);
  const total = phase.lineItems.reduce((s, li) => s + li.cost, 0);
  const duration = phase.endMonth - phase.startMonth + 1;

  return (
    <Card style={{ overflow: "hidden" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", cursor: "pointer" }} onClick={() => setExpanded(!expanded)}>
        <div style={{ display: "flex", gap: 14, alignItems: "start" }}>
          <div style={{ width: 4, height: 44, borderRadius: 2, background: phase.color, flexShrink: 0, marginTop: 2 }} />
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 2 }}>{phase.name}</div>
            <div style={{ display: "flex", gap: 16, fontSize: 12, color: C.textMuted }}>
              <span>Months {phase.startMonth}–{phase.endMonth}</span>
              <span>{duration} mo duration</span>
              {phase.isBatched && <Badge color={C.accent}>Batched</Badge>}
            </div>
          </div>
        </div>
        <div style={{ textAlign: "right", display: "flex", alignItems: "center", gap: 14 }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: C.text }}>{$f(total)}</div>
            <div style={{ fontSize: 11, color: C.textMuted }}>{phase.lineItems.length} line items</div>
          </div>
          <button onClick={(e) => { e.stopPropagation(); onEdit(); }} style={{ background: C.accentSoft, border: "none", borderRadius: "6px", padding: "6px 14px", color: C.accent, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: font }}>
            Edit
          </button>
          <span style={{ fontSize: 14, color: C.textMuted, transform: expanded ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }}>▼</span>
        </div>
      </div>

      {expanded && (
        <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${C.borderLight}` }}>
          {phase.isBatched && (
            <div style={{ background: C.accentSoft, borderRadius: "6px", padding: "10px 14px", marginBottom: 14, fontSize: 12, color: C.accent }}>
              <strong>Batch Configuration:</strong> {phase.batchConfig.batchCount} batches × {phase.batchConfig.batchSize} homes × {$f(phase.batchConfig.costPerUnit)}/home, staggered every {phase.batchConfig.staggerMonths} months
            </div>
          )}
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr>
                {["Line Item", "Cost", "Start", "Duration", "Monthly Burn"].map((h, i) => (
                  <th key={h} style={{ textAlign: i === 0 ? "left" : "right", padding: "8px 10px", borderBottom: `1px solid ${C.border}`, color: C.textMuted, fontWeight: 600, fontSize: 11 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {phase.lineItems.map((li) => (
                <tr key={li.id}>
                  <td style={{ padding: "8px 10px", borderBottom: `1px solid ${C.borderLight}`, color: C.text, fontWeight: 500 }}>{li.name}</td>
                  <td style={{ textAlign: "right", padding: "8px 10px", borderBottom: `1px solid ${C.borderLight}`, fontWeight: 600, color: C.text, fontVariantNumeric: "tabular-nums" }}>{$f(li.cost)}</td>
                  <td style={{ textAlign: "right", padding: "8px 10px", borderBottom: `1px solid ${C.borderLight}`, color: C.textMuted }}>Mo {li.startMonth}</td>
                  <td style={{ textAlign: "right", padding: "8px 10px", borderBottom: `1px solid ${C.borderLight}`, color: C.textMuted }}>{li.duration} mo</td>
                  <td style={{ textAlign: "right", padding: "8px 10px", borderBottom: `1px solid ${C.borderLight}`, color: C.accent, fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{$f(li.cost / li.duration)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}

// ─── Stacked Area Chart for phase breakdown ───
function PhaseBreakdownChart({ capitalData, project }) {
  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const d = payload[0]?.payload;
    return (
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 14px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)", fontSize: 12 }}>
        <div style={{ fontWeight: 700, marginBottom: 6 }}>{d?.label}</div>
        {payload.filter(p => p.value > 0).reverse().map((p, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: 20, marginBottom: 2 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: 2, background: p.color }} />
              {p.name}
            </span>
            <span style={{ fontWeight: 600 }}>{$f(p.value)}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={capitalData.data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={C.borderLight} />
        <XAxis dataKey="label" tick={{ fontSize: 10, fill: C.textMuted }} tickLine={false} axisLine={{ stroke: C.borderLight }} interval={1} />
        <YAxis tickFormatter={(v) => $(v)} tick={{ fontSize: 10, fill: C.textMuted }} tickLine={false} axisLine={false} width={60} />
        <Tooltip content={<CustomTooltip />} />
        {project.phases.map((phase) => (
          <Area key={phase.id} type="monotone" dataKey={`phase_${phase.id}`} name={phase.name} stackId="1" stroke={phase.color} fill={phase.color} fillOpacity={0.35} strokeWidth={1.5} />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
}

// ─── Main Scheduler Component ───
function DevelopmentScheduler({ project: externalProject, onSave, onClose } = {}) {
  const initProject = useMemo(() => {
    if (externalProject?.phases && externalProject?.targetMonths) return externalProject;
    const demo = createMeadowCreek();
    if (externalProject?.project_info) {
      demo.name = externalProject.project_info.name || demo.name;
      demo.location = [externalProject.project_info.city, externalProject.project_info.state].filter(Boolean).join(", ") || demo.location;
      demo.totalLots = externalProject.project_info.lot_count || demo.totalLots;
    }
    return demo;
  }, []);
  const [project, setProject] = useState(initProject);
  const [activeTab, setActiveTab] = useState("overview");
  const [editingPhase, setEditingPhase] = useState(null);

  const capitalData = useMemo(() => computeCapitalData(project), [project]);

  const handlePhaseSave = useCallback((updatedPhase) => {
    setProject((prev) => ({
      ...prev,
      phases: prev.phases.map((p) => (p.id === updatedPhase.id ? updatedPhase : p)),
    }));
    setEditingPhase(null);
  }, []);

  const handleExport = useCallback(() => {
    const output = {
      projectId: project.id,
      exportedAt: new Date().toISOString(),
      summary: {
        totalCost: capitalData.totalCost,
        peakCapital: capitalData.peakCapital,
        durationMonths: project.targetMonths,
      },
      phases: project.phases.map((p) => ({
        name: p.name,
        startMonth: p.startMonth,
        endMonth: p.endMonth,
        totalCost: p.lineItems.reduce((s, li) => s + li.cost, 0),
        lineItems: p.lineItems,
      })),
      monthlySchedule: capitalData.data,
    };
    if (onSave) onSave(output);
    else alert("Schedule exported to console.\n\nIn production, this writes to:\nproject.tool_outputs.schedules[]");
    console.log("Schedule Output:", output);
  }, [project, capitalData, onSave]);

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "phases", label: "Phases" },
    { id: "capital", label: "Capital Schedule" },
  ];

  return (
    <div style={{ fontFamily: font, background: C.bg, color: C.text, WebkitFontSmoothing: "antialiased" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap');`}</style>

      {/* Header */}
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.borderLight}`, padding: "16px 28px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 2 }}>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", color: C.accent, textTransform: "uppercase" }}>Next Wave</span>
              <span style={{ color: C.borderLight }}>·</span>
              <span style={{ fontSize: 10, fontWeight: 500, color: C.textMuted }}>Development Scheduler</span>
            </div>
            <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, letterSpacing: "-0.01em" }}>{project.name}</h1>
            <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>{project.location} · {project.totalLots} lots · {project.targetMonths}-month target</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{ width: 260 }}>
            <TabBar tabs={tabs} active={activeTab} onChange={setActiveTab} />
          </div>
          <button onClick={handleExport} style={{
            padding: "9px 20px", border: "none", borderRadius: "6px", background: C.accent,
            color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: font, marginLeft: 8,
          }}>
            Export Schedule
          </button>
          {onClose && (
            <button onClick={onClose} style={{ padding: "9px 16px", border: `1px solid ${C.border}`, borderRadius: "6px", background: C.surface, color: C.text, fontSize: 12, cursor: "pointer", fontFamily: font }}>Close</button>
          )}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "24px 28px", maxWidth: 1280, margin: "0 auto" }}>

        {/* ── OVERVIEW TAB ── */}
        {activeTab === "overview" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Summary Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
              {[
                { label: "Total Project Cost", value: $f(capitalData.totalCost), sub: `${project.phases.length} phases`, color: C.accent },
                { label: "Peak Capital Required", value: $f(capitalData.peakCapital), sub: "Max cash outstanding", color: C.negative },
                { label: "Project Duration", value: `${project.targetMonths} months`, sub: `${project.startYear}–${project.startYear + Math.ceil(project.targetMonths / 12)}`, color: C.positive },
                { label: "Cost per Lot", value: $f(capitalData.totalCost / project.totalLots), sub: `${project.totalLots} lots total`, color: C.warn },
              ].map((card, i) => (
                <Card key={i}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>{card.label}</div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: card.color, letterSpacing: "-0.02em", marginBottom: 4 }}>{card.value}</div>
                  <div style={{ fontSize: 12, color: C.textMuted }}>{card.sub}</div>
                </Card>
              ))}
            </div>

            {/* Phase Summary Row */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {project.phases.map((phase) => {
                const total = phase.lineItems.reduce((s, li) => s + li.cost, 0);
                const pct = ((total / capitalData.totalCost) * 100).toFixed(1);
                return (
                  <div key={phase.id} style={{
                    flex: 1, minWidth: 140, background: C.surface, borderRadius: "6px", padding: "12px 16px",
                    borderLeft: `3px solid ${phase.color}`, boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                  }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: C.textMuted, marginBottom: 4 }}>{phase.name}</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: C.text }}>{$f(total)}</div>
                    <div style={{ fontSize: 10, color: C.textMuted }}>{pct}% · Mo {phase.startMonth}–{phase.endMonth}</div>
                  </div>
                );
              })}
            </div>

            {/* Gantt Timeline */}
            <Card>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 14 }}>Project Timeline</div>
              <GanttTimeline project={project} />
            </Card>

            {/* Charts Row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <Card>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 4 }}>Capital Deployment Curve</div>
                <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 12 }}>Cumulative capital deployed over time with monthly spend bars. Dashed line = peak requirement.</div>
                <CapitalCurve capitalData={capitalData} project={project} />
              </Card>
              <Card>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 4 }}>Spend by Phase</div>
                <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 12 }}>Stacked monthly capital deployment broken down by development phase.</div>
                <PhaseBreakdownChart capitalData={capitalData} project={project} />
              </Card>
            </div>
          </div>
        )}

        {/* ── PHASES TAB ── */}
        {activeTab === "phases" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>Phase Management</h2>
                <p style={{ margin: "2px 0 0", fontSize: 12, color: C.textMuted }}>Click a phase to expand details, or edit to modify line items and timing.</p>
              </div>
              <button onClick={() => {
                const newPhase = {
                  id: `p_new_${Date.now()}`, name: "New Phase", startMonth: 1, endMonth: 3,
                  color: PHASE_COLORS[project.phases.length % PHASE_COLORS.length],
                  lineItems: [{ id: `li_new_${Date.now()}`, name: "New Item", cost: 0, startMonth: 1, duration: 1 }],
                };
                setProject({ ...project, phases: [...project.phases, newPhase] });
              }} style={{
                padding: "9px 20px", border: `1px solid ${C.accent}`, borderRadius: "6px",
                background: C.accentSoft, color: C.accent, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: font,
              }}>+ Add Phase</button>
            </div>
            {project.phases.map((phase, i) => (
              <PhaseCard key={phase.id} phase={phase} capitalData={capitalData} onEdit={() => setEditingPhase(i)} />
            ))}
          </div>
        )}

        {/* ── CAPITAL SCHEDULE TAB ── */}
        {activeTab === "capital" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div>
              <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>Capital Deployment Schedule</h2>
              <p style={{ margin: "2px 0 0", fontSize: 12, color: C.textMuted }}>Month-by-month capital requirements across all phases. Scroll horizontally to see full timeline.</p>
            </div>

            {/* Quick Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
              {(() => {
                const maxMonthly = Math.max(...capitalData.data.map((d) => d.monthly));
                const peakMonth = capitalData.data.find((d) => d.monthly === maxMonthly);
                const avgMonthly = capitalData.totalCost / project.targetMonths;
                return [
                  { label: "Average Monthly Spend", value: $f(avgMonthly), color: C.accent },
                  { label: "Peak Monthly Spend", value: $f(maxMonthly), sub: peakMonth?.label, color: C.negative },
                  { label: "Total Capital Required", value: $f(capitalData.totalCost), color: C.positive },
                ];
              })().map((s, i) => (
                <Card key={i}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>{s.label}</div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: s.color }}>{s.value}</div>
                  {s.sub && <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>{s.sub}</div>}
                </Card>
              ))}
            </div>

            {/* Full Table */}
            <Card style={{ padding: 0 }}>
              <div style={{ padding: "16px 20px", borderBottom: `1px solid ${C.borderLight}` }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>Monthly Capital Requirements</div>
              </div>
              <div style={{ padding: "4px 0" }}>
                <CapitalTable capitalData={capitalData} project={project} />
              </div>
            </Card>

            {/* Deployment Curve */}
            <Card>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 12 }}>Cumulative Deployment S-Curve</div>
              <CapitalCurve capitalData={capitalData} project={project} />
            </Card>
          </div>
        )}
      </div>

      {/* Phase Editor Modal */}
      {editingPhase !== null && (
        <PhaseEditor
          phase={project.phases[editingPhase]}
          phaseIndex={editingPhase}
          onSave={handlePhaseSave}
          onClose={() => setEditingPhase(null)}
        />
      )}
    </div>
  );
}


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// @lib/financial — Financial Computation Engine
// Future: extract to src/lib/financial.ts
// Pure function: takes a project, returns all computed financials
// No React dependencies — can run server-side (Azure Functions)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function computeProjectFinancials(project) {
  const p = project;
  const now = new Date();

  // Timeline
  const start = p.timeline.start_date ? new Date(p.timeline.start_date) : null;
  const end = p.timeline.estimated_completion ? new Date(p.timeline.estimated_completion) : null;
  const pctTimeline = (start && end) ? Math.min(100, Math.max(0, Math.round(((now - start) / (end - start)) * 100))) : 0;
  const daysRemaining = end ? Math.max(0, Math.round((end - now) / 86400000)) : null;
  const isOverdue = !!(end && now > end);

  // Budget categories
  const b = p.financials.total_budget || 0;
  const land = p.financials.land_cost || 0;
  const nonLand = b - land;
  const budgetCategories = [
    { id: "land", name: "Land Acquisition", budget: land },
    { id: "sitework", name: "Site Work & Infrastructure", budget: Math.round(nonLand * 0.30) },
    { id: "vertical", name: "Vertical Construction", budget: Math.round(nonLand * 0.33) },
    { id: "design", name: "Design & Engineering", budget: Math.round(nonLand * 0.06) },
    { id: "permits", name: "Permits & Fees", budget: Math.round(nonLand * 0.05) },
    { id: "marketing", name: "Marketing & Sales", budget: Math.round(nonLand * 0.07) },
    { id: "contingency", name: "Contingency", budget: Math.round(nonLand * 0.08) },
    { id: "financing", name: "Financing & Carry", budget: Math.round(nonLand * 0.06) },
    { id: "misc", name: "Miscellaneous", budget: Math.round(nonLand * 0.05) },
  ];

  // Monthly data
  const monthlyData = (() => {
    if (!start || !end || !b) return [];
    const totalMonths = Math.max(1, Math.round((end - start) / (30 * 86400000)));
    const mN = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const rev = p.financials.estimated_revenue || 0;
    const data = [];
    let cumPlanned = 0, cumActual = 0, cumRev = 0, cumCommitted = 0;
    const seed = (i) => Math.sin(i * 9301 + 49297) * 0.5 + 0.5;
    for (let i = 0; i < totalMonths; i++) {
      const dt = new Date(start.getFullYear(), start.getMonth() + i, 1);
      const t = i / totalMonths;
      const isPast = dt <= now;
      const isCurrent = dt.getMonth() === now.getMonth() && dt.getFullYear() === now.getFullYear();
      const w = Math.sin(t * Math.PI) * 1.4 + 0.4;
      const planned = Math.round((b / totalMonths) * (w / 1.1));
      const variance = seed(i) * 0.3 - 0.12;
      const actual = isPast ? Math.round(planned * (1 + variance)) : 0;
      const committed = (!isPast && i < totalMonths) ? Math.round(planned * (0.6 + seed(i+50) * 0.3)) : 0;
      const revStart = Math.round(totalMonths * 0.55);
      const monthlyRev = i >= revStart ? Math.round(rev / Math.max(1, totalMonths - revStart)) : 0;
      const actualRev = isPast && i >= revStart ? Math.round(monthlyRev * (0.75 + seed(i+100) * 0.4)) : 0;
      cumPlanned += planned; cumActual += actual; cumRev += (isPast ? actualRev : monthlyRev); cumCommitted += committed;
      data.push({ month: `${mN[dt.getMonth()]} '${String(dt.getFullYear()).slice(2)}`, planned, actual, committed, revenue: isPast ? actualRev : monthlyRev, cumPlanned, cumActual, cumRevenue: cumRev, netCash: (isPast ? actualRev : monthlyRev) - (isPast ? actual : planned), isPast, isCurrent });
    }
    return data;
  })();

  // Derived metrics
  const spent = monthlyData.reduce((s, d) => s + d.actual, 0);
  const totalCommitted = monthlyData.reduce((s, d) => s + d.committed, 0);
  const totalPlannedToDate = monthlyData.filter(d => d.isPast).reduce((s, d) => s + d.planned, 0);
  const remaining = Math.max(0, b - spent);
  const currentForecast = spent + monthlyData.filter(d => !d.isPast).reduce((s, d) => s + d.planned, 0);
  const contingencyBudget = budgetCategories.find(c => c.id === "contingency")?.budget || 0;
  const contingencyUsed = Math.round(Math.max(0, spent - totalPlannedToDate) * 0.7);
  const contingencyRemaining = Math.max(0, contingencyBudget - contingencyUsed);
  const projectedRevenue = monthlyData.reduce((s, d) => s + d.revenue, 0);
  const projectedProfit = projectedRevenue - currentForecast;
  const projectedMargin = projectedRevenue > 0 ? Math.round((projectedProfit / projectedRevenue) * 100) : 0;
  const budgetVariance = b > 0 ? Math.round(((currentForecast - b) / b) * 100) : 0;
  const onBudget = Math.abs(budgetVariance) <= 3;
  const overBudget = budgetVariance > 3;

  // Health alerts
  const healthAlerts = [];
  if (overBudget) healthAlerts.push({ severity: "high", label: "Over Budget", detail: `Current forecast exceeds budget by ${budgetVariance}%` });
  if (isOverdue) healthAlerts.push({ severity: "high", label: "Behind Schedule", detail: `Project is ${Math.abs(Math.round((now - end) / 86400000))} days past completion date` });
  if (projectedMargin < 10 && projectedMargin >= 0) healthAlerts.push({ severity: "medium", label: "Margin Compression", detail: `Projected margin at ${projectedMargin}% — below 10% threshold` });
  if (projectedMargin < 0) healthAlerts.push({ severity: "high", label: "Negative Margin", detail: `Project is forecasting a loss` });
  if (contingencyBudget > 0 && contingencyRemaining < contingencyBudget * 0.25) healthAlerts.push({ severity: "medium", label: "Contingency Low", detail: `Only ${Math.round((contingencyRemaining/contingencyBudget)*100)}% contingency remaining` });
  const avgPlanned = monthlyData.length > 0 ? monthlyData.reduce((s, d) => s + d.planned, 0) / monthlyData.length : 0;
  const futureSpike = monthlyData.find(d => !d.isPast && d.planned > avgPlanned * 1.3);
  if (futureSpike) healthAlerts.push({ severity: "low", label: "Cost Spike Ahead", detail: `${futureSpike.month} above average` });

  // Status
  const statusColor = healthAlerts.some(a => a.severity === "high") ? "#C4564B" : healthAlerts.some(a => a.severity === "medium") ? "#D4913B" : "#5B8C6A";
  const statusLabel = healthAlerts.some(a => a.severity === "high") ? (isOverdue ? "Behind Schedule" : "Watch: Issues") : healthAlerts.some(a => a.severity === "medium") ? "Caution" : "On Track";

  // Budget category actuals
  const catData = budgetCategories.map(cat => {
    const catPctSpent = cat.id === "land" ? (pctTimeline > 5 ? 1 : 0) : Math.min(1, pctTimeline / 100 * (1 + (Math.sin(cat.budget) * 0.15)));
    const catActual = Math.round(cat.budget * catPctSpent);
    const catCommitted = Math.round((cat.budget - catActual) * 0.35);
    return { ...cat, actual: catActual, committed: catCommitted, remaining: Math.max(0, cat.budget - catActual - catCommitted), pctUsed: cat.budget > 0 ? Math.round((catActual / cat.budget) * 100) : 0 };
  });

  // Phase detection
  const projectPhase = !start ? { name: "Pre-Development" } : pctTimeline < 8 ? { name: "Land & Entitlement" } : pctTimeline < 25 ? { name: "Design & Permitting" } : pctTimeline < 55 ? { name: "Site Work" } : pctTimeline < 85 ? { name: "Vertical Construction" } : pctTimeline < 100 ? { name: "Sales & Closeout" } : { name: "Complete" };

  return {
    start, end, now, pctTimeline, daysRemaining, isOverdue,
    budgetCategories, monthlyData,
    spent, totalCommitted, remaining, currentForecast,
    contingencyBudget, contingencyUsed, contingencyRemaining,
    projectedRevenue, projectedProfit, projectedMargin,
    budgetVariance, onBudget, overBudget,
    healthAlerts, statusColor, statusLabel,
    catData, projectPhase,
  };
}


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// @components/shared — Reusable UI Components
// Future: extract to src/components/shared/
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/** Shared chart tooltip */
function ChartTooltip({ active, payload, label, formatter }) {
  if (!active || !payload?.length) return null;
  const fmt = formatter || ((v) => { const a=Math.abs(v); return (v<0?"-":"")+"$"+(a>=1e6?(a/1e6).toFixed(1)+"M":a>=1e3?Math.round(a/1e3)+"K":Math.round(a)); });
  return (<div style={{ background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,padding:"10px 14px",boxShadow:"0 4px 12px rgba(0,0,0,0.08)",fontSize:12 }}>
    <div style={{ fontWeight:700,marginBottom:6 }}>{label}</div>
    {payload.map((pp,i) => (<div key={i} style={{ display:"flex",justifyContent:"space-between",gap:16,marginBottom:2 }}><span style={{ color:pp.color }}>{pp.name}</span><span style={{ fontWeight:600 }}>{fmt(pp.value)}</span></div>))}
  </div>);
}

/** Relative time formatter */
function timeAgo(timestamp) {
  const m = Math.round((Date.now() - new Date(timestamp)) / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.round(h / 24)}d ago`;
}


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// @data/samples — Demo Project Data
// Future: extract to src/data/samples.ts
// In production: replaced by API calls to Azure SQL / Cosmos DB
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const INITIAL_SAMPLES = [
  createProject({
    project_info: { name: "Meadow Creek Village", address: "4200 Meadow Creek Rd", city: "Burlington", state: "NC", development_type: "Modular Residential", lot_count: 64, notes: "Phase 1 of 2. Entitlement approved Jan 2026. Infrastructure bid awarded to Sitework Solutions. Manufacturer: Champion Homes — floor plans finalizing Q2 2026." },
    financials: { total_budget: 8200000, land_cost: 1350000, target_price_per_home: 219000, estimated_revenue: 14016000 },
    timeline: { start_date: "2026-03-01", estimated_completion: "2027-09-30", milestones: [] },
    tool_outputs: { financial_models: [
      { id: "s1", created_at: "2026-02-10T14:30:00Z", tool_id: "proforma", label: "Middle Scenario — Meadow Creek Village", data: { scenario: "Middle", computed: { grossProfit: 4366000, totalROI: 0.53, xirr: 0.31, margin: "31.1", netProfit: 4366000, grossSales: 14016000, totalCapital: 8200000 }}},
      { id: "s2", created_at: "2026-02-18T09:15:00Z", tool_id: "proforma", label: "Low Scenario — Meadow Creek Village", data: { scenario: "Low", computed: { grossProfit: 3086000, totalROI: 0.38, xirr: 0.24, margin: "24.2", netProfit: 3086000, grossSales: 12736000, totalCapital: 8200000 }}},
    ], schedules: [], floor_plans: [], websites: [], documents: [], reports: [] },
  }),
  createProject({
    project_info: { name: "Timber Ridge Estates", address: "780 Old Mill Rd", city: "Mebane", state: "NC", development_type: "Modular Residential", lot_count: 42, notes: "Smaller infill site. Due diligence phase — soil testing and topo survey in progress. Target close on land by May 2026." },
    financials: { total_budget: 5100000, land_cost: 875000, target_price_per_home: 209000, estimated_revenue: 8778000 },
    timeline: { start_date: "2026-06-01", estimated_completion: "2027-12-31", milestones: [] },
    tool_outputs: { financial_models: [
      { id: "s3", created_at: "2026-03-05T11:00:00Z", tool_id: "proforma", label: "Middle Scenario — Timber Ridge Estates", data: { scenario: "Middle", computed: { grossProfit: 2629000, totalROI: 0.52, xirr: 0.30, margin: "30.0", netProfit: 2629000, grossSales: 8778000, totalCapital: 5100000 }}},
    ], schedules: [], floor_plans: [], websites: [], documents: [], reports: [] },
  }),
  createProject({
    project_info: { name: "Haw River Commons", address: "1120 River Bend Pkwy", city: "Haw River", state: "NC", development_type: "Modular Residential", lot_count: 96, notes: "Largest development to date. Land under contract — closing contingent on rezoning approval expected Q3 2026. Will be modular with 3 floor plan options." },
    financials: { total_budget: 13500000, land_cost: 2200000, target_price_per_home: 234000, estimated_revenue: 22464000 },
    timeline: { start_date: "2026-09-01", estimated_completion: "2028-06-30", milestones: [] },
    tool_outputs: { financial_models: [], schedules: [], floor_plans: [], websites: [], documents: [], reports: [] },
  }),
  createProject({
    project_info: { name: "Cedar Hollow", address: "350 Cedar Hollow Ln", city: "Graham", state: "NC", development_type: "Manufactured Home", lot_count: 28, notes: "Pilot project for smaller manufactured home community. Targeting first-time buyers under $180K. Site already graded and permitted." },
    financials: { total_budget: 3200000, land_cost: 520000, target_price_per_home: 174000, estimated_revenue: 4872000 },
    timeline: { start_date: "2026-04-15", estimated_completion: "2027-03-31", milestones: [] },
    tool_outputs: { financial_models: [
      { id: "s4", created_at: "2026-03-12T16:45:00Z", tool_id: "proforma", label: "High Scenario — Cedar Hollow", data: { scenario: "High", computed: { grossProfit: 1420000, totalROI: 0.44, xirr: 0.42, margin: "29.1", netProfit: 1420000, grossSales: 4872000, totalCapital: 3200000 }}},
    ], schedules: [], floor_plans: [], websites: [], documents: [], reports: [] },
  }),
  createProject({
    project_info: { name: "Oakmont Crossing", address: "5600 Oakmont Dr", city: "Elon", state: "NC", development_type: "Modular Residential", lot_count: 52, notes: "Near Elon University. Mixed pricing strategy — 40 market rate, 12 affordable units. Infrastructure design in progress with Kimley-Horn." },
    financials: { total_budget: 7400000, land_cost: 1100000, target_price_per_home: 225000, estimated_revenue: 11700000 },
    timeline: { start_date: "2026-07-01", estimated_completion: "2028-01-31", milestones: [] },
    tool_outputs: { financial_models: [], schedules: [], floor_plans: [], websites: [], documents: [], reports: [] },
  }),
];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PLATFORM CORE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// @config/api — API Configuration
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const API_URL = "https://nextwave-api-g5g6f3f7cvg4cnef.centralus-01.azurewebsites.net/api";


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// @app/shell — Main Application Component
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// @app/login — Login Screen
// Future: replace with Microsoft Entra ID authentication
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function LoginScreen({ onLogin }) {
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [loginError, setLoginError] = useState("");

  const handleLogin = () => {
    if (loginForm.email && loginForm.password) { onLogin(); setLoginError(""); }
    else { setLoginError("Enter your email and password"); }
  };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;1,700&display=swap" rel="stylesheet" />
      <style>{`
        * { box-sizing: border-box; margin: 0; }
        body { background: #FFFFFF; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
      <div style={{ fontFamily: '"DM Sans", system-ui, sans-serif', background: "#FFFFFF", color: "#fff", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", WebkitFontSmoothing: "antialiased" }}>
        <div style={{ animation: "fadeIn 0.8s ease both", textAlign: "center", marginBottom: 48 }}>
          <img src="/ccb_os_logo.png" alt="CCB OS - Built by DWD" style={{ width: 320, height: "auto" }} />
        </div>

        <div style={{ animation: "fadeIn 0.8s 0.2s ease both", width: 380, background: "#FFFFFF", border: "1px solid #E4E2DE", borderRadius: 16, padding: "36px 32px", boxShadow: "0 8px 40px rgba(0,0,0,0.08)" }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#1A1917", marginBottom: 4, textAlign: "center" }}>Sign In</div>
          <div style={{ fontSize: 13, color: "#7D7B76", marginBottom: 28, textAlign: "center" }}>Access your development operations platform</div>

          {loginError && (
            <div style={{ background: "rgba(196,43,43,0.1)", border: "1px solid rgba(196,43,43,0.3)", borderRadius: 8, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "#C42B2B" }}>{loginError}</div>
          )}

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#7D7B76", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>Email</label>
            <input type="email" value={loginForm.email} onChange={e => setLoginForm(p => ({ ...p, email: e.target.value }))} placeholder="you@ccb-llc.com"
              style={{ width: "100%", padding: "12px 14px", background: "#FFFFFF", border: "1px solid #DDDBD7", borderRadius: 8, color: "#1A1917", fontSize: 14, fontFamily: '"DM Sans", system-ui, sans-serif', outline: "none", transition: "border-color 0.2s" }}
              onFocus={e => e.target.style.borderColor = "#C42B2B"} onBlur={e => e.target.style.borderColor = "#DDDBD7"} />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#7D7B76", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>Password</label>
            <input type="password" value={loginForm.password} onChange={e => setLoginForm(p => ({ ...p, password: e.target.value }))} placeholder="••••••••"
              style={{ width: "100%", padding: "12px 14px", background: "#FFFFFF", border: "1px solid #DDDBD7", borderRadius: 8, color: "#1A1917", fontSize: 14, fontFamily: '"DM Sans", system-ui, sans-serif', outline: "none", transition: "border-color 0.2s" }}
              onFocus={e => e.target.style.borderColor = "#C42B2B"} onBlur={e => e.target.style.borderColor = "#DDDBD7"}
              onKeyDown={e => { if (e.key === "Enter") handleLogin(); }} />
          </div>

          <button onClick={handleLogin}
            style={{ width: "100%", padding: "13px", background: "#C42B2B", border: "none", borderRadius: 8, color: "#fff", fontSize: 14, fontWeight: 700, letterSpacing: "0.05em", cursor: "pointer", fontFamily: '"DM Sans", system-ui, sans-serif', transition: "background 0.2s" }}
            onMouseEnter={e => e.target.style.background = "#A82020"} onMouseLeave={e => e.target.style.background = "#C42B2B"}
          >Sign In</button>

          <div style={{ textAlign: "center", marginTop: 20, fontSize: 12, color: "rgba(255,255,255,0.2)" }}>Secure access · CCB Development Operations</div>
        </div>

        <div style={{ animation: "fadeIn 0.8s 0.4s ease both", marginTop: 48, fontSize: 11, color: "#CCC", textAlign: "center" }}>
          © {new Date().getFullYear()} CCB LLC · All rights reserved
        </div>
      </div>
    </>
  );
}


export default function NextWavePlatform() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [projects, setProjects] = useState([]);
  const [activeProjectId, setActiveProjectId] = useState(null);
  const [view, setView] = useState("home");
  const [loading, setLoading] = useState(true);
  const [activeTool, setActiveTool] = useState(null);
  const [wsTab, setWsTab] = useState("overview");
  const [form, setForm] = useState({});
  const [toast, setToast] = useState(null);
  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2500); };
  const activeProject = projects.find((p) => p.id === activeProjectId) || null;

  // Fetch projects from API on load
  const fetchProjects = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/projects`);
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
        if (!activeProjectId && data.length > 0) setActiveProjectId(data[0].id);
      } else {
        console.error("API error:", res.status);
        setProjects(INITIAL_SAMPLES); // Fallback to sample data
      }
    } catch (err) {
      console.error("API unreachable, using sample data:", err.message);
      setProjects(INITIAL_SAMPLES); // Fallback if API is down
      if (!activeProjectId) setActiveProjectId(INITIAL_SAMPLES[0].id);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);

  const createNewProject = () => {
    setForm({ name:"",address:"",city:"",state:"",development_type:"Modular Residential",lot_count:"",notes:"",total_budget:"",land_cost:"",target_price_per_home:"",estimated_revenue:"",start_date:"",estimated_completion:"" });
    setView("create");
  };
  const editProject = () => {
    if (!activeProject) return; const p=activeProject;
    setForm({ name:p.project_info.name,address:p.project_info.address,city:p.project_info.city,state:p.project_info.state,development_type:p.project_info.development_type,lot_count:p.project_info.lot_count.toString(),notes:p.project_info.notes,total_budget:p.financials.total_budget.toString(),land_cost:p.financials.land_cost.toString(),target_price_per_home:p.financials.target_price_per_home.toString(),estimated_revenue:p.financials.estimated_revenue.toString(),start_date:p.timeline.start_date,estimated_completion:p.timeline.estimated_completion });
    setView("edit");
  };
  const saveProject = async (isEdit) => {
    if (!form.name.trim()) return;
    const body = {
      project_info: { name:form.name, address:form.address, city:form.city, state:form.state, development_type:form.development_type, lot_count:parseInt(form.lot_count)||0, notes:form.notes },
      financials: { total_budget:parseFloat(form.total_budget)||0, land_cost:parseFloat(form.land_cost)||0, target_price_per_home:parseFloat(form.target_price_per_home)||0, estimated_revenue:parseFloat(form.estimated_revenue)||0 },
      timeline: { start_date:form.start_date||null, estimated_completion:form.estimated_completion||null },
    };
    try {
      if (isEdit && activeProject) {
        await fetch(`${API_URL}/projects/${activeProject.id}`, { method:"PUT", headers:{"Content-Type":"application/json"}, body:JSON.stringify(body) });
        showToast("Project updated");
      } else {
        const res = await fetch(`${API_URL}/projects`, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(body) });
        const data = await res.json();
        if (data.id) { setActiveProjectId(data.id); setWsTab("overview"); }
        showToast("Project created");
      }
      await fetchProjects();
      setView(isEdit ? "workspace" : "workspace");
    } catch (err) {
      console.error("Save failed:", err);
      showToast("Save failed — check connection");
    }
  };
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [deleteInput, setDeleteInput] = useState("");
  const deleteProject = async (id) => {
    if (confirmDelete === id && deleteInput === "DELETE") {
      try {
        await fetch(`${API_URL}/projects/${id}`, { method:"DELETE" });
        if(activeProjectId===id){setActiveProjectId(null);setView("home");}
        setConfirmDelete(null); setDeleteInput("");
        await fetchProjects();
        showToast("Project deleted");
      } catch (err) { showToast("Delete failed"); }
    } else if (confirmDelete !== id) {
      setConfirmDelete(id); setDeleteInput("");
    }
  };
  const cancelDelete = () => { setConfirmDelete(null); setDeleteInput(""); };
  const ACTIVITY_ICONS = { tool_output: "\uD83D\uDCCA", output_deleted: "\uD83D\uDDD1\uFE0F", project_updated: "\u270F\uFE0F", project_created: "\u2728", project_exported: "\uD83D\uDCE4", financial_sync: "\uD83D\uDCB0", milestone: "\uD83C\uDFF3\uFE0F" };
  const addActivity = (projectId, action, detail) => {
    setProjects(prev => prev.map(p => p.id === projectId ? { ...p, activity: [{ id: crypto.randomUUID(), action, detail, icon: ACTIVITY_ICONS[action] || "\u25CF", timestamp: new Date().toISOString() }, ...(p.activity || []).slice(0, 49)] } : p));
  };
  const handleToolSave = async (output) => {
    if(!activeTool||!activeProject) return;
    const pid = activeProject.id;
    try {
      await fetch(`${API_URL}/projects/${pid}/outputs`, {
        method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({ tool_id:activeTool.id, output_key:activeTool.output_key, label:output.label||"Output", data:output.data||{} })
      });
      // Pro forma sync
      if (activeTool.id === "proforma" && output.data?.computed?.grossSales) {
        const c = output.data.computed;
        await fetch(`${API_URL}/projects/${pid}`, {
          method:"PUT", headers:{"Content-Type":"application/json"},
          body:JSON.stringify({ ...activeProject, financials:{ ...activeProject.financials, estimated_revenue:Math.round(c.grossSales) } })
        });
      }
      await fetchProjects();
      showToast(`Saved to ${activeTool.name}`);
    } catch (err) {
      showToast("Save failed");
    }
    setActiveTool(null); setView("workspace");
  };
  const deleteOutput = async (key, id) => {
    if(!activeProject) return;
    try {
      await fetch(`${API_URL}/outputs/${id}`, { method:"DELETE" });
      await fetchProjects();
      showToast("Output deleted");
    } catch (err) { showToast("Delete failed"); }
  };
  const exportProject = () => {
    if(!activeProject) return;
    const json = JSON.stringify(activeProject, null, 2);
    const b64 = btoa(unescape(encodeURIComponent(json)));
    const link = document.createElement("a");
    link.href = "data:application/json;base64," + b64;
    link.download = `${activeProject.project_info.name.replace(/\s+/g,"_")}_export.json`;
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
    showToast("Project exported");
  };

  // ─── Shared Styles ───
  const btn = (bg,color,border) => ({ padding:"10px 20px",borderRadius:"8px",border:border||"none",background:bg,color,fontSize:"13px",fontWeight:600,cursor:"pointer",fontFamily:font,transition:"all 0.15s" });
  const btnOutline = { padding:"10px 20px",borderRadius:"8px",border:`1px solid ${C.border}`,background:"transparent",color:C.textMid,fontSize:"13px",fontWeight:600,cursor:"pointer",fontFamily:font };
  const fieldLabel = { display:"block",fontSize:"11px",fontWeight:600,color:C.textMuted,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:5 };
  const fieldInput = { width:"100%",padding:"9px 13px",background:C.surfaceAlt,border:`1px solid ${C.border}`,borderRadius:8,color:C.text,fontSize:"14px",fontFamily:font,outline:"none",boxSizing:"border-box" };
  const panel = { background:C.surface,border:`1px solid ${C.border}`,borderRadius:14,padding:22 };
  const tag = (active) => ({ display:"inline-block",padding:"3px 10px",borderRadius:20,fontSize:"10px",fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",background:active?C.accentSoft:"rgba(125,123,118,0.08)",color:active?C.accent:C.textMuted });
  const statV = { fontSize:22,fontWeight:700,color:C.text,lineHeight:1,fontVariantNumeric:"tabular-nums" };
  const statL = { fontSize:10,color:C.textMuted,textTransform:"uppercase",letterSpacing:"0.1em",marginTop:5 };
  const cur = (v) => { const n=parseFloat(v); if(!n&&n!==0) return "\u2014"; return "$"+n.toLocaleString("en-US",{maximumFractionDigits:0}); };
  const curK = (v) => { const a=Math.abs(v); if(a>=1e6) return (v<0?"-":"")+"$"+(a/1e6).toFixed(1)+"M"; if(a>=1e3) return (v<0?"-":"")+"$"+Math.round(a/1e3)+"K"; return cur(v); };
  const wsTabBtn = (id,label,count) => (<button key={id} onClick={()=>setWsTab(id)} style={{ padding:"9px 18px",fontSize:11,fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase",cursor:"pointer",background:"transparent",border:"none",borderBottom:wsTab===id?`2px solid ${C.accent}`:"2px solid transparent",color:wsTab===id?C.accent:C.textMuted,fontFamily:font,transition:"all 0.15s" }}>{label}{count!==undefined?` (${count})`:""}</button>);

  // ─── FORM ───
  const renderForm = (isEdit) => {
    const set = (k,v) => setForm(p=>({...p,[k]:v}));
    const field = (label,key,type="text",placeholder="") => (
      <div key={key}><label style={fieldLabel}>{label}</label>
        <input style={fieldInput} type={type} value={form[key]||""} placeholder={placeholder} onChange={e=>set(key,e.target.value)} onFocus={e=>{e.target.style.borderColor=C.accent}} onBlur={e=>{e.target.style.borderColor=C.border}} />
      </div>
    );
    return (<div>
      <div style={{ display:"flex",alignItems:"center",gap:12,marginBottom:28 }}>
        <button style={btnOutline} onClick={()=>setView(isEdit?"workspace":"home")}>← Back</button>
        <h2 style={{ fontSize:22,fontWeight:700,margin:0 }}>{isEdit?"Edit":"New"} Project</h2>
      </div>
      <div style={panel}><h4 style={{ margin:"0 0 16px",fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",color:C.textMuted }}>Project Info</h4>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:16 }}>
          <div style={{ gridColumn:"1/-1" }}>{field("Project Name","name","text","e.g. Meadow Creek Village")}</div>
          <div style={{ gridColumn:"1/-1" }}>{field("Address","address","text","Street address")}</div>
          {field("City","city","text","City")}{field("State","state","text","State")}
          <div><label style={fieldLabel}>Development Type</label><select style={{...fieldInput,cursor:"pointer"}} value={form.development_type||"Modular Residential"} onChange={e=>set("development_type",e.target.value)}><option>Modular Residential</option><option>Manufactured Home</option><option>Single Family</option><option>Mixed Use</option></select></div>
          {field("Number of Lots","lot_count","number","e.g. 48")}
        </div>
      </div>
      <div style={{...panel,marginTop:16}}><h4 style={{ margin:"0 0 16px",fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",color:C.textMuted }}>Financial Targets</h4>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:16 }}>{field("Total Budget ($)","total_budget","number","5000000")}{field("Land Cost ($)","land_cost","number","800000")}{field("Price Per Home ($)","target_price_per_home","number","189000")}{field("Estimated Revenue ($)","estimated_revenue","number","9000000")}</div>
      </div>
      <div style={{...panel,marginTop:16}}><h4 style={{ margin:"0 0 16px",fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",color:C.textMuted }}>Timeline</h4>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:16 }}>{field("Start Date","start_date","date")}{field("Est. Completion","estimated_completion","date")}</div>
      </div>
      <div style={{...panel,marginTop:16}}><h4 style={{ margin:"0 0 16px",fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",color:C.textMuted }}>Notes</h4>
        <textarea style={{...fieldInput,minHeight:80,resize:"vertical"}} value={form.notes||""} placeholder="Milestones, notes..." onChange={e=>set("notes",e.target.value)} />
      </div>
      <div style={{ display:"flex",gap:12,marginTop:20 }}>
        <button style={btn(C.accent,"#fff")} onClick={()=>saveProject(isEdit)}>{isEdit?"Save Changes":"Create Project"}</button>
        <button style={btnOutline} onClick={()=>setView(isEdit?"workspace":"home")}>Cancel</button>
      </div>
    </div>);
  };

  // ─── HOME ───
  const renderHome = () => (<div>
    <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:28 }}>
      <div><h1 style={{ fontSize:28,fontWeight:700,margin:0 }}>Projects</h1><p style={{ color:C.textMuted,fontSize:13,margin:"6px 0 0" }}>{projects.length===0?"Create your first development project.":projects.length+" project"+(projects.length!==1?"s":"")}</p></div>
      <button style={btn(C.accent,"#fff")} onClick={createNewProject}>+ New Project</button>
    </div>
    {projects.length===0?(<div style={{...panel,border:`2px dashed ${C.border}`,textAlign:"center",padding:"64px 24px"}}><div style={{ fontSize:44,marginBottom:12 }}>🏗️</div><p style={{ color:C.textMuted,fontSize:14,maxWidth:360,margin:"0 auto 20px" }}>Each project is a data container for your development.</p><button style={btn(C.accent,"#fff")} onClick={createNewProject}>Create First Project</button></div>):(
    <div style={{ display:"grid",gap:14 }}>{projects.map(p=>{
      const oc=Object.values(p.tool_outputs).reduce((s,a)=>s+a.length,0);
      const profit=p.financials.estimated_revenue-p.financials.total_budget;
      return (<div key={p.id} onClick={()=>{setActiveProjectId(p.id);setWsTab("overview");setView("workspace");}} style={{...panel,cursor:"pointer",transition:"all 0.15s"}}
        onMouseEnter={e=>{e.currentTarget.style.borderColor=C.accent;e.currentTarget.style.boxShadow="0 4px 16px rgba(0,0,0,0.06)";}}
        onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.boxShadow="none";}}>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16 }}>
          <div style={{ flex:1,minWidth:0 }}>
            <h3 style={{ margin:0,fontSize:18,fontWeight:700 }}>{p.project_info.name}</h3>
            <p style={{ color:C.textMuted,fontSize:12,margin:"3px 0 0" }}>{[p.project_info.city,p.project_info.state].filter(Boolean).join(", ")||"No location"} · {p.project_info.development_type}</p>
          </div>
          <div style={{ display:"flex",gap:6,flexShrink:0,marginLeft:12 }}>
            <span style={tag(true)}>{p.project_info.lot_count} Lots</span>
            {oc>0&&<span style={tag(false)}>{oc} {oc===1?"Output":"Outputs"}</span>}
          </div>
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,borderTop:`1px solid ${C.borderLight}`,paddingTop:16 }}>
          <div style={{ textAlign:"center" }}><div style={statV}>{cur(p.financials.total_budget)}</div><div style={statL}>Budget</div></div>
          <div style={{ textAlign:"center" }}><div style={statV}>{cur(p.financials.target_price_per_home)}</div><div style={statL}>Per Home</div></div>
          <div style={{ textAlign:"center" }}><div style={statV}>{cur(p.financials.estimated_revenue)}</div><div style={statL}>Revenue</div></div>
          <div style={{ textAlign:"center" }}><div style={{...statV,color:profit>=0?C.positive:C.negative}}>{cur(profit)}</div><div style={statL}>Est. Profit</div></div>
        </div>
      </div>);
    })}</div>)}
  </div>);

  // ─── WORKSPACE ───
  const renderWorkspace = () => {
    if(!activeProject) return null; const p=activeProject;
    const totalOutputs=Object.values(p.tool_outputs).reduce((s,a)=>s+a.length,0);

    // All financial computations via the extracted pure function
    const fin = computeProjectFinancials(p);
    const { start, end, now, pctTimeline, daysRemaining, isOverdue, budgetCategories, monthlyData, spent, totalCommitted, remaining, currentForecast, contingencyBudget, contingencyRemaining, projectedRevenue, projectedProfit, projectedMargin, budgetVariance, onBudget, overBudget, healthAlerts, statusColor, statusLabel, catData, projectPhase } = fin;

    // Recent activity
    const lastActivity = (p.activity || [])[0];
    const lastActivityAgo = lastActivity ? timeAgo(lastActivity.timestamp) : null;

    return (<div>
      {/* ━━━ EXECUTIVE HEADER ━━━ */}
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16 }}>
        <div>
          <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:6 }}>
            <span style={{ fontSize:10,fontWeight:700,color:C.textMuted,textTransform:"uppercase",letterSpacing:"0.18em" }}>{projectPhase.name}</span>
            <span style={{ width:4,height:4,borderRadius:"50%",background:C.border,display:"inline-block" }}></span>
            <span style={{ display:"inline-flex",alignItems:"center",gap:4,padding:"2px 8px",borderRadius:4,fontSize:10,fontWeight:700,background:statusColor+"12",color:statusColor }}>
              <span style={{ width:6,height:6,borderRadius:"50%",background:statusColor }}></span>
              {statusLabel}
            </span>
          </div>
          <h1 style={{ fontSize:26,fontWeight:700,margin:0,letterSpacing:"-0.01em" }}>{p.project_info.name}</h1>
          <p style={{ color:C.textMuted,fontSize:12,margin:"4px 0 0",fontWeight:500 }}>{[p.project_info.city,p.project_info.state].filter(Boolean).join(", ")} · {p.project_info.lot_count} lots · {p.project_info.development_type}</p>
        </div>
        <div style={{ display:"flex",gap:6,alignItems:"center" }}>
          <button style={{...btnOutline,padding:"7px 14px",fontSize:12}} onClick={exportProject}>Export</button>
          <button style={{...btnOutline,padding:"7px 14px",fontSize:12}} onClick={editProject}>Edit</button>
          {confirmDelete===p.id ? (
            <div style={{ display:"flex",gap:6,alignItems:"center",background:C.negativeSoft,padding:"6px 10px",borderRadius:8 }}>
              <input autoFocus value={deleteInput} onChange={e=>setDeleteInput(e.target.value)} onKeyDown={e=>{ if(e.key==="Enter"&&deleteInput==="DELETE") deleteProject(p.id); if(e.key==="Escape") cancelDelete(); }} placeholder="DELETE" style={{ width:70,padding:"3px 6px",borderRadius:4,border:`2px solid ${deleteInput==="DELETE"?C.negative:C.border}`,background:"#fff",fontSize:11,fontWeight:700,fontFamily:"monospace",color:deleteInput==="DELETE"?C.negative:C.text,outline:"none",textAlign:"center" }} />
              <button onClick={()=>deleteProject(p.id)} disabled={deleteInput!=="DELETE"} style={{ padding:"4px 10px",borderRadius:4,border:"none",background:deleteInput==="DELETE"?C.negative:"#ccc",color:"#fff",fontSize:10,fontWeight:700,cursor:deleteInput==="DELETE"?"pointer":"not-allowed",fontFamily:font,opacity:deleteInput==="DELETE"?1:0.5 }}>Delete</button>
              <button onClick={cancelDelete} style={{ padding:"4px 10px",borderRadius:4,border:`1px solid ${C.border}`,background:C.surface,color:C.textMid,fontSize:10,cursor:"pointer",fontFamily:font }}>Cancel</button>
            </div>
          ) : (
            <button style={{...btnOutline,color:C.negative,borderColor:"rgba(196,86,75,0.25)",padding:"7px 14px",fontSize:12}} onClick={()=>deleteProject(p.id)}>Delete</button>
          )}
        </div>
      </div>

      {/* ━━━ EXECUTIVE BAND ━━━ */}
      <div style={{ background:C.surface,border:`1px solid ${C.border}`,borderRadius:14,marginBottom:12,overflow:"hidden" }}>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1px 1fr 1px 1fr",alignItems:"stretch" }}>

          {/* Budget Status */}
          <div style={{ padding:"20px 24px" }}>
            <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12 }}>
              <span style={{ fontSize:10,fontWeight:700,color:C.textMuted,textTransform:"uppercase",letterSpacing:"0.15em" }}>Budget</span>
              <span style={{ fontSize:10,fontWeight:700,color:onBudget?C.positive:overBudget?C.negative:"#D4913B",padding:"2px 6px",borderRadius:3,background:(onBudget?C.positive:overBudget?C.negative:"#D4913B")+"10" }}>
                {onBudget?"On Track":overBudget?"Over Budget":"Watch"}
              </span>
            </div>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14 }}>
              <div><div style={{ fontSize:20,fontWeight:700,color:C.text,fontVariantNumeric:"tabular-nums" }}>{cur(p.financials.total_budget)}</div><div style={{ fontSize:10,color:C.textMuted,marginTop:2 }}>Original Budget</div></div>
              <div><div style={{ fontSize:20,fontWeight:700,color:currentForecast>p.financials.total_budget*1.03?C.negative:C.text,fontVariantNumeric:"tabular-nums" }}>{cur(currentForecast)}</div><div style={{ fontSize:10,color:C.textMuted,marginTop:2 }}>Forecast</div></div>
            </div>
            <div style={{ width:"100%",height:6,background:C.borderLight,borderRadius:3,overflow:"hidden" }}>
              <div style={{ width:`${p.financials.total_budget>0?Math.min(100,Math.round(spent/p.financials.total_budget*100)):0}%`,height:"100%",background:overBudget?C.negative:C.accent,borderRadius:3,transition:"width 0.3s" }} />
            </div>
            <div style={{ display:"flex",justifyContent:"space-between",fontSize:10,color:C.textMuted,marginTop:4 }}>
              <span>{cur(spent)} spent</span>
              <span>{cur(remaining)} remaining</span>
            </div>
          </div>

          <div style={{ background:C.borderLight }} />

          {/* Schedule Status */}
          <div style={{ padding:"20px 24px" }}>
            <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12 }}>
              <span style={{ fontSize:10,fontWeight:700,color:C.textMuted,textTransform:"uppercase",letterSpacing:"0.15em" }}>Schedule</span>
              <span style={{ fontSize:10,fontWeight:700,color:isOverdue?C.negative:C.positive,padding:"2px 6px",borderRadius:3,background:(isOverdue?C.negative:C.positive)+"10" }}>
                {isOverdue?"Behind":"On Track"}
              </span>
            </div>
            {start && end ? (<>
              <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14 }}>
                <div><div style={{ fontSize:20,fontWeight:700,color:C.text }}>{pctTimeline}%</div><div style={{ fontSize:10,color:C.textMuted,marginTop:2 }}>Elapsed</div></div>
                <div><div style={{ fontSize:20,fontWeight:700,color:isOverdue?C.negative:C.text }}>{isOverdue?`+${Math.abs(daysRemaining)}d`:daysRemaining+"d"}</div><div style={{ fontSize:10,color:C.textMuted,marginTop:2 }}>{isOverdue?"Overdue":"Remaining"}</div></div>
              </div>
              <div style={{ width:"100%",height:6,background:C.borderLight,borderRadius:3,overflow:"hidden" }}>
                <div style={{ width:`${pctTimeline}%`,height:"100%",background:isOverdue?C.negative:C.accent,borderRadius:3,transition:"width 0.3s" }} />
              </div>
              <div style={{ display:"flex",justifyContent:"space-between",fontSize:10,color:C.textMuted,marginTop:4 }}>
                <span>{start.toLocaleDateString("en-US",{month:"short",year:"numeric"})}</span>
                <span>{end.toLocaleDateString("en-US",{month:"short",year:"numeric"})}</span>
              </div>
            </>) : (
              <p style={{ fontSize:12,color:C.textMuted,margin:"8px 0 0" }}>Set dates to enable tracking</p>
            )}
          </div>

          <div style={{ background:C.borderLight }} />

          {/* Projected Outcome + Recent */}
          <div style={{ padding:"20px 24px" }}>
            <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12 }}>
              <span style={{ fontSize:10,fontWeight:700,color:C.textMuted,textTransform:"uppercase",letterSpacing:"0.15em" }}>Projected Outcome</span>
              <span style={{ fontSize:10,fontWeight:700,color:projectedMargin>=15?C.positive:projectedMargin>=5?"#D4913B":C.negative,padding:"2px 6px",borderRadius:3,background:(projectedMargin>=15?C.positive:projectedMargin>=5?"#D4913B":C.negative)+"10" }}>
                {projectedMargin}% margin
              </span>
            </div>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:16 }}>
              <div><div style={{ fontSize:20,fontWeight:700,color:projectedProfit>=0?C.positive:C.negative,fontVariantNumeric:"tabular-nums" }}>{cur(projectedProfit)}</div><div style={{ fontSize:10,color:C.textMuted,marginTop:2 }}>Est. Profit</div></div>
              <div><div style={{ fontSize:20,fontWeight:700,color:C.text,fontVariantNumeric:"tabular-nums" }}>{cur(projectedRevenue)}</div><div style={{ fontSize:10,color:C.textMuted,marginTop:2 }}>Revenue</div></div>
            </div>
            {lastActivity && (
              <div style={{ borderTop:`1px solid ${C.borderLight}`,paddingTop:10 }}>
                <div style={{ fontSize:10,fontWeight:600,color:C.textMuted,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:4 }}>Last Update</div>
                <div style={{ fontSize:12,color:C.text,fontWeight:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{lastActivity.icon} {lastActivity.detail}</div>
                <div style={{ fontSize:10,color:C.textMuted,marginTop:1 }}>{lastActivityAgo}</div>
              </div>
            )}
          </div>
        </div>

        {/* Alert strip — compact, only if needed */}
        {healthAlerts.length > 0 && (
          <div style={{ borderTop:`1px solid ${C.borderLight}`,padding:"10px 24px",display:"flex",gap:16,flexWrap:"wrap",background:healthAlerts.some(a=>a.severity==="high")?"rgba(196,86,75,0.02)":"transparent" }}>
            {healthAlerts.map((a,i) => (
              <span key={i} style={{ fontSize:11,color:a.severity==="high"?C.negative:a.severity==="medium"?"#D4913B":C.textMuted,fontWeight:500 }}>
                <span style={{ fontWeight:700 }}>{a.severity==="high"?"\u26A0":"\u25B2"} {a.label}</span>: {a.detail}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Workspace Tabs */}
      <div style={{ display:"flex",borderBottom:`1px solid ${C.border}`,marginBottom:20,gap:4 }}>
        {wsTabBtn("overview","Overview")}
        {wsTabBtn("financials","Financials")}
        {wsTabBtn("tools","Tools",TOOL_REGISTRY.filter(t=>t.status==="active").length)}
        {wsTabBtn("outputs","Outputs",totalOutputs)}
      </div>

      {/* ── OVERVIEW TAB ── */}
      {wsTab === "overview" && (<div style={{ display:"grid",gridTemplateColumns:"2fr 1fr",gap:16 }}>
        {/* Left column */}
        <div>
          {/* Health Alerts (from the financial model) */}
          {healthAlerts.length > 0 && (
            <div style={{...panel,padding:"16px 18px",marginBottom:14 }}>
              <h4 style={{ margin:"0 0 10px",fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",color:C.textMuted }}>Alerts &amp; Risks</h4>
              <div style={{ display:"flex",flexDirection:"column",gap:6 }}>
                {healthAlerts.map((a,i) => (
                  <div key={i} style={{ display:"flex",alignItems:"flex-start",gap:10,padding:"8px 12px",borderRadius:8,background:a.severity==="high"?"rgba(196,86,75,0.04)":a.severity==="medium"?"rgba(212,145,59,0.04)":"rgba(59,139,202,0.03)" }}>
                    <span style={{ fontSize:14,flexShrink:0,marginTop:1 }}>{a.severity==="high"?"\uD83D\uDED1":a.severity==="medium"?"\u26A0\uFE0F":"\u2139\uFE0F"}</span>
                    <div><div style={{ fontSize:12,fontWeight:700,color:a.severity==="high"?C.negative:a.severity==="medium"?"#D4913B":C.accent }}>{a.label}</div><div style={{ fontSize:12,color:C.text,marginTop:1 }}>{a.detail}</div></div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Project Notes */}
          {p.project_info.notes && (
            <div style={{...panel,marginBottom:14}}>
              <h4 style={{ margin:"0 0 8px",fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",color:C.textMuted }}>Project Notes</h4>
              <p style={{ fontSize:14,lineHeight:1.7,color:C.text,margin:0 }}>{p.project_info.notes}</p>
            </div>
          )}

          {/* Latest Saved Outputs — connected to all tools */}
          {(() => {
            const allOutputs = Object.entries(p.tool_outputs).flatMap(([key, outputs]) => outputs.map(o => ({ ...o, _key: key }))).sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5);
            if (allOutputs.length === 0) return null;
            return (
              <div style={{...panel,marginBottom:14}}>
                <h4 style={{ margin:"0 0 10px",fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",color:C.textMuted }}>Latest Project Outputs</h4>
                <div style={{ display:"flex",flexDirection:"column",gap:6 }}>
                  {allOutputs.map(o => {
                    const tool = TOOL_REGISTRY.find(t => t.output_key === o._key);
                    return (
                      <div key={o.id} style={{ display:"flex",alignItems:"center",gap:10,padding:"8px 12px",background:C.surfaceAlt,borderRadius:8 }}>
                        <span style={{ fontSize:18 }}>{tool?.icon || "\uD83D\uDCC1"}</span>
                        <div style={{ flex:1,minWidth:0 }}>
                          <div style={{ fontSize:12,fontWeight:600,color:C.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{o.label || "Output"}</div>
                          <div style={{ fontSize:10,color:C.textMuted }}>{tool?.name || o._key} · {new Date(o.created_at).toLocaleDateString()}</div>
                        </div>
                        {o.data?.computed?.grossProfit !== undefined && (
                          <div style={{ textAlign:"right",flexShrink:0 }}>
                            <div style={{ fontSize:12,fontWeight:700,color:o.data.computed.grossProfit>=0?C.positive:C.negative }}>{cur(o.data.computed.grossProfit)}</div>
                            <div style={{ fontSize:9,color:C.textMuted }}>profit</div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}

          {/* Pro Forma Sync Indicator */}
          {p.financials._proforma_synced && (
            <div style={{...panel,padding:"12px 16px",marginBottom:14,borderColor:"rgba(59,139,202,0.2)",background:"rgba(59,139,202,0.03)" }}>
              <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                <span style={{ fontSize:14 }}>\uD83D\uDD17</span>
                <div>
                  <div style={{ fontSize:12,fontWeight:600,color:C.accent }}>Financials synced from Pro Forma</div>
                  <div style={{ fontSize:11,color:C.textMuted }}>Revenue and profit projections updated {new Date(p.financials._proforma_synced).toLocaleDateString()} · Margin: {p.financials._proforma_margin || 0}%</div>
                </div>
              </div>
            </div>
          )}

          {/* Monthly Chart */}
          {monthlyData.length > 0 && (
            <div style={{...panel,padding:"16px 14px 10px"}}>
              <h4 style={{ margin:"0 0 10px",fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",color:C.textMuted,padding:"0 8px" }}>Monthly Cost vs Revenue</h4>
              <ResponsiveContainer width="100%" height={190}>
                <BarChart data={monthlyData} margin={{top:5,right:10,bottom:5,left:0}}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.borderLight} />
                  <XAxis dataKey="month" tick={{fontSize:9,fill:C.textMuted}} interval={Math.max(0,Math.floor(monthlyData.length/8)-1)} />
                  <YAxis tick={{fontSize:9,fill:C.textMuted}} tickFormatter={v=>curK(v)} />
                  <Tooltip content={<ChartTooltip />} />
                  <Bar dataKey="planned" name="Planned" fill={C.accent} opacity={0.3} radius={[2,2,0,0]} />
                  <Bar dataKey="actual" name="Actual" fill={C.accent} radius={[2,2,0,0]} />
                  <Bar dataKey="revenue" name="Revenue" fill={C.positive} radius={[2,2,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Right column */}
        <div style={{ display:"flex",flexDirection:"column",gap:14 }}>
          {/* Quick Project Stats */}
          <div style={panel}>
            <h4 style={{ margin:"0 0 10px",fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",color:C.textMuted }}>Project Summary</h4>
            {[
              {l:"Development Type",v:p.project_info.development_type},
              {l:"Total Lots",v:p.project_info.lot_count || "\u2014"},
              {l:"Per Home Target",v:cur(p.financials.target_price_per_home)},
              {l:"Land Cost",v:cur(p.financials.land_cost)},
              {l:"Last Updated",v:new Date(p.updated_at).toLocaleDateString()},
              {l:"Tool Outputs",v:totalOutputs},
            ].map((s,i) => (
              <div key={i} style={{ display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:i<5?`1px solid ${C.borderLight}`:"none" }}>
                <span style={{ fontSize:12,color:C.textMuted }}>{s.l}</span>
                <span style={{ fontSize:12,fontWeight:600,color:C.text }}>{s.v}</span>
              </div>
            ))}
          </div>

          {/* Activity Feed */}
          <div style={{...panel,flex:1}}>
            <h4 style={{ margin:"0 0 12px",fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",color:C.textMuted }}>Recent Activity</h4>
            {(!p.activity || p.activity.length === 0) ? (
              <p style={{ color:C.textMuted,fontSize:12,textAlign:"center",padding:"16px 0" }}>No activity yet.</p>
            ) : (
              <div style={{ display:"flex",flexDirection:"column",gap:0 }}>
                {(p.activity || []).slice(0,12).map((a,i) => {
                  const ts = new Date(a.timestamp);
                  const ago = timeAgo(a.timestamp);
                  return (
                    <div key={a.id||i} style={{ display:"flex",gap:8,padding:"8px 0",borderBottom:i<Math.min((p.activity||[]).length-1,11)?`1px solid ${C.borderLight}`:"none" }}>
                      <span style={{ fontSize:13,flexShrink:0,marginTop:1 }}>{a.icon || "\u25CF"}</span>
                      <div style={{ flex:1,minWidth:0 }}>
                        <div style={{ fontSize:12,fontWeight:500,color:C.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{a.detail}</div>
                        <div style={{ fontSize:10,color:C.textMuted }}>{ago}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>)}

      {/* ── FINANCIALS TAB ── */}
      {wsTab === "financials" && (<div>
        {/* Budget Category Breakdown */}
        <div style={{...panel,overflow:"hidden",padding:0,marginBottom:16}}>
          <div style={{ padding:"16px 20px 12px",borderBottom:`1px solid ${C.borderLight}` }}>
            <h4 style={{ margin:0,fontSize:13,fontWeight:700,color:C.text }}>Budget by Category</h4>
          </div>
          <table style={{ width:"100%",borderCollapse:"collapse",fontSize:12 }}>
            <thead><tr style={{ background:C.surfaceAlt,borderBottom:`1px solid ${C.border}` }}>
              {["Category","Budget","Actual","Committed","Remaining","% Used"].map(h => (
                <th key={h} style={{ padding:"9px 16px",textAlign:h==="Category"?"left":"right",fontSize:10,fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",color:C.textMuted }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>{catData.map((cat,i) => (
              <tr key={cat.id} style={{ borderBottom:i<catData.length-1?`1px solid ${C.borderLight}`:"none" }}>
                <td style={{ padding:"10px 16px",fontWeight:500 }}>{cat.name}</td>
                <td style={{ padding:"10px 16px",textAlign:"right",fontVariantNumeric:"tabular-nums" }}>{curK(cat.budget)}</td>
                <td style={{ padding:"10px 16px",textAlign:"right",fontVariantNumeric:"tabular-nums" }}>{curK(cat.actual)}</td>
                <td style={{ padding:"10px 16px",textAlign:"right",fontVariantNumeric:"tabular-nums",color:C.textMuted }}>{curK(cat.committed)}</td>
                <td style={{ padding:"10px 16px",textAlign:"right",fontVariantNumeric:"tabular-nums",color:cat.remaining<=0?C.negative:C.text }}>{curK(cat.remaining)}</td>
                <td style={{ padding:"10px 16px",textAlign:"right" }}>
                  <div style={{ display:"flex",alignItems:"center",justifyContent:"flex-end",gap:8 }}>
                    <div style={{ width:48,height:5,background:C.borderLight,borderRadius:3,overflow:"hidden" }}>
                      <div style={{ width:`${Math.min(cat.pctUsed,100)}%`,height:"100%",background:cat.pctUsed>90?C.negative:cat.pctUsed>75?"#D4913B":C.accent,borderRadius:3 }} />
                    </div>
                    <span style={{ fontSize:11,fontWeight:600,color:cat.pctUsed>90?C.negative:C.text,minWidth:28 }}>{cat.pctUsed}%</span>
                  </div>
                </td>
              </tr>
            ))}</tbody>
            <tfoot><tr style={{ background:C.surfaceAlt,borderTop:`2px solid ${C.border}` }}>
              <td style={{ padding:"10px 16px",fontWeight:700 }}>Total</td>
              <td style={{ padding:"10px 16px",textAlign:"right",fontWeight:700 }}>{cur(catData.reduce((s,c)=>s+c.budget,0))}</td>
              <td style={{ padding:"10px 16px",textAlign:"right",fontWeight:700 }}>{cur(catData.reduce((s,c)=>s+c.actual,0))}</td>
              <td style={{ padding:"10px 16px",textAlign:"right",fontWeight:700,color:C.textMuted }}>{cur(catData.reduce((s,c)=>s+c.committed,0))}</td>
              <td style={{ padding:"10px 16px",textAlign:"right",fontWeight:700 }}>{cur(catData.reduce((s,c)=>s+c.remaining,0))}</td>
              <td style={{ padding:"10px 16px",textAlign:"right",fontWeight:700 }}>{p.financials.total_budget>0?Math.round(catData.reduce((s,c)=>s+c.actual,0)/p.financials.total_budget*100):0}%</td>
            </tr></tfoot>
          </table>
        </div>

        {/* Cash Flow Chart */}
        {monthlyData.length > 0 ? (<>
          <div style={{...panel,padding:"16px 14px 10px",marginBottom:16}}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",padding:"0 8px",marginBottom:12 }}>
              <h4 style={{ margin:0,fontSize:13,fontWeight:700,color:C.text }}>Monthly Cash Flow</h4>
              <div style={{ display:"flex",gap:16,fontSize:10,color:C.textMuted }}>
                <span><span style={{ display:"inline-block",width:10,height:10,borderRadius:2,background:C.accent,marginRight:4,verticalAlign:"middle" }}></span>Planned</span>
                <span><span style={{ display:"inline-block",width:10,height:10,borderRadius:2,background:C.negative,marginRight:4,verticalAlign:"middle" }}></span>Actual</span>
                <span><span style={{ display:"inline-block",width:10,height:10,borderRadius:2,background:C.positive,marginRight:4,verticalAlign:"middle" }}></span>Revenue</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={monthlyData} margin={{top:5,right:10,bottom:5,left:0}}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.borderLight} />
                <XAxis dataKey="month" tick={{fontSize:9,fill:C.textMuted}} interval={Math.max(0,Math.floor(monthlyData.length/8)-1)} />
                <YAxis tick={{fontSize:9,fill:C.textMuted}} tickFormatter={v=>curK(v)} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="planned" name="Planned" fill={C.accent} opacity={0.3} radius={[2,2,0,0]} />
                <Bar dataKey="actual" name="Actual" fill={C.negative} opacity={0.85} radius={[2,2,0,0]} />
                <Bar dataKey="revenue" name="Revenue" fill={C.positive} opacity={0.85} radius={[2,2,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Month-by-Month Tracking Table */}
          <div style={{...panel,overflow:"hidden",padding:0}}>
            <div style={{ padding:"16px 20px 12px",borderBottom:`1px solid ${C.borderLight}` }}>
              <h4 style={{ margin:0,fontSize:13,fontWeight:700,color:C.text }}>Month-by-Month Detail</h4>
            </div>
            <div style={{ overflowX:"auto" }}>
            <table style={{ width:"100%",borderCollapse:"collapse",fontSize:12,minWidth:800 }}>
              <thead><tr style={{ background:C.surfaceAlt,borderBottom:`1px solid ${C.border}` }}>
                {["Month","Planned","Actual","Variance","Cum. Spend","Committed","Revenue","Net Cash"].map(h => (
                  <th key={h} style={{ padding:"9px 14px",textAlign:h==="Month"?"left":"right",fontSize:10,fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",color:C.textMuted,whiteSpace:"nowrap" }}>{h}</th>
                ))}
              </tr></thead>
              <tbody>{monthlyData.map((m,i) => {
                const v = m.isPast ? m.actual - m.planned : 0;
                return (<tr key={i} style={{ borderBottom:i<monthlyData.length-1?`1px solid ${C.borderLight}`:"none",background:m.isCurrent?"rgba(59,139,202,0.04)":"transparent" }}>
                  <td style={{ padding:"8px 14px",fontWeight:m.isCurrent?700:m.isPast?500:400,color:m.isCurrent?C.accent:C.text }}>
                    {m.month}
                    {m.isCurrent&&<span style={{ fontSize:8,background:C.accent,color:"#fff",padding:"1px 5px",borderRadius:3,marginLeft:6,verticalAlign:"middle",fontWeight:700 }}>NOW</span>}
                    {!m.isPast&&!m.isCurrent&&<span style={{ fontSize:9,color:C.textMuted,marginLeft:4 }}>fcst</span>}
                  </td>
                  <td style={{ padding:"8px 14px",textAlign:"right",fontVariantNumeric:"tabular-nums" }}>{curK(m.planned)}</td>
                  <td style={{ padding:"8px 14px",textAlign:"right",fontVariantNumeric:"tabular-nums" }}>{m.isPast?curK(m.actual):"\u2014"}</td>
                  <td style={{ padding:"8px 14px",textAlign:"right",fontWeight:600,color:v>0?C.negative:v<0?C.positive:C.textMuted }}>{m.isPast?(v>0?"+":"")+curK(v):"\u2014"}</td>
                  <td style={{ padding:"8px 14px",textAlign:"right",fontVariantNumeric:"tabular-nums",color:C.textMuted }}>{curK(m.cumActual || m.cumPlanned)}</td>
                  <td style={{ padding:"8px 14px",textAlign:"right",fontVariantNumeric:"tabular-nums",color:m.committed?"#D4913B":C.textMuted }}>{m.committed?curK(m.committed):"\u2014"}</td>
                  <td style={{ padding:"8px 14px",textAlign:"right",fontVariantNumeric:"tabular-nums",color:m.revenue?C.positive:C.textMuted }}>{m.revenue?curK(m.revenue):"\u2014"}</td>
                  <td style={{ padding:"8px 14px",textAlign:"right",fontWeight:600,color:m.netCash>=0?C.positive:C.negative }}>{curK(m.netCash)}</td>
                </tr>);
              })}</tbody>
              <tfoot><tr style={{ background:C.surfaceAlt,borderTop:`2px solid ${C.border}` }}>
                <td style={{ padding:"9px 14px",fontWeight:700 }}>Total</td>
                <td style={{ padding:"9px 14px",textAlign:"right",fontWeight:700 }}>{cur(monthlyData.reduce((s,d)=>s+d.planned,0))}</td>
                <td style={{ padding:"9px 14px",textAlign:"right",fontWeight:700 }}>{cur(spent)}</td>
                <td style={{ padding:"9px 14px",textAlign:"right",fontWeight:700,color:budgetVariance>0?C.negative:C.positive }}>{budgetVariance>0?"+":""}{budgetVariance}%</td>
                <td style={{ padding:"9px 14px",textAlign:"right",fontWeight:700 }}>{cur(spent)}</td>
                <td style={{ padding:"9px 14px",textAlign:"right",fontWeight:700,color:"#D4913B" }}>{cur(totalCommitted)}</td>
                <td style={{ padding:"9px 14px",textAlign:"right",fontWeight:700,color:C.positive }}>{cur(monthlyData.reduce((s,d)=>s+d.revenue,0))}</td>
                <td style={{ padding:"9px 14px",textAlign:"right",fontWeight:700,color:projectedProfit>=0?C.positive:C.negative }}>{cur(projectedProfit)}</td>
              </tr></tfoot>
            </table>
            </div>
          </div>
        </>) : (
          <div style={{...panel,textAlign:"center",padding:"48px 24px"}}><p style={{ color:C.textMuted,fontSize:14 }}>Set project start and completion dates to enable financial tracking.</p></div>
        )}
      </div>)}

      {/* ── TOOLS TAB ── */}
      {wsTab === "tools" && (
        <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:12 }}>
          {TOOL_REGISTRY.map(tool=>(<div key={tool.id} onClick={()=>{if(tool.status==="active"){setActiveTool(tool);setView("tool");}}}
            style={{ background:C.surface,border:`1px solid ${C.borderLight}`,borderRadius:12,padding:20,cursor:tool.status==="active"?"pointer":"default",opacity:tool.status==="active"?1:0.4,transition:"all 0.15s" }}
            onMouseEnter={e=>{if(tool.status==="active"){e.currentTarget.style.borderColor=C.accent;e.currentTarget.style.boxShadow="0 4px 16px rgba(0,0,0,0.06)";}}} onMouseLeave={e=>{e.currentTarget.style.borderColor=C.borderLight;e.currentTarget.style.boxShadow="none";}}>
            <div style={{ fontSize:32,marginBottom:12 }}>{tool.icon}</div>
            <div style={{ fontWeight:700,fontSize:14,color:C.text,marginBottom:4 }}>{tool.name}</div>
            <div style={{ fontSize:12,color:C.textMuted,lineHeight:1.5,marginBottom:10 }}>{tool.description}</div>
            <span style={tag(tool.status==="active")}>{tool.status==="active"?"Launch":"Coming Soon"}</span>
          </div>))}
        </div>
      )}

      {/* ── OUTPUTS TAB ── */}
      {wsTab === "outputs" && (
        <div>
          {totalOutputs===0?(<div style={{...panel,textAlign:"center",padding:"48px 24px"}}><div style={{ fontSize:36,marginBottom:10,opacity:0.15 }}>📁</div><p style={{ color:C.textMuted,fontSize:14 }}>No outputs yet. Run a tool to generate project data.</p></div>):(
            <div style={{ display:"grid",gap:10 }}>{Object.entries(p.tool_outputs).map(([key,outputs])=>outputs.map(output=>{
              const tool=TOOL_REGISTRY.find(t=>t.output_key===key);
              return (<div key={output.id} style={{...panel,padding:"16px 18px",display:"flex",justifyContent:"space-between",alignItems:"center" }}>
                <div style={{ display:"flex",gap:14,alignItems:"center" }}><span style={{ fontSize:24 }}>{tool?.icon||"📁"}</span><div>
                  <div style={{ fontWeight:600,fontSize:14,color:C.text }}>{output.label||"Output"}</div>
                  <div style={{ fontSize:11,color:C.textMuted,marginTop:2 }}>{tool?.name||key} · {new Date(output.created_at).toLocaleDateString()}</div>
                  {output.data?.computed&&<div style={{ fontSize:11,color:C.accent,marginTop:3 }}>
                    {output.data.computed.grossProfit!==undefined?`Profit: ${cur(output.data.computed.grossProfit)}`:""}
                    {output.data.computed.margin?` (${output.data.computed.margin}% margin)`:""}
                  </div>}
                </div></div>
                <button onClick={e=>{e.stopPropagation();deleteOutput(key,output.id);}} style={{...btnOutline,color:C.negative,borderColor:"rgba(196,86,75,0.3)",padding:"6px 14px",fontSize:12}}>Remove</button>
              </div>);
            }))}</div>
          )}
        </div>
      )}
    </div>);
  };

  if (!isAuthenticated) return <LoginScreen onLogin={() => setIsAuthenticated(true)} />;

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <style>{`
        *{box-sizing:border-box;margin:0} body{background:${C.bg}!important}
        ::selection{background:${C.accentSoft};color:${C.accent}}
        input:focus,select:focus,textarea:focus{border-color:${C.accent}!important;outline:none}
        @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes toastIn{from{opacity:0;transform:translate(-50%,12px)}to{opacity:1;transform:translate(-50%,0)}}
        ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:rgba(0,0,0,.1);border-radius:3px}
        input[type="range"]::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:14px;cursor:pointer}
      `}</style>
      <div style={{ fontFamily:font,background:C.bg,color:C.text,minHeight:"100vh",display:"flex",flexDirection:"column",WebkitFontSmoothing:"antialiased" }}>
        {/* Header */}
        <header style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 28px",background:C.surface,borderBottom:`1px solid ${C.border}`,position:"sticky",top:0,zIndex:50 }}>
          <div style={{ display:"flex",alignItems:"center",gap:14,cursor:"pointer" }} onClick={()=>{setActiveProjectId(null);setView("home");}}>
            <img src={NW_LOGO_TAG} alt="Next Wave" style={{ height:42,width:"auto" }} />
          </div>
          <div style={{ display:"flex",alignItems:"center",gap:12 }}>
            {projects.length>0&&(<select style={{...fieldInput,width:"auto",minWidth:200,padding:"7px 12px",fontSize:12,cursor:"pointer"}} value={activeProjectId||""} onChange={e=>{const id=e.target.value;if(id){setActiveProjectId(id);setWsTab("overview");setView("workspace");}else{setActiveProjectId(null);setView("home");}}}>
              <option value="">Select Project...</option>{projects.map(p=>(<option key={p.id} value={p.id}>{p.project_info.name}</option>))}
            </select>)}
            <button style={btnOutline} onClick={()=>{setActiveProjectId(null);setView("home");}}>Home</button>
          </div>
        </header>
        <main style={{ flex:1,padding:"28px 32px",maxWidth:1200,width:"100%",margin:"0 auto",animation:"fadeUp 0.25s ease" }}>
          {loading ? (
            <div style={{ textAlign:"center",padding:"120px 0" }}>
              <div style={{ fontSize:32,marginBottom:16 }}>⚡</div>
              <div style={{ fontSize:16,fontWeight:600,color:C.text,marginBottom:4 }}>Loading Next Wave...</div>
              <div style={{ fontSize:13,color:C.textMuted }}>Connecting to database</div>
            </div>
          ) : (<>
          {view==="home"&&renderHome()}
          {view==="create"&&renderForm(false)}
          {view==="edit"&&renderForm(true)}
          {view==="workspace"&&renderWorkspace()}
          {view==="tool"&&activeTool?.component&&activeProject&&(
            <activeTool.component project={activeProject} onSave={handleToolSave} onClose={()=>{setActiveTool(null);setView("workspace");}} />
          )}
          </>)}
        </main>
        {toast&&(<div style={{ position:"fixed",bottom:28,left:"50%",transform:"translateX(-50%)",background:C.surface,border:`1px solid ${C.accent}`,color:C.accent,padding:"10px 22px",borderRadius:10,fontSize:13,fontWeight:600,boxShadow:"0 4px 16px rgba(0,0,0,0.08)",animation:"toastIn 0.2s ease",zIndex:100 }}>{toast}</div>)}
      </div>
    </>
  );
}
