<template>
  <div class="row">
    <b-container class="col-md-6 offset-3" fluid>
      <b-card class="card" bg-variant="dark" text-variant="white">
        <h2 class="titulo-tabela">Categoria: {{corpoDosProdutos.nome}}</h2>
        <!--CADASTRAR PRODUTO-->
        <div class="botao-cadastro">
          <b-input-group-append>
            <b-button class="botao-criar-categoria"
                      v-b-modal.modal-cadastrar>
              <i class="fas fa-plus-circle"> Cadastrar Produto</i>
            </b-button>
          </b-input-group-append>
        </div>
        <div style="height: 350px">
          <b-table class="hover"
                   :items="corpoDosProdutos.produtos"
                   :fields="campoParaColunasDosProdutos"
                   :current-page="currentPage"
                   @filtered="onFiltered(item)"
                   :per-page="perPage">

            <template slot="preco" slot-scope="row">
              <p>{{corpoDosProdutos.produtos[row.index].preco}}</p>
            </template>
            <template slot="ação" slot-scope="row">
              <!--BOTAO PARA ATUALIZAR PRODUTO-->
              <b-button v-b-modal.modal-editar
                        title="Editar Categoria"
                        class="botao-produtos"
                        variant="outline-primary"
                        @click="mandaValorDaLinhaParaModal(row.item)"><i class="fas fa-edit"></i>
              </b-button>
              <!--BOTAO PARA EXCLUIR PRODUTO-->
              <b-button v-b-modal.modal-excluir
                        title="Excluir Produto"
                        class="botao-produtos"
                        variant="outline-primary"
                        @click="mandaValorDaLinhaParaModal(row.item)"><i class="fas fa-trash-alt"></i>
              </b-button>
            </template>
          </b-table>
        </div>
        <!--BOTAO VOLTAR PARA CATEGORIA-->
        <div class="botao-cadastro ">
          <b-input-group-append>
            <b-button class="botao-voltar-para-categoria"
                      v-b-modal.modal-cadastrar
                      to="/categorias"
            ><i class="fas fa-arrow-alt-circle-left"></i>
            </b-button>
          </b-input-group-append>
        </div>


        <!--PAGINAS-->
        <div class="barra-de-paginas">
          <b-row>
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
      </b-card>
    </b-container>
    <!--MODAL CADASTRAR-->
    <div>
      <b-modal id="modal-cadastrar" title="Cadastrar Produto" hide-footer ref="modal-cadastrar-produto">
        <div>
          <b-form @submit="cadastrarProduto" @reset="limparInputDoModal">
            <b-form-group class="col-md-6 offset-3"
                          label-for="input-1"
                          description="Não coloque nome inapropriado.">
              <b-form-input
                type="text"
                required
                placeholder="Nome do Produto"
                v-model="produto.nome"></b-form-input>
              <br>
              <b-form-input
                type="text"
                required
                placeholder="Preço do Produto"
                v-model="produto.preco"></b-form-input>
            </b-form-group>
            <div class="grupo-botao-modal">
              <b-button type="reset" variant="danger" @click="fecharModal(2)">Cancelar</b-button>
              <b-button type="submit" variant="success">Pronto</b-button>
            </div>
          </b-form>
        </div>
      </b-modal>
    </div>
    <!--MODAL-ATUALIZAR-->
    <div>
      <b-modal id="modal-editar" title="Atualizar Produto" hide-footer ref="modal-atualizar-produto">
        <div>
          <b-form @submit="atualizarProduto" @reset="limparInputDoModal">
            <b-form-group
              id="input-group-1"
              label="Nome: "
              label-for="input-1"
              description="Não coloque nome inapropriado.">
              <b-form-input
                type="text"
                required
                placeholder=""
                v-model="produto.nome"
              ></b-form-input>
              <br>
              <p>Preço:</p>
              <b-form-input
                type="text"
                required
                v-model="produto.preco"
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
              >Atualizar
              </b-button>
            </div>
          </b-form>
        </div>
      </b-modal>
    </div>
    <!--MODAL EXCLUIR-->
    <div>
      <b-modal id="modal-excluir" title="Excluir Produto" hide-footer ref="modal-excluir-produto">
        <div>
          <b-form @submit="excluirProduto" @reset="limparInputDoModal">
            <p>Deseja mesmo excluir o Produto {{produto.nome}} ?</p>

            <div class="grupo-botao-modal">
              <b-button type="reset" variant="danger" @click="fecharModal(3)">Cancelar</b-button>
              <b-button type="submit" variant="success">Pronto</b-button>
            </div>
          </b-form>
        </div>
      </b-modal>
    </div>
    <!--ALERT SUCESSO-->
    <div style="position: absolute;right: 10px;top: 10px;z-index: 100000">
      <b-alert
        :show="alertSucesso"
        dismissible
        variant="success"
        @dismissed="alertSucesso=0"
        @dismiss-count-down="setSegundos">
        <p v-show="flagSalvar">Produto salva com sucesso!</p>
        <p v-show="flagExcluir">Produto Excluida com sucesso!</p>
        <p v-show="flagAtualizar">Produto Atualizada com sucesso!</p>
      </b-alert>
    </div>
    <!--ALERT ERROR-->
    <div style="position: absolute;right: 10px;top: 10px;z-index: 100000">
      <b-alert
        :show="alertError"
        dismissible
        variant="danger"
        @dismissed="alertError=0"
        @dismiss-count-down="setSegundos">
        <p v-model="mensagem">{{mensagem}}</p>
      </b-alert>
    </div>
  </div>
