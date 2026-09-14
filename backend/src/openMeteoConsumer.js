//import { fetchWeatherApi } from 'openmeteo';

const { fetchWeatherApi } = require('openmeteo');

// URI da API Geocoding
const geocodingURI = "https://geocoding-api.open-meteo.com/v1/search";
const weatherAPIURI = "https://api.open-meteo.com/v1/forecast";

/**
 * Consulta coordenadas geograficas e fuso horario de uma cidade utilizando a API Open-Meteo.
 *
 * @param cidade - O nome da cidade a ser pesquisada (ex: "Sao Paulo" ou "Porto Alegre").
 * @returns Um objeto contendo o nome formatado, latitude, longitude e fuso horario da cidade.
 * @throws {Error} Disparado quando a requisicao HTTP falha (status diferente de 2xx).
 *
 * @example
 * ```javascript
 * const localizacao = await geocodingBusca("Santa Cruz do Sul");
 * console.log(localizacao.latitude, localizacao.longitude);
 * ```
 */
async function geocodingBusca(cidade) {

    if(cidade == null || cidade == '') {
        throw new Error('Informe uma cidade antes de realizar a pesquisa!')
    }

    // Permite manipular a URI global
    const URIBusca = new URL(geocodingURI);
    
    // Parametros de busca
    URIBusca.searchParams.append("name", cidade);
    URIBusca.searchParams.append("count", "1");

    // Consulta a API
    const response = await fetch(URIBusca);

    // Tratamento de Erro - problemas de consulta
    if(!response.ok) {
        // Adicionar um logger???
        throw new Error(`[ERRO]: Erro com a consulta -> [DETALHES]: ${response.status}`);
    }

    // Armazena a response como um JSON
    const dadosGeocodificacao = await response.json();

    // Valida se as informacoes nao sao nulas
    if(!dadosGeocodificacao) {
        throw new Error(`Cidade nao encontrada. Verifique o nome de consulta.`);
    }

    // Retorna informcaoes em JSON formatado
    return {
        name: dadosGeocodificacao.results[0].name,
        latitude: dadosGeocodificacao.results[0].latitude,
        longitude: dadosGeocodificacao.results[0].longitude,
        country: dadosGeocodificacao.results[0].country
    }
}

/**
 * Busca os dados meteorológicos atuais de uma localização via Open-Meteo.
 *
 * @param latitudeParam - Latitude em graus decimais.
 * @param longitudeParam - Longitude em graus decimais.
 * @returns Fuso horário, coordenadas e medições atuais (temperatura, umidade e sensação térmica).
 */
async function weatherBusca(latitudeParam, longitudeParam) {
    // Permite manipular a URI global
    const uriBusca = new URL(weatherAPIURI);

    // Parametros de busca
    uriBusca.searchParams.append('latitude', latitudeParam);
    uriBusca.searchParams.append('longitude', longitudeParam);
    uriBusca.searchParams.append('timezone', 'auto');
    uriBusca.searchParams.append('current', 
        'temperature_2m, relative_humidity_2m, apparent_temperature, weather_code, wind_speed_10m'
    );

    // Consulta a API
    const response = await fetch(uriBusca);

    // Tratamento de Erro - problemas de consulta
    if(!response.ok) {
        throw new Error(`[ERRO]: Erro com a consulta -> [DETALHES]: ${response.status}`);
    }

    // Armazena a response como um JSON
    const dados = await response.json();

    // Valida se as informacoes nao sao nulas
    if(!dados) {
        throw new Error(`Cidade nao encontrada. Verifique o nome de consulta.`);
    }

    // Retorna informacoes em JSON formatado
    return {
        temperatura: dados.current.temperature_2m,
        umidade: dados.current.relative_humidity_2m,
        sensacaoTermica: dados.current.apparent_temperature,
        weatherCode: dados.current.weather_code,
        windSpeed: dados.current.wind_speed_10m
    }
}
