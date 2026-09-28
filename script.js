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

// ---------- Gráfico 1: Clasificación (toggle cantidad / superficie) ----------
const clasifLabels = Object.keys(DATA.clasificacion);
const clasifValuesCantidad = Object.values(DATA.clasificacion);

const chartClasificacion = new Chart(document.getElementById("chartClasificacion"), {
  type: "bar",
  data: {
    labels: clasifLabels,
    datasets: [{
      data: clasifValuesCantidad,
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

const chartBarrios = new Chart(document.getElementById("chartBarrios"), {
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
      y: {
        grid: { display: false },
        ticks: { autoSkip: false, font: { size: 11 } }
      }
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

// ============================================================
// SPRINT 2 — superficie, concentración, cruce con reciclaje
// ============================================================

// ---------- Gráfico: superficie total por clasificación (sin outlier) ----------
const supClasifLabels = Object.keys(DATA2.superficie_por_clasificacion_sin_outlier);
const supClasifValues = Object.values(DATA2.superficie_por_clasificacion_sin_outlier);

new Chart(document.getElementById("chartSuperficieClasif"), {
  type: "bar",
  data: {
    labels: supClasifLabels,
    datasets: [{
      label: "Superficie total (m²)",
      data: supClasifValues,
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
      title: { display: true, text: "Superficie total por clasificación (sin la Reserva Santa Catalina)", font: { size: 13 }, color: INK, padding: { bottom: 12 } },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.parsed.y.toLocaleString("es-AR")} m²`
        }
      }
    },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { color: GRID }, beginAtZero: true, title: { display: true, text: "m²" } }
    }
  }
});

// ---------- Gráfico: boxplot de superficie por clasificación ----------
const boxLabels = Object.keys(DATA2.boxplot_superficie);
const boxValues = Object.values(DATA2.boxplot_superficie);

new Chart(document.getElementById("chartBoxplot"), {
  type: "boxplot",
  data: {
    labels: boxLabels,
    datasets: [{
      label: "Superficie (m²)",
      data: boxValues,
      backgroundColor: "rgba(51, 81, 62, 0.25)",
      borderColor: MOSS,
      itemRadius: 2,
      itemBackgroundColor: CLAY
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: true, text: "Distribución de superficie por clasificación (m², sin outlier)", font: { size: 13 }, color: INK, padding: { bottom: 12 } }
    },
    scales: {
      y: { grid: { color: GRID }, title: { display: true, text: "m²" } },
      x: { grid: { display: false } }
    }
  }
});

// ---------- Stats + gráfico de concentración (checkbox interactivo) ----------
document.getElementById("statConcentracion").textContent = DATA2.concentracion_top5_sin_outlier_pct + "%";

const barrioSupLabelsSin = Object.keys(DATA2.top10_barrios_superficie_sin_outlier);
const barrioSupValuesSin = Object.values(DATA2.top10_barrios_superficie_sin_outlier);

const chartBarriosSuperficie = new Chart(document.getElementById("chartBarriosSuperficie"), {
  type: "bar",
  data: {
    labels: barrioSupLabelsSin,
    datasets: [{
      data: barrioSupValuesSin,
      backgroundColor: CLAY,
      borderRadius: 2,
      maxBarThickness: 26
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
          label: (ctx) => `${ctx.parsed.x.toLocaleString("es-AR")} m²`
        }
      }
    },
    scales: {
      x: { grid: { color: GRID }, beginAtZero: true, title: { display: true, text: "m²" } },
      y: { grid: { display: false }, ticks: { autoSkip: false, font: { size: 11 } } }
    }
  }
});

// ---------- Texto de peso de eventos ----------
document.getElementById("pesoEventosTexto").textContent =
  `El ${DATA2.peso_eventos_pct}% de los ${DATA2.total_kg_reciclado.toLocaleString("es-AR")} kg reciclados entre 2019 y 2020 ` +
  `vino de eventos puntuales (festivales, corsos), no de la red permanente de 4 puntos fijos.`;

// ---------- Tabla de cruce ----------
const tbody = document.querySelector("#tablaCruce tbody");
DATA2.cruce_puntos_verdes.forEach(row => {
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td>${row.punto_verde}</td>
    <td>${row.barrio}</td>
    <td>${row.superficie_m2.toLocaleString("es-AR")} m²</td>
    <td>${row.kg.toLocaleString("es-AR")} kg</td>
    <td>${row.kg_por_m2}</td>
  `;
  tbody.appendChild(tr);
});

// ---------- Gráfico: serie mensual de kg por punto ----------
const meses = DATA2.serie_mensual_kg.meses;
const serieColors = [MOSS, CLAY, "#6E8B78", "#C79A3B", "#7B4B8A"];
const serieDatasets = Object.entries(DATA2.serie_mensual_kg.series).map(([nombre, valores], i) => ({
  label: nombre,
  data: valores,
  borderColor: serieColors[i % serieColors.length],
  backgroundColor: serieColors[i % serieColors.length],
  tension: 0.25,
  spanGaps: true
}));

new Chart(document.getElementById("chartSerieMensual"), {
  type: "line",
  data: { labels: meses, datasets: serieDatasets },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "bottom" },
      title: { display: true, text: "Kg reciclados por mes y por punto (2019–2020)", font: { size: 13 }, color: INK, padding: { bottom: 12 } }
    },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { color: GRID }, beginAtZero: true, title: { display: true, text: "kg" } }
    }
  }
});

// ============================================================
// INTERACTIVIDAD
// ============================================================

// ---------- Scroll-spy de la nav ----------
const navLinks = document.querySelectorAll(".topnav__links a");
const navSections = Array.from(navLinks).map(a => document.getElementById(a.dataset.nav));

function updateActiveNav() {
  const scrollPos = window.scrollY + 90;
  let current = navSections[0];
  navSections.forEach(sec => {
    if (sec && sec.offsetTop <= scrollPos) current = sec;
  });
  navLinks.forEach(a => {
    a.classList.toggle("is-active", current && a.dataset.nav === current.id);
  });
}
window.addEventListener("scroll", updateActiveNav);
updateActiveNav();

// ---------- Toggle Cantidad / Superficie (Sección 1) ----------
const toggleBtns = document.querySelectorAll(".toggle-btn");
const clasifSupValues = supClasifValues; // ya calculado más arriba, mismo orden de categorías distinto
const clasifTexto = document.getElementById("clasifTexto");

const textoCantidad = "Más de un tercio de los registros son espacios verdes sin categoría específica; las plazas tradicionales son el segundo grupo más numeroso.";
const textoSuperficie = "Contando metros cuadrados reales (sin la Reserva Santa Catalina, que se analiza aparte), el ranking se da vuelta: PLAZA es la categoría más grande, no ESPACIO VERDE.";

toggleBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    toggleBtns.forEach(b => b.classList.remove("is-active"));
    btn.classList.add("is-active");

    if (btn.dataset.metric === "cantidad") {
      chartClasificacion.data.labels = clasifLabels;
      chartClasificacion.data.datasets[0].data = clasifValuesCantidad;
      chartClasificacion.options.plugins.tooltip.callbacks.label =
        (ctx) => `${ctx.parsed.y} espacios (${(ctx.parsed.y / DATA.total * 100).toFixed(1)}%)`;
      chartClasificacion.options.scales.y.title = undefined;
      clasifTexto.textContent = textoCantidad;
    } else {
      chartClasificacion.data.labels = supClasifLabels;
      chartClasificacion.data.datasets[0].data = supClasifValues;
      chartClasificacion.options.plugins.tooltip.callbacks.label =
        (ctx) => `${ctx.parsed.y.toLocaleString("es-AR")} m²`;
      chartClasificacion.options.scales.y.title = { display: true, text: "m²" };
      clasifTexto.textContent = textoSuperficie;
    }
    chartClasificacion.update();
  });
});

