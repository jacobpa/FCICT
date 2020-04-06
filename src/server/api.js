import polka from 'polka';

const router = polka();

const colors = [
    '#FF660064', '#ff873864', '#33302e64', '#44342964'
]

router.get('/all', async (req, res) => {
	const dbResults = await req.db.getAll();
    if (req.query.groupBy === 'totals') {
        const c = {label: 'COVID-19 Cases', backgroundColor: colors[2], borderColor: colors[2], tension: 0, fill: true, data: dbResults.map(e => ({x: e.date, y: e.covid_male + e.covid_female}))}
		const i = {label: 'Inmates', backgroundColor: colors[0], borderColor: colors[0], tension: 0, fill: true, data: dbResults.map(e => ({x: e.date, y: e.inmates_male + e.inmates_female}))}
		res.writeHead(200, {'Content-Type': 'application/json'})
        res.end(JSON.stringify([c, i]))
    } else {
        const mc = {label: 'Male COVID-19 Cases', backgroundColor: colors[2], borderColor: colors[2], tension: 0, fill: true, data: dbResults.map(e => ({x: e.date, y: e.covid_male}))}
        const fc = {label: 'Female COVID-19 Cases', backgroundColor: colors[3], borderColor: colors[3], tension: 0, fill: true, data: dbResults.map(e => ({x: e.date, y: e.covid_female}))}
        const mi = {label: 'Male Inmates', backgroundColor: colors[0], borderColor: colors[0], tension: 0, fill: true, data: dbResults.map(e => ({x: e.date, y: e.inmates_male}))}
		const fi = {label: 'Female Inmates', backgroundColor: colors[1], borderColor: colors[1], tension: 0, fill: true, data: dbResults.map(e => ({x: e.date, y: e.inmates_female}))}
		res.writeHead(200, {'Content-Type': 'application/json'})
        res.end(JSON.stringify([mc, fc, mi, fi]));
    }

});

router.get('/covid', async (req, res) => {
    res.send(await req.app.db.getCovid());
});

router.get('/inmates', async (req, res) => {
    res.send(await req.app.db.getInmates());
});

export default router;