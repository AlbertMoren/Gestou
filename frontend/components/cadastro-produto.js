const CompCadastroProduto = {
    props: ['novoProduto'],
    template: `
    <div class="row justify-content-center">
        <div class="col-md-6">
            <div class="card shadow">
                <div class="card-header bg-dark text-white"><h5>Novo Produto</h5></div>
                <div class="card-body">
                    <form @submit.prevent="$emit('salvar')">
                        <div class="mb-3"><label>Nome</label><input v-model="novoProduto.name" class="form-control" required></div>
                        <div class="mb-3"><label>Categoria</label><input v-model="novoProduto.category" class="form-control" required></div>
                        <div class="mb-3"><label>Preço (R$)</label><input type="number" step="0.01" v-model="novoProduto.precoEmReais" class="form-control" required></div>
                        <div class="mb-3 form-check"><input type="checkbox" v-model="novoProduto.active" class="form-check-input" id="active"><label class="form-check-label" for="active">Ativo</label></div>
                        <button type="submit" class="btn btn-primary w-100">Salvar Produto</button>
                    </form>
                </div>
            </div>
        </div>
    </div>`
};