import { useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, Cell, PieChart, Pie, LabelList } from "recharts";

// ============================================================
// DATA
// ============================================================
const CANAL_MAP = {
  "EUREST/COMPASS": "Catering",
  "SODEXO": "Catering",
  "COPEC PUNTO": "Petroleras",
  "ENEX/SHELL": "Petroleras",
  "PETROBRAS": "Petroleras",
  "DOGGIS": "Fast Food",
  "JUAN MAESTRO": "Fast Food",
  "MC DONALDS": "Fast Food",
  "SUBWAY": "Fast Food",
  "TARRAGONA": "Fast Food",
  "OXXO": "C Stores",
  "OK MARKET": "C Stores",
  "CINE HOYTS": "Entretención",
  "CINEMARK": "Entretención",
  "ENJOY": "Entretención",
  "PAPA JOHNS": "Pizzería",
};

const CANALES = ["Catering", "Petroleras", "Fast Food", "C Stores", "Entretención", "Pizzería"];
const MESES = ["Enero", "Febrero"];
const ALL_CADENAS = Object.keys(CANAL_MAP);
const TARGETS = { fr: 95.0, quiebre: 2.0, retorno: 1.5 };

const RAW = {
  embonor: {
    Enero: {
      "SODEXO": { cf_sol: 125110, cf: 120137, fr: 96.0, quiebre: 2.7, retorno: 1.3 },
      "COPEC PUNTO": { cf_sol: 133117, cf: 126457, fr: 95.0, quiebre: 3.4, retorno: 1.6 },
      "ENEX/SHELL": { cf_sol: 69610, cf: 66496, fr: 95.5, quiebre: 3.5, retorno: 1.0 },
      "PETROBRAS": { cf_sol: 64030, cf: 61091, fr: 95.4, quiebre: 3.3, retorno: 1.2 },
      "DOGGIS": { cf_sol: 8597, cf: 8030, fr: 93.4, quiebre: 4.4, retorno: 2.2 },
      "JUAN MAESTRO": { cf_sol: 4921, cf: 4516, fr: 91.8, quiebre: 3.5, retorno: 4.7 },
      "MC DONALDS": { cf_sol: 6262, cf: 5828, fr: 93.1, quiebre: 4.3, retorno: 2.6 },
      "SUBWAY": { cf_sol: 11060, cf: 10563, fr: 95.5, quiebre: 2.7, retorno: 1.7 },
      "TARRAGONA": { cf_sol: 4785, cf: 4643, fr: 97.0, quiebre: 1.7, retorno: 1.3 },
      "OXXO": { cf_sol: 18260, cf: 16899, fr: 92.5, quiebre: 5.8, retorno: 1.6 },
      "OK MARKET": { cf_sol: 9115, cf: 8494, fr: 93.2, quiebre: 5.0, retorno: 1.8 },
      "CINE HOYTS": { cf_sol: 1673, cf: 1571, fr: 93.9, quiebre: 5.9, retorno: 0.2 },
      "CINEMARK": { cf_sol: 2944, cf: 2669, fr: 90.7, quiebre: 3.7, retorno: 5.6 },
      "ENJOY": { cf_sol: 13404, cf: 13023, fr: 97.2, quiebre: 2.6, retorno: 0.3 },
      "PAPA JOHNS": { cf_sol: 22723, cf: 22396, fr: 98.6, quiebre: 0.8, retorno: 0.6 },
    },
    Febrero: {
      "SODEXO": { cf_sol: 103707, cf: 102256, fr: 98.6, quiebre: 0.6, retorno: 0.8 },
      "COPEC PUNTO": { cf_sol: 131752, cf: 126332, fr: 95.9, quiebre: 2.8, retorno: 1.4 },
      "ENEX/SHELL": { cf_sol: 71702, cf: 68874, fr: 96.1, quiebre: 2.5, retorno: 1.5 },
      "PETROBRAS": { cf_sol: 65464, cf: 62552, fr: 95.6, quiebre: 2.4, retorno: 1.9 },
      "DOGGIS": { cf_sol: 8914, cf: 7844, fr: 88.0, quiebre: 10.1, retorno: 0.9 },
      "JUAN MAESTRO": { cf_sol: 3777, cf: 3600, fr: 95.3, quiebre: 2.6, retorno: 2.1 },
      "MC DONALDS": { cf_sol: 5962, cf: 5783, fr: 97.0, quiebre: 1.2, retorno: 1.8 },
      "SUBWAY": { cf_sol: 10428, cf: 9895, fr: 94.9, quiebre: 2.7, retorno: 1.3 },
      "TARRAGONA": { cf_sol: 5394, cf: 5180, fr: 96.0, quiebre: 1.6, retorno: 2.4 },
      "OXXO": { cf_sol: 19036, cf: 17681, fr: 92.9, quiebre: 4.6, retorno: 2.3 },
      "OK MARKET": { cf_sol: 8517, cf: 7875, fr: 92.5, quiebre: 3.5, retorno: 4.1 },
      "CINE HOYTS": { cf_sol: 1021, cf: 971, fr: 95.1, quiebre: 4.9, retorno: 0.0 },
      "CINEMARK": { cf_sol: 2053, cf: 1935, fr: 94.3, quiebre: 5.2, retorno: 0.6 },
      "ENJOY": { cf_sol: 12120, cf: 11979, fr: 98.8, quiebre: 0.5, retorno: 0.6 },
      "PAPA JOHNS": { cf_sol: 23865, cf: 23505, fr: 98.5, quiebre: 0.6, retorno: 0.9 },
    },
  },
  andina: {
    Enero: {
      "EUREST/COMPASS": { cf_sol: 160084, cf: 153892, fr: 96.1, quiebre: 1.1, retorno: 2.2 },
      "SODEXO": { cf_sol: 195715, cf: 181375, fr: 92.7, quiebre: 0.5, retorno: 2.5 },
      "COPEC PUNTO": { cf_sol: 238693, cf: 230330, fr: 96.5, quiebre: 1.1, retorno: 1.8 },
      "ENEX/SHELL": { cf_sol: 93740, cf: 90404, fr: 96.4, quiebre: 1.3, retorno: 1.9 },
      "PETROBRAS": { cf_sol: 115247, cf: 110755, fr: 96.1, quiebre: 0.9, retorno: 2.5 },
      "DOGGIS": { cf_sol: 6611, cf: 6129, fr: 92.7, quiebre: 0.8, retorno: 6.4 },
      "JUAN MAESTRO": { cf_sol: 6172, cf: 5498, fr: 89.1, quiebre: 0.3, retorno: 9.6 },
      "MC DONALDS": { cf_sol: 8874, cf: 8773, fr: 98.9, quiebre: 0.3, retorno: 0.7 },
      "SUBWAY": { cf_sol: 14776, cf: 14368, fr: 97.2, quiebre: 0.2, retorno: 2.2 },
      "TARRAGONA": { cf_sol: 7861, cf: 7640, fr: 97.2, quiebre: 0.9, retorno: 1.5 },
      "OXXO": { cf_sol: 137560, cf: 127746, fr: 92.9, quiebre: 1.5, retorno: 3.8 },
      "OK MARKET": { cf_sol: 32283, cf: 30359, fr: 94.0, quiebre: 1.9, retorno: 2.8 },
      "CINE HOYTS": { cf_sol: 4399, cf: 4325, fr: 98.3, quiebre: 0.6, retorno: 0.9 },
      "CINEMARK": { cf_sol: 4505, cf: 4408, fr: 97.9, quiebre: 0.7, retorno: 1.5 },
      "PAPA JOHNS": { cf_sol: 31437, cf: 30499, fr: 97.0, quiebre: 1.3, retorno: 1.6 },
    },
    Febrero: {
      "EUREST/COMPASS": { cf_sol: 145136, cf: 138602, fr: 95.5, quiebre: 1.3, retorno: 3.2 },
      "SODEXO": { cf_sol: 184901, cf: 177241, fr: 95.9, quiebre: 0.8, retorno: 1.7 },
      "COPEC PUNTO": { cf_sol: 220346, cf: 214779, fr: 97.5, quiebre: 0.6, retorno: 1.1 },
      "ENEX/SHELL": { cf_sol: 87613, cf: 83644, fr: 95.5, quiebre: 0.5, retorno: 2.8 },
      "PETROBRAS": { cf_sol: 105292, cf: 102410, fr: 97.3, quiebre: 0.5, retorno: 1.4 },
      "DOGGIS": { cf_sol: 5486, cf: 5191, fr: 94.6, quiebre: 0.3, retorno: 4.5 },
      "JUAN MAESTRO": { cf_sol: 4534, cf: 4329, fr: 95.5, quiebre: 0.3, retorno: 3.3 },
      "MC DONALDS": { cf_sol: 8851, cf: 8655, fr: 97.8, quiebre: 0.7, retorno: 0.9 },
      "SUBWAY": { cf_sol: 12178, cf: 11827, fr: 97.1, quiebre: 0.4, retorno: 1.3 },
      "TARRAGONA": { cf_sol: 6530, cf: 6247, fr: 95.7, quiebre: 1.0, retorno: 2.8 },
      "OXXO": { cf_sol: 123245, cf: 116827, fr: 94.8, quiebre: 0.8, retorno: 3.6 },
      "OK MARKET": { cf_sol: 29595, cf: 27776, fr: 93.9, quiebre: 0.6, retorno: 2.9 },
      "CINE HOYTS": { cf_sol: 4149, cf: 4065, fr: 98.0, quiebre: 0.9, retorno: 0.9 },
      "CINEMARK": { cf_sol: 3474, cf: 3415, fr: 98.3, quiebre: 0.5, retorno: 1.0 },
      "PAPA JOHNS": { cf_sol: 31910, cf: 31407, fr: 98.4, quiebre: 0.5, retorno: 0.7 },
    },
  },
};

