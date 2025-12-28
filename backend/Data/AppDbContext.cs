using Microsoft.EntityFrameworkCore;
using GestaoApi.Models;

namespace GestaoApi.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Customer> Customers { get; set; }
    public DbSet<Product> Products { get; set; }
    public DbSet<Order> Orders { get; set; }
    public DbSet<OrderItem> OrderItems { get; set; }
    public DbSet<Payment> Payments { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Product>(entity => {
            entity.ToTable(t => t.HasCheckConstraint("CK_Product_Price", "\"PriceCents\" >= 0"));
        });

        modelBuilder.Entity<OrderItem>(entity => {
            entity.ToTable(t => t.HasCheckConstraint("CK_OrderItem_Quantity", "\"Quantity\" > 0"));
        });

        modelBuilder.Entity<Payment>(entity => {
            entity.ToTable(t => t.HasCheckConstraint("CK_Payment_Amount", "\"AmountCents\" >= 0"));
        });
    }
}