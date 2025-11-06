import { useEffect, useState } from "react";
import api from "../lib/api";
import { useAuth } from "../AuthContext";

export default function Browse() {
  const [data, setData] = useState({ items: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { role } = useAuth();

  useEffect(() => {
    let cancelled = false;
    
    async function loadListings() {
      setLoading(true);
      setError("");
      try {
        const res = await api.get("/listings");
        if (!cancelled) {
          setData(res.data || { items: [] });
        }
      } catch (err) {
        console.error("[Browse] failed:", err);
        if (!cancelled) {
          setError("Failed to load products. Please try again.");
          setData({ items: [] });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    
    loadListings();
    return () => { cancelled = true; };
  }, []);

  const handleAddToCart = (item) => {
    if (role !== "USER") {
      alert("Only users can add items to cart. Please login as a user.");
      return;
    }
    
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existing = cart.find(c => c.id === item.id);
    
    if (existing) {
      existing.qty = (existing.qty || 1) + 1;
      alert(`Increased quantity of "${item.title}" in cart!`);
    } else {
      cart.push({
        id: item.id,
        title: item.title,
        price: item.price,
        category: item.category,
        image: item.images?.[0] || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80",
        qty: 1
      });
      alert(`Added "${item.title}" to cart!`);
    }
    
    localStorage.setItem("cart", JSON.stringify(cart));
    
    // Dispatch custom event for cart badge update (if you add that later)
    window.dispatchEvent(new Event('cartUpdated'));
  };

  if (loading) {
    return (
      <div style={{ 
        padding: 40, 
        textAlign: "center",
        fontSize: 16,
        color: "#666"
      }}>
        Loading products...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        padding: 40, 
        textAlign: "center" 
      }}>
        <div style={{ 
          color: "#b00020",
          background: "#fee",
          padding: 16,
          borderRadius: 8,
          maxWidth: 500,
          margin: "0 auto"
        }}>
          {error}
        </div>
      </div>
    );
  }

  return (
    <section style={{ padding: "24px 16px", maxWidth: 1400, margin: "0 auto" }}>
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        marginBottom: 32
      }}>
        <h1 style={{ 
          fontSize: 32, 
          fontWeight: 700, 
          margin: 0,
          color: "#111"
        }}>
          Browse Products
        </h1>
        <div style={{ color: "#666", fontSize: 14 }}>
          {data.items.length} {data.items.length === 1 ? 'product' : 'products'}
        </div>
      </div>

      {data.items.length === 0 ? (
        <div style={{ 
          textAlign: "center", 
          padding: 60,
          background: "#f9fafb",
          borderRadius: 12,
          color: "#666"
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🛋️</div>
          <h3 style={{ marginBottom: 8 }}>No products available</h3>
          <p>Check back soon for new listings!</p>
        </div>
      ) : (
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", 
          gap: 24 
        }}>
          {data.items.map((item) => (
            <ProductCard 
              key={item.id} 
              item={item} 
              onAddToCart={handleAddToCart}
              canAddToCart={role === "USER"}
            />
          ))}
        </div>
      )}
    </section>
  );
}

// ============================================
// Product Card Component
// ============================================
function ProductCard({ item, onAddToCart, canAddToCart }) {
  const [isHovered, setIsHovered] = useState(false);
  
  const fallbackImage = "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80";
  const imageUrl = item.images?.[0] || fallbackImage;

  return (
    <article 
      style={{ 
        border: "1px solid #e5e7eb", 
        borderRadius: 12, 
        overflow: "hidden", 
        background: "#fff",
        transition: "all 0.3s ease",
        boxShadow: isHovered ? "0 8px 24px rgba(0,0,0,0.12)" : "0 1px 3px rgba(0,0,0,0.08)",
        transform: isHovered ? "translateY(-4px)" : "translateY(0)",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column"
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image */}
      <div style={{ 
        position: "relative",
        paddingTop: "66.67%", // 3:2 aspect ratio
        overflow: "hidden",
        background: "#f3f4f6"
      }}>
        <img
          src={imageUrl}
          alt={item.title}
          style={{ 
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%", 
            height: "100%", 
            objectFit: "cover",
            transition: "transform 0.3s ease",
            transform: isHovered ? "scale(1.05)" : "scale(1)"
          }}
          onError={(e) => {
            e.target.src = fallbackImage;
          }}
        />
        
        {/* Category Badge */}
        {item.category && (
          <div style={{ 
            position: "absolute",
            top: 12,
            left: 12,
            background: "rgba(255,255,255,0.95)",
            padding: "4px 12px",
            borderRadius: 20,
            fontSize: 12,
            fontWeight: 600,
            color: "#4b2aad",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
          }}>
            {item.category}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div style={{ 
        padding: 16, 
        display: "flex", 
        flexDirection: "column", 
        gap: 8,
        flex: 1
      }}>
        {/* Title */}
        <h3 style={{ 
          margin: 0, 
          fontWeight: 700,
          fontSize: 18,
          color: "#111",
          lineHeight: 1.3,
          minHeight: 48,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden"
        }}>
          {item.title}
        </h3>

        {/* Description */}
        <p style={{ 
          margin: 0, 
          color: "#6b7280", 
          fontSize: 14,
          lineHeight: 1.5,
          minHeight: 42,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden"
        }}>
          {item.description || "High quality furniture for your home"}
        </p>

        {/* Price and Add to Cart */}
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          marginTop: "auto",
          paddingTop: 12
        }}>
          {/* Price */}
          <div>
            <div style={{ 
              fontSize: 24, 
              fontWeight: 700,
              color: "#111",
              lineHeight: 1
            }}>
              ${Number(item.price ?? 0).toFixed(2)}
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            disabled={!canAddToCart}
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(item);
            }}
            style={{ 
              padding: "10px 20px", 
              borderRadius: 8, 
              border: "none",
              background: canAddToCart ? "#111" : "#e5e7eb",
              color: canAddToCart ? "#fff" : "#9ca3af",
              cursor: canAddToCart ? "pointer" : "not-allowed",
              fontWeight: 600,
              fontSize: 14,
              transition: "all 0.2s ease",
              boxShadow: canAddToCart && isHovered ? "0 4px 12px rgba(0,0,0,0.15)" : "none",
              transform: canAddToCart && isHovered ? "scale(1.02)" : "scale(1)"
            }}
            onMouseEnter={(e) => {
              if (canAddToCart) {
                e.target.style.background = "#374151";
              }
            }}
            onMouseLeave={(e) => {
              if (canAddToCart) {
                e.target.style.background = "#111";
              }
            }}
          >
            {canAddToCart ? "Add to Cart" : "Login as User"}
          </button>
        </div>
      </div>
    </article>
  );
}