// ============================================================
// HELPERS
// ============================================================
function calcWeighted(items) {
  let totalSol = 0, totalCf = 0, totalQ = 0, totalR = 0;
  items.forEach(d => {
    totalSol += d.cf_sol;
    totalCf += d.cf;
    totalQ += d.cf_sol * d.quiebre / 100;
    totalR += d.cf_sol * d.retorno / 100;
  });
  if (totalSol === 0) return { fr: 0, quiebre: 0, retorno: 0, cf_sol: 0, cf: 0 };
  return {
    fr: +(totalCf / totalSol * 100).toFixed(1),
    quiebre: +(totalQ / totalSol * 100).toFixed(1),
    retorno: +(totalR / totalSol * 100).toFixed(1),
    cf_sol: totalSol,
    cf: totalCf,
  };
}

function getForPeriod(source, mes) {
  if (mes === "YTD") {
    const all = {};
    MESES.forEach(m => {
      Object.entries(source[m] || {}).forEach(([cadena, d]) => {
        if (!all[cadena]) all[cadena] = [];
        all[cadena].push(d);
      });
    });
    const result = {};
    Object.entries(all).forEach(([cadena, items]) => {
      let tSol = 0, tCf = 0, tQcf = 0, tRcf = 0;
      items.forEach(d => {
        tSol += d.cf_sol; tCf += d.cf;
        tQcf += d.cf_sol * d.quiebre / 100;
        tRcf += d.cf_sol * d.retorno / 100;
      });
      result[cadena] = {
        cf_sol: tSol, cf: tCf,
        fr: +(tCf / tSol * 100).toFixed(1),
        quiebre: +(tQcf / tSol * 100).toFixed(1),
        retorno: +(tRcf / tSol * 100).toFixed(1),
      };
    });
    return result;
  }
  return source[mes] || {};
}

function getColor(fr) {
  if (fr > 95) return "#15803d";    // Verde Oscuro
  if (fr > 92) return "#4ade80";    // Verde Claro
  if (fr > 90) return "#fb923c";    // Naranja Claro
  if (fr > 85) return "#ea580c";    // Naranja Oscuro
  if (fr > 80) return "#ef4444";    // Rojo Claro
  return "#991b1b";                  // Rojo Oscuro
}

