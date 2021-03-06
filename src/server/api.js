import polka from 'polka';

const router = polka();

const colors = [
  '#FF660064', '#ff873864', '#33302e64', '#44342964', '#887D7664',
];

router.get('/all', async (req, res) => {
  const dbResults = await req.db.getAll();
  if (req.query.groupBy === 'totals') {
    const c = {
      label: 'COVID-19 Cases', backgroundColor: colors[2], borderColor: colors[2], yAxisID: 'covid', tension: 0, fill: true, data: dbResults.map((e) => ({ x: e.date, y: e.covid_male + e.covid_female + e.covid_unknown })),
    };
    const i = {
      label: 'Inmates', backgroundColor: colors[0], borderColor: colors[0], tension: 0, yAxisID: 'inmates', fill: true, data: dbResults.map((e) => ({ x: e.date, y: e.inmates_male + e.inmates_female })),
    };
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify([c, i]));
  } else {
    const mc = {
      label: 'Male COVID-19 Cases', backgroundColor: colors[2], borderColor: colors[2], tension: 0, yAxisID: 'covid', fill: true, data: dbResults.map((e) => ({ x: e.date, y: e.covid_male })),
    };
    const fc = {
      label: 'Female COVID-19 Cases', backgroundColor: colors[3], borderColor: colors[3], tension: 0, yAxisID: 'covid', fill: true, data: dbResults.map((e) => ({ x: e.date, y: e.covid_female })),
    };
    const uc = {
      label: 'Unknown Sex COVID-19 Cases', backgroundColor: colors[4], borderColor: colors[4], tension: 0, yAxisID: 'covid', fill: true, data: dbResults.map((e) => ({ x: e.date, y: e.covid_unknown })),

    };
    const mi = {
      label: 'Male Inmates', backgroundColor: colors[0], borderColor: colors[0], tension: 0, yAxisID: 'inmates', fill: true, data: dbResults.map((e) => ({ x: e.date, y: e.inmates_male })),
    };
    const fi = {
      label: 'Female Inmates', backgroundColor: colors[1], borderColor: colors[1], tension: 0, yAxisID: 'inmates', fill: true, data: dbResults.map((e) => ({ x: e.date, y: e.inmates_female })),
    };
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify([mc, fc, uc, mi, fi]));
  }
});

router.get('/last', async (req, res) => {
  let dbResults;
  if (req.query.from === 'yesterday') {
    dbResults = await req.db.getYesterday();
  } else {
    dbResults = await req.db.getLast();
  }
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(dbResults));
});

export default router;
