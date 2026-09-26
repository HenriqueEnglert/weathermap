// import { geocodingBusca } from "./openMeteoConsumer";
const { geocodingSugestoes, geocodingBusca, weatherBusca } = require('./openMeteoConsumer');

const express = require('express');
const cors = require('cors');

const app = express();

const port = 3000;

// Permite as requisicoes vindas do endereco do frontend
app.use(cors({
    origin: ['http://localhost:5173'],
    methods: ['GET', 'POST', 'DELETE', 'UPDATE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Access-Control-Allow-Origin']
}));

app.get('/api/cidades/:cidade', async(req, res) => {
    const { cidade } = req.params;

    try{
        // Condiciona o parametro de busca
        if(!cidade || cidade.trim().length <= 3) {
            return res.json([]);
        }

        // Recupera as cidades correspondentes
        const cidades = await geocodingSugestoes(cidade);

        res.json(cidades);

    } catch(error) {
        res.status(500).json({error: error.message});
    }

})

// Parametros nomeados - capturam o seu segmento da requisicao -> :nome_parametro
app.get('/api/weather/:cidade', async (req, res) => {
    // Recupera parametro de consulta
    const { cidade } = req.params;

    try {
        // Recupera dados da cidade
        const dadosCidade =  await geocodingBusca(cidade);

        // Recupera dados do atuais do clima usando as coordenadas da cidade
        const dadosClima = await weatherBusca(dadosCidade.latitude, dadosCidade.longitude);

        // Monta o objeto final combinando os dados
        const jsonResposta = {
            cidade: dadosCidade.name,
            state: dadosCidade.state,
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
        };

        res.json(jsonResposta);
    } catch(error) {
        res.status(500).json({error: error.message});
    }
});


app.listen(port, () => console.log("Servidor rodando na porta 3000"));