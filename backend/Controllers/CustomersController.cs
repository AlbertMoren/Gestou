using GestaoApi.Data;
using GestaoApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GestaoApi.Controllers;

/// <summary>
/// Controller para gestão de clientes.
/// Permite o cadastro e consulta de consumidores para a realização de pedidos.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class CustomersController : ControllerBase
{
    private readonly AppDbContext _context;

    public CustomersController(AppDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Lista todos os clientes cadastrados.
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Customer>>> GetCustomers()
    {
        return await _context.Customers.ToListAsync();
    }

    /// <summary>
    /// Cadastra um novo cliente no sistema.
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<Customer>> PostCustomer(Customer customer)
    {
        customer.CreatedAt = DateTime.UtcNow;

        _context.Customers.Add(customer);
        await _context.SaveChangesAsync();

        // Retorna o cliente criado
        return CreatedAtAction(nameof(GetCustomers), new { id = customer.Id }, customer);
    }

    /// <summary>
    /// Atualiza as informações de um cliente.
    /// </summary>
    [HttpPut("{id}")]
    public async Task<IActionResult> PutCustomer(int id, Customer customer)
    {
        if (id != customer.Id)
        {
            return BadRequest("ID inconsistente.");
        }

        _context.Entry(customer).State = EntityState.Modified;

        try{
            await _context.SaveChangesAsync();
        }catch (DbUpdateConcurrencyException){
            if (!_context.Customers.Any(c => c.Id == id)){
                return NotFound("Cliente não encontrado.");
            }
            throw;
        }

        return NoContent();
    }
}