function getHeatmap(fr) {
  if (fr > 95) return { bg: "#dcfce7", fg: "#15803d" };    // Verde Oscuro
  if (fr > 92) return { bg: "#f0fdf4", fg: "#16a34a" };    // Verde Claro
  if (fr > 90) return { bg: "#fff7ed", fg: "#ea580c" };    // Naranja Claro
  if (fr > 85) return { bg: "#ffedd5", fg: "#c2410c" };    // Naranja Oscuro
  if (fr > 80) return { bg: "#fee2e2", fg: "#dc2626" };    // Rojo Claro
  return { bg: "#fecaca", fg: "#991b1b" };                   // Rojo Oscuro
}

const fmt = (n) => n != null ? Math.round(n).toLocaleString("es-CL") : "-";
const fmtP = (n) => n != null ? `${n.toFixed(1)}%` : "-";
const fmtD = (n) => n > 0 ? `+${n.toFixed(1)}` : n.toFixed(1);

// Custom label for line chart dots — shows % above the point
const DotLabel = ({ x, y, value, stroke }) => (
  <text x={x} y={y - 12} fill={stroke || "#374151"} fontSize={11} fontWeight={700} textAnchor="middle">{value != null ? `${value.toFixed(1)}%` : ""}</text>
);

// Custom label for bar chart tops — accepts labelFill for dark mode
const BarLabel = (props) => {
  const { x, y, width, value, labelFill } = props;
  if (value == null) return null;
  return <text x={x + width / 2} y={y - 5} fill={labelFill || "#374151"} fontSize={10} fontWeight={600} textAnchor="middle">{`${value.toFixed(1)}%`}</text>;
};

