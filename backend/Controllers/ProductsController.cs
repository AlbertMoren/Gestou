using GestaoApi.Data;
using GestaoApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GestaoApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase{
    private readonly AppDbContext _context;

    public ProductsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Product>>> GetProducts([FromQuery] string? category,[FromQuery] bool? onlyActive,[FromQuery] string? search){
        var query = _context.Products.AsQueryable();

        if (!string.IsNullOrEmpty(category)){
            query = query.Where(p => p.Category == category);
        }

        if(onlyActive.HasValue && onlyActive.Value){
            query = query.Where(p => p.Active);
        }

        if (!string.IsNullOrEmpty(search)){
            query = query.Where(p => p.Name.ToLower().Contains(search.ToLower()));
        }

        return await query.ToArrayAsync();
    }
    
}