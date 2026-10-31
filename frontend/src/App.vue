<script setup>
  import { onMounted, ref, toRaw } from 'vue';
  import L from 'leaflet';

  const dadosDashboard = ref(null);

  const cidade = ref(''); // Objeto JSON contendo dados necessarios para identificacao e pesquisa de uma cidade
  const dados = ref(null); // Dados originados da consulta de clima ao backend
  const erro = ref('');
  
  const sugestoes = ref([]);

  const mostrarAlerta = ref(false);

  // Flag exibicao visual estado de carregamento - estado inicial previne informacoes
  const estaCarregando = ref(null);

  const map = ref(null);
  const mapContainer = ref(null);

  // Garante que os itens HTML iniciem com a pagina
  onMounted(() => {
    createMap();
    atualizaDashboard();
  });

  async function atualizaDashboard() {
    console.log('Buscando dados para o dashboard');

    try {
      // Requisicao HTTP ao backend
      const response = await fetch('http://localhost:3000/api/dashboard');

      // Tratamento de erro - evita quebra da pagina
      if(!response.ok) {
        throw new Error(`Erro ao atualizar o dashboard: ${response.status}`);
      }

      // Atualiza os dados do dashboard
      dadosDashboard.value = await response.json();

    } catch (error) {
      dadosDashboard.value = null;
      console.log(error.message);
    }
  }

  // Cria o mapa - de acordo com a documentacao do Leaflet
  function createMap() {
    if(mapContainer.value) {
      map.value = L.map(mapContainer.value).setView([0, 0], 1);

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(map.value);
    }
  }

  // Atualiza a posicao do mapa - coordenadas como parametro
  function updateMap(lat, lon) {
    if(map.value !== null) {
      map.value.setView([lat, lon], 15); // Muda a visualizacao
      setMarker(lat, lon); // Adiciona um marcador
    } else {
      // Cria novo mapa
      createMap();
    }
  }

  // Adiciona um marcador ao mapa
  function setMarker(lat, lon) {
    // Instanciar primeiro
    const marker = L.marker([lat, lon]);

    // Adicionar ao mapa depois - impede o marcador de 'flutuar' ao mudar o zoom
    marker
      .addTo(toRaw(map.value)) // Metodo 'toRaw' impede o Vue de tentar dinamizar o mapa ao mudar o zoom
      .bindPopup(`<b>${dados.value.cidade}</b><br>Temperatura: ${dados.value.weather.temperatura}°C`)
      .openPopup();
  }
  
  // Busca o clima atual da cidade compativel com o termo de busca
  async function buscaClima() {
    console.log(`Cidade pesquisada: ${cidade.value.name}`);

    // Confere se a cidade e um JSON valido para consulta - PROVENINETE DA SELECAO DE UMA SUGESTAO
    if(!validaCidadeJSON()) {
      mostrarAlerta.value = true;
      return;
    }

    try {
      estaCarregando.value = true;

      // Manda requisicao HTTP ao backend
      const response = await fetch(
        `http://localhost:3000/api/weather.coords/` 
        + `${cidade.value.name}/` 
        + `${cidade.value.state}/` 
        + `${cidade.value.country}/` 
        + `${cidade.value.latitude}/` 
        + `${cidade.value.longitude}`
      );

      // Tratamento de erro - evita quebrar a pagina apos erro de requisicao
      if(!response.ok) {
        throw new Error(`Erro de consulta: ${response.status}`);
      }

      // Armazena o response como JSON
      dados.value = await response.json();

      // Atualiza o mapa com as coordenadas da consulta
      updateMap(dados.value.latitude, dados.value.longitude);

      atualizaDashboard();

    } catch(error) {
      dados.value = null;
      erro.value = error.message;
      console.log(error.message);
    } finally {
      cidade.value = '';
      estaCarregando.value = false;
    }
  }

  // Busca cidades compativeis com o termo de consulta
  async function buscarSugestoes() {
    try {
      // Manda requisicao HTTP ao Backend
      const response = await fetch(`http://localhost:3000/api/cidades/${cidade.value}`);

      // Tratamento de erro
      if(!response.ok) {
        throw new Error(`Erro de consulta: ${response.status}`);
      }

      // Armazena as cidades compativeis
      sugestoes.value = await response.json();

    } catch(error) {
      sugestoes.value = [];
      console.log(error.message);
    }
  }

  // Define a cidade com base na selecao das compatibilidades
  function selecionarCidade(item) {
    // Associa a referencia de cidade ao item selecionado
    cidade.value = item;

    // Apaga o alerta mostrado sobre o input
    mostrarAlerta.value = false;

    sugestoes.value = [];
  }

  // Executa a verificacao da referencia Cidade - verifica se e um objeto JSON
  function validaCidadeJSON() {
    const ehObjeto = typeof cidade.value === 'object';
    const naoEhNull = cidade.value != null;

    return ehObjeto && naoEhNull;
  }

