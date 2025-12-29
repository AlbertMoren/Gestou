# Gestou SPA - Sistema de Gestão Integrada

O **Gestou SPA** é uma aplicação Fullstack moderna desenvolvida para gerenciar o fluxo comercial de uma empresa, abrangendo desde o controle de inventário até o fechamento financeiro de pedidos. O sistema utiliza uma arquitetura modular no Frontend e uma API robusta em .NET no Backend.

## Tecnologias Utilizadas

### **Backend**
* **C# / .NET 8**: Linguagem e framework de alta performance para a construção da API.
* **Entity Framework Core**: ORM para persistência de dados e mapeamento relacional.
* **PostgreSQL**: Banco de dados relacional para armazenamento seguro das informações.
* **Swagger/OpenAPI**: Interface para documentação e testes interativos das rotas da API.

### **Frontend**
* **Vue.js 3 (via CDN)**: Framework progressivo para a criação de uma interface reativa e modular.
* **Bootstrap 5**: Framework CSS para garantir um design responsivo e componentes visuais modernos.
* **Fetch API**: Utilizada para comunicação assíncrona com os endpoints da API.


## Como Executar o Projeto

1. Navegue até a pasta da API.
2. Configure a string de conexão no arquivo `appsettings.json`.
3. Execute as migrações para criar as tabelas:
   ```bash
   dotnet ef database update
   ```
4. Inicie o servidor
    ```bash
   dotnet run
   ```
