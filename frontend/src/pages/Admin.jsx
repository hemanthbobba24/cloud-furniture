import React, { useEffect, useState } from "react";
import api from "../lib/api";

export default function Admin() {
  const [activeTab, setActiveTab] = useState("users");
  
  return (
    <main style={{ padding: "24px 16px", maxWidth: 1400, margin: "0 auto" }}>
      <h1 style={{ margin: "0 0 24px", fontSize: 32, fontWeight: 700 }}>
        Admin Dashboard
      </h1>

      {/* Tab Navigation */}
      <div style={{ 
        display: "flex", 
        gap: 8, 
        borderBottom: "2px solid #e5e7eb",
        marginBottom: 32
      }}>
        <TabButton 
          active={activeTab === "users"} 
          onClick={() => setActiveTab("users")}
        >
          👥 Users Management
        </TabButton>
        <TabButton 
          active={activeTab === "listings"} 
          onClick={() => setActiveTab("listings")}
        >
          📦 All Listings
        </TabButton>
        <TabButton 
          active={activeTab === "sellers"} 
          onClick={() => setActiveTab("sellers")}
        >
          🏪 Seller Requests
        </TabButton>
        <TabButton 
          active={activeTab === "stats"} 
          onClick={() => setActiveTab("stats")}
        >
          📊 Statistics
        </TabButton>
      </div>

      {/* Tab Content */}
      {activeTab === "users" && <UsersManagement />}
      {activeTab === "listings" && <ListingsManagement />}
      {activeTab === "sellers" && <SellerRequests />}
      {activeTab === "stats" && <Statistics />}
    </main>
  );
}

function TabButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "12px 24px",
        background: "transparent",
        border: "none",
        borderBottom: active ? "3px solid #5b21b6" : "3px solid transparent",
        cursor: "pointer",
        fontWeight: active ? 700 : 500,
        fontSize: 16,
        color: active ? "#5b21b6" : "#6b7280",
        transition: "all 0.2s"
      }}
    >
      {children}
    </button>
  );
}

// ============================================
// Users Management Component
// ============================================
function UsersManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/admin/users");
      setUsers(res.data || []);
    } catch (err) {
      console.error("[Admin] Load users error:", err);
      setError(err?.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  }

  async function upgradeToSeller(userId, email) {
    if (!window.confirm(`Upgrade ${email} to SELLER?`)) return;

    try {
      await api.post(`/admin/users/${userId}/upgrade-to-seller`);
      alert(`${email} upgraded to SELLER successfully!`);
      loadUsers();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to upgrade user");
    }
  }

  async function deleteUser(userId, email) {
    if (!window.confirm(`Delete user ${email}?\n\nThis action cannot be undone.`)) return;

    try {
      await api.delete(`/admin/users/${userId}`);
      alert(`${email} deleted successfully!`);
      loadUsers();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to delete user");
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return <div style={{ padding: 40, textAlign: "center" }}>Loading users...</div>;
  }

  return (
    <div>
      {error && (
        <div style={{ 
          color: "#b00020", 
          background: "#fee", 
          padding: 12, 
          borderRadius: 8,
          marginBottom: 20
        }}>
          {error}
        </div>
      )}

      {/* Filters */}
      <div style={{ 
        display: "flex", 
        gap: 12, 
        marginBottom: 24,
        background: "#f9fafb",
        padding: 16,
        borderRadius: 8
      }}>
        <input
          type="text"
          placeholder="Search by email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            flex: 1,
            padding: "10px 12px",
            border: "1px solid #d1d5db",
            borderRadius: 6,
            fontSize: 14
          }}
        />
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          style={{
            padding: "10px 12px",
            border: "1px solid #d1d5db",
            borderRadius: 6,
            fontSize: 14,
            cursor: "pointer"
          }}
        >
          <option value="all">All Roles</option>
          <option value="USER">Users</option>
          <option value="SELLER">Sellers</option>
          <option value="ADMIN">Admins</option>
        </select>
      </div>

      <div style={{ 
        fontSize: 14, 
        color: "#6b7280", 
        marginBottom: 16 
      }}>
        Showing {filteredUsers.length} of {users.length} users
      </div>

      {/* Users Table */}
      <div style={{ 
        background: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: 12,
        overflow: "hidden"
      }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
              <th style={tableHeaderStyle}>ID</th>
              <th style={tableHeaderStyle}>Email</th>
              <th style={tableHeaderStyle}>Role</th>
              <th style={tableHeaderStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, idx) => (
              <tr 
                key={user.id} 
                style={{ 
                  borderBottom: idx < filteredUsers.length - 1 ? "1px solid #e5e7eb" : "none"
                }}
              >
                <td style={tableCellStyle}>{user.id}</td>
                <td style={tableCellStyle}>{user.email}</td>
                <td style={tableCellStyle}>
                  <span style={{
                    padding: "4px 12px",
                    borderRadius: 12,
                    fontSize: 12,
                    fontWeight: 600,
                    background: user.role === "ADMIN" ? "#fef3c7" : 
                               user.role === "SELLER" ? "#dbeafe" : "#f3f4f6",
                    color: user.role === "ADMIN" ? "#92400e" : 
                           user.role === "SELLER" ? "#1e40af" : "#374151"
                  }}>
                    {user.role}
                  </span>
                </td>
                <td style={tableCellStyle}>
                  <div style={{ display: "flex", gap: 8 }}>
                    {user.role === "USER" && (
                      <button
                        onClick={() => upgradeToSeller(user.id, user.email)}
                        style={{
                          padding: "6px 12px",
                          background: "#10b981",
                          color: "#fff",
                          border: "none",
                          borderRadius: 6,
                          cursor: "pointer",
                          fontSize: 12,
                          fontWeight: 600
                        }}
                      >
                        Upgrade to Seller
                      </button>
                    )}
                    {user.role !== "ADMIN" && (
                      <button
                        onClick={() => deleteUser(user.id, user.email)}
                        style={{
                          padding: "6px 12px",
                          background: "#dc2626",
                          color: "#fff",
                          border: "none",
                          borderRadius: 6,
                          cursor: "pointer",
                          fontSize: 12,
                          fontWeight: 600
                        }}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============================================
// Listings Management Component
// ============================================
function ListingsManagement() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    loadListings();
  }, []);

  async function loadListings() {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/listings");
      setListings(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("[Admin] Load listings error:", err);
      setError("Failed to load listings");
    } finally {
      setLoading(false);
    }
  }

  async function deleteListing(id, title) {
    if (!window.confirm(`Delete "${title}"?\n\nThis action cannot be undone.`)) return;

    setDeleting(id);
    try {
      await api.delete(`/admin/listings/${id}`);
      alert(`"${title}" deleted successfully!`);
      setListings(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to delete listing");
    } finally {
      setDeleting(null);
    }
  }

  const filteredListings = listings.filter(item =>
    item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sellerEmail?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div style={{ padding: 40, textAlign: "center" }}>Loading listings...</div>;
  }

  return (
    <div>
      {error && (
        <div style={{ 
          color: "#b00020", 
          background: "#fee", 
          padding: 12, 
          borderRadius: 8,
          marginBottom: 20
        }}>
          {error}
        </div>
      )}

      <input
        type="text"
        placeholder="Search listings by title, category, or seller..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          width: "100%",
          padding: "12px 16px",
          border: "2px solid #e5e7eb",
          borderRadius: 8,
          fontSize: 16,
          marginBottom: 24
        }}
      />

      <div style={{ 
        fontSize: 14, 
        color: "#6b7280", 
        marginBottom: 16 
      }}>
        Showing {filteredListings.length} of {listings.length} listings
      </div>

      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", 
        gap: 20 
      }}>
        {filteredListings.map((item) => (
          <AdminListingCard 
            key={item.id} 
            item={item} 
            onDelete={deleteListing}
            isDeleting={deleting === item.id}
          />
        ))}
      </div>
    </div>
  );
}

