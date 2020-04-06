import moment from 'moment';
import FCICSDb from '../src/db/index.js';
import FCICS from 'FCICS';


const fetchAndStoreData = async () => {
    const db = await FCICSDb.getDatabase();
    const cc = new FCICS.CovidClient();
    const now = moment().format('YYYY-MM-DD HH:mm:ss');

    FCICS.jailScraper.scrapeByGender().then(inmates => {
        console.log('Fetching inmate data...')
        db.insertInmates(now, inmates.male, inmates.female);
    }).catch(err => {
        console.error(`Error pushing inmate data to DB: ${err.message}`);
    });

    cc.get().then(cases => {
        console.log('Fetching COVID-19 case data...')
        db.insertCovid(now, cases.male, cases.female);
    }).catch(err => {
        console.error(`Error pushing COVID-19 data to DB: ${err.message}`);
    });
}

fetchAndStoreData();