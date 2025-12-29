const CompHistorico = {
    props: ['pedidos'],
    template: `
    <div class="row">
        <div class="col-12">
            <div class="card shadow">
                <div class="card-header bg-dark text-white"><h5>Pedidos Realizados</h5></div>
                <div class="card-body p-0">
                    <table class="table table-hover mb-0">
                        <thead class="table-light">
                            <tr><th>ID</th><th>Data</th><th>Total</th><th>Status</th><th class="text-center">Ações</th></tr>
                        </thead>
                        <tbody>
                            <tr v-for="ped in pedidos" :key="ped.id">
                                <td>#{{ ped.id }}</td>
                                <td>{{ new Date(ped.createdAt).toLocaleString() }}</td>
                                <td>R$ {{ (ped.total / 100).toFixed(2) }}</td>
                                <td><span :class="['badge', ped.status === 'PAID' ? 'bg-success' : 'bg-warning text-dark']">{{ped.status}}</span></td>
                                <td class="text-center">
                                    <button v-if="ped.status === 'NEW'" class="btn btn-sm btn-outline-success" @click="$emit('pagar', ped)">💰 Confirmar Pagamento</button>
                                    <span v-else class="text-muted small">Pago ✔️</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>`
};