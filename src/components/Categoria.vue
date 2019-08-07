<template>
  <div class="row">
    <b-container class="col-md-6 offset-3" fluid>
      <b-card class="card" bg-variant="dark" text-variant="white">
        <h2 class="titulo-tabela">Tabela de categorias</h2>
        <div class="botao-cadastro">
          <b-input-group-append>
            <b-button class="botao-criar-categoria"
                      v-b-modal.modal-cadastrar>
              <i class="fas fa-plus-circle"> Cadastrar Categoria</i>
            </b-button>
          </b-input-group-append>
        </div>
        <div style="">
          <b-table class="hover"
                   :items="corpoDaCategoria"
                   :fields="campoParaColunasDaCategoria"
                   :sort-by.sync="sortBy"
                   :sort-desc.sync="sortDesc"
                   :current-page="currentPage"
                   @filtered="onFiltered(item)"
                   :per-page="perPage">
            <template slot="ação" slot-scope="row">
              <b-button v-b-modal.modal-editar
                        title="Editar Categoria"
                        class="botao-categoria"
                        variant="outline-primary"
                        @click="adicionarValoresDaLinhaClicada(row.item, row.index)">
                <i class="fas fa-edit"></i>
              </b-button>
              <b-button v-b-modal.modal-excluir
                        title="Excluir Categoria"
                        class="botao-categoria"
                        variant="outline-primary"
                        @click="mandaValorDaLinhaParaModalCategoria(row.item)">
                <i class="fas fa-trash-alt"></i>
              </b-button>
              <b-button title="Adicionar Produto"
                        class="botao-categoria"
                        variant="outline-primary"
                        @click="routerParaProdutos(adicionarValoresDaLinhaClicada(row.item, row.index))">
                <i class="fas fa-archive"></i>
              </b-button>
            </template>
          </b-table>
        </div>

        <div>
          <b-row>
            <b-col md="6" class="my-1">
              <b-pagination
                v-model="currentPage"
                :total-rows="totalRows"
                :per-page="perPage"
                class="my-0"
              ></b-pagination>
            </b-col>
            <b-input-group-append class="botao-voltar">
              <b-button class="botao-voltar-para-categoria"
                        v-b-modal.modal-cadastrar
                        to="/"
              ><i class="fas fa-arrow-alt-circle-left"></i>
              </b-button>
            </b-input-group-append>
          </b-row>
        </div>

      </b-card>
    </b-container>
    <div>
      <b-modal id="modal-editar" title="Atualizar Categoria" hide-footer ref="modal-atualizar-categoria">
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
                            v-model="categoria.nome">
              </b-form-input>
            </b-form-group>
            <div class="grupo-botao-modal">
              <b-button type="reset"
                        variant="danger"
                        @click="fecharModal(1)">
                Cancelar
              </b-button>
              <b-button type="submit"
                        variant="success"
                        @click="">
                Atualizar
              </b-button>
            </div>
          </b-form>
        </div>
      </b-modal>
    </div>
    <div>
      <b-modal id="modal-cadastrar" title="Cadastrar Categoria" hide-footer ref="modal-cadastrar-categoria">
        <div>
          <b-form @submit="cadastrarCategoria" @reset="limparInputDoModal">
            <b-form-group
              :state="validation"
              label="Nome da Categoria: "
              description="Não coloque nome inapropriado.">

              <b-form-input id="input-cadastro"
                            :state="validation"
                            type="text"
                            required
                            placeholder="Digite um nome para a categoria"
                            v-model="categoria.nome">
              </b-form-input>
              <b-form-invalid-feedback :state="validation">
                <i class="fas fa-times"></i> O Nome da Categoria não pode ultrapassar do que 25 Caracteres.
              </b-form-invalid-feedback>
              <b-form-valid-feedback :state="validation">
                <i class="fas fa-check"></i> Válido.
              </b-form-valid-feedback>
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
      <b-modal id="modal-excluir" title="Excluir Categoria" hide-footer ref="modal-excluir-categoria">
        <div>
          <b-form @submit="removerCategoria()" @reset="limparInputDoModal">
            <p>Deseja mesmo excluir a categoria {{categoria.nome}} ?</p>
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
        <p v-show="flagSalvar">Categoria salva com sucesso!</p>
        <p v-show="flagExcluir">Categoria Excluida com sucesso!</p>
        <p v-show="flagAtualizar">Categoria Atualizada com sucesso!</p>
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
  export default {

    name: "categorias",
    data() {
      return {
        totalRows: 1,
        currentPage: 1,
        perPage: 4,
        sortBy: 'age',
        sortDesc: false,
        corpoDaCategoria: [],
        campoParaColunasDaCategoria: [{key: 'nome', sortable: true}, {key: 'ação'}],
        categoria: {
          id: '',
          nome: '',
        },
        mensagem: '',
        dismissSecs: 10,
        alertSucesso: 0,
        alertError: 0,
        flagSalvar: false,
        flagExcluir: false,
        flagAtualizar: false,
        validacaoDoForm: false
      }
    },
    created() {
      this.buscarCategorias();
    },
    computed: {
      validation() {
        if (this.categoria.nome.length === 0) {
          this.validacaoDoForm = null;
          return null;
        } else if (this.categoria.nome.length < 26) {
          this.validacaoDoForm = true;
          return true;
        }
        this.validacaoDoForm = false;
        return false;
      }
    },
    methods: {
      buscarCategorias() {
        this.$http.get('http://localhost:8082/categorias').then(response => {
          this.corpoDaCategoria = response.body;
          this.totalRows = this.corpoDaCategoria.length;
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
      limparInputDoModal() {
        this.categoria.nome = '';
      },
      adicionarValoresDaLinhaClicada(categoriaDaLinhaClicadaDoBotaoEditar) {
        this.categoria.id = categoriaDaLinhaClicadaDoBotaoEditar.id;
        this.categoria.nome = categoriaDaLinhaClicadaDoBotaoEditar.nome;
      },
      cadastrarCategoria() {
        if (!this.validacaoDoForm) {
          return
        }
        this.resetAlert();
        this.$http.post('https://controle-produtos-app.herokuapp.com/categorias', this.categoria).then(response => {
          this.fecharModal(2);
          this.limparInputDoModal();
          this.buscarCategorias();
          this.showAlertSucesso(1);
        }, response => {
          this.mensagem = response.body.message;
          this.setSegundosError(4);
        });
      },
      mandaValorDaLinhaParaModalCategoria(categoriaClicadaDaLinhaDoBotaoExcluir) {
        this.categoria.id = categoriaClicadaDaLinhaDoBotaoExcluir.id;
        this.categoria.nome = categoriaClicadaDaLinhaDoBotaoExcluir.nome;
      },
      removerCategoria() {
        this.resetAlert();
        this.$http.delete('http://localhost:8082/categorias/' + this.categoria.id).then(response => {
          this.fecharModal(3);
          this.buscarCategorias();
          this.limparInputDoModal();
          this.showAlertSucesso(2);
        }, response => {
          this.mensagem = response.body.message;
          this.setSegundosError(4);
        })
      },
      atualizarNomeCategoria() {
        this.resetAlert();
        this.$http.put('http://localhost:8082/categorias', this.categoria).then(response => {
          this.fecharModal(1);
          this.buscarCategorias();
          this.showAlertSucesso(3);
        }, response => {
          this.mensagem = response.body.message;
          this.setSegundosError(4);
        });
      },
      routerParaProdutos() {
        this.$router.push('/categorias/' + this.categoria.id + '/produtos')
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
      }
    }
  }
</script>

<style src="../temas/style.css"></style>