// ============================================================
// COMPONENT
// ============================================================
export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("resumen");
  const [selectedMes, setSelectedMes] = useState("Febrero");
  const [selectedCanal, setSelectedCanal] = useState("Todos");
  const [selectedEmb, setSelectedEmb] = useState("Total Chile");
  const [selectedCadena, setSelectedCadena] = useState("Todas");
  const [hoveredRow, setHoveredRow] = useState(null);

  // Theme constants
  const T = {
    bg: "#f8f9fb", cardBg: "white", controlBg: "#f3f4f6", controlBorder: "#e5e7eb",
    text: "#1f2937", textMuted: "#6b7280", textDim: "#9ca3af",
    headerBg: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
    tabBg: "#f3f4f6", tabActive: "white", tabText: "#1f2937", tabInactive: "#9ca3af",
    tableBorder: "#f3f4f6", tableHover: "#f0f4ff",
    selectBg: "white", selectText: "#374151", selectBorder: "#e5e7eb",
    gridStroke: "#f0f0f0", chartLabel: "#374151",
  };

  const periodos = ["YTD", ...MESES];

  // ============================================================
  // COMPUTED DATA
  // ============================================================
  const embData = useMemo(() => getForPeriod(RAW.embonor, selectedMes), [selectedMes]);
  const andData = useMemo(() => getForPeriod(RAW.andina, selectedMes), [selectedMes]);

  const totalChile = useMemo(() => {
    const r = {};
    new Set([...Object.keys(embData), ...Object.keys(andData)]).forEach(c => {
      const items = [embData[c], andData[c]].filter(Boolean);
      r[c] = calcWeighted(items);
    });
    return r;
  }, [embData, andData]);

  // Filter cadenas — must be before totals so they can use it
  const filteredCadenas = useMemo(() => {
    let c = ALL_CADENAS;
    if (selectedCanal !== "Todos") c = c.filter(x => CANAL_MAP[x] === selectedCanal);
    if (selectedCadena !== "Todas") c = c.filter(x => x === selectedCadena);
    return c;
  }, [selectedCanal, selectedCadena]);

  const sortedCadenas = useMemo(() =>
    [...filteredCadenas].sort((a, b) => {
      const d = CANALES.indexOf(CANAL_MAP[a]) - CANALES.indexOf(CANAL_MAP[b]);
      return d !== 0 ? d : a.localeCompare(b);
    })
  , [filteredCadenas]);

  const totals = useMemo(() => {
    const eItems = filteredCadenas.map(c => embData[c]).filter(Boolean);
    const aItems = filteredCadenas.map(c => andData[c]).filter(Boolean);
    return {
      embonor: calcWeighted(eItems),
      andina: calcWeighted(aItems),
      chile: calcWeighted([...eItems, ...aItems]),
    };
  }, [embData, andData, filteredCadenas]);

  // Previous month for MoM
  const prev = useMemo(() => {
    const idx = MESES.indexOf(selectedMes);
    if (idx <= 0) return null;
    const pm = MESES[idx - 1];
    const eP = getForPeriod(RAW.embonor, pm);
    const aP = getForPeriod(RAW.andina, pm);
    const eItems = filteredCadenas.map(c => eP[c]).filter(Boolean);
    const aItems = filteredCadenas.map(c => aP[c]).filter(Boolean);
    return {
      embonor: calcWeighted(eItems),
      andina: calcWeighted(aItems),
      chile: calcWeighted([...eItems, ...aItems]),
      mesName: pm,
    };
  }, [selectedMes, filteredCadenas]);

  const sourceData = useMemo(() => {
    const src = selectedEmb === "Embonor" ? embData : selectedEmb === "Andina" ? andData : totalChile;
    const filtered = {};
    filteredCadenas.forEach(c => { if (src[c]) filtered[c] = src[c]; });
    return filtered;
  }, [selectedEmb, embData, andData, totalChile, filteredCadenas]);

  const sourceTotals = useMemo(() =>
    selectedEmb === "Embonor" ? totals.embonor : selectedEmb === "Andina" ? totals.andina : totals.chile
  , [selectedEmb, totals]);

  const prevTotals = useMemo(() => {
    if (!prev) return null;
    return selectedEmb === "Embonor" ? prev.embonor : selectedEmb === "Andina" ? prev.andina : prev.chile;
  }, [selectedEmb, prev]);

  // Problem ranking
  const problemRanking = useMemo(() =>
    ALL_CADENAS.map(c => {
      const d = sourceData[c];
      if (!d) return null;
      return { cadena: c, canal: CANAL_MAP[c], fr: d.fr, quiebre: d.quiebre, retorno: d.retorno, cfNot: Math.round(d.cf_sol - d.cf), cf_sol: d.cf_sol };
    }).filter(Boolean).sort((a, b) => b.cfNot - a.cfNot)
  , [sourceData]);

  // Concentration
  const concentration = useMemo(() => {
    const total = problemRanking.reduce((s, r) => s + r.cfNot, 0);
    const top3 = problemRanking.slice(0, 3);
    const top3Sum = top3.reduce((s, r) => s + r.cfNot, 0);
    return { top3, pct: total > 0 ? +((top3Sum / total) * 100).toFixed(1) : 0, top3Sum, total, names: top3.map(r => r.cadena) };
  }, [problemRanking]);

  // Automated insights
  const insights = useMemo(() => {
    const list = [];
    const t = sourceTotals;

    if (prev && prevTotals) {
      const d = +(t.fr - prevTotals.fr).toFixed(1);
      if (d > 0) list.push({ icon: "📈", text: `Fill Rate ${selectedEmb} mejoró ${fmtD(d)} pts vs ${prev.mesName}`, type: "pos" });
      else if (d < 0) list.push({ icon: "📉", text: `Fill Rate ${selectedEmb} cayó ${fmtD(d)} pts vs ${prev.mesName}`, type: "neg" });

      const dQ = +(t.quiebre - prevTotals.quiebre).toFixed(1);
      if (dQ < -0.2) list.push({ icon: "✅", text: `${selectedEmb} redujo Quiebre en ${fmtD(dQ)} pts vs ${prev.mesName}`, type: "pos" });
      else if (dQ > 0.2) list.push({ icon: "⚠️", text: `${selectedEmb} aumentó Quiebre en ${fmtD(dQ)} pts vs ${prev.mesName}`, type: "neg" });
    }

    if (problemRanking.length > 0) {
      const w = problemRanking[0];
      const canalItems = filteredCadenas.filter(c => CANAL_MAP[c] === w.canal).map(c => sourceData[c]).filter(Boolean);
      const canalNot = canalItems.reduce((s, d) => s + (d.cf_sol - d.cf), 0);
      const pct = canalNot > 0 ? Math.round((w.cfNot / canalNot) * 100) : 0;
      if (pct > 25) list.push({ icon: "🔴", text: `${w.cadena} explica ${pct}% del volumen no entregado en ${w.canal}`, type: "neg" });
    }

    if (concentration.pct > 40) {
      list.push({ icon: "🎯", text: `Top 3 clientes concentran ${concentration.pct}% del volumen total no entregado`, type: "neutral" });
    }

    const gap = +(t.fr - TARGETS.fr).toFixed(1);
    if (gap < 0) list.push({ icon: "🎯", text: `Fill Rate a ${Math.abs(gap)} pts del target (${TARGETS.fr}%)`, type: "neutral" });
    else list.push({ icon: "🏆", text: `Fill Rate superó el target en ${fmtD(gap)} pts`, type: "pos" });

    return list;
  }, [sourceTotals, prevTotals, prev, problemRanking, concentration, selectedEmb, sourceData]);

  // ============================================================
  // TABS
  // ============================================================
  const tabs = [
    { id: "resumen", label: "Resumen General" },
    { id: "detalle", label: "Detalle por Cliente" },
    { id: "causas", label: "Causas No Entrega" },
    { id: "tendencia", label: "Tendencia Mensual" },
  ];

  // ============================================================
  // SHARED COMPONENTS
  // ============================================================
  const MoM = ({ cur, prv, mesN, inv = false }) => {
    if (prv == null) return null;
    const d = +(cur - prv).toFixed(1);
    if (d === 0) return <span style={{ fontSize: 11, color: T.textDim }}>= vs {mesN}</span>;
    const good = inv ? d < 0 : d > 0;
    return <span style={{ fontSize: 11, fontWeight: 600, color: good ? "#16a34a" : "#dc2626" }}>{d > 0 ? "↑" : "↓"} {fmtD(d)} vs {mesN}</span>;
  };

  const KPICard = ({ title, value, target, cf_sol, cf, color, prevVal, prevMes, isNeg = false }) => {
    const v = parseFloat(value);
    const gap = target != null ? +(v - target).toFixed(1) : null;
    const goodGap = isNeg ? gap <= 0 : gap >= 0;
    const cfNot = cf_sol && cf ? Math.round(cf_sol - cf) : null;

    return (
      <div style={{
        background: T.cardBg, borderRadius: 16, padding: "18px 22px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.04)",
        borderLeft: `4px solid ${color}`, flex: 1, minWidth: 210,
      }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: T.text, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 5 }}>{title}</div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
          <span style={{ fontSize: 30, fontWeight: 800, color, letterSpacing: "-0.02em", lineHeight: 1 }}>{fmtP(v)}</span>
          {gap != null && (
            <span style={{
              fontSize: 12, fontWeight: 700, padding: "2px 7px", borderRadius: 6,
              background: goodGap ? "rgba(22,163,74,0.15)" : "rgba(220,38,38,0.15)",
              color: goodGap ? "#16a34a" : "#dc2626",
            }}>{goodGap ? "↑" : "↓"} {fmtD(gap)}</span>
          )}
        </div>
        {target != null && <div style={{ fontSize: 10, color: T.textDim, marginTop: 3 }}>Target: {target}%</div>}
        {prevVal != null && prevMes && <div style={{ marginTop: 3 }}><MoM cur={v} prv={prevVal} mesN={prevMes} inv={isNeg} /></div>}
        {cfNot != null && (
          <div style={{ marginTop: 6, padding: "5px 9px", borderRadius: 7, background: isNeg ? ("rgba(220,38,38,0.05)") : ("rgba(0,0,0,0.02)"), fontSize: 11, color: T.textMuted }}>
            {isNeg
              ? <><span style={{ fontWeight: 700, color: "#dc2626" }}>{fmt(cfNot)}</span> CF no entregadas</>
              : <>{fmt(cf)} / {fmt(cf_sol)} CF</>
            }
          </div>
        )}
      </div>
    );
  };

  // ============================================================
  // RENDER: RESUMEN
  // ============================================================
  const renderResumen = () => {
    const activeCanales = selectedCanal !== "Todos" ? [selectedCanal] : CANALES;
    const barData = activeCanales.map(canal => {
      const cads = filteredCadenas.filter(c => CANAL_MAP[c] === canal);
      return {
        canal,
        Embonor: calcWeighted(cads.map(c => embData[c]).filter(Boolean)).fr,
        Andina: calcWeighted(cads.map(c => andData[c]).filter(Boolean)).fr,
        "Total Chile": calcWeighted([...cads.map(c => embData[c]).filter(Boolean), ...cads.map(c => andData[c]).filter(Boolean)]).fr,
      };
    });

    return (
      <div>
        {/* #9 Chile KPIs first */}
        <div style={{ display: "flex", gap: 14, marginBottom: 16, flexWrap: "wrap" }}>
          <KPICard title="Fill Rate Chile" value={totals.chile.fr} target={TARGETS.fr} cf_sol={totals.chile.cf_sol} cf={totals.chile.cf} color="#881337" prevVal={prev?.chile.fr} prevMes={prev?.mesName} />
          <KPICard title="Quiebre Chile" value={totals.chile.quiebre} target={TARGETS.quiebre} cf_sol={totals.chile.cf_sol} cf={totals.chile.cf} color="#dc2626" prevVal={prev?.chile.quiebre} prevMes={prev?.mesName} isNeg />
          <KPICard title="Retorno Chile" value={totals.chile.retorno} target={TARGETS.retorno} cf_sol={totals.chile.cf_sol} cf={totals.chile.cf} color="#F59E0B" prevVal={prev?.chile.retorno} prevMes={prev?.mesName} isNeg />
        </div>

        {/* Bottler KPIs */}
        <div style={{ display: "flex", gap: 14, marginBottom: 22, flexWrap: "wrap" }}>
          <KPICard title="FR Embonor" value={totals.embonor.fr} target={TARGETS.fr} cf_sol={totals.embonor.cf_sol} cf={totals.embonor.cf} color="#2563eb" prevVal={prev?.embonor.fr} prevMes={prev?.mesName} />
          <KPICard title="Quiebre Embonor" value={totals.embonor.quiebre} target={TARGETS.quiebre} cf_sol={totals.embonor.cf_sol} cf={totals.embonor.cf} color="#2563eb" prevVal={prev?.embonor.quiebre} prevMes={prev?.mesName} isNeg />
          <KPICard title="FR Andina" value={totals.andina.fr} target={TARGETS.fr} cf_sol={totals.andina.cf_sol} cf={totals.andina.cf} color="#059669" prevVal={prev?.andina.fr} prevMes={prev?.mesName} />
          <KPICard title="Quiebre Andina" value={totals.andina.quiebre} target={TARGETS.quiebre} cf_sol={totals.andina.cf_sol} cf={totals.andina.cf} color="#059669" prevVal={prev?.andina.quiebre} prevMes={prev?.mesName} isNeg />
        </div>

        {/* #8 Insights */}
        {insights.length > 0 && (
          <div style={{ background: T.cardBg, borderRadius: 16, padding: "16px 22px", marginBottom: 20, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", borderLeft: "4px solid #1f2937" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: T.text, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>
              Insights Clave — {selectedMes === "YTD" ? "YTD" : selectedMes} · {selectedEmb}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              {insights.map((ins, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: ins.type === "neg" ? "#dc2626" : ins.type === "pos" ? "#059669" : "#374151", fontWeight: ins.type === "neg" ? 600 : 400 }}>
                  <span style={{ fontSize: 14 }}>{ins.icon}</span><span>{ins.text}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* #7 Concentration */}
        <div style={{ background: "linear-gradient(135deg, #faf5ff, #f0f9ff)", borderRadius: 14, padding: "13px 20px", marginBottom: 22, display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap", border: "1px solid #e0e7ff" }}>
          <span style={{ fontSize: 20 }}>🎯</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: T.text }}>Top 3 clientes explican el <span style={{ fontSize: 17 }}>{concentration.pct}%</span> del volumen no entregado</div>
            <div style={{ fontSize: 11, color: T.textMuted, marginTop: 1 }}>{concentration.names.join(", ")} — {fmt(concentration.top3Sum)} de {fmt(concentration.total)} CF · {selectedEmb}</div>
          </div>
        </div>

        {/* Bar chart */}
        <div style={{ background: T.cardBg, borderRadius: 16, padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
          <h3 style={{ margin: "0 0 18px", fontSize: 15, fontWeight: 700, color: T.text }}>Fill Rate por Canal — {selectedMes}</h3>
          <ResponsiveContainer width="100%" height={340}>
            <BarChart data={barData} barGap={4} barSize={20} margin={{ top: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={T.gridStroke} />
              <XAxis dataKey="canal" tick={{ fontSize: 11, fill: T.textMuted }} />
              <YAxis domain={[80, 100]} tick={{ fontSize: 11, fill: T.textMuted }} tickFormatter={v => `${v}%`} />
              <Tooltip formatter={v => `${v.toFixed(1)}%`} contentStyle={{ borderRadius: 8, fontSize: 13, background: T.cardBg, border: "1px solid " + T.controlBorder, color: T.text }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="Embonor" fill="#2563eb" radius={[4,4,0,0]}><LabelList dataKey="Embonor" content={(p) => <BarLabel {...p} labelFill={T.chartLabel} />} /></Bar>
              <Bar dataKey="Andina" fill="#059669" radius={[4,4,0,0]}><LabelList dataKey="Andina" content={(p) => <BarLabel {...p} labelFill={T.chartLabel} />} /></Bar>
              <Bar dataKey="Total Chile" fill="#881337" radius={[4,4,0,0]}><LabelList dataKey="Total Chile" content={(p) => <BarLabel {...p} labelFill={T.chartLabel} />} /></Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  // ============================================================
  // RENDER: DETALLE
  // ============================================================
  const renderDetalle = () => {
    return (
      <div>
        {/* #3 Top problem chains */}
        <div style={{ background: T.cardBg, borderRadius: 16, padding: "18px 22px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", marginBottom: 18 }}>
          <h3 style={{ margin: "0 0 12px", fontSize: 14, fontWeight: 700, color: T.text }}>🔥 Top Clientes con Mayor Impacto — {selectedEmb}</h3>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {problemRanking.slice(0, 5).map((r, i) => (
              <div key={r.cadena} style={{
                flex: "1 1 170px", padding: "10px 14px", borderRadius: 12, minWidth: 155,
                background: i === 0 ? "#fef2f2" : i === 1 ? "#fff7ed" : "#f9fafb",
                border: `1px solid ${i === 0 ? "#fecaca" : i === 1 ? "#fed7aa" : "#d1d5db"}`,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
                  <span style={{
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    width: 20, height: 20, borderRadius: "50%", fontSize: 10, fontWeight: 800,
                    background: i === 0 ? "#dc2626" : i === 1 ? "#ea580c" : "#F59E0B", color: "white",
                  }}>#{i + 1}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: T.text }}>{r.cadena}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#6b7280" }}>
                  <span>FR: <strong style={{ color: getColor(r.fr) }}>{fmtP(r.fr)}</strong></span>
                  <span style={{ fontWeight: 700, color: "#dc2626" }}>{fmt(r.cfNot)} CF</span>
                </div>
                <div style={{ fontSize: 10, color: T.textDim, marginTop: 2 }}>{r.canal}</div>
              </div>
            ))}
          </div>
        </div>

        {/* #6 Heatmap table */}
        <div style={{ background: T.cardBg, borderRadius: 16, padding: 22, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", overflowX: "auto" }}>
          <h3 style={{ margin: "0 0 14px", fontSize: 15, fontWeight: 700, color: T.text }}>Detalle por Cliente — {selectedEmb} — {selectedMes}</h3>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
            <thead>
              <tr style={{ borderBottom: "2px solid " + T.controlBorder }}>
                {["Canal","Cliente","CF Solicitada","CF Entregada","CF No Entregada","Fill Rate","Quiebre","Retorno"].map((h,i) => (
                  <th key={h} style={{ textAlign: i<2?"left":i<5?"right":"center", padding:"9px 8px", fontWeight:700, color:T.text, fontSize:10, textTransform:"uppercase", letterSpacing:"0.04em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(() => {
                let lastVisibleCanal = "";
                return sortedCadenas.map(cadena => {
                  const canal = CANAL_MAP[cadena];
                  const d = sourceData[cadena];

                  if ((selectedEmb === "Embonor" && cadena === "EUREST/COMPASS") || (selectedEmb === "Andina" && cadena === "ENJOY")) {
                    return null;
                  }
                  if (!d) return null;

                  const showC = canal !== lastVisibleCanal;
                  lastVisibleCanal = canal;

                  // Count visible rows for this canal
                  const cCount = filteredCadenas.filter(c => {
                    if (selectedEmb === "Embonor" && c === "EUREST/COMPASS") return false;
                    if (selectedEmb === "Andina" && c === "ENJOY") return false;
                    return CANAL_MAP[c] === canal && sourceData[c];
                  }).length;

                  const cfNot = Math.round(d.cf_sol - d.cf);
                  const hm = getHeatmap(d.fr);
                  const isH = hoveredRow === cadena;

                  return (
                    <tr key={cadena} onMouseEnter={() => setHoveredRow(cadena)} onMouseLeave={() => setHoveredRow(null)}
                      style={{ borderBottom: "1px solid " + T.tableBorder, background: isH ? T.tableHover : "transparent", transition: "background 0.15s" }}>
                      {showC && <td style={{ padding: "9px 8px", fontWeight: 600, color: T.textMuted, verticalAlign: "top", fontSize: 11 }} rowSpan={cCount}>{canal}</td>}
                      <td style={{ padding: "9px 8px", fontWeight: 500, color: T.text }}>{cadena}</td>
                      <td style={{ padding: "9px 8px", textAlign: "right", color: T.textMuted, fontVariantNumeric: "tabular-nums" }}>{fmt(d.cf_sol)}</td>
                      <td style={{ padding: "9px 8px", textAlign: "right", color: T.textMuted, fontVariantNumeric: "tabular-nums" }}>{fmt(d.cf)}</td>
                      <td style={{ padding: "9px 8px", textAlign: "right", fontWeight: 600, color: "#dc2626", fontVariantNumeric: "tabular-nums" }}>{fmt(cfNot)}</td>
                      <td style={{ padding: "5px 8px", textAlign: "center" }}>
                        <span style={{ display: "inline-block", padding: "3px 12px", borderRadius: 6, fontWeight: 700, fontSize: 12.5, background: hm.bg, color: hm.fg, minWidth: 56 }}>{fmtP(d.fr)}</span>
                      </td>
                      <td style={{ padding: "9px 8px", textAlign: "center", color: "#dc2626", fontWeight: 600 }}>{fmtP(d.quiebre)}</td>
                      <td style={{ padding: "9px 8px", textAlign: "center", color: "#F59E0B", fontWeight: 600 }}>{fmtP(d.retorno)}</td>
                    </tr>
                  );
                });
              })()}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // ============================================================
  // RENDER: CAUSAS
  // ============================================================
  const renderCausas = () => {
    const causasData = sortedCadenas.map(c => {
      const d = sourceData[c];
      if (!d) return null;
      return {
        cadena: c, canal: CANAL_MAP[c], quiebre: d.quiebre, retorno: d.retorno,
        cfQ: Math.round(d.cf_sol * d.quiebre / 100), cfR: Math.round(d.cf_sol * d.retorno / 100),
        total: d.quiebre + d.retorno,
      };
    }).filter(Boolean).sort((a, b) => b.total - a.total);

    const t = sourceTotals;
    const pie = [{ name: "Quiebre", value: t.quiebre, fill: "#dc2626" }, { name: "Retorno", value: t.retorno, fill: "#F59E0B" }];
    const cfQ = Math.round(t.cf_sol * t.quiebre / 100);
    const cfR = Math.round(t.cf_sol * t.retorno / 100);

    return (
      <div>
        <div style={{ display: "flex", gap: 18, marginBottom: 22, flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 310px", background: T.cardBg, borderRadius: 16, padding: 22, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
            <h3 style={{ margin: "0 0 6px", fontSize: 14, fontWeight: 700, color: T.text }}>Composición No Entrega — {selectedEmb} — {selectedMes}</h3>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 24 }}>
              <ResponsiveContainer width={160} height={160}>
                <PieChart><Pie data={pie} dataKey="value" cx="50%" cy="50%" innerRadius={42} outerRadius={70} paddingAngle={3}>{pie.map((e, i) => <Cell key={i} fill={e.fill} />)}</Pie><Tooltip formatter={v => `${v.toFixed(1)}%`} /></PieChart>
              </ResponsiveContainer>
              <div>
                <div style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 1 }}>
                    <div style={{ width: 11, height: 11, borderRadius: 3, background: "#dc2626" }} />
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#dc2626" }}>{fmtP(t.quiebre)}</span>
                    <span style={{ fontSize: 11, color: "#6b7280" }}>Quiebre</span>
                  </div>
                  <div style={{ fontSize: 11, color: T.textDim, marginLeft: 18 }}>{fmt(cfQ)} CF</div>
                </div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 1 }}>
                    <div style={{ width: 11, height: 11, borderRadius: 3, background: "#F59E0B" }} />
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#F59E0B" }}>{fmtP(t.retorno)}</span>
                    <span style={{ fontSize: 11, color: "#6b7280" }}>Retorno</span>
                  </div>
                  <div style={{ fontSize: 11, color: T.textDim, marginLeft: 18 }}>{fmt(cfR)} CF</div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ flex: "1 1 240px", display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ background: "#fef2f2", borderRadius: 14, padding: "14px 18px", flex: 1, border: "1px solid #fecaca" }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#991b1b", textTransform: "uppercase" }}>Impacto Quiebre</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: "#dc2626", marginTop: 3 }}>{fmt(cfQ)} <span style={{ fontSize: 13, fontWeight: 600 }}>CF</span></div>
              <div style={{ fontSize: 10, color: T.textDim, marginTop: 1 }}>de {fmt(Math.round(t.cf_sol))} CF solicitadas</div>
            </div>
            <div style={{ background: "#f3f4f6", borderRadius: 14, padding: "14px 18px", flex: 1, border: "1px solid #fde68a" }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#1f2937", textTransform: "uppercase" }}>Impacto Retorno</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: "#F59E0B", marginTop: 3 }}>{fmt(cfR)} <span style={{ fontSize: 13, fontWeight: 600 }}>CF</span></div>
              <div style={{ fontSize: 10, color: T.textDim, marginTop: 1 }}>de {fmt(Math.round(t.cf_sol))} CF solicitadas</div>
            </div>
          </div>
        </div>

        <div style={{ background: T.cardBg, borderRadius: 16, padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
          <h3 style={{ margin: "0 0 18px", fontSize: 15, fontWeight: 700, color: T.text }}>Causas de No Entrega por Cliente — {selectedEmb} — {selectedMes}</h3>
          <ResponsiveContainer width="100%" height={Math.max(380, causasData.length * 32)}>
            <BarChart data={causasData} layout="vertical" barSize={17} margin={{ left: 110, right: 50 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={T.gridStroke} horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: T.textMuted }} tickFormatter={v => `${v}%`} />
              <YAxis type="category" dataKey="cadena" tick={{ fontSize: 11, fill: T.text }} width={105} />
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 13, background: T.cardBg, border: "1px solid " + T.controlBorder, color: T.text }} formatter={(v, name, p) => {
                const d = p.payload;
                return [`${v.toFixed(1)}% (${fmt(name === "Quiebre" ? d.cfQ : d.cfR)} CF)`, name];
              }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="quiebre" name="Quiebre" stackId="a" fill="#dc2626" />
              <Bar dataKey="retorno" name="Retorno" stackId="a" fill="#F59E0B" radius={[0,4,4,0]}>
                <LabelList dataKey="total" position="right" formatter={v => `${v.toFixed(1)}%`} style={{ fontSize: 10, fontWeight: 600, fill: T.text }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  // ============================================================
  // RENDER: TENDENCIA
  // ============================================================
  const renderTendencia = () => {
    const getCadenaList = () => {
      let cads = ALL_CADENAS;
      if (selectedCanal !== "Todos") cads = cads.filter(c => CANAL_MAP[c] === selectedCanal);
      if (selectedCadena !== "Todas") cads = cads.filter(c => c === selectedCadena);
      return cads;
    };
    const cadList = getCadenaList();

    // Always build all keys so recharts can find them
    const td = MESES.map(mes => {
      const embMes = RAW.embonor[mes] || {};
      const andMes = RAW.andina[mes] || {};
      const eItems = cadList.map(c => embMes[c]).filter(Boolean);
      const aItems = cadList.map(c => andMes[c]).filter(Boolean);
      const e = calcWeighted(eItems), a = calcWeighted(aItems), ch = calcWeighted([...eItems, ...aItems]);
      return {
        mes,
        frEmb: e.fr, frAnd: a.fr, frChi: ch.fr,
        qEmb: e.quiebre, qAnd: a.quiebre, qChi: ch.quiebre,
        rEmb: e.retorno, rAnd: a.retorno, rChi: ch.retorno,
      };
    });

    const chartMargin = { top: 25, right: 50, bottom: 5, left: 5 };
    const filterLabel = [selectedEmb, selectedCanal !== "Todos" ? selectedCanal : null, selectedCadena !== "Todas" ? selectedCadena : null].filter(Boolean).join(" · ");

    // Build line configs based on selected embotelladora
    const frLines = selectedEmb === "Embonor"
      ? [{ key: "frEmb", name: "FR Embonor", color: "#2563eb", dash: undefined }]
      : selectedEmb === "Andina"
      ? [{ key: "frAnd", name: "FR Andina", color: "#059669", dash: undefined }]
      : [
          { key: "frEmb", name: "FR Embonor", color: "#2563eb", dash: undefined },
          { key: "frAnd", name: "FR Andina", color: "#059669", dash: undefined },
          { key: "frChi", name: "FR Total Chile", color: "#881337", dash: "8 4" },
        ];

    const qLines = selectedEmb === "Embonor"
      ? [{ key: "qEmb", name: "Quiebre Embonor", color: "#2563eb" }]
      : selectedEmb === "Andina"
      ? [{ key: "qAnd", name: "Quiebre Andina", color: "#059669" }]
      : [
          { key: "qEmb", name: "Quiebre Embonor", color: "#2563eb" },
          { key: "qAnd", name: "Quiebre Andina", color: "#059669" },
          { key: "qChi", name: "Quiebre Total Chile", color: "#881337" },
        ];

    const rLines = selectedEmb === "Embonor"
      ? [{ key: "rEmb", name: "Retorno Embonor", color: "#2563eb" }]
      : selectedEmb === "Andina"
      ? [{ key: "rAnd", name: "Retorno Andina", color: "#059669" }]
      : [
          { key: "rEmb", name: "Retorno Embonor", color: "#2563eb" },
          { key: "rAnd", name: "Retorno Andina", color: "#059669" },
          { key: "rChi", name: "Retorno Total Chile", color: "#881337" },
        ];

    return (
      <div>
        <div style={{ background: T.cardBg, borderRadius: 16, padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", marginBottom: 22 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 18 }}>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: T.text }}>Evolución Fill Rate Mensual</h3>
            <span style={{ fontSize: 11, color: T.textDim }}>{filterLabel}</span>
          </div>
          <ResponsiveContainer width="100%" height={340}>
            <LineChart data={td} margin={chartMargin}>
              <CartesianGrid strokeDasharray="3 3" stroke={T.gridStroke} />
              <XAxis dataKey="mes" tick={{ fontSize: 12, fill: T.textMuted }} />
              <YAxis domain={[85, 100]} tick={{ fontSize: 11, fill: T.textMuted }} tickFormatter={v => `${v}%`} />
              <Tooltip formatter={v => `${v.toFixed(1)}%`} contentStyle={{ borderRadius: 8, fontSize: 13, background: T.cardBg, border: "1px solid " + T.controlBorder, color: T.text }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              {frLines.map(l => (
                <Line key={l.key} type="monotone" dataKey={l.key} name={l.name} stroke={l.color} strokeWidth={3} dot={{ r: 6, fill: l.color }} strokeDasharray={l.dash} label={<DotLabel stroke={l.color} />} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
          {[{ title: "Evolución Quiebre", lines: qLines }, { title: "Evolución Retorno", lines: rLines }].map(({ title, lines }) => (
            <div key={title} style={{ flex: 1, background: T.cardBg, borderRadius: 16, padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", minWidth: 330 }}>
              <h3 style={{ margin: "0 0 18px", fontSize: 15, fontWeight: 700, color: T.text }}>{title}</h3>
              <ResponsiveContainer width="100%" height={290}>
                <LineChart data={td} margin={chartMargin}>
                  <CartesianGrid strokeDasharray="3 3" stroke={T.gridStroke} />
                  <XAxis dataKey="mes" tick={{ fontSize: 12, fill: T.textMuted }} />
                  <YAxis tick={{ fontSize: 11, fill: T.textMuted }} tickFormatter={v => `${v}%`} />
                  <Tooltip formatter={v => `${v.toFixed(1)}%`} contentStyle={{ borderRadius: 8, fontSize: 13, background: T.cardBg, border: "1px solid " + T.controlBorder, color: T.text }} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  {lines.map(l => (
                    <Line key={l.key} type="monotone" dataKey={l.key} name={l.name} stroke={l.color} strokeWidth={2.5} dot={{ r: 5, fill: l.color }} label={<DotLabel stroke={l.color} />} />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ============================================================
  // MAIN RENDER
  // ============================================================
  return (
    <div style={{ minHeight: "100vh", background: T.bg, fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif", color: T.text }}>
      {/* Header */}
      <div style={{ background: "#030712", padding: "22px 36px 16px", color: "white", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: "#dc2626", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, fontWeight: 900, color: "white" }}>KO</div>
          <div>
            <h1 style={{ margin: 0, fontSize: 21, fontWeight: 800, letterSpacing: "-0.01em" }}>Dashboard Fill Rate — Canal On Premise</h1>
            <p style={{ margin: "1px 0 0", fontSize: 12, color: "#94a3b8" }}>Andina · Embonor · Total Chile — 2026</p>
          </div>
        </div>

      </div>

      {/* Controls */}
      <div style={{ background: T.cardBg, borderBottom: `1px solid ${T.controlBorder}`, padding: "9px 36px", display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: 2, background: T.tabBg, borderRadius: 10, padding: 3 }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
              padding: "6px 15px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600, transition: "all 0.2s",
              background: activeTab === t.id ? T.tabActive : "transparent", color: activeTab === t.id ? T.tabText : T.tabInactive,
              boxShadow: activeTab === t.id ? ("0 1px 3px rgba(0,0,0,0.08)") : "none",
            }}>{t.label}</button>
          ))}
        </div>

        <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ display: "flex", gap: 2, background: T.tabBg, borderRadius: 8, padding: 2 }}>
            {["Total Chile", "Embonor", "Andina"].map(e => (
              <button key={e} onClick={() => setSelectedEmb(e)} style={{
                padding: "4px 13px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 11, fontWeight: 600,
                background: selectedEmb === e ? (e === "Embonor" ? "#2563eb" : e === "Andina" ? "#059669" : "#881337") : "transparent",
                color: selectedEmb === e ? "white" : T.tabInactive,
              }}>{e}</button>
            ))}
          </div>

          {[
            { val: selectedMes, set: (v) => setSelectedMes(v), opts: periodos.map(p => ({ v: p, l: p })) },
            { val: selectedCanal, set: (v) => setSelectedCanal(v), opts: [{ v: "Todos", l: "Todos los Canales" }, ...CANALES.map(c => ({ v: c, l: c }))] },
            { val: selectedCadena, set: (v) => setSelectedCadena(v), opts: [{ v: "Todas", l: "Todos los Clientes" }, ...ALL_CADENAS.sort().map(c => ({ v: c, l: c }))] },
          ].map((s, i) => (
            <select key={i} value={s.val} onChange={e => s.set(e.target.value)} style={{
              padding: "4px 10px", borderRadius: 8, border: `1px solid ${T.selectBorder}`,
              fontSize: 11, fontWeight: 500, color: T.selectText, background: T.selectBg, cursor: "pointer",
            }}>
              {s.opts.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
            </select>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "22px 36px", maxWidth: 1320, margin: "0 auto" }}>
        {activeTab === "resumen" && renderResumen()}
        {activeTab === "detalle" && renderDetalle()}
        {activeTab === "causas" && renderCausas()}
        {activeTab === "tendencia" && renderTendencia()}
      </div>

    </div>
  );
}
