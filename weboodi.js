const getLocalStorage = key => JSON.parse(localStorage.getItem(key) || "[]");
const setLocalStorage = key => value =>
  localStorage.setItem(key, JSON.stringify(value));

const getDuplikaattiKurssit = () => getLocalStorage("duplikaattiKurssit");

const setDuplikaattiKurssit = setLocalStorage("duplikaattiKurssit");
const setPerusOpinnot = setLocalStorage("perusOpinnot");
const setAineOpinnot = setLocalStorage("aineOpinnot");

const getPerusOpinnot = () => getLocalStorage("perusOpinnot").filter(notEmpty);
const getAineOpinnot = () => getLocalStorage("aineOpinnot").filter(notEmpty);

const max = lista => Math.max(...lista);

const findPvm = (list, key) => list.find(({ pvm }) => pvm === key);

const chartColors = [
  "pink",
  "red",
  "orange",
  "yellow",
  "green",
  "blue",
  "indigo",
  "purple"
];

const teeHienoTooltip = () => ({
  tooltips: {
    callbacks: {
      label: (tooltipItem, data) => {
        const label = data.datasets[tooltipItem.datasetIndex].label || "";
        const value = Math.round(tooltipItem.yLabel * 100) / 100;

        // datasetIndex = bar chart, values are multiplied by ten to show larger bars
        const labelValue = tooltipItem.datasetIndex ? value : value / 10;

        return `${label}: ${labelValue}`;
      }
    }
  }
});

const draw = ({
  id,
  labels,
  datasets,
  type = "bar",
  customTooltip = false,
  customTicks = false
}) => {
  const ctx = document.getElementById(id);
  new Chart(ctx, {
    type,
    data: { labels, datasets },
    options: {
      ...(customTooltip && teeHienoTooltip()),
      scales: {
        yAxes: [
          {
            ...(customTicks && {
              gridLines: {
                drawBorder: false,
                color: chartColors
              }
            }),
            ticks: {
              beginAtZero: true,
              ...(customTicks && {
                max: max(datasets.map(({ data }) => max(data))) + 20,
                stepSize: 55
              })
            }
          }
        ]
      }
    }
  });
};

const drawPie = ({ id, labels, datasets, backgroundColor }) => {
  document.getElementById(`${id}-container`).style.display = "block";

  const ctx = document.getElementById(id);
  new Chart(ctx, {
    type: "pie",
    data: {
      datasets: [{ data: datasets, backgroundColor }],
      labels
    }
  });
};

const style = {
  backgroundColor: "rgba(255, 99, 132, 0.2)",
  borderColor: "rgba(255,99,132,1)",
  borderWidth: 1
};

const styleBlue = {
  backgroundColor: "rgba(118, 99, 255, 0.2)",
  borderColor: "rgba(118,99,132,1)",
  borderWidth: 1
};

const styleGreen = {
  backgroundColor: "rgba(99, 255, 157, 0.2)",
  borderColor: "rgba(99,99,132,1)",
  borderWidth: 1
};

const doCss = () => {
  return `
  <style>
    #luennoitsijat {
      clear: both;
      display: inline-block;
      margin-bottom: 100px;
    }

    .luennoitsijat {
      margin-right: 10px;
    }

    .clear {
      clear: both;
      display: table;
    }

    .pull-left {
      float: left;
    }

    .margin-bottom-large {
      margin-bottom: 100px;
    }

    #nuggets input {
      width: 100%;
    }
  </style>
  `;
};

const createDom = ({ duplikaattiKurssit, perusOpinnot, aineOpinnot }) => {
  const yolo = `
  <div id="nuggets" class="margin-bottom-large">
    <div class="clear margin-bottom-large">
      <div id="perusopinnot-container" class="pull-left" style="display:none;">
        Perusopinnot
        <canvas id="perusopinnot" width="500" height="200"></canvas>
      </div>
      <div id="aineopinnot-container" class="pull-left" style="display:none;">
        Aineopinnot
        <canvas id="aineopinnot" width="500" height="200"></canvas>
      </div>
    </div>
    <canvas id="chart-nopat" width="500" height="200"></canvas>
    <canvas id="chart-keskiarvo" width="500" height="200"></canvas>
    <div id="luennoitsijat"></div>
    <div id="tools" class="margin-bottom-large">
      <p>
        <label style="margin-bottom:30px;">
          Merkkaa tähän inputtiin pilkulla erottaen mahdolliset duplikaattikurssit, kas näin: A582103,A581325<br/>
          <input type="text" name="duplikaattiKurssit" value="${duplikaattiKurssit}" />
        </label>
      </p>

      <p>
        <label style="margin-bottom:30px;">
          Merkkaa tähän inputtiin pilkulla erottaen perusopintokurssisi pääaineesta, kas näin vaikkapa: A582103,A581325<br/>
          <input type="text" name="perusOpinnot" value="${perusOpinnot}" />
        </label>
      </p>

      <p>
        <label style="margin-bottom:30px;">
          Merkkaa tähän inputtiin pilkulla erottaen aineopintokurssi pääaineesta, kas näin vaikkapa: A582103,A581325<br/>
          <input type="text" name="aineOpinnot" value="${aineOpinnot}" />
        </label>
      </p>

      <p>
        <button id="kliketi-klik">
          Päivitä chartit, esimerkiksi duplikaattikurssien lisäämisen jälkeen
        </button>
      </p>
    </div>

    <p>
      Haluatko lisätoiminnallisuutta tähän plugariin? Löysitkö virheen?<br>
      Mikäli olet tkt opiskelija, <a href="https://github.com/JuhQ/weboodi-chart">tee pull request</a>.<br>
      Mikäli opiskelet jotain muuta, laita mailia juha.tauriainen@helsinki.fi
    </p>
  </div>
  `;

  const listaTaulukko = document.querySelectorAll("table")[1];
  const nuggetsExist = document.querySelector("#nuggets");
  if (nuggetsExist) {
    nuggetsExist.outerHTML = yolo;
  } else {
    listaTaulukko.outerHTML = listaTaulukko.outerHTML + doCss() + yolo;
  }
};

