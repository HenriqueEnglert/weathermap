const { Client } = require('pg');

/**
 * Estabelece a conexão com o banco de dados PostgreSQL utilizando a variável de ambiente DATABASE_URL.
 *
 * @returns {Promise<Client>} Instância do cliente do banco de dados conectado.
 * @throws {Error} Lança uma exceção se a conexão com o banco de dados falhar.
 */
async function conectar() {
    const client = await new Client({
        connectionString: process.env.DATABASE_URL
    });

    try {
        await client.connect();
        return client
    } catch(error) {
        throw new Error(`Erro ao conectar com o banco: ${error.message}`);
    }
}


module.exports = {
    conectar
};