</template>

<script>


  export default {
    name: "produto",
    data() {
      return {
        totalRows: 1,
        currentPage: 1,
        perPage: 4,
        categoriaId: '',
        corpoDosProdutos: [],
        campoParaColunasDosProdutos: [{key: 'nome'}, {key: 'preco'}, {key: 'ação'}],
        produto: {
          id: '',
          nome: '',
          preco: null
        },
        mensagem: '',
        dismissSecs: 10,
        alertSucesso: 0,
        alertError: 0,
        flagSalvar: false,
        flagExcluir: false,
        flagAtualizar: false
      }
    },
    created() {
      this.buscarProdutos(this.$router.app._route.params.id);
    },
    methods: {
      buscarProdutos(id) {
        this.categoriaId = id;
        this.$http.get('http://localhost:8082/categorias/' + id).then(response => {
          this.corpoDosProdutos = response.body;
          this.totalRows = this.corpoDosProdutos.produtos.length;
        });
      },
      buscarProdutosNovamente() {

        this.$http.get('http://localhost:8082/categorias/' + this.categoriaId).then(response => {
          this.corpoDosProdutos = response.body;
          this.totalRows = this.corpoDosProdutos.produtos.length;
        });
      },
      cadastrarProduto() {
        this.resetAlert();
        this.$http.post('http://localhost:8082/categorias/' + this.categoriaId + '/produtos', this.produto).then(response => {
          this.fecharModal(2);
          this.limparInputDoModal();
          this.buscarProdutosNovamente();
          this.showAlertSucesso(1);
        }, response => {
          this.mensagem = response.body.message;
          this.setSegundosError(4);
        });
      },
      atualizarProduto() {
        this.resetAlert();
        this.$http.put('http://localhost:8082/categorias/' + this.categoriaId + '/produtos', this.produto).then(response => {
          this.fecharModal(1);
          this.buscarProdutosNovamente();
          this.limparInputDoModal();
          this.showAlertSucesso(3);
        }, response => {
          this.mensagem = response.body.message;
          this.setSegundosError(4);
        });
      },
      excluirProduto() {
        this.resetAlert();
        this.$http.delete('http://localhost:8082/categorias/' + this.categoriaId + '/produtos', {body: this.produto}).then(response => {
          this.fecharModal(3);
          this.buscarProdutosNovamente();
          this.showAlertSucesso(2);
        }, response => {
          this.mensagem = response.body.message;
          this.setSegundosError(4);
        })
      },
      mandaValorDaLinhaParaModal(item) {
        this.produto.id = item.id;
        this.produto.nome = item.nome;
        this.produto.preco = item.preco;
      },
      fecharModal(opcaoDeModal) {
        if (opcaoDeModal === 1) {
          this.$refs['modal-atualizar-produto'].hide()
        } else if (opcaoDeModal === 2) {
          this.$refs['modal-cadastrar-produto'].hide()
        } else if (opcaoDeModal === 3) {
          this.$refs['modal-excluir-produto'].hide()
        }
      },
      limparInputDoModal() {
        this.produto.nome = '';
        this.produto.preco = '';
      },
      showAlertSucesso(opcao) {
        if (opcao === 1) {
          this.alertSucesso = this.dismissSecs;
          this.flagSalvar = true;
        } else if (opcao === 2) {
          this.alertSucesso = this.dismissSecs;
          this.flagExcluir = true;
        } else if (opcao === 3) {
          this.alertSucesso = this.dismissSecs;
          this.flagAtualizar = true;
        } else if (opcao === 4) {
          this.alertSucesso = this.dismissSecs;
        }
      },
      resetAlert() {
        this.flagSalvar = false;
        this.flagExcluir = false;
        this.flagAtualizar = false;
      },
      onFiltered(filteredItems) {
        this.totalRows = filteredItems.length;
        this.currentPage = 1
      },
      setSegundos(segundos) {
        this.alertSucesso = segundos
      },
      setSegundosError(segundos) {
        this.alertError = segundos;
      },
    }
  }
</script>

<style scoped>
  .botao-produtos {
    color: white;
    border: none;
  }

  .botao-criar-categoria {
    background-color: green;
  }

  .grupo-botao-modal {
    float: right;
  }

  .botao-cadastro {
    float: right;
    margin-bottom: 2%;
  }

  .titulo-tabela {
    float: left;
  }

  .card {
    margin-top: 10%;
    position: relative;
  }

  .barra-de-paginas {
    position: relative;
  }

  .row {
    margin-right: 0px;
  }

</style>
