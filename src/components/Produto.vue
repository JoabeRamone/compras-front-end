<template>
  <div class="row">
    <b-container class="col-md-6 offset-3" fluid>
      <b-card class="card" bg-variant="dark" text-variant="white">
        <h2 class="titulo-tabela">Categoria: {{corpoDosProdutos.nome}}</h2>
        <div class="botao-cadastro">
          <b-input-group-append>
            <b-button class="botao-criar-categoria"
                      v-b-modal.modal-cadastrar>
              <i class="fas fa-plus-circle"> Cadastrar Produto</i>
            </b-button>
          </b-input-group-append>
        </div>
        <!---------------------------------------------------------------------------------------------------->
        <div style="">
          <b-table class="hover"
                   show-empty
                   :items="corpoDosProdutos.produtos"
                   :fields="campoParaColunasDosProdutos"
                   :current-page="paginaAtual"
                   @filtered="onFiltered(item)"
                   :per-page="porPagina">

            <template  slot="preco" slot-scope="row">
              <div>R$: {{row.item.preco}}</div>
            </template>

            <template slot="ação" slot-scope="row">
              <b-button v-b-modal.modal-editar
                        title="Editar Categoria"
                        class="botao-produtos"
                        variant="outline-primary"
                        @click="mandaValorDaLinhaParaModal(row.item)"><i class="fas fa-edit"></i>
              </b-button>
              <b-button v-b-modal.modal-excluir
                        title="Excluir Produto"
                        class="botao-produtos"
                        variant="outline-primary"
                        @click="mandaValorDaLinhaParaModal(row.item)"><i class="fas fa-trash-alt"></i>
              </b-button>
            </template>
          </b-table>
        </div>
        <!---------------------------------------------------------------------------------------------------->
        <div style="">

          <b-row>
            <b-col md="6" class="my-1">
              <b-pagination
                v-model="paginaAtual"
                :total-rows="totalDeLinhas"
                :per-page="porPagina"
                class="my-0"
              ></b-pagination>

            </b-col>
            <b-input-group-append class="botao-voltar">
              <b-button class="botao-voltar-para-categoria"
                        v-b-modal.modal-cadastrar
                        to="/categorias"
              ><i class="fas fa-arrow-alt-circle-left"></i>
              </b-button>
            </b-input-group-append>

          </b-row>


        </div>

      </b-card>
    </b-container>
    <div>
      <b-modal id="modal-cadastrar" title="Cadastrar Produto" hide-footer ref="modal-cadastrar-produto">
        <div>
          <b-form @submit="cadastrarProduto" @reset="limparInputDoModal">
            <b-form-group class="col-md-6 offset-3"
                          label-for="input-1"
                          description="Não coloque nome inapropriado."

                          v-model="produto.nome">
              <b-form-input
                type="text"
                disable="number"
                required
                placeholder="Nome do Produto"
                v-model="produto.nome"></b-form-input>
              <div v-show="true">

                <b-form-invalid-feedback :state="validation">
                  <i class="fas fa-times"></i> O Nome do Produto não pode ultrapassar do que 19 Caracteres.
                </b-form-invalid-feedback>
                <b-form-valid-feedback :state="validation">
                  <i class="fas fa-check"></i> Válido.
                </b-form-valid-feedback>

              </div>

              <br>
              <div>
                <money class="form-control" :state="validationPreco"
                       v-model="produto.preco" v-bind="money"></money>
              </div>

              <b-form-valid-feedback :state="validationPreco">
                <i class="fas fa-check"></i> Válido.
              </b-form-valid-feedback>

              <b-form-invalid-feedback :state="validationPreco">
                <i class="fas fa-times"></i> O preço não pode ser negativo.
              </b-form-invalid-feedback>

            </b-form-group>

            <div class="grupo-botao-modal">
              <b-button type="reset" variant="danger" @click="fecharModal(2)">Cancelar</b-button>
              <b-button type="submit" variant="success">Pronto</b-button>
            </div>
          </b-form>
        </div>
      </b-modal>
    </div>
    <div>
      <b-modal id="modal-editar" title="Atualizar Produto" hide-footer ref="modal-atualizar-produto">
        <div>
          <b-form @submit="atualizarProduto" @reset="limparInputDoModal">
            <b-form-group
              id="input-group-1"
              label="Nome: "
              label-for="input-1"
              description="Não coloque nome inapropriado.">
              <div>
                <b-form-input type="text" required v-model="produto.nome"></b-form-input>
                <b-form-invalid-feedback :state="validation">
                  <i class="fas fa-times"></i> O Nome do Produto não pode ultrapassar do que 19 Caracteres.
                </b-form-invalid-feedback>
                <b-form-valid-feedback :state="validation">
                  <i class="fas fa-check"></i> Válido.
                </b-form-valid-feedback>
              </div>
              <br>
              <p>Preço:</p>
              <div>
                <money class="form-control"
                       v-model="produto.preco" v-bind="money"></money>

                <b-form-valid-feedback :state="validationPreco">
                  <i class="fas fa-check"></i> Válido.
                </b-form-valid-feedback>

                <b-form-invalid-feedback :state="validationPreco">
                  <i class="fas fa-times"></i> O preço não pode ser negativo.
                </b-form-invalid-feedback>
              </div>


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
    <div style="position: absolute;right: 10px;top: 10px;z-index: 100000">
      <b-alert
        :show="alertSucesso"
        dismissible
        variant="success"
        @dismissed="alertSucesso=0"
        @dismiss-count-down="setSegundos">
        <p v-show="flagSalvar">Produto salvo com sucesso!</p>
        <p v-show="flagExcluir">Produto Excluido com sucesso!</p>
        <p v-show="flagAtualizar">Produto Atualizado com sucesso!</p>
      </b-alert>
    </div>
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
  import {Money} from 'v-money'

  export default {
    components: {Money},
    name: "produto",
    data() {
      return {
        totalDeLinhas: 1,
        paginaAtual: 1,
        porPagina: 4,
        categoriaId: '',
        corpoDosProdutos: [],
        campoParaColunasDosProdutos: [{key: 'nome'}, {key: 'preco', label: 'Preço'}, {key: 'ação'}],
        produto: {
          id: '',
          nome: '',
          preco: 0
        },
        mensagem: '',
        dismissSecs: 10,
        alertSucesso: 0,
        alertError: 0,
        flagSalvar: false,
        flagExcluir: false,
        flagAtualizar: false,
        validacaoDoForm: false,
        money: {
          decimal: ',',
          thousands: '.',
          prefix: 'R$ ',

          precision: 2,
          masked: false
        }
      }
    },
    created() {
      this.buscarProdutos(this.$router.app._route.params.id);
    },
    computed: {
      validation() {
        if (this.produto.nome.length === 0) {
          this.validacaoDoForm = null;
          return null;
        } else if (this.produto.nome.length < 20) {
          this.validacaoDoForm = true;
          return true;
        }
        this.validacaoDoForm = false;
        return false;
      },
      validationPreco() {
        if (this.produto.preco < 0) {
          return false;
        }
        if (this.produto.preco > 0.001) {
          return true;
        }
      }
    },
    methods: {
      buscarProdutos(id) {

        this.categoriaId = id;
        this.$http.get('https://controle-produtos-app.herokuapp.com/categorias/' + id).then(response => {
          this.corpoDosProdutos = response.body;
          this.totalDeLinhas = this.corpoDosProdutos.produtos.length;
        });

      },
      buscarProdutosNovamente() {

        this.$http.get('https://controle-produtos-app.herokuapp.com/categorias/' + this.categoriaId).then(response => {
          this.corpoDosProdutos = response.body;
          this.totalDeLinhas = this.corpoDosProdutos.produtos.length;
        });
      },
      cadastrarProduto() {
        if (!this.validacaoDoForm) {
          return;
        }
        this.resetAlert();
        this.$http.post('https://controle-produtos-app.herokuapp.com/categorias/' + this.categoriaId + '/produtos', this.produto).then(response => {
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
        this.$http.put('https://controle-produtos-app.herokuapp.com/categorias/' + this.categoriaId + '/produtos', this.produto).then(response => {
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
        this.$http.delete('https://controle-produtos-app.herokuapp.com/categorias/' + this.categoriaId + '/produtos', {body: this.produto}).then(response => {
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
          this.$refs['modal-atualizar-produto'].hide();
        } else if (opcaoDeModal === 2) {
          this.$refs['modal-cadastrar-produto'].hide();
        } else if (opcaoDeModal === 3) {
          this.$refs['modal-excluir-produto'].hide();
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
        this.totalDeLinhas = filteredItems.length;
        this.paginaAtual = 1;
      },
      setSegundos(segundos) {
        this.alertSucesso = segundos;
      },
      setSegundosError(segundos) {
        this.alertError = segundos;
      },
    }
  }
</script>

<style src="../temas/style.css"></style>
