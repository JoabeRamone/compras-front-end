<template>
  <div class="row">

    <b-container class="col-md-6 offset-3" fluid>
      <!--BARRA DE PESQUISA-->

      <b-form-group label-cols-sm="3" class="mb-0">
      </b-form-group>

      <!--BOTAO PARA CADASTRAR CATEGORIA-->
      <b-card  class="card" bg-variant="dark" text-variant="white">


        <h2 class="titulo-tabela">Tabela de categorias</h2>


        <div class="botao-cadastro">
          <b-input-group-append>
            <b-button class="botao-criar-categoria"
                      v-b-modal.modal-cadastrar>
              <i class="fas fa-plus-circle"> Cadastrar Categoria</i>
            </b-button>
          </b-input-group-append>

        </div>

        <!--:filter="filter"-->
        <!--TABELA-->
        <b-table class="hover"
                 :items="corpoDaCategoria"
                 :fields="campoParaColunasDaCategoria"
                 :sort-by.sync="sortBy"
                 :sort-desc.sync="sortDesc"
                 @filtered="onFiltered">

          <template slot="ação" slot-scope="row">

            <!--BOTAO PARA ATUALIZAR CATEGORIA-->
            <b-button v-b-modal.modal-editar
                      title="Editar Categoria"
                      class="botao-categoria"
                      variant="outline-primary"
                      @click="adicionarValoresDaLinhaClicada(row.item, row.index)">
              <i class="fas fa-edit"></i>
            </b-button>

            <!--BOTAO PARA EXCLUIR CATEGORIA-->
            <b-button v-b-modal.modal-excluir
                      title="Excluir Categoria"
                      class="botao-categoria"
                      variant="outline-primary"
                      @click="mandaValorDaLinhaParaModalCategoria(row.item)"
            >
              <i class="fas fa-trash-alt"></i>
            </b-button>

            <!--BOTAO PARA CADASTRAR PRODUTO-->
            <b-button title="Adicionar Produto"
                      class="botao-categoria"
                      variant="outline-primary"
                      @click="routerParaProdutos(adicionarValoresDaLinhaClicada(row.item, row.index))"

            >
              <i class="fas fa-archive"></i>
            </b-button>

          </template>

        </b-table>

        <div class="barra-de-paginas">
          <b-row  >
            <b-col md="6" class="my-1">
              <b-pagination
                v-model="currentPage"
                :total-rows="totalRows"
                :per-page="perPage"
                class="my-0"
              ></b-pagination>
            </b-col>
          </b-row>

        </div>


        <div class="botao-cadastro">
          <b-button  variant="danger">Voltar</b-button>
        </div>
      </b-card>
    </b-container>


    <!--MODAL-ATUALIZAR-->
    <div>
      <b-modal id="modal-editar" title="Atualizar Categoria" hide-footer ref="modal-atualizar-categorias">
        <div>
          <b-form @submit="atualizarNomeCategoria" @reset="limparInputDoModal">
            <b-form-group
              id="input-group-1"
              label="Nome da Categoria: "
              label-for="input-1"
              description="Não coloque nome inapropriado.">
              <b-form-input id="inputCategoria"
                            type="text"
                            required
                            placeholder="Digite um categorias"
                            v-model="categoria.nome"
              ></b-form-input>
            </b-form-group>
            <div class="grupo-botao-modal">
              <b-button type="reset"
                        variant="danger"
                        @click="fecharModal(1)"
              >Cancelar
              </b-button>
              <b-button type="submit"
                        variant="success"
                        @click=""
              >Atualizar
              </b-button>
            </div>
          </b-form>
        </div>
      </b-modal>
    </div>
    <!--MODAL CADASTRAR-->
    <div>
      <b-modal id="modal-cadastrar" title="Cadastrar Categoria" hide-footer ref="modal-cadastrar-categoria">
        <div>
          <b-form @submit="cadastrarCategoria" @reset="limparInputDoModal">
            <b-form-group
              label="Nome da Categoria: "
              label-for="input-1"
              description="Não coloque nome inapropriado.">
              <b-form-input type="text"
                            required
                            placeholder="Digite um nome para a categoria"
                            v-model="categoria.nome"
              ></b-form-input>
            </b-form-group>


            <div class="grupo-botao-modal">
              <b-button type="reset" variant="danger" @click="fecharModal(2)">Cancelar</b-button>
              <b-button type="submit" variant="success">Pronto</b-button>
            </div>

          </b-form>
        </div>
      </b-modal>
    </div>

    <!--MODAL EXCLUIR-->
    <div>
      <b-modal id="modal-excluir" title="Excluir Categoria" hide-footer ref="modal-excluir-categoria">
        <div>
          <b-form @submit="removerCategoria()" @reset="limparInputDoModal">
            <p>Deseja mesmo excluir a categoria {{valorParaSerExcluido.nome}} ?</p>

            <div class="grupo-botao-modal">
              <b-button type="reset" variant="danger" @click="fecharModal(3)">Cancelar</b-button>
              <b-button type="submit" variant="success">Pronto</b-button>
            </div>

          </b-form>
        </div>
      </b-modal>
    </div>


  </div>
