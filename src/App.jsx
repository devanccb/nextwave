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

function monthLabel(mo) {
  const names = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const startMonth = 1; // Feb = index 1
  const startYear = 2026;
  const totalMonths = startMonth + mo - 1;
  const year = startYear + Math.floor(totalMonths / 12);
  const monthIdx = totalMonths % 12;
  return `${names[monthIdx]} ${year}`;
}

// ─── Carousel ───
function Carousel({ children }) {
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

function Stat({ label, value, color, size="lg" }) {
  const isLg = size === "lg";
  return (<div>
    <div style={{ fontSize:isLg?"36px":"24px",fontWeight:700,color:color||C.text,letterSpacing:"-0.03em",lineHeight:1.1,fontVariantNumeric:"tabular-nums" }}>{value}</div>
    <div style={{ fontSize:isLg?"15px":"13px",color:C.textMid,marginTop:isLg?"8px":"6px",fontWeight:600,letterSpacing:"0.01em",textTransform:"uppercase" }}>{label}</div>
  </div>);
}

function CostRow({ label, value, pctVal, barColor }) {
  return (<div style={{ display:"flex",alignItems:"center",gap:"16px",padding:"10px 0",borderBottom:`1px solid ${C.borderLight}` }}>
    <div style={{ flex:1,fontSize:"15px",color:C.textMid,fontWeight:500 }}>{label}</div>
    <div style={{ width:"120px" }}><div style={{ height:"6px",borderRadius:"3px",background:C.surfaceAlt,overflow:"hidden" }}>
      <div style={{ height:"100%",width:`${Math.min(pctVal*100,100)}%`,borderRadius:"3px",background:barColor||C.accent,transition:"width 0.6s" }} />
    </div></div>
    <div style={{ width:"110px",textAlign:"right",fontSize:"15px",fontWeight:600,color:C.text,fontVariantNumeric:"tabular-nums" }}>{$f(value)}</div>
  </div>);
}

// ─── Input Box Component ───
function InputBox({ label, value, type="currency", onChange, helper }) {
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
    if (type === "date") return str; // date parsing handled by caller
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

  const commit = () => {
    setFocused(false);
    onChange(parse(raw));
  };

  return (
    <div style={{ marginBottom: "16px" }}>
      <label style={{ display: "block", fontSize: "12px", color: C.textMid, fontWeight: 500, marginBottom: "5px", letterSpacing: "0.01em" }}>
        {label}
      </label>
      {focused ? (
        <input autoFocus value={raw} onChange={e => setRaw(e.target.value)}
          onBlur={commit} onKeyDown={e => e.key === "Enter" && commit()}
          style={{
            width: "100%", padding: "9px 12px", fontSize: "14px", fontWeight: 600,
            border: `1.5px solid ${C.accent}`, borderRadius: "8px", outline: "none",
            fontFamily: font, color: C.text, background: "#fff",
            fontVariantNumeric: "tabular-nums",
          }} />
      ) : (
        <div onClick={startEdit} style={{
          width: "100%", padding: "9px 12px", fontSize: "14px", fontWeight: 600,
          border: `1px solid ${C.border}`, borderRadius: "8px", cursor: "text",
          fontFamily: font, color: C.text, background: C.surface,
          fontVariantNumeric: "tabular-nums", transition: "border-color 0.15s",
        }}
          onMouseOver={e => e.currentTarget.style.borderColor = C.textMuted}
          onMouseOut={e => e.currentTarget.style.borderColor = C.border}
        >
          {display()}
        </div>
      )}
      {helper && (
        <div style={{ fontSize: "11px", color: C.textMuted, marginTop: "4px", fontStyle: "italic" }}>{helper}</div>
      )}
    </div>
  );
}

function SectionHeader({ children }) {
  return (
    <div style={{
      fontSize: "11px", fontWeight: 700, color: C.accent, textTransform: "uppercase",
      letterSpacing: "0.08em", marginBottom: "14px", marginTop: "8px",
      paddingBottom: "8px", borderBottom: `1.5px solid ${C.borderLight}`,
    }}>{children}</div>
  );
}

// ─── AI File Drop ───
// ─── AI Chat (floating) ───
function AIChat({ assumptions, metrics, scenario }) {
  const [msgs, setMsgs] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const ref = useRef(null);
  useEffect(() => { if (ref.current) ref.current.scrollTop = ref.current.scrollHeight; }, [msgs]);
  const send = useCallback(async () => {
    if (!input.trim()||loading) return;
    const q=input.trim();setInput("");setMsgs(m=>[...m,{r:"u",t:q}]);setLoading(true);
    const sys=`You are an AI deal analyst for FaceOff Pro Forma — Mirimar Modular Housing. Scenario: ${scenario}. Total Capital: ${$f(metrics.totalCapital)}, Purchase XIRR: ${pct(metrics.purchaseXirr)}, Non-Purchase XIRR: ${pct(metrics.nonPurchaseXirr)}, Break-Even: ${$f(metrics.breakEvenPrice)}, Safety: ${pct(metrics.marginOfSafety)}, Net Return: ${$f(metrics.totalReturn)}, RM Return: ${$f(metrics.rmReturn)}. ${assumptions.marketRateUnits+assumptions.affordableUnits} homes, ${assumptions.projectMonths}mo. Be concise (2-3 sentences), use numbers.`;
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

// ─── XIRR: Newton-Raphson solver (matches Excel's XIRR function exactly) ───
function xirrDate(year, month, day) {
  return new Date(year, month - 1, day || 1);
}
function xirrLastDay(year, month) {
  return new Date(year, month, 0).getDate();
}
function xirrSolve(cashflows) {
  // cashflows = [{date: Date, amount: number}, ...]
  // Returns annualized rate using Newton-Raphson, same as Excel XIRR
  if (!cashflows.length) return 0;
  const d0 = cashflows[0].date.getTime();
  const dayFrac = (d) => (d.getTime() - d0) / 86400000 / 365;
  const fracs = cashflows.map(cf => dayFrac(cf.date));
  const amounts = cashflows.map(cf => cf.amount);

  let rate = 0.1; // initial guess
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

// ─── Calculation engine (matches Excel Pro Forma sheet exactly) ───
function calcScenario(a, resalePrice, affordableResalePrice) {
  const mktU=Math.max(a.marketRateUnits,0), affU=Math.max(a.affordableUnits,0), totalUnits=mktU+affU, months=Math.max(a.projectMonths,1);
  const mktCostPerSF=a.marketCostPerSF||0, affCostPerSF=a.affordableCostPerSF||0;

  // Excel: Purchase & Permitting = Purchase Price + Permitting Costs
  const purchaseCost=(a.purchasePrice||0)+(a.permittingCosts||0);

  // Capital vs proceeds split (Excel B5/B6/B8/B9)
  const capMkt=Math.min(a.capitalMarketUnits||0,mktU);
  const capAff=Math.min(a.capitalAffordableUnits||0,affU);
  const capProd=(capMkt*a.marketSF*mktCostPerSF)+(capAff*a.affordableSF*affCostPerSF);
  const procMkt=mktU-capMkt, procAff=affU-capAff;
  const procProd=(procMkt*a.marketSF*mktCostPerSF)+(procAff*a.affordableSF*affCostPerSF);

  // Site costs (Excel row 6: Site work & permitting related costs)
  const siteMiscCosts=a.siteWork||0;

  // Total capital required (Excel row 7 = Purchase + Capital Production + Site)
  const totalCapital=purchaseCost+capProd+siteMiscCosts;

  // Revenue (Excel rows 9-10, uses per-scenario affordable resale)
  const affResale=affordableResalePrice!=null?affordableResalePrice:(a.affordableResaleMid||0);
  const gross=(mktU*resalePrice)+(affU*affResale);
  const netSales=gross*(1-a.commissionRate);

  // 3-tranche preferred return (Excel rows 1-3)
  const prefPurchase=purchaseCost*a.prefRatePurchase/12*months;
  const prefSite=siteMiscCosts*a.prefRateOther/12*Math.max(months-a.monthSiteWorkCapital,0);
  const prefModular=capProd*a.prefRateOther/12*Math.max(months-a.monthModularCapital,0);
  const totalPref=prefPurchase+prefSite+prefModular;

  // Total Return (Excel row 11 = Net - Capital - Proceeds - All Prefs)
  const totalReturn=netSales-totalCapital-procProd-totalPref;
  const returnPct=totalCapital>0?totalReturn/totalCapital:0;

  // RM return (Excel row 13 = totalReturn × profitShare + all prefs)
  const rmProfit=totalReturn*a.rmProfitShare;
  const lpProfit=totalReturn*(1-a.rmProfitShare);
  const rmReturn=rmProfit+totalPref;

  // ─── TWO-TRANCHE XIRR (Newton-Raphson — same algorithm as Excel's XIRR) ───
  // Purchase capital: separate deploy & exit dates
  const purchaseXirrReturn=purchaseCost+prefPurchase;
  const purchDeploy=xirrDate(a.purchDeployYear,a.purchDeployMonth,a.purchDeployDay||1);
  const purchExit=xirrDate(a.purchExitYear,a.purchExitMonth,a.purchExitDay||xirrLastDay(a.purchExitYear,a.purchExitMonth));
  const purchaseXirr=purchaseCost>0?xirrSolve([
    {date:purchDeploy,amount:-purchaseCost},
    {date:purchExit,amount:purchaseXirrReturn},
  ]):0;
  const purchaseEqMult=purchaseCost>0?prefPurchase/purchaseCost:0;
  const purchaseHoldMonths=Math.round((purchExit-purchDeploy)/86400000/30.44);

  // Non-purchase capital: separate deploy & exit dates
  const nonPurchaseCapital=totalCapital-purchaseCost;
  const nonPurchaseXirrReturn=nonPurchaseCapital+rmReturn;
  const npDeploy=xirrDate(a.npDeployYear,a.npDeployMonth,a.npDeployDay||1);
  const npExit=xirrDate(a.npExitYear,a.npExitMonth,a.npExitDay||xirrLastDay(a.npExitYear,a.npExitMonth));
  const nonPurchaseXirr=nonPurchaseCapital>0?xirrSolve([
    {date:npDeploy,amount:-nonPurchaseCapital},
    {date:npExit,amount:nonPurchaseXirrReturn},
  ]):0;
  const nonPurchaseEqMult=nonPurchaseCapital>0?(nonPurchaseXirrReturn-nonPurchaseCapital)/nonPurchaseCapital:0;
  const nonPurchaseHoldMonths=Math.round((npExit-npDeploy)/86400000/30.44);

  // Break-even
  const nc=1-a.commissionRate;
  const be=(mktU>0&&nc>0)?((totalCapital+procProd+totalPref)-(affU*affResale*nc))/(mktU*nc):0;
  const cushion=resalePrice-be, safety=resalePrice>0?cushion/resalePrice:0;

  // Break-even month
  const ss=Math.min(a.monthModularCapital+3,months), sell=Math.max(months-ss+1,1);
  const avgNet=totalUnits>0?netSales/totalUnits:0;
  const allCosts=totalCapital+procProd+totalPref;
  const uBE=avgNet>0?allCosts/avgNet:totalUnits;
  const mSell=totalUnits>0?Math.ceil((uBE/totalUnits)*sell):sell;
  const beMo=Math.min(ss+mSell-1,months);

  return {resalePrice,gross,netSales,capProd,procProd,siteMiscCosts,totalCapital,purchaseCost,
    prefPurchase,prefSite,prefModular,totalPref,totalReturn,returnPct,
    rmProfit,lpProfit,rmReturn,
    purchaseXirrReturn,purchaseXirr,purchaseEqMult,purchaseHoldMonths,
    nonPurchaseCapital,nonPurchaseXirrReturn,nonPurchaseHoldMonths,nonPurchaseXirr,nonPurchaseEqMult,
    be,cushion,safety,beMo,mktCostPerSF,affCostPerSF,capMkt,capAff,totalUnits};
}

function downloadExcel(a) {
  // Ensure all fields have safe defaults for export
  a = { ...DEFAULT_ASSUMPTIONS, ...a };
  const lo=calcScenario(a,a.marketResaleLow,a.affordableResaleLow), mi=calcScenario(a,a.marketResaleMid,a.affordableResaleMid), hi=calcScenario(a,a.marketResaleHigh,a.affordableResaleHigh);
  const units=a.marketRateUnits+a.affordableUnits;
  const date=new Date().toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"});
  const ss=Math.min(a.monthModularCapital+3,a.projectMonths);
  const p=v=>`${(v*100).toFixed(1)}%`;
  const p2=v=>`${(v*100).toFixed(2)}%`;
  const esc=v=>String(v).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");

  // XIRR dates from assumptions (exact day, separate for purchase and non-purchase)
  const purchDeployDate=`${a.purchDeployMonth}/${a.purchDeployDay||1}/${a.purchDeployYear}`;
  const purchExitDate=`${a.purchExitMonth}/${a.purchExitDay||new Date(a.purchExitYear,a.purchExitMonth,0).getDate()}/${a.purchExitYear}`;
  const npDeployDate=`${a.npDeployMonth}/${a.npDeployDay||1}/${a.npDeployYear}`;
  const npExitDate=`${a.npExitMonth}/${a.npExitDay||new Date(a.npExitYear,a.npExitMonth,0).getDate()}/${a.npExitYear}`;

  const styles = `<Styles>
<Style ss:ID="Default"><Font ss:FontName="Arial" ss:Size="11" ss:Color="#1A1A1A"/></Style>
<Style ss:ID="h1"><Font ss:FontName="Arial" ss:Size="14" ss:Bold="1" ss:Color="#FFFFFF"/><Interior ss:Color="#2C3345" ss:Pattern="Solid"/></Style>
<Style ss:ID="h2"><Font ss:FontName="Arial" ss:Size="11" ss:Color="#FFFFFF"/><Interior ss:Color="#2C3345" ss:Pattern="Solid"/></Style>
<Style ss:ID="hdr"><Font ss:FontName="Arial" ss:Size="11" ss:Bold="1" ss:Color="#FFFFFF"/><Interior ss:Color="#2C3345" ss:Pattern="Solid"/><Alignment ss:Horizontal="Left"/></Style>
<Style ss:ID="hdrC"><Font ss:FontName="Arial" ss:Size="11" ss:Bold="1" ss:Color="#FFFFFF"/><Interior ss:Color="#2C3345" ss:Pattern="Solid"/><Alignment ss:Horizontal="Center"/></Style>
<Style ss:ID="d"><Font ss:FontName="Arial" ss:Size="10" ss:Color="#333333"/><Borders><Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/></Borders></Style>
<Style ss:ID="dB"><Font ss:FontName="Arial" ss:Size="10" ss:Bold="1" ss:Color="#1A1A1A"/><Borders><Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/></Borders></Style>
<Style ss:ID="dBM"><Font ss:FontName="Arial" ss:Size="10" ss:Bold="1" ss:Color="#1A1A1A"/><Borders><Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="2"/></Borders></Style>
<Style ss:ID="dC"><Font ss:FontName="Arial" ss:Size="10" ss:Color="#333333"/><Alignment ss:Horizontal="Center"/><Borders><Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/></Borders></Style>
<Style ss:ID="dR"><Font ss:FontName="Arial" ss:Size="10" ss:Color="#333333"/><Alignment ss:Horizontal="Right"/><Borders><Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/></Borders></Style>
<Style ss:ID="dRB"><Font ss:FontName="Arial" ss:Size="10" ss:Bold="1" ss:Color="#1A1A1A"/><Alignment ss:Horizontal="Right"/><Borders><Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/></Borders></Style>
<Style ss:ID="$"><Font ss:FontName="Arial" ss:Size="10" ss:Color="#333333"/><NumberFormat ss:Format="_($ * #,##0.00_);_($ * (#,##0.00);_($ * &quot;-&quot;_);_(@_)"/><Alignment ss:Horizontal="Center"/><Borders><Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/></Borders></Style>
<Style ss:ID="$B"><Font ss:FontName="Arial" ss:Size="10" ss:Bold="1" ss:Color="#1A1A1A"/><NumberFormat ss:Format="_($ * #,##0.00_);_($ * (#,##0.00);_($ * &quot;-&quot;_);_(@_)"/><Alignment ss:Horizontal="Center"/><Borders><Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="2"/></Borders></Style>
<Style ss:ID="$R"><Font ss:FontName="Arial" ss:Size="10" ss:Color="#333333"/><NumberFormat ss:Format="_($ * #,##0.00_);_($ * (#,##0.00);_($ * &quot;-&quot;_);_(@_)"/><Alignment ss:Horizontal="Right"/><Borders><Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/></Borders></Style>
<Style ss:ID="$RB"><Font ss:FontName="Arial" ss:Size="10" ss:Bold="1" ss:Color="#1A1A1A"/><NumberFormat ss:Format="_($ * #,##0.00_);_($ * (#,##0.00);_($ * &quot;-&quot;_);_(@_)"/><Alignment ss:Horizontal="Right"/><Borders><Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/></Borders></Style>
<Style ss:ID="$RBM"><Font ss:FontName="Arial" ss:Size="10" ss:Bold="1" ss:Color="#1A1A1A"/><NumberFormat ss:Format="_($ * #,##0.00_);_($ * (#,##0.00);_($ * &quot;-&quot;_);_(@_)"/><Alignment ss:Horizontal="Right"/><Borders><Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="2"/></Borders></Style>
<Style ss:ID="pC"><Font ss:FontName="Arial" ss:Size="10" ss:Color="#333333"/><NumberFormat ss:Format="0.00%"/><Alignment ss:Horizontal="Center"/><Borders><Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/></Borders></Style>
<Style ss:ID="note"><Font ss:FontName="Arial" ss:Size="9" ss:Italic="1" ss:Color="#666666"/><Alignment ss:WrapText="1" ss:Horizontal="Left"/></Style>
</Styles>`;

  const c=(v,s)=>`<Cell ss:StyleID="${s}"><Data ss:Type="${typeof v==='number'?'Number':'String'}">${typeof v==='number'?v:esc(v)}</Data></Cell>`;
  const sp=`<Row ss:Height="15"><Cell/></Row>`;
  const R=(...cells)=>`<Row ss:Height="18">${cells.join("")}</Row>`;
  const R1=(label)=>`<Row ss:Height="32">${c(label,"h1")}</Row>`;

  const capMktDisp = a.capitalMarketUnits || 0;
  const capAffDisp = a.capitalAffordableUnits || 0;

  // ─── Sheet 1: Pro Forma (matches Excel exactly) ───
  const proFormaSheet = `<Worksheet ss:Name="Pro Forma"><Table ss:DefaultColumnWidth="100">
<Column ss:Width="350"/><Column ss:Width="160"/><Column ss:Width="160"/><Column ss:Width="160"/>
${sp}
${R(c("PURCHASE & PERMITTING RELATED COSTS","dB"),c(lo.purchaseCost,"$"),c(mi.purchaseCost,"$"),c(hi.purchaseCost,"$"))}
${R(c("PREF ON RM'S CAPITAL for ACQUISITION","dB"),c(lo.prefPurchase,"$"),c(mi.prefPurchase,"$"),c(hi.prefPurchase,"$"))}
${R(c("PREF ON RM'S CAPITAL for SITE WORK","dB"),c(lo.prefSite,"$"),c(mi.prefSite,"$"),c(hi.prefSite,"$"))}
${R(c("PREF ON RM'S CAPITAL for MODULAR HOME RELATED COSTS","dB"),c(lo.prefModular,"$"),c(mi.prefModular,"$"),c(hi.prefModular,"$"))}
${R(c("CAPITAL TO BUY & FINISH THE MARKET RATE HOUSES @$${lo.mktCostPerSF} PER SF & THE AFFORDABLE HOUSES @ $${lo.affCostPerSF} PER SF","dB"),c(lo.capProd,"$"),c(mi.capProd,"$"),c(hi.capProd,"$"))}
${R(c("All costs related to modular home acquisition funded by sale proceeds","d"),c(lo.procProd,"$"),c(mi.procProd,"$"),c(hi.procProd,"$"))}
${R(c("SITE & MISC CONSTRUCTION COSTS","dB"),c(lo.siteMiscCosts,"$"),c(mi.siteMiscCosts,"$"),c(hi.siteMiscCosts,"$"))}
${R(c("TOTAL CAPITAL REQUIRED FOR THE PROJECT","dBM"),c(lo.totalCapital,"$B"),c(mi.totalCapital,"$B"),c(hi.totalCapital,"$B"))}
${sp}
${R(c("","hdr"),c("LOW","hdrC"),c("MIDDLE","hdrC"),c("HIGH","hdrC"))}
${R(c("*GROSS SALES OF THE HOUSES","dB"),c(lo.gross,"$"),c(mi.gross,"$"),c(hi.gross,"$"))}
${R(c("NET SALES","dB"),c(lo.netSales,"$"),c(mi.netSales,"$"),c(hi.netSales,"$"))}
${R(c("TOTAL RETURN","dBM"),c(lo.totalReturn,"$B"),c(mi.totalReturn,"$B"),c(hi.totalReturn,"$B"))}
${R(c("Return Percentage","dB"),c(p2(lo.returnPct),"dC"),c(p2(mi.returnPct),"dC"),c(p2(hi.returnPct),"dC"))}
${R(c("RM return after investment w/ ${(a.rmProfitShare*100).toFixed(0)}% of the Profit","dB"),c(lo.rmReturn,"$"),c(mi.rmReturn,"$"),c(hi.rmReturn,"$"))}
${R(c("Annual return % on purchase capital","dB"),c(p2(lo.purchaseXirr),"dC"),c(p2(mi.purchaseXirr),"dC"),c(p2(hi.purchaseXirr),"dC"))}
${R(c("Annual return % on all other capital","dB"),c(p2(lo.nonPurchaseXirr),"dC"),c(p2(mi.nonPurchaseXirr),"dC"),c(p2(hi.nonPurchaseXirr),"dC"))}
${R(c("RM overall return %","dBM"),c(p2(lo.totalCapital>0?lo.rmReturn/lo.totalCapital:0),"dC"),c(p2(mi.totalCapital>0?mi.rmReturn/mi.totalCapital:0),"dC"),c(p2(hi.totalCapital>0?hi.rmReturn/hi.totalCapital:0),"dC"))}
</Table></Worksheet>`;

  // ─── Sheet 2: Assumptions ───
  const assumptionsSheet = `<Worksheet ss:Name="ASSUMPTIONS"><Table ss:DefaultColumnWidth="100">
<Column ss:Width="350"/><Column ss:Width="175"/>
${R1("ASSUMPTIONS")}
${R(c("Market Home (Low)","d"),c(a.marketResaleLow,"$R"))}
${R(c("Market Home (Mid)","d"),c(a.marketResaleMid,"$R"))}
${R(c("Market Home (High)","d"),c(a.marketResaleHigh,"$R"))}
${R(c("Affordable Home (Low)","d"),c(a.affordableResaleLow||0,"$R"))}
${R(c("Affordable Home (Mid)","d"),c(a.affordableResaleMid||0,"$R"))}
${R(c("Affordable Home (High)","d"),c(a.affordableResaleHigh||0,"$R"))}
${R(c("Market Units","d"),c(a.marketRateUnits,"dR"))}
${R(c("Affordable Units","d"),c(a.affordableUnits,"dR"))}
${R(c("Capital Market Units","d"),c(capMktDisp,"dR"))}
${R(c("Capital Affordable Units","d"),c(capAffDisp,"dR"))}
${R(c("Market SF/Home","d"),c(a.marketSF,"dR"))}
${R(c("Affordable SF/Home","d"),c(a.affordableSF,"dR"))}
${R(c("Market Cost /SF","d"),c(a.marketCostPerSF||0,"dR"))}
${R(c("Affordable Cost /SF","d"),c(a.affordableCostPerSF||0,"dR"))}
${R(c("Purchase Price","dB"),c(a.purchasePrice||0,"$RB"))}
${R(c("Permitting Costs","d"),c(a.permittingCosts||0,"$R"))}
${R(c("Site Work","d"),c(a.siteWork,"$R"))}
${R(c("Pref Rate (Purchase)","dB"),c(p(a.prefRatePurchase),"dRB"))}
${R(c("Pref Rate (Non-Purchase)","dB"),c(p(a.prefRateOther),"dRB"))}
${R(c("RM Profit Share","dB"),c((a.rmProfitShare*100).toFixed(2)+"%","dRB"))}
${R(c("Commission","dB"),c(p(a.commissionRate),"dRB"))}
${R(c("Duration","dB"),c(a.projectMonths+" months","dRB"))}
${R(c("Site Work Capital Month","d"),c("Month "+a.monthSiteWorkCapital,"dR"))}
${R(c("Modular Capital Month","d"),c("Month "+a.monthModularCapital,"dR"))}
${R(c("Sales Begin","d"),c("Month "+ss,"dR"))}
</Table></Worksheet>`;

  // ─── Sheet 3: XIRR for Purchase Capital ───
  const purchaseXirrSheet = `<Worksheet ss:Name="XIRR for Purchase Capital"><Table ss:DefaultColumnWidth="100">
<Column ss:Width="200"/><Column ss:Width="180"/><Column ss:Width="450"/>
${R(c("Date","hdr"),c("Cash Flow","hdrC"),c("Notes","hdr"))}
${sp}
${R(c(purchDeployDate,"dB"),c(-lo.purchaseCost,"$"),c("Purchase & Permitting Capital","note"))}
${R(c(purchExitDate,"dB"),c(lo.purchaseXirrReturn,"$"),c("This is the purchase capital that was deployed plus the pref related to that capital","note"))}
${R(c("XIRR (Annualized Return)","dBM"),c(p2(lo.purchaseXirr||0),"dC"),c("This is the annualized return for the purchase capital","note"))}
${R(c("Equity Multiple","dB"),c((lo.purchaseEqMult||0).toFixed(3),"dC"),c("","d"))}
</Table></Worksheet>`;

  // ─── Sheet 4: XIRR for Non-Purchase Capital ───
  function xirrRow(s, label) {
    return `${R(c(npDeployDate,"dB"),c(-s.nonPurchaseCapital,"$"),c("All capital minus the purchase & permitting capital","note"))}
${R(c(npExitDate,"dB"),c(s.nonPurchaseXirrReturn,"$"),c("This is a total of all non purchase related capital deployed + ${(a.rmProfitShare*100).toFixed(0)}% of total return plus the pref earned on all the non purchase related capital","note"))}
${R(c("XIRR (Annualized Return)","dBM"),c(p2(s.nonPurchaseXirr||0),"dC"),c("This is the annualized return for the ${label} sales returns + the pref for all non purchase related capital used","note"))}
${R(c("Equity Multiple","dB"),c((s.nonPurchaseEqMult||0).toFixed(3),"dC"),c("","d"))}`;
  }

  const nonPurchaseXirrSheet = `<Worksheet ss:Name="XIRR for non Purchase C"><Table ss:DefaultColumnWidth="100">
<Column ss:Width="200"/><Column ss:Width="180"/><Column ss:Width="550"/>
${R(c("Date","hdr"),c("Cash Flow","hdrC"),c("Notes","hdr"))}
${sp}
${xirrRow(lo,"low")}
${sp}
${xirrRow(mi,"middle")}
${sp}
${xirrRow(hi,"high")}
</Table></Worksheet>`;

  const xml = `<?xml version="1.0"?><?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
${styles}
${proFormaSheet}
${assumptionsSheet}
${purchaseXirrSheet}
${nonPurchaseXirrSheet}
</Workbook>`;

  const blob = new Blob([xml], {type:"application/vnd.ms-excel"});
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `FaceOff_ProForma_${new Date().toISOString().slice(0,10)}.xls`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// ─── Default blank assumptions ───
// Only true manual inputs from the Excel workbook.
// Derived values (proceeds units, prefs, returns, XIRR) are auto-calculated.
const DEFAULT_ASSUMPTIONS = {
  purchasePrice:0,permittingCosts:0,          // Excel B0, B1
  siteWork:0,                                  // Excel B10
  marketRateUnits:0,affordableUnits:0,         // Excel B4, B7
  capitalMarketUnits:0,capitalAffordableUnits:0, // Excel B5, B8
  marketSF:0,affordableSF:0,                   // Excel B2, B3
  marketCostPerSF:180,affordableCostPerSF:150, // Excel: "@180 PER SF" / "@$150 PER SF"
  monthSiteWorkCapital:12,monthModularCapital:15, // Excel B12, B13
  prefRatePurchase:0.12,prefRateOther:0.12,    // Excel B14 (two rates per user requirement)
  projectMonths:48,                            // Excel B11
  commissionRate:0.04,rmProfitShare:0.70,      // Excel: ×0.96 net factor, 70% profit share
  marketResaleLow:0,marketResaleMid:0,marketResaleHigh:0,       // Excel B15, B17, B19
  affordableResaleLow:0,affordableResaleMid:0,affordableResaleHigh:0, // Excel B16, B18, B20
  // Purchase capital XIRR dates
  purchDeployYear:2026,purchDeployMonth:5,purchDeployDay:1,
  purchExitYear:2029,purchExitMonth:4,purchExitDay:30,
  // Non-purchase capital XIRR dates
  npDeployYear:2027,npDeployMonth:5,npDeployDay:1,
  npExitYear:2029,npExitMonth:4,npExitDay:30,
};

function genId() { return Date.now().toString(36) + Math.random().toString(36).slice(2,6); }

// ─── Migrate old saved assumptions to current field names ───
function migrateAssumptions(old) {
  if (!old) return { ...DEFAULT_ASSUMPTIONS };
  const a = { ...DEFAULT_ASSUMPTIONS };

  // Map old purchaseCost → split into purchasePrice (carry full amount, permitting stays 0)
  if (old.purchaseCost != null && old.purchasePrice == null) {
    a.purchasePrice = old.purchaseCost;
    a.permittingCosts = 0;
  } else {
    if (old.purchasePrice != null) a.purchasePrice = old.purchasePrice;
    if (old.permittingCosts != null) a.permittingCosts = old.permittingCosts;
  }

  // Map old single affordableResale → all three scenarios
  if (old.affordableResale != null && old.affordableResaleLow == null) {
    a.affordableResaleLow = old.affordableResale;
    a.affordableResaleMid = old.affordableResale;
    a.affordableResaleHigh = old.affordableResale;
  } else {
    if (old.affordableResaleLow != null) a.affordableResaleLow = old.affordableResaleLow;
    if (old.affordableResaleMid != null) a.affordableResaleMid = old.affordableResaleMid;
    if (old.affordableResaleHigh != null) a.affordableResaleHigh = old.affordableResaleHigh;
  }

  // Map old split per-SF → single costPerSF
  if (old.mktAcquisitionPerSF != null && old.marketCostPerSF == null) {
    a.marketCostPerSF = (old.mktAcquisitionPerSF || 0) + (old.mktFinishPerSF || 0);
  } else if (old.marketCostPerSF != null) {
    a.marketCostPerSF = old.marketCostPerSF;
  }
  if (old.affAcquisitionPerSF != null && old.affordableCostPerSF == null) {
    a.affordableCostPerSF = (old.affAcquisitionPerSF || 0) + (old.affFinishPerSF || 0);
  } else if (old.affordableCostPerSF != null) {
    a.affordableCostPerSF = old.affordableCostPerSF;
  }

  // Direct copy of all fields that kept the same name
  const directFields = [
    'siteWork','marketRateUnits','affordableUnits','capitalMarketUnits','capitalAffordableUnits',
    'marketSF','affordableSF','monthSiteWorkCapital','monthModularCapital',
    'prefRatePurchase','prefRateOther','projectMonths','commissionRate','rmProfitShare',
    'marketResaleLow','marketResaleMid','marketResaleHigh',
    'purchDeployYear','purchDeployMonth','purchDeployDay','purchExitYear','purchExitMonth','purchExitDay',
    'npDeployYear','npDeployMonth','npDeployDay','npExitYear','npExitMonth','npExitDay',
  ];
  for (const k of directFields) {
    if (old[k] != null) a[k] = old[k];
  }

  // Migrate old single XIRR dates → new split dates
  if (old.xirrStartYear != null && old.purchDeployYear == null) {
    a.purchDeployYear = old.xirrStartYear;
    a.purchDeployMonth = old.xirrStartMonth || 5;
    a.purchDeployDay = old.xirrStartDay || 1;
    // Old NP deploy was derived from start + monthSiteWorkCapital
    const npD = new Date(old.xirrStartYear, (old.xirrStartMonth||5)-1+(old.monthSiteWorkCapital||12), old.xirrStartDay||1);
    a.npDeployYear = npD.getFullYear();
    a.npDeployMonth = npD.getMonth()+1;
    a.npDeployDay = npD.getDate();
  }
  if (old.xirrExitYear != null && old.purchExitYear == null) {
    a.purchExitYear = old.xirrExitYear;
    a.purchExitMonth = old.xirrExitMonth || 4;
    a.purchExitDay = old.xirrExitDay || 30;
    a.npExitYear = old.xirrExitYear;
    a.npExitMonth = old.xirrExitMonth || 4;
    a.npExitDay = old.xirrExitDay || 30;
  }

  return a;
}

// ─── Deal Selector Dropdown ───
function DealSelector({ deals, activeDealId, onSwitch, onNew, onSave, onRename, onDelete }) {
  const [open, setOpen] = useState(false);
  const [naming, setNaming] = useState(false);
  const [nameVal, setNameVal] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const ref = useRef(null);
  const active = deals.find(d => d.id === activeDealId);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) { setOpen(false); setConfirmDeleteId(null); } };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const startNew = () => { setNaming(true); setNameVal(""); };
  const commitNew = () => {
    if (nameVal.trim()) { onNew(nameVal.trim()); }
    setNaming(false); setOpen(false);
  };
  const startRename = () => { setNaming(true); setNameVal(active?.name || ""); };
  const commitRename = () => {
    if (nameVal.trim() && active) { onRename(active.id, nameVal.trim()); }
    setNaming(false);
  };

  const ago = (d) => {
    if (!d) return "";
    const mins = Math.floor((Date.now() - new Date(d).getTime()) / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <div ref={ref} style={{ position: "relative" }}>
      {/* Active deal display */}
      <div onClick={() => setOpen(!open)} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
        <div>
          <div style={{ fontSize: "14px", fontWeight: 600, color: C.text, display: "flex", alignItems: "center", gap: "6px" }}>
            {active?.name || "Untitled Deal"}
            <span style={{ fontSize: "10px", color: C.textMuted, transform: open ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s", display: "inline-block" }}>▼</span>
          </div>
          <div style={{ fontSize: "11px", color: C.textMuted, marginTop: "1px" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: C.positive, display: "inline-block" }} />Active
            </span>
            {active?.updatedAt && <>
              <span style={{ margin: "0 6px", color: C.border }}>|</span>
              Saved {ago(active.updatedAt)}
            </>}
          </div>
        </div>
      </div>

      {/* Dropdown */}
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 8px)", left: 0, minWidth: "280px",
          background: C.surface, borderRadius: "12px", border: `1px solid ${C.border}`,
          boxShadow: "0 8px 32px rgba(0,0,0,0.12)", zIndex: 300, overflow: "hidden",
          animation: "fadeUp 0.15s ease",
        }}>
          {/* Save current */}
          <div style={{ padding: "10px 16px", borderBottom: `1px solid ${C.borderLight}`, display: "flex", gap: "8px" }}>
            <button onClick={() => { onSave(); setOpen(false); }} style={{
              flex: 1, padding: "7px 0", borderRadius: "6px", border: "none",
              background: C.positive, color: "#fff", fontSize: "12px", fontWeight: 600,
              cursor: "pointer", fontFamily: font,
            }}>Save Deal</button>
            <button onClick={startRename} style={{
              padding: "7px 12px", borderRadius: "6px", border: `1px solid ${C.border}`,
              background: "transparent", color: C.textMid, fontSize: "12px", fontWeight: 500,
              cursor: "pointer", fontFamily: font,
            }}>Rename</button>
          </div>

          {/* Rename input */}
          {naming && (
            <div style={{ padding: "10px 16px", borderBottom: `1px solid ${C.borderLight}`, display: "flex", gap: "8px" }}>
              <input autoFocus value={nameVal} onChange={e => setNameVal(e.target.value)}
                onKeyDown={e => e.key === "Enter" && (active && nameVal === active.name ? commitRename() : commitNew())}
                placeholder="Deal name..."
                style={{ flex: 1, border: `1px solid ${C.border}`, borderRadius: "6px", padding: "6px 10px", fontSize: "13px", fontFamily: font, outline: "none", color: C.text }} />
              <button onClick={active && deals.find(d=>d.name===nameVal) ? commitRename : commitNew} style={{
                padding: "6px 12px", borderRadius: "6px", border: "none",
                background: C.accent, color: "#fff", fontSize: "12px", fontWeight: 600,
                cursor: "pointer", fontFamily: font,
              }}>{nameVal === active?.name ? "Rename" : "Create"}</button>
            </div>
          )}

          {/* Deal list */}
          <div style={{ maxHeight: "280px", overflowY: "auto" }}>
            {deals.map(deal => (
              <div key={deal.id}>
                {/* Inline delete confirmation */}
                {confirmDeleteId === deal.id && (
                  <div style={{
                    padding: "8px 16px", background: C.negativeSoft,
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                  }}>
                    <span style={{ fontSize: "12px", color: C.negative, fontWeight: 600 }}>Delete "{deal.name}"?</span>
                    <div style={{ display: "flex", gap: "6px" }}>
                      <button onClick={() => setConfirmDeleteId(null)} style={{
                        padding: "4px 10px", borderRadius: "5px", border: `1px solid ${C.border}`,
                        background: C.surface, color: C.textMid, fontSize: "11px", fontWeight: 600,
                        cursor: "pointer", fontFamily: font,
                      }}>Cancel</button>
                      <button onClick={() => { onDelete(deal.id); setConfirmDeleteId(null); }} style={{
                        padding: "4px 10px", borderRadius: "5px", border: "none",
                        background: C.negative, color: "#fff", fontSize: "11px", fontWeight: 600,
                        cursor: "pointer", fontFamily: font,
                      }}>Delete</button>
                    </div>
                  </div>
                )}
                <div
                  style={{
                    padding: "10px 16px", display: "flex", justifyContent: "space-between", alignItems: "center",
                    background: deal.id === activeDealId ? C.accentSoft : "transparent",
                    borderLeft: deal.id === activeDealId ? `3px solid ${C.accent}` : "3px solid transparent",
                    transition: "background 0.15s",
                  }}
                  onMouseOver={e => { if (deal.id !== activeDealId) e.currentTarget.style.background = C.surfaceAlt; }}
                  onMouseOut={e => { if (deal.id !== activeDealId) e.currentTarget.style.background = deal.id === activeDealId ? C.accentSoft : "transparent"; }}
                >
                  <div onClick={() => { onSwitch(deal.id); setOpen(false); setConfirmDeleteId(null); }} style={{ flex: 1, cursor: "pointer" }}>
                    <div style={{ fontSize: "13px", fontWeight: deal.id === activeDealId ? 600 : 500, color: C.text }}>{deal.name}</div>
                    <div style={{ fontSize: "10px", color: C.textMuted, marginTop: "2px" }}>{ago(deal.updatedAt)}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    {deal.id === activeDealId && (
                      <span style={{ fontSize: "10px", fontWeight: 600, color: C.accent, textTransform: "uppercase", letterSpacing: "0.04em" }}>Active</span>
                    )}
                    <button onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(confirmDeleteId === deal.id ? null : deal.id); }}
                      style={{ border: "none", background: "transparent", color: C.textMuted, fontSize: "14px", cursor: "pointer", padding: "2px 4px", borderRadius: "4px", lineHeight: 1, transition: "color 0.15s" }}
                      onMouseOver={e => e.currentTarget.style.color = C.negative}
                      onMouseOut={e => e.currentTarget.style.color = C.textMuted}
                      title="Delete deal"
                    >×</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* New deal */}
          <div style={{ padding: "10px 16px", borderTop: `1px solid ${C.borderLight}` }}>
            <button onClick={startNew} style={{
              width: "100%", padding: "8px 0", borderRadius: "6px", border: `1px dashed ${C.border}`,
              background: "transparent", color: C.textMid, fontSize: "12px", fontWeight: 500,
              cursor: "pointer", fontFamily: font, transition: "all 0.15s",
            }}
              onMouseOver={e => { e.currentTarget.style.borderColor = C.accent; e.currentTarget.style.color = C.accent; }}
              onMouseOut={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textMid; }}
            >+ New Deal</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main ───
function ProFormaTool({ project, onSave, onClose }) {
  // ─── DEAL PERSISTENCE ───
  // Future: replace window.storage with API/database calls
  const [deals, setDeals] = useState([]);
  const [activeDealId, setActiveDealId] = useState(null);
  const [loaded, setLoaded] = useState(false);

  const [scenario, setScenario] = useState("Middle");
  const [chatOpen, setChatOpen] = useState(false);
  const [inputsOpen, setInputsOpen] = useState(false);

  const [a, setA] = useState({ ...DEFAULT_ASSUMPTIONS });

  // ─── SAVE TO PROJECT (Platform Integration) ───
  const handleSaveToProject = useCallback(() => {
    if (!onSave) return;
    const lo = calcScenario(a, a.marketResaleLow, a.affordableResaleLow);
    const mi = calcScenario(a, a.marketResaleMid, a.affordableResaleMid);
    const hi = calcScenario(a, a.marketResaleHigh, a.affordableResaleHigh);
    const current = scenario === "Low" ? lo : scenario === "High" ? hi : mi;
    onSave({
      tool_id: "proforma",
      label: `${scenario} Scenario — ${deals.find(d=>d.id===activeDealId)?.name||"Deal"}`,
      data: {
        scenario,
        assumptions: { ...a },
        computed: {
          grossProfit: current.totalReturn,
          totalROI: current.returnPct,
          xirr: current.purchaseXirr,
          margin: (current.safety * 100).toFixed(1),
          netProfit: current.totalReturn,
          grossSales: current.gross,
          totalCapital: current.totalCapital,
        },
        scenarios: { low: lo, middle: mi, high: hi },
      },
    });
  }, [a, scenario, onSave, deals, activeDealId]);

  // Load deals from storage on mount
  useEffect(() => {
    (async () => {
      try {
        let saved = null;
        // Try window.storage (artifact mode), then localStorage (deployed mode)
        try {
          if (window.storage) {
            const result = await window.storage.get("faceoff_deals");
            saved = result ? JSON.parse(result.value) : null;
          }
        } catch(e) {
          try {
            const raw = localStorage.getItem("faceoff_deals");
            saved = raw ? JSON.parse(raw) : null;
          } catch(e2) {}
        }
        if (saved?.deals?.length) {
          const migrated = saved.deals.map(d => ({
            ...d, assumptions: migrateAssumptions(d.assumptions),
          }));
          setDeals(migrated);
          const activeId = saved.activeDealId || migrated[0].id;
          const activeDeal = migrated.find(d => d.id === activeId) || migrated[0];
          setActiveDealId(activeDeal.id);
          setA(migrateAssumptions(activeDeal.assumptions));
          setScenario(activeDeal.scenario || "Middle");
        } else {
          const firstDeal = { id: genId(), name: "New Deal", assumptions: { ...DEFAULT_ASSUMPTIONS }, scenario: "Middle", updatedAt: new Date().toISOString() };
          setDeals([firstDeal]);
          setActiveDealId(firstDeal.id);
        }
      } catch {
        const firstDeal = { id: genId(), name: "New Deal", assumptions: { ...DEFAULT_ASSUMPTIONS }, scenario: "Middle", updatedAt: new Date().toISOString() };
        setDeals([firstDeal]);
        setActiveDealId(firstDeal.id);
      }
      setLoaded(true);
    })();
  }, []);

  // Persist deals to storage whenever they change
  useEffect(() => {
    if (!loaded || !deals.length) return;
    try {
      const data = JSON.stringify({ deals, activeDealId });
      if (window.storage) { window.storage.set("faceoff_deals", data); }
      else { localStorage.setItem("faceoff_deals", data); }
    } catch {}
  }, [deals, activeDealId, loaded]);

  const u = (k, v) => setA(p => ({ ...p, [k]: v }));

  // ─── AUTO-SAVE: persist current assumptions to active deal on every change ───
  useEffect(() => {
    if (!loaded || !activeDealId) return;
    const timer = setTimeout(() => {
      setDeals(prev => prev.map(d => d.id === activeDealId
        ? { ...d, assumptions: { ...a }, scenario, updatedAt: new Date().toISOString() }
        : d
      ));
    }, 500); // debounce 500ms
    return () => clearTimeout(timer);
  }, [a, scenario, activeDealId, loaded]);

  // ─── DEAL OPERATIONS ───
  const saveDeal = () => {
    setDeals(prev => prev.map(d => d.id === activeDealId
      ? { ...d, assumptions: { ...a }, scenario, updatedAt: new Date().toISOString() }
      : d
    ));
  };

  const switchDeal = (id) => {
    // Save current deal then switch — use functional update to avoid stale state
    setDeals(prev => prev.map(d => d.id === activeDealId
      ? { ...d, assumptions: { ...a }, scenario, updatedAt: new Date().toISOString() }
      : d
    ));
    const deal = deals.find(d => d.id === id);
    if (deal) {
      setActiveDealId(id);
      setA(migrateAssumptions(deal.assumptions));
      setScenario(deal.scenario || "Middle");
    }
  };

  const newDeal = (name) => {
    // Save current, create new
    setDeals(prev => [
      ...prev.map(d => d.id === activeDealId
        ? { ...d, assumptions: { ...a }, scenario, updatedAt: new Date().toISOString() }
        : d
      ),
      { id: genId(), name, assumptions: { ...DEFAULT_ASSUMPTIONS }, scenario: "Middle", updatedAt: new Date().toISOString() },
    ]);
    // Switch to the new deal after state updates
    setTimeout(() => {
      setDeals(prev => {
        const newest = prev[prev.length - 1];
        setActiveDealId(newest.id);
        setA({ ...DEFAULT_ASSUMPTIONS });
        setScenario("Middle");
        return prev;
      });
    }, 0);
  };

  const renameDeal = (id, name) => {
    setDeals(prev => prev.map(d => d.id === id ? { ...d, name, updatedAt: new Date().toISOString() } : d));
  };

  const deleteDeal = (id) => {
    const remaining = deals.filter(d => d.id !== id);
    if (remaining.length === 0) {
      const fallback = { id: genId(), name: "New Deal", assumptions: { ...DEFAULT_ASSUMPTIONS }, scenario: "Middle", updatedAt: new Date().toISOString() };
      setDeals([fallback]);
      setActiveDealId(fallback.id);
      setA({ ...DEFAULT_ASSUMPTIONS });
      setScenario("Middle");
    } else {
      setDeals(remaining);
      if (id === activeDealId) {
        const next = remaining[0];
        setActiveDealId(next.id);
        setA(migrateAssumptions(next.assumptions));
        setScenario(next.scenario || "Middle");
      }
    }
  };

  const m = useMemo(() => {
    const mktU = Math.max(a.marketRateUnits, 0);
    const affU = Math.max(a.affordableUnits, 0);
    const totalUnits = mktU + affU;
    const months = Math.max(a.projectMonths, 1);

    // ─── COST PER SF (Excel: "@180 PER SF" market, "@$150 PER SF" affordable) ───
    const mktCostPerSF = a.marketCostPerSF || 0;
    const affCostPerSF = a.affordableCostPerSF || 0;

    // ─── Purchase & Permitting = Purchase Price + Permitting Costs (Excel B0+B1) ───
    const purchaseCost = (a.purchasePrice || 0) + (a.permittingCosts || 0);

    // ─── CAPITAL vs PROCEEDS SPLIT (Excel B5/B6/B8/B9) ───
    const capMkt = Math.min(a.capitalMarketUnits || 0, mktU);
    const capAff = Math.min(a.capitalAffordableUnits || 0, affU);
    const capitalProductionCost = (capMkt * a.marketSF * mktCostPerSF) + (capAff * a.affordableSF * affCostPerSF);
    const procMkt = mktU - capMkt;
    const procAff = affU - capAff;
    const proceedsProductionCost = (procMkt * a.marketSF * mktCostPerSF) + (procAff * a.affordableSF * affCostPerSF);

    // ─── SITE COSTS (Excel row 6) ───
    const siteMiscCosts = a.siteWork || 0;

    // ─── TOTAL CAPITAL REQUIRED ───
    const totalCapital = purchaseCost + capitalProductionCost + siteMiscCosts;

    // ─── REVENUE (per-scenario affordable resale) ───
    const res = scenario === "Low" ? a.marketResaleLow : scenario === "Middle" ? a.marketResaleMid : a.marketResaleHigh;
    const affRes = scenario === "Low" ? (a.affordableResaleLow||0) : scenario === "Middle" ? (a.affordableResaleMid||0) : (a.affordableResaleHigh||0);
    const grossSales = (mktU * res) + (affU * affRes);
    const commission = grossSales * a.commissionRate;
    const netSales = grossSales - commission;

    // ─── 3-TRANCHE PREFERRED RETURN (matches true R2, R3, R4) ───
    const prefPurchase = purchaseCost * a.prefRatePurchase / 12 * months;
    const prefSite = siteMiscCosts * a.prefRateOther / 12 * Math.max(months - a.monthSiteWorkCapital, 0);
    const prefModular = capitalProductionCost * a.prefRateOther / 12 * Math.max(months - a.monthModularCapital, 0);
    const totalPref = prefPurchase + prefSite + prefModular;

    // ─── TOTAL RETURN (matches true R12 = NetSales - Capital - Proceeds - AllPrefs) ───
    const totalReturn = netSales - totalCapital - proceedsProductionCost - totalPref;
    const returnPct = totalCapital > 0 ? totalReturn / totalCapital : 0;

    // ─── PROFIT SPLIT (matches true R14) ───
    // RM gets profit share + all prefs. Capital is NOT added back to RM return.
    const rmProfit = totalReturn * a.rmProfitShare;
    const lpProfit = totalReturn * (1 - a.rmProfitShare);
    const rmReturn = rmProfit + totalPref;

    // ─── TWO-TRANCHE XIRR (Newton-Raphson — same algorithm as Excel's XIRR) ───
    // Purchase capital: separate deploy & exit dates
    const purchaseXirrReturn = purchaseCost + prefPurchase;
    const purchDeploy = xirrDate(a.purchDeployYear, a.purchDeployMonth, a.purchDeployDay || 1);
    const purchExit = xirrDate(a.purchExitYear, a.purchExitMonth, a.purchExitDay || xirrLastDay(a.purchExitYear, a.purchExitMonth));
    const purchaseXirr = purchaseCost > 0 ? xirrSolve([
      { date: purchDeploy, amount: -purchaseCost },
      { date: purchExit, amount: purchaseXirrReturn },
    ]) : 0;
    const purchaseEqMult = purchaseCost > 0 ? prefPurchase / purchaseCost : 0;
    const purchaseHoldMonths = Math.round((purchExit - purchDeploy) / 86400000 / 30.44);

    // Non-purchase capital: separate deploy & exit dates
    const nonPurchaseCapital = totalCapital - purchaseCost;
    const nonPurchaseXirrReturn = nonPurchaseCapital + rmReturn;
    const npDeploy = xirrDate(a.npDeployYear, a.npDeployMonth, a.npDeployDay || 1);
    const npExit = xirrDate(a.npExitYear, a.npExitMonth, a.npExitDay || xirrLastDay(a.npExitYear, a.npExitMonth));
    const nonPurchaseXirr = nonPurchaseCapital > 0 ? xirrSolve([
      { date: npDeploy, amount: -nonPurchaseCapital },
      { date: npExit, amount: nonPurchaseXirrReturn },
    ]) : 0;
    const nonPurchaseEqMult = nonPurchaseCapital > 0 ? (nonPurchaseXirrReturn - nonPurchaseCapital) / nonPurchaseCapital : 0;
    const nonPurchaseHoldMonths = Math.round((npExit - npDeploy) / 86400000 / 30.44);

    // ─── BREAK-EVEN PRICE ───
    // totalReturn ≥ 0: netSales ≥ totalCapital + proceedsCost + totalPref
    const netCommRate = 1 - a.commissionRate;
    const allCosts = totalCapital + proceedsProductionCost + totalPref;
    const affRevNet = affU * affRes * netCommRate;
    const breakEvenPrice = (mktU > 0 && netCommRate > 0)
      ? (allCosts - affRevNet) / (mktU * netCommRate) : 0;
    const cushionAboveBreakEven = res - breakEvenPrice;
    const marginOfSafety = res > 0 ? cushionAboveBreakEven / res : 0;

    // ─── DYNAMIC TIMELINE ───
    const salesStartMonth = Math.min(a.monthModularCapital + 3, months);
    const sellingMonths = Math.max(months - salesStartMonth + 1, 1);
    const avgNetPrice = totalUnits > 0 ? netSales / totalUnits : 0;
    const unitsToBreakEven = avgNetPrice > 0 ? allCosts / avgNetPrice : totalUnits;
    const monthsToSell = totalUnits > 0 ? Math.ceil((unitsToBreakEven / totalUnits) * sellingMonths) : sellingMonths;
    const breakevenMonth = Math.min(salesStartMonth + monthsToSell - 1, months);

    // ─── SENSITIVITY ───
    const sensitivityPer50K = mktU * 50000 * netCommRate;
    const drop5pct = grossSales * 0.05 * netCommRate;

    return {
      purchaseCost, mktCostPerSF, affCostPerSF,
      capitalProductionCost, proceedsProductionCost, siteMiscCosts, totalCapital,
      grossSales, commission, netSales,
      prefPurchase, prefSite, prefModular, totalPref,
      totalReturn, returnPct,
      rmProfit, lpProfit, rmReturn,
      purchaseXirrReturn, purchaseXirr, purchaseEqMult, purchaseHoldMonths,
      nonPurchaseCapital, nonPurchaseXirrReturn, nonPurchaseHoldMonths, nonPurchaseXirr, nonPurchaseEqMult,
      breakEvenPrice, cushionAboveBreakEven, marginOfSafety,
      salesStartMonth, breakevenMonth, sensitivityPer50K, drop5pct,
    };
  }, [a, scenario]);

  const units=a.marketRateUnits+a.affordableUnits;
  const res=scenario==="Low"?a.marketResaleLow:scenario==="Middle"?a.marketResaleMid:a.marketResaleHigh;
  const costs=[
    {label:"Land & Permits",val:m.purchaseCost,color:C.accent},
    {label:"Capital Production (homes needing capital)",val:m.capitalProductionCost,color:"#7DA68A"},
    {label:"Site & Construction",val:m.siteMiscCosts,color:"#6B8EBF"},
    {label:"Proceeds Production (funded by sales)",val:m.proceedsProductionCost,color:"#8DA47D"},
    {label:"Commission",val:m.commission,color:"#B8A88A"},
    {label:"Preferred Return",val:m.totalPref,color:"#C4943A"},
  ];
  const totalAllCosts = m.totalCapital + m.proceedsProductionCost + m.commission + m.totalPref;

  return (
    <div style={{ fontFamily:font,background:C.bg,minHeight:"100vh",color:C.text,WebkitFontSmoothing:"antialiased" }}>
      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        *{box-sizing:border-box}
        ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:rgba(0,0,0,.1);border-radius:3px}
        input[type="range"]{display:none}
      `}</style>

      {/* Header */}
      <header style={{ borderBottom:`1px solid ${C.border}`,background:C.surface,padding:"16px 32px" }}>
        <div style={{ maxWidth:"1200px",margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between" }}>
          <div style={{ display:"flex",alignItems:"center",gap:"16px" }}>
            <div style={{ fontSize:"18px",fontWeight:700,letterSpacing:"-0.03em",color:C.accent }}>FaceOff</div>
            <div style={{ width:"1px",height:"20px",background:C.border }} />
            <DealSelector
              deals={deals}
              activeDealId={activeDealId}
              onSwitch={switchDeal}
              onNew={newDeal}
              onSave={saveDeal}
              onRename={renameDeal}
              onDelete={deleteDeal}
            />
          </div>
          <div style={{ display:"flex",alignItems:"center",gap:"10px" }}>
            <button onClick={()=>setInputsOpen(!inputsOpen)} style={{
              padding:"10px 20px",borderRadius:"8px",border:"none",
              background:inputsOpen?C.positive:C.accent,color:"#fff",
              fontSize:"13px",fontWeight:600,cursor:"pointer",fontFamily:font,transition:"all 0.2s",
            }}
              onMouseOver={e=>e.currentTarget.style.opacity="0.9"}
              onMouseOut={e=>e.currentTarget.style.opacity="1"}
            >{inputsOpen?"Close Editor":"Edit Assumptions"}</button>
            <button onClick={()=>{try{downloadExcel(a);}catch(e){alert("Export error: "+e.message);console.error(e);}}} style={{
              padding:"10px 20px",borderRadius:"8px",border:"none",
              background:C.accent,color:"#fff",
              fontSize:"13px",fontWeight:600,cursor:"pointer",fontFamily:font,transition:"all 0.2s",
            }}
              onMouseOver={e=>e.currentTarget.style.opacity="0.9"}
              onMouseOut={e=>e.currentTarget.style.opacity="1"}
            >Export</button>
          </div>
        </div>
      </header>

      <main style={{ maxWidth:"1200px",margin:"0 auto",padding:"28px 32px 60px" }}>

        {/* Summary */}
        <div style={{ fontSize:"17px",color:C.textMid,lineHeight:1.6,marginBottom:"28px",fontWeight:400,animation:"fadeUp 0.5s ease both" }}>
          Over <span style={{ fontWeight:700,color:C.text }}>{a.projectMonths} months</span>, this project is projected to generate{" "}
          <span style={{ fontWeight:700,color:m.totalReturn>0?C.positive:C.negative }}>{$(m.totalReturn)} total return</span>{" "}
          ({pct(m.returnPct)} ROI). Break-even requires a market home price of{" "}
          <span style={{ fontWeight:700,color:C.warn }}>{$(m.breakEvenPrice)}</span>
          <span style={{ color:C.textMuted }}> — {pct(m.marginOfSafety)} below the {scenario.toLowerCase()} price of {$(res)}.</span>
        </div>

        {/* KPI Row */}
        <div style={{ display:"grid",gridTemplateColumns:"repeat(5, 1fr)",gap:"16px",marginBottom:"24px" }}>
          {[
            {label:"Total Return",value:$(m.totalReturn),color:m.totalReturn>0?C.positive:C.negative},
            {label:"Return on Capital",value:pct(m.returnPct),color:C.text},
            {label:"Break-Even Price",value:$(m.breakEvenPrice),color:C.warn,sub:"min market home price"},
            {label:"Safety Margin",value:pct(m.marginOfSafety),color:m.marginOfSafety>0.15?C.positive:C.negative},
            {label:"Project Duration",value:`${a.projectMonths} mo`,color:C.accent},
          ].map((k,i)=>(
            <div key={i} style={{
              background:C.surface,borderRadius:"14px",padding:"24px 28px",
              border:`1px solid ${C.border}`,animation:`fadeUp 0.5s ease ${0.1+i*0.08}s both`,
            }}>
              <div style={{ fontSize:"32px",fontWeight:700,color:k.color,letterSpacing:"-0.03em",fontVariantNumeric:"tabular-nums",lineHeight:1 }}>{k.value}</div>
              <div style={{ fontSize:"12px",color:C.textMuted,marginTop:"8px",fontWeight:500,textTransform:"uppercase",letterSpacing:"0.04em" }}>{k.label}</div>
              {k.sub && <div style={{ fontSize:"11px",color:C.textMuted,marginTop:"2px" }}>{k.sub}</div>}
            </div>
          ))}
        </div>

        {/* Scenario Selector */}
        <div style={{ display:"flex",justifyContent:"center",marginBottom:"28px" }}>
          <div style={{ background:C.surface,borderRadius:"10px",display:"flex",padding:"3px",border:`1px solid ${C.border}`,boxShadow:"0 1px 3px rgba(0,0,0,0.04)" }}>
            {["Low","Middle","High"].map(s=>(
              <button key={s} onClick={()=>setScenario(s)} style={{
                padding:"10px 28px",borderRadius:"8px",border:"none",
                background:scenario===s?C.accent:"transparent",
                color:scenario===s?"#fff":C.textMuted,
                fontSize:"13px",fontWeight:600,cursor:"pointer",fontFamily:font,transition:"all 0.25s",
              }}
                onMouseOver={e=>{if(scenario!==s)e.currentTarget.style.color=C.text;}}
                onMouseOut={e=>{if(scenario!==s)e.currentTarget.style.color=C.textMuted;}}
              >{s} Scenario</button>
            ))}
          </div>
        </div>

        {/* Inputs Panel (collapsible) */}
        {inputsOpen && (
          <div style={{ background:C.surface,borderRadius:"14px",border:`1px solid ${C.border}`,padding:"28px 32px",marginBottom:"28px",animation:"fadeUp 0.3s ease both" }}>
            <div style={{ fontSize:"15px",fontWeight:700,color:C.text,marginBottom:"6px" }}>Assumptions</div>
            <div style={{ fontSize:"12px",color:C.textMuted,marginBottom:"24px" }}>Click any value to edit. All outputs update automatically.</div>

            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 48px" }}>

              {/* ─── Left Column ─── */}
              <div>
                <SectionHeader>Project Costs</SectionHeader>
                <InputBox label="Purchase Price" value={a.purchasePrice} type="currency" onChange={v=>u("purchasePrice",v)} />
                <InputBox label="Permitting Costs" value={a.permittingCosts} type="currency" onChange={v=>u("permittingCosts",v)}
                  helper={`Total purchase & permitting: $${((a.purchasePrice||0)+(a.permittingCosts||0)).toLocaleString()}`} />
                <InputBox label="Site Work Costs" value={a.siteWork} type="currency" onChange={v=>u("siteWork",v)} />

                <SectionHeader>Unit Counts</SectionHeader>
                <InputBox label="Market Homes" value={a.marketRateUnits} type="integer" onChange={v=>u("marketRateUnits",v)} />
                <InputBox label="Market Homes Needing Capital" value={a.capitalMarketUnits} type="integer" onChange={v=>u("capitalMarketUnits",v)}
                  helper={`${Math.max(a.marketRateUnits - a.capitalMarketUnits, 0)} using proceeds`} />
                <InputBox label="Affordable Homes" value={a.affordableUnits} type="integer" onChange={v=>u("affordableUnits",v)} />
                <InputBox label="Affordable Homes Needing Capital" value={a.capitalAffordableUnits} type="integer" onChange={v=>u("capitalAffordableUnits",v)}
                  helper={`${Math.max(a.affordableUnits - a.capitalAffordableUnits, 0)} using proceeds`} />

                <SectionHeader>Square Footage & Cost</SectionHeader>
                <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 16px" }}>
                  <InputBox label="Market SF / Home" value={a.marketSF} type="sf" onChange={v=>u("marketSF",v)} />
                  <InputBox label="Affordable SF / Home" value={a.affordableSF} type="sf" onChange={v=>u("affordableSF",v)} />
                  <InputBox label="Market Cost / SF" value={a.marketCostPerSF} type="integer" onChange={v=>u("marketCostPerSF",v)}
                    helper={`Total: $${((a.capitalMarketUnits||0)*a.marketSF*(a.marketCostPerSF||0)).toLocaleString()} capital production`} />
                  <InputBox label="Affordable Cost / SF" value={a.affordableCostPerSF} type="integer" onChange={v=>u("affordableCostPerSF",v)}
                    helper={`Total: $${((a.capitalAffordableUnits||0)*a.affordableSF*(a.affordableCostPerSF||0)).toLocaleString()} capital production`} />
                </div>
              </div>

              {/* ─── Right Column ─── */}
              <div>
                <SectionHeader>Sale Prices</SectionHeader>
                <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 16px" }}>
                  <InputBox label="Market Resale (Low)" value={a.marketResaleLow} type="currency" onChange={v=>u("marketResaleLow",v)} />
                  <InputBox label="Affordable Resale (Low)" value={a.affordableResaleLow} type="currency" onChange={v=>u("affordableResaleLow",v)} />
                  <InputBox label="Market Resale (Mid)" value={a.marketResaleMid} type="currency" onChange={v=>u("marketResaleMid",v)} />
                  <InputBox label="Affordable Resale (Mid)" value={a.affordableResaleMid} type="currency" onChange={v=>u("affordableResaleMid",v)} />
                  <InputBox label="Market Resale (High)" value={a.marketResaleHigh} type="currency" onChange={v=>u("marketResaleHigh",v)} />
                  <InputBox label="Affordable Resale (High)" value={a.affordableResaleHigh} type="currency" onChange={v=>u("affordableResaleHigh",v)} />
                </div>

                <SectionHeader>Timing</SectionHeader>
                <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 16px" }}>
                  <InputBox label="Project Duration (Months)" value={a.projectMonths} type="months" onChange={v=>u("projectMonths",v)} />
                  <InputBox label="Site Work Capital Month" value={a.monthSiteWorkCapital} type="month" onChange={v=>u("monthSiteWorkCapital",v)} />
                  <InputBox label="Modular Capital Month" value={a.monthModularCapital} type="month" onChange={v=>u("monthModularCapital",v)}
                    helper={`Sales begin Month ${Math.min((a.monthModularCapital||0) + 3, a.projectMonths)} (modular + 3)`} />
                </div>

                <SectionHeader>Terms</SectionHeader>
                <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 16px" }}>
                  <InputBox label="Pref Rate (Purchase)" value={a.prefRatePurchase} type="percent" onChange={v=>u("prefRatePurchase",v)} />
                  <InputBox label="Pref Rate (Other)" value={a.prefRateOther} type="percent" onChange={v=>u("prefRateOther",v)} />
                  <InputBox label="RM Profit Share" value={a.rmProfitShare} type="percent" onChange={v=>u("rmProfitShare",v)} />
                  <InputBox label="Commission Rate" value={a.commissionRate} type="percent" onChange={v=>u("commissionRate",v)} />
                </div>

                <SectionHeader>Purchase Capital XIRR Dates</SectionHeader>
                <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 12px" }}>
                  <InputBox label="Deploy Date" value={`${a.purchDeployMonth||5}/${a.purchDeployDay||1}/${a.purchDeployYear||2026}`} type="date"
                    onChange={v=>{const p=String(v).split(/[\/\-]/);if(p.length===3){u("purchDeployMonth",parseInt(p[0])||1);u("purchDeployDay",parseInt(p[1])||1);u("purchDeployYear",parseInt(p[2])||2026);}}} 
                    helper="M/D/YYYY" />
                  <InputBox label="Exit Date" value={`${a.purchExitMonth||4}/${a.purchExitDay||30}/${a.purchExitYear||2029}`} type="date"
                    onChange={v=>{const p=String(v).split(/[\/\-]/);if(p.length===3){u("purchExitMonth",parseInt(p[0])||1);u("purchExitDay",parseInt(p[1])||1);u("purchExitYear",parseInt(p[2])||2029);}}}
                    helper="M/D/YYYY" />
                </div>

                <SectionHeader>Non-Purchase Capital XIRR Dates</SectionHeader>
                <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 12px" }}>
                  <InputBox label="Deploy Date" value={`${a.npDeployMonth||5}/${a.npDeployDay||1}/${a.npDeployYear||2027}`} type="date"
                    onChange={v=>{const p=String(v).split(/[\/\-]/);if(p.length===3){u("npDeployMonth",parseInt(p[0])||1);u("npDeployDay",parseInt(p[1])||1);u("npDeployYear",parseInt(p[2])||2027);}}} 
                    helper="M/D/YYYY" />
                  <InputBox label="Exit Date" value={`${a.npExitMonth||4}/${a.npExitDay||30}/${a.npExitYear||2029}`} type="date"
                    onChange={v=>{const p=String(v).split(/[\/\-]/);if(p.length===3){u("npExitMonth",parseInt(p[0])||1);u("npExitDay",parseInt(p[1])||1);u("npExitYear",parseInt(p[2])||2029);}}}
                    helper="M/D/YYYY" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Carousel */}
        <Carousel>
          {/* Returns */}
          <div>
            <div style={{ fontSize:"15px",fontWeight:700,color:C.textMid,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:"24px" }}>Returns & Distribution</div>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:"32px",alignItems:"start" }}>
              <Stat label="Total Return" value={$(m.totalReturn)} color={m.totalReturn>0?C.positive:C.negative} />
              <Stat label="Return Percentage" value={pct(m.returnPct)} />
              <Stat label="Annual Return on Purchase Capital" value={pct(m.purchaseXirr)} color={C.accent} />
              <Stat label="Annual Return on All Other Capital" value={pct(m.nonPurchaseXirr)} color={m.nonPurchaseXirr>0.2?C.positive:C.warn} />
            </div>
            {/* Waterfall */}
            <div style={{ marginTop:"28px",padding:"20px 24px",background:C.surfaceAlt,borderRadius:"12px" }}>
              <div style={{ fontSize:"13px",fontWeight:600,color:C.textMid,marginBottom:"14px",textTransform:"uppercase",letterSpacing:"0.04em" }}>Pro Forma</div>
              {[
                {label:"PURCHASE & PERMITTING RELATED COSTS",value:m.purchaseCost,color:C.text},
                {label:`PREF ON RM'S CAPITAL for ACQUISITION`,value:m.prefPurchase,color:C.textMid},
                {label:`PREF ON RM'S CAPITAL for SITE WORK`,value:m.prefSite,color:C.textMid},
                {label:`PREF ON RM'S CAPITAL for MODULAR HOME RELATED COSTS`,value:m.prefModular,color:C.textMid},
                {label:`CAPITAL TO BUY & FINISH THE MARKET RATE HOUSES @${m.mktCostPerSF} PER SF & THE AFFORDABLE HOUSES @ $${m.affCostPerSF} PER SF`,value:m.capitalProductionCost,color:C.textMid},
                {label:"All costs related to modular home acquisition funded by sale proceeds",value:m.proceedsProductionCost,color:C.textMid},
                {label:"SITE & MISC CONSTRUCTION COSTS",value:m.siteMiscCosts,color:C.textMid},
                {label:"TOTAL CAPITAL REQUIRED",value:m.totalCapital,color:C.text,bold:true},
                {label:"*GROSS SALES OF THE HOUSES",value:m.grossSales,color:C.positive},
                {label:"NET SALES",value:m.netSales,color:C.text,bold:true},
                {label:"TOTAL RETURN",value:m.totalReturn,color:m.totalReturn>0?C.positive:C.negative,bold:true},
                {label:"Return Percentage",value:null,pctValue:pct(m.returnPct),color:C.text},
                {label:`RM return after investment w/ ${(a.rmProfitShare*100).toFixed(0)}% of the Profit`,value:m.rmReturn,color:C.accent,bold:true},
                {label:`Annual return % on purchase capital (${m.purchaseHoldMonths}mo)`,value:null,pctValue:pct(m.purchaseXirr),color:C.accent},
                {label:`Annual return % on all other capital (${m.nonPurchaseHoldMonths}mo)`,value:null,pctValue:pct(m.nonPurchaseXirr),color:m.nonPurchaseXirr>0.2?C.positive:C.warn},
                {label:"RM overall return %",value:null,pctValue:pct(m.totalCapital>0?m.rmReturn/m.totalCapital:0),color:C.accent,bold:true,hero:true},
              ].map((row,i)=>(
                <div key={i} style={{ display:"flex",justifyContent:"space-between",alignItems:"center",padding:row.hero?"18px 0":"8px 0",borderTop:row.bold?`2px solid ${C.text}`:`1px solid ${C.borderLight}`,marginTop:row.bold?"8px":"0",background:row.hero?"rgba(74,111,165,0.06)":"transparent",borderRadius:row.hero?"10px":"0",paddingLeft:row.hero?"16px":"0",paddingRight:row.hero?"16px":"0",marginLeft:row.hero?"-16px":"0",marginRight:row.hero?"-16px":"0" }}>
                  <div style={{ flex:1,minWidth:0,paddingRight:"16px" }}>
                    <span style={{ fontSize:row.hero?"18px":row.bold?"13px":"12px",color:row.hero?C.accent:row.bold?C.text:C.textMid,fontWeight:row.bold?700:500,letterSpacing:row.hero?"-0.02em":"0" }}>{row.label}</span>
                  </div>
                  <span style={{ fontSize:row.hero?"32px":"14px",fontWeight:row.hero?800:row.bold?700:600,color:row.color,fontVariantNumeric:"tabular-nums",whiteSpace:"nowrap",letterSpacing:row.hero?"-0.03em":"0" }}>
                    {row.pctValue ? row.pctValue : row.value!=null ? $f(row.value) : ""}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Breakeven */}
          <div>
            <div style={{ fontSize:"15px",fontWeight:700,color:C.textMid,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:"24px" }}>Breakeven Analysis</div>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:"32px",marginBottom:"32px" }}>
              <Stat label="Break-Even Home Price" value={$f(m.breakEvenPrice)} color={C.warn} />
              <Stat label="Price Cushion" value={$f(m.cushionAboveBreakEven)} color={m.cushionAboveBreakEven>0?C.positive:C.negative} />
              <Stat label="Margin of Safety" value={pct(m.marginOfSafety)} color={m.marginOfSafety>0.15?C.positive:C.negative} />
              <Stat label="Break-Even Month" value={`Month ${m.breakevenMonth}`} color={C.accent} />
            </div>
            <div style={{ fontSize:"14px",color:C.textMid,marginBottom:"10px",fontWeight:500 }}>
              Project timeline — {a.projectMonths} months total, sales begin Month {m.salesStartMonth}
            </div>
            <div style={{ position:"relative",height:"36px",background:C.surfaceAlt,borderRadius:"18px",overflow:"hidden" }}>
              {/* Capital deploy phase: M1 to salesStart-1 */}
              <div style={{ position:"absolute",left:0,top:0,bottom:0,width:`${Math.min(((m.salesStartMonth-1)/a.projectMonths)*100,100)}%`,background:"rgba(192,86,75,0.15)",borderRadius:"18px 0 0 18px" }} />
              {/* Sales to breakeven */}
              <div style={{ position:"absolute",left:`${((m.salesStartMonth-1)/a.projectMonths)*100}%`,top:0,bottom:0,width:`${(Math.max(m.breakevenMonth-m.salesStartMonth+1,0)/a.projectMonths)*100}%`,background:"rgba(196,148,58,0.2)" }} />
              {/* Profit zone */}
              {m.breakevenMonth<a.projectMonths && (
                <div style={{ position:"absolute",left:`${(m.breakevenMonth/a.projectMonths)*100}%`,top:0,bottom:0,right:0,background:"rgba(91,140,106,0.15)",borderRadius:"0 18px 18px 0" }} />
              )}
              {/* Breakeven marker */}
              <div style={{ position:"absolute",left:`${Math.min((m.breakevenMonth/a.projectMonths)*100,100)}%`,top:"4px",bottom:"4px",width:"3px",borderRadius:"2px",background:C.text,transform:"translateX(-1px)" }} />
            </div>
            <div style={{ display:"flex",justifyContent:"space-between",marginTop:"8px",fontSize:"13px",color:C.textMid }}>
              <span style={{ fontWeight:500 }}>Capital Deploy (M1–{m.salesStartMonth-1})</span>
              <span style={{ color:C.warn,fontWeight:700 }}>Break-even: {monthLabel(m.breakevenMonth)}</span>
              <span style={{ color:C.positive,fontWeight:500 }}>{m.breakevenMonth<a.projectMonths?"Profit Zone":""}</span>
            </div>
          </div>

          {/* Cost Stack */}
          <div>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:"20px" }}>
              <div style={{ fontSize:"15px",fontWeight:700,color:C.textMid,textTransform:"uppercase",letterSpacing:"0.06em" }}>Cost Stack</div>
              <div style={{ fontSize:"26px",fontWeight:700,color:C.text,fontVariantNumeric:"tabular-nums" }}>{$f(totalAllCosts)} <span style={{ fontSize:"14px",fontWeight:500,color:C.textMid }}>total all-in costs</span></div>
            </div>
            <div style={{ display:"flex",height:"12px",borderRadius:"6px",overflow:"hidden",marginBottom:"20px" }}>
              {costs.map((c,i)=>(<div key={i} style={{ width:`${(c.val/totalAllCosts)*100}%`,background:c.color,transition:"width 0.6s" }} />))}
            </div>
            {costs.map((c,i)=>(<CostRow key={i} label={c.label} value={c.val} pctVal={c.val/totalAllCosts} barColor={c.color} />))}
          </div>

          {/* Exit Snapshot */}
          <div>
            <div style={{ fontSize:"15px",fontWeight:700,color:C.textMid,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:"24px" }}>Exit Snapshot</div>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"32px",marginBottom:"32px" }}>
              <Stat label="Gross Revenue" value={$(m.grossSales)} />
              <Stat label="Net After Commission" value={$(m.grossSales - m.commission)} />
              <Stat label="Break-Even Market Price" value={$f(m.breakEvenPrice)} color={C.warn} size="sm" />
              <Stat label={`${scenario} Market Price`} value={$f(res)} color={C.positive} size="sm" />
            </div>
            <div style={{ padding:"18px 22px",background:C.surfaceAlt,borderRadius:"10px" }}>
              <div style={{ fontSize:"14px",color:C.textMid,marginBottom:"6px",fontWeight:600 }}>Sensitivity</div>
              <div style={{ fontSize:"15px",color:C.text,lineHeight:1.6 }}>
                A <span style={{ fontWeight:700 }}>5% drop</span> in revenue would reduce net proceeds by{" "}
                <span style={{ fontWeight:700,color:C.negative }}>{$(m.drop5pct)}</span>.
                Each <span style={{ fontWeight:700 }}>$50K</span> change in market home price shifts profit by{" "}
                <span style={{ fontWeight:700,color:C.accent }}>{$(m.sensitivityPer50K)}</span>.
              </div>
            </div>
          </div>
        </Carousel>
      </main>

      {/* Floating AI */}
      <div style={{ position:"fixed",bottom:"24px",right:"24px",zIndex:200 }}>
        {chatOpen&&(
          <div style={{ width:"360px",borderRadius:"16px",border:`1px solid ${C.border}`,boxShadow:"0 16px 48px rgba(0,0,0,0.12)",background:C.surface,marginBottom:"12px",overflow:"hidden",animation:"fadeUp 0.25s ease" }}>
            <div style={{ padding:"12px 16px",borderBottom:`1px solid ${C.borderLight}`,display:"flex",alignItems:"center",justifyContent:"space-between" }}>
              <div style={{ display:"flex",alignItems:"center",gap:"8px" }}>
                <div style={{ width:"8px",height:"8px",borderRadius:"50%",background:C.accent }} />
                <span style={{ fontSize:"13px",fontWeight:600 }}>Deal Analyst</span>
              </div>
              <button onClick={()=>setChatOpen(false)} style={{ border:"none",background:"transparent",fontSize:"18px",color:C.textMuted,cursor:"pointer",lineHeight:1 }}>×</button>
            </div>
            <AIChat assumptions={a} metrics={m} scenario={scenario} />
          </div>
        )}
        <button onClick={()=>setChatOpen(!chatOpen)} style={{
          width:"48px",height:"48px",borderRadius:"50%",border:`1px solid ${C.border}`,
          background:chatOpen?C.accent:C.surface,color:chatOpen?"#fff":C.accent,
          fontSize:"18px",cursor:"pointer",boxShadow:"0 2px 12px rgba(0,0,0,0.08)",
          display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.2s",marginLeft:"auto",fontFamily:font,
        }}
          onMouseOver={e=>{if(!chatOpen)e.currentTarget.style.boxShadow="0 4px 16px rgba(0,0,0,0.12)";}}
          onMouseOut={e=>{if(!chatOpen)e.currentTarget.style.boxShadow="0 2px 12px rgba(0,0,0,0.08)";}}
        >✦</button>
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
    const descParas = (s.description || 'A stunning private residence offering the finest in luxury living.').split(/\n\n+/).filter(Boolean);
    const detailRows = details.map(r => `<div class="od"><span class="dk">${esc(r.k)}</span><span class="dv">${esc(r.v)}</span></div>`).join('')
      || `<div class="od"><span class="dk">Status</span><span class="dv">${esc(s.status)}</span></div>`;
    const descHTML = descParas.map(p => `<p>${esc(p)}</p>`).join('');
    const galImgs = [0,1,2,3,4].map((i,n) => `<div class="gi g${n+1}" onclick="openLB(this)"><img src="${esc(imgs[i])}" alt=""></div>`).join('');
    const featHTML = feats.length ? feats.map(fg => `<div class="fg"><p class="fgt">${esc(fg.title)}</p><ul class="fl">${fg.items.map(it => `<li>${esc(it)}</li>`).join('')}</ul></div>`).join('')
      : `<div class="fg" style="grid-column:1/-1"><p class="fgt">Features</p><ul class="fl"><li>Luxury finishes throughout</li></ul></div>`;
    const nearbyHTML = nearby.map(n => `<li><span>${esc(n.k)}</span><span>${esc(n.v)}</span></li>`).join('');
    const acresStat = s.acres ? `<div class="hs"><span class="hsv">${esc(s.acres)}</span><span class="hsl">Acres</span></div>` : '';
    const aphoto = s.agentPhoto ? `<img class="aph" src="${esc(s.agentPhoto)}" alt="">` : '';
    const plink = s.agentPhone ? `<a href="tel:${s.agentPhone.replace(/\\D/g,'')}"><span class="ico">✆</span>${esc(s.agentPhone)}</a>` : '';
    const elink = s.agentEmail ? `<a href="mailto:${esc(s.agentEmail)}"><span class="ico">✉</span>${esc(s.agentEmail)}</a>` : '';
    const nbdesc = s.neighborhood ? `<p>${esc(s.neighborhood)}</p>` : '';
    return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>${esc(s.address)} — ${esc(s.brokerage)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300&family=Jost:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}:root{--w:#FAFAF8;--b:#111110;--g1:#EFEFEF;--g2:#CCCCCC;--g4:#888888;--g6:#444444;--a:#FFFFFF;--sf:'Cormorant Garamond',Georgia,serif;--ss:'Jost',sans-serif}html{scroll-behavior:smooth}body{background:var(--w);color:var(--b);font-family:var(--ss);-webkit-font-smoothing:antialiased}
nav{position:fixed;top:0;left:0;right:0;z-index:100;display:flex;justify-content:space-between;align-items:center;padding:24px 48px;transition:background .4s}nav.sc{background:rgba(250,250,248,.92);backdrop-filter:blur(12px);border-bottom:1px solid var(--g2)}.nl{font-family:var(--sf);font-size:15px;letter-spacing:.2em;text-transform:uppercase;color:var(--w);text-decoration:none;transition:color .3s}nav.sc .nl{color:var(--b)}.nl img{transition:filter .3s}nav.sc .nl img{filter:none!important}.nv{display:flex;gap:36px;list-style:none}.nv a{font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:rgba(255,255,255,.85);text-decoration:none;transition:color .3s}nav.sc .nv a{color:var(--g6)}.nv a:hover{color:rgba(255,255,255,.6)}
section{padding:100px 0}.ct{max-width:1140px;margin:0 auto;padding:0 48px}.sl{font-size:14px;letter-spacing:.25em;text-transform:uppercase;color:var(--g4);margin-bottom:22px;font-weight:700}.st{font-family:var(--sf);font-size:clamp(42px,4.5vw,64px);font-weight:700;line-height:1.1;color:var(--b)}.dv-line{width:56px;height:3px;background:var(--g2);margin:28px 0}
.hero{position:relative;height:100vh;min-height:700px;overflow:hidden;display:flex;align-items:flex-end}.hi{position:absolute;inset:0;background:url('${esc(imgs[0])}') center/cover no-repeat;animation:hZ 8s ease-out forwards}@keyframes hZ{from{transform:scale(1.05)}to{transform:scale(1)}}.ho{position:absolute;inset:0;background:linear-gradient(to top,rgba(10,10,9,.72) 0%,rgba(10,10,9,.1) 55%,transparent 100%)}.hc{position:relative;z-index:2;padding:0 48px 64px;width:100%;animation:fU 1.2s .3s both}@keyframes fU{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}.hl{font-size:14px;letter-spacing:.25em;text-transform:uppercase;color:rgba(255,255,255,.75);margin-bottom:18px;font-weight:700}.ha{font-family:var(--sf);font-size:clamp(52px,5.5vw,82px);font-weight:700;color:var(--w);line-height:1.1;margin-bottom:32px;max-width:700px}.hs-wrap{display:flex;flex-wrap:wrap}.hs{padding:18px 32px;border:1px solid rgba(255,255,255,.2);border-right:none;text-align:center}.hs:first-child{border-left:1px solid rgba(255,255,255,.2)}.hs:last-child{border-right:1px solid rgba(255,255,255,.2)}.hsv{font-family:var(--sf);font-size:34px;font-weight:700;color:#fff;display:block}.hsl{font-size:13px;letter-spacing:.18em;text-transform:uppercase;color:rgba(255,255,255,.8);margin-top:5px;display:block;font-weight:700}.hp{font-family:var(--sf);font-size:clamp(28px,3vw,40px);font-weight:700;color:#fff;letter-spacing:.03em;margin-top:28px}
.og{display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:start;margin-top:60px}.ot p{font-size:19px;line-height:1.8;color:var(--g6);margin-bottom:22px}.oa{border-left:1px solid var(--g2);padding-left:48px}.od{display:flex;justify-content:space-between;align-items:baseline;padding:16px 0;border-bottom:1px solid var(--g2)}.od:first-child{border-top:1px solid var(--g2)}.dk{font-size:13px;letter-spacing:.12em;text-transform:uppercase;color:var(--g4);font-weight:700}.dv{font-family:var(--sf);font-size:22px;font-weight:700;color:var(--b)}
.gal{background:var(--g1);padding:80px 0}.gh{padding:0 48px;margin-bottom:48px}.gg{display:grid;grid-template-columns:repeat(12,1fr);grid-template-rows:340px 260px;gap:6px;padding:0 48px}.gi{overflow:hidden;cursor:pointer}.gi img{width:100%;height:100%;object-fit:cover;transition:transform .7s cubic-bezier(.25,.46,.45,.94)}.gi:hover img{transform:scale(1.04)}.g1{grid-column:1/8;grid-row:1}.g2{grid-column:8/13;grid-row:1}.g3{grid-column:1/5;grid-row:2}.g4{grid-column:5/9;grid-row:2}.g5{grid-column:9/13;grid-row:2}
.lb{position:fixed;inset:0;background:rgba(10,10,9,.96);z-index:999;display:none;align-items:center;justify-content:center}.lb.on{display:flex}.lb img{max-width:90vw;max-height:85vh;object-fit:contain}.lbc{position:absolute;top:24px;right:32px;color:#fff;font-size:28px;cursor:pointer;background:none;border:none;opacity:.7}.lbc:hover{opacity:1}
.feat{background:var(--w)}.fg-wrap{display:grid;grid-template-columns:repeat(3,1fr);margin-top:56px;border:1px solid var(--g2)}.fg{padding:40px 36px;border-right:1px solid var(--g2)}.fg:last-child{border-right:none}.fgt{font-size:14px;letter-spacing:.2em;text-transform:uppercase;color:var(--b);margin-bottom:24px;font-weight:700}.fl{list-style:none}.fl li{font-size:18px;color:#333;line-height:1.6;padding:11px 0;border-bottom:1px solid var(--g1);display:flex;align-items:center;gap:12px;font-weight:500}.fl li::before{content:'';width:6px;height:6px;border-radius:50%;background:var(--g4);flex-shrink:0}
.loc{background:var(--g1)}.lg{display:grid;grid-template-columns:1fr 420px;gap:64px;align-items:start;margin-top:56px}.li h3{font-family:var(--sf);font-size:36px;font-weight:700;margin-bottom:22px}.li p{font-size:18px;line-height:1.8;color:var(--g6);margin-bottom:32px}.nb{list-style:none}.nb li{display:flex;justify-content:space-between;padding:15px 0;border-bottom:1px solid var(--g2);font-size:17px}.nb li span:first-child{color:var(--g6);font-weight:600}.nb li span:last-child{color:var(--b);font-family:var(--sf);font-size:19px;font-weight:700}
.con{background:var(--b)}.cg{display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:start;margin-top:56px}.aph{width:80px;height:80px;border-radius:50%;object-fit:cover;margin-bottom:20px}.an{font-family:var(--sf);font-size:34px;font-weight:700;color:#fff;margin-bottom:6px}.at{font-size:13px;letter-spacing:.15em;text-transform:uppercase;color:rgba(255,255,255,.6);margin-bottom:28px;font-weight:600}.ac a{display:flex;align-items:center;gap:12px;color:rgba(255,255,255,.7);text-decoration:none;font-size:17px;margin-bottom:14px;transition:color .2s;font-weight:500}.ac a:hover{color:#fff}.ico{width:32px;height:32px;border:1px solid rgba(255,255,255,.1);display:flex;align-items:center;justify-content:center;flex-shrink:0}.ff{display:flex;flex-direction:column;gap:8px;margin-bottom:16px}.ff label{font-size:13px;letter-spacing:.15em;text-transform:uppercase;color:rgba(255,255,255,.55);font-weight:700}.ff input,.ff textarea{background:transparent;border:none;border-bottom:2px solid rgba(255,255,255,.25);color:#fff;font-family:var(--ss);font-size:17px;padding:13px 0;outline:none;transition:border-color .3s;width:100%}.ff input:focus,.ff textarea:focus{border-bottom-color:rgba(255,255,255,.9)}.ff textarea{resize:none;height:80px}.ff input::placeholder,.ff textarea::placeholder{color:rgba(255,255,255,.2)}.fr{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px}.bs{margin-top:24px;background:transparent;border:2px solid rgba(255,255,255,.7);color:#fff;font-family:var(--ss);font-size:14px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;padding:17px 44px;cursor:pointer;transition:all .3s}.bs:hover{background:rgba(255,255,255,.15);border-color:#fff;color:#fff}
footer{background:var(--b);border-top:1px solid rgba(255,255,255,.07);padding:32px 48px;display:flex;justify-content:space-between;align-items:center}footer p{font-size:14px;color:rgba(255,255,255,.45);letter-spacing:.08em;font-weight:500}footer a{font-size:14px;color:rgba(255,255,255,.55);text-decoration:none;transition:color .2s;font-weight:500}footer a:hover{color:#fff}
.rv{opacity:0;transform:translateY(32px);transition:opacity .8s ease,transform .8s ease}.rv.vi{opacity:1;transform:translateY(0)}
@media(max-width:900px){nav{padding:20px 24px}.nv{display:none}.hc{padding:0 24px 48px}.ct{padding:0 24px}section{padding:72px 0}.og{grid-template-columns:1fr;gap:48px}.oa{border-left:none;border-top:1px solid var(--g2);padding:32px 0 0}.gg{grid-template-columns:1fr 1fr;grid-template-rows:repeat(3,180px);padding:0 24px}.g1{grid-column:1/3;grid-row:1}.g2{grid-column:1;grid-row:2}.g3{grid-column:2;grid-row:2}.g4{grid-column:1;grid-row:3}.g5{grid-column:2;grid-row:3}.fg-wrap{grid-template-columns:1fr}.cg{grid-template-columns:1fr}.lg{grid-template-columns:1fr}footer{flex-direction:column;gap:12px;text-align:center;padding:24px}}</style></head><body>
<nav id="nb"><a class="nl" href="#"><img src="data:image/png;base64,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" alt="Next Wave" style="height:36px;width:auto;display:block;filter:brightness(0) invert(1)"></a><ul class="nv"><li><a href="#ov">Overview</a></li><li><a href="#gl">Gallery</a></li><li><a href="#ft">Features</a></li><li><a href="#lc">Location</a></li><li><a href="#cn">Inquire</a></li></ul></nav>
<section class="hero"><div class="hi"></div><div class="ho"></div><div class="hc"><p class="hl">Exclusive Listing</p><h1 class="ha">${esc(s.address)}<br>${esc(s.city)}, ${esc(s.state)}</h1><div class="hs-wrap"><div class="hs"><span class="hsv">${esc(s.beds)}</span><span class="hsl">Bedrooms</span></div><div class="hs"><span class="hsv">${esc(s.baths)}</span><span class="hsl">Bathrooms</span></div><div class="hs"><span class="hsv">${esc(s.sqft)}</span><span class="hsl">Sq. Ft.</span></div>${acresStat}</div><p class="hp">${esc(s.price)}</p></div></section>
<section id="ov"><div class="ct"><div class="rv"><p class="sl">The Residence</p><h2 class="st">Refined living in<br>${esc(s.city)}</h2><div class="dv-line"></div></div><div class="og rv"><div class="ot">${descHTML}</div><div class="oa">${detailRows}</div></div></div></section>
<section class="gal" id="gl"><div class="gh rv"><p class="sl">Photography</p><h2 class="st">The Detail</h2></div><div class="gg rv">${galImgs}</div></section>
<div class="lb" id="lb"><button class="lbc" onclick="closeLB()">✕</button><img id="lbi" src="" alt=""></div>
<section class="feat" id="ft"><div class="ct"><div class="rv"><p class="sl">Highlights</p><h2 class="st">Exceptional Features</h2><div class="dv-line"></div></div><div class="fg-wrap rv">${featHTML}</div></div></section>
<section class="loc" id="lc"><div class="ct"><div class="rv"><p class="sl">The Neighborhood</p><h2 class="st">${esc(s.neighborhoodName || s.city + ', ' + s.state)}</h2><div class="dv-line"></div></div><div class="rv">${nbdesc}${nearbyHTML ? `<ul class="nb" style="margin-top:24px">${nearbyHTML}</ul>` : ''}</div></div></section>
<section class="con" id="cn"><div class="ct"><div class="rv"><p class="sl" style="color:rgba(255,255,255,.5)">Private Inquiry</p><h2 class="st" style="color:#fff">Schedule a Showing</h2><div class="dv-line"></div></div><div class="cg rv"><div>${aphoto}<p class="an">${esc(s.agentName)}</p><p class="at">Listing Agent${s.agentDre ? ' · ' + esc(s.agentDre) : ''}</p><div class="ac">${plink}${elink}</div><p style="margin-top:32px;font-size:13px;color:rgba(255,255,255,.22);line-height:1.7">This property is offered exclusively through ${esc(s.brokerage)}.</p></div><div><div class="fr"><div class="ff"><label>First Name</label><input type="text" placeholder="First"></div><div class="ff"><label>Last Name</label><input type="text" placeholder="Last"></div></div><div class="ff"><label>Email</label><input type="email" placeholder="your@email.com"></div><div class="ff"><label>Phone</label><input type="tel" placeholder="+1 (555) 000-0000"></div><div class="ff"><label>Message</label><textarea placeholder="I'd like to schedule a private showing…"></textarea></div><button class="bs" onclick="this.disabled=true;this.textContent='Sending…';setTimeout(()=>{this.style.display='none';document.getElementById('sm').style.display='block'},1200)">Send Inquiry</button><p id="sm" style="display:none;font-family:var(--sf);font-size:24px;color:#fff;margin-top:16px;font-style:italic;font-weight:700">Thank you — we'll be in touch.</p></div></div></div></section>
<footer><p>© ${new Date().getFullYear()} ${esc(s.brokerage)}${s.agentDre ? ' · ' + esc(s.agentDre) : ''} · All Rights Reserved</p>${s.agentEmail ? `<a href="mailto:${esc(s.agentEmail)}">${esc(s.agentEmail)}</a>` : ''}</footer>
<script>const nb=document.getElementById('nb');window.addEventListener('scroll',()=>nb.classList.toggle('sc',window.scrollY>80));const obs=new IntersectionObserver((e)=>{e.forEach((r,i)=>{if(r.isIntersecting){setTimeout(()=>r.target.classList.add('vi'),i*80);obs.unobserve(r.target)}})},{threshold:.12});document.querySelectorAll('.rv').forEach(el=>obs.observe(el));function openLB(item){document.getElementById('lbi').src=item.querySelector('img').src;document.getElementById('lb').classList.add('on');document.body.style.overflow='hidden'}function closeLB(){document.getElementById('lb').classList.remove('on');document.body.style.overflow=''}document.getElementById('lb').addEventListener('click',function(e){if(e.target===this)closeLB()});<\/script></body></html>`;
  };

  // ─── Build Dev HTML ───
  const buildDevHTML = () => {
    const d = dev;
    const priceRange = d.priceTo ? `${esc(d.priceFrom)} – ${esc(d.priceTo)}` : esc(d.priceFrom);
    const statsHTML = [
      d.totalLots ? `<div class="ds"><span class="dsv">${esc(d.totalLots)}</span><span class="dsl">Total Lots</span></div>` : '',
      d.available ? `<div class="ds"><span class="dsv">${esc(d.available)}</span><span class="dsl">Available</span></div>` : '',
      d.completion ? `<div class="ds"><span class="dsv">${esc(d.completion)}</span><span class="dsl">Est. Completion</span></div>` : '',
    ].filter(Boolean).join('');
    const f1 = d.feat1.split('\n').filter(Boolean).map(f => `<li>${esc(f)}</li>`).join('');
    const f2 = d.feat2.split('\n').filter(Boolean).map(f => `<li>${esc(f)}</li>`).join('');
    const nbHTML = d.nearby.filter(n => n.k).map(n => `<li><span>${esc(n.k)}</span><span>${esc(n.v)}</span></li>`).join('');
    const hero = d.heroImage || DEV_HERO_FB;
    const statusClr = {'Available':'#4ade80','Reserved':'#facc15','Sold':'#f87171','Coming Soon':'#94a3b8'};
    const lotCards = lots.map((lot, idx) => {
      const imgs = lot.images.map((im, i) => im || LOT_FB[(idx*4+i) % LOT_FB.length]);
      const c = statusClr[lot.status] || '#94a3b8';
      const thumbs = imgs.slice(0,4).map(img => `<div class="lt" onclick="openLB('${esc(img)}')"><img src="${esc(img)}" alt=""></div>`).join('');
      const featsH = lot.feats ? `<ul class="lf">${lot.feats.split('\\n').filter(Boolean).map(f => `<li>${esc(f)}</li>`).join('')}</ul>` : '';
      const sr = [lot.beds, lot.baths, lot.sqft].filter(Boolean);
      const srH = sr.map((v,i) => `<span class="lst">${esc(v)} <em>${['Bed','Bath','Sq Ft'][i]}</em></span>`).join('');
      return `<div class="lc rv"><div class="lim" onclick="openLB('${esc(imgs[0])}')"><img src="${esc(imgs[0])}" alt="${esc(lot.addr)}"><span class="lstat" style="background:${c}20;color:${c};border:1px solid ${c}40">${esc(lot.status)}</span></div><div class="lts">${thumbs}</div><div class="lin"><div class="lh"><div><h3 class="ln">${esc(lot.addr || 'Lot ' + (idx+1))}</h3><div class="lsr">${srH}</div></div><div class="lp">${esc(lot.price || 'Price on Request')}</div></div>${lot.desc ? `<p class="ld">${esc(lot.desc)}</p>` : ''}${featsH}<button class="liq" onclick="document.getElementById('contact').scrollIntoView({behavior:'smooth'})">Inquire About This Lot →</button></div></div>`;
    }).join('');
    const aph = d.agentPhoto ? `<img class="aph" src="${esc(d.agentPhoto)}" alt="">` : '';
    const pl = d.agentPhone ? `<a href="tel:${d.agentPhone.replace(/\\D/g,'')}"><span class="ico">✆</span>${esc(d.agentPhone)}</a>` : '';
    const el = d.agentEmail ? `<a href="mailto:${esc(d.agentEmail)}"><span class="ico">✉</span>${esc(d.agentEmail)}</a>` : '';
    return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>${esc(d.name)} — ${esc(d.brokerage)}</title>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300&family=Jost:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}:root{--w:#FAFAF8;--b:#111110;--g1:#EFEFEF;--g2:#CCCCCC;--g4:#888888;--g6:#444444;--sf:'Cormorant Garamond',Georgia,serif;--ss:'Jost',sans-serif}html{scroll-behavior:smooth}body{background:var(--w);color:var(--b);font-family:var(--ss);-webkit-font-smoothing:antialiased}
nav{position:fixed;top:0;left:0;right:0;z-index:100;display:flex;justify-content:space-between;align-items:center;padding:24px 48px;transition:background .4s}nav.sc{background:rgba(250,250,248,.92);backdrop-filter:blur(12px);border-bottom:1px solid var(--g2)}.nl{font-family:var(--sf);font-size:15px;letter-spacing:.2em;text-transform:uppercase;color:#fff;text-decoration:none;transition:color .3s}nav.sc .nl{color:var(--b)}.nl img{transition:filter .3s}nav.sc .nl img{filter:none!important}.nv{display:flex;gap:36px;list-style:none}.nv a{font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:rgba(255,255,255,.85);text-decoration:none;transition:color .3s}nav.sc .nv a{color:var(--g6)}.nv a:hover{color:rgba(255,255,255,.6)}
section{padding:100px 0}.ct{max-width:1140px;margin:0 auto;padding:0 48px}.sl{font-size:14px;letter-spacing:.25em;text-transform:uppercase;color:var(--g4);margin-bottom:22px;font-weight:700}.st{font-family:var(--sf);font-size:clamp(42px,4.5vw,64px);font-weight:700;line-height:1.1}.dv-line{width:56px;height:3px;background:var(--g2);margin:28px 0}
.hero{position:relative;height:100vh;min-height:700px;overflow:hidden;display:flex;align-items:flex-end}.hi{position:absolute;inset:0;background:url('${esc(hero)}') center/cover no-repeat;animation:hZ 8s ease-out forwards}@keyframes hZ{from{transform:scale(1.05)}to{transform:scale(1)}}.ho{position:absolute;inset:0;background:linear-gradient(to top,rgba(8,8,7,.8) 0%,rgba(8,8,7,.15) 55%,transparent 100%)}.hc{position:relative;z-index:2;padding:0 56px 72px;width:100%;animation:fU 1.2s .3s both}@keyframes fU{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
.ds{display:inline-block;padding:14px 28px;border:1px solid rgba(255,255,255,.2);text-align:center;margin-right:-1px}.dsv{font-family:var(--sf);font-size:30px;font-weight:700;color:#fff;display:block}.dsl{font-size:11px;letter-spacing:.15em;text-transform:uppercase;color:rgba(255,255,255,.7);margin-top:4px;display:block;font-weight:700}
.lc{background:#fff;border-radius:2px;overflow:hidden;margin-bottom:16px}.lim{height:280px;overflow:hidden;position:relative;cursor:pointer}.lim img{width:100%;height:100%;object-fit:cover;transition:transform .6s}.lim:hover img{transform:scale(1.03)}.lstat{position:absolute;top:14px;right:14px;font-size:11px;letter-spacing:.12em;text-transform:uppercase;padding:5px 12px;border-radius:2px;font-weight:700}.lts{display:grid;grid-template-columns:repeat(4,1fr);gap:2px}.lt{height:72px;overflow:hidden;cursor:pointer}.lt img{width:100%;height:100%;object-fit:cover;transition:transform .4s}.lt:hover img{transform:scale(1.06)}.lin{padding:24px 28px 28px}.lh{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:14px}.ln{font-family:var(--sf);font-size:26px;font-weight:700}.lsr{margin-top:6px;display:flex;gap:16px}.lst{font-size:14px;color:var(--g4)}.lst em{font-style:normal;font-weight:600}.lp{font-family:var(--sf);font-size:24px;font-weight:700;white-space:nowrap}.ld{font-size:16px;line-height:1.7;color:var(--g6);margin-bottom:14px}.lf{list-style:none;display:flex;flex-wrap:wrap;gap:6px;margin-bottom:16px}.lf li{font-size:13px;background:var(--g1);padding:5px 14px;border-radius:2px;font-weight:500}.liq{background:transparent;border:1.5px solid var(--b);color:var(--b);font-family:var(--ss);font-size:12px;font-weight:700;letter-spacing:.15em;text-transform:uppercase;padding:12px 28px;cursor:pointer;transition:all .3s}.liq:hover{background:var(--b);color:#fff}
.lb{position:fixed;inset:0;background:rgba(10,10,9,.96);z-index:999;display:none;align-items:center;justify-content:center}.lb.on{display:flex}.lb img{max-width:90vw;max-height:85vh;object-fit:contain}.lbc{position:absolute;top:24px;right:32px;color:#fff;font-size:28px;cursor:pointer;background:none;border:none;opacity:.7}.lbc:hover{opacity:1}
.con{background:var(--b)}.cg{display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:start;margin-top:56px}.aph{width:80px;height:80px;border-radius:50%;object-fit:cover;margin-bottom:20px}.an{font-family:var(--sf);font-size:34px;font-weight:700;color:#fff;margin-bottom:6px}.at{font-size:13px;letter-spacing:.15em;text-transform:uppercase;color:rgba(255,255,255,.6);margin-bottom:28px;font-weight:600}.ac a{display:flex;align-items:center;gap:12px;color:rgba(255,255,255,.7);text-decoration:none;font-size:17px;margin-bottom:14px;transition:color .2s}.ac a:hover{color:#fff}.ico{width:32px;height:32px;border:1px solid rgba(255,255,255,.1);display:flex;align-items:center;justify-content:center;flex-shrink:0}.ff{display:flex;flex-direction:column;gap:8px;margin-bottom:16px}.ff label{font-size:13px;letter-spacing:.15em;text-transform:uppercase;color:rgba(255,255,255,.55);font-weight:700}.ff input,.ff textarea{background:transparent;border:none;border-bottom:2px solid rgba(255,255,255,.25);color:#fff;font-family:var(--ss);font-size:17px;padding:13px 0;outline:none;width:100%}.ff textarea{resize:none;height:80px}.fr{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px}.bs{margin-top:24px;background:transparent;border:2px solid rgba(255,255,255,.7);color:#fff;font-family:var(--ss);font-size:14px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;padding:17px 44px;cursor:pointer;transition:all .3s}.bs:hover{background:rgba(255,255,255,.15)}
.nb{list-style:none}.nb li{display:flex;justify-content:space-between;padding:15px 0;border-bottom:1px solid var(--g2);font-size:17px}.nb li span:first-child{color:var(--g6);font-weight:600}.nb li span:last-child{color:var(--b);font-family:var(--sf);font-size:19px;font-weight:700}
footer{background:var(--b);border-top:1px solid rgba(255,255,255,.07);padding:32px 48px;display:flex;justify-content:space-between;align-items:center}footer p{font-size:14px;color:rgba(255,255,255,.45)}footer a{font-size:14px;color:rgba(255,255,255,.55);text-decoration:none}
.rv{opacity:0;transform:translateY(32px);transition:opacity .8s ease,transform .8s ease}.rv.vi{opacity:1;transform:translateY(0)}
@media(max-width:900px){nav{padding:20px 24px}.nv{display:none}.hc{padding:0 24px 48px}.ct{padding:0 24px}section{padding:72px 0}.cg{grid-template-columns:1fr}.lh{flex-direction:column;gap:8px}footer{flex-direction:column;gap:8px;text-align:center}}</style></head><body>
<nav id="nb"><a class="nl" href="#"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAbkAAABmCAYAAABWS+9mAADnh0lEQVR4nOy9d7hkR3Xu/VtVtVN3nzBJoxxAIoucoxHJgEgmI5OxDRgbY2OSMTbYOGdMBpEFJueMDNiIIAQSEkICoRwnnjmnu3eq8P1Re/fpMzMCbO53H997p55nT0/36bB37aoV3/Uuca3nZw0R+Zl/PzQOjUPj/84RBMJ+rwl+7tEDau4RJChC/yjQi48QIIRAQEDC7A9K9d8Lvv/K/nWBqgUnoAW0BiXdL3kIPqAkQPAgPv4IAC6euFJUonBKoVEYFJr489D9oCgIEJzHEQhKQCvofyd0JxQUvp+PAL67LhXWz787ZST42TwF1Gxu/k8cInPTut8IN/aH/9L3/2z98r/iN8wv/Q2HxqFxaPzfOQJRandD9vsTqO41dcDrQTa8EBVJ9+6ARKUm4LxDQkCCQiEokU7jxY9lybpCER/1kg+dslOdBBYADapXdAaCxwUw2iAEBI/zltD9joReicULk0Rhup9tPVjnIDgGxiB4AgoV4tujEmfDlUv32myOeuWnDjQUDo3/veOQkjs0Do1D46BDYD9FNx/16RRZWH9+wOf3k+4iYDtvSDp3TIkgCDo4gnXgmFNyAWqHGIWIEEJAQucFJikohXMB0CBCUBofop5zGsQHCgLGe3zwnSfZnYgxUfX1jlqnQAlgNKSJRoIGayG4mTIXopenb2zCwtz/D43/EUMOhSsPjUPj0LjxsVE+9B5aVHA3Hobb39PpvyXMixPxlOUELYrEGIxW+8U3iS6brP+OR7Ae2hC/U2vBdd8/F+3EAymgXXxU3Vfv74mFEEOhQqejXFR2zoHyFpP23mF/Xqr7r9rvuT9QsXXvC/8Hi9D/G8KVh5TcoXFoHBo3MtZzSxDzS6EX3HRhxDkZNJ+fktDl9AS8+JiZ6vVAUOC62F6vYYDKBxrvCF0CThMdu9aB9eB8/E3roLKB1hLK1mOBNih8ELwCpWP+zgiMNBSCJBpSBUmI4asUSFQ8J+Xj+SoNG1Jo4nDYqBRF1kOSgQO1dzc3YUOoVs0+83/q+P9byf3vGIfClYfGoXFo/JzRAUvE8zNFhqwrAek+55Qlin5BVB+vVDNUS3Dg0xhebJVQYZgAZYDWEVb31EzGFXtX11hdmzAup0zLhvGkZNo4rAdLwAXBIiAarQ3KaIwIOngGSRIWipzl0YhNS0O2LY7YulSwWCALWVR2iUCu46Minpd1EEyKl6jAFQGNR1TvDwISQ6BBYt7OCfjOCBCB5CAO3qHxv3cc8uQOjUPj0LiR0XtyUclFvRSV3AGoy8BGryV4UBava6KSM1G5+QS8hhC9tAooBSYe9ljCtSuWS66/gcuvvZobdq8QWoW1gaZpsB5EK5QYHDJDa/rubEKI6EgRQSME0WAyEI3HYWnwocUoT2IChYEtiwXbF4Ycd9gWjtmymSNGI5ZyLaMEMsA40B1IRXXKbhbXFN9dJ3gRnCgsCtcrOSALYH62iP0fPf5v8OQOKblD49A4NG5kdND8bvwsOHxUcr5LenWKUQIoG8N3knR+kKYl5tQagStvIFx6/R4u+OkV/OT6G1iZNjRaEZIElMa7+JuxHCHWJIjodQGrI+oxhhM72H5w4ANeDFPRBJOijMKLx9EADq08qfb4akqhPEUIFMGzKcs5essWTjj6KI7ZvJVbHmkk67wxA5gQw6AyqyVwMd4JeFE4MZ03Fz+T+vUw7v+J4/8KJeft/xknemgcGofG//4RZN4I3qjgJPioeILrJKFfl4pdnRrBgBYaHz22SsGOknDBZddzwU+v5KLLr6EhxZJggyKQ4tFoNF48lhbfKTgRASUR4dgN76MyVQgqRJCISECLwhtDKRorBsRHRewdSiTW3Qno4FEIWsJMUasQT73AcdzygDvc7ARuc7MtsjmNubysO5SLSo/g51CVc3Mk/I8Hnfyfoqh+mXFIyR0ah8ahcdBx8GJwAD8LSzbVlCzLItID8N7N3uu8oqw1yRBqgUt3hHDWjy7m3J9eynWTKa3JaUmxKHxIEa+QoNBeY4LgJUBicSrEUGQI+C7vBiCzx1iBp0J3XhJQAbwWGtRMSWqlUEp1yi5+X1SKgqBnqjN0rxkaltIa1a4x0MIx2zZzmxOO4ZbHHCnbFxRDoqem+4juXKoOmIFY/icrukNK7tA4NA6N/2dHkMg2AvsjJ/1M2aEVtm0pq4akGGCMpldzDTAFzruEcN6PL+bKnbvZMZ2wsyyZBgh5gZcEkFgMHsB4hfFggoB4vAk45fEILsSQqRcFohFRtNZGhaQ1WmsUQgge5xzBtQzShBBcZDMR8Cp6g71/miUJCsEgKBci2sR6lA8gLc6MwZcUCpbzhOVEcfgo55ZHHclJRx8hx29bJttf0dE9HlJy/yPGIXTloXFoHBo3PuZk4AGUVQKr+9YYLS2RJRlVgLWo99jXwOU7yvDtC6/noqt2cu0NO7BaowcDXJ4jQUAbgrXrPxUAfEQqSvwV6xwhSDwNpQkdzr/z3cjzAd6DtQ2uU3hKAkopUm1QbYXBRQXnI3WXaDDGoLUiTKckWjFIM4rMMBim5Doh0waMI184EqRhlBqGica0FaapwXnGK6tBti2LJ0ZpRW9IYR6CVf4PGYc8uUPj0Dg0Djr6cGXPTBlDgnNKCYVVitLGcKQYqIHL9hC+/f0LOOeiy7hi7AjJAlmWoUxK2zqquiWEQJKks2+KsPzoDvVsKKCwPiCiEWUIoqPyCzILX7Zt29GBBYwSTAcG8d6ivSW3FalYjNKkSjFKUw7bvImjt29j26Zltm1aJDeaPIMiQ7IkkqkkJrKamAB0QEqjIdOdsncd2GYuBdfTjwVZnzPj/2fXyf2/4MkdUnKHxqFxaBx0zOfk1r24XsnFsKFVihoogetKwjcvuJZvfP98rt+7hhot0SQFddC4psW5gFEJqU6QQAwpdvmvIFHRebEECREh2QcSRc9Q3tZHjyw4R3CWLNFgW1xTEdoKFSy51uSZpjCKk47expFbN3HcUcdw1NYRiwWSA7mKIJJUdaUBnYLqacGCxBBkSvRMe23v3Eb2FPScMdAXv3dFDQIkXv2PRlceUnKHxqFxaPw/O+aVnArzNXMAES5fKdhn4bzL94Z//+4F/PCqnVTpgJAsMLENvqlQGpQYgiiUJCgVa+ZCIIYPRWZ8llG5eUKX2VNoxAe893hvCc4jwYOz6GCZrOyi0LCQKzYvFBx72BZuevwx3Oymx3PEtkKGplNUrHcvSIBCdc9dVFhqRtTpY7lCF2tsXOS8xEckaZqksyhk0zQk2szman2sz5H8DOqz/wnj/yElt94qA+INk7DOzTqbhgNizF3bjdkb/lfd0BuHLf/XPvvf+fz/6rG+4P+742cmrucAAfOjp1Wa//x/LWzyy5/3/4Tx85L+0uWB1lvGzH+25yf8BX5owxz/Muv3Zw3fndPG/XrAOAgksj+vGWCkK1iGA69zw5SJ3fB7kdVDYSUCS67aC1/77g/Cty+8hL1W0eQjVlqoQkKepxhXo5yLnpg2+EBHqqwQrWNXnM6N6sN8EUUZ6VDEWcRacA3e1RhnUViyYEm9ZdMg4/ijtnO7m9+Um9/kWLZvNlLI+uyojn/E0HUf6K5fXFSYRuuIzgxACLhepnWaz3cE0v30OO86xSgoZWZ9GNaV2S8vf4L84nt1fp/f2N/7ROH8V/b3/Gcpuf9/1/IvOuYv7sbOdeN+mPecvYDprSalFSEEmsaSZgltHUjSeHutBR8CaRp/sKor0jQlBIdWGu8cumsMFVqPdP2YIj+ddMwAB5+gg1pAss6y0FpLmqZMpxWDQQ4BqsqRJBqtY/jAOU+aKpq6Js0SbF1i0rT7ivi7Te1J8/j/urJkiYl1LK5bAH28Ym5Bw8aYex9aATbwyN748J1lGr9RJDI9yNxPOecxRlFVcU779iUifVsRi+6sRR88LkhsMUIMrcT0e7REg4O27YpVTfcddLVOPZHsOhvRhuura0uWxzlp25Yk0fHRZOvX78F1tVHxYLY+em7dtvUkaewv0lYWk/UNTLrfkxtZB/PnNTepvv+R2edZ767yM0e0yJ2PYTGALEsIBOq6JssyevFlrcWYlKqqAEjTFKUUVV0hOusKkOM1+o6vV2toWkhNvP7UwHRaMhoWMZzmLUqZ7nr+e8KhB0voRFHXNWlqoIPLt77be6EvgI4zooLM1pdI3IKKuA1sXWMkQBrZ9UULqISmbfBEgmTpcki6Xyu6wdsalY6wJJTEvNuOKVx0VR0++oV/Z4JiwgKlUbRe4ZKYI7O+RbzB+xgTVL7PWwVEHKlS2NZilCEojXWB1lpq52nxiHdoV6OakkxZRsZjwpgFHTj5Jsdx+5ufyG1POlFygeUBFDqec98hoG0dJIJHZsoIokLSKoXOm6vqhjxLCd6jvEWMwbc13ge01nh8XA9lQ1EUEXEaVAdkicOofs+qWS+8tnU415DnKXXlyLK4/8NcLi90XRc2KKDZia6v5dl+3X8t+Tl5Mv+ygOrYp31ZoYocCR7rHSZJqJuaLM1wIXrJShlCCBgRrA0oJWgDVVmRFxneBZTS1E2LEkOSCK11sSRjTiPvf35+7sIOJit7JTtPOjJ/PRuUfefxzzUEjP+6eE66jyP3MWetUS4g3jpEBZz3WOtROtuwodsWkjx+ZVk7lECWxmXU2hajOuEfYmhB9RepOuE013TwYONnKbkg4J1Cm3UQqLPrMfGmAWPolBU435IaTaBFaYWzgcnEMRwUKB2v2/sooKJwCxgtMSwzr/03TGx/MzbM9QE348aG7xP1wcx/3ey7tSYaFmn8u7WeqmpIk5w07e5Xdy9cd2LKxG9xPuYUAjF/oHrB1B3ltCYbZetKjjnlNqfkdu/ax5atSyBQVjVFkXWKLsG26/MNzBphdiVGOAdJwqweOIT4/rYOZMV6K5P95/DGjAPVT1L3d9/9Jr1g6CMM3d/1QXuerJ9rH3IToKwtRmsSEzdLOZ4yGg2wzuJaS57n9GvwvPPOC5u2bJVJ5bDo4G2Iln1nxG1aWpaFxRFJIhQptJ2iU4CzDcFbkjQFp34pJdfYlixLaNsWkyRUbRNBFxLrxLTWs03Uz+n8rznXrXfv0MGiTMdBaS0kKU3jEBUZQVRgRlaiIrQRCgvKUznFJGQ0Bq4tCV8751rO+v6FTDE0QdMEqCVKXKc8XntUUBiXgFeE4NHS1aZ5h3QISC1C3cZ8HUrQOsGFQN1aQluxZCCUqxTaccKRm7ndicdyy+OP4IRtW2TTAAogNOAby3BgaJuA7u5vwOOk94zUDNXfD01cq9NJw2CQRvnYOKxrSItsJjCapiEthvFDAqurYxYWR1jbyR86AxDwLdgQSJSgU2ZKSATqMio6ESgnLcUgifO9v5KbF/LAQZXczA3f8MbZmCk5FU8uOAtKI4mhw9JgfZQLRsNkWjMcZLH/rEQjZzyuyLLOiPKCMTlKCz0gNhoBG2J9SJDZOgzd/Pb7OfQvyvpjf/3C+uv9PofOCNh/Xuau1ZgoM42oKKM82LbFO0c6yMEFTOgaFopI3EwWzjv3h2G0uFmapglFMZBJOQlpmgoaskTjXItzlhNOOJ5JOWVxOECA6bhkMCgAaKZV/JHuJs1OrLtJP792JAoHrxQX/PAngaC6RLWwuLgkBEVra3TnKdbTSbjVrW8uoqFthEQpqrZmuDTg0p/uIE1T2rahrutojTlHVU+DdxDtMbWh4DSEMJOkfRK89y6loyEX6byzAzokrz9miZ4tknWMWn+3PVohN7nJ8XjgyquuxbvAcLjAlVftpG3bkKapeALOuWBDtCh7Jee9x7WWE447RkaDHEUkm20qi2tbisUi0gvNheRm0979pyotW7Yu0Tm0FHkWWd5rR22FXbtWIru7D4SuJ5f3NnorIZAkCXVdBwFZXl5m86Zl9uxcZd++fYQQonEB/dyG+CgHhEl671AhIipq9ghImD/huDO68wgQvc6Dz38c1npa71gcjiIbfiCuG625xc1OlMZ2cHJlOkYqxb59+/jwhz/KOd/7QSid4EWDD5E3EY0nMCwGYcuWLdzudidzt7vehZNuepxsWhpRNzUBx7DIcc6tK+3/5lBKrYfvAK1TtIJLLr2SunWhLOtuLlVX3DzPBxIo8pQjjtguWzcPIWi8b/EO6sZTaEGbPOakOgUX2ug5zs65NXijcTqCS35wXRW+fPb5/OAnV1L7hDRdiAXgQUgFvPIoARvAB0crCqUCygWCC9EY6+baOk+JpQ0WLy6GJSc1oa7JEUZGU1QNt7vFidz1DrfixOOW2TaMwJGUKACrxlFkmiQ17FxtmE6nqNQwKUsSLYTWzXJq1kdN1K9dQuDII48kT0zsdec8gUBaFLTVlCTPQScoA7aN0ta6QJYOuOzSawlKqKqmY32J4VeFUDV18NaR5pkYDWtra2E4LOTmJx4X70oANd/fp1/dvZA/qOLaz1Ca/W3jPvKy8f+RcUwhSUYIcOGPLsF6QpYPZG06CVpriqKQtbW1kGUZmUkk4PDWcdLNjscIBBwBzSWXXIExObaNFrVSimk9DRsiNfvJOWstXkKnzMJ6LLZ7jP35buR1IE/yORev89wg9JOUaiXOxbC2dU3YunmLHH74VgzJbA4k+HgCrbM4D+d899zw0pf/MUppnAedJozHYxaXFwghhnqcbbnJTY7nN571bO5//7tLOW3JEkPaCd9mWmMShUoS8OtorHhPfhEl19fhKC7+6dW86jV/Hm644QZCELyDLCu68E0aLeZE2LS0yJ+++pVyk+OPo7UVgyIq2C9+6ZvhH//59XHxKxUtYmMoyxJtDNZ23Ho+rLcRmQngPhR0oEDuH38mt6f0fOQQfKfsZhcew8QnnXgCf/Znr5ajjz6c1dUxz/vN54XrrruOsmwYDRepWrthzkQC6D5s6hkUOac9+Uk89jGPks3LA3wTSEzvdvmOIX3ulGaX0nl2nZfoPegEphNHPtSMx453vPPd4fNf+ipt62jbFufaCAAItgvdRmu8aRqyJOXWt741z33u83nxi1/MdDrFOYcoM5vD/Y/185gPgXbKrgcjyEZXLX7Wzf7v513F/j2yfp3D4QI7d+4kTWM4xvmWtq446qij4rw99rGyvGSwdbT88zTOy+c+96Xwkle8kp0rYywajeAFMpPhCNi6YTgc4r0lSxXPeuYzeNqvP0kO27oMPlqY47U1RoOFG18fv8AQHQWFqCiIp5Xn2utu4A9f9vJw3bU7aK3foORCT68FCJ6FYcH97nsvXvKSF0uWG5QC3Ye7bQyVBxcVnHiH4JGkc9VtIKiUVQdNDt++ahLe8cnPct20ZfnwY9i1e5VEDdBewEdSZK8DTgVacVgJWAdGJRgPugUdNEopXPDUvmFfuYZXjkQ7hhoy21AEz/ZiwGGjIb/2kAdx1BYtm0brwJFURfBIb7uJgsuv2cXf/O3fhyuvvZZJ3TCtStJEkzpgBlzpi8Tj/yUEnve853LaU35NJNB585ECbHXPbhaXN1OWNVlWRKVE3CfjScNv/+4Lw3nnns9gMESU6TxRQ5qmWOuo6zp6FmLJU8NRRx3J3/7NX8mxR22dpSPCgUv3wKyTxIuU/SIx6x+4cSUHzFIba+OG667fwbOe85thuLDAvrWSQATPZFlGwFFOpiwsDrB1xbatW/njP345d7jjbaWxLZNxxcte8apw2aVXUtcOHwKts3OlH8zWYYznbuyjd2O5P6UOjHLMy9T5MHOYWQLrE9HWDVmWYMSRpgmPeuSpPO1pvy6blwrKaUueJZhyWpEkSYyz5jGOfMklPyUxBUEbTKrjgtm9QtM0jEYjtMCZZ57FT35yFa959Z+Ee93jrjIYCKtrFcMiJx1kBGsJtkHUfh2E/wtWbQAOO/worr5mJ5deejmCwhETvlVVMRwWuCbm4bYfthlJclQCKqQ0LuYsRktbuPTya9i7uo88z2OOQ2uqqiIfFNHSAFRQByyQX0TJ/byheisnmM6i7D4bogeyaXkLSqc0FkaLI175J3/K8577fKrGcu11l6NNgSgTLXol0aoKDqWiNbi6souVfW/GORee8qTHydIwx8fID2VZkef5huTzvB8ZX1CUZc1wmFGWARc04wm8970fDG97xxmUbaC1HufaDgUXa5CEmK9YW9vHMcccg1aGF/7hSyVRCdfv3BOapmG8NkGnGWHOcNjw2IVRZS5T3M9pv7i9X3+t7+wc5+DAWP78XZvBAK7bjfjAaDSa5bWUpFz848t57xkf4q53uUdYOvlYQUGSqFnDzLvd/V5ypzvdJXzh37+BdwFjMmzbEHwgSVM8jrojN/eV5x//8fV84z/PCi/+/Rdxn3vfQcbTltHCQlQeNxKa/UVHTCNE46XIFWd94+xwyY+vYmXfmCTLCX69bmw9nx2V3OreFb73/R9Ez20UCwD6+bEOEh1TAEYRnwRizE21tKag0bAq8Pn/vDJ8+dzvM01H6CXFVXtWGCwsY+uA90LShaslRG/NEwjS0XDhgEiqbG00kFpnaV3DwjCjbtYI9Rio2ToquN0Jx3Lf29+BO950WXIiY8WsTk/F6/Le07YOk2R44OMf+1T44plfZ2U8wYmQDgqUD0jVoudy6fNrCzxvf8e7uec978mRR2xj0OWkp5MJi5s20ZRTimIECE3j8T6QZZqFhZS73fUeXPjDi7nu+h2IzrDe0zaOgEHrWLSuCdTNhDwzXHfDbr74pTPDU57yBClysE1EqyZ6o5CX/Ty2LkFx4KKYVZ0ffHH1BnvTRiPABsN7zvhQ+Mml12C9Z1AsRiUlglKQJJqqnLJz506SRHPKKadw+zveTnyAJE1JMs1PLrmMH//kCoxOMFmOpzMexG/Y1yqoLnIV9+esfvAgiu5gSm7Ddbi2+08vn+P7Y1rMY5RGabDVBKUCe/aNyfIienBdxEAVRY7pQBy2hbp1aJNjkhwPVLUlHYzIihEezbRqcZKQjzbTtPCaP/srvvPd80KAmKTvVqOHKJT/W6EaNbuY8aRmUjagErxKEJVikozhaJkkHeDQuPjj1E0bmhZMqki0xnqoW0vjA0maEzD4oHGkiBnQOE3rDTYY2qBxweCDid/ZH777jDc4r/Ah2fBoncY6udHHIFl3JARJERXZ1VEpaEMxHOERBnncwLe81U3lzW9+M8vLy2RZhjYpUXMniEpizlSlIAmI4fCjjuPqa2/grW8/nTM+8MEwnjaIgsm0pBgODjK3nRCUeNR1zWCU4TwkWUw2n/6O94d/+pc3srpWUTeexoZ47joDleKCxnnBB1hYXGbT5q289W2nc9zxm1EmYWFpmdXxBJIER4onXnuQFFT8jv7ovxPJQaUEMrxkWEnjZyUekBJUSpAkvrc7rDOzo/WKtrtPrTe03pCkA9JsgbqBfWslk3Ed76eFn156Bf/8ujeya2cTDeIQU1UhwPLygPuf8kCMznBWSLMh+WARpTOMyUnSASYpEEnIBwsghgt/9BP+/h//hcsu30UxSNi5e3xjMui/NNI8iaAwB5dcegNvffu7qGpPXizhvMESDycaSzwiG74ClXHBhT/mi2eeGVZLh3VQtlFwZJnCtR3tUZcH8QGcVliVUmnDZWvwrs/8OHzx7PMp1ZDaJZRWkQ6WmDYWpzVOC61SWAVeYmmAcoKxQiYa5QPBxkhA004pJ/toyn2IndLs3UFWrXHi5gUec9978OJnPZUXPPb+ctebLgt1QFuQJkDT4puKtlylKcco78jSjLa2nH/ej8M73/luynGNCinKpxhy1lZrCAZPMjuCpHiV4pVBVMJPL72S9//bh0Mx0NBFNZTqwrUdmsr7GLFIkpjMr2t43OMeJ7c5+XaUTcukLAkYTD7Eo7EYTJKDycmKBZROmZYNb3rL6Zx3/o9CIAKHktTEfLnciEvXH/uPg72f9aDhDFUN6Cy+fsEPLw7vfu+/sbS8DWMWMMkA5w108qmqLMVgSN1Ybn7zm/PEJz4RraKoig6UQumMNC/wKqGygcZpvCQEWZdJInncpzoeFt3JT4UP+oAjysqNR2uZHVFuarzSM5kHKYGUQI7zmqryWKujfFSGqnX4ALoDSqoOeEZdO5omUFU1IprWB5AEnRbUbWBatuTFAlm+SN3AdGq59vo9XHPtDv70T/+CD3zwi6EYCG0D+1Ym6MSgtF6/V7Lx+IVG6JKKJiVJB4gkhCBUjaWxjrVJyWC4gDEpRTGMVoPfeMPbtkUpQ5JkcbLQuBCi99R6lE4RnaJ0AtpEr0l0PJRBqfiotUHrZPb8F320LnR0eD6ix3zAu4DrjhjWEKZlzKfZFm56wvHy5je+nuOOOy6iAEXTtg5rffxsUFivaJ1w1TXXs7S8jeuu283bT38PH/3k58Ja6cgGBdZF6SWw3tF4vy2RZRnew7R2rE0C73nfx8Nb3/YOyspj0kGnXFNC55N6ty4IkiTh5je/Of/0T//EscdulvEYRos5K6srWO8IXmbXPX+0zq2/ftBHj/MBG0LMBwbBIfgQ21YGkdmhjJk7EpRef9TaUDWOxjpQms1btlKMFmisx6QJIsL555/Pv3/9a6EHuHgBncZw0t3vfnfZfuRR1NYxnlY4D4111K2lahyTsqFuPOO1iqDiBjz3vB/ylre9M6xNYMvm0S+40G9seMbjVay1pGlMrH/qM58Ll15+OQFF1TiCGDymEwbJzCAKohGVdoaa8NWvfSOG7zQMkwQJntC0EUXZpTGthVI0laTcgOLcHfvCWz/3nXDudTuZJiNKl1BOAxk5A12AU1iEWoRSC6VE5KUPGgkabRWmDYRpja1qvGvwoQYqBonjiJHhhMWMx9z9TrzoiY/lqafcTm65WUkaouIdZYIxoFOLSjxJKqRFRlpkBCXUVYWI4bOf/Bw3XL0DExISp8hJMFaxmC1gdIHWBUrliGRAOhO6rRfyYsCnP/M5vn32j0LVQGsteVHQNg1JkuB9izLR+NOaaMB7z7ZtAx77uMdw1JHHELxQ1i06SZE0xatoZEyblspCGwzDpc3s2LWXL5/57+wbRw+qte36XhS/YZ9uEJHz+3aDgvOzw8u64br+GpQVXH39Pv7hX15H1Vp27l1l07bt7FmdkKQjXFCISqjbGGpcWFjgEY88lVvc8qYymTb4rit7Xcc8dpoOAIOzMX9tXde5vVdSPso750NnHGiU0p38NLPnP+v19ecK3+WjY6SCLmqhoywICiUpWidkWUGSZBgTWXSsWwelKeir+DX5UEizAhegbixpkhNQaJMSROOCYlq1NK2wsLSFhcVNiMq58upreOOb3srb3/GR4AUWl4eUVdMpnHWv7L8zjIlhvraOqDJjDCJRwKZpinOOtbU1nHOkJpGscya9bUl1FOJ9Lq4PVRJUVJxJBqhu4gRcLDh1zuE7xF2H4wfvY7nB3HN86JgX/I0+qi4AoRC0ivB+pWOIwAhkiYnceQXYBkZ5DMeccNxx8qevegXDUUGaaZBYJCtGxznQmoBiy5btlLUjyQZce91u/vX1b+ID//axMC3nmBrC/D1Qs1BGTP6HGfHt+//tQ+FNb3kL40lNMVjojICoDEIIs1xGqhULwxFbNm/ipS95Ccces01SA6Mh7N2zwmhYkBiNNoKWmKDWSkVOwb4tSjcnGx6VitBlrbv/my7MpBD0jEle0GiJIVz8XI7Pd+iJ7jEEH8sBEoO1Da1tKMuS1nYlBAK7du/gDW/4Vy677GqqKiJFrY3I1cMPP4y73/2ubNm8La4JH0A0JsnIsoIsKxgOFrEO0iSn9YKohK99/RvsXSmZlr+cIxcEhqMRYoSycVx51Q28/R2nUwxGsWmogAtCoDtExdCwAKpv4qkpFpY569vf4eqrb8Baj2sbEhzG9EgHQGJ/N6thDfj+FbvC+778n1xwwy6ubVpWXcDrjOFgEVqhWqsZ6BzxEaLf4mmAVqLiI0SmElu22GmFK6eIrcloGKqa7UPh+M0FLzrt8Tzx/reTO24X2UIEcw6IrWwES2OnsxyWDY6mbTqAiMIkOd8957zwlre9k03LW5GgMColUwnVyoRUEpwLkdsyEA0lDEFMZ9hm1DawY9du3vjmtzCeVpjUYPt4P5E7EzzOWZrW0raBYqCYloEHPei+ct/73Ztt27diXUNjbcwjdx6g85CkOY2NTkI2GHLG+/+Nc75/bsgyE++dxL13sDGHSznIWFd2s3AgGx0KEBxwzrnnhXO+/z2K0QLDhRHX7biBrBiCVmgV5WiWZTjXctTRR/Cwh/2qAAwHKT7YmAPVBi0qhps9JElGmuYdG41GUDPnQHf7XWvdycF4eGs3PA/OzQABEgLSw9/75/hOXvRyA5RI91y6kqVI6+a9pSontG1NkWoS3cFBJL6XEOLmriuo65h7SdOcxsW6LB/UjDNOmxSdpFRNS+sCog3DhU1c8tMreOe73sfHP/X5sFY6VJLiPPggIIq6sYiK1mhd14iO8OgbG70109QlwbZdv6eoaBKtkOC7yKhnYWHYUQ4FxEUrMOlufFOVhOA2xuRVvFlaVKeI+roghwYkWLTyZMazHgCyGHGz/4tvEN+QKH/Qw4jDiCP2Crbo4GINjovFbOIacG1MmKou7yARMbYwVCwtKO54h9vKX7z2T1laLkjSQJYr6mZK28HIQSirBqNzrIvh1p0713jfGR/hfWd8LHhgbVLPsNI+CHVj8UEikEEZGudRGj780U+EN77pbezctUI2GDKpGzwK11oET5YavG3RWAZFwvZtm/nXf/kH7nKHW8ooB2JJEsMio61LEiUQbMw9BouixaiAwWMkzqEK7WxOJTiUdzjboJWQGN0t8lhzpbvFqgJxwYe4EYwSnK3jb+HJNOhgwdbx0bfgW5RESqrUQGbiZ0QiBPryKy7jjW98fbjyqsui/RIsEOf71x79KMrJGgvDIfg4D1VZzvJLZVOTDwf4oEhMwXjaMJ7U/MM//ktQSQxBN63DuhBBPqHLkXgHKgJLWmex3kWCX02EOqqAc47atQiKfaurnP6ud4aqqqiqqsulqLnNEjpiY9/hdqMFXNtAbWFl3ypf+fKXg61Kck1MxAUHzTQqOKBJYQ/w+QtuCO8/8xwu2dsySXJclmKzlNp76rpFe8VADCka4wXjBG/9zAhovGe1KplWDbZt0S6QS6CgZeRrbn7YMo+61x150VN/Ve5wtJKjcxg6GDgYAokH8bEEQeuEsrV4NCIpThJEF7TBsFZa3vDmt2GSnPG0iblFYyICe2GIrRu8dYhomtqiVYJog0myGD5D8EpjUXzr22fzpa+c2e0q3eWKFSZR+GCjUWpAm6g081zQGp71rKcRsAwGOUmqu1Ilx77xGvlwQFW3jBaWcAEm02j4n/G+97OyUpMmBiWmk7kG1xdhdoWgBwOm7D8cAaX1ugGPwrmAVgllVXPVNdfyr298AzpJqZuGtm1n6PLGttS2jmh5X1MMcl74wt9hMMgxGkLwcX+5aNgaLdi6IjHx93oZqhGC93hnCd6tKyvbrMvB0G6Qo4nypDrM/j4vZ3vZoHyLEYsRj+5kqXQyRVyUoeIaMi3gG3SIstQ7F3sFdsBNo8KBod/1mK7M/T/GqWXD+xTj6QTvLQtLm7j8iiv5q7/5W9bGq+Gppz1BlFaIgnIa61D6URQZdR3rf+brIA42NFGjS9fcMBDbcvSoIwDxndYPnojM7SiIQh8GiEdUikKgK87oykZVDFbhXcPhh22jaaYoHdFifdHcfGJ1PoHao/t6oTOPEIxf3sdoQ9w43edUrFTh6KMOxzVTglskT7q3ufixLZtS7nXPO8srXv6i8Bev/Stu2LWbQV5g0gH7VtZIsgytDa1ziBjyIqNpWi688Kd86tNfYpgPwlNPe4jUtUdrFa9XRe+sbiw2QJYZ3viW94YPffhjNK1FmZS18QSdFBE52VYYFXBtwNmKTZsWOfaYI/n7v/sbOfKo7QyzdYvTt1BPxxy2ZRP1ZMKkrBjkBb7bCHQwhL6EYH1OBR8CSZ4jyjAup5TThsRkfZoZpL9P0QcN4tCdQjrysC3UdU1ZThikCXoQvc+2sdAV0sfu0VEZKCJAQ0JUBQuLS3zr2/9Jmkl44e++QI4+6si4YYPhuGOOljve4eRw/vk/pKkaNm3aQtM0aJ11JAVTxuMpC4MCHzrkb+v43nk/4LLLd3P04UssjwzWxpRAlmnaNpB0tabOhVmNZM+m368lZaJlvDKdMKkqPv/FL6CMJtMJ48mYJBsQuhW1ngLokS4RXpIOhjgfre/Pf/7zPOUxD0MGSbxh1RTyJWoLVQbXV/CV868L37jwIq6dKKZqhNOmC6NpMPFRnMdbT7ANtqnIR0MSk9E0DU1d4psGa1tccCwmBg2EpuaopSWO27qVZz7pAbKUxBq3InRKLdhOCPXh9R79G6M2+8ZrLIwWaJuWKJmEL535H+G7515A44VsMKAqW6wLVG1FrnJMZshNStXUbF5eZlpVTMvY/85aS1LEurCqqdBK8+53vYc73/5kTrrpMSgyvLednOkBPcxQ7irE8P1xxx8tv37aE8M//eubMS6haVqKwQJpPmA8HpPnA6qmJqAQI0yrmvMvuIhPf+7z4def/CiZ1pZBUUSyiyKSXdTTKrYOypKfQzaxDtxw3kdWFw1Ga9amNfkg41Of/ky4+tprKOsaj0GUQmtBFRrnHInR1M2UzAh3vtPt+JX73Vu2LOc4ZzHKz6IE/fLqUx6qh7YG8L5FBNIkrmPX1GRJwmi0QATqRgPIe9fp8Ch/RWIEEUJ3nQc+IjaiqUOkhQteQTAz97VtKoxxpCZnOBixMCwQ1+JswLU2hjCZVeet5ySgqy+IsLzZfY5X2V1c92RhcUhTTqmamnw4YtfufbzzXe/FB8LTnvoESYmsCwBtG6iqioWFgixLGI+nDAaDDZN3cCRaJ5RmgHwfW3UQ0VyhKzJdd+87frvQPXJwk6j3UFxTkxrFUYcfzbOffhpbt24mSxXe2q4O60Al1z83XTVor+D2V3QmTbtFoaJbH6JCFOVQOBaXBhy+fSuCw7uINozs6h6dpSwvCA998CmSGAmvfs1r2bFrhbIsEZWgRdE631lyjqZ2aDGA5vwLfsTqyl4OP3w53O8+d5Om9RSFQktC3UKSGto68MGPfC68/wMf4oIfXszmrduj9wZkxkQ0ohGMBpwjyQ2bl4f83V//OUdu38zSUCLRro33LVFw+NZNPO83nsV4UuJcQJksCoVOyUUY+JyhoGLDytYHlE5YG0/4yle/xtlnnxMplJR091HmhLcHYg3abU++FY9+zKMospyynHQkBrGwu2mauDHmfr/7ye6eRC/We8uOG66nbWt+8INzQ14YOWzzVhSwvDTk+KOP5ILzzmV5VKCVR4snTzU7d9zAtsO30zQN3kUQjzaKum244sqrOeub3wqnPeHhEtcJNI0HdBSwSYJzYJ1F666mx1t01xet33IWCN7wgfd/MFx11TXk+SKio6Dy3nUFbjMs6dwcxX+bpsbZhk2DjMsuuYzdO/ewmCqSPIHBKOZTMrh8lfCV7/2E71xyNVet1kx0TlYsoX2DBAchYiSDklgfagHnWSoGNGWNrSpC5wFX1YSgAgvDAW29RupbbnrEVp7yiIdw8rFK0hqWZreziaH4Hjnn6YRYt0ctSAqL2QI4WCgKpg1cfe1u3v2+D7BrZY0sH1H6QKsjq42noZG4b9um7fJJQmstWgtpanAhes/OWtI0xzvL+RdcxLvf+4Hwqlf+ocTUgiGEZiZn6NdQv3RRjHLhtKc8Wb7z3XPCf571HUwyoG3K2MkgjTW0TdOgBZQYoOWaa67jM5/+PA+8/ylsWo5528RkWOfREu+N0jrGWNW6gjmoDJPoRSllIhK5WwpGJ1x00eXhc5/7Aqv7xmhtECWE4LBeMMrEHKm3DEcZwyzn2c95BluW86hgvEVpFRl1OqNUgps5E9KlOJRS6KDwocU1LbatWV5Y5JT7349HPOJUlG/xwcZcfrAxNRS53EB8rLkTH9GYHdp6/u/Bd/LXd3l437GQdvJfq5j6SQ04W3PiScczKDIQi0o1BN/3k5ubnVnZKeuFxBtmeV5hCNNphPJX0wnOBRaXNnPZZdfwjneeQVU14ZlPPU0WRiltA0kqJElB03jSRFEUxc+4fd0vqNAVXXdevOrYHvqzkeiP7e9hxcW43/MZ/JQZHY8Knsa2BKVYGuaccv/7yUk33RIVpmcDq8mskn/ua92cJ7o/mj0aCuvPu7x19Ig7jdz/2dkK5z2JTkGrqBRVzJkVmfCrD7y/XH/99eGf/+X1lJWnaQNNU8dv1QnBe2wIZEVGlmXUdc1PL7+CP/vLv+KIo/453PSmx0rbpRpMAmvjwNnnfC/8/d+/jj0r+yiGi9SNRZmcrNBY7/A4jNGsre5ioSg4bNsm/uzVr+JmJx0rqYG29qSZonUtWmKh9Cg3POLhDxWtBDERITVjiOnmXro5DN38KROfawO7VuCaa64J557z3Q3zHFQMV/eJddWFp4879igedepDZfPmJHrqAnUVyHOhdeurNXpybFjLPTHvZDJl1CFRy6qkyCOV2eramMXhiD944QukyE341Kc/y9reXSRJhnc1C4sD9u7exebNm1mdrmESPStTCaHlk5/8JE949EMpvacoDGkalVmWJV3qIcyMpB5a3z93zsX8mhJ+eunV4X1nfIjhaImq8ThbkRULOBcIhC5fO28ErK93R8AkCQKsru7jrG98M9zsmb8uCOybVqhhwjUVnPn9i/jaeRezTwr0aAvGaQgGExzBuxk1GuiY49BR+NbVlEwZnGuZru5Bp5pNg4zW15T7buDE7Zu4y81vyeMffDs5zMAodFRoK1PMgoFOGcUyI7VxD/WX1sQ1UteBtIhv+NSnPxu+893vk48WcF4oqzbWexkFRiGpxjc11lqOPeZIrrziaorhCJ3kBDzGxHPWKsEHh1GGYrTAxz7+KR7+8IeHu935VtI4SESxP5pxZvQLtI3n2COXefbTn8453/0+Jk+YVpbx2ipLy5uYlC3KGCR0mABlUCbjwh/9hI9/8jPheb/xJHEWkkQoS0vQnqTz7FvfYlTKzxu29SRZStMGnIU0FUyieN97P8DlV15Lmha4rozCh+j9SJqCbzrybM/DH/Zw7n2P20tZNmSJkJiYqtA6NsGdGfd9ZE/ia03TAI7U6EgCUFmCbznmqKN4yAPuErfcQeRmv/+0PvD1+efzy2HGRDX3fcbE142Cpg14Z2NNo6NL0YCar6uhi6x5FeP7sx8KcyHAeRSPOJSBxjagY+hlZd8aYjKuu2EPb3nzO3jPe94bptOATmFtEgvDYxisO5k5hNA8tH3jZMjMywx0jxJj6oEYl3aeLgcIPw/sMl8P55zDmGgZt3UNvqGZQmjj4vGO2dE5h7P4rgBpsn4kZuORqpjr64/Zz/bxYQ+2aanKCdoYkjTt+ApjJ2MAowWNJ5HA0097kjzraU9jmGUkRmEUGKNwNi7WwTCP+YC1Feq2Ih/lXHvdDfzu772Ia6/fAwpWVuP9v/yq68PLX/lqrrzqWqyXmEtxMa4fQqBqJh3gxZIXGYuLI/74j/+Ie9zjTtKvCSXRwtcCJomLvKoa0jRS+zRNjIur7tDS/b+LlxsVaRSNrOdgixycbWmaBmPU7H716McNixJPnmkGeUJbR49SA3kagSyG6F0mfT5Fx9/tD9UZSAvDAu8s3lnyNMW2Fus8ywsjvA3c4qTtvPbVfyL/8Ld/yT3vemfyzNCUY7xrGRY5SsFgGKMTZVNGpJtW/PCiH3HWWWcFiPR4/cbsU2nGCFpLF8JZL/CPRfcWEFbXPO985xmUladqPEYnaJ1gre1CVXHfCNEImKHzgkIBS0sLWNfE90vKpz/zZa6+eje1B4Y513n4yNe+F84870eMTYFVESiRqgQ3qdAuYFzAELtnQ+QvrW1L1VZMqwl7V3bSNKtsWcxYziCs7mDRldzumC085lfuyrMedjvpASWpB1c2mFEepVwvc8TgRWLX7/mRADryoGaZ0DRw8U8uDx/+6MdAImGFdYE0TdFJMstX6m6D3e3Ot+OJj30Ui6OcxIBzDatrK12OzZAPCsqywouiqi37Vqd84P3/Rl3HPQ+mC512EKmgZmtVAuSpwrdw33vfS065//2oq5IiS9AK2qZGiyNJ1xl+nAsoZVjZu8aHPvgxLr7oBlBQN5APEpLMUNUVdVOSZDfe03odXKLXZUofywrwne9cED7/+S9TV/G+tx16sgeFiHckqSZPE7ZsWuA3nvNMaRvITGyFpDAE6zsUc4wuuRCYdWZHQYih5BAiAERESLME7y1lNaFt4h43Oh4zuTgnL+fl6rx8jSQlc9G50N2BzlgVWd9HVVlTN27mpUf5oPE2GnpqpliiOGFd4cXXFaHPgwMdAgbXHZ6iyLC2wRhDMRqiVEQtaclZWSl561vewZve+JZQTmE4NKytNhgDSRITrj9vhM4zDX3beolusu23ttJR/XqwPoQe0SldVj+Gq1R3c3pxsL6R+vBQT0GVGkOeRaFodIxIK/FdzynfCciA1nGSbeuwbTt7dNbjrMXZmIgVLIidKbg+rxzBmQGTdqEJIsO5935GsVWVdbSmUKSJMMyE3/qN35BffciDGBWDCJTpbrZIoG1rmqaK+UQTmUjKuuLaHTt48cteFm7Y1ZLlcPkVY37nd/+Ay664lmK0FOtRlCZNcuq2oW5r0ELrGiaTNY477hhe/NI/4D73vackSVRWZVVHjkDbrBe8S0Q/SXeNRsUAgcyAIw4lDlEOUbE5pjKdAuxuSdKFG+mIoHvlNm/kzK9RY0xUYJ3SFCJ3ZNs0aBVQPgJaxAXE9Y/xwIVIwoxgdETx6g66HC3UuDmb2pFqx6m/eoq8591vl3/6u7/mdrc9mWGeMBjm7LxhB0qtW7b957XWfOpTn4osGkTPLQKv1t3/EHqSboMxZiYskiRBNPzHf34rfO2rZ0UPxCusE0yad4jhem6nHOhtSIC2LvE2WuRN03Lppddw3oWXhomPNF2f/PqF4ZwrruH62lEmOaoYxrB66yjiAkcCpKJJUCgfcHVEqa5NxjjxTF1JWa/RNmtIs8q2FO5765N4/q89kgfe/hhZALbn0EyaaBQNDbga2gYwsX61Rz52+xTNen+cwMxu9Qo++OEPcdmVV2CytKObi0ALby20jiJJcU1LoTVPf9pTePSjHi4nHH8UTTPFNlNEovHofQwxF4MB1gWa2mJ0whe/9O/8xze+G9K0++1gumNd2cGch+JhWCie/cxnkaBo64YiTaLHpOiAYpHzNATB2YAyCZdffhXvee/7gwgzPkiIhdnzBAk/b4g2M5SBEihreMfp72Jl72rMZXmFdzEt0Bd/W9eAd7i24slPfAInHLs1Gp1GCG0MyaoOyexCoEc2OEKHkliXq8povMRoREQhe4xAUfQOgsVZh7Mtzm6Ul2omFzY+zgzRbrZ7R0F1hqrS60eWG5JUoztZEiKDBNKlAQ5wd0KH0jogiyVhpvjmPbq9K7sZDHOU1qyuTfAIymSxgFhpxtOKt7797bz73e8NbQvDxZS6jUI+y5K5718PRc0rXhHpmD46a76DSPceHaLxRLe0k1vd36KE7dt39AJynbR3XfFZa6mqakb7pLqNFVxLCC7GlL0lsn10z53D+xatBW0EYyISSxuFnnuczRc2/n/e3afPtQtN2zAtS5TWmCTBJJo0yyI3Z4DJypi2DiyOhFe+/BXysIc+hMO3HRbzfirmZ+q6wollsJCT54ZpNcFkOavjKWefcx5//4//Ei6/YiW87I9eFS648McU+QIR4KpIk15wxmtO0tiC5LAjtvP0pz+VBzzg/jIjow3RuBERxPRQft/lBlT3nmgoOGdxvsa5Guc7D8XZiO/1EX3XWrcevu0BgyIzyrUwN1+9F9+Ppq3xwZOmfegjYIyKW1LCuucmc4+y/rzI8ngOje3ymWC0YVAMqKuI9MwSIc9jXCXRcOrD7yP/+rp/lj9+5R9x4gnHs7xpMa6P4FhYWIjM9R2/57nnnst3v/uDoDUdmW1MtvdUat5HFGUPVPJzc3j99bv50Ic+ytqkZbzWkCajWc2k1gkRjtnvyV6xRW+jJ0pfW1thcWmEUoosH3H/Bz6cm97qjrKrhPd/6aLw7+f8iDUpkKXNTGyMIGRGk/uWoZJZ2xJxHhqPn7TYSUNbl9SuYaWZMNy6QLFlyNSucuSWRZ708Afx7IffV+50hJYjBEy1hrIlC0PFvnIPn/nip8OarSAv8GgCCcqns3N2CloNrYn33dJiBobKw7e/973wmS9+DpNE0urUJCRKE6wj1C0Dk1J4Re6EB9zr3pxy3/vIccdv50EPvj+blxdQGkajAc7FPT2tKwaDAd578nxA6wN79qzwwQ9+mBt2TLsFv+4ds+GIEZ80icLpHne9jTzmUY+OIKsQkbsigbopuzXhuxIojdE5WiV84Qtf4htnXRREr8supXUkR3fN/lL4gOG8Q2s1a+Za1/DpT30xfO1r/4FJcgRDCJpUp6gguMbF+XLRyDz5trfmSU94olRlDCN7F6m+CAqt05mTYOk6sneeXJAocyfTCkGTZdms9tQ5R1VVVHVMjehEYRKNSfW6nOzkZgiOnsXpgMfg8H35gW/xvp1FOfqjampMomMvQmIda0T+r2uwA5TcfAwVejzcgdCNvkvw0uKAtplSTsckJrqvZRnhw1k+xIfIRnH6O97N209/X1hd81H4EV336HLv/+3rpxVmPtB+Ca/+1U44OHpy5S6m23MezpLyG0OYfeirbR06SSmKgrwoqJsmNDb+Xaf5XM3WRkDJBqqpsM6N552bHbO8Sm/19Lkp6Y9YEJqYhDTJu4J2zWRSxjmfTYtjuDgiTYRqGlhcgD966YvllPvdmyJRuDZ6U6NBjtbC2toaZVNTDIe0IeBEk+UFH/vEJ/n9l7yUb337bAbDRRoPFoXolElZMq1K8jwlMQrlWzYvD3nhbz+XxzziVNm6nNI1YZ4R3LaNo/etgveIUqRZJ8Cd7eC7CiNdnVx3zMcMTapJtEapmJ+LjCMBZfRBSAM6wwQ188iLIra28Rbaxs7CeCKCd46uJoCuTUWnXDuC6a7uTylFmpoYsu6K7gHyPAUsbTMF70lTIc+greH4Yxd53GN/Vf7itX/KH7zo+Rx11DacrcA3TNdWGWQ5zgX27F3l3z7yUZo2LuHptCVJmHWj1ko6cBRdSCgaYCvjknO+d0E4++wfMC0ticmZTEtGo0WaJhKN50U6W+PRYOoMQIlWtwQYZim+KWmc5UGPeBS/9Ye/J3pZ84Vv/jR844KL8YNF9kxrlMkZjRYZj8dU5ZQsi2siRko0TRsopzV1WUZEm/fkWljODfXqLhI74VfudDLPeNzDeOg9T5SjhpDU0E4q8iRHkfAfZ307vOJVrw7n/+jHWDFYYihMOtTxfum4TsFZdJpgA+wbj3nb6e9gx8490NWJ9qQDMRUnZFpRTscMi4zTnvwkRoOEzMCvPebRctKJN+lyR4GyLEnTlEGWMx5PAaF1gTQZkGYDvvmts/nmt88J8wbWgcJnfmXGpy/8vd+Rw7dvwzU1iRaMFsTHcGpT1fF6laZqWlyAfWsT3vqWt9G06yHttome34GUV/OpnU4yuD7JTVemUPPhj32c1WmJ9XE9Wb+ehmjbmjRJSFPDMM940hMez9bNOXke63Tb1pINcprx+CAytJdf6xc+GAxQRlNWFWVZohLDwsIC+XAQ6bZacNauy8VeTnbH/jJ1hiyeO0SpCNo5QA6HWE6Gp6nL2GrNaIo8wyg9Aw2qPrYaW+VEC1CjO3Z/iQgkrSODt6yT7d75jrfnVje/OUYF2npKkSlEHM7FFiNpnlHWjsoJtTdcs2OFN77lnbzrfe8Pq9OYcbIhWr+iYDxdQzoBOJ5MQClaC3gh+HXrtA+HxU4+UXglWgjOogho6fMekYcwAiKIZQahQ9n1go/1mrmgNNOqJh8siOtCY9Z3bnqQgz7OwqFzrvvGR0PrBIeJjAKiZuE3b2NMz6jYbiM4UMSSikFeEHx0xb0KuOCx3uJCYFAIGhim8JpXvkR+9f73ZZDAwCjK6SqpjgXULnh0khJCDB+XtaOxcMGPLgIVKZ/EJCTZkMp5RMXFOV7bRxIcOY5nPenxPPkxj5BhqqAF5SO9YaJjLZIyCT7ojmnDzGLqKkCRRktGeVC+D/eYdUqfWQzeR2gx0btyALoT9l09hfSF96HvYLB+OOvRYtASQ81aFHiZ8X1uEEOiO9ab9ddjaZLEongPxuhoGdNDsDxJkQEe27ouAgE6xHziLW9+pDzz6U+Q1/3TX3L/+92VzDhGeYJWimpS0WI48+vf5rJrbqCsISu6EIqG4GrwXZulAD4ISVrQArtXK/76H/6V1amlGCyDJBiTMplMGBUDlGJGMl57i0VoCFgUk7pBTBIh4t6SSuCUBz6A57/kxYRt8IGv/zB8/aKLWQmG0kKRjdAuQNVSpBmiFatNheQFTdA4EiatY+9kzNQ2gEe5mk3iWZyucZvlEc950Cn83mMfKPc6flkWPWQh5lpJcy65esobTv9QeNEfvppzz/sJz3zGc2VYLKCCRIRwXcX9q/oayOg5mtAZVUBVe84886zwve9fjJYRda1AUgKGoIVpU0Ii1KFEZ4FHPvZU7nqPO0qaQlPDsUcdwTOe9nQUgbacMigybNtGQ8dGRak65dO6SP33L697A5deviOG3DVUrcUFG/taaY/3JWIiMlTFRhUce/QCD3nwA1gY5FFrtW5WjyuiOjapiBp2Er2ib51zNt/61ndCV3ceZYEXFJEizXd7IbZ0dXgsIWwEKrWR1IcPfeyT4Zvf/i7ZcIHGB8REEFnZcfymqWFtbS+pgjvd/mR+7ZGnim09wUXgV5YZCJ50WHQ1bxFglKCwTUuaJIiP3LlG93WDNpYupGn0pkKIkbQuHSHKrKeMeo+wm9T95Wr0EHsEiEQPUgltp8RFxxhlcKDFRMBd26J8IEsTvG2izAg1ie5N4hmjRIx8zNqgdPHnYjCg9W4GF3U2gPPc5PgT+O3nP5dhkTMcpOxb2YUWT1VPaZomAjqSSDyMGHRSsHvfGm9+y9t469tPDzEnGPklQbEwWoodDlrPaGEBAqRpPB81A5NEKP6sG2+/IQKzGqjZmPvvrLajf74u4jBGYb2nbhqUSWhsLMptA6xOK2obsC7S1+z/2FqhteFGHxsbIoVQ51mWtWNaNV0OLTY/nYVBUOtlFPud93wNlHTKoE/kvuzFL5L73eseJEbIExPr2oxhaXET+1bHcTEFtSEP2X+nB3bu2c3i4iJoxWQy4bDNm0gk8DvPfQ6//uTHSSqBRKLx0PvC0lmO0iW5563c9VvgZ+cbX4+f7j3b/v89efT+pSP9+anu7+vQKulgyHPr4UbSFwE1owUjhPUqmDmL0Zju6FhoVBfKUAFCcLSuS5boGHKRXvC6mANMNAxSOP6Yw+Tv/+4v5IUveD55ZvB1y8JoiUlVszKe8s1vfTeYLsdju1CKED3L0CEXp9OYw2kcfOXM/wjX3LCT1jnqpsQGj04TlGgcAVExh1dVzUzQ4QOawLbNW9i1YyeDPKcup9zmNrfhN3/7BSxsRz72lR+HH1xxNWsqIRSLkAyBlFiz72IrHISgohflPVx//Q727NlDlqWIj6wlh49S2LeDu5x4DL/1uEfzyHucKMMWpA4MNEhoqW3LRz/17+F3fv8V4e/+8Q1cd/0envtbv8Piwqgr6o/zkWYGnSiCj564d23Mq3jIc8PaWsPuPWNOf/u7Wdm7BirtUIT5LAe6afMS03KNokjYdthmHn7qQyiGcb22VUORwR1vf1v5lfveh+GwoCmnpMZgtMzyoVonaBW7l6+tTbju+l188rOfC2UDa6UjK0y3HgK+rWNvPhUi9ZeOa8E7+M3nPEMO27qZxETYcPCeLMtIkoS9e/cyGIwQo3HBs2+8hjYpb3vHO7n2musJITbtJQjBHpA06jZe5/mLx3mPC7GDyNXXTfnoRz+GF0XTOjwqImtFGI1GjMdjbNuyZdMyRZ7y5Cc+YRbCX99/6/skyHpvuN7TVl1tqXTeZCxniuccBKx1iFIUxRCloW6jnOzlZuS8NfjQc1mq2XPn9ex9UY4GKuupHd3rEa3dtD6SxgdwVjAmm+2BGNVpcNbOrmkG3+kRXv0hnTBwzuFcS56knXcU0V8m0dz7nneXv/jz14QXv/QlbNu2jcm0IU8ydJIyLVt8cAyHQ5p2im0aNi0vMB6v8o7T302WpOE5z3qaFFnC2rRkkKeYNIsMGx01k0N3sdn9ywN6l1kO8tqNCLwQ5uDJszQtjY2td7LUYK3nzH//WvjhD7eiJFb013V9wG/P/97P60SQpTkOhwTwbcNxxx7Jve5xZ/FdbystPUJuv9BE6C9PzeqUuqcgHS+bgqOPWeTPX/saefkfvyp89evfiPF2Hbs0GJN2YeU4+mLq/vtFPEcfeRi7dt3Als2b2LtnjbZ2POOpT+I5z3665EbPBP/sMlVcK31Jx4bzZV0hr3cIPthG/dljtg4PHiQ64L0/82+qb3HEhnBxf8quy/j3yEaF7nKnGkFonJ9BzOeND9XlD/sc5pbF2BbptCc9UW5/uzuFF/z2i9i7MqZtHXv37uPTn/4sD3rgr3DEYUNs5TEaxBjwHjFxXyV5ZNS/5trdfPDDH2VtbY0sHdHYEkWKUobaNZHRYtYsNVCYlMQY9u7di2jDdO8uNi8MqaYTbn3ybXnuC3+Pk26+WT7z7WvDd394EVNTMHYarw3oJIZuRUXYh0jszWUt1nqmZYMOls2LOWt7djAysKBB1vby2Ifch0c+6LZCFZGTpoi9HGsP55/3o/CGN7+dH1x4Odfv2ovRcK973YNTTvkV6aHjbRthy0kWlUHMWfU1g+thQusCZ5zxgfDDH11E3YLJUpJUU5aTCCJRwmRtDaM8qRGe+IRf4853unXcWQ4WRikKOOqIJZ75jKdx3vkXsLo6xrqqizAASEQ+SlR6wQfG4zGf/OSnufc97xbueIdbCIDWSQylKpmtrRg6NjOj9aijlnjGM57Gq17zWpJigTxJ2bdvH0UxIC8KAvHaTccsVVUV3zzr23zpK18JJ/3maeJcrHNzbTvrPX3A2haI9ISKso6R+DPe/2/hoot/gkpS8ixnbVLiQ0OWpXhvaZqKzZsWWF1d5alPeSL3ve+9o2M0cxvW91OYbfDeA90o63p5GsEpKubOCKRpDgg/vOBC3ve+zwUl7UyDzjqMdCHH/v/z37mhS0mQzviIoVYkoBGci4CVPE+59S1vKSeccDROTOxlpyLlYaRgSmIHkRuVEHGp0dqYqEyThLauo/tnFCu79zCdTrn//e8lr/+Xfwm//dsviPgoLdTVhDQpqMspFY7BIEeShL0rq2zetMC+1b28+c3vgCDhKU96vGzZXFA3jsyoGLtuGtIknctJ3fjoJ3s9Tnuw90QBBj56qhITngg468iylMZZrrjqSl73+jfhbYtt6lhLEzb+1vzNAmaFuzc2lFLU5ZS8SBkOMh73a4/kbne7M0kWF1ZwP/siZc6a6k4iIodUBx4WGI0K/uqv/kL+4CUvD18+82vobACiSU0ScVAB5r0quoCdD4qqHKOV0NQl27ds5sGn3JcX/s4LZKHQM1qh2eXKxtP4WWO+p9svM0KvUZmb/7m/rR8HkwYdOKB73YeABCHMnVjk3lv3EgWJYXMCAU2SxWJd6zsPWvURj4jWTIxgrWd1dTeLi1uwreNud7m5fOJjH+U3nvvb4adXXsmePXv4/rnn8b3vnRtOfei9RJkITFGq+8LuuhIjNB6+8PmvhPN/cCHGGJI0Ztu88rhgaQOgExKd4GxDkeXc5Q53ZHlU8LnPfBZxLU1jKYqC7Ucdw7N/5/e4y71uJWeee0P4xJfPhIVthHRA62P/SLEuFvRqFUs5nMW2lqYsqesa27akBNx4wpJ2mGbMTY84ilMf8Kvc4VbbZVmBHoBvIWhYW5vyune8K7z//e9nWrasjkvyfMDi0iLPe+5vsn1bQVPH3ZgkGhdZxDsidTW3t0IkJBfFRT/+aXjfGR9gOBjhy4ambckHA6q6pMhTgm9pqjELCxknnXg8T3ri48Qo8K1DBY/pCu+dg7ve+TZy6sMfEt729neRGNW1x+mN9yjrkiSJCGEHl152BR/7xCe5/e1vQVlDkelIG2XSSEGn9YxDVzAkGvbua3jC4x8rn/n8F8J/fvscNm0+jB27d5FlGcNRwWQyiUtVK4bDgn0ruxhmKZ/7wpe4333vxa1ucXwEoNxYG5qgoIP2e6Kxde65Pwof+tCHMFkeU88SZVPTtuR5znQyZnFxBM5z/LHHcNppTybLdAwpy8Y9tYGtKe6cjViEuX2dJBF145xDaUWaZLSt5Vvf+g7nn38+03Ky4dT3xzTMy8/923EBM7BO3ydRQkSGGiUMRwP+5i//Ihxx1NECEYBn0lgT6sK623DQWZwX4nGjGZxbZ//I89j12CghM3DHO9xB3vLmN7F5eZFyssriwhBXVYwGOUmiaZ1FmUiWurpWkmQjdu9Z4x3vPIN3vOuMUNWQpZrVcWzkp4zG+Zafoz8ONnEyP0myn9zr+22FnsYLT5AQyXvbFoJibW2CbcMsHNk4ReUNpdNU3hzw/0krN3qUjeBJcF4zLVv27F2lqf0MZFE3HXpwvlZxfgSQICg6SLH0wIl4DdEiDCwsKhZHGX//t38j97znPRmNRgewryiJNGWaaA1F4HbMTwyzlGGRcOrDHsKf/9krhRDvcw//p8eB9gkC77uarPVE+P5dJv5L3SY23KONymv+fm583/rf5v++v2fdhz3Xy1D6hREPpaNSk9igL8Kk4yViQ+R0nBLD15aOgQSid+0tdAXzSwsLSIhdqserni1bct7w+tfL1i2HMxwsUdctX/vaf8RuE4l0xdVdyKeuEKWwHm64fpUzzvgA1kYB4myNNh5tYn9mlaSkWYHoBBVgaTjgWb/+FE57wuMYpgbxLcNByvLyMk//jd/gLqfcWb5y/t7wya9+i1JyapWwd1yh0ow0y2ZzphC8dTRVTVmWVFWFbWq2LA5oV25gEEqGYcq9Tj6R5532aO5+i+1ymIbEApVllMAPzrkwPO+5Lwivf/PpTF3CWh3YvHkzqRHueuc7cZc7nSx4KDKwroUAWkVWCuna2YQQqKqGvhBqZbXmrae/iz17V1mdTNEdYbi1NjJbeI9rSxZGOUvDnMc9+pFs37qECo5EB7Q4XFN1ZUCxQfTzfus35cSbnID20ShPjeryucyUnfe+g8trvvTlr3Lm178bgu5We4hhFOtC5PI0JvpC3fdvWkxJjfD7v/cCNi0uMJ2O2bRpE957JpNJFNJJ9FjruiYxGT4Il11+Je957/tDEKgbN0MRq9Dllg5iNDZNoK4DH/3YJ9ixcxflNHaRmU4qsiInz2Ipg1GQ5QlVNeUFv/N8jjn2aNGm3+Pdl/mDcSzOK7iN+zHehxiFMiaFoGhbh7NxXnbu2YcNKQ0pdUioQzKTn/2xVofZMW5g3MDUqtkxbmCtdkxrz7TxTBvLpLaUjaO1gbK2sWuXltlej6HNQNsZUDMlF9eUbLSmQsDb2Aq9rRvy1JAYReiSEsOiIIRIKHyvu99O/ukf/45b3OwkbD1FgsW7htEotsCZTCZs3rqNPBuyulaSD5bZvWeNd7/nA/zDP705XH/DhMXFgroFQrSsGud/rqCcn/CDhQ5nzfsgFul2N65XLHmekmRpFHSm6xEXwDmhsdBYZvHh/+rR2MDelTGNBcFgdI7o2MgPvU77M7+g4kkfeJ2CnntXD7NtManQNIGigE2bDX//938rtzjpZjRVjRbNDBm1AWW6XmdWFAVFkTFeXeNOd7oDwwI2LeV4F7B1uZ+3dGDY+GfeGznopRz8veFne4fzv7v//w84J5GNhk6ncIWNCthDhz6DxkPjhCaADQorCiswsREMIx1dTWT4B+lrEGwT4ZYB8GFWoB8CXPzjH4e11XGXg1N85+yzufDCi0JMR2s8Ae88RT6kto7g4bOf+1K47NIrI9BE51jboE0AFenrlIoAgHoyRgXP7W55c+53z9vJnU6+tWzZtBAjB9bxnOc/n/uf+gA5+8fj8JEzz2KX1Zjlw5hY0Hk+q18yIkiwuGZKOVljsrpGVZY4G0hEGO+8mmO2DBlS8dD73o1nP+lhctxWLctJ7BQwNKCt412nnxH+4A9ezA/O/xFJvsCk9JhswL59+zjppjfhZS/9Q8lTmKzVSICsa2PTN8WM0PqYMoggkDjfn//CV8IXv/zveFE4D1XbzDyn4BzOt4gKuLbijne4LQ845b6CbzAqRDJfJXgXeyxqIxQZbF4ueMbTT6OuJvi2IfiYIumR1D1aOgTBZDk37NjN209/N5Np7FOmughnmuakST5bh1rFkGd0jjx3u8vt5QlPfDx7V3bj2ybud+9nToIPQlk3ZEVO1VomZcV/nvUtzvvBT0OS6TntE0cUZV0kqoNUJKnwre+cHb769f8gqARPLNpOspSqqtBaxey3gsnaKve8x9158AMfIINM0H34HqLR+jPSLz2OYP892c9VD6oJQdA6ociHFPlC14anz6d1crH11I2jaf0BR//3/kAiWM161dVRmpmZjujY3qifHzqEdggYo5EunKzmM4uRmUJtuJhYcOrxwXbV7ZF9XQDfJfc0UFeee97lzvJXr301Nzn+GFITLazde3aSZSk6MayO16itIzE5PijqBnbvHvOe9/wbZ3zgw2HnripOphZMkhyc8PhGhNvBbs78S+vv3ViPt7a2j6qaziy4EELX7DQhyfKu35G+0aNPWt/YkZicQbGA0TlpmqG1prVgbZiRO8+zvMyzKUhYLyOIsrXvsrteS2idJUmFcRlwDi677LJQ1zVHHHEka2sT4nbTXWhjTtF1tT5t27KyssLi4iKve93r+NbZPwxrkwZlYtHxgZPqZ4eojjx7Dto85/f9wgpu//FfUajrHt3B/9a2Hts4msoymdSsrdWsrJbsWZmwa2XKrpWSnfsqduydcsOeMdfsXuPqXWtcuXONK3eW7J0Edo7h6r2OK3dO2LVa0XoiMUHbgklnUs+HmGBPMviPs84Jf/Lq17Bj1268h8Z6rr72Oj73hS9SlhalEzqqAQKxO/sll13Dhz7yUfLBIkZnEXSlDEqZ6Pn5gBGwVYn2LccevpXHPerhDFPIMuFud7sLm7Zv454PfBD3f9TD+MGV4/CZb57LjjbFFcusOsGajKQY4IPF1VO0q6CaYMf7aMZrtPUUb1uUCInAsvEcMRCe9PAH8PiH3UUOH0AhkYhkulpy0YU/4Y9e8crwr//6Blb2rtK6yLYvOqOpWzKTcM+73YljjlrGtrC4FBm9vXcoUfG6QpixEInIrH72xz++Mrz7ve+jtVDVLcVoISpn4saomxJNIPiWTcsjHvdrj+SwrZtIjY4MNj52WkjyHIKL1wWs7N3Hox5xqtzpzndAJEQWfhfz5rMyFyUoo7EuoLKMb5/9XT7+ic+EadXZM74zrJXCNuud6o0WxuOKwSB+9rQnP0nueuc7UZUTxDuKopjB20MIM85Jk2S0zrN7ZR/vPuMMJnXH+dut6w1xnr4oPQh7Vy0f+egn2b1rhbpqWVraRKxRTbo1YyG0GC1s27KZ5zznWeSF7mpYe3TxwXbWepCvl60yF+bvrzdN01lHgvXOGAprfadkN8pL1bXg6f+fJMmGY//39+maGVZkTheIyCzc6dy6vFch5nz752bjRRzoERljyPOcSd1g2zoyCeSGURE5+oyCuvYM8qgv73D728gf/9FLw9/+zT9y/o8uZrHIWVvbx2Awoq4j6jIfjKimU9J8iBaYliWve92bsbYJz/utZ8mg0LhO2h/UO+vyNH27mf1vxn9lZFlE5ngbug0W+TTbuqGtm7ghOdCND93v+Z/pfihUiAu6LsdE21d1izD2Wgv+Zwvy0CXFY+RCR86B+evsQhpaC5dcek141av+lOtv2M3apGLz5s2UVQWAx6O6As74ueiVJEmCI7A2njKZrPE7v/si3vm2N4Vb3+ImQgixe8F8cjSodTaGA9An68MLN4p6/K+Mn5eT+9nDM52M8S62s2lb2zXcbWmsDy7AtLa0zlO3LrK9NC11G2scW6CsHbVtcdWEpTzh1icdx+1udZKkRcqs4FOngKGtHVUb+PJXvx5e9oo/YdrEjZkPRkwnLbbLVeze+xTyYivWCZlJmNYNeTHgq//+8fCjCy8iH22hGGZMyzFGJ3h0rIVUkGmFFc+WhYLb3PymPPSB9xM8pBnc/1cfzI92rPDyv3wt5125j49/9Sz2qhw9WmKlrCiGQ7xz7Nm7j4XhCC8Vtqlw9RRXlihrSX2IecpgyVzFbY4/nN96yqM5fGnmzOItrE5bvv2N74TXvva1rKyssrI2JegUnS2QBMF5z2g45MSjNvGMpz1NbAsKhwQdSQMkhr5NmoLoCE/PQVCIht17p3z9P7/BeedfSDpYwGQ5k3GJSSOlWdM0LCwOwdZU0yl3ftB9ud/97idaS+xUECxplhCsR5SA9QQCVQOHHbZEWcFpp53Gjy/+M6ra0jhHCIJ0FFYR+KSoq5rhqMCHwFtPfwePOPVhpJkB26MpLWkSuWPrqiLLc0ajnNY6RgPNMUdv4+lP/XX+6i//mpW1MUk6wHoiMbyPMqesmxgBSAp27Vnh81/4Ck9+8mnhNre4iWi9ruDiau8KsYl1pD84/4Lwne+eA9oQxHXhds/KygpbtmzGNyWT8YRt27Zwx9vfjnvf605SpJFsJjUQfOw0wHwubn5/qbiP5CAJ9vlaYa0MIsSyjBDIdRK7PbgmEjgcJPUQyaXlgL/NHn1k/olI26hEReuOw1ai+d5lIPr0Nh6stwgJdVWRp1ksIVAqxpWsjUK/h+WGEFFcVVVFWCt9J+no9WhR2CZQZKqrW4BBBve51x3k5S97MccfdzRNVVLkBu9a9LzmDULbOMq6IYjBJAVvP/3dvPHNb4vIWdGIQJEPZ+S1PUmsUtECTDp4bN9LKS7OGHb13Xv713vl3cfb+8/1Hbp75KjW0jVcVQzzDKMdmfazI1Vudhja2eu5CeQmbHyfdhHqnxqWNy3GOdPRioqlXwfm4TYwfMjGMIHvCq7bJrJ0qy6803g49wc/DC/6vT/giiuuiAWixPYbviviaZ2ldW5WfyLa0LpA0Ca23rEObXIuvfIaXvbKV/GDi34amq5+WrTC+oDoOO+hY55u6hunlfqFRwhzay2+1IMQ1tlTDu6x9/dwI3KW2YZVSjEscgZFwqDIKIqcwSAnK4ZkxUBMNiAbLuJ1hpUEVWxCj7bQmiHTkNKQo4sFqjp6XseccALHn3iipEVKC1G56YzWSrSKleZd73t/+KM/fg1l62msJ80HTCYTBsWQoDS7du/li18+M1S1w5iE2sYu9T+6+LLw/g98GHRK8BGanaUFSE5dBYzOSURD27KQKAYanvXUJ1IMomFfB7jPQ+8rf/O2f+Wsi6/m49/4NjtsbGLaOkua510dUoLJB0zrNtaxljXjlX0o70jamrQt2aQcIz/mCQ+5Ny997qPlmCUkJ3pvroVrrtvHn772b8PzX/Ryrt45plEFwYzQ2ZC6jt5SZsDVE5721NNYXBowyCHRussjt9E46tqS19NpzA8GaJ2nrOGqK68Lb33r20mSDNtGtnrRahb9yPKEpqkIwXHMMcfw0pe+dBbjiM2Q+w2k8S4CWLRJI5OIjT//4Ac/UO5617tSliV5npOm6ez/js7oLQrWxlOC0lxz7Q284Y1vDX15E0R6QqADK8VCbogFMiFEwfuExz9Ubn+HkxmNBoCnaauuzY0BEXRiEJ0wmZQMBiOqsuWf/vn1tB1YxrnYM07rBKUTGutBYG3ieNMb38buXXuoymZGCwcwGg2ZTtaoqylLyyO0Crzgt59HkkZWlDSNCM8YLVtXcPPh/Hkl1stb21HESedkNE0zC7/G1kL5+t51lsSwQT4WCeQmkCpHIhZDSyKWROzsfUUCRQLDnFmvuUxDqgLiGgyezMRIQ6oUbRnIDTTTFk1sRF1OprF1Edw4unLegoYuHhxCx+61Hk5Kuu6k1raIJLStJzGKe9/ztvL61/1jeOkr/4Szv38eWVbgfaCsG6zxM2LP0HqUydi5ZwdbNg054/0fYmXf3vCqV71MEhMFe1EUDAYtVV1Ha0vFwvCmaUjVz0Gn9DUlRM8iFg/oiLIjkOcJtmmxvmWQ5dz+dieTaoO10c2PLe/tAUCH/vn+IdVeMEcUkqFuojWSpQoRz02OPxZvo1WrtCG2J9n/nJmFKXoGq8m4ZLgwoKoqkixDRLGyNmZhYcSlV9zAq/7kT7nq2h0UgxHjaVx4ZVniQjRMhsMh5WSCtTZaWD7mOyeTKYhQFCO8Cmzddjhnf/8CXvzSP+Lv/vovw21vfYK0NhIwOxe5NpuqxlWOYpgT+n56RChP/M+NoML+Nw8JkGjpANIdK4govAqgPcEhk7VpGIwWSYaKtWlFayt0NiDVsefY7l072bp5CyccewQnHX+kbFlSaDoKOetIlMEkmssu38VbTn9n+OCHP8Gktlg0SZLGWsBubQQUO3fv4UMf/hgPfvCDOeLwZYyJwd73f+BDXHX1dQQUOk0IdUPrfOx4YKEuKw7bvJnVPTtJlOMJT388t7/9baVqAqoQWmBHBZ/5z/P5xoWX4ofb8NhIS6agdpZJVeEx6CTF2pZ6PEE1FYMkpV3by2HLA6o9+zhi85Bfe+RjufttFiS1UVDXVSAfCJ/7zJnhLW89nZ/8+DKUKRhPJiwkCd4IbWtJsozgWpppxX3ucWfuefe7yKalPMoNFTuTmUQRvItMdyYlzQdUdUOaRRoppeBDH/kIu/esEgHgMpeb3+hRrI7X+MOX/D7HHrOdpBMFTRvIsuHs/REQKPTAQK1iIb/28Jzf/A2uuOY6zj//hwxHiywvL+OILcEGoyHeC2mW4wNoNF/4/Bd59CMeFk666XGyUEDwdE4BZPl6eN97D9aRpZppA8977nN42tOfzWi01Cm4hLptY27WBZQWlElBFGVd85OfXsonP/258MRHPVSMibRdZV0TlFAUKR744pe+HC686GJaH9BJNFoTtd7JQSSwsDCkGq/ytNOexEk3PV5wkGdxb2SZnu3f/+7onYYsT0jSrpbatWw/8mhOPOl4xmu7EDXP1XpwUNl8CHL9USHEFJkWFfkpuzrBokOqHrZ1WRITP2NmSRLfeXWR5PwAJffzQkB9/VJPy+LcOsO+VqBTRVk78kxz4k2OlT951SvCa//yr/jeOT9gaXGJ1bUa7xxKJURUTo61LcVgiAua667fycc//lm2H35EeOYzny7jaYQyr62tRRdVQCsVQ4yedWUwF3LdcL4HIBdnJc1ICNgm9pQa5gW3uPlJ/OHvv4gTb3qc5GkEEmrxHcjjQPBFb+Hsr+Rm54ImyUxMvLZQTccsLAxIErBNwLYxVn5QpdBjf7pTHy7EVjBZDxHWsLAw4rwLLgmv+pPXcOUV1zIpG5w3jBaXaZq285A8aWrYt7KH5cVFXFuze/dOtmzbHpkVlI4d33XCzp03sLQ4ZGF5C+ddcBGvevWf8cqXvzTc5pY3F2UigqkqY1cCfKCcdBDu/aPEcpC6v58z+rqY+eeRCvaXG33cPgJGQpfz9ZGyxAWGjGi80NSWIEKWZYj2+LKiqWuO2n4YJxx7BDc9bpMsZetXpQW8MlgP3zr7/PA3f/fP/OSSy7BBoZOC4XDIvn1rpMajE0PjbESg0XDBDy/mrG9+NzzqUQ8UCXDO9y8OX/7K12icJ00HWNvxbmpNaz2thS3Lm1hb2UuRG255s5N42jOfLulI0wpUwNUlfOzM74Vv/uhyxnrE3rUpw+EQY6f4ssZLwiAdYCVlPG2YTKa4smGkABybRgWFbbnb7W/Fkx7zEDlqU7yNAxOveceevbz1rR8LZ/zbR7nm+j34YBBRZAtbqJwjSXKMbmjKCYdti+f6G89+Gjc5YTsQe+mpruYlIhGlo8GzaJ2iJNYhKg1f/8/vh098+vPQ12dxkJ5qEuEdD3rQQ3j4wx4pVQ1rTYsQMMpTNYJr2y6039010TEH1meSA9z25JvJfe5zn7Br1x527tpDUzvEaPJ8QJYWrE2mDAY5TV1im5Yrrr6G17/hTfzD3/5lRMCaiAbvO13SyQRlIgJTCYhz3Ocet5NTH/qr4Ytf+SqJUVR1iUkz6JCi0lPRdQCbK666mg99+KP82qkPxbqWwSChMBmtg2kd2LOyxlvf9k6u37GTNIt0gEpFIW+bWEdmFNim5GYnncDjHv8YRiPB2TgbddOSZ0mXd/FzWZ+ft2/n5alnOIy0ek1TxxyobcnzlAc+8BSe/exfl6WllEin30/PRuXWR9Xm9+v8/9vK45zv9rGKKZ7gSEyk4rNtDPVGpC5RaCuJrEw2OhKGELr80oGXE6cs5saCjzVGDo8KPb1SmLVRwcbkozGGrDOpfIA73/4k+bu//kue9ezfDFddfT0LowWuv2E3wySyekdwQMsgz5iUYzZt3sbaeI1//Kc3kBdL4ZT7P0AGgwEiQpKmeN8nq6PvMO9wziu6XlVHpeQ6wRsBAtJtMhEhS1IaH/CupSnHbD9si2zeFG+1bSHRHTvH+hrecKPS9MYXRQ9nTTSoDDYtjiK2sYvJE+gYs/dHWK5/p/ceTyDpACveB0wqVDVcesXV4U9f/Recf8FFBDEonTFcWmDfyhidGIqioKwqppNV8sygsCgDS4sj6nICypAVBeNJybSu2LR1G9PxPrz3LG/exlnfPIeXvPQVvPlNr2dhMOTw7QtkhaGuYofrPvQ8V2ZGX5f2383H/VcRnL/I6NlldJSLWAQTIgptcZjLytokKN8yyAx109LWDYkKDJaG3PZmN5XNS5FGDWZ9LGNuygf+/M/+Jnz281+irBzTsqUNiiQz7N69mzwfYG1DURQ0dYvXQqpzkiThIx/9JKc84IFkCbznvR9g774xxWARF4S6rjFpNgsHDYYFdVMxHGVosfzGbz2HrUcsMHEwAa7dRzjjs1/nh1dcT5svUkpCvjBiOlnDhJZUC6Iiv+DK2l4mVU1hUg5bGmDX9lD4is2DlNMe+TDudfI2yQPoNoaMJqsl11x3A3/1t/8UzvzaWVReISplONpE1TiCUjR1g21qBlmsORyv7uX+97sn97z7nSU4aLqaQGM0oWN4UUahtImodYkkvl5g5+6Kt5/+TvbuWyUrRjTlfD58/3Wh+PHFl/DCF/1+qMspqRHapmJ5eZGqnBJCwOhkbk2pCFoJfV5LKMuafatjpmVNPhjFnJxENP3efStkWRF5LpPIxj8cDvnsZz/PU57w+HCPe9xRlIbErEeT6roGJWRJ1inxjtnfw28/77f4ztnnsHPXPhIdFSAq0mCFTg47G9Bphq0rLr74J3zy058Njzj1IVLWMe+qNEgQPvHJz4RLLrucrBhA0DTWknZrJuAQ0XG9B8eTn/IkTjj2aAk+5uHqOhrXsaj6lzMjY3g0pnlMYqB1WOcYjjKOPDIjtKAOEjC8sRzd/BARkpGs0wV2JaW+08lKQZ4VXY2QR3UMM1HRqVmzzwMYT/Y/kXXoesDLeq1Gj4ayNqBTmcVrfdeeVoBhETnVjj58G6e/5Q3ye7//h+GHF/2UxYUMUQHrY9+uwaigKksERVU7XNAo0bzpjW/Fti6srq7OJsB1dNs956SeY6Q/WDF4kP3LEOLKUiEWGLZVTJTiPG1Tk2o3M2wSvd4CZuOQ2aNzYRafnp+3eTRQbFcdYdHexbbsOktwtUV3dDQbZ379nIN4EmOYThpMmmJSYd+q45rrdoRX/cmf841vnM32I4/immuvZ9vhR1BOazyBPEkoyymjYcbKnn0sb1rm15/yRLIk5YMf/BDXXHs9iUmYjsfk2YDxdEJRFGRpznhtlYXRiHww5Mc/uYzffeHvh7/6i79kMBjIpgVNCFBXDVmedSGB+ZnxM0X3yxSD957cLzOCQE8yKx2bRyAyZBjlCDpQ24ZhqkRJGsqqpm2nZLQcvm0TR2w/TI7aDPMBcSWRUMxZT9s6jj/+BK6/bhebtxxOmsR2L0VRoIxmOp0iSrrGv1GArU0nLC2O+O73zud7514YFoeLfOOb36VtAjoJNNYSQgQEra2tkRc5tqkJ7YRBVvCQhzyYO9/znlIDqwIXXNWED37hq1yxUlKqRerWoIuMam3MptEQP3a01lLWYybTCu0DWzND4iawZyfbc8W973IyD7z7HbnJEVqkii1S2hbGleXSy64Kz37Ob7KyVpHmBbt3rrBt+xZa62irEhFhNCioJ6sE79m6ZQlbj3nB838L03WFUCIkSY+Ci0XDSMyvKZ3Q1J6gFcHDpz/zuXD2Od/DpAXTsgbMupdE50PMGYWrkynf+uZ3SFLNIC+oqilplmDrhqRDaPfAB+/WlR1AQMUmt6IomxqjI+9a3TZkacFoNAIU+/aNKfJF8nxAXbcURcG/vvENnHjTv2H7tk2xX5x3JIkmK/LYhLm7VuccWZaDwEknHiOnPvyh4f0f+AhODGvjCpNmsb8bmkBkmklSHfOmVc073vUeHv7wX0UCTKqI3L1hx17O+MAHQRRaGSZlOzPCXRv5RxMj2GrKfe55Fx7xsIeKEmhbj8nitRsTcRLrs7of7V9c7Ruesf87JBLSq66jgNaxq7f3gaqaUk5hMb8xQGCf7zu4gzW7365DoftonCilZvymPcGvcw1axR5gEdARIutJiLQXBxXh+1vTfTHtfJsJ6fpcx75MvVdjZspnOm1wLbi6ZZALxx5zJG9/65vkbne9I0mqcK6mbZtucmIiMxsMcR3X5cJwM9dct5M3v/mtXHvttUC0GnpQwoyvr5+yGwlXHnTMN0EUTWYy8jQhSw3SUXARWrTytHWDbdwBh2s9rvUoIpWPFpkdRimM0iRakSYxyap1JA5V4ki7MMGs2n92Pv3FrEPydZesV0aju47e+9amvOSlf8T3vn8Bi5u2ct31e9i0ZTtl1TIpS5aWlmYcgNV0lTxTPOwhp/Dbz3+O/O7vPE0ecepDGQ1z6nINvO0ocnJW967gnGPbtm20jaNtHMVwkYt/fCl/+uo/Y+fuPezYVZLlmixPqcqavuUIrCs14ZdXcP+rhsy6tmqk41/VswJgjQktuQ5koZVQrzEylpscsZlbHLddjtssZAESB4l3ZDhSLCq0GAVFlvKwhz1Mbn/7O7C6OkapiBK89CeXxGxCYsiylKoqo/BKIslyWVm8U7z7XR/g9W98K+W0pW5idCLaiCpGHzpUW91MKYqETZsXeMHv/rakiykV8LXzrg3v/dzXuKbUXFca2sFmzGAzk3HNYj6gqVoar9i1UrJvtcQgDMSSV/s4Im2583HL/Oaj789pD76LnHyklkUB4+Fzn/16eO7zfy9855wfhI9+4rNULUzLhqbxbNm8Ddu0YFtSpci0xuAiX2dTMllb4SlPeiK3ve3NJEli4Xufp+5LdFSH7w4+hgx1ojAGfvLTa8K73vUuXICmdR2AamPOSO33fGVlhYXlTYjOmDaOJB1Q1wGVDGicovWa1mtsMHiVgGR4lSAqRUzCpKoppzW29bgQoyZKRY+vh8YvLi7S1nZmxGtt+M53vsNX/v3MkGWC1tDU0dgLdNGXEMPUWWpinV4AHDzx8Y+V29zm1qzu3UOeJuD8DKihVQII3tGB5AKXX345//bhj4Q076pVBN7/wQ+GK666kvF4TG1juqSH8rdtS5JovHWMRgOe9OQnsmXriBAcWRaLtbPU0Bd5/+KAsYNHrAbDAmNiKdJ0OsY5S55nLC4tMBh0uskFggt46/HWz553lfWz5wc7FAGtoqeoOnIKpSWyfytFsOt4id73cEGDF0LXUOCAM99fwLhe4YUu+dv1CFnPQYF1bqaAANLUMBikGAN5YXDWkqcwGhb849//ndztznfCtjVJGvug7VvdCyK01qNMSpCEa6/fSZGP2LFjF8PhkKIoSNN0hvJsmmaGtNo/abn/9YTgY+M/6S+5y8l11mS/OFSItX2Cw7sG7xqSNI29kPY7tIk946IHzAFI+v5UQmgJoYZgsW0Ve6nhN8Ly589XNtpNdRvRWkmi2b17TFXVPPe5zw/XXH09VWmppo6F0TLOwb6VNQ7ffiRr4zHWOfI8RVzLg0+5Hy978e9LbmIq6vd/9/nyqw+8P6NhTpGnTNZWydOMpYVFCIHJ2pjJZMJwuEBVt9St54ILf8TzX/A7YffevbNrzYts7kxvhLXlvzn+14Qt42T26Wg6dodEKxKtyI0wyhOMb6CdsJiKHLd9s5x41FbZOoDEQ2IDxrUY36JcCbZCgsWo2FsuyzJOPvlklpeXqaqK4XDILW5xi+h9dT3mPK7LDcNwOERQGJ3w9a/9B5/77BchaIyJ3JSxKFpomiZ2iS5XGQ0TBsOMpz3zaRx51CYmLXzlnMvDl7/1fX503V72qRH5Ycexc81hMWzbchiT3buwk5KVSlGqBUyxQJIkFLQcv5xy6j1uxcue8Wh5xJ2PkyNNQ7VzNyvX7ODNr399eOkr/pj//M4P+JvXvY0fXnIFe8Yl+WiJ8aSkLkuUd1TjNRbyhISWam0vNBMUji2bl3nKaU+WaRnBGLCu3PpaKqCjxjIdbyZMS/jQRz7KxT+5hBCigE+ShMiMGIVdjwKMrKKRv0fphDQraFoX85dO4UnwJFgMtROs60mADa4j7O4fRRmUMQwXFqKRYmN0RURo27bzxLJZQ9A8z1lZWcGYlE984pNccsnVAKR5RtPG8FjwsWBbCJFRxLtYM5jCSTc9ikc98lSGxWBWdwxdL8Yup++cw4aodOvG8vrXv55LfnodRkVk68c/9kmGgwV0khG8oLUhUUkk2BaFsxYVPA96wAO59z3uLt4SWwwR0Z8i0kH9D8Zw8l8bUfHbWQ5ZRLCuoSwnTKe9HOzyBBtk77rMFpG598wfdKHXzmsMtutyH+nmrLW4EAE7QUWEc1AqEgDMNr30Sq5rKjID4a6PeS3YFyiLSPQ21HoPpDzPI9y3C7dYC1XdbAjlDYeGzZsGvOY1r5RTH/YglG/Jk0CW6q4jbE/SasgHI1oHaT4gKM3q6ipNY9FJLHJs2xg2+O8I13mqKqUiKtD5FrQidEAFrWNifb4te2SJiHqqP2JtYfzeeYXXe7ehywMopREdWVVA4ToyxHX6q7ki9bni8CzN2DeegIoFoy952SvCRRdfwtXXXkeSDcgHC0yrhqpsOOyww7nqqqtQIoyGA1xbc9e73IFXv+rlsnlTQZ7FEOywgD951R/JA+53b0JbMRpmlON9TMarFFlOkqSICFUTwRLxGjQ/ueRy/vpv/z5cfvVu1sZtXFSiOtzMRm/0gKYQfd50tnzj330XIZjRb4XARnYWZs8lyEG9RX+gbbP+u70B0hW9ShceSURItKJINUYFFouMY4/YztHbt1AYCG1LsC3BN12XagF019sqEtI2dcum5YRf+//ae+8wu67y3v+z1trtlGmSLMmWZdmWe8HYxrjiRm8xYAMBckO7JCEEEn6QkBt66EluQnLpBhJ6Cb1DXMAGjDFgG/eKe5FVZ+aUvfcqvz/etc85I8k2CeRe4NHyczyamTP77L3KW7/v933KkymHi4C0jbrrrruwtSMxGYN+n07RIo/w9N5ggCPQG/RRWULebVN6izIp/WE1ahFU18LEn6Up1nrWrNuHM848S212cN6Prwmf/uaF3LG1prVsd+aHnsWhZXpujmFVsWnTfSRJQm9xK36whYI+ptzGVOjxqGMO56//9A949mOOVitaGsqSLDh++L0Lw0te8rLw/vd9kOHAMd+vuPLqG/j5FdfjY8uorGjT6nTx3jM11WEwXIRgKbIErQK7rZjlGWedyd5rd2O6m2ErCV03YCzxZCVvMixLycUlmn7fcvOtt4VPfuLTzM4sZ9CvybICZxk17ZxslCs7Q7oKTrUKtty3AeUss90pXF2NjIRWXozaa+mxsINI+o4PpCZhYWGewUA6hjeC2jk36lKxML+VPE8pCul6ULQ6OA9XXXMDX//md8LW+RpJy0l7rwYFWNdDQm3RaUqWpyIrAjzqtFPVw44+kmF/UejGAlhbEYIbfT7KYHRKUJrF3pDzzr8gzPfg3PMvDHfceS/3bNhElglWQZo+9/HOkucpvq7otFucdeYZTE+1yNNI6B4arklGjC5Lzu3EuZs8UnqnaGl5h60lqgWaREtJFz6gDbTa8ZyOMBM7vkZX2+77ZnhHvM9m7SSKaEyKTuTzdBIpvbzgR7SOskT+gEjYFtWEVlKLopp8nFTVG0CFhkjGonBoLW1qTAJgRo6J1kmsVYPMZCOkkfMu8tTV7LduJW943V+qotDhm9/6D6z3JEmbvNVhYaHPsIJ2p0tdSZfyEDx50cYjVo4yEgqsa6mLaDakdN+VNdOmIekci1WlAsoElHYxiSlFqa4uaRUZtbMkaYvaQ2JygfZOLuvEYo085O1zgBM/92i8ErZIHyRs1kTBTZ5Eoe6kWactpbGo0tSV9ORzXtCFxhg2b13kHX//T+Eb3/4O7e4ceWda+jZF7rg0zSgHQ5ZNz1CWA3Tm2W/dOv7h79+uZmfawgAQBb7RMD2V8ba3vVEFXPjWf5yP9oGpmWXML/bJigKd5jFMrakqT5oqirzLN845D5On4TWv/mu1R3eWREEIifAMe085GNJqtxtkxg4KaPswZiNQiMwPCk2a5qiQkBopdWhYD0yc4OZYhiD9tLTWI2MhoMV6tnrMXhYP0CS1lzLR2g4Zu61YMb6v+DXRsbIUI15YMKP8noCXNGkqcO1DDtlbnfSIo8P5F1xEb7BIWuSYrIutLRkZrlehjabIMokoEFBFQoWj8jUZkGYp3hI5YVPaaYrzNcFaDn3okbzqb15PlcGHP31xuOTam8lXrmN+fkhdC6k53jLsbUbbkqruUdqS6dzTstvI6z6Hrt+bMx59Okes6ypXS82bSeCyy38R/vVD/8p/nPNdyhqU7uK9oZNleOcp+0N00JSlkBFXlcUHcFbg7yE4vPI4b1m12wr+8A+eo7wDV1mpj7UC/yaArWqh0FOCbnRAWQeKTsJb3/IOnAvU1qJ1giHFac2wrul0WgyGPYJzTLUKjAr0egvSkNQp2rEhQ93fQh6Lub2GerhAqjXg4l7wMb/qCUq8mOFgUdCgCws4pyScPBiQZbnUsQZPnhmsLQUJGBug5q02vYV5Pvv5r/KUp55JuzWDIka2aotzYqDUVUWqJDxI0HgHa1a1eflLX8JlL3wRPmgGdS0eWGzrJHVzmspKN4L5+UX+/QtfZ/+Djwr/8i8fJElnyNIBtQ0UeZv5+XtZNjtD8BWuWsTVQ577nP/JoQceqFKhBh3t29QkBAdpki/Z7zL00vPZpKjU2FAJ0esMQaFCQqI11itcVZNmBuUcWZ4wWBgQbOwBNzrrEzJyJ0Ga7WWqQlDfKogbJoE4kQXON+dZJLTWMLQD0rQ9qlVMsgxnJ7oQ3F8uS1qm+OhkekJwKOWjSfzgHlRQ0k6mdrHANxKNrt19OW96/WtUnmbhnHO/y533bJIu3UmO0pK0b7UKvKuJfxWvNwZ9jO+9Se4L8GTpo4wbrjahAbEDfUySOqq6Fob5NGexX+J8A85RzRpPfNbSj48coDtYJc0/nEtGgl5PLK6L92mMxnorhcHlgCRJSbOCalhLPVOQz3jbO/53+MpXv0FaCBqyM7UMX0qoJ28V4B3eVigdaGcJK1fM8va3vZnlc1O026mgOpuwSJKQpwo9VfDXr3qlqp0LF/3oJyz0F2m1OwyGFSopBNFZlXQ7U9S2olSWqek5vvHtc+kPh+GNr3+NWrvnCoyKqEM0rU6baliCl1pI8Y6XKjfpIRf3B2Mvb2c8paphdKFBcgoqSK6hRtdY8jVstz+2zxnez9cdh45hxrG1u32/vLrydLspv3fGE7nokkskzzOwJCalt9ink+Vyz66BS0eF6x1aK6a7LXq9AVU9IM9zjE6x1RBvHSQp6w95CH/++reymKS86h1fDIvB4GdW84uN87TmVlB7T6KEe7LqL5DgyJVD4chtn4NWtnnkscdzwsMOVYmDJMB0CrfcuoGvfumr4TOf/RL3bdhM5VPSokVV2VGqfjgckufSY00nQsPkQ0ApL9EKhBFHa0+3PcVZZ53F9FRHAFtJEoMSAZSjqh1ZnlPbmiRNabU79Ic1WZHypa+eE6659nqGpQXdFMOXJEWOclbAHPUQdGDFbsvoFilTnfUEV9P0NRuvv8iKRk6kJgHCOFrSvDduj8oJ/RS770aa5iN04/XXX49WxBKhMQbA2UBlvcDlTcKGTVt4/4f+Lbzu1X+uYl24KINo9Y/+zrk4V7I191m3Vp31tDPCxz/5GaamZplf7JMXLVwIWOeoyiFZkoKC9tQs111/M3/zN6/jtjvuJssKYU6xlr6VSAHe4aqSPNEcetihPOmJj2e35a1okO18bz/YUGHHM9kougaOVVWWLMvQaUpwFXVlaRVZZJISZhUtVYoj2awi5F9pQbALen/iA1WICPgY1IohzzC6h3H0Zlg5qD1ZYsiLNgHh7WSEqEdKCIh1KBGKIY1IIVJWBRE0YYzAGeXofEwg7WwWGyVQ1SSFGYUM8iyn1xuQFi3mZtv8r//1KtVqT4WvfPWbDEpPv5RNNTc7xdatW8mzSc5FFS2LZrOKdaGVxyiNmbiR0BSuY1Aq9hcKiVwi6jrvFYnJSBKZ8f6w5sLv/zjceOMKjBrXwDUPOY4vxzkh4H3T6kcv+Tp6fxTyBDXRYw1Q0gbEuiFHPvRwtWzZLNoUo35VvX7F7FzOHXdt5sP/9rHwpS9/g02b5+lOLyfPDcNhhTYpztV4bzEaWq0EZ4dMTbV5zatfycOOXq9i2zm5a+elEzIOHZlX9tlnNX/1yleod/z9P4Yf/fhSNmzewtTcCqraMhgMyRODyTKChi3bNrNstkur1eaiiy7mda97fXjjG16v1uy+klYm/IyUNa0in1iHHQ2hnXXF2WkJSxhvroYmTNbST/zd9n2uBD79YKitX9doPvukE45Tu69aGW64+W6shTq2YQkmofZeuhag0CGQKIX2ChUU5dZFpvKctNuiqioWFrZhjGHPPfdkxT7784LXvp5vXHEV197wC4YEXJJhXUkyXWDDkFQr+ls34gZ9ZpJA5muy4Dhg/d4c/9CDOe2o1aoAOkoa7d72i3v4t3/913Dl5Vdy482/oNer8SohyTtU3jGohTA4zQ3aSRdr8ZZlbhuWHnluNzpnxx7zcJ74pCeoVkvkCwqCs6g0wU/0q2oiPSjI85Tbbt/EJz/xGe6+dwM6aaGCtEsZDi0mURQm4d57bidNNCuWTfOmN76Ggw7YX2WpYdhfJJ1s1RLPnZ8wShIVjfMle2HMlZmkGWnMbS32BS16+213hFe+8q+4576NhCB1ikL5pUhMQgiSD8qSlLp2fPGLX+Sxjzw1nHzyEdILLpEojK2tdBuItXPGpCNWnz326PL7v/8MvnvB97n1tjvJ8oJJsmMixdhgMKDdknKEG264geW7rWTb/CLEtE5VDlg2O822rRtpZQkEy9POfAoHH7yXmow4/br2upqIK4YQRkwvzjlwAZ1k+KC48qpr+MjHvhza7SIqLS0dP5pIS/yqlYSYdlRyDbG0WfLZEgWI+08FWq2WdJEpBygVqMohxx3zcDUzMyXrpTSx1DNMuI86xn2klV4Tugyj5O84VARR+Mi+2amya4AiUjAoDOJ5kULw2FqzYq7Fy/7sJarI2+Fzn/8Si70e6Iyq7KGVg0kF14yo6IRFYftC7O0XxowUnUHjIoS4sfoUCSaBYVnyi1vu4D3v/QAERzkYgPKYJBtN8s6+br8BlhJK+1FiXQW9ZMNJsMaz/wH7sm7dPkzPLIu1OJLPnF42xd0benzm378S3v2eD1G0OqxctY6t8wt0ptoMtiyS5gZjxAxy9ZCk3WFmqsVfv+oVnH76MWo4qOnkaWR5aZCaahSP1xG2vc/ee/L6179W/X+veFVY+NnPIcRiUiO0RfPz25iammK33XajGvRRKuDqwPcuvIg3/u1bwhvf8Fq1+6oVFJkmSfPRpg9BqMB+2TEKUwRQvokY6JE3F2KoYnQWYKKzxOQQ4yyEHffDr3ukqaF00G63Of3007n51k+SJbGHYLtD5WuCcdJKRgV0iMXN8cbyVpdBOWQYNHm7S5a30VnO6oMP5SEnn8YHvvINqlaXBZNiCbS7LZy11MMBU62C+Y0bmUo1OhnSNXDwvmt5+OEHs99ee7BiGjWnoBoCImvJE8P3zv8ut992ByYpaE/NsjCoKK0lyQuKKfE8Ki8dnolgj1ELGoThXceiJVcPWLXXGp7+jDNZubyDjqEkW5ckqaHJL2dFOgJ11B4GA0urnfDlr3w1/OSnl5LmBaiEqnKkaYsUFTswwMx0G43jxBOO5eHHHKmmp8DXkK5sLanHbBTXpFw3E/tlcjTv7fc9RUtyad1Wh7wFc9MHqOOPPSp845vfRoWEKjI8OedIsoQ0zajcQEJoSgqrP/6pT3PY4QfTaScYI12vZY5U3MPyeTriGJIUDj5onXr6mWeEt/39P9LudhhWNbXz5K0WrbyNdRVZVtAfDDEmZWpmlmFZRzmqhcg6JNR1iUGhFRz90IfyhMc9TgUHtQ80bCC/zjGm+3KYJMUFT11VaBVo5Smlrbn4kh9z5dVXjfTEJFHG5KsBK24PMms+oykRU0rHeu6GxxdAAIN5kVKXQ9LE0M4z/u7v3x6OXnm4uCH1/dB6LbWMw3bfqxEPxc7Qb9uHfppmllkiHYjrssKkCdpIiWB/GFg+V/Dyv3ixCiGEj3/i0zgMw3JIUeQiLJXi/qiiQnDiqcR7FAXM6P06lgmM085N6YAiBE9/WJIaafORJIYNG7eSaHCuJssyhr3ehJu8o6J7IFoahVwHYvI2jD1hhQdlMckd1FaHJFXKAwvzlpmZhPmFwPs+8K/hM//+FUw2TdAZg6HDOkO/V9FutymrAQrFdLdg29ZFtKp53atfzaNOf4TKjRykEJEXpqEbi4nthn3cWU8r16xcMccbXv9a3vTWt/Hjn1yKVpoiz7C2omhl9PoLtFotVJKybWGRdp7RKqb5/gUX8xcv+8tw9gfeo+o8YWZaQqMLi31mZqZ2ys/5gEM1IWUJJzcFvI1h1fQCXHJ01Th8otQEOOX/gicnwk/CzWc85ff47vcu4vqb7qB2DutLvLJ4bdGqMayMwKa9IpAwLC3dZbuzUDvu3bZAZ91ePPykR9BdtZLv376BXtFly7w0nswSw2KvR2YCmarpb9rMHtNtluWG/Vav5qgD9ueQffZQczkUBtqpCNSpgljbB8umZzjmqKO54/a7CUrTKysq51FJKsXaDuphidKBLE1QbqKzvG4AHErcNWfRBB59+mmcfNKxyjtQieR8nSNW7zppEGuEqFybhOCh3Uq45CfXh698+RsszPdZvnJ3+oMSD1S2JkkT+v0BdnEbq1etYGZmlj/5o+fTaUM5cHRaghZ0fiKQFZaGrzXQMM01vxmlDuLbp9uasvSkmSYvoBxCoQPPf87Tuej7F3LPtiFKGYoikyayXjgcPYoQFOWwYmrZND/44Y/4zjnnhjOf+ng1qBwGybMGJ3yzGj9i44CA84okhac/42nq+xf9MFz840uF4FqZqIE1zgayIgWdEJSQBFS1o9vtorVmcXGRVpEyP7+VbpFTFCkv+qMXsmbPZUJh+Gvy4gRI55d0TWlAK3Vdj7qxeCfk5hpP5St6gyEBSdfsiKaUMUaY7jiUUtLtO47xP8cyxduKosioq1KqClTAeWl2XZWQG9DNhMpFx8JZByT2qiS8FYLfrnbul5tBpZTUU0EkGTW42uJtYNCryFMlHoOBV/x/f6r+7CV/Qmo8szMthv35+7nohOCMUHPN0smbLAxXPoyyrxKK9aMd0Ol0xNtUinHTTENZB3qDmsopaqewXlPHfzevykpNhov9jibfU1koLSidoVUmuQaVCDOJTkHJq9WeIi+6qikb6c4kbJ4PvPu9Z4d///yXuGfDZjozc1iv6Q1KjDEjwmqD9NGqygFTnYK/ftUrefQjT1bddo53Q7JExeJlJcijIPOlIBZVIpyaCKT78EPXqje+4TUceMDeKByD3jacK2m3hYC11+sRvKLTnqIouswvDHAorrzqWv7ni14c+mXFQq/GBpiZmXrQvTG5m5QOaAXR14Qg+d8xM8K4yah8vzOaNUa5up0RA/x3jIYc3GjYe6891WGHHUJVDsgTQznsExBGiIa7snae2mtqEiqdotpzbOh5qnyaNUefxD5HnMBmn3PtfT222oRNWxaZylvsNjVNW0FeDmhXQ1bnhgNXzXDKYfvyoqc9gRc/4xT1iMP3UGu7sLKAOQPJ0NM14PoWN7AkSBeDxz76MdJHsNMlSXPa3SmSPKOqpDGyiR0y8Jbgxi2otAGlA95WuKok+IoD99+P33vyE2kXguBzTs5XkkawhXeSQ/GeotUSYFgMo33ik5/m5ptvRacZZVVhgxcaPFvj8WjjWbF8ls0b7+Gpv/dEDj7oAJUZaEcF1+v3RhERIpRl3LxIlJ9WjLxJlJPfKYdWcn4EImxREeSVp5AmgYcecbA65mFHEryl1xMjQ4A31agUommntXnbVrZt28bHP/kpti6IB2uyROj3GAv3pr1OmqlRRGzNHrP8j+f8PloHdPCkRuPrSroyJEKWb4whzwvKsmR6pkuSaqyrMDpgqyGtIkMrz6mnPIKTTzpBGcTQSLNf/QA0Z0hq/8RgEV5jH6NpDU5DRVCIINuSLJdXLvnDJG2NXiYpRi/rlPTwdGrJa/QzNBZNHRTOq9ibTlFbqC2gMwalwztFkrVIkxbaCNl3GlmKJNI4obwm3X9B400qs0bwxHqQnWpgv+SltCRfXeXARvaDLEMbRbuTkWiohg45E4HnPffZ6pWv+HN685tYvnwqKrQwsVFjTiCiPb23gviJuYEdb0fuV3knghOpXVLxAA77PYbDPlVVUVWVIO6MxqQJSSb9jXSSiAcUXyMuM62X/Hz7l3RAiEgyH2i6TlsPNnish6ANOknpDUTob97m+Nd/+2j4yEc/zn2btzAzN8t9GzdiUk3eylA6kBcp5WABk2hmptt4W/Lav3kVZ57xJNVuZThbQhBewBGEOoCvpdEkxDxFAOc8VeWZ7hq8gwPX76He8rdvYN+91jAz3SE1ii1bNtHptFixYgXee/r9fuxMUeCd9I762c8u49V/85qgMCwsDnCAi52Gd7YuS0Bc22mjZn108DSd3EevuAcbhTdWdEuvvxQE/d83mkLegECYjzv2GLqtjASPCQFjFalLMN5gvIGQoXROVszS6i4nbc+yx7r9OeiwY1iz90GYbIb+0FDVGbnusHd7itbGzXDH7awYDDhoqs2Je6/h2aedyGtf+BRe9Pij1dF7FmoOWG5gyoDxDsq+NFsFWqkiz5JR3vahRz5EHXXUUWzcuJGFhQXxUKyci3aW0s4ydKgp+z3wFm8rIQ0IHpzFuiGJCczNTPP7z3g6hxy0ryqHQuTsnR0ngpyDCcb6ZlgL3/rm98P5538PW3uyrKCuxx1GUBbvK2GwTxWHHXoQz3/uH6gENzLAvYduuxPz7k1PQ4CGmTLEzvWWUQ3QBMkCsat9CI68yNAq0O8NUArSRGM0PP8Fz2X9+n3QKlAOBnJ2vEeFMGo4mmUZ/X6fNE352c9+xuc+97lQDolRnIhdYDLEFxMlSkKdVe04+ZQT1GmnnkSWisfnnQVvxfCL5SRVVQqp9mDAwrZtDPt9Zqe7EBwz3Q777rs3f/jc55CJfKe27teTj5NA0ChfGJzITR0jKkmq8a7Gump8FmJNZFNkb60bveraLnmpmI64v5dWCUpv/zJobZZ8nvd+tI+FaYZRnaZukrUwVnBSRhYZF0JAxU7UKC95uTAWXA/GUTjoD8eWTWyQCEIL5WrPoF/RyoVnrVUopjpw1pm/p97y5jfi7RAh94z3MfHSzWb2DhUi3diS/IyKFqQl+ErqnXwFoZaOwaGCYCFYklQJt6MR3rdhPRReNx03pff3+7JVhavr0ctbi7fCzyetgaKyjzk6gKDi98pT1yU2eLJMVuFjH/tYeNe73kV/OCBNUxYHiySpEsqfeoj3NRqHSUCrGlcP+bOX/DFnPPlJqttOqIcVWZKSJpl4NiCmjJkgj26UtJcNkWUaV4s3rYBDDjxAve2tb2K22yJNFIkGFRybN28kuJqZqalR2YaE62RNv3POubzyla8MdV3TPO0DIRfjGRr/JDSwgTFtjwq1BNaVgDdUkPoogoP4feOVLw1hPvC+/NVHPEFKSXimtLQLxfHHPlyt22stBEdqEpw32JBRq4xKp7gkJ7S66Kkp8rll7HvoIazbfz1Ty6bxoUaHiulWykxmSAcLzFR9Dpxu8ZhDDuAPH3kSL33mk/iLZ52onnjEbmqPDFU46ALtAMpW4CrpVt54MPVAavycJTiL1tBuF5xxxhmsWrWKdrstJAvakBCwwyGDbVugqphrt0kTQQQqYg+4IN7QdLfD6pW78YynP1W1cmKZ0RgQMNnFstkr0vUbBr2Kj3zkY9x37wbxEAOM0apDwBO8BRx1VfLHL3wBU50WWQynAjhr4/RHr50xuE1+NpFm0V5e268dEr53VQVaclyuli7iw2HJwx52qDrhuGNZMTcril55skSTGoX3lrIcMCz7tPOCInYgeM+738ttt91GWYKJHVq8AxVLnBoDzbma4C2Z0SybbfOsZz6DTrvA2xrlnSCWyyEqSA1vahTLls/i6pK5mSmKTDO/bROZgboacMLxx3DcMYcqo5rogtop6Os/O8aw/yDdZ5AzFxBD1FuLc3Ykl62rcFWNUooiGuUNDEjEkFryeiDZivdyPTt+eVfjooz1rsZVNVmiaWU5LnZ5TxNNoqAuJ1bbOekmkKbCSlKXQ3HnlTB6J8qhQk2ayOap6iGJVuQRVDLZzXo8OzLBRVE0RlPkaTTghKBYa2i1MykaD3IW6yow00147KNPU69/3avZbfky+r2F0eaqyx4GS131MTiKPBNmCcYosLq2eB+oKg+qBirqukfwJXkKzvYJfkiWeoyucbYPYYi3fVQoMarGJIHaDlChfsCXUS461PJqfk5UqmH0kkaOElKRvzEEssSwZdO9wXv4p38+O5x99vtZWNyGtRXOVyTaYrRlYX4jhCHTUxnOLuLdgOluiz94zjN5zrN+X81MiwDIswxbSS5L+ZjLbAxYgXtKo08HSiXSNNV6GpY0bwOdtuKQA9arf/rHv2flimXUlbDAdFqpGBaxMt7VFYnSlKX04FJK8cUvfpHXvva14brrb5K6yF9iNCTaIUASOx86FxkZwnhutXLRs5PwufcV1lYoFZAaYwmbhMjg6utfI7Rs+3uOh986Yd4p8gStoJUnnHTiscxv24RKExZJmDdtyvY0avkq2nutZdn+e7PykH1YffA6mFLUWZ+gt5GZrXSSeXZr9ThwpeaEg3bjT888nVf9jzN42TOPU2ecsLt66O6o3RRMA9NBvibeo4IdWa4YI/T4BMhSUJ5B2UclCXUdmJ1t87CHHaX2WbcXzg5x5YBQlxjnSUOgnSS0tSJUQ0yweFeifE1wFUVmaKUGWw944Qv+kG5bnKI0E7k0oqpregF6YRtqgAdJAueff364/vprJXKCGwl8jcUo6cGolRgzDznsUB79yEepIktERsSi5qb2TgU9eo3y7aPvmbDy4kvFYGb8GhrGDA/KJBEdKAwm3sMfPPtZrN93b5wdYpTDRIXfKjISIyHPNDX0+4tordm8eTMf+MAHwmAwkI+PYETp86mEP9VbmqMhNbKB4084Rp188gnU1YDEBBLlxVgJNUWaYOsSWw7Js4RyuIjRnjzVGB046MD9ecmL/0RFciTSROOt+5Wo9ZpRVSLHsyxjYWEbrq5IjSYJ0tvN2yFGS/00viLRHqM93taRc3VIsENw5ZKX8tWSlw71ktfo596ivcUEhwmOBE8a9VKqPAkOXw1JVCDVAVf2JYqC6COtIPHek6bSMbq3WLM4v43dVsySZm0q60iLHJ0ZfJxB7zJSM82yuRkGiwt08un/8gQ2xraJ6KMQwNVDsqzFimVdTnnECarXq8MnP/3v3H777RRFwfKZlYQQ6C0qut02C/PzLJudZvfVgvwLboosMvwnWrFp4wZmZtskWg5bliuytEAnhrIsaU0VNLVzO34d12fd39BaP+DvhV0loqyW1KZ4Qa5hsbbkvHPPC1/68udRBNav34feQp92t8OgLGl12gQnFDrKB4q0zbLZOQ4++EBe9MIXqN1XdXCVCJQk17igwGoI99sucHx/GmxlJXeoxdLSwOx0zoHr91V/8dKXhH/72Ce48YabybKMZVMttJZOE91uG+ccM2WB9zXLig512eaiiy5i99Wrwqv+8uWqyPIl87mzkSTSCap2NVVtWTY3w9o9d6dX1pg8xSPlIdKxOlqoQTza2Zkp+osLtPOEJNEEH7BWchs6Vb9WCPVO790k1LaWchptmJttc9ghB3HYIQeyqVexZvU++KJNmhUkrZSklVN0ClrdDnkroygKOu0WK+Zm2W3ZHKtX7MbqFctZOZeouQxcD6YyyRU1UdrESL4p+DoizWJYTIFvkKjxq6ulmWZS5KL4cSQqYd3eK3n2s57OXf/0LoTX00gqITgSwMQ+h6WOdHtaPIRh2UfnCYcffiinn3qKasKHo4BQmDxDoLRBKSvNVHXCvRu38Nl//zRpojnyiEPpDUtQJjYI1oRY74oOmOD50z/+E1bMdYjOFniwtSeZRO2OGHG2R1E2PQSb3+nxe8LkzxmFFLZHYe6/30r1uEedHua3bmJ+fl4I1p0jyzJcLt6ZiV5zu8jZtmUzV15xBRdeeGF4/GMfrVKz3QW3G9458sSQTuWcevKJXHHZFWzYuJWyrFi31x70h71YV6aWfFXRS0uM4gmPezS7r55CA+XAQib5QpTnV3XmskxT14Etm+5jqttlZqqLSSVUmOaFNFNuvGkdsRxh3JpMjwBhguK/v69x82z3FYih7p2+YtSnKh2Kkm6R0cqnGC4u4B0U0fBSdSmdXj0Bo6WFy8WXXBrm5lbgPAzsUMiBFSTagHfYumTF3KzaZ+/dR20PJpYt3pynaWkBYy9ve+vC+xoPUk+iBFmlMCSJxgEDC9ffcHsgTmZZliilsFVNp5XLwfA1xigOOmC96BTlR8ply3yPy6+4Mkx1urF41WA9dLtdhsMhbhQqkRMkVp7cu6gl1cR0/9PDR6RgUBNKbmRhinuVGNh733VqOOhx36aNoZ13VFnb0FvoMz07o/rDXsiyTGrcgsToq6qiXbTU2j3W0G7JxlpYqGi3MhIDVeXIMrNkOe53GAkdJ0mCSTVVJUn1NBHBU1q45vpbAkG6idvaj0JPTWPW3VYsU/Pzm8Ow32PZ8mk17PeCJqiDD9l/lDNpFO5o+ZXcXAgOJQVwlGVNkbe5884NbNvaw6Q5vWoo6IHQKDkt+VXlIVjSVKlDDlo/3oMRY2StIOZ+9YhNE2LW45ufQHlpjRD7ek9Velqtgvs2DrjiiquDIqU7NQs6AZPgUqQMIk8wWYpONXPTbWW0oMBaBgolBdsqdmVvkueANHQlkDWdK4IdI3YjsKWpEWtu1btakJJa/mYwLDFpjjGazdtK7rhzQ0A1HJGKhKBM8CTBgVb0vQsk0oUbpMt9orTSGvbfbw3exzrMKJca4RsDdcLon7exzlLXjlaRc+VVNzI7u4yNm7eGPC+UsNU0ocXYYFYJAGn/dXuQKulmnUd7qTFcmo4qsKNckTlhxAU7Ep3bKbedlRdMrrzSsGWb4/rrrw9ZljE1M6v6/X5o6LH6/T55mrDYW2Cm2yFNtBr2F8Pq1avVqlXLRuHVZj4mUyoBqRscljXGpJS158Ybbw4+aOn0HdlhJL0h9aEaaWdk4nwN+30ectjBKsuEJLrVSggE8AFlILhfvoRnZ8NaD0qRpoof/PCnQSXCFVrX0m2e7evYJpQcSFcEeVgt57wp/8KM5Oz9fo3XDSHgCOO8YPwKniLLqMsSjScxisXFRY566BGq1S6kvCBPUSHmM4alQGVNkmJrYbx2DkwKtcgTjBH3T8W8ra0Fvrnj1kCsiImizAdScrrJESkFCmpnI31XSkBjPRQpDIfS2qfblckso3VnkM3onDyoMQ33nKHXL/EopjrSTTcEGA5lM1ghLdjZ3UNz5xO5x6Yg+T/zdYmM3f4gCiCJhcUB3W4LBZRRQSmg1/O0OiKw7MTPAcqh8Nx5K9yBIYZygoOytBSRUkk/iCWJgaqsSdMUpSVhLZ2LM4yBxaEUp+aFwNGdgyw2QK4qSBJiyYU8i9Yyb9YCwZGMNszOlZxwh0r18GBY0io6DIcW3TCIp81CjEPiYWIvNWEfW9d470mNgJpcHefjgZ/+lxhRyU16oqMpFTRimhmUSnA+QDAjCH2iID6a2DdAreTl1PjqCqnnMgGKeMZjqR9Wl3gtCs17T6oNSaQXE49Wj0pspEeaHnkpQGTt8GRGC8Ft5WJnhgQikrrZozrehw7xvoEK0M0RD+MczWDgqcsB09OdJVOidrAqpOgXBcOBGFB5bgTUyPh6vgnrMf5eA17asxF1Ct7KmktHbkeWb9fTcGJMKrn/6hhWgaJQYyCDgn6f0XnTGrJM8m4ueg9BUpdUlQjZyfkZKbpGiGuNdUKRaAWnw7CSa26br+l00hFDCET5q7YDCAJbt/aYmenIGa4ddTmk3en8Gow8RnVpVRVIUqmdripZk5Hd1zhe8fvRGfXj3y25plr6vgcak9SAwbOETCI0+zXE+/GM58tJyYga9gekmZH2FwgsM0k0dXwIr4RWqqkprEtHaqTti0DK4odNWLdLv9dL6sR3UHZKXnVdSRigEO/MBY9C2ELqehzbTqIubDAsSsXO5AqcD1IcTdOSPiGJjCO2ClgvtW917SJriB31uRrZWtstiGo6HbBzp9povdOfjyIgjeXWeHDbeQNCSC2/GwxKah/otAtBXlUxTBUaeqExSzlBWhs1U+6cxxg9oiRTCsqhJU+TCYNjx9GUvoyU/cT9+XgtH+Tfzsn8GBM3pxaocr9XkWYJRaoZDgXRWRRRqTVNYR/Ak7OuIs9ymDCKCKIoG/b+piB8FFaKITIfhAW9KIoRCMZoPbr3X13LTaqAZk2b31lZD1/H/KPGWlBobA06OFJtQTtQJrLfaJzSTaFEo8siOhNB7qFGBoOjBEJk8wnxTjSB2IpEJRP3N9F5rTG2dGzcq4VvstnvVVVh0ozglzav0UGWy4QY18gUQytIwXYhD764WNLt5sIp2GjpnYzmjPf7QzrdAgIMhzVFK2VxoUd3ujMCLTUCY3uZHFwgy0RTlTHqlKQKW4vA3V6Ib08KPpJD/5l9MPE8WolRjFbxrKYiFyfe7r3cZ6IVzouRWOTZ6Axtf18CpItyyVqpG9aCtEwSw6CqKHLJDYoSCEuiSaNSGQQg02nl0rIoEcLkJDXUlR2hD3+V4VwgSRTDYS38ql7so0bJR/zPjtKliZCpHT9/Uun9MkpuRO6uxt83Vw3Rm69LkTNZkjDoLY7kATpBhYhSE+2osF5htGE4lCaAioD30vFbETdVDJ0550izbLubWarkGuF6f0rOO4dOJZtcVRU6iYWFcVcO+iVaKYoiHz1kVVnwsVAygI33I+5pjtaStxHGAdlotW2KFqMAjMo1OD8Rtth+QfzE153l7MZhhPv9/cgKSEazMFKCKrrzWuFq4egDKdqtKk+rtfRegREnnrBRyL/L4RCCJs/z+OaJDRKLee9PyYXGGwpjQNzYOwrYWpRrXpiRQTIsBT2VZMmSq9a2Fr69OGXz8wtMTXUe1JOzrqIhHRDWcUPWmO6qKUMwS8JNo8vEXJHkjIBYPCBGwq+D8eHBlVxtS6QLdUYIktsaHWQ7AKwoOa1iODxBFJLChoDWY48qLPk0gHoUNgekuD5aYlonYoFsv7YTeqOOQiBVUQAmgArC+5iI0Jpk+W8S9pOjrKX1ZLMkVW3JUumi3oTtdjrC0u04GFS02lFeKE9vcZFOtzu+Z0V8tskFnriPYUVeZDjrcS6Q5WbnSm7CUxopuvsRpjuEL4FJFaa0ZnFhge6U1H0KQIVIVB0o8pThUGrZ0rQJHTiCV8K/22kjYJid3CeMOvL2ewPa3ZbQemmwThS6Qi3VBHHtG2b+7SM1iws9ulPiXdeV3aHv5n92ODc2JkbiUQlAzXsvrDYwXr9mxD9o5NX9yccH/TqxgZpnnpzKuhY9JdETSbn5ukab2FFcGVFyzlYMygFZlqGUJk1ynJdiYYWEFKXfmhal1jytbczleBONdT6pqSfhuux4gITTzYwu6WPRuUeUaJHJIWr6B2VpIV5nVGqNknXejZBd3ksvJmFmEBu4EdzBS/NVFaSbQRKbkt7fOVC6cVd3vggy8Q+k5GLcJ0QWyZAsPVQaOZRevJCqsqRJQZIKeWmiJSwlJJRa4jURpVOVA4mLey/0JvHZq6rC+kCR5ROd08eHfnKnTKK/rPVjarTYRdkkEn/0tbDNJ02uD8+wEgNE2A4QTxMjG0+nqETu/YGUHAhEWmuF0VH4R0Soc44kjaI/SM2hCnqpTFdQVQMxcipHuztF8OPC5O10/n9hPHi4UulIdaUMhERaMBG7YGQTiituJQXjkq1GpsfElg9NDzr5K0MWw+bbPXQMne3o+ix9mxNjFl+DxqOUB1/JzWgtOWmtCSQxLya1Ws05rWtHlqUoJKwteWFIswzvxjD9sVG73e24WMHg4hZVsLhtiwhioxh1lg/NA2mWJNKUorZ2dLa1Mdi6xqQp3ruRkTkynkdrNmGUyF/udJ6WRF7UhJJsrhNBDioqC1/X2ODRKsGkSeysEH/nHLasyFr56PNG4bUJcMzksLVDp1KKY1JNbQegRUa18nxifVX8+yaioeL61DgbKDotQEK4Td1muhNP9z87VJDnck7Q61VVkeSJMChpja8j2cEoAuRHfyfyLRm103rQHNxOvk7WWAoaVow6H3+WpuMOOOVwSJoaQmxE29QpqzK2i2+G8w7vxEo0xlBXQ9Im+x1bosTYILI9tidI3Z4MdefhytEkalloQGiF4huah5PmqpnEXJo4nAsj6dwoSUlw5yJ0ouBtNHs5jJ6okmfQTf+JBtK5kzEWxr/KLpGi1PHkxHDchMCytgQ8SVawJCmBxPk1jIVg8NiyQicKHRnKg61igbqhKkuSNB3VryklCy5j50quCes109F4dcFGh6NZPBfjWInCWTuq9TO6aaMUjZFKiGiVgmpQkhbp0s8fzavMTwP798GikE0pPceae6oZxUYn5i5E5ey9QydqPKcKFheGdLvFr1HJ6aXegBr/rrHxqnoogi96aUpBaQMkksOI7RdJmpkIE9cLzf98VD5hLCX8RGys0QON3TU6VDu7t3hpJWtclTWtIgXtpYAoNXHxTWzuHsOdE+g1FQQ92nhQzdcwQfGkI6Blcl8tOf9eQtpVpM4KrkanhrK/SN4uJm403vyoFGD8PC42WA2RP9NaS9FuUZblyJP8zyq5+4XXLznvHlvXJHlO1etLlCnPo8YWQ9s74v6TAugkGptlLBBXJn1AJYdGzlaiGPT7tDqC9naRWcSo6MOPJjXKwO3+7atYTB+FvoqRjV91/yslbZNMEmmORTngrTRKVTphiSYdpWeIi9GcnaXKK8RD8WAAlCWEIzHE2zx7ALRSlFVFq8hE3kfP1la1GN8elG96xewwmk2xvZAfL9aDoZNG96YeYFM96NiZkvnV4sy/+uf/58dYDu3s3v39/Hzi75fMt18i1+5//HfM04PNx3/2M3e+v3b++/u79oPP33/fuP/7H+kwtb0QfmAhu8QZux/O1snr3t/52mnrou3uNyx57y+pCB5kTCq8nYuGHffQpEc1aQT+14DNv679MBG25P7Om+aBz8Sveh4eaPzqz3h/vJHN2J6NaOmQed5+Ty25/uhf/7VI2NKx9HkfbP+PnsHb/7L22TV2jV1j19g1fovHr6bk/vs//9cx/l+Zv7vGrrFr7Bq7xq7x3z52KbldY9fYNXaNXeN3duxScrvGrrFr7Bq7xu/s2KXkdo1dY9fYNXaN39mxS8ntGrvGrrFr7Bq/s2OXkts1do1dY9fYNX5nx6/G+bJr7Bq7xq6xa/w/G/83IPi/7PhNupfJscuT2zV2jV1j19g1fmfHLiW3a+wau8ausWv8zo5dSm7X2DV2jV1j1/idHbuU3K6xa+wau8au8Ts7dim5XWPX2DV2jV3jd3bsUnK7xq6xa+wau8bv7PitKiGYbGjYtK3ZWXv77XmzR+3Td4JwVfjtWmj88nr/l2shtLSf2/hn23+/4+fvtFXKks978DZES/u37exvJprahvu75o7XXTr8Dq2EltymGl978pHuv/XQxJ/GNZ+83njed/63kx3qH6hVTXP9/1w7l52t5/afHz8b6Yslc7OTeWH7vTrRu24n9/ngbYm2f//Onm18/6NWJTu9j/v7jAd//v9b45dttXL/Y3wO//P74FdtIfbfN+5/Xpaua2g6xW4/VPiNfK7/6vh/v1MfZKgwfkmnXnkpPCEKP6VhYVCOmm/7ID9zzuE8WBdQumnQGqhrJ70GvQXvCK5EhRqFR6mAtX50DaXBWulerBQoI/uisjU+BGpnUQasd/K7IB3NifdlQ4ky8u+yslhboQyjppPS6r5CGYcyDusCVS09YpUe99Zc8mqEuPJy71QoVaOUAzxKQ1U6aZyIzIn02XQ47aVJpgar5D1lPaSsh3KfBoK2BGp8KHG2j4rv87FRZx2bk7s4r9WwD1o+dzAYjNbEx/6XtZU5wlsINWhPNejHua3G8xyfuellq3yITSUtrh7gQ4UyHrRjUPZH81pVVtZGQ384kH0Rn6t5n3MuNpIFV9W4qpY9EALKy6FWXp4xhHEPT+flZb3MwbDsj+5X+SDNZeUWpZG1gcX+Ako7PBXBlaLklezDZl/5ML62MsQGlAGPw/pa7t/J3AyG47WxVR9b9eP+rmUfxV67vulZp4gdMwE37rGpNKPruHjjzf30+z7ul4D1ddyLA1yw8f1+9O+g/OhnPsi6NWuuNNTOUrtqYn2q2EEder0ezrkl5wrkPDRntqm3staC83E/BMqyxAU/uofmPpr9pcx4jmsb52W7V9ONXjWvIPfSnJvBYq/px0w1qET5x3tQWq5b1W60hrX11NaPPz/KAaWhLMs4l1DZUszpOEfN2gegqr3sAw1V7WQujaxFs7YhQFnW8V5lhND0vVW44NGJEnmkFcNqIGdOB1lrHVBGGrzqeD/aKLyGMgScNLWnX9X4oNCJwtpqtG+qqhqtWbMezVo1r9/U8RvfT26pRWFlxbVYYF5pqjqQ5IamAbaKXZMNYIwI88VBRZ5k8r2Lwsg7tPZA7PKrINQOZfKRVBgMLK1WgrN+1G07KDBm1O87brRA8J40NSNT3VlPZUuKVgIoVEhiF26ROq7Wcl2jSFIPqiKgcHWBkT/BWiYbr48aRotn5EHJhgaPLUt0kuGdIUlTeU4tB9uGqDR0VHSulutpDV6RJqk0HicQnMeHCqMU2hjAU/aHaNNC6QyTyMEyzWFzNd7V6CwD5/BkqEThA5Q1ZGns6a1gOOiRKjB5DkA9rAgqJclTrBX7Jc/k+rZ2ZJnBDockrQRXVZg8oz8cUBQFilQOfdDkqcFW0uI8ycEBg6pPKyvQyDzjA957sjQduy1Nd+3J5sPxd82PfECe2YLSXvZMaLolF3KN2E291/e0p3S0l2vAoi2U/ZqiO01VB9JMMawgTWU9TADrPNVwQLvbirs8SJf0eHvOB/CWRIEetXoWC8I50BPxmNF52a5zePBgnShLrTXOa4I3aKVwDrKs2begdI33Q9I0o641aexC773HuZoQxFBstTqjztPlEKyzJIkmTXVUWHbkSZtEY2tHEs9a02Xc1m4kMJMkIYRAkiRiFFgHaJJUjdZCK+gPS5RSpGmKc44sS6LhqkiNlr0eDSU/noI4PxNedvMbF/9Am9EbF7f16M505HNrx7CuaLdbMpeBJe6BtVBXQ4wxZFmK9wGNikqxHt2nteLZZ5mRddPyau5X5IPsBzHIFMErrLW0Wulofay15EUycsGjvcygHNJqFSgFde1EHiHn2ltHCA7vHD4EsqwAY3DxGqUV2djOZTtXZY1GEYKcG601WZ6KjxHXK80SvPvN1h/wW+DJjT0Xonba7g1GiyDSUNcy4XJAxFIdVgGTpJgUbC0byhjQiRHL12TgPMPFPtZ6nAtYC8NhIE1lEfXIuwgjDwyg1yvF4qssaWrkb2tH8HKoW62cwXBI5T3DEoalWGyN9Z0VcoCd91S1FQ/SQ1lCXYFKRLE1rx2HxjtR+GXt0FoUXFWJhV1ZqCrZtFqL54VX5ElBlhQolRKCHATvoRw6jDYkpsD7ONlBETykWYb3gaqKhxzxFkOIyjAEHCpalbDQE8FpJ7y+PGth0oLGlVQmJcvT6FGBTqPF3TyrCyR5ga8DJmvjPSwuDgmk2AB5npLnBg9YD/3+kIX5IWXlyLI2HoVzgcFgQJIasjzFVjW4QNkbYKtqYqON904jIJ2TeakrERp1LUK3ritctMoxMOgHvIN2W7O4IAbEQq+PJkWZFGV0NFosIUCWQ6/vqCr5jCTR5Hkuyj3uQYD+cMjmrQsYrTBmwtrxHl/X1FWFj+5bOYTh0I3WxddWJmW0XSe6XKuExCQkiUIl0WtwsLAgnpUxKUonomqNCNeyFK8xSTKyrEDrRAyXUjz7rIB2JyHL9UQEIkEbjdKaug4j78U55PoBNm/Zxj333keW5ySpEcEZoLYBHxRKK6yFqgpUpdxfluUURQZGEbSoqxCCGKLAYq9HiJ7R/Q8xEmxtIU2oKot14jkNS0d3psOgXzNYHKJTM1Jw3kNVuSgjLPPzfZIEirwgMelITtR1CUCapiws9tFG9l9WmFGEoKwCg6HMS13D4uIAgLquo7LXpKkiSRKqyrO4OEQbSFKxaspK5EVde7SGVquQPQvo1DDf64sCRaGUIU1z8rxNkhQYbej3a/o9hw+QJY3clP1O0KRZQpanJIl8tTECpo1CKSXG42/B+I335JoxyseFJjyjCUrznXO/Gy678ipGuSDr8K4m1BVaa1asXsUBBx3Ivvvup3ZftVySkB5qK54CviYEh0oSvA9893s/CBd+/yL2XLM3f/AHz1JKWbLEgBLvzfuAMYph6fjFL37B1772tTA1NcVZTztTLV8xC1GJGaNABwKeuzds4qtf/FbYvHkzj3vcqTzkIQ9RCoMehQAtWjsccMH5Pwvnf+8HHHDgvpx55lNVlqj43HpspTexdmUJwaGNwdY1Jsno9yxf+vLXwubN8ywu9EjTVCxCI6HYVjtj9913Z59992WPPfZQRVbQ6WTgxHPtduQAVWVNmimCrVFJSlUHPv+FL4e777qPk046iSOPPFxpBUmCmIAhSEjLJZzz3e+Ha669gXX77MPjHnO6ahVQl448MyigHg7FWk8SFvsVX//mt0NVVZx++ulqxYo5ZOoCWitc5TGZZliJ5e8RATi/bYFLL708XHHZFdx+621s2bSVrEjZfc1qDjn8EI448gi1Zs0apts5tnbgJaSSmQTMhKXkEaURhSRGEYKEvax1/PvnvhQ2b97MgQfuz6MffYpKEi2esFcEpUmUGFm9XuDTn/lM2LDpPk48+ThOOOEYFbwlCR5jEpociAsSGvzgBz8YevPbePpZT1P77LsXeZaOFGHlA9def1345je+zbJlyzjrrLPUbLeDwpMkmuA9wSt0It7eLbfdy8c//vEQQuAFz32e2nPNilFs20WjrNmPLliUMqgYIhiU8O1vnRtuvO4G5pbN8rjHPlLtuXY3wFLXDq3ykZeRpGLQ3XXXXXzqk58Jg8GQojVFv1eitaYoCpy3OBztvCAvDMF5ksRQFAXPfvazVbudUZaOPDdcfvlV4VWvehVVVfG6172O448/XmWZWeLVAGzZOuCWW24JV111Fddccw133H0Hy5YtY+Wq3TjssMM44ID91Pq998EYhW08mADz2xboTk8tyTmOPbk4tKYqa0Dz5a98Ndx6662c9IhTOPbYh6q6kkhE4wk7Hx0+DTf94lY+//nPB2MML3zhC9XsdJeqcmR59J6cQyeG+zZu5bOf+3xY2LYN7z3eieIDaLVaOOdYXFzE1iVr1uzBc5/7XJUXRsKDcZ3quuZTn/pUuOWWW5ibW8YLX/hC1Wq10EmMSMewpUmh16v4/g8uDNdddx1aax736MeqPfbYg6lOTlVbzjvn/PDDiy6i251iaB2t9jRb5xfIWwXeOvAO7R3elWzetJG6LjnllFN45jOfqZrwZJomOOcxif6t8OR+44Enoyls8gpNOCnGqgdlxRe/+GU2btzM6tWr2bJxE8FbWmlCVdeU3pIVBctmloUXPP/5PPkJT1QrlrfRLoYmTIp3AaM0Sisu//mVfOwTn+KIhxzN055+Ft1Cpsh5EboKUXZ1bbn33g3h3e9+D+vW7cUpp5zC8t1mJQ6OhBiCEotqWNWcc/53uf766zno4PU85KFHUNeBBCWCzXkyrfHOcd11N/D5z3+Bkx5xPE9+8hPJknyk3NT2kxK0eEnWk6Q5Ac2w6vOZz32e6669EdAoHxgO+6RZQqfTonJDBoMB07MzrFmzNjz795/DcceeoNbvs5JOJ4nhKrHmgw9gAkolLC5s45vf+DaXXn4VM3PLOeKIw8lyqCuLSQLaGAwJZW255Cc/4dOf/SLLly9n1W67hROOP1zluaEainALymA9JAHQCf/2kY+xsLDA4Uc8JKxePadcHUZhMJNp6ipIaMtDf2i5+uqrwwfe/0GuvvIabFWRZRmD3gClIL0y4xOf+SzdmW447viH86cv/J889IhDFUHuFa0o+8NRCCnNsh3AIDLZIgzvvPNuPvWZz3DEQw/nuOOPYXa2C9pgjBYL3Eo4894NG3j/Bz+EtRW/uPUWTjrxGCqr8bai1c6wzqNjjPdnl14aPvvZT9NttXn+8/6Q1ETDIj6LAm668RY+8vGPc9hhh/G4xz2euakuBLEnQE+ELWHLli3ha1/7BlVVcdZTnwZrVkiu0EhEoSpLdJKgUNFbrNGJQSuJbnzgA2dz5ZVXs8ceq1m9emVYs/Z0FZBnDDZG8SSeTTUsueeuu8Nll13G3XdvYDC0ElouulRVxeYtG2l1CpbNzlHVAxLtMUoxMzPDySefzN57702eN9EDz7Zt27jlllswxohX7huPQkJkd929kfe+/+zw9a9/HesqkiQhb2UsLCxgbUWWpaRJEv70j/+IM888U83OTMnR8J7pmSl8WAp2Gh8hWYu6rMnylA0btnDV1dfyuc99gQt+eDFvfcvbOfTgvXAOgpfwXJYno1Dl3XffEz71qU+zatUqnvGMZzI720XFUKnWIqis9ZS15Rvf+jZX/vwKVq/eA+ccdV1TVRVFUWBthXOO2ekuxx77cOYXF1hRzKITg7OBEBxBKbKi4Fvf+Q7lsKbV7oazzjpLzS7vyr6pY9jTwtatW3nd699AXdc85lGPZs81e9Fuy3wPBxU33Xgz5513PlVl6ZUVSqfoJKOyNeVgyIpls4S6ptvJxb1XgfXr19Pv92m32yJ/JyZUqZ3N7sQ8/wbk6n7jlRwQ8yZj1zjEUINXML9tkY2bt7B2r3W8+tWvJk8zvK3xVcm9G+9l62KPy35+OV/50pf56Mc+RrczHc562mOVSWFhvs/UdBvrHLX1pHmGThNMmuAJpGkqnooCW0tsvUnBGGOw1pKmKYuLPZIkkTh7XPMkSQgKFgcDOu0p0iTH1p40zdFKE7yE5yTpAoNyADolLXKSNEebFBBk3gMhnRSGYVnSTjJqD0lWsLDYB2U46qiH8aTHPRYVkTshOAbVgLvvvpOfXXY5V115DW976zs444ynhOf9jz9U+++/OxCtdoOELIPGB0+SZdTeMaxKOYBA7cTY0DoFJMzWaiUYk7J16zybNm/lH9/5TrR+eTju2MNUVhiq0pOkEtapbCDLNfO9RRZ6fVyI+apEoTXUpUWRkOaKXs+hM8NnP/eF8PGPf5J77ryL9evX88jTTueA/fZj91WrqWzNHXfdxaWXX8aPf/oTLvje92mbhL9+1V+yetVK0hjmMcagU3kRQGmNCoGglcy3kryVSRWPffzj+eznPs+ll17KlVdfFx52zJFKqRCT+mI9Ww8X/OD7YTAcMhxWXHHV9fzsslvCUQ/dW+mkLeukFIPS4VGcc845zM/P8+hHnsaee64CJAfpak8Qpw/QBK/YtrVHVrRRRhGchGa1lpzncFDjMUxNz6qi1QnOQ3tqmtrBcNBnqtOO58XhvcYYQwgBYwzGyDr/8Ic/DDfccAOHHXYY1113Dd///vc57bRTSDNNlmjZ7ApsLV5kURQccsgh6sUvfnFQKkHpDLRhy+YFvvzVr/G9753PsQ8/kWc965lMTbcxwWJrMazWrVuHiYp+cXHImjVr1NzcXJifn6fb7VKW4ikURUKWabZsHfDe958dPvu5z7F69Woe+4THcdjBhzC3Yo7+wiImUVx99ZX88Ic/YGp2hrm5OYyGwaBHv9dj+YoVO8JZJ0ZQSHjfwuzcHDrN6A1KLr3sCt769reHv/7rV3HgvmuVMVpChBrqKqC8QmFEB2Bot2We01T2j/fgnSMojVKG+W19ZmZX8KcveSnr1q1Do+j1eqAkzJgkCe0io9vtsGLFrKQ9nCVL85FR/8xnPkNt3TIfPvShD/HP73o303PLwjOe8XtqWEn4uyoFCPS3b35LuO+++zj99NP5w+c9nzw3lCV4V9Pttnnyk5+sDjz4oGCtZ3FYkqQFd997H+97/9lkScob3/hG1u6+O9VwQPAV7U5LtdsFrVZrLIuJKRcb8/q/4eM3X8mpMdKtGZNIw7zdIc8KlDIceujham4mxShII+Ci8vDoex9HK2+Hz37q03z605/h5JNOYuXKDlPTbcqqJssKCekhCfHhoKKuLdosvRWtJfEbAihJ7OHRbFtYIEmS0Xuam/be0Wq1me9vZX5xkd6gz6Aq8UBaSM5MKUjSjASNC4HhoGJhocdwWEqiunn07Q7rKE8Z8zXOBepakF9JlpO12hx//PE84xlPUmkin9XvD8laGVmmuf76W/jxj38SPnj2h/nmN7+J1kl40YteqPbac3aEovQBktTQ6w2oKxe9ACcJfSdK2mTy3CEohmVJkhVU1qFNSpYnXHTRxXzkIx+h2/mT8JBD1yulI3RdQVCKTVsGpHlBWlqqylKWJUUmwBSTapyFwTCQFob/OOeC8IUvfImt2+Y56xnP5EUvfIHac485fIA0nrVB9RCe+OTHccnPLg+f+tQneMpTnsLqVSsjOs1SFAk6hosGi31ajSKI1kkIEXqtFMbAnnuuVQcedEi4+Mc/5NvfOYfDjziMbienrMXlUEExGFrOPf88vNKs3mNPFhd7fOPr3+bgA/6YdgZlVZLlOYUxXH/jbVz4/e+htebEE09kYWFAkaek2pC0C0DyT3XlUEqiAJKn9eSpRse5U0BRiNFV1zVbtmyhqirJmxmYmmrHjeO2O1ACJPHApk2LvOd976XVafPHf/InfOjDZ3PRxZdw8U9+Gk466eGC4XLiqaZaEm1JopmemeK44x+u0iRjWAaKtmI4gMt+fnmo65rZ5cs45riHq6kpqAaeVq5HZ8OKM40yhnvvuy/84tZbOeCAA1i5erUyqSjfZqvfcMMN4Rvf+haDsualf/5yHv3YR6mpjvzeWrneqac+gqc85SmsWrkbzjmqsqLVao2E8v0ZiM350RpSA/dsWGBY1iRFgastl11xDWd/6MP85Z+/hL3WrsQ5+UyjFRiofaD2jn45pKxrer2KNE1IEwGoJWkqGDmTUlkxbh561NHsv/9alSWSlwTBB5QVuLoaoaGVUeRGzkBZSlqldvA/nvdcdc31N4Rvfus7fPhfP8K6vfcND33oYWpxIPv/797xD+H7F/6QI488mle96n+p9evXEmoBOZlc9vzue6xmdtmcSpIMkwsu4Zbb7uWDH/5QGPQsBx10kNpn7bKRzAmBEQhGaYmGeO/lfCR60vf4jR2/0Wq4CUk+0Oj3+2idUNWOopWOLNQ6elUmgTVrlnHU0Q/DpBmbt25BJwmDgWyoNEnxQVHVkhPTiSHJM4JSI4gujC2WJl/QaF3x4AJJkhKCABScCyMgQ+0cw+GQTqfDsmXLqStLfzCMfzt+DhfEm9RJQpIk6CSLQhQeqHYthECaZxijyAsj4I8kZdPmrQRlRlD1NIOZ2YIs11gL++67N895zlnq7W9/O0opvva1r3D11VcHa8eAC1kE8EFhshRtUlwI47KECHkeDAZ47ymKgiSROciynN33WMO++63nm9/5Np/73Oe4d+MixkgOoRbAI51uC4JiYWEBZTTdKTnci/0eWms5oEYxP9/nk5/5NLfcdiuHH344f/EXf6GWr5yTdY5w7qoOpCnkOZxw/BHqH/7h79Sxxx6rQJLzjSdnrSNYT6vblj+MaxViXrEJsSgF09M5xx13HDMzs/zHf5zLhg0bAQkDGqNIUrj055eHG266id13353nP//5bNy4mW9+6xw2buxJqE8ZhrWABK655pqwceNG1q5dy6mnnqqmui3SLAGtRgJDa4XWCdZ6krgflNEQyyyGAyvKLUL3vYe81aY91cXZwHAoAIoqgkWMEUPIe3BW1m9hwXLTzbeEW2+9jfXr13PiiSeqhx39cDZsuI/vfPsceosCrvA+RGEXkcjK431NUWS44EhyOQei8wNBB7IsIc0ljNZq6VFuraoCLsKgW62Ur33ta2RZximnnMIee+w2AhzNzwsAY9PWLZRlybJlKzju+BNVkcszOy9nx3rZS7vvvjtFnmBSE0OAlkF/Ee/qUdh5pyMQvWtYvmKKQVnhApx40slMzcxy7vnf5d8+9tFw970b0YnII4eAROq6pt3uopSh05mi1cpIUxH6KmrWurYkSQZoyrImz1vKRjxQg6ysKvna6WS0WxlVbamtIxAErBVDuFkmuby//4d3qFNPPZUbbriRv33zW9iwcRu29nz+i18Ln/vilzAm5fWveyP77ruWugYvyBNCgMGwRGuYnm6R52NMgFISOWm3C4zR1HWzXqKJtVGUZRnPhCIvMkGR/hbk4+DXrOQmayZ+XbUT24d8m1AlSASzHFajGpqIYhdEYbSQ+gPJm9x7770Ritui08kFMYlcSmC8AWsDShlBlymDSsB6jw8+hnrk0Hsv1lFZ1oQgSKM67gyl5Hu0oA611iQmo6wdC70eSZZStIpoITGyXF3wZGlGXdf4eCh8hOuy5EUUOmFkYXnvlyhjW3u63SnanYIsk3t2ExtSaU+SynMf8/CHqBNPPIGqKvniF78ACBRcG0B5XCAKDo+1dhTyatZGYNPZSIhaCytWrMB5OOqoh/Ha176WdrvNJz7xCc4+++zQL4mHj1i/BkmWo0yCVjF3UFo67RbeW3qDISaDiy7+UbjlllvYY489eNlfvIzpGXmvScZ7JE3lsDYovjwTb9F6yDI98sRlDjS2rMdwSsaHXakgdVhBfvW0M5+itNYsLCzw8yuvDQt9AT95BHp96eWXsXVhK0898ymcevpp6uBDDuHeu+/h8st+HgC0STBas21hwHe/+11CCJx++umj0B0T52S0jonUGLSKNlVlCV6AQcYwiokLsheKTpter0ev1yPPc4xRVFUgK1K8tyRpirVWSgdcIATJz/zv//2PbNu2jd97ytPI24annPk09t5nPed997tcf+ONQScI+Mh5VAoh1FTVIEY4LEoHTCKKV8caQvBYW2GtKKLJrauUrANAv1/y3Of+oXrHO97OWWedKY5DCFSVZ3q6xWBQMzc3R5rnDKsBX/v6V4IPMBwK+lj2+hic0nhG1lqqqqIVQ4gyUfev6BolMhj4kXxYu3Ytb3rTmwhe8ZnPfo5vfvs7YfPWAQ3ANUmhOzXDYFhhkozhsBqFuZv3eOdIYi1QmhXU1jOsyiBIY1GYtZf3Wyt7rbYBgyJPTERECrLUxHOitSi717zmNWrFypXcctvtvPmtbwv/ce554Z3v/BfqyvK3f/u3HHzwfqosPVkKSRIjFHjyPI0GoR8hT7WWaE2rXWBdTRJTKFJWEkE0HvI8F9S4MbGM4MHzcc2ZGsnE/0fjN9qT+2WGFCcqOp0O1157R7jnngXuuOMurrr65nDLLbdx9dVXh7PP/rfw3ve+l+nZGV760pdSOzmAZTm2VpIskfBC47EZzcJCRZrqUQkBSrwKPZaLlGXJ9PQsPl7TaD2y5GyUqGNlP57u5uDvbDQKzHvPOD41EadS7LBxtif2CMh7ysqjjScxCvBopF6mri1VJcXRJ550PEVRcOddt3PXXffivYv34Zbck/eeEMYCdvJ3k0MpM7q3o488Sv3l//dynHN88Ytf5P3vf3/IixhuMgKjritHYkRRBhjB5UMItNsF1nmuu+4a7tu0kW63y6GHrldVI0S9x3knheLKR4CQlJQ4D3muMQaqylPXHpMgCDgt+ZgHG0kK3W6HRzziEYDiq1/5GoOBSFlrYcu2eX70ox+xYsUKTjjhOFav7vCYxz6Ksiz50pe+RH8ooWJt4Bc33xp+9tPLsLXnUY86fVy9vZMhCjehrmuuv/76sGXLPJs2beHmm2/jzjvv5MYbb+Hmm2/jjjvu4pprrgmdTkdg3V6MrSSR8okkTamrCq0TFhaHdNo5toZLfvrTcOstt7PnXnvzhCc8QRUFHHTQGrX+gP0ZDio++pFPUpYw6NeoVDPs9VCxDKO2JcN6SGIm97MXb2/E3iA/b5SPnCE12vN5njM1NcVpp52m1qyRXLDA5eWarVbKQQcdoM56+pl0u20++MEP8PKXvyqcffbZ4Zxzzgs/u/T6cOst94q3iZylxd6QJE3J8xYS5XhwwdoAXdJUk2UZ1lqcc+y3337quc9/HtZa3vOe93DRRReFYSlGlbWwfPkKpcUSFCOV7c6z8gQluStrPTMzM9x15z3ce+9W7rprEzfceBc33nhruO76m8Kdd97ONddeHxqF5JwY0s4JZL8sHVkic1jXsOdey3nXu95DURSce875vOH1f8u2bdt48YtfzCmnnKqUglYxEUpUnqYIfum/Gck0E2ti5SwLyUP4bYhF/hLjNz8nt91QQS/J0Tkn4bIrr7yS5z3veejggwqWxYUtGGNC0m6z2Bsw1ZniTW96E8cdd5xyzgn4wID3hrKsSfM0Ah40w6EUdk5NZVIv5aWWpDmANgA1lMOaqrQkSUJpa4mnKwiIRQZInVmMc+iJ8++jZRsivlnolUS5acZKJV7igedEqVFNcwiBgKOpik8SjTEWsFgnnlieGBx69DcHHXww1lVs3bqZqh6Oi911DJdOeI6N9wjRmtvhXmI+S2mUUkxNaZ717GeqX9x8Y/j4xz/OF77wBVbstiqcccZTlAnQ6SjSokXRaZMVuQBeE4V3loCjrCw6KbjjjjtIkoQDDjhAwjeJMEW0U42ipipLQnDcdsc9aJNjveG+e+4NWzZv5Phjj1FzM1MjIeSdeLdJqiZyCvd/oIvc8PjHP47zzjuPH/7wR9x5xz1hdm4f5QLccMNN4fLLL+eYY45hzZ57KO/gpBOP45//6Z386JKLufmW28PBB69V3sN3L/w+d2+4j0MPOoj169crk6gJUFXcJ0qNgC9aa2699Vb+6q/+imDrELwlNYqpTpdtC/NkRRuU7N87776H7lRnZHBoDXXlqMoheZ6jlKbbLSDAtm1DPv+5LzIYDPiD5/4hy5Yl9IdiNDz28Y/j/PO/x7nnf49bb7uX/fcRYEzR7eB8NQJKaEJk6hHyBAG3WLy3iDElBdGEEL0SCCoIYldp0gSSzrhw2dbiaRAC5bCW89cp+MtXvEytXbsm/Md/nMsN11/HtddcTV1ZrLVMTU2F5SuW8cIXPp+TTzhe5ZnkNAflkERL6DK4BxbUTX7Z2ibEWFOWJatXFzzr95+hbr/1+vCdb32Nv3nNq/nYRz8R1q3bR7W7ioXeIJhoJIWgJoMsS4YxhiRJuPfee3nlK1+Jd3UwRqGCFyMyOFqtPMxOT/Ge97yH/fffR67liKVLkRQi3muaSg3qEUfsr174gheFt771rSileNjRR/GsZz1Lzc6KSFfA/EKfmantPFo52EvOa5qaKNs83luUEuM3+LBDJO23cfzGK7lGEN/fEGu/zfTULPsfsJ4iS2kXKdVggcpaNmydZ9v8Ihs3bORd//J/mGq1wyNOPEYB9PsVnU6GcwpvPSrR49ySjnDmBLQ2Yw7ECDgLMZZdFAVVtJSdkxIsCW/qkTIQD6gJ8ant7p/RplqSJA+RYcUTNWDzy+bvhX1lxz3o0YiS0VqPwidVXUpC3DRAEY9SmqqG4XAYhWpCmqakaUZA6sZG5Qte2FA0nkRrYooo3snEeqmxN6xVYLFnmZtO+Mu/fIWq6zp84xvf4G1vext77bUuHHXMkcrFkPNgUIqwc5BHerQkSfDBYbSwW+RpxqA/ZHG+YvlcRivV9IeLdIucIs/YuGkz3zv/3LBh4zybNy9y8cWXsNuKWfbea0+Wz03Fwm4/ChP6Ccor2IkxoTw+iGd+5EMfotauXRtuuOlWfv7zKznk0H1QwFe+8jUGgwGnn346U1MZGth7773U2r32CDfffDOX/Pin7HfAWjZvHvDTn/yMIm/xtKc9LdYv7rB4ozkUT07QeStXrqRIM7RyJBH1O7tsjrnZ5fTLisGwYrE/INESNq9tTZamAoTIRcht3bJIu9MlMXDVldeFSy+9nNnlK3j605+uQMJgSsGjH32c+sqJJ4b/+PY5vO99Hwjv/N+vVfPzfaZn2gyHJVmWkiQGjaKyNakZIwB9sGOQwkQIeHKI8SblOFJw72OReQPcUlJGoaSWVSvNs555pjrjyU/k9jvvDNdffyOXXno5l19+ORvuvY+t27bw8pe9nEc96vTw1re8SRmV0ml3UEiUJUsewFtXAtioHdRVRXAWFbzU2TpYvarNK1/5SrV188bws59exstf/grO/tCHaXfnYvg3GdUbhiDenIIlh7IsS1ot8VpX776SIkvpTnWEvcaIIhsOhxglaQEQhRucpEiqylLkCb3FkqIlhAGdDvT78L3vfS/mwRNuvPFGbrrppjA7LeUyvd6AFcva49z6aOwYvDMmjZ6cjuuno7H+uzF+45Xc5NgeKaUAby29Xo9DD92bt73tLWrZ3Cx12UN7i0oMTmds3rKNz//758OHP/ghXvGKV/DOf/zH8PCHHaU63UwspiyhLGtA4VzN1FQH7y39hZJsKiExIRaC6lHSGC3cckW7hXWOVqslNTKRPQJiuMEYlA/RQpo4/EEikSHQUAxOWOGaRGuxhBu05qhAsHn46L0tKa0QhWnMOLdU1w5NHXODEpKtbU1lITE53sFll/0chWGqO0NQEsprcgKEpYpAhK8aeaFahUiR5GO5gxaPVQklULeVUJaWmamCP37RC9RNN90Ubr/jLt7+tr/j9W96czjo4PWq2+0yv3ULRmkiMp/KStI+S1J6ZcWhhx7OhT+4hBtuuIl2O6OqxaBoF23AYZ1lxfIVPPnJT1badLj4x5eFc845nzSR+RS+US8ZXRNh+BMCYKzg/BJlZ5TCm8Dy5R1OPfVUbr/zM1z8o0t4xjOfzKaNfX588SWsXbuWRzzixAYbwtR0xpOe8Bje/76z+cGPLuZJZzyFK664Jtx+5110u11OO+2RKsti4XJTTI8GFEEZ+Xwt879y5Sre/OY3c+B++6lBfwHtHWmaxByOx2Q5N918c/jLv3wV27Ztk3UeIZoCVVmSZS1mZ7vUFjZtsnziE58CNMc87FhuueW2cMNNVdw34hUeeuih/PSnl3HhDy7i0stvCuv32VMJeKlNkigqK7RaWd4mLIE9a3SQAnkjUyn5zRCijRZG+1LyyD6W6YwFr7XixSmlyVIJX9sAnXbOQQesV4cdvJ6nPPmxbNiwwA033BA+/vGPc/nll3PxxRdzznnnhtNPPUVNT7fAQ5bnhIYjdnvZEcZrbkyMPhhDojV5mmFrKaNZsWIZf/vmN6s/+7OXhdtvv5M3v/nN4W1ve4eamppR3vsgxqEk1icjTM3QWlFVFUmq+V//61U87OijlFKBatinKDK8FR5MV9Usm53CWSkc0onB1k6MZu/pdHLKOpBkitvu3Mab3vSWcOWVV3LUUQ+j223zk0su5tWvfjVve8tbwnHHHqpaWYuy9KSpHucygqzRCIwwul0dvVHFUiX4W5/NAn7Dn2KyCHpyk05+Pzc3R2oSqqpize6zTLWhlWcsXz7D9HSXPE1Yu3Y3XvjCF6q9994brTXf+ta3ZPGJIcMo7NJEMd2dYrDYo9/v0+nkNHRBSqkRMswYiY1v2bKFwWDAsmUrIvBirKTk2o0yGLlDQonDdopjVJoalV8UVEmSRqveLE3LjV4SkmxyZwpItBZ6pEQL/2RUNomRjHJtJWfTKnKalNR5551Pr9fnwAMPYvny3QDJYS2Z76igjZJ6q4Zzb3JM5uaa0GZViyXa7w9ZsWIZ//Iv71Tr9tqL22+/nbe+9e1ceeVNQWtNmmQYY1SDXg1exQS3oq4dRx91DGmSsW3rAt/77sUhi8CZcljivSOJLuvczDKWz3VZvXIPEp0y1Z4iTYUbM031yItzjh1KRGBnoWGLRoABjzztNAyGn//8Cq677q7wgx9cFDZv3sphhx3GqtW7CfMEkrd54hMfR6udcfnll9PvDTn3vO9y7z33ccghh7Fs2exof9zfaJCetqrZa82eqtOGbqvNbrvNMjvbZW6uy/RMl+npnJUrV6pt27YJwjYxJFqMEylgznHWUtfEIvNfhOtvuJGF+UUuuugiXvqyl/Gyl/0ZL/vzl/KnL3kxf/Inf8SnP/1p7rrrLjZsuI+PfORjTE/nlEMf91CC0RmexvJnLDzRo4hA82jN/ms8PBPBWM0LJES4PTHzaC8FR6IgTxSpEWTpYGhZvXqKhz3sKPXGN75RrVu3jn6/z9Yt80xPt7BWvCEXC+fvb6gQQ4Ee8sRgNATnKLKEJObh8ww6nQ7/8A//qFavXs0FF3yfv//7vw+33357AB0V8kRufLtctU4TlA5s3ryRFbstp9OW3GMREYpJaijSTBRcE0ZPGkNMY5IEvJwjYxT33bfIJz/+8XDJJZcwPT3N61//el75yley//4Hsm3LFt7zrndxx6334SxS5zgaGvFpooUe100pIZNo6AgVZiLu+jsQq+Q3XMntbEwqOx2g3++hlFiI/UGgtpAXIr2997QKzWAQmJ5OOeSQQ7j33nuw1pJlsHXzYswJ1COBd/DBB9Ptdtm0aROXXnpFaDoKGKPIMj1SDBs3buWKK65EKc1JJ51EnudLWCiACYsaCJKjMCix2cPIdh+/JdY0JVri+GmaSgI6CKDCRWSnvCZ5ND0BRwhSXNrE2JUifm38Iy3ErUken2GB73znvHD9dTey9z7reezjnkCnHfOOPoyUWBM+G1u7RkK2Yaxo2U7BEQLBSVeE2ta02wXT0112X7WcN77xjWrlypVcffXV/Mu//AvXXnstW7ZsodfrhQY5V7RaMWyiaLda7LnnXurggw+lqizvfvd7ufHGDcLXV7QwEaAx6PellMODVglVaRkOhwTf5LnkNgUa/8sk1T3BO/E8Auy3337qIQ95CFu2bOPzn/siX/rSl+n1epx44omkxpAqESOphn323lPts8867rrrLs4559zwve9dgDEpj3/840kj/VISa6pk7jwqEpQKitdH+L+hLEu8Z8Rc0VscStlArqNBIOteFAXee8pSOC2N1pHuTfZhr+f56Ec/ym233cE++6xn9erd2Wuvvdhrr71Yv99+HHTwwRx59FHsuddaTj7lFLIi55xzz+eGm+7FZJoqgjyUTklNzmBYjgSlxqDjf0YZjBojKhtvXzd7JXYAEHvDQ3DyHhVIU0OWJSg8dTWUUgBfMhz08E4I07vtpqgfli2bYt9992V6epZ77rlnxK3a1DmO9qTa3oDxo3NprQAyhBy5IkmkXk8jsn7ZXIdVq1bxmte8ht1WreRb3/k2n/7MZ7DOoRITjeCJYEsT6lOeshxQFBnL55bRLlrKVpJP7rRSUgOdIhWeSwXW1RitJBJkxQush8OIHE8oy4of/vD74aMf/QibNm3if//DP7D33ivV+vWr1Cte8QrSNOUnP/kJ7373u0PDsTkhXMZRoEmHQQm6s64jD61u8oy/Kyrut0DJjdvsiJDe3tKW+L0iS9JR+MfWQszsvGJQQZ4q7rpjKz/98U+Zm5nj0EMPpRzA3FxX2D2ShDRJqUvHIYccog477DAWtm3ln/7pn7hnwya2LAwZlJ5hJeTNW7aWXHPNNeGCC77Hbrut4DGPfiQzM21iXTTBeapqKEzkk8+ixtb7DocuKHTQNDB2YxQ61gJZr7FBGEiEp24c7hEFlqBiqEEpQ6KSePCEeqoswTphnicI/+OGDds4//zvhf/zf/4P2sDjH/94Tn7Ew1WDhmsXZod4vom5Q6n9ajw3gRiEGM8XII0lBGnXU+QZPgjopVEwa9eu4Z3//I+sWD7H9y+8gLLXI88MqdFL5staKaPw1jPd1fzBs57NVKfLL266mQ++/4PhmqtvC/2eoz8IGDOFSYQ1ftuCMLM0UPs0M6N9JLVLkGYaW++YdWhyryro+G+F0YZUQ9FSPPpRp5Ilim998+v85Mc/Zm5mmkeedrrCBaqqkvBabZmaKnjcYx+NtZZ3v/c93HjjDazba0+OOeYYlSQSbWgKbWVMhJWAgIdgWbZ8TsLBTvY1CBGvMMIEMgOLi/NBq0CaaNJMSjq0UcLHqSREnaZw9TVXhR//7EesXrWMf3rnP/CZT71ffeyjH1Bf+PxH1QfPfr/6+Efep97/vveqf/vXd6l3/uM71EEH7se2bVv49Kc/HYaDcRmK1HFFIy4umNJhiTEEEWjV5BeVdBjwNuCsHYX0CZo0TYVtv66xUTA7G9iydZ5Xv+6N4eKLLwtOJWiTSI1frx6VEdx990auuOIK+v0+hxx8sABjlDyvrXZc38lzJ4wn8TyGEL23IEjkEEtdrDDzzE4ZjjzyCPXnL3sJiVZc8L3zKYf9WMagdiCDDkqy42ma0u/3I8rS4pyQaTfF5c5BmgogKM/Shpp31H0kLQpa7TYLCz0uuOCC8IY3vIFy2Od1r/kbDj/8IJVngiQ++siD1F//1V/R7hR85zvf4qtf+/qYG2/yvrb7ChBcLcXowY3z7NulKX6bx6+ck/vv5ibb4fITsfTmAAkXnOW7370gzM7OUpYlVVXhgqe3WFJVNZ/42Me46657OPywQzjhhBNU45FVlbBgDIYWrQ2zsx2eduZTuP3227nymqv5oxf/RXjMYx7DYYcdhtaaTZs38qMf/JAf/ehHVNWQ5zz7GRx5xKEqS4SaServPFmWUZcWkyYkxlDXQ1CerGhJIa+3GGXQQGkDaVJQlp6qKjFJwGj40UU/Dc7XDIcDnHNs27qZVpaT5yndTotTTz1F6aAggl6UAWcloa91wg8uuhij01DbctQuoyxL7rjtdq688gpuuukm8jznBc97Hs945lmqlcvBVjFsH8K4TU9apCR5gtKOTqdFP6JKrQNtMkkb6gSVgNGOPLO0c6FYmul2RnNtTEK3ZVi7Zo16z7/8U3jpS1/KjTfeiOlm5IlS+AprNSZLKCtLp5NL3iLRnHjcYeqvXvHn4f3vO5uvfe0bXHzxJZx++unhiCMOpzvTpd/vMxhWXHHVlVx44Q/oVX3WrDmIciA1Tt4FsjShinyFSTKGtG/fXFUFMaiMThhWJXmWE5znsY8+VX323z8Rzj3nfNauXcsjT30EnTwjTxXOZ9SVo5VJW6XHPOZR6n1nfzRs2HA3ZdXjxBOPZc2qKVQkKlBEBnkDiUlG4CMFuHqIUR5X9mnlEkoT5hM34n40URjnqVHeVsFbaZHUBBB8MOiEyHLv+Jd3v5PF3iZ+//d/n/32W60AOrGco50qEqCbi9CsTMUzz3oiV//8Z3z+85/jqU/7vXDIIfuosnIjjzhNoiRWMBgsULQSstwQsU1Sk+WIpl5jhDWmnxBNS+9DS5blaPSoHc22bds497wLwvnfv5Svn/sjjj7yqPDIRz6SZcuWSeqgttx333187Stf5qabbuJRjzyNww4+SDWA1XHEx8cmttvb83rEnJJkmmElZ1aNwqPQL6UOsEgUde3pFJrfe9Jj1IZ77ggf/vCHGfRL2i2DwuJ9gg8ehydLE5TS1KVwbdqqZmpqivPPuyCsWb27MBRZy2AwwNqKmZkZegvztFo5j3vso1WrpVlcLOl2JQ+XZYprr7sxvOktb2VhYYEzzvg9nvD4x6ipzgSRtYZHnHyi+ov+y8Lb3vY23vZ372C3lcvDwx72MNVqJbFbQeSODVAOo9wrHVkKtlzEaEerkH5z1orH+QCg419q7OKu/CXG9h2Ot+/31S5aTHXaXPnzy3jzm9/M1q3z1NaSZRlF0QYU3jpmp6d44hOfyB//0Qs46IA1KKQ1SZYlDMuKVp5R2UA5sDz+saep1StXhb//h3dy+VXX8MEPfYSyLMmLlCwxlNWQA/dbzxMe/wc89Ywnq9nZzqgovVXkMQSFAASUoBfzIhWC5KqSok9jIvghYEbJIU3Ryqiqkm9+8+tceOGFJGnKtsUF2kVGcI5y0AM8j3rkaRx33LEo1RLOPNNcQdHtdtl830bOP/98vvOdc8iyTJCK3qJ8oGhlrFi2jIMOOoiX/fmfsX79Pmq3Ze2xZvMKYrhGJ7LP5+/bSq+3QAhSZ5dlyah+0HlieyGhnxoO++SZptefp0gzfBDBpZQZFe/OTqfst+8+6k//5I/De97zLjZtuo9Bb1vodNapunZY72h3OsKHWaQjS/kJjztB7b12L77wpa+Eb//HOfz7Zz/HZ/79c4L0y1OyLKM37LHHHnvw9KefyYv+8PfVvnvvKXPTaBakoLWOfKQ77rlGIEp4t0HQ5blmarrFIQftx43XXYtzJaed/AimOrnMVSysdU7yT2vWrOGIIx/CxRdfwn777sMxRx+FScDVIkCcteOcma3xBIzOqOqaatgnSzQzU23qshwVPnsv/d9CILLLBKrhMKxYtoxOpxOpvZowlCVPE4aV5bzzzgt33HEbWW444cRjaeWiMDWGJCpQFcCVA5I8Z9lcl0eeeqL65P77hNvvuptvfONrrFr1XJYvnwYEvBS0lrxfmqG0x7oS7yvKcsBgWJNPpTHfPZ7PnX3VWjzC4MVgTVLDsuVzPOIRJ6s7N/bCBT+8mCuvvYErrryW2pYSLlewuLjIHqtX8cxnnMUfPufZar/91xLc2HBVOtxv+U0jP2InIcqyxBhDt9tlWPbp9SydbjJGTOKpKkeRpZz5tDPUlk0bwxe+8AW67RZVNWRmpgA0VS1trpyryfOM+YV5Ot02P7/8Cj7wgffRXxCvLtEpWmvyQjy9VCvW77c3Bx90APvvvw/dbk6/X9HqZPzi1nt469v/jqqy7LHHHrz61a9Wy5d3JzxB2QsrVnQ47bTT1OWXXx7OO+88/umf/5k3/+0bWbduHe12TlOnKHtH8vztwnDvYJE8lcjFwsI8MzMdYZSxE30jf4vHr9xq58E09a9a6b6DkmPp91defUO45Kc/oa4cOhWUpDTV1CRJRp63aLfbHLB+X9XpFuy5ZpZyYMmSRNgygF6/R6fTIYBwCXZaGA233nYfv7j1jnDDDTdx4403Ap7VK3dj9eqVHHzQQTzkIQeqJrc7HJQUsc6rHA7JswR0wmAgfJLnnXdeGA77nHrayWr16uWA1N81Cq7hK7zqqmvCFVdchbOexUGfrMjo9/tkqcEYRWoU1tasXrUbT3rSk1SrJfm1wVC8pNoFzj3vu6Ghn0qSdNSEUg6XYdnyWfbaa0+1++67MzMl3TJdDc7XGKVHjS0D43rlunace+65YcOGDZx88slq7dq1jItX5doNm8Ull1warrzySvbbb18e8YgTlfMu5sXGKK9GQW7dWnL55ZeHrVs3c9zxD1fT01NkWYIxUtgcJlqT9Hs12qSkKWzZVnPnXfeEa665jltulwLpop2zbt06dl+zmr333pv9912nupmI0sWFHq1WC5No6soKlRbwQPWuIebxXPCxts6TZQmXXXZluPHGm/De88hHPlItXz4t5SORUs45J+Fio7jk0uvClVddzbK5WU4/5WQ11ZUGr3mqZZ+kKZLr17jgMVpImG/6xe1cfNGPQrsQ677dbo1qytJUoOVZJpRy8/PzfPOb3wxZlvGkJz1J5blA8AmxpZyHn/zkknDzzTeTJAlnnXWmci6WuRBGueQmP+29J4+Nbb/znQvCvffex9RUh8c9/jFCVhxN42Ep9aRpkuJc4MILfxAuvfQyjnzo0Zx66vGqmd8HkgBNeU0SG3zWlaCQk1RQptsGcOsdd4Zbb72V2265ldvvuA1vHStXrmC3ZcvZf7992X//9Wq35dMjpDINeCnE4lRgB08uGjKNJySUa9eGa665hr333pujjjpSCdemxSRCyNy0v8lzw913b+TnP/95KMuSxzzmMaphB5F8f0JVV5g0Y8vWRb761a+H+W2LtNttbOUwJhlHVvoDnLd02y1a7ZQnP+mJqt0uZH8qYZO54467+MlPfhKstaxatUqQvCbymUZe0KoKYuwquPbam/j5z38eqqriqIc+VO277760Wumot2PzvFrDcCjrLfJpyFOf+lQl5TtqCSjvvzp+Ezy533wlF/3lpcpNj36mFFQukCaKyo4t3H6/FoReUHS74kH0e5ZWnognEg9VVQ7I4oGWhZc8lrWeJNOUsa9mk8hVKtBuJXLQvdSjtFqiFLUGfGA4HEpNi1M4L/yGZSl1RHmexLqgpYfMxZqtQd/iPUxNRX5NNa5hGvQGEeAC/d4CU1Md6romz1vSuDUK7t5APkfp6GVF602NciSAYgQe8d6hVWSbiBPtI9rNpAnDSBKrlKAuG5aZ5uAk2xPORjb5xtsTFg4tAtxLiE6hR92o61ryfLH3KqiAczVKKWwl3lbTvDMQSbK1hPzKUjxNawOlLUnTlG4ntnJxQKwz8j6gYx85Z6UXVtPx/YGGCxaTJKM5nASvjJhwaNYwRCGXggoE1IgeWSNM8YmWvRqc9AF01RCTCb+h807ypmZc3K88pAmxxEXyYMYoyrIeUaylqWEwKGkYYpr35nk6Ojd13aAb5Z4XF4d0u0VsCqxGzwZjdKNShuA1ScrIs9myZRvTM12MNjg/7uqdpTkhwGBQUeSZsMyUsR/bA4yG7LchAG7Wx1ornTgyNTK2qgqqqiQ4hzGKIsvHQn4oheiddjHKf2VZhgt2YgUmxmT+M7BkfUe1pZUYbsNyGEngl+7z7fd8sw/S1IiSMwalDYv9UpDSE5/Z7w/JTEKeJzGs6/FeMAUBR0NYYUxBZRtSh+Zv69iaSC+RH40BNAm4WdjWZ3q6PdoDjfJqkJxpzEnWtcitqanWiEpMJueB1+/Bxi4l96CjoaHZ7jMnNmxVWfJCpOXiQJpxZmmCdX4J7VBZjtnQFR5b14CnKboFaZQpYURRFo13ZL2Q/sIICCcbMwq6QIjQfyUKI0q/kTCdDC9ZQRymqaCqQpDi1/hgo/dqBf2hp9VuIO/SDFYKRj3OVpgkoa4qkiwdhdS811gndVc2yPMlibDXa8aeRjMPDaR7JFEbuHcAtMJ5AcM03Ida61hWIYJRlGwalaUI+UYQ9/t9QcopFWHlanRoJrfNYFCTZakI7EzhnMO5miwbR9Odd9SVw6SZ1PuFGG7Tou2ShFgDGMQjNQZ8oCVSY2SROudGnmo5rMZzfz/DBbukK3dZxhBnUBHuragqyXVImCo27Yz7qfKKLBX+1KocMt0phI1i6zamZ6ZGvFLWCoVbYhJqJyTSWSZhuVEvQzU2ivr9Ie12MZr35vfWypqLISVwcO+bspfxuplE/s4oCeH6kYIWMlAfazydHRtGWscC7XisBNWssdYCsT4viFcBkGXqQT2BxuCytQj2PM9i6BLQYON7qloulKUCTrLO42thPsmLlDQWfbtYE9Agm8co2h1zcqN/aQH1WCvGoRgxkgtraOKEo3YiV21jE95Mj8LDKq6VMYrBYEDRalHaekTibktLHg0A5yDR4/OuaGRFhUkaXKcihASFnJE8T5fk1UJoPNYJz2tCYde1hG0FRONHBlHzPpD8ezm05EUyWusQiFR44738Xx27lNyDjp0rOZjw7IIaCaFJyinb9PQIwhYvfxOwVYkPlqJxjxC2A1CkWUZdWara0Wp15DCHBgXlYk3M2IK3Tiwsaz14CbmECeh3c/3BQARjkk7eo49NMsXybJBrRo/zVhAPAR7namG9jy5kXQmYJC8KgvdUkTzZOxE2WuvYgcCOEZ0T9UpNo05rpYN68D5y5akY3hSXpa4daZ5NEECP723SmwCxYBsWiwYe772QPTdetVJmBPoShNk45DIshTYqyxJ8kPvu9RbJ85w0srk3Bs5keUMdBWSS6sjosrTKuxqOvaBRvVb0pB9UCBtGfIYNCXWjfBtq0cFQWC0aRFpdS/G90hJya0KZOt548BZfW5I8pym1cC5g0nzszTjJh9pKaNrSNIkWeBh5T3lsn1LXzbrpkTU/WqOhi9RS8v0wAg5QoihTk0h3hqholAqYJMFZOyo9aP6mqu3o2eu6jIw643zyZDdrpaJn/iDzK+s2DlXKNSPySUFZjT/TuojKVHK+mlC/0OEJO4qL56ABpE3e39Kh43PUkU5s8p5kTovCUNtxeNh7T55lUTGJF1RVPio7M5IJzb7P8xzra4w2BKQ0wBghIaiGYtiJ4WDFMLcyp4NBj06nja8dOilwQVr8NIZ7WdWCBrc1eZZSVjUKQ5ZrCasHj1bCuRv8mJ+zCVM652MNnjAAOScdXGBMZNHABH4XwpX/P2RxtBB59EJKAAAAAElFTkSuQmCC" alt="Next Wave" style="height:36px;width:auto;display:block;filter:brightness(0) invert(1)"></a><ul class="nv"><li><a href="#about">About</a></li><li><a href="#homes">Homes</a></li><li><a href="#location">Location</a></li><li><a href="#contact">Contact</a></li></ul></nav>
<section class="hero"><div class="hi"></div><div class="ho"></div><div class="hc"><p style="font-size:14px;letter-spacing:.25em;text-transform:uppercase;color:rgba(255,255,255,.75);margin-bottom:18px;font-weight:700">A Next Wave Development</p><h1 style="font-family:var(--sf);font-size:clamp(52px,6vw,92px);font-weight:700;color:#fff;line-height:1;margin-bottom:16px">${esc(d.name)}</h1><p style="font-size:16px;letter-spacing:.15em;text-transform:uppercase;color:rgba(255,255,255,.7);margin-bottom:28px">${esc(d.city)}, ${esc(d.state)}</p>${statsHTML ? `<div style="display:flex;flex-wrap:wrap;margin-bottom:24px">${statsHTML}</div>` : ''}<p style="font-family:var(--sf);font-size:clamp(28px,3vw,40px);font-weight:700;color:#fff">${priceRange}</p></div></section>
<section id="about"><div class="ct"><div class="rv"><p class="sl">The Development</p><h2 class="st">${esc(d.name)}</h2><div class="dv-line"></div></div>${d.description ? `<div class="rv">${d.description.split(/\\n\\n+/).map(p => `<p style="font-size:19px;line-height:1.8;color:var(--g6);margin-top:16px">${esc(p)}</p>`).join('')}</div>` : ''}${(f1||f2) ? `<div class="rv" style="display:grid;grid-template-columns:1fr 1fr;border:1px solid var(--g2);margin-top:48px"><div style="padding:36px;border-right:1px solid var(--g2)"><p style="font-size:14px;letter-spacing:.2em;text-transform:uppercase;font-weight:700;margin-bottom:20px">${esc(d.featTitle1)}</p><ul style="list-style:none">${f1}</ul></div><div style="padding:36px"><p style="font-size:14px;letter-spacing:.2em;text-transform:uppercase;font-weight:700;margin-bottom:20px">${esc(d.featTitle2)}</p><ul style="list-style:none">${f2}</ul></div></div>` : ''}</div></section>
${lotCards ? `<section id="homes" style="background:var(--g1)"><div class="ct"><div class="rv"><p class="sl">Available Residences</p><h2 class="st">The Collection</h2><div class="dv-line"></div></div></div><div style="max-width:1140px;margin:0 auto;padding:0 48px;display:grid;grid-template-columns:repeat(auto-fill,minmax(460px,1fr));gap:16px;margin-top:24px">${lotCards}</div></section>` : ''}
<div class="lb" id="lb"><button class="lbc" onclick="closeLB()">✕</button><img id="lbi" src="" alt=""></div>
${nbHTML ? `<section id="location"><div class="ct"><div class="rv"><p class="sl">Location</p><h2 class="st">${esc(d.city)}, ${esc(d.state)}</h2><div class="dv-line"></div></div>${d.neighborhood ? `<div class="rv"><p style="font-size:19px;line-height:1.8;color:var(--g6);margin-bottom:24px">${esc(d.neighborhood)}</p></div>` : ''}<ul class="nb rv">${nbHTML}</ul></div></section>` : ''}
<section class="con" id="contact"><div class="ct"><div class="rv"><p class="sl" style="color:rgba(255,255,255,.5)">Sales Inquiries</p><h2 class="st" style="color:#fff">Schedule a Tour</h2><div class="dv-line"></div></div><div class="cg rv"><div>${aph}<p class="an">${esc(d.agentName)}</p><p class="at">${esc(d.agentTitle)} · ${esc(d.brokerage)}</p><div class="ac">${pl}${el}</div></div><div><div class="fr"><div class="ff"><label>First Name</label><input type="text" placeholder="First"></div><div class="ff"><label>Last Name</label><input type="text" placeholder="Last"></div></div><div class="ff"><label>Email</label><input type="email" placeholder="your@email.com"></div><div class="ff"><label>Phone</label><input type="tel" placeholder="+1 (555) 000-0000"></div><div class="ff"><label>Message</label><textarea placeholder="I'm interested in learning more about ${esc(d.name)}…"></textarea></div><button class="bs" onclick="this.disabled=true;this.textContent='Sending…';setTimeout(()=>{this.style.display='none';document.getElementById('sm').style.display='block'},1200)">Send Inquiry</button><p id="sm" style="display:none;font-family:var(--sf);font-size:24px;color:#fff;margin-top:16px;font-style:italic;font-weight:700">Thank you — we'll be in touch.</p></div></div></div></section>
<footer><p>© ${new Date().getFullYear()} ${esc(d.brokerage)} · All Rights Reserved</p>${d.agentEmail ? `<a href="mailto:${esc(d.agentEmail)}">${esc(d.agentEmail)}</a>` : ''}</footer>
<script>const nb=document.getElementById('nb');window.addEventListener('scroll',()=>nb.classList.toggle('sc',window.scrollY>80));const obs=new IntersectionObserver((e)=>{e.forEach((r,i)=>{if(r.isIntersecting){setTimeout(()=>r.target.classList.add('vi'),i*80);obs.unobserve(r.target)}})},{threshold:.12});document.querySelectorAll('.rv').forEach(el=>obs.observe(el));function openLB(src){document.getElementById('lbi').src=src;document.getElementById('lb').classList.add('on');document.body.style.overflow='hidden'}function closeLB(){document.getElementById('lb').classList.remove('on');document.body.style.overflow=''}document.getElementById('lb').addEventListener('click',function(e){if(e.target===this)closeLB()});<\/script></body></html>`;
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
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try { return sessionStorage.getItem("nw_auth") === "true"; } catch(e) { return false; }
  });
  const [projects, setProjects] = useState(INITIAL_SAMPLES);
  const [activeProjectId, setActiveProjectId] = useState(() => {
    try { return sessionStorage.getItem("nw_projectId") || INITIAL_SAMPLES[0]?.id || null; } catch(e) { return INITIAL_SAMPLES[0]?.id || null; }
  });
  const [view, setView] = useState(() => {
    try { return sessionStorage.getItem("nw_view") || "home"; } catch(e) { return "home"; }
  });
  const [loading, setLoading] = useState(false);
  const [apiSynced, setApiSynced] = useState(false);
  const [activeTool, setActiveTool] = useState(null);
  const [wsTab, setWsTab] = useState(() => {
    try { return sessionStorage.getItem("nw_wsTab") || "overview"; } catch(e) { return "overview"; }
  });
  const [form, setForm] = useState({});
  const [toast, setToast] = useState(null);
  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2500); };
  const activeProject = projects.find((p) => p.id === activeProjectId) || null;

  // Background-sync from API — app loads instantly with sample data first
  const fetchProjects = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/projects`);
      if (res.ok) {
        const data = await res.json();
        if (data.length > 0) {
          setProjects(data);
          setActiveProjectId(prev => {
            if (!prev || !data.find(p => p.id === prev)) return data[0].id;
            return prev;
          });
          setApiSynced(true);
          showToast("Synced with database");
        }
      }
    } catch (err) {
      console.log("API offline — using local data");
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
  const wsTabBtn = (id,label) => (<button key={id} onClick={()=>setWsTab(id)} style={{ padding:"10px 20px",fontSize:12,fontWeight:wsTab===id?700:500,letterSpacing:"0.04em",cursor:"pointer",background:wsTab===id?C.accentSoft:"transparent",border:"none",borderRadius:8,color:wsTab===id?C.accent:C.textMid,fontFamily:font,transition:"all 0.15s",marginRight:4 }}>{label}</button>);

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

  // ─── HOME / OVERVIEW ───
  const renderHome = () => {
    // Portfolio totals
    const totBudget = projects.reduce((s,p)=>s+p.financials.total_budget,0);
    const totRevenue = projects.reduce((s,p)=>s+p.financials.estimated_revenue,0);
    const totProfit = totRevenue - totBudget;
    const totLots = projects.reduce((s,p)=>s+(p.project_info.lot_count||0),0);
    return (<div>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:24 }}>
        <div><h1 style={{ fontSize:26,fontWeight:700,margin:0 }}>Portfolio Overview</h1><p style={{ color:C.textMuted,fontSize:13,margin:"4px 0 0" }}>{projects.length} development{projects.length!==1?"s":""} · {totLots} total lots</p></div>
        <button style={btn(C.accent,"#fff")} onClick={createNewProject}>+ New Project</button>
      </div>
      {/* Portfolio Summary Bar */}
      {projects.length > 0 && (
        <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:24 }}>
          <div style={{...panel,padding:"16px 20px",textAlign:"center"}}>
            <div style={{ fontSize:10,fontWeight:700,color:C.textMuted,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:6 }}>Total Budget</div>
            <div style={{ fontSize:20,fontWeight:700,color:C.text,fontVariantNumeric:"tabular-nums" }}>{curK(totBudget)}</div>
          </div>
          <div style={{...panel,padding:"16px 20px",textAlign:"center"}}>
            <div style={{ fontSize:10,fontWeight:700,color:C.textMuted,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:6 }}>Total Revenue</div>
            <div style={{ fontSize:20,fontWeight:700,color:C.text,fontVariantNumeric:"tabular-nums" }}>{curK(totRevenue)}</div>
          </div>
          <div style={{...panel,padding:"16px 20px",textAlign:"center"}}>
            <div style={{ fontSize:10,fontWeight:700,color:C.textMuted,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:6 }}>Projected Profit</div>
            <div style={{ fontSize:20,fontWeight:700,color:totProfit>=0?C.positive:C.negative,fontVariantNumeric:"tabular-nums" }}>{curK(totProfit)}</div>
          </div>
          <div style={{...panel,padding:"16px 20px",textAlign:"center"}}>
            <div style={{ fontSize:10,fontWeight:700,color:C.textMuted,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:6 }}>Active Projects</div>
            <div style={{ fontSize:20,fontWeight:700,color:C.accent }}>{projects.length}</div>
          </div>
        </div>
      )}
      {projects.length===0?(<div style={{...panel,border:`2px dashed ${C.border}`,textAlign:"center",padding:"64px 24px"}}><div style={{ fontSize:44,marginBottom:12 }}>🏗️</div><p style={{ color:C.textMuted,fontSize:14,maxWidth:360,margin:"0 auto 20px" }}>Create your first development to get started.</p><button style={btn(C.accent,"#fff")} onClick={createNewProject}>Create First Project</button></div>):(
      <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(380px,1fr))",gap:16 }}>{projects.map(p=>{
        const fin = computeProjectFinancials(p);
        const profit=p.financials.estimated_revenue-p.financials.total_budget;
        const margin = p.financials.estimated_revenue > 0 ? Math.round(profit/p.financials.estimated_revenue*100) : 0;
        const isSelected = activeProjectId === p.id;
        return (<div key={p.id} onClick={()=>{setActiveProjectId(p.id);setWsTab("overview");setView("workspace");}} style={{...panel,cursor:"pointer",transition:"all 0.2s",borderColor:isSelected?C.accent:C.border,borderWidth:isSelected?"2px":"1px",position:"relative",overflow:"hidden"}}
          onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 8px 24px rgba(0,0,0,0.08)";}}
          onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none";}}>
          {/* Status bar at top */}
          <div style={{ position:"absolute",top:0,left:0,right:0,height:3,background:fin.statusColor,opacity:0.7 }} />
          <div style={{ paddingTop:8 }}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12 }}>
              <div style={{ flex:1,minWidth:0 }}>
                <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:4 }}>
                  <h3 style={{ margin:0,fontSize:17,fontWeight:700 }}>{p.project_info.name}</h3>
                  {isSelected && <span style={{ fontSize:9,fontWeight:700,color:C.accent,background:C.accentSoft,padding:"2px 6px",borderRadius:4 }}>ACTIVE</span>}
                </div>
                <p style={{ color:C.textMuted,fontSize:11,margin:0 }}>{[p.project_info.city,p.project_info.state].filter(Boolean).join(", ")||"No location"} · {p.project_info.development_type}</p>
              </div>
              <span style={{ fontSize:10,fontWeight:700,color:C.accent,background:C.accentSoft,padding:"4px 10px",borderRadius:6 }}>{p.project_info.lot_count||0} lots</span>
            </div>
            {/* Phase indicator */}
            <div style={{ display:"flex",alignItems:"center",gap:6,marginBottom:14 }}>
              <span style={{ width:6,height:6,borderRadius:"50%",background:fin.statusColor,flexShrink:0 }} />
              <span style={{ fontSize:11,fontWeight:600,color:fin.statusColor }}>{fin.statusLabel}</span>
              <span style={{ fontSize:11,color:C.textMuted }}>· {fin.projectPhase.name}</span>
            </div>
            {/* Key metrics */}
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,borderTop:`1px solid ${C.borderLight}`,paddingTop:14 }}>
              <div>
                <div style={{ fontSize:16,fontWeight:700,color:C.text,fontVariantNumeric:"tabular-nums" }}>{curK(p.financials.total_budget)}</div>
                <div style={{ fontSize:9,color:C.textMuted,textTransform:"uppercase",letterSpacing:"0.08em",marginTop:2 }}>Budget</div>
              </div>
              <div>
                <div style={{ fontSize:16,fontWeight:700,color:C.text,fontVariantNumeric:"tabular-nums" }}>{curK(p.financials.estimated_revenue)}</div>
                <div style={{ fontSize:9,color:C.textMuted,textTransform:"uppercase",letterSpacing:"0.08em",marginTop:2 }}>Revenue</div>
              </div>
              <div>
                <div style={{ fontSize:16,fontWeight:700,color:profit>=0?C.positive:C.negative,fontVariantNumeric:"tabular-nums" }}>{curK(profit)}</div>
                <div style={{ fontSize:9,color:C.textMuted,textTransform:"uppercase",letterSpacing:"0.08em",marginTop:2 }}>{margin}% margin</div>
              </div>
            </div>
          </div>
        </div>);
      })}</div>)}
    </div>);
  };

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


      {/* Workspace Tabs */}
      <div style={{ display:"flex",marginBottom:20,gap:2,background:C.surfaceAlt,padding:4,borderRadius:12,width:"fit-content" }}>
        {wsTabBtn("overview","Overview")}
        {wsTabBtn("financials","Financials")}
        {wsTabBtn("tools","Tools")}
        {wsTabBtn("outputs","Outputs")}
      </div>

      {/* ── OVERVIEW TAB ── */}
      {wsTab === "overview" && (<div>
        {/* ━━━ PROJECT TIMELINE BANNER ━━━ */}
        <div style={{...panel,padding:0,overflow:"hidden",marginBottom:16}}>
          {/* Illustrated Mountain/Construction Banner */}
          <div style={{ position:"relative",height:140,background:"linear-gradient(135deg,#e8f4fd 0%,#d1ecf9 30%,#b8e0f3 60%,#e0f0e8 100%)",overflow:"hidden" }}>
            <div style={{ position:"absolute",bottom:0,left:0,right:0,height:80 }}>
              <svg viewBox="0 0 1200 80" fill="none" style={{ width:"100%",height:"100%" }} preserveAspectRatio="none">
                <path d="M0,60 Q100,20 200,45 T400,30 T600,50 T800,25 T1000,40 T1200,35 L1200,80 L0,80 Z" fill="#7ab87a" opacity="0.4"/>
                <path d="M0,70 Q150,40 300,55 T600,45 T900,60 T1200,50 L1200,80 L0,80 Z" fill="#5a9a5a" opacity="0.5"/>
              </svg>
            </div>
            {/* Mountains */}
            <svg viewBox="0 0 1200 140" fill="none" style={{ position:"absolute",inset:0,width:"100%",height:"100%" }} preserveAspectRatio="xMidYMid slice">
              <path d="M0,140 L150,50 L300,90 L450,30 L550,70 L650,20 L800,80 L950,40 L1100,70 L1200,50 L1200,140 Z" fill="#c5d8e8" opacity="0.5"/>
              <path d="M0,140 L100,70 L200,100 L350,55 L500,90 L600,45 L750,85 L900,55 L1050,80 L1200,60 L1200,140 Z" fill="#a3c4d9" opacity="0.4"/>
              {/* Construction crane */}
              <g transform="translate(950,15)">
                <line x1="0" y1="0" x2="0" y2="80" stroke="#f59e0b" strokeWidth="3"/>
                <line x1="-5" y1="0" x2="60" y2="0" stroke="#f59e0b" strokeWidth="2.5"/>
                <line x1="0" y1="0" x2="60" y2="20" stroke="#f59e0b" strokeWidth="1.5"/>
                <line x1="0" y1="0" x2="-20" y2="0" stroke="#f59e0b" strokeWidth="2"/>
                <rect x="-3" y="70" width="6" height="10" fill="#f59e0b"/>
                <line x1="55" y1="0" x2="55" y2="30" stroke="#666" strokeWidth="1" strokeDasharray="2,2"/>
                <rect x="50" y="28" width="10" height="8" fill="#f59e0b" opacity="0.8"/>
              </g>
              {/* House outline */}
              <g transform="translate(1050,50)">
                <rect x="0" y="15" width="40" height="30" fill="#e8d5b0" stroke="#c4a67a" strokeWidth="1.5"/>
                <path d="M-5,15 L20,0 L45,15" fill="#c0392b" stroke="#a93226" strokeWidth="1.5"/>
                <rect x="15" y="28" width="10" height="17" fill="#8b6914"/>
                <rect x="5" y="22" width="8" height="8" fill="#87ceeb" stroke="#5fa8d3" strokeWidth="0.5"/>
                <rect x="27" y="22" width="8" height="8" fill="#87ceeb" stroke="#5fa8d3" strokeWidth="0.5"/>
              </g>
            </svg>
            <div style={{ position:"absolute",top:20,left:28 }}>
              <div style={{ fontSize:15,fontWeight:700,color:"#2c5f7c",textTransform:"uppercase",letterSpacing:"0.1em" }}>Project Timeline</div>
            </div>
          </div>
          {/* Phase Stepper */}
          <div style={{ padding:"24px 32px 28px",display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:8 }}>
            {[
              { id:"pre-dev", label:"Pre-Development", icon:"📋" },
              { id:"planning", label:"Planning", icon:"📅" },
              { id:"entitlements", label:"Entitlements", icon:"📑" },
              { id:"design", label:"Design", icon:"✂️" },
              { id:"construction", label:"Construction", icon:"🏗️" },
              { id:"closeout", label:"Closeout", icon:"🏠" },
            ].map((phase, idx, arr) => {
              const phaseMap = {"Pre-Development":0,"Land & Entitlement":1,"Design & Permitting":2,"Site Work":3,"Vertical Construction":4,"Sales & Closeout":5,"Complete":5};
              const currentIdx = phaseMap[projectPhase.name] || 0;
              const isActive = idx === currentIdx;
              const isDone = idx < currentIdx;
              return (<div key={phase.id} style={{ display:"flex",alignItems:"center",flex:1 }}>
                <div style={{ display:"flex",flexDirection:"column",alignItems:"center",flex:1 }}>
                  <div style={{ width:48,height:48,borderRadius:"50%",border:`2px solid ${isActive ? C.accent : isDone ? C.positive : C.border}`,background:isActive ? C.accentSoft : isDone ? "rgba(76,153,106,0.08)" : C.surface,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,position:"relative" }}>
                    {phase.icon}
                    {isActive && <div style={{ position:"absolute",bottom:-4,width:8,height:8,borderRadius:"50%",background:C.accent }} />}
                  </div>
                  <div style={{ fontSize:11,fontWeight:isActive?700:500,color:isActive?C.accent:isDone?C.positive:C.textMuted,marginTop:8,textAlign:"center" }}>{phase.label}</div>
                  <div style={{ fontSize:9,color:isActive?C.accent:C.textMuted,fontWeight:600,marginTop:2 }}>{isActive?"Current":isDone?"Done":"Upcoming"}</div>
                </div>
                {idx < arr.length - 1 && <div style={{ height:2,flex:"0 0 40px",background:isDone?C.positive:C.borderLight,marginTop:24,marginLeft:-4,marginRight:-4 }} />}
              </div>);
            })}
          </div>
        </div>

        {/* ━━━ 4-COLUMN KPI CARDS ━━━ */}
        <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:16 }}>
          {/* Budget Card */}
          <div style={panel}>
            <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12 }}>
              <span style={{ fontSize:13,fontWeight:700,color:C.text }}>Budget</span>
              <span style={{ fontSize:10,fontWeight:700,color:onBudget?C.positive:overBudget?C.negative:"#D4913B",padding:"3px 8px",borderRadius:4,background:(onBudget?C.positive:overBudget?C.negative:"#D4913B")+"12" }}>
                {onBudget?"On Track":overBudget?"Over Budget":"Watch"}
              </span>
            </div>
            <div style={{ fontSize:26,fontWeight:700,color:C.text,fontVariantNumeric:"tabular-nums",marginBottom:6 }}>{cur(p.financials.total_budget)}</div>
            <div style={{ fontSize:11,color:C.textMuted,marginBottom:12 }}>{cur(spent)} spent / {cur(remaining)} remaining</div>
            <div style={{ width:"100%",height:6,background:C.borderLight,borderRadius:3,overflow:"hidden" }}>
              <div style={{ width:`${p.financials.total_budget>0?Math.min(100,Math.round(spent/p.financials.total_budget*100)):0}%`,height:"100%",background:overBudget?C.negative:C.accent,borderRadius:3,transition:"width 0.3s" }} />
            </div>
          </div>

          {/* Schedule Card */}
          <div style={panel}>
            <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12 }}>
              <span style={{ fontSize:13,fontWeight:700,color:C.text }}>Schedule</span>
              <span style={{ fontSize:10,fontWeight:700,color:isOverdue?C.negative:C.positive,padding:"3px 8px",borderRadius:4,background:(isOverdue?C.negative:C.positive)+"12" }}>
                {isOverdue?"Behind":"On Track"}
              </span>
            </div>
            {start && end ? (<>
              <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:6 }}>
                <span style={{ fontSize:16 }}>📅</span>
                <span style={{ fontSize:13,color:C.text,fontWeight:500 }}>
                  {start.toLocaleDateString("en-US",{month:"short",year:"numeric"})} — {end.toLocaleDateString("en-US",{month:"short",year:"numeric"})}
                </span>
              </div>
              <div style={{ fontSize:11,color:C.textMuted,marginBottom:12 }}>{pctTimeline}% scheduled</div>
              <div style={{ width:"100%",height:6,background:C.borderLight,borderRadius:3,overflow:"hidden" }}>
                <div style={{ width:`${pctTimeline}%`,height:"100%",background:isOverdue?C.negative:C.accent,borderRadius:3,transition:"width 0.3s" }} />
              </div>
            </>) : (
              <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:6 }}>
                <span style={{ fontSize:16 }}>📅</span>
                <span style={{ fontSize:13,color:C.textMuted }}>Set dates to enable tracking</span>
              </div>
            )}
          </div>

          {/* Outcome Card */}
          <div style={panel}>
            <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12 }}>
              <span style={{ fontSize:13,fontWeight:700,color:C.text }}>Outcome</span>
              <span style={{ fontSize:10,fontWeight:700,color:projectedMargin>=15?C.positive:projectedMargin>=5?"#D4913B":C.negative,padding:"3px 8px",borderRadius:4,background:(projectedMargin>=15?C.positive:projectedMargin>=5?"#D4913B":C.negative)+"12" }}>
                {projectedMargin}% margin
              </span>
            </div>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:8 }}>
              <div>
                <div style={{ fontSize:22,fontWeight:700,color:projectedProfit>=0?C.text:C.negative,fontVariantNumeric:"tabular-nums" }}>{cur(projectedProfit)}</div>
                <div style={{ fontSize:10,color:C.textMuted,marginTop:2 }}>Est. Profit</div>
              </div>
              <div>
                <div style={{ fontSize:22,fontWeight:700,color:C.text,fontVariantNumeric:"tabular-nums" }}>{cur(projectedRevenue)}</div>
                <div style={{ fontSize:10,color:C.textMuted,marginTop:2 }}>Revenue</div>
              </div>
            </div>
          </div>

          {/* Last Update Card */}
          <div style={panel}>
            <div style={{ fontSize:13,fontWeight:700,color:C.text,marginBottom:12 }}>Last Update</div>
            {lastActivity ? (
              <div>
                <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:4 }}>
                  <span style={{ fontSize:16 }}>⭐</span>
                  <span style={{ fontSize:13,fontWeight:500,color:C.text }}>{lastActivity.detail}</span>
                </div>
                <div style={{ fontSize:11,color:C.textMuted }}>{lastActivityAgo}</div>
              </div>
            ) : (
              <div>
                <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:4 }}>
                  <span style={{ fontSize:16 }}>⭐</span>
                  <span style={{ fontSize:13,fontWeight:500,color:C.text }}>Project created</span>
                </div>
                <div style={{ fontSize:11,color:C.textMuted }}>{timeAgo(p.created_at)}</div>
              </div>
            )}
          </div>
        </div>

        {/* ━━━ ALERT STRIP ━━━ */}
        {healthAlerts.length > 0 && (
          <div style={{ background:"rgba(255,243,230,0.6)",border:"1px solid rgba(212,145,59,0.25)",borderRadius:10,padding:"12px 20px",marginBottom:16,display:"flex",alignItems:"center",justifyContent:"space-between",cursor:"pointer" }}>
            <div style={{ display:"flex",alignItems:"center",gap:10 }}>
              <span style={{ fontSize:16 }}>⚠️</span>
              <span style={{ fontSize:13,color:"#c17a1a" }}>
                <strong>{healthAlerts[0].label}:</strong> {healthAlerts[0].detail}
              </span>
            </div>
            <span style={{ fontSize:16,color:"#D4913B" }}>›</span>
          </div>
        )}

        {/* ━━━ BOTTOM SECTION: PROJECT SUMMARY + WHAT'S NEXT ━━━ */}
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:16 }}>
          {/* Project Summary */}
          <div style={panel}>
            <h4 style={{ margin:"0 0 16px",fontSize:14,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em",color:C.text }}>Project Summary</h4>
            {[
              {l:"Development Type",v:p.project_info.development_type},
              {l:"Total Lots",v:p.project_info.lot_count || "—"},
              {l:"Per Home Target",v:cur(p.financials.target_price_per_home)},
              {l:"Land Cost",v:cur(p.financials.land_cost)},
              {l:"Last Updated",v:new Date(p.updated_at).toLocaleDateString()},
              {l:"Tool Outputs",v:totalOutputs},
            ].map((s,i) => (
              <div key={i} style={{ display:"flex",justifyContent:"space-between",padding:"9px 0",borderBottom:i<5?`1px solid ${C.borderLight}`:"none" }}>
                <span style={{ fontSize:13,color:C.textMuted }}>{s.l}</span>
                <span style={{ fontSize:13,fontWeight:600,color:C.text }}>{s.v}</span>
              </div>
            ))}
          </div>

          {/* What's Next */}
          <div style={{...panel,position:"relative",overflow:"hidden"}}>
            <h4 style={{ margin:"0 0 16px",fontSize:14,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em",color:C.text }}>What's Next</h4>
            <div style={{ position:"relative",zIndex:2 }}>
              {[
                { done: !!p.timeline.start_date, label: "Set project dates" },
                { done: (p.timeline.milestones||[]).length > 0, label: "Define milestones" },
                { done: p.financials.total_budget > 0, label: "Review budget assumptions" },
              ].map((item, i) => (
                <div key={i} style={{ display:"flex",alignItems:"center",gap:12,marginBottom:14 }}>
                  <div style={{ width:24,height:24,borderRadius:"50%",border:`2px solid ${item.done ? C.positive : C.border}`,background:item.done ? C.positive : "transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
                    {item.done && <span style={{ color:"#fff",fontSize:12,fontWeight:700 }}>✓</span>}
                  </div>
                  <span style={{ fontSize:14,color:item.done ? C.textMuted : C.text,fontWeight:500,textDecoration:item.done?"line-through":"none" }}>{item.label}</span>
                </div>
              ))}
            </div>
            {/* House illustration */}
            <svg viewBox="0 0 200 160" fill="none" style={{ position:"absolute",bottom:-10,right:-10,width:180,opacity:0.2 }}>
              <rect x="30" y="60" width="140" height="100" fill="#4c996a"/>
              <path d="M10,60 L100,10 L190,60" fill="#c0392b"/>
              <rect x="75" y="100" width="50" height="60" fill="#8b6914"/>
              <rect x="40" y="75" width="30" height="25" fill="#87ceeb"/>
              <rect x="130" y="75" width="30" height="25" fill="#87ceeb"/>
            </svg>
          </div>
        </div>

        {/* ━━━ PROJECT NOTES (if present) ━━━ */}
        {p.project_info.notes && (
          <div style={{...panel,marginTop:16}}>
            <h4 style={{ margin:"0 0 8px",fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",color:C.textMuted }}>Project Notes</h4>
            <p style={{ fontSize:14,lineHeight:1.7,color:C.text,margin:0 }}>{p.project_info.notes}</p>
          </div>
        )}

        {/* ━━━ Latest Saved Outputs ━━━ */}
        {(() => {
          const allOutputs = Object.entries(p.tool_outputs).flatMap(([key, outputs]) => outputs.map(o => ({ ...o, _key: key }))).sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5);
          if (allOutputs.length === 0) return null;
          return (
            <div style={{...panel,marginTop:16}}>
              <h4 style={{ margin:"0 0 10px",fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",color:C.textMuted }}>Latest Project Outputs</h4>
              <div style={{ display:"flex",flexDirection:"column",gap:6 }}>
                {allOutputs.map(o => {
                  const tool = TOOL_REGISTRY.find(t => t.output_key === o._key);
                  return (
                    <div key={o.id} style={{ display:"flex",alignItems:"center",gap:10,padding:"8px 12px",background:C.surfaceAlt,borderRadius:8 }}>
                      <span style={{ fontSize:18 }}>{tool?.icon || "📁"}</span>
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
          <div style={{...panel,padding:"12px 16px",marginTop:16,borderColor:"rgba(59,139,202,0.2)",background:"rgba(59,139,202,0.03)" }}>
            <div style={{ display:"flex",alignItems:"center",gap:8 }}>
              <span style={{ fontSize:14 }}>🔗</span>
              <div>
                <div style={{ fontSize:12,fontWeight:600,color:C.accent }}>Financials synced from Pro Forma</div>
                <div style={{ fontSize:11,color:C.textMuted }}>Revenue and profit projections updated {new Date(p.financials._proforma_synced).toLocaleDateString()} · Margin: {p.financials._proforma_margin || 0}%</div>
              </div>
            </div>
          </div>
        )}

        {/* Monthly Chart */}
        {monthlyData.length > 0 && (
          <div style={{...panel,padding:"16px 14px 10px",marginTop:16}}>
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


  // ─── SETTINGS ───
  const renderSettings = () => (
    <div>
      <div style={{ display:"flex",alignItems:"center",gap:12,marginBottom:28 }}>
        <button style={btnOutline} onClick={()=>setView("home")}>← Back</button>
        <h2 style={{ fontSize:22,fontWeight:700,margin:0 }}>Settings</h2>
      </div>
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:16 }}>
        {/* Profile */}
        <div style={panel}>
          <h4 style={{ margin:"0 0 16px",fontSize:14,fontWeight:700,color:C.text }}>Profile</h4>
          <div style={{ display:"flex",alignItems:"center",gap:14,marginBottom:20 }}>
            <div style={{ width:56,height:56,borderRadius:"50%",background:C.accent,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:20,fontWeight:700 }}>DK</div>
            <div>
              <div style={{ fontSize:16,fontWeight:700,color:C.text }}>Devan K.</div>
              <div style={{ fontSize:12,color:C.textMuted }}>Project Manager</div>
              <div style={{ fontSize:11,color:C.textMuted,marginTop:2 }}>devan@ccbllc.com</div>
            </div>
          </div>
          <div style={{ borderTop:`1px solid ${C.borderLight}`,paddingTop:14 }}>
            <div style={{ fontSize:11,fontWeight:600,color:C.textMuted,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:8 }}>Account Actions</div>
            <button style={{...btnOutline,marginRight:8,fontSize:12}} onClick={()=>showToast("Profile editing coming soon")}>Edit Profile</button>
            <button style={{...btnOutline,color:C.negative,borderColor:"rgba(196,86,75,0.25)",fontSize:12}} onClick={()=>{try{sessionStorage.clear();}catch(e){} setIsAuthenticated(false);}}>Sign Out</button>
          </div>
        </div>
        {/* Platform */}
        <div style={panel}>
          <h4 style={{ margin:"0 0 16px",fontSize:14,fontWeight:700,color:C.text }}>Platform</h4>
          {[
            { label:"Theme", value:"Light", action:"Coming soon" },
            { label:"Default View", value:"Dashboard", action:"Coming soon" },
            { label:"Data Sync", value:apiSynced?"Connected":"Local Only", action:apiSynced?"Synced with Azure":"Using sample data" },
            { label:"API Endpoint", value:API_URL.replace("https://","").split("/")[0].substring(0,24)+"...", action:null },
          ].map((s,i) => (
            <div key={i} style={{ display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:i<3?`1px solid ${C.borderLight}`:"none" }}>
              <div>
                <div style={{ fontSize:13,fontWeight:500,color:C.text }}>{s.label}</div>
                {s.action && <div style={{ fontSize:11,color:C.textMuted }}>{s.action}</div>}
              </div>
              <span style={{ fontSize:12,fontWeight:600,color:C.accent }}>{s.value}</span>
            </div>
          ))}
        </div>
        {/* Data Management */}
        <div style={{...panel,gridColumn:"1/-1"}}>
          <h4 style={{ margin:"0 0 16px",fontSize:14,fontWeight:700,color:C.text }}>Data Management</h4>
          <div style={{ display:"flex",gap:12,flexWrap:"wrap" }}>
            <button style={{...btn(C.accent,"#fff"),fontSize:12}} onClick={()=>{const json=JSON.stringify(projects,null,2);const b=btoa(unescape(encodeURIComponent(json)));const a=document.createElement("a");a.href="data:application/json;base64,"+b;a.download="ccb_projects_backup.json";document.body.appendChild(a);a.click();document.body.removeChild(a);showToast("All projects exported");}}>Export All Projects</button>
            <button style={{...btnOutline,fontSize:12}} onClick={()=>showToast("Import coming soon")}>Import Projects</button>
            <button style={{...btnOutline,fontSize:12}} onClick={()=>{fetchProjects();showToast("Refreshing from server...");}}>Sync with Server</button>
          </div>
        </div>
      </div>
    </div>
  );

  // ── Sidebar Nav Items ──
  const sidebarItems = [
    { id:"overview", icon:"🏠", label:"Overview" },
    { id:"dashboard", icon:"📊", label:"Dashboard" },
    { id:"financials", icon:"💰", label:"Financials" },
    { id:"tools", icon:"🛠️", label:"Tools" },
    { id:"schedule", icon:"📅", label:"Schedule" },
    { id:"settings", icon:"⚙️", label:"Settings" },
  ];
  // Persist state to sessionStorage on changes
  useEffect(() => {
    try { sessionStorage.setItem("nw_view", view); } catch(e) {}
  }, [view]);
  useEffect(() => {
    try { sessionStorage.setItem("nw_wsTab", wsTab); } catch(e) {}
  }, [wsTab]);
  useEffect(() => {
    try { if(activeProjectId) sessionStorage.setItem("nw_projectId", activeProjectId); else sessionStorage.removeItem("nw_projectId"); } catch(e) {}
  }, [activeProjectId]);
  useEffect(() => {
    try { sessionStorage.setItem("nw_auth", isAuthenticated ? "true" : "false"); } catch(e) {}
  }, [isAuthenticated]);
  const sidebarTab = view === "settings" ? "settings" : view === "tool" && activeTool?.id === "scheduler" ? "schedule" : view === "tool" ? "tools" : view === "workspace" && wsTab === "financials" ? "financials" : view === "workspace" && wsTab === "tools" ? "tools" : view === "workspace" ? "dashboard" : view === "home" ? "overview" : "overview";

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
      <div style={{ fontFamily:font,background:C.bg,color:C.text,minHeight:"100vh",display:"flex",WebkitFontSmoothing:"antialiased" }}>
        {/* ━━━ LEFT SIDEBAR ━━━ */}
        <aside style={{ width:220,background:C.surface,borderRight:`1px solid ${C.border}`,display:"flex",flexDirection:"column",position:"sticky",top:0,height:"100vh",flexShrink:0,zIndex:60 }}>
          {/* Logo */}
          <div style={{ padding:"20px 22px 16px",cursor:"pointer" }} onClick={()=>{setView("home");}}>
            <img src={NW_LOGO_TAG} alt="Next Wave" style={{ height:38,width:"auto" }} />

          </div>
          {/* Nav Items */}
          <nav style={{ flex:1,padding:"8px 12px" }}>
            {sidebarItems.map(item => {
              const isActive = sidebarTab === item.id;
              return (<button key={item.id} onClick={() => {
                if (item.id === "overview") { setView("home"); }
                else if (item.id === "dashboard" && activeProject) { setWsTab("overview"); setView("workspace"); }
                else if (item.id === "financials" && activeProject) { setWsTab("financials"); setView("workspace"); }
                else if (item.id === "tools" && activeProject) { setWsTab("tools"); setView("workspace"); }
                else if (item.id === "schedule" && activeProject) { const sched = TOOL_REGISTRY.find(t=>t.id==="scheduler"); if(sched&&sched.status==="active"){setActiveTool(sched);setView("tool");}else{setWsTab("overview");setView("workspace");} }
                else if (item.id === "settings") { setView("settings"); }
                else if (!activeProject && (item.id === "dashboard" || item.id === "financials" || item.id === "tools" || item.id === "schedule")) { showToast("Select a project first"); }
              }} style={{
                display:"flex",alignItems:"center",gap:12,width:"100%",padding:"11px 14px",borderRadius:10,border:"none",
                background:isActive ? C.accentSoft : "transparent",color:isActive ? C.accent : C.textMid,
                fontSize:13,fontWeight:isActive ? 700 : 500,cursor:"pointer",fontFamily:font,marginBottom:2,transition:"all 0.15s",textAlign:"left"
              }}>
                <span style={{ fontSize:16 }}>{item.icon}</span>{item.label}
              </button>);
            })}
          </nav>
          {/* User */}
          <div style={{ padding:"16px 18px",borderTop:`1px solid ${C.borderLight}`,display:"flex",alignItems:"center",gap:10,cursor:"pointer" }}>
            <div style={{ width:36,height:36,borderRadius:"50%",background:C.accent,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:13,fontWeight:700 }}>DK</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13,fontWeight:600,color:C.text }}>Devan K.</div>
              <div style={{ fontSize:10,color:C.textMuted }}>Project Manager</div>
            </div>
            <span style={{ fontSize:14,color:C.textMuted }}>›</span>
          </div>
        </aside>

        {/* ━━━ MAIN AREA ━━━ */}
        <div style={{ flex:1,display:"flex",flexDirection:"column",minWidth:0 }}>
          {/* Top Bar */}
          <header style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 28px",background:C.surface,borderBottom:`1px solid ${C.border}`,position:"sticky",top:0,zIndex:50 }}>
            <div style={{ display:"flex",alignItems:"center",gap:12 }}>
              {projects.length>0&&(<select style={{...fieldInput,width:"auto",minWidth:200,padding:"8px 14px",fontSize:13,cursor:"pointer",borderRadius:8,fontWeight:600}} value={activeProjectId||""} onChange={e=>{const id=e.target.value;if(id){setActiveProjectId(id);setWsTab("overview");setView("workspace");}else{setView("home");}}}>
                <option value="">All Projects</option>{projects.map(p=>(<option key={p.id} value={p.id}>{p.project_info.name}</option>))}
              </select>)}
            </div>
            <div style={{ display:"flex",alignItems:"center",gap:8 }}>
              {activeProject && <span style={{ fontSize:12,color:C.textMuted }}>{new Date().toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric",year:"numeric"})}</span>}
            </div>
          </header>

          {/* Content */}
          <main style={{ flex:1,padding:"24px 28px",maxWidth:1280,width:"100%",margin:"0 auto",animation:"fadeUp 0.25s ease",overflowY:"auto" }}>
            {view==="home"&&renderHome()}
            {view==="create"&&renderForm(false)}
            {view==="edit"&&renderForm(true)}
            {view==="workspace"&&renderWorkspace()}
            {view==="settings"&&renderSettings()}
            {view==="tool"&&activeTool?.component&&activeProject&&(
              <activeTool.component project={activeProject} onSave={handleToolSave} onClose={()=>{setActiveTool(null);setView("workspace");}} />
            )}
          </main>
        </div>
        {toast&&(<div style={{ position:"fixed",bottom:28,left:"50%",transform:"translateX(-50%)",background:C.surface,border:`1px solid ${C.accent}`,color:C.accent,padding:"10px 22px",borderRadius:10,fontSize:13,fontWeight:600,boxShadow:"0 4px 16px rgba(0,0,0,0.08)",animation:"toastIn 0.2s ease",zIndex:100 }}>{toast}</div>)}
      </div>
    </>
  );
}
