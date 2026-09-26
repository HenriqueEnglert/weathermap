const { Client } = require('pg');

function conectar() {
    try {
        const client = new Client({
            connectionString: process.env.DATABASE_URL
        });
        return client;
    } catch (Error) {
        return [];
    }
}


module.exports = {
    conectar
};