</template>

<script>
  export default {

    name: "categorias",
    data() {
      return {
        totalRows: 1,
        currentPage: 1,
        perPage: 5,
        sortBy: 'age',
        sortDesc: false,
        fields: ['first_name', 'last_name', 'show_details'],
        corpoDaCategoria: [],
        campoParaColunasDaCategoria: [{key: 'nome', sortable: true}, {key: 'ação'}],
        valorParaSerExcluido: {
          id: '',
          nome: ''
        },
        valorDaCategoriaAtualizado: '',
        nomeDaCategoriaParaCadastrar: '',
        categoria: {
          id: '',
          nome: '',
        }
      }
    },
    created() {
      this.buscarCategorias();
    },
    methods: {
      buscarCategorias() {
        this.$http.get('http://localhost:8050/categorias').then(response => {
          this.corpoDaCategoria = response.body;
          console.log(this.corpoDaCategoria)
        });
      },
      fecharModal(opcaoDeModal) {
        if (opcaoDeModal === 1) {
          this.$refs['modal-atualizar-categoria'].hide()
        } else if (opcaoDeModal === 2) {
          this.$refs['modal-cadastrar-categoria'].hide()
        } else if (opcaoDeModal === 3) {
          this.$refs['modal-excluir-categoria'].hide()
        }

      },
      limparInputDoModal(evt) {
        evt.preventDefault();
        this.valorDaCategoriaAtualizado = '';
        this.nomeDaCategoriaParaCadastrar = '';
      },
      adicionarValoresDaLinhaClicada(categoriaDaLinhaClicadaDoBotaoEditar) {
        this.categoria.id = categoriaDaLinhaClicadaDoBotaoEditar.id;
        this.categoria.nome = categoriaDaLinhaClicadaDoBotaoEditar.nome;
      },
      cadastrarCategoria(evt) {
        evt.preventDefault();
        console.log(this.categoria.nome);
        this.$http.post('http://localhost:8082/categorias', this.categoria).then(response => {
          alert("Categoria Salva!");
          this.fecharModal(2);
          this.buscarCategorias();
        }, response => {

        });

      },
      mandaValorDaLinhaParaModalCategoria(categoriaClicadaDaLinhaDoBotaoExcluir) {
        this.valorParaSerExcluido.id = categoriaClicadaDaLinhaDoBotaoExcluir.id;
        this.valorParaSerExcluido.nome = categoriaClicadaDaLinhaDoBotaoExcluir.nome;
      },
      removerCategoria() {
        console.log(this.valorParaSerExcluido.id);

        this.$http.delete('http://localhost:8082/categorias/' + this.valorParaSerExcluido.id).then(response => {
          alert("Categoria Excluida!");
          this.fecharModal(3);
          this.buscarCategorias();
        }, response => {
          alert("Erro ao excluir!")
        })

      },
      atualizarNomeCategoria(evt) {
        evt.preventDefault();
        this.$http.put('http://localhost:8082/categorias', this.categorias).then(response => {
          alert("Categoria Atualizada com sucesso!");
          this.fecharModal(1);
          this.buscarCategorias();
        }, response => {
          alert("Erro ao Atualizar!")
        });
      },
      routerParaProdutos() {
        console.log(this.categoria.id);

        this.$router.push('/categorias/' + this.categoria.id + '/produtos')
      },
      onFiltered(filteredItems) {
        // Trigger pagination to update the number of buttons/pages due to filtering
        this.totalRows = filteredItems.length;
        this.currentPage = 1
      }
    }
  }
</script>


<style scoped>
  .botao-categoria {
    color: white;
    border: none;
  }

  .botao-criar-categoria {
    background-color: green;
  }

  .grupo-botao-modal {
    float: right;
  }
  .botao-cadastro{
    float: right;
    margin-bottom: 2%;
  }
  .titulo-tabela{
    float: left;
  }
  .card{
    position: relative;
  }
  .barra-de-paginas{
    position: relative;
  }
  .mostra-modal-nome-categoria-para-atualizar {
    font-size: 30px;
    float: left;
  }
  .row {
    margin-right: 0px;
  }
  .card {
    margin-top: 10%;
  }
</style>
