using GestaoApi.Data;
using GestaoApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GestaoApi.Controllers;

/// <summary>
/// Controller responsável pelo processamento de pagamentos.
/// Gerencia a entrada de valores e a atualização automática do status do pedido para "PAID".
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class PaymentsController : ControllerBase
{
    private readonly AppDbContext _context;

    public PaymentsController(AppDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Registra um novo pagamento para um pedido existente.
    /// Valida se o montante total pago atinge o valor do pedido para atualizar seu status.
    /// </summary>
    [HttpPost]
    public async Task<ActionResult> PostPayment(PaymentRequest request)
    {
        // Busca o pedido com os itens incluídos para ter acesso ao cálculo de TotalCalculated
        var order = await _context.Orders.Include(o => o.Items).FirstOrDefaultAsync(o => o.Id == request.OrderId);

        if(order == null){
            return NotFound("Pedido não encontrado");
        }

        // Cria a entidade de pagamento
        var payment = new Payment{OrderId = request.OrderId, Method = request.Method, AmountCents = request.AmountCents, PaidAt = DateTime.UtcNow};

        // Persiste o novo pagamento no banco de dados
        _context.Payments.Add(payment);
        await _context.SaveChangesAsync();

        // Soma todos os pagamentos vinculados a este pedido
        var totalPaid = await _context.Payments.Where(p => p.OrderId == order.Id).SumAsync(p => p.AmountCents);

        // O pedido só é marcado como pago (PAID) se a soma dos 
        // pagamentos for igual ou superior ao valor total calculado do pedido.
        if(totalPaid >= order.TotalCalculated){
            order.Status = "PAID";
            await _context.SaveChangesAsync();
        }

        // Retorna um objeto anônimo
        return Ok(new {message = "Pagamento registrado com sucesso",StatusAtual = order.Status, faltaPagar = Math.Max(0,order.TotalCalculated - totalPaid)});
    }
}

public class PaymentRequest
{
    public int OrderId{ get; set;}
    public string Method{ get; set;} = "CARD";
    public int AmountCents{get; set;}
}