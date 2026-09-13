//import { fetchWeatherApi } from 'openmeteo';

const { fetchWeatherApi } = require('openmeteo');

// URI da API Geocoding
const geocodingURI = "https://geocoding-api.open-meteo.com/v1/search";

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
    // Permite manipular a URI global
    const URIBusca = new URL(geocodingURI);
    
    // Parametros de busca
    URIBusca.searchParams.append("name", cidade);
    URIBusca.searchParams.append("count", "1");

    // Consulta a API
    const response = await fetch(URIBusca);

    // Tratamento de Erro - problemas de consulta
    if(!response.ok) {
        throw new Error(`[ERRO]: Erro com HTTP -> [DETALHES]: ${response.status}`);
    }

    // Aramazena a response como um JSON
    const dadosGeocodificacao = await response.json();
    // Retorna informcaoes em JSON formatado
    return {
        name: dadosGeocodificacao.results[0].name,
        latitude: dadosGeocodificacao.results[0].latitude,
        longitude: dadosGeocodificacao.results[0].longitude
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

    // Parametros de busca
    const params = {
        latitude: latitudeParam,
        longitude: longitudeParam,
        timezone: "auto",
        current: ["temperature_2m", "relative_humidity_2m", "apparent_temperature"]
    };
    const url = "https://api.open-meteo.com/v1/forecast";
    const responses = await fetchWeatherApi(url, params); // Consulta a API

    // Processa a primeira localizacao
    const response = responses[0];

    // Atributos para timezone e localizacao
    const utcOffsetSeconds = response.utcOffsetSeconds();
    const timezone = response.timezone();
    const latitude = response.latitude();
    const longitude = response.longitude();

    //const current = response.current()!;

    // Retorna informcaoes em JSON formatado
    return {
        timezone: timezone,
        latitude: latitude,
        longitude: longitude,
        atual : {
            horario: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
            //temperatura: current.variables(0)!.value(),
            //umidade: current.variables(1)!.value(),
            //sensacaoTermica: current.variables(2)!.value()
        }
    }

}
