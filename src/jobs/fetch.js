import moment from 'moment';
import FCICS from 'FCICS';
import FCICSDb from '../db/index';

const fetchAndStoreData = async () => {
  const db = await FCICSDb.getDatabase();
  const cc = new FCICS.CovidClient();
  const jc = new FCICS.JailClient();
  const now = moment().format('YYYY-MM-DD HH:mm:ss');

  try {
    console.log('Fetching inmate population data...');

    const inmates = {
      male: await jc.search({ gender: 'M' }),
      female: await jc.search({ gender: 'F' }),
    };
    db.insertInmates(now, inmates.male, inmates.female);
  } catch (err) {
    console.error(`Error pushing inmate data to DB: ${err.message}`);
  }

  try {
    console.log('Fetching COVID-19 case data...');

    const cases = await cc.get();
    db.insertCovid(now, cases.male, cases.female, cases.unknown);
  } catch (err) {
    console.error(`Error pushing COVID-19 data to DB: ${err.message}`);
  }
};

export default fetchAndStoreData;
