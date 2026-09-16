<script setup>
  import { ref } from 'vue'

  const cidade = ref('');
  
  function buscaClima() {
    alert(`Cidade pesquisada: ${cidade.value}`)
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
      
      <p class="resultado-clima"> Cidade: <span> Pendente </span> </p>
      <p class="resultado-clima"> Temperatura: <span> Pendente </span> </p>
      <p class="resultado-clima"> Umidade: <span> Pendente </span> </p>
      <p class="resultado-clima"> Vento: <span> Pendente </span> </p>
      
      </div>
  </div>
</template>
