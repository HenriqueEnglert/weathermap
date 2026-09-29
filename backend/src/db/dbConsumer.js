const { conectar } = require('./dbConnection');

/**
 * Registra os dados de uma pesquisa de localização no banco de dados.
 *
 * @param {Response} pesquisa - Objeto de resposta (HTTP Response) contendo os dados da cidade e clima via `.json()`.
 * @returns {Promise<void>}
 * @throws {Error} Se ocorrer falha na conexão ou durante a transação SQL.
 */
async function registrarPesquisa(pesquisa) {
    // Conecta ao banco do Docker
    let client;
    try {
        client = await conectar();
    } catch(error) {
        throw error;
    }

    // Informacoes de pesquisa em objeto JSON
    const pesquisaJSON = await pesquisa.json();

    // Insercao de dados
    const insert = 'INSERT INTO cidades_pesquisadas (cidade, estado, pais, latitude, longitude) VALUES($1, $2, $3, $4, $5)';
    // Mapeia os campos de parametros
    const values = pesquisaJSON.map(local => {
        return [
            local.cidade,
            local.state,
            local.country,
            local.latitude,
            local.longitude
        ]
    });

    try {
        // Inicia a transacao SQL
        await client.query('BEGIN');

        const response = await client.query(insert, values[0]);

        //Confirma a insercao no banco
        await client.query('COMMIT');
    } catch(error) {
        await client.query('ROLLBACK');
        throw new Error(`Erro na insercao de dados. Transicao revertida: ${error.message}`);
    } finally {
        // Encerra a conexao
        await client.end();
    }
}

async function gerarRelatorio() {
    let client;
    try {
        client = await conectar();
    } catch(error) {
        throw error
    }

}

async function pesquisasTotais(client) {
    try {
        const res = await client.query('SELECT COUNT(c.id) AS total FROM cidades_pesquisadas AS c;');
        
        return res.rows[0].total;
    } catch(error) {
        throw new Error(`Nao foi possivel executar a consulta. ${error.message}`);
    }
}

async function pesquisasHoje(client) {

}

async function cidadeMaisConsultada(client) {

}

module.exports = {
    registrarPesquisa,
    gerarRelatorio
};