const notEmpty = data => data.length > 0;

const createCoursesArray = target =>
  target.value
    .split(",")
    .map(k => k.trim())
    .filter(notEmpty);

const kuunteleDuplikaattiInputtia = () => {
  const input = document.querySelector("input[name='duplikaattiKurssit']");

  input.addEventListener("input", ({ target }) => {
    setDuplikaattiKurssit(createCoursesArray(target));
  });
};

const kuunteleppaNiitäPerusopintoja = () => {
  const input = document.querySelector("input[name='perusOpinnot']");

  input.addEventListener("input", ({ target }) => {
    setPerusOpinnot(createCoursesArray(target));
  });
};

const tahtoisinVaanKuunnellaAineopintoja = () => {
  const input = document.querySelector("input[name='aineOpinnot']");

  input.addEventListener("input", ({ target }) => {
    setAineOpinnot(createCoursesArray(target));
  });
};

const kuunteleppaNapinpainalluksiaJuu = () => {
  const input = document.querySelector("button#kliketi-klik");

  input.addEventListener("click", start);
};

const kuunteleAsijoita = () => {
  kuunteleDuplikaattiInputtia();
  kuunteleppaNiitäPerusopintoja();
  tahtoisinVaanKuunnellaAineopintoja();
  kuunteleppaNapinpainalluksiaJuu();
};

const groupThemCourses = stuff =>
  stuff
    .reduce((initial, item) => {
      const found = findPvm(initial, item.pvm);
      if (!found) {
        return [...initial, item];
      }

      return initial.map(jee => {
        const today =
          jee.pvm === item.pvm
            ? {
                cumulativeOp: item.op + jee.cumulativeOp,
                op: item.op + jee.op
              }
            : null;

        return {
          ...jee, // 💩👌
          ...today
        };
      });
    }, [])
    .map(item => ({ ...item, op: item.op * 10 }));

const makeSomeStuff = ({ list, duplikaattiKurssit }) => {
  let cumulativeOp = 0;

  return [...list]
    .map(item => [...item.querySelectorAll("td")])
    .filter(notEmpty)
    .map(item => item.map(value => value.textContent.trim()))
    .filter(([lyhenne]) => !duplikaattiKurssit.includes(lyhenne))
    .reverse()
    .map(([lyhenne, kurssi, op, arvosana, pvm, luennoitsija]) => {
      const [paiva, kuukausi, vuosi] = pvm.split(".");
      const opNumber = Number(op);

      cumulativeOp += opNumber;

      return {
        lyhenne,
        kurssi,
        op: opNumber,
        cumulativeOp,
        arvosana: Number(arvosana),
        pvm,
        pvmDate: new Date(vuosi, Number(kuukausi) - 1, paiva), // not used anywhere yet
        luennoitsija
      };
    });
};

const annaMulleKeskiarvotKursseista = stuff => {
  let arvosanaTotal = 0;

  return stuff.filter(item => !isNaN(item.arvosana)).map((item, i) => {
    arvosanaTotal += item.arvosana;
    return {
      ...item,
      keskiarvo: (arvosanaTotal / (i + 1)).toFixed(2)
    };
  });
};

const annaMulleKeskiarvotTietyistäKursseista = ({ kurssit, stuff }) => {
  let arvosanaTotal = 0;

  return stuff
    .filter(item => !isNaN(item.arvosana))
    .filter(({ lyhenne }) => kurssit.includes(lyhenne))
    .map((item, i) => {
      arvosanaTotal += item.arvosana;
      return {
        ...item,
        keskiarvo: (arvosanaTotal / (i + 1)).toFixed(2)
      };
    });
};

