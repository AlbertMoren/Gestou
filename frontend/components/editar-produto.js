/**
 * Componente: CompEditarProduto
 * Finalidade: Interface de formulário para atualização de dados de produtos existentes.
 * Diferencial: Utiliza a identidade visual azul (primary) para distinguir a ação de edição.
 */
const CompEditarProduto = {
    /**
     * Props: Recebe o objeto 'produto' (produtoParaEditar) enviado pelo app.js.
     * Este objeto contém os dados atuais do produto selecionado na tabela.
     */
    props: ['produto'],
    /**
     * Template: Estrutura visual com destaque em azul e botões de ação dupla (Salvar/Cancelar).
     */
    template: `
    <div class="row justify-content-center">

        <div class="col-md-6"> 

            <div class="card shadow border-primary">

                <div class="card-header bg-primary text-white d-flex justify-content-between align-items-center py-3"> 
                    <h5 class="mb-0">✏️ Editar Produto #{{ produto.id }}</h5>
                    <button class="btn-close btn-close-white" @click="$emit('cancelar')"></button>
                </div>

                <div class="card-body p-4">

                    <form @submit.prevent="$emit('atualizar')">
                        <div class="mb-3">
                            <label class="form-label fw-bold">Nome</label>
                            <input v-model="produto.name" class="form-control" required>
                        </div>

                        <div class="mb-3">
                            <label class="form-label fw-bold">Categoria</label>
                            <input v-model="produto.category" class="form-control" required>
                        </div>

                        <div class="mb-3">
                            <label class="form-label fw-bold">Preço (R$)</label>
                            <input type="number" step="0.01" v-model="produto.precoEmReais" class="form-control" required>
                        </div>

                        <div class="mb-3 form-check">
                            <input type="checkbox" v-model="produto.active" class="form-check-input" id="editActive">
                            <label class="form-check-label" for="editActive">Produto Ativo</label>
                        </div>
                        
                        <div class="d-flex gap-2">
                            <button type="submit" class="btn btn-primary w-100 fw-bold">Salvar Alterações</button>
                            <button type="button" class="btn btn-outline-secondary" @click="$emit('cancelar')">Cancelar</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>`
};