// ---------- Buscador de barrios (Sección 2) ----------
const filtroInput = document.getElementById("filtroBarrios");
const filtroCount = document.getElementById("filtroBarriosCount");

function actualizarConteoFiltro(n) {
  filtroCount.textContent = n === barrioLabels.length ? "" : `${n} de ${barrioLabels.length}`;
}

filtroInput.addEventListener("input", () => {
  const q = filtroInput.value.trim().toUpperCase();
  const idx = barrioLabels
    .map((label, i) => ({ label, i }))
    .filter(x => x.label.toUpperCase().includes(q));

  chartBarrios.data.labels = idx.map(x => x.label);
  chartBarrios.data.datasets[0].data = idx.map(x => barrioValues[x.i]);
  chartBarrios.update();
  actualizarConteoFiltro(idx.length);
});

// ---------- Checkbox Reserva Santa Catalina (Sección 5) ----------
const checkReserva = document.getElementById("checkReserva");
const statConcentracion = document.getElementById("statConcentracion");
const statConcentracionLabel = document.getElementById("statConcentracionLabel");

checkReserva.addEventListener("change", () => {
  if (checkReserva.checked) {
    const labels = Object.keys(DATA2.top10_barrios_superficie);
    const values = Object.values(DATA2.top10_barrios_superficie);
    chartBarriosSuperficie.data.labels = labels;
    chartBarriosSuperficie.data.datasets[0].data = values;
    statConcentracion.textContent = DATA2.concentracion_top5_con_outlier_pct + "%";
    statConcentracionLabel.textContent = "de la superficie está en los 5 barrios top (incluye la reserva de 277 ha)";
  } else {
    chartBarriosSuperficie.data.labels = barrioSupLabelsSin;
    chartBarriosSuperficie.data.datasets[0].data = barrioSupValuesSin;
    statConcentracion.textContent = DATA2.concentracion_top5_sin_outlier_pct + "%";
    statConcentracionLabel.textContent = "de la superficie está en los 5 barrios top";
  }
  chartBarriosSuperficie.update();
});