const haluaisinTietääLuennoitsijoista = stuff =>
  stuff
    .reduce(
      (initial, item) => [
        ...initial,
        ...item.luennoitsija
          .split(",")
          .map(luennoitsija => luennoitsija.trim())
          .filter(notEmpty)
          .map(luennoitsija => ({ ...item, luennoitsija }))
      ],
      []
    )
    .map((item, i, arr) => {
      const luennot = arr.filter(
        ({ luennoitsija }) => luennoitsija === item.luennoitsija
      );
      const arvosanat = luennot
        .filter(item => !isNaN(item.arvosana))
        .map(({ arvosana }) => arvosana);

      const keskiarvo = arvosanat.reduce((a, b) => a + b, 0) / arvosanat.length;

      return {
        ...item,
        kurssimaara: luennot.length,
        luennot: {
          arvosanat,
          keskiarvo: keskiarvo ? keskiarvo.toFixed(2) : "hyv",
          op: luennot.map(({ op }) => op),
          totalOp: luennot.map(({ op }) => op).reduce((a, b) => a + b, 0)
        }
      };
    })
    .reduce(
      (initial, item) =>
        initial.find(({ luennoitsija }) => luennoitsija === item.luennoitsija)
          ? initial
          : [...initial, item],
      []
    );

const createLuennoitsijaRivi = ({ luennoitsija, kurssimaara, luennot }) => `<p>
    ${luennoitsija},
    kursseja ${kurssimaara},
    keskiarvo: ${luennot.keskiarvo},
    noppia: ${luennot.totalOp}
    </p>`;

const drawLuennoitsijat = ({ title, lista, luennoitsijatElement }) => {
  const html = `
    <div class="luennoitsijat pull-left">
      <p><strong>${title}</strong></p>
      ${lista.map(createLuennoitsijaRivi).join("")}
    </div>
  `;

  luennoitsijatElement.innerHTML = luennoitsijatElement.innerHTML + html;
};

const drawOpintoDonitsi = ({ id, stuff, data }) => {
  const opintoData = [
    ...stuff
      .filter(({ lyhenne }) => data.includes(lyhenne))
      .map(({ lyhenne }) => ({ lyhenne, done: true })),
    ...data
      .filter(lyhenne => !stuff.find(course => lyhenne === course.lyhenne))
      .map(lyhenne => ({ lyhenne, done: false }))
  ];

  drawPie({
    id,
    labels: opintoData.map(({ lyhenne }) => lyhenne),
    datasets: opintoData.map(() => (1 / opintoData.length) * 100),
    backgroundColor: opintoData.map(
      ({ done }) => (done ? "lightgreen" : "lightgray")
    )
  });
};

const findOpintoByLyhenne = ({ opinnot, lyhenne }) =>
  opinnot.find(item => lyhenne === item.lyhenne);

const hommaaMulleKeskiarvotTietyistäOpinnoistaThxbai = ({
  stuff,
  keskiarvot,
  kurssit
}) => {
  if (!kurssit.length) {
    return [];
  }

  const opinnot = annaMulleKeskiarvotTietyistäKursseista({
    kurssit,
    stuff
  });

  return keskiarvot.reduce((initial, item) => {
    const jeejee = findOpintoByLyhenne({ opinnot, lyhenne: item.lyhenne });

    if (jeejee) {
      return [...initial, { ...jeejee, fromOpinnot: true }];
    }

    const mitäs = initial.filter(({ fromOpinnot }) => fromOpinnot).reverse()[0];

    return [...initial, mitäs || item];
  }, []);
};

const isTruthy = v => v;

const rakenteleDataSetitKeskiarvoChartille = ({
  keskiarvot,
  keskiarvotPerusopinnoista,
  keskiarvotAineopinnoista
}) =>
  [
    {
      label: "Päivittäinen keskiarvo kaikista kursseista",
      data: keskiarvot.map(({ keskiarvo }) => keskiarvo),
      ...style
    },
    notEmpty(keskiarvotPerusopinnoista) && {
      label: "Päivittäinen keskiarvo perusopinnoista",
      data: keskiarvotPerusopinnoista.map(({ keskiarvo }) => keskiarvo),
      ...styleBlue
    },
    notEmpty(keskiarvotAineopinnoista) && {
      label: "Päivittäinen keskiarvo aineopinnoista",
      data: keskiarvotAineopinnoista.map(({ keskiarvo }) => keskiarvo),
      ...styleGreen
    }
  ].filter(isTruthy);

const rakenteleDataSetitNoppaChartille = grouped =>
  [
    {
      label: "Päivän opintopisteet",
      data: grouped.map(({ op }) => op)
    },
    {
      label: "Suoritukset",
      data: grouped.map(({ cumulativeOp }) => cumulativeOp),
      ...style,
      type: "line"
    }
  ].filter(isTruthy);

