const { createApp } = Vue;

createApp({
    data() {
        return {
            apiUrl: "http://localhost:5037/api",
            abaAtiva: 'pedido',
            produtos: [],
            clientes: [],
            carrinho: [],
            todosProdutos: [],
            pedidos: [],
            selectedCustomerId: "",
            filtro: { search: "" },
            novoProduto: { name: "", category: "", precoEmReais: 0, active: true },
            novoCliente: { name: "", email: "" },
            produtoParaEditar: { id: null, name: "", category: "", precoEmReais: 0, active: true }
        }
    },
    computed: {
        totalCarrinho() {
            return this.carrinho.reduce((acc, item) => acc + (item.priceCents * item.quantity), 0);
        }
    },
    methods: {
        async buscarProdutos() {
            const res = await fetch(`${this.apiUrl}/products?onlyActive=true&search=${this.filtro.search}`);
            this.produtos = await res.json();
        },
        async buscarTodosProdutos(){
            const res = await fetch(`${this.apiUrl}/products?onlyActive=false`);
            this.todosProdutos = await res.json();
        },
        async buscarClientes() {
            const res = await fetch(`${this.apiUrl}/customers`);
            this.clientes = await res.json();
        },
        adicionarAoCarrinho(produto) {
            const item = this.carrinho.find(i => i.productId === produto.id);
            if (item) item.quantity++;
            else this.carrinho.push({ productId: produto.id, name: produto.name, priceCents: produto.priceCents, quantity: 1 });
        },
        removerDoCarrinho(id) {
            this.carrinho = this.carrinho.filter(i => i.productId !== id);
        },
        async finalizarPedido() {
            const payload = { costumerId: this.selectedCustomerId, items: this.carrinho.map(i => ({ productId: i.productId, quantity: i.quantity })) };
            const res = await fetch(`${this.apiUrl}/orders`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            if (res.ok) { alert("Pedido realizado!"); this.carrinho = []; this.selectedCustomerId = ""; }
        },
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
        async salvarCliente() {
            const res = await fetch(`${this.apiUrl}/customers`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(this.novoCliente) });
            if (res.ok) { alert("Cliente cadastrado!"); this.abaAtiva = 'pedido'; this.buscarClientes(); }
        },
        prepararEdicao(produto){
            this.produtoParaEditar = {
                ...produto,
                precoEmReais: (produto.priceCents / 100).toFixed(2)
            };
            this.abaAtiva = 'editarProduto';
        },
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
        async irParaHistorico(){
            this.abaAtiva = 'historico';
            await this.buscarPedidos();
        },
        async buscarPedidos(){
            try{
                const res = await fetch(`${this.apiUrl}/orders`);
                this.pedidos = await res.json();
            }catch (e){
                console.error("erro ao buscar pedidos",e);
            }
        },
        async registrarPagamentos(orderId){
            if(!confirm("Confirma o recbimento do pagamento para esse pedido?")){
                return; 
            }
            try {
                const payload = {orderId: orderId};
                const res = await fetch(`${this.apiUrl/payments}`,{
                    method: 'POST',
                    headers: {'Content-Type':'application/json'},
                    body: JSON.stringify(payload)
                });

                if(res.ok){
                    alert("Pagamento registrado com sucesso!");
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