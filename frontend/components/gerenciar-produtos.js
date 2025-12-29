const CompGerenciarProdutos = {
    props: ['todosProdutos'],
    template: `
    <div class="row">
        <div class="col-12">
            <div class="card shadow">
                <div class="card-header bg-dark text-white d-flex justify-content-between align-items-center">
                    <h5 class="mb-0">Lista Geral de Produtos</h5>
                    <button class="btn btn-sm btn-success" @click="$emit('novo')">+ Novo Produto</button>
                </div>
                <div class="card-body p-0">
                    <table class="table table-hover mb-0">
                        <thead class="table-light">
                            <tr><th>ID</th><th>Nome</th><th>Categoria</th><th>Preço</th><th>Status</th><th class="text-center">Ações</th></tr>
                        </thead>
                        <tbody>
                            <tr v-for="p in todosProdutos" :key="p.id">
                                <td>{{ p.id }}</td><td>{{ p.name }}</td><td>{{ p.category }}</td>
                                <td>R$ {{ (p.priceCents / 100).toFixed(2) }}</td>
                                <td><span :class="['badge', p.active ? 'bg-success' : 'bg-danger']">{{ p.active ? 'Ativo' : 'Inativo' }}</span></td>
                                <td class="text-center"><button class="btn btn-sm btn-primary" @click="$emit('editar', p)">✏️ Editar</button></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>`
};