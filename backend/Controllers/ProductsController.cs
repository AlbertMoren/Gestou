using GestaoApi.Data;
using GestaoApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GestaoApi.Controllers;

/// <summary>
/// Controller responsável pela gestão e consulta do catálogo de produtos.
/// Oferece suporte a filtros dinâmicos e busca textual.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase{
    private readonly AppDbContext _context;

    public ProductsController(AppDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Lista os produtos cadastrados com suporte a filtros opcionais.
    /// Atende aos requisitos de listagem, busca por nome e filtro de status (ativos).
    /// </summary>
    /// <param name="category">Filtro opcional por categoria exata do produto.</param>
    /// <param name="onlyActive">Se verdadeiro, retorna apenas produtos marcados como ativos.</param>
    /// <param name="search">Termo de busca para filtrar produtos pelo nome (case-insensitive).</param>
    /// <returns>Uma lista de produtos que atendem aos critérios informados.</returns>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Product>>> GetProducts([FromQuery] string? category,[FromQuery] bool? onlyActive,[FromQuery] string? search){
        var query = _context.Products.AsQueryable();

        // Aplica filtro por categoria
        if (!string.IsNullOrEmpty(category)){
            query = query.Where(p => p.Category == category);
        }

        /// Filtra apenas produtos ativos
        if(onlyActive.HasValue && onlyActive.Value){
            query = query.Where(p => p.Active);
        }

        if (!string.IsNullOrEmpty(search)){
            query = query.Where(p => p.Name.ToLower().Contains(search.ToLower()));
        }

        return await query.ToArrayAsync();
    }
    
    /// <summary>
    /// Cadastra um novo produto.
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<Product>> PostProduct(Product product){
        if(product.PriceCents < 0){
            return BadRequest("o preço do produto não pode ser negativo");
        }

        _context.Products.Add(product);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetProducts), new { id = product.Id}, product);
    }

    /// <summary>
    /// Atualiza os dados de um produto existente.
    /// Permite alterar preço, categoria e status de ativação.
    /// </summary>
    [HttpPut("{id}")]
    public async Task<ActionResult> PutProduct(int id, Product product)
    {
        if(id != product.Id){
            return BadRequest("O id está inconsistente");
        }

        if(product.PriceCents < 0){
            return BadRequest("O preço do produto não pode ser negativo");
        }

        _context.Entry(product).State = EntityState.Modified;

        try{
            await _context.SaveChangesAsync();
        }catch (DbUpdateConcurrencyException){
            if(!_context.Products.Any(p => p.Id == id)) {
                return NotFound("Produto não encontrado");
            }
            throw;
        }
        return NoContent();
    }
}