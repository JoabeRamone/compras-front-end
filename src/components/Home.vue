<template>
  <div class="container-principal">
    <div class="banner col-md-8 offset-2">
      <h1 class="titulo mb-1">
        Product Control</h1>
      <p class="sub-titulo">Gerencie seus produtos com performace e qualidade!</p>
      <b-button class="atc_botao-lg" href="#/categorias">Começar</b-button>
    </div>

    <p style="position: absolute;right: 10px;bottom: 10px">By Joabe Ramone</p>
  </div>
</template>

<script>
  export default {
    name: 'hello',
    data() {
      return {
        msg: 'Atacadão Sistema de Qualidade!'
      }
    }
  }
</script>

<style scoped>
  .atc_botao-lg {
    padding: 50px 50px 50px 50px;
  }

  .banner {
    margin-top: 10%;
    display: block;
  }

  .titulo {
    font-size: 100px;
  }

  .container-principal {
    margin-right: 65px
  }

</style>
