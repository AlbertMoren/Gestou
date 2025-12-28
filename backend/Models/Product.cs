namespace GestaoApi.Models;

public class Product
{
    public int Id { get; set; } 
    public string Name { get; set; } = string.Empty; 
    public string Category { get; set; } = string.Empty; 
    public int PriceCents { get; set; } 
    public bool Active { get; set; } = true; 
}