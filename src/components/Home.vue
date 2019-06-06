<template>
  <div class="hello">
    <div class="banner col-md-8 offset-2">
      <h1 class="titulo mb-1">
        Product Control</h1>
      <p class="sub-titulo">Gerencie seus produtos com performace e qualidade!</p>
    </div>


    <b-container class="bv-example-row ">
      <b-row>
        <!--<b-col class="atc_col_left">-->
          <!--<b-button class="atc_botao-lg" href="#/produto">Produto</b-button>-->
        <!--</b-col>-->
        <b-col >
          <b-button class="atc_botao-lg" href="#/categorias">Começar</b-button>
        </b-col>
      </b-row>
    </b-container>
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .atc_botao-lg {
    padding: 50px 50px 50px 50px;
    /*margin-top: 25%;*/

  }

  .atc_col_left {
    margin-left: 23%;
  }

  .atc_col_right {
    margin-right: 20%;
  }
  .banner {
  margin-top: 10%;
  display: block;
  }
  .titulo {
    font-size: 100px;
  }


</style>
