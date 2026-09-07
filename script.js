// Paleta y tipografía compartidas con styles.css
const MOSS = "#33513E";
const MOSS_LIGHT = "#6E8B78";
const CLAY = "#A65A2E";
const INK = "#1B241D";
const GRID = "#CBD1C1";

Chart.defaults.font.family = "IBM Plex Sans, sans-serif";
Chart.defaults.color = INK;

// ---------- Stats del encabezado ----------
document.getElementById("statTotal").textContent = DATA.total;
document.getElementById("statBarrios").textContent = DATA.total_barrios;
document.getElementById("statClasif").textContent = Object.keys(DATA.clasificacion).length;
document.getElementById("statOrdenanza").textContent = DATA.sin_ordenanza_pct + "%";

// ---------- Gráfico 1: Clasificación ----------
const clasifLabels = Object.keys(DATA.clasificacion);
const clasifValues = Object.values(DATA.clasificacion);

new Chart(document.getElementById("chartClasificacion"), {
  type: "bar",
  data: {
    labels: clasifLabels,
    datasets: [{
      data: clasifValues,
      backgroundColor: MOSS,
      borderRadius: 2,
      maxBarThickness: 46
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.parsed.y} espacios (${(ctx.parsed.y / DATA.total * 100).toFixed(1)}%)`
        }
      }
    },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { color: GRID }, beginAtZero: true }
    }
  }
});

// ---------- Gráfico 2: Top barrios ----------
const barrioLabels = Object.keys(DATA.top_barrios);
const barrioValues = Object.values(DATA.top_barrios);

new Chart(document.getElementById("chartBarrios"), {
  type: "bar",
  data: {
    labels: barrioLabels,
    datasets: [{
      data: barrioValues,
      backgroundColor: CLAY,
      borderRadius: 2,
      maxBarThickness: 22
    }]
  },
  options: {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.parsed.x} espacios (${(ctx.parsed.x / DATA.total * 100).toFixed(1)}%)`
        }
      }
    },
    scales: {
      x: { grid: { color: GRID }, beginAtZero: true },
      y: { grid: { display: false } }
    }
  }
});

// ---------- Gráfico 3: Nulos por columna ----------
const nuloLabels = Object.keys(DATA.nulos);
const nuloValues = Object.values(DATA.nulos);
const nuloColors = nuloValues.map(v => {
  const pct = v / DATA.total;
  if (pct === 0) return MOSS;
  if (pct > 0.1) return "#B4482E";
  return "#C79A3B";
});

new Chart(document.getElementById("chartNulos"), {
  type: "bar",
  data: {
    labels: nuloLabels,
    datasets: [{
      data: nuloValues,
      backgroundColor: nuloColors,
      borderRadius: 2,
      maxBarThickness: 40
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.parsed.y} valores faltantes (${(ctx.parsed.y / DATA.total * 100).toFixed(1)}%)`
        }
      }
    },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { color: GRID }, beginAtZero: true, title: { display: true, text: "Valores faltantes" } }
    }
  }
});
