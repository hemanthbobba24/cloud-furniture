import { useEffect, useState, useMemo } from "react";
import api from "../lib/api";
import { useAuth } from "../AuthContext";

export default function Browse() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { role } = useAuth();

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [priceRange, setPriceRange] = useState([0, 10000]);

  useEffect(() => {
    let cancelled = false;
    
    async function loadListings() {
      setLoading(true);
      setError("");
      try {
        const res = await api.get("/listings");
        if (!cancelled) {
          const data = res.data;
          if (Array.isArray(data)) {
            setItems(data);
          } else if (data && Array.isArray(data.items)) {
            setItems(data.items);
          } else {
            setItems([]);
          }
        }
      } catch (err) {
        console.error("[Browse] failed:", err);
        if (!cancelled) {
          setError("Failed to load products. Please try again.");
          setItems([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    
    loadListings();
    return () => { cancelled = true; };
  }, []);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = items
      .map(item => item.category)
      .filter(Boolean)
      .filter((v, i, a) => a.indexOf(v) === i);
    return ['all', ...cats];
  }, [items]);

  // Filter and sort items
  const filteredItems = useMemo(() => {
    let result = [...items];

    // Search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      result = result.filter(item => 
        item.title?.toLowerCase().includes(search) ||
        item.description?.toLowerCase().includes(search) ||
        item.category?.toLowerCase().includes(search)
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter(item => 
        item.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Price range filter
    result = result.filter(item => {
      const price = Number(item.price) || 0;
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // Sort
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
        break;
      case 'price-high':
        result.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
        break;
      case 'name-asc':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'name-desc':
        result.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'newest':
        result.sort((a, b) => (b.id || 0) - (a.id || 0));
        break;
      default:
        break;
    }

    return result;
  }, [items, searchTerm, selectedCategory, sortBy, priceRange]);

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSortBy("newest");
    setPriceRange([0, 10000]);
  };

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
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ 
          fontSize: 32, 
          fontWeight: 700, 
          margin: "0 0 24px",
          color: "#111"
        }}>
          Browse Products
        </h1>

        {/* Search Bar */}
        <div style={{ marginBottom: 24 }}>
          <input
            type="text"
            placeholder="Search products by name, description, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%",
              padding: "12px 16px",
              fontSize: 16,
              border: "2px solid #e5e7eb",
              borderRadius: 8,
              outline: "none",
              transition: "border-color 0.2s"
            }}
            onFocus={(e) => e.target.style.borderColor = "#5b21b6"}
            onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
          />
        </div>

        {/* Filters Bar */}
        <div style={{ 
          display: "flex", 
          gap: 12, 
          flexWrap: "wrap",
          alignItems: "center",
          background: "#f9fafb",
          padding: 16,
          borderRadius: 8
        }}>
          {/* Category Filter */}
          <div style={{ flex: "1 1 200px" }}>
            <label style={{ 
              display: "block", 
              fontSize: 12, 
              fontWeight: 600, 
              color: "#6b7280",
              marginBottom: 4
            }}>
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 12px",
                border: "1px solid #d1d5db",
                borderRadius: 6,
                fontSize: 14,
                cursor: "pointer"
              }}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div style={{ flex: "1 1 200px" }}>
            <label style={{ 
              display: "block", 
              fontSize: 12, 
              fontWeight: 600, 
              color: "#6b7280",
              marginBottom: 4
            }}>
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 12px",
                border: "1px solid #d1d5db",
                borderRadius: 6,
                fontSize: 14,
                cursor: "pointer"
              }}
            >
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
              <option value="name-desc">Name: Z to A</option>
            </select>
          </div>

          {/* Price Range */}
          <div style={{ flex: "1 1 250px" }}>
            <label style={{ 
              display: "block", 
              fontSize: 12, 
              fontWeight: 600, 
              color: "#6b7280",
              marginBottom: 4
            }}>
              Price Range: ${priceRange[0]} - ${priceRange[1]}
            </label>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                type="number"
                placeholder="Min"
                value={priceRange[0]}
                onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                style={{
                  flex: 1,
                  padding: "8px",
                  border: "1px solid #d1d5db",
                  borderRadius: 6,
                  fontSize: 14
                }}
              />
              <input
                type="number"
                placeholder="Max"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                style={{
                  flex: 1,
                  padding: "8px",
                  border: "1px solid #d1d5db",
                  borderRadius: 6,
                  fontSize: 14
                }}
              />
            </div>
          </div>

          {/* Clear Filters Button */}
          <div style={{ flex: "0 0 auto" }}>
            <label style={{ 
              display: "block", 
              fontSize: 12, 
              fontWeight: 600, 
              color: "transparent",
              marginBottom: 4
            }}>
              .
            </label>
            <button
              onClick={clearFilters}
              style={{
                padding: "8px 16px",
                background: "#fff",
                border: "1px solid #d1d5db",
                borderRadius: 6,
                cursor: "pointer",
                fontSize: 14,
                fontWeight: 600,
                color: "#374151"
              }}
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div style={{ 
          marginTop: 16,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          color: "#6b7280",
          fontSize: 14
        }}>
          <span>
            Showing {filteredItems.length} of {items.length} products
          </span>
          {(searchTerm || selectedCategory !== 'all') && (
            <span style={{ fontWeight: 600 }}>
              {searchTerm && `"${searchTerm}"`}
              {searchTerm && selectedCategory !== 'all' && ' in '}
              {selectedCategory !== 'all' && `${selectedCategory}`}
            </span>
          )}
        </div>
      </div>

      {/* Products Grid */}
      {filteredItems.length === 0 ? (
        <div style={{ 
          textAlign: "center", 
          padding: 60,
          background: "#f9fafb",
          borderRadius: 12,
          color: "#666"
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
          <h3 style={{ marginBottom: 8 }}>No products found</h3>
          <p>Try adjusting your filters or search terms</p>
          <button
            onClick={clearFilters}
            style={{
              marginTop: 16,
              padding: "10px 20px",
              background: "#111",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
              fontWeight: 600
            }}
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", 
          gap: 24 
        }}>
          {filteredItems.map((item) => (
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
// Product Card Component (Same as before)
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
        paddingTop: "66.67%",
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

        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          marginTop: "auto",
          paddingTop: 12
        }}>
          <div style={{ 
            fontSize: 24, 
            fontWeight: 700,
            color: "#111",
            lineHeight: 1
          }}>
            ${Number(item.price ?? 0).toFixed(2)}
          </div>

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