function AdminListingCard({ item, onDelete, isDeleting }) {
  const fallbackImage = "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80";

  return (
    <article style={{ 
      border: "1px solid #e5e7eb", 
      borderRadius: 12, 
      overflow: "hidden",
      background: "#fff"
    }}>
      <img
        src={item.images?.[0] || fallbackImage}
        alt={item.title}
        style={{ width: "100%", height: 160, objectFit: "cover" }}
        onError={(e) => { e.target.src = fallbackImage; }}
      />
      <div style={{ padding: 16 }}>
        <h3 style={{ margin: "0 0 8px", fontSize: 16, fontWeight: 700 }}>
          {item.title}
        </h3>
        <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 4 }}>
          Seller: {item.sellerEmail}
        </div>
        <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 12 }}>
          Category: {item.category || "N/A"}
        </div>
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center" 
        }}>
          <span style={{ fontSize: 18, fontWeight: 700 }}>
            ${Number(item.price).toFixed(2)}
          </span>
          <button
            onClick={() => onDelete(item.id, item.title)}
            disabled={isDeleting}
            style={{
              padding: "6px 12px",
              background: isDeleting ? "#fee" : "#dc2626",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              cursor: isDeleting ? "not-allowed" : "pointer",
              fontSize: 12,
              fontWeight: 600
            }}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </article>
  );
}

function SellerRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(null);

  useEffect(() => {
    loadRequests();
  }, []);

  async function loadRequests() {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/admin/seller-requests");
      setRequests(res.data || []);
    } catch (err) {
      console.error("[Admin] Load requests error:", err);
      setError("Failed to load seller requests");
    } finally {
      setLoading(false);
    }
  }

  async function approveRequest(id, email) {
    if (!window.confirm(`Approve seller request from ${email}?`)) return;

    setProcessing(id);
    try {
      await api.post(`/admin/approve-seller/${id}`);
      alert(`${email} approved as seller!`);
      loadRequests();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to approve seller request");
    } finally {
      setProcessing(null);
    }
  }

  async function rejectRequest(id, email) {
    if (!window.confirm(`Reject seller request from ${email}?`)) return;

    setProcessing(id);
    try {
      await api.post(`/admin/reject-seller/${id}`);
      alert(`Seller request from ${email} rejected`);
      loadRequests();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to reject seller request");
    } finally {
      setProcessing(null);
    }
  }

  if (loading) {
    return <div style={{ padding: 40, textAlign: "center" }}>Loading requests...</div>;
  }

  return (
    <div>
      {error && (
        <div style={{ 
          color: "#b00020", 
          background: "#fee", 
          padding: 12, 
          borderRadius: 8,
          marginBottom: 20
        }}>
          {error}
        </div>
      )}

      {requests.length === 0 ? (
        <div style={{ 
          textAlign: "center", 
          padding: 60,
          background: "#f9fafb",
          borderRadius: 12 
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
          <h3>No pending seller requests</h3>
          <p style={{ color: "#6b7280" }}>All seller requests have been processed</p>
        </div>
      ) : (
        <div style={{ 
          background: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: 12,
          overflow: "hidden"
        }}>
          {requests.map((req, idx) => (
            <div 
              key={req.id}
              style={{ 
                padding: 20,
                borderBottom: idx < requests.length - 1 ? "1px solid #e5e7eb" : "none"
              }}
            >
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>
                  {req.userEmail}
                </div>
                <div style={{ fontSize: 12, color: "#6b7280" }}>
                  Requested: {new Date(req.createdAt).toLocaleString()}
                </div>
              </div>

              {req.message && (
                <div style={{ 
                  background: "#f9fafb", 
                  padding: 12, 
                  borderRadius: 8,
                  marginBottom: 12,
                  fontSize: 14,
                  color: "#374151"
                }}>
                  <strong>Message:</strong> {req.message}
                </div>
              )}

              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={() => approveRequest(req.id, req.userEmail)}
                  disabled={processing === req.id}
                  style={{
                    padding: "8px 16px",
                    background: processing === req.id ? "#9ca3af" : "#10b981",
                    color: "#fff",
                    border: "none",
                    borderRadius: 6,
                    cursor: processing === req.id ? "not-allowed" : "pointer",
                    fontWeight: 600,
                    fontSize: 14
                  }}
                >
                  {processing === req.id ? "Processing..." : "Approve"}
                </button>
                <button
                  onClick={() => rejectRequest(req.id, req.userEmail)}
                  disabled={processing === req.id}
                  style={{
                    padding: "8px 16px",
                    background: processing === req.id ? "#9ca3af" : "#dc2626",
                    color: "#fff",
                    border: "none",
                    borderRadius: 6,
                    cursor: processing === req.id ? "not-allowed" : "pointer",
                    fontWeight: 600,
                    fontSize: 14
                  }}
                >
                  {processing === req.id ? "Processing..." : "Reject"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
// ============================================
// Statistics Component
// ============================================
function Statistics() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalSellers: 0,
    totalListings: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    setLoading(true);
    try {
      const [usersRes, listingsRes] = await Promise.all([
        api.get("/admin/users"),
        api.get("/listings")
      ]);

      const users = usersRes.data || [];
      const listings = Array.isArray(listingsRes.data) ? listingsRes.data : [];

      setStats({
        totalUsers: users.filter(u => u.role === "USER").length,
        totalSellers: users.filter(u => u.role === "SELLER").length,
        totalListings: listings.length,
        totalRevenue: listings.reduce((sum, l) => sum + (Number(l.price) || 0), 0)
      });
    } catch (err) {
      console.error("[Admin] Load stats error:", err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div style={{ padding: 40, textAlign: "center" }}>Loading statistics...</div>;
  }

  return (
    <div style={{ 
      display: "grid", 
      gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", 
      gap: 24 
    }}>
      <StatCard 
        icon="👥" 
        title="Total Users" 
        value={stats.totalUsers}
        color="#3b82f6"
      />
      <StatCard 
        icon="🏪" 
        title="Total Sellers" 
        value={stats.totalSellers}
        color="#10b981"
      />
      <StatCard 
        icon="📦" 
        title="Total Listings" 
        value={stats.totalListings}
        color="#f59e0b"
      />
      <StatCard 
        icon="💰" 
        title="Total Inventory Value" 
        value={`$${stats.totalRevenue.toFixed(2)}`}
        color="#8b5cf6"
      />
    </div>
  );
}

function StatCard({ icon, title, value, color }) {
  return (
    <div style={{ 
      background: "#fff",
      border: "1px solid #e5e7eb",
      borderRadius: 12,
      padding: 24,
      textAlign: "center"
    }}>
      <div style={{ fontSize: 48, marginBottom: 12 }}>{icon}</div>
      <div style={{ fontSize: 14, color: "#6b7280", marginBottom: 8 }}>{title}</div>
      <div style={{ fontSize: 32, fontWeight: 700, color }}>{value}</div>
    </div>
  );
}

// Styles
const tableHeaderStyle = {
  padding: "12px 16px",
  textAlign: "left",
  fontSize: 12,
  fontWeight: 600,
  color: "#6b7280",
  textTransform: "uppercase"
};

const tableCellStyle = {
  padding: "16px",
  fontSize: 14
};