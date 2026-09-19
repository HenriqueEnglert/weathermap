<script setup>
  import { onMounted, ref } from 'vue';
  import  L  from 'leaflet';

  const cidade = ref('');
  const dados = ref(null);
  const erro = ref('');

  const map = ref(null);
  const mapContainer = ref(null);

  // Garante que os itens HTML iniciem com a pagina
  onMounted(() => {
    createMap();
  });

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
    // Mapa ja existe - apenas atualiza
    if(map.value !== null) {
      map.value.setView([lat, lon], 15);
    } else {
      // Mapa nao existe, cria um novo
      createMap();
    }
  
  }
  
  async function buscaClima() {
    console.log(`Cidade pesquisada: ${cidade.value}`);

    try {
      // Manda requisicao HTTP ao backend
      const response = await fetch(`http://localhost:3000/api/weather/${cidade.value}`);

      // Tratamento de erro - evita quebrar a pagina apos erro de requisicao
      if(!response.ok) {
        throw new Error(`Erro de consulta: ${response.status}`);
      }

      // Armazena o response como JSON
      dados.value = await response.json();

      // Atualiza o mapa com as coordenadas da consulta
      updateMap(dados.value.latitude, dados.value.longitude);

    } catch(error) {
      dados.value = null;
      erro.value = error.message;
      console.log(error.message);
    }
  }

</script>

<template>
  <div class="container">
    <h1> WeatherMap </h1>
    <p> Consulte o clima da cidade </p>

    <div class="busca">
      <input 
        class="digitarCidade" 
        id="inputCidade" 
        v-model="cidade" 
        type="text" 
        placeholder="Digite o nome de uma cidade"
      />

      <button class="botao" @click="buscaClima"> Buscar cidade </button>
    </div>

    <div class="resultado">
      <h2> Clima </h2>

      <div class="display-resultados" v-if="dados">
        <p class="resultado-clima"> Cidade: <span> {{ dados.cidade }} </span> </p>
        <p class="resultado-clima"> Temperatura: <span> {{ dados.weather.temperatura }} </span> </p>
        <p class="resultado-clima"> Umidade: <span> {{ dados.weather.umidade }}% </span> </p>
        <p class="resultado-clima"> Vento: <span> {{ dados.weather.windSpeed }}km/h </span> </p>
      </div>

      <div class="display-resultados" v-else-if="erro">
        <p class="resultado-clima"> Cidade: <span> Pendente </span> </p>
        <p class="resultado-clima"> Temperatura: <span> Pendente </span> </p>
        <p class="resultado-clima"> Umidade: <span> Pendente </span> </p>
        <p class="resultado-clima"> Vento: <span> Pendente </span> </p>
      </div>
         
    </div>

    <div ref="mapContainer" class="map-container"></div>

  </div>
</template>
