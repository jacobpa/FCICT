import sqlite from 'sqlite';
import sqlite3 from 'sqlite3';
import SQL from 'sql-template-strings';

const DBPath = './fcics.db';

const createTable = async (db) => {
    db.run(
        `CREATE TABLE IF NOT EXISTS Inmates (
            date DATE PRIMARY KEY,
            male INT NOT NULL,
            female INT NOT NULL
        )`
    )
    db.run(
        `CREATE TABLE IF NOT EXISTS Covid (
            date DATE PRIMARY KEY,
            male INT NOT NULL,
            female INT NOT NULL
        )`
    )
}

class FCICSDb {
    constructor(db) {
        this.db = db;
    }

    static async getDatabase() {
        const db = await sqlite.open({filename: DBPath, driver: sqlite3.cached.Database});
        await createTable(db);
        return new FCICSDb(db);
    }

    async insertInmates(date, male, female) {
        await this.db.run(SQL`INSERT INTO Inmates VALUES (
            ${date}, ${male}, ${female}
        )`);
    }

    async insertCovid(date, male, female) {
        await this.db.run(SQL`INSERT INTO Covid VALUES (
            ${date}, ${male}, ${female}
        )`);
    }

    async getAll() {
        return this.db.all(
            `SELECT c.date, c.male AS covid_male, c.female AS covid_female, i.male AS inmates_male, i.female AS inmates_female
            FROM Covid AS c
            INNER JOIN Inmates AS i ON c.date = i.date;`
        )
    }

    async getInmates() {
        return this.db.all(
            `SELECT * FROM Inmates;`
        )
    }

    async getCovid() {
        return this.db.all(
            `SELECT * FROM Covid;`
        );
    }
}

export default FCICSDb;
