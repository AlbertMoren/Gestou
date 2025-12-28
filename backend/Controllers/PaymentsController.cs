using GestaoApi.Data;
using GestaoApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GestaoApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PaymentsController : ControllerBase
{
    private readonly AppDbContext _context;

    public PaymentsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<ActionResult> PostPayment(PaymentRequest request)
    {
        var order = await _context.Orders.Include(o => o.Items).FirstOrDefaultAsync(o => o.Id == request.OrderId);

        if(order == null){
            return NotFound("Pedido não encontrado");
        }

        var payment = new Payment{OrderId = request.OrderId, Method = request.Method, AmountCents = request.AmountCents, PaidAt = DateTime.UtcNow};

        _context.Payments.Add(payment);
        await _context.SaveChangesAsync();

        var totalPaid = await _context.Payments.Where(p => p.OrderId == order.Id).SumAsync(p => p.AmountCents);

        if(totalPaid >= order.TotalCalculated){
            order.Status = "PAID";
            await _context.SaveChangesAsync();
        }

        return Ok(new {message = "Pagamento registrado com sucesso",StatusAtual = order.Status, faltaPagar = Math.Max(0,order.TotalCalculated - totalPaid)});
    }
}

public class PaymentRequest
{
    public int OrderId{ get; set;}
    public string Method{ get; set;} = "CARD";
    public int AmountCents{get; set;}
}