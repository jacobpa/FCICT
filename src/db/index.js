import sqlite from 'sqlite';
import sqlite3 from 'sqlite3';
import SQL from 'sql-template-strings';

const DBPath = './fcics.db';

const createTable = async (db) => {
  db.run(
    `CREATE TABLE IF NOT EXISTS Inmates (
            date DATE PRIMARY KEY,
            male INT NOT NULL,
            female INT NOT NULL,
            unknown INT NOT NULL
        )`,
  );
  db.run(
    `CREATE TABLE IF NOT EXISTS Covid (
            date DATE PRIMARY KEY,
            male INT NOT NULL,
            female INT NOT NULL
        )`,
  );
};

class FCICSDb {
  constructor(db) {
    this.db = db;
  }

  static async getDatabase() {
    const db = await sqlite.open({ filename: DBPath, driver: sqlite3.cached.Database });
    await createTable(db);
    return new FCICSDb(db);
  }

  async insertInmates(date, male, female) {
    await this.db.run(SQL`INSERT INTO Inmates VALUES (
            ${date}, ${male}, ${female}
        )`);
  }

  async insertCovid(date, male, female, unknown) {
    await this.db.run(SQL`INSERT INTO Covid VALUES (
            ${date}, ${male}, ${female}, ${unknown}
        )`);
  }

  async getAll() {
    return this.db.all(
      `SELECT c.date, c.male AS covid_male, c.female AS covid_female, c.unknown AS covid_unknown, i.male AS inmates_male, i.female AS inmates_female
            FROM Covid AS c
            INNER JOIN Inmates AS i ON c.date = i.date;`,
    );
  }

  async getInmates() {
    return this.db.all(
      'SELECT * FROM Inmates;',
    );
  }

  async getCovid() {
    return this.db.all(
      'SELECT * FROM Covid;',
    );
  }

  async getLast() {
    return this.db.get(`
      SELECT 
        c.date, c.male as covid_male, c.female as covid_female, c.unknown as covid_unknown,
        i.male as inmate_male, i.female as inmate_female
      FROM Covid as c
      INNER JOIN Inmates as i
      WHERE c.date = i.date
      ORDER BY c.date DESC;
    `);
  }

  async getYesterday() {
    // Data has been truncated to stop at 2020/11/18, so 'yesterday' has become 2020/11/17
    return this.db.get(`
      SELECT * FROM (
        SELECT 
          c.date, c.male as covid_male, c.female as covid_female, c.unknown as covid_unknown,
          i.male as inmate_male, i.female as inmate_female
        FROM Covid as c
        INNER JOIN Inmates as i
        WHERE c.date = i.date
      )
      WHERE date(date, 'start of day') = date('2020-11-17', 'start of day')
      ORDER BY date DESC;
    `);
  }
}

export default FCICSDb;
