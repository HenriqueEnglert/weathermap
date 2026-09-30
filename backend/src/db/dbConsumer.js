const { conectar } = require('./dbConnection');

/**
 * Registra os dados de uma pesquisa de localização no banco de dados.
 *
 * @param {JSON} pesquisa - Objeto de resposta (JSON) contendo os dados da cidade e clima via `.json()`.
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
    // ERRO - nao existe o metodo .json() para este objeto...
    //const pesquisaJSON = await pesquisa.json();

    // Insercao de dados
    const insert = 'INSERT INTO cidades_pesquisadas (cidade, estado, pais, latitude, longitude) VALUES($1, $2, $3, $4, $5)';
    // Mapeia os campos de parametros
    const values = [
        pesquisa.cidade,
        pesquisa.state,
        pesquisa.country,
        pesquisa.latitude,
        pesquisa.longitude
    ]

    try {
        // Inicia a transacao SQL
        await client.query('BEGIN');

        const response = await client.query(insert, values);

        //Confirma a insercao no banco
        await client.query('COMMIT');

        console.log(response);
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
        throw error;
    }

    try {
        const pesqTotais = await pesquisasTotais(client);
        const pesqHoje = await pesquisasHoje(client);
        const cidadeMaisConsultas = await cidadeMaisConsultada(client);

        return {
            pesquisasTotais: pesqTotais.total,
            pesquisasHoje: pesqHoje.total,
            cidadeMaisConsultada: cidadeMaisConsultas
        }
    } catch(error) {
        throw new Error(`Erro ao gerar relatorio: ${error.message}`);
    } finally {
        client.end();
    }
}

async function pesquisasTotais(client) {
    try {
        const response = await client.query('SELECT COUNT(c.id) AS total FROM cidades_pesquisadas AS c;');
        
        const resultado = response.rows[0];

        resultado.total = Number(resultado.total);

        return resultado
    } catch(error) {
        throw new Error(`Nao foi possivel executar a consulta. ${error.message}`);
    }
}

async function pesquisasHoje(client) {
    try {
        const response = await client.query('SELECT COUNT(c.id) AS total FROM cidades_pesquisadas AS c WHERE c.criado_em >= CURRENT_DATE;');

        const resultado = response.rows[0];

        resultado.total = Number(resultado.total);

        return resultado
    } catch(error) {
        throw new Error(`Nao foi possivel executar a consulta. ${error.message}`);
    }
}

async function cidadeMaisConsultada(client) {
    try {
        const response = await client.query('SELECT c.cidade, c.estado, c.pais, COUNT(c.id) AS qtd_pesquisas FROM cidades_pesquisadas AS c GROUP BY c.cidade, c.estado, c.pais ORDER BY qtd_pesquisas DESC LIMIT 1;');

        if(response.rows.length === 0) {
            return null
        }

        const resultado = response.rows[0];

        resultado.qtd_pesquisas = Number(resultado.qtd_pesquisas);

        return resultado
    } catch(error) {
        throw new Error(`Nao foi possivel executar a consulta. ${error.message}`);
    }
}

module.exports = {
    registrarPesquisa,
    gerarRelatorio
};