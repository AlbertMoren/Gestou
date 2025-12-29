/**
 * Componente: CompCadastroCliente
 * Finalidade: Interface de formulário para registro de novos clientes no sistema.
 */

const CompCadastroCliente = {

    /** * Props: Recebe o objeto 'novoCliente' do app.js para manter o vínculo reativo (Two-way data binding).
     * Isso permite que o app.js limpe os campos após o salvamento bem-sucedido.
     */
    props: ['novoCliente'],

    /**
     * Template: Estrutura HTML utilizando classes do Bootstrap para centralização e sombreamento (shadow).
     */
    template: `
    <div class="row justify-content-center">

        <div class="col-md-6">

            <div class="card shadow">

                <div class="card-header bg-dark text-white"><h5>Novo Cliente</h5></div>
                <div class="card-body">

                    <form @submit.prevent="$emit('salvar')">
                        <div class="mb-3">
                            <label>Nome Completo</label>
                            <input v-model="novoCliente.name" class="form-control" required>
                        </div>

                        <div class="mb-3">
                            <label>E-mail</label>
                            <input type="email" v-model="novoCliente.email" class="form-control" required>
                        </div>

                        <button type="submit" class="btn btn-primary w-100">Salvar Cliente</button>
                    </form>
                </div>
            </div>
        </div>
    </div>`
};