const drawGraphs = ({
  stuff,
  keskiarvot,
  keskiarvotPerusopinnoista,
  keskiarvotAineopinnoista
}) => {
  const grouped = groupThemCourses(stuff);
  notEmpty(grouped) &&
    draw({
      id: "chart-nopat",
      customTooltip: true,
      customTicks: true,
      labels: grouped.map(({ pvm }) => pvm),
      datasets: rakenteleDataSetitNoppaChartille(grouped)
    });

  notEmpty(keskiarvot) &&
    draw({
      id: "chart-keskiarvo",
      labels: keskiarvot.map(({ pvm }) => pvm),
      type: "line",
      datasets: rakenteleDataSetitKeskiarvoChartille({
        keskiarvot,
        keskiarvotPerusopinnoista,
        keskiarvotAineopinnoista
      })
    });
};

const piirräDonitsit = ({ stuff, aineOpinnot, perusOpinnot }) => {
  if (aineOpinnot.length) {
    drawOpintoDonitsi({ id: "aineopinnot", stuff, data: aineOpinnot });
  }

  if (perusOpinnot.length) {
    drawOpintoDonitsi({ id: "perusopinnot", stuff, data: perusOpinnot });
  }
};

const sorttaaLuennoitsijatKeskiarvonMukaan = (a, b) =>
  b.luennot.keskiarvo - a.luennot.keskiarvo || b.kurssimaara - a.kurssimaara;

const piirräLuennoitsijaListat = stuff => {
  const luennoitsijat = haluaisinTietääLuennoitsijoista(stuff);

  const luennoitsijatElement = document.querySelector("#luennoitsijat");

  drawLuennoitsijat({
    title: "Luennoitsijoiden top lista by kurssimaara",
    lista: luennoitsijat.sort((a, b) => b.kurssimaara - a.kurssimaara),
    luennoitsijatElement
  });

  drawLuennoitsijat({
    title: "Luennoitsijoiden top lista by keskiarvo",
    lista: [
      ...luennoitsijat
        .filter(({ luennot }) => luennot.keskiarvo !== "hyv")
        .sort(sorttaaLuennoitsijatKeskiarvonMukaan),
      ...luennoitsijat.filter(({ luennot }) => luennot.keskiarvo === "hyv")
    ],
    luennoitsijatElement
  });

  drawLuennoitsijat({
    title: "Luennoitsijoiden top lista by nopat",
    lista: luennoitsijat.sort((a, b) => b.luennot.totalOp - a.luennot.totalOp),
    luennoitsijatElement
  });
};

const hommaaMatskutLocalStoragesta = () => {
  const duplikaattiKurssit = getDuplikaattiKurssit();
  const aineOpinnot = getAineOpinnot();
  const perusOpinnot = getPerusOpinnot();

  return { duplikaattiKurssit, aineOpinnot, perusOpinnot };
};

const laskeKeskiarvot = ({ stuff, keskiarvot, perusOpinnot, aineOpinnot }) => {
  const keskiarvotPerusopinnoista = hommaaMulleKeskiarvotTietyistäOpinnoistaThxbai(
    {
      stuff,
      keskiarvot,
      kurssit: perusOpinnot
    }
  );

  const keskiarvotAineopinnoista = hommaaMulleKeskiarvotTietyistäOpinnoistaThxbai(
    {
      stuff,
      keskiarvot,
      kurssit: aineOpinnot
    }
  );

  return { keskiarvotPerusopinnoista, keskiarvotAineopinnoista };
};

// tästä tää lähtee!
const start = () => {
  const list = document.querySelectorAll(
    "#legacy-page-wrapper > table:nth-child(17) > tbody > tr > td > table > tbody tr"
  );

  const {
    duplikaattiKurssit,
    aineOpinnot,
    perusOpinnot
  } = hommaaMatskutLocalStoragesta();

  createDom({ duplikaattiKurssit, aineOpinnot, perusOpinnot });

  kuunteleAsijoita(); // 👂

  const stuff = makeSomeStuff({ list, duplikaattiKurssit });

  const keskiarvot = annaMulleKeskiarvotKursseista(stuff);

  const {
    keskiarvotPerusopinnoista,
    keskiarvotAineopinnoista
  } = laskeKeskiarvot({ stuff, keskiarvot, perusOpinnot, aineOpinnot });

  drawGraphs({
    stuff,
    keskiarvot,
    keskiarvotPerusopinnoista,
    keskiarvotAineopinnoista
  }); // 📈

  piirräDonitsit({ stuff, aineOpinnot, perusOpinnot }); // 🍩

  piirräLuennoitsijaListat(stuff); // 👩‍🏫👨‍🏫
};

start();
