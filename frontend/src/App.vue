<script setup>
  import { ref } from 'vue'

  const cidade = ref('')

  function buscaClima() {
    alert('Cidade pesquisada: ${cidade.value}')
  }
</script>

<template>
  <div class="container">
    <h1> WeatherMap </h1>
    <p> Consulte o clima da cidade </p>

    <div class="busca">
      <input class="digitarCidade" v-model="cidade" type="text" placeholder="Digite o nome de uma cidade"/>

      <button class="botao" @click="buscaClima"> Buscar cidade </button>
    </div>

    <div class="resultado">
      <h2> Clima </h2>

      <p class="resultado-clima" id="cidade-id"> Cidade: <span> Florianopolis </span> </p>
      <p class="resultado-clima"> Temperatura: <span> 30 </span> </p>
      <p class="resultado-clima"> Umidade: <span> 75% </span> </p>
      <p class="resultado-clima"> Vento: <span> 12km/h </span> </p>
    </div>
  </div>
</template>

