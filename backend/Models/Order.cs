using System;
using System.Collections.Generic;
using System.Linq;

namespace GestaoApi.Models;

public class Order
{
    public int Id { get; set; }
    public int CustomerId { get; set; }
    public string Status { get; set; } = "NEW"; 
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public List<OrderItem> Items { get; set; } = new();

    // Regra: Total = soma de quantity * unit_price_cents 
    public int TotalCalculated => Items.Sum(item => item.Quantity * item.UnitPriceCents);
}