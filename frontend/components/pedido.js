const CompPedido = {
    props: ['produtos', 'clientes', 'carrinho', 'filtro', 'totalCarrinho', 'selectedCustomerId'],
    template: `
    <div class="row">
        <div class="col-lg-8">
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h4 class="mb-0">Catálogo de Produtos</h4>
                <div class="input-group w-50">
                    <input :value="filtro.search" @input="filtro.search = $event.target.value" @keyup.enter="$emit('buscar')" type="text" class="form-control" placeholder="Buscar por nome...">
                    <button class="btn btn-primary" @click="$emit('buscar')">🔍</button>
                </div>
            </div>
            <div class="row">
                <div v-for="p in produtos" :key="p.id" class="col-md-6 mb-3">
                    <div class="card h-100 card-produto shadow-sm">
                        <div class="card-body">
                            <div class="d-flex justify-content-between">
                                <h5 class="card-title text-truncate">{{ p.name }}</h5>
                                <span class="badge bg-info text-dark small">{{ p.category }}</span>
                            </div>
                            <p class="h4 text-primary my-3">R$ {{ (p.priceCents / 100).toFixed(2) }}</p>
                            <button class="btn btn-outline-primary w-100" @click="$emit('add', p)">Adicionar ao Carrinho</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-lg-4">
            <div class="card shadow carrinho-fixo">
                <div class="card-header bg-primary text-white py-3"><h5 class="mb-0">Finalizar Pedido</h5></div>
                <div class="card-body">
                    <div class="mb-4">
                        <label class="form-label fw-bold">1. Selecione o Cliente</label>
                        <select :value="selectedCustomerId" @change="$emit('update:customerId', $event.target.value)" class="form-select border-primary">
                            <option value="">-- Escolha um cliente --</option>
                            <option v-for="c in clientes" :value="c.id">{{ c.name }}</option>
                        </select>
                    </div>
                    <label class="form-label fw-bold">2. Itens no Carrinho ({{ carrinho.length }})</label>
                    <div v-if="carrinho.length === 0" class="alert alert-light border text-center py-4">Carrinho vazio</div>
                    <ul class="list-group list-group-flush mb-4">
                        <li v-for="item in carrinho" class="list-group-item d-flex justify-content-between align-items-start px-0">
                            <div class="ms-2 me-auto">
                                <div class="fw-bold">{{ item.name }}</div>
                                <small class="text-muted">R$ {{ (item.priceCents / 100).toFixed(2) }} x {{ item.quantity }}</small>
                            </div>
                            <button class="btn btn-sm text-danger" @click="$emit('remove', item.productId)">✕</button>
                        </li>
                    </ul>
                    <div class="d-flex justify-content-between align-items-center mb-3 pt-3 border-top">
                        <span class="h5">Total Geral</span>
                        <span class="h4 text-success fw-bold">R$ {{ (totalCarrinho / 100).toFixed(2) }}</span>
                    </div>
                    <button class="btn btn-success btn-lg w-100 shadow-sm" @click="$emit('finalizar')" :disabled="!selectedCustomerId || carrinho.length === 0">Confirmar Pedido</button>
                </div>
            </div>
        </div>
    </div>`
};