</script>

<template>
  <div class="container">
    <h1> WeatherMap </h1>
    <p> ☀️ Consulte o clima da cidade 🌧️ </p>

    <div class="busca">
      
      <div class="alertaCampoVazio" v-if="mostrarAlerta">
        <p>Selecione uma sugestao valida para a pesquisa!</p>
      </div>

      <div class="busca-linha">
        <div class="campo-cidade">
          <input 
            class="digitarCidade" 
            id="inputCidade" 
            v-model="cidade" 
            @input="buscarSugestoes"
            type="text"
            autocomplete="off"
            placeholder="Digite o nome de uma cidade"
          />

          <div class="lista-cidade" v-if="sugestoes.length > 0">
            <div 
              class="cidade-item"
              v-for="item in sugestoes"
              :key="item.id"
              @click="selecionarCidade(item)"
            >
              <strong>
                - {{ item.name }} - {{ item.country }} - {{ item.state }}
              </strong>
            </div>
          </div>
        </div>

        <button class="botao" @click="buscaClima"> Buscar cidade </button>
      </div>
    </div>

    <div class="resultado" v-if="estaCarregando != null">
      <div v-if="estaCarregando">
        <h2> Carregando... </h2>
      </div>

      <div v-if="!estaCarregando">
        <h2> Clima </h2>

        <div class="display-resultados" v-if="dados">
          <p class="resultado-clima"> 📍 Cidade: <span> {{ dados.cidade }} </span> </p>
          <p class="resultado-clima"> 🌡️ Temperatura: <span> {{ dados.weather.temperatura }} °C </span> </p>
          <p class="resultado-clima"> 🌫️ Umidade: <span> {{ dados.weather.umidade }}% </span> </p>
          <p class="resultado-clima"> 🍃 Vento: <span> {{ dados.weather.windSpeed }}km/h </span> </p>

          <div class="descricao-clima">
            <p class="resultado-clima"> Descrição Clima: <span> {{ dados.weather.descricaoClima }} </span></p>
          </div>

        </div>

        <div class="display-resultados" v-else-if="erro">
          <p class="resultado-clima"> 📍 Cidade: <span> Pendente </span> </p>
          <p class="resultado-clima"> 🌡️ Temperatura: <span> Pendente </span> </p>
          <p class="resultado-clima"> 🌫️ Umidade: <span> Pendente </span> </p>
          <p class="resultado-clima"> 🍃 Vento: <span> Pendente </span> </p>

        <div class="descricao-clima">
          <p class="resultado-clima"> Descrição Clima: <span> Pendente </span></p>
        </div>

        </div>
      </div>
         
    </div>

    <div ref="mapContainer" class="map-container"></div>

    <div class="dashboard" v-if="dadosDashboard">

      <p> 📊 Pesquisas totais: <span> {{ dadosDashboard.pesquisasTotais }} </span> </p>
      <p> 🔍 Pesquisas hoje: <span> {{ dadosDashboard.pesquisasHoje }} </span> </p>
      <p> Cidade mais consultada </p>

      <div class="dashboard-cidade" v-if="dadosDashboard.cidadeMaisConsultada">
        <p> 📍 Cidade: <span> {{ dadosDashboard.cidadeMaisConsultada.cidade }} </span> </p>
        <p> 🧭 Estado: <span> {{ dadosDashboard.cidadeMaisConsultada.estado }} </span> </p>
        <p> 🌎 Pais: <span> {{ dadosDashboard.cidadeMaisConsultada.pais }} </span> </p>
        <p> Quantidade de pesquisas: <span> {{ dadosDashboard.cidadeMaisConsultada.qtd_pesquisas }} </span> </p>
      </div>

    </div>

  </div>
</template>
