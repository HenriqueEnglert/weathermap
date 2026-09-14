// import { geocodingBusca } from "./openMeteoConsumer";
const { geocodingBusca } = require('./openMeteoConsumer');

const express = require('express');
const app = express();
const port = 3000;

// Parametros nomeados - capturam o seu segmento da requisicao -> :nome_parametro
app.get('/api/weather/:cidade', async (req, res) => {
    // Recupera parametro de consulta
    const { cidade } = req.params;

    // Recupera os dados da cidade de consulta
    try {
        const dadosCidade = await geocodingBusca(cidade);
        res.json(dadosCidade);
    } catch(error) {
        res.status(500).json({error: error.message});
    }

    // Recupera os dados atuais do clima da cidade de consulta
    try {
        const dadosClima = await geocodingBusca(dadosCidade.latitude, dadosCidade.longitude);
        res.json(dadosClima);
    } catch(error) {
        res.status(500).json({error: error.message});
    }

    const jsonResposta = {
        cidade: dadosCidade.name,
        country: dadosCidade.country,
        latitude: dadosCidade.latitude,
        longitude: dadosCidade.longitude,
        weather: {
            temperatura: dadosClima.temperatura,
            sensacaoTermica: dadosClima.sensacaoTermica,
            umidade: dadosClima.umidade,
            windSpeed: dadosClima.windSpeed,
            weatherCode: dadosClima.weatherCode
        }
    }

    res.json(jsonResposta)
});



app.listen(port, () => console.log("Servidor rodando na porta 3000"));