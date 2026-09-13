// import { geocodingBusca } from "./openMeteoConsumer";
const { geocodingBusca } = require('./openMeteoConsumer');

const express = require('express');
const app = express();
const port = 3000;

// Parametros nomeados - capturam o seu segmento da requisicao -> :nome_parametro
app.get('/api/weather/:cidade', async (req, res) => {

    const { cidade } = req.params;
    try {
        const dados = await geocodingBusca(cidade);
        res.json(dados);
    } catch(error) {
        res.status(500).json({error: error.message});
    }

    //res.send('Sequencia de execucao: Nome cidade -> consulta posicao geografica -> consulta clima, retorna tudo lindinho');
});



app.listen(port, () => console.log("Servidor rodando na porta 3000"));