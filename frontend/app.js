const { createApp } = Vue;

createApp({
    // Registro dos componentes modularizados
    components:{
        'comp-pedido': CompPedido,
        'comp-cadastro-produto': CompCadastroProduto,
        'comp-cadastro-cliente': CompCadastroCliente,
        'comp-gerenciar-produtos': CompGerenciarProdutos,
        'comp-editar-produto': CompEditarProduto,
        'comp-historico': CompHistorico
    },
    // Estado reativo da aplicação
    data() {
        return {
            apiUrl: "http://localhost:5037/api",
            abaAtiva: 'pedido',

            // Listas de dados consumidas da API
            produtos: [],
            clientes: [],
            carrinho: [],
            todosProdutos: [],
            pedidos: [],

            // Variáveis auxiliares de formulário e filtros
            selectedCustomerId: "",
            filtro: { search: "" },

            // Modelos para binding de formulários (v-model)
            novoProduto: { name: "", category: "", precoEmReais: 0, active: true },
            novoCliente: { name: "", email: "" },
            produtoParaEditar: { id: null, name: "", category: "", precoEmReais: 0, active: true }
        }
    },
    // Propriedades computadas para cálculos em tempo real
    computed: {
        totalCarrinho() {
            return this.carrinho.reduce((acc, item) => acc + (item.priceCents * item.quantity), 0);
        }
    },
    methods: {
        /* --- MÉTODOS DE BUSCA (GET) --- */

        /** Busca produtos ativos, permitindo filtragem por nome */
        async buscarProdutos() {
            const res = await fetch(`${this.apiUrl}/products?onlyActive=true&search=${this.filtro.search}`);
            this.produtos = await res.json();
        },

        /** Busca todos os produtos (ativos e inativos) para o painel gerencial */
        async buscarTodosProdutos(){
            const res = await fetch(`${this.apiUrl}/products?onlyActive=false`);
            this.todosProdutos = await res.json();
        },

        /** Buscar todos os clientes */
        async buscarClientes() {
            const res = await fetch(`${this.apiUrl}/customers`);
            this.clientes = await res.json();
        },

        /**Busca todos os pedidos */
        async buscarPedidos(){
            try{
                const res = await fetch(`${this.apiUrl}/orders`);
                this.pedidos = await res.json();
            }catch (e){
                console.error("erro ao buscar pedidos",e);
            }
        },

        /* --- MÉTODOS DE CARRINHO --- */

        /** Adiciona um item ao carrinho ou incrementa a quantidade se já existir */
        adicionarAoCarrinho(produto) {
            const item = this.carrinho.find(i => i.productId === produto.id);
            if (item) item.quantity++;
            else this.carrinho.push({ productId: produto.id, name: produto.name, priceCents: produto.priceCents, quantity: 1 });
        },

        /** Remeove um item ao carrinho*/
        removerDoCarrinho(id) {
            this.carrinho = this.carrinho.filter(i => i.productId !== id);
        },

        /* --- MÉTODOS DE PEDIDO E PAGAMENTO --- */

        /** Envia o carrinho para a API para criar um novo pedido (Order) */
        async finalizarPedido() {
            const payload = { costumerId: this.selectedCustomerId, items: this.carrinho.map(i => ({ productId: i.productId, quantity: i.quantity })) };
            const res = await fetch(`${this.apiUrl}/orders`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            if (res.ok) { alert("Pedido realizado!"); this.carrinho = []; this.selectedCustomerId = ""; }
        },

        /** Registra um pagamento (Payment) vinculado a um pedido para alterar seu status para PAID */
        async salvarProduto() {
            const valorEmCentavos = Math.round(this.novoProduto.precoEmReais * 100);
            const payload = {
                name: this.novoProduto.name,
                category: this.novoProduto.category,
                priceCents: valorEmCentavos,
                active: this.novoProduto.active
            };
            const res = await fetch(`${this.apiUrl}/products`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                alert("Produto cadastrado!");
                this.abaAtiva = 'pedido';
                this.buscarProdutos();
                this.buscarTodosProdutos();
                this.novoProduto = { name: "", category: "", precoEmReais: 0, active: true };
            }
        },

        /* --- GESTÃO DE PRODUTOS E CLIENTES --- */

        /**Adiciona e salva um novo cliente */
        async salvarCliente() {
            const res = await fetch(`${this.apiUrl}/customers`, { 
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' }, 
                body: JSON.stringify(this.novoCliente)
            });
            if (res.ok) { alert("Cliente cadastrado!"); this.abaAtiva = 'pedido'; this.buscarClientes(); }
        },

        /** Prepara o objeto de edição transformando centavos de volta em reais para o formulário */
        prepararEdicao(produto){
            this.produtoParaEditar = {
                ...produto,
                precoEmReais: (produto.priceCents / 100).toFixed(2)
            };
            this.abaAtiva = 'editarProduto';
        },

        /** Envia atualização via PUT para o produto selecionado */
        async atualizarProduto(){
            const valorEmCentavos = Math.round(parseFloat(this.produtoParaEditar.precoEmReais) * 100);
            
            const payload = {
                id: this.produtoParaEditar.id,
                name: this.produtoParaEditar.name,
                category: this.produtoParaEditar.category,
                priceCents: valorEmCentavos,
                active: this.produtoParaEditar.active
            };

            const res = await fetch(`${this.apiUrl}/products/${payload.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if(res.ok){
                alert("Produto atualizado com sucesso!");
                this.abaAtiva = 'gerenciarProdutos';
                this.buscarTodosProdutos();
                this.buscarProdutos();
            } else {
                alert("Erro ao atualizar o produto.");
            }
        },

        /** Gerencia a transição para a tela de histórico carregando os pedidos */
        async irParaHistorico(){
            this.abaAtiva = 'historico';
            try {
                const res = await fetch(`${this.apiUrl}/orders`);
                this.pedidos = await res.json();
            } catch (e) {
                console.error("erro ao carregar os pedidos". e);
            }
        },
        
        /** Registra um pagamento (Payment) vinculado a um pedido para alterar seu status para PAID */
        async registrarPagamento(pedido){
            if(!confirm(`Confirmar o pagamento de R$ ${(pedido.total / 100).toFixed(2)}?`)){
                return; 
            }
            try {
                const payload = {
                    orderId: pedido.id,
                    method: "CARD",
                    amountCents: pedido.total
                };

                const res = await fetch(`${this.apiUrl}/payments`, { 
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if(res.ok){
                    const data = await res.json();
                    alert(`Pagamento registrado! Status: ${data.statusAtual}`);
                    await this.buscarPedidos();
                }else{
                    alert("Erro ao registrar pagamentos");
                }
            } catch (e) {
                alert("Erro de conexão")
            }
        }
    },
    mounted() {
        this.buscarProdutos();
        this.buscarClientes();
        this.buscarTodosProdutos();
    }
}).mount('#app');