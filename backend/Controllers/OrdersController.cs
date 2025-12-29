using GestaoApi.Data;
using GestaoApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GestaoApi.Controllers;

/// <summary>
/// Controller responsável pelo gerenciamento de pedidos (Orders).
/// Implementa as regras de negócio para criação, listagem e validação de itens ativos.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase{
    private readonly AppDbContext _context;

    public OrdersController(AppDbContext context){
        _context = context;
    }

    /// <summary>
    /// Recupera os detalhes de um pedido específico, incluindo seus itens.
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<Order>> GetOrder(int id)
    {   
        //carregar os itens relacionados
        var order = await _context.Orders.Include(o => o.Items).FirstOrDefaultAsync(o => o.Id == id);

        if (order == null) {
            return NotFound("Pedido não encontrado");
        }
        return order;
    }

    /// <summary>
    /// Lista todos os pedidos de forma resumida para otimização de performance no frontend.
    /// Calcula o valor total de cada pedido dinamicamente.
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Object>>> GetOrders()
    {
        return await _context.Orders.Include(o => o.Items).Select(o => new
        {
            o.Id,
            o.CustomerId,
            o.Status,
            o.CreatedAt,
            //valor total (Quantidade * Preço Unitário)
            total = o.Items.Sum(i => i.Quantity * i.UnitPriceCents)
        }).OrderByDescending(o => o.CreatedAt).ToListAsync();
    }

    /// <summary>
    /// Cria um novo pedido após validar a existência do cliente e o status dos produtos.
    /// Atende ao requisito de impedir a venda de produtos inativos.
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<Order>> PostOrder(OrderRequest request){
        //validar se o cliente existe
        var costumer = await _context.Customers.AsNoTracking().FirstOrDefaultAsync(c => c.Id == request.CostumerId);
        if(costumer == null){
            return BadRequest("Cliente não encontrado");
        }

        // Instancia o pedido com status inicial e data
        var newOrder = new Order{CustomerId = request.CostumerId,Status = "NEW",CreatedAt = DateTime.UtcNow
        };

        //cada item é enviado na requisição
        foreach (var itemRequest in request.Items) {
            //Buscar o produto para validar o preço e status ativo
            var product = await _context.Products.FindAsync(itemRequest.ProductId);

            if(product == null){
                return BadRequest($"Produto ID {itemRequest.ProductId} não existe");
            }
            //Verifica se o produto esta ativo
            if (!product.Active){
                return BadRequest($"O produto '{product.Name}' está inativo e não pode ser vendido");
            }
            //Registra o item com o preço histórico (UnitPriceCents) do momento da compra
            newOrder.Items.Add(new OrderItem{ProductId = product.Id, Quantity = itemRequest.Quantity, UnitPriceCents = product.PriceCents});
        }
        _context.Orders.Add(newOrder);
        await _context.SaveChangesAsync();

        // Retorna o status 201 Created e o local para consulta do novo pedido
        return CreatedAtAction(nameof(GetOrder), new { id = newOrder.Id }, newOrder);
    }
}

// DTOs (Data Transfer Objects) para entrada de dados
public class OrderRequest
{
    public int CostumerId {get; set;}
    public List<OrderItemRequest> Items {get; set;} = new();
}

public class OrderItemRequest
{
    public int ProductId { get; set; }
    public int Quantity { get; set; }
}