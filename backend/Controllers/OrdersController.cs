using GestaoApi.Data;
using GestaoApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GestaoApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase{
    private readonly AppDbContext _context;

    public OrdersController(AppDbContext context){
        _context = context;
    }

    [HttpPost]
    public async Task<ActionResult<Order>> PostOrder(OrderRequest request){
        //validar se o cliente existe
        var costumer = await _context.Customers.AsNoTracking().FirstOrDefaultAsync(c => c.Id == request.CostumerId);
        if(costumer == null){
            return BadRequest("Cliente não encontrado");
        }

        var newOrder = new Order{CustomerId = request.CostumerId,Status = "NEW",CreatedAt = DateTime.UtcNow
        };

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
            newOrder.Items.Add(new OrderItem{ProductId = product.Id, Quantity = itemRequest.Quantity, UnitPriceCents = product.PriceCents});
        }
        _context.Orders.Add(newOrder);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetOrder), new { id = newOrder.Id }, newOrder);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Order>> GetOrder(int id)
    {
        var order = await _context.Orders.Include(o => o.Items).FirstOrDefaultAsync(o => o.Id == id);

        if (order == null) {
            return NotFound("Pedido não encontrado");
        }
        return order;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Object>>> GetOrders()
    {
        return await _context.Orders.Include(o => o.Items).Select(o => new
        {
            o.Id,
            o.CustomerId,
            o.Status,
            o.CreatedAt,
            total = o.Items.Sum(i => i.Quantity * i.UnitPriceCents)
        }).OrderByDescending(o => o.CreatedAt).ToListAsync();
    }
}

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