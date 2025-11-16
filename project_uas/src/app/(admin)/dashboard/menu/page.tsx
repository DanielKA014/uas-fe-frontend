"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

type MenuItemType = {
  item_id: number;
  item_name: string;
  dine_in_price: number;
  online_price: number;
  description: string;
  category: string;
  image_data_url: string;
};

const BASE_URL = "http://localhost:3001/api/foods";
const ITEMS_PER_PAGE = 8;

// Helper to get auth headers (assumes token is in localStorage)
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export default function MenuPage() {
  const [menus, setMenus] = useState<MenuItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItemType | null>(null);

  const [form, setForm] = useState({
    item_name: "",
    dine_in_price: "",
    online_price: "",
    description: "",
    category: "main-dish",
    image_base64_url: "",
  });

  // Fetch menus
  const fetchMenus = async (page: number, append: boolean = false) => {
    try {
      append ? setLoadingMore(true) : setLoading(true);

      const res = await fetch(`${BASE_URL}?page=${page}&limit=${ITEMS_PER_PAGE}`);
      if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);

      const data = await res.json();
      const newMenus = data.result || [];

      append ? setMenus((prev) => [...prev, ...newMenus]) : setMenus(newMenus);

      setHasMore(newMenus.length === ITEMS_PER_PAGE);
      setError(null);
    } catch (err: any) {
      console.error("Failed fetching menus", err);
      setError("Failed to load menus. Please try again.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchMenus(1, false);
  }, []);

  const loadNextPage = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    fetchMenus(nextPage, true);
  };

  // Image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({ ...prev, image_base64_url: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  // Modal handlers
  const openAddModal = () => {
    setEditingItem(null);
    setForm({
      item_name: "",
      dine_in_price: "",
      online_price: "",
      description: "",
      category: "main-dish",
      image_base64_url: "",
    });
    setShowModal(true);
    setError(null);
  };

  const openEditModal = (menu: MenuItemType) => {
    setEditingItem(menu);
    setForm({
      item_name: menu.item_name,
      // Convert numbers back to strings for the input fields
      dine_in_price: String(menu.dine_in_price),
      online_price: String(menu.online_price),
      description: menu.description,
      category: menu.category,
      image_base64_url: "", // Reset image field for edit, user must re-upload
    });
    setShowModal(true);
    setError(null);
  };

  // Save Add / Edit
  const handleSave = async () => {
    // Client-side validation
    if (!form.item_name.trim()) {
      alert("Menu name is required!");
      return;
    }

    const dineIn = parseFloat(form.dine_in_price);
    const online = parseFloat(form.online_price);

    if (isNaN(dineIn)) {
      alert("Dine-in price must be a valid number!");
      return;
    }

    if (isNaN(online)) {
      alert("Online price must be a valid number!");
      return;
    }

    // CONSTRUCTING THE REQUEST BODY (FIXED LOGIC)
    const body: any = {
      item_name: form.item_name.trim(),
      category: form.category || "main-dish",
      dine_in_price: dineIn,
      online_price: online,
      description: form.description || "",
      // ADDITION: Always include image_base64_url, even if empty string for 'add'
      // This satisfies the backend validator which might require the field.
      image_base64_url: form.image_base64_url, 
    };

    // If it's an edit, we remove image_base64_url if it's empty, 
    // so we don't unnecessarily update it to null/empty buffer if the user didn't upload a new one.
    // NOTE: For 'add', we MUST send it.
    if (editingItem && !body.image_base64_url) {
        delete body.image_base64_url;
    }

    try {
      const url = editingItem
        ? `${BASE_URL}/${editingItem.item_id}/update`
        : `${BASE_URL}/add`;
      const method = editingItem ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(body),
      });

      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = { message: text };
      }

      if (!res.ok) {
        // Logging the server response for easier debugging
        console.error("Server validation/error response:", data);
        
        // Throw a better error message
        if (data.errors && Array.isArray(data.errors)) {
            const errorMessages = data.errors.map((e: any) => `${e.param}: ${e.msg}`).join('; ');
            throw new Error(`Validation Failed: ${errorMessages}`);
        }

        throw new Error(data.message || `Failed: ${res.status}`);
      }

      setShowModal(false);
      setCurrentPage(1);
      fetchMenus(1, false);
      setError(null);
    } catch (err: any) {
      console.error("Save failed", err);
      setError(err.message || "Save failed. Check authentication or try again.");
    }
  };

  // Delete
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this menu?")) return;

    try {
      const res = await fetch(`${BASE_URL}/${id}/delete`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = { message: text };
      }

      if (!res.ok) throw new Error(data.message || `Failed: ${res.status}`);

      setCurrentPage(1);
      fetchMenus(1, false);
      setError(null);
    } catch (err: any) {
      console.error("Delete failed", err);
      setError(err.message || "Delete failed. Check authentication or try again.");
    }
  };

  if (loading) return <div>Loading menus...</div>;

  return (
    <div className="p-4">
      <h2 className="fw-bold mb-4">Menu Management</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <button className="btn btn-success mb-3" onClick={openAddModal}>
        + Add Menu
      </button>

      <div className="row">
        {menus.map((menu) => (
          <div key={menu.item_id} className="col-lg-3 col-md-6 col-sm-12 mb-4">
            <div className="card shadow-sm">
              <Image
                src={menu.image_data_url || "/images/makanan/default.jpg"}
                alt={menu.item_name}
                width={400}
                height={250}
                className="card-img-top object-fit-cover"
              />
              <div className="card-body">
                <h5 className="card-title fw-semibold">{menu.item_name}</h5>
                <p className="mb-1">Dine-in: Rp {menu.dine_in_price}</p>
                <p className="mb-1">Online: Rp {menu.online_price}</p>
                <p className="mb-1 text-muted small" style={{ 
                  overflow: 'hidden', 
                  textOverflow: 'ellipsis', 
                  display: '-webkit-box', 
                  WebkitLineClamp: 2, 
                  WebkitBoxOrient: 'vertical' 
                  }} title={menu.description}>
                    {menu.description}
                  </p>
                <p className="badge bg-secondary">{menu.category}</p>
                <div className="d-flex justify-content-between mt-2">
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => openEditModal(menu)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(menu.item_id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {hasMore && (
        <div className="text-center mt-4">
          <button
            className="btn btn-outline-primary"
            onClick={loadNextPage}
            disabled={loadingMore}
          >
            {loadingMore ? "Loading..." : "Next Page"}
          </button>
        </div>
      )}

      {showModal && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex align-items-center justify-content-center"
          style={{ zIndex: 1050 }}
        >
          <div
            className="bg-white rounded shadow d-flex flex-column"
            style={{
              width: "450px",
              maxWidth: "90%",
              maxHeight: "90vh",
            }}
          >
            <div
              className="p-4 overflow-auto"
              style={{
                flex: 1,
                minHeight: 0,
              }}
            >
              <h5 className="mb-3">
                {editingItem ? "Edit Menu" : "Add New Menu"}
              </h5>

              <div
                className="border border-2 border-secondary rounded mb-3 d-flex flex-column align-items-center justify-content-center"
                style={{
                  height: "200px",
                  backgroundColor: "#f8f9fa",
                  cursor: "pointer",
                }}
                onClick={() =>
                  (document.getElementById("imageUpload") as HTMLInputElement)?.click()
                }
              >
                {form.image_base64_url ? (
                  <Image
                    src={form.image_base64_url}
                    alt="Preview"
                    width={300}
                    height={200}
                    className="rounded"
                  />
                ) : (
                  <div className="text-secondary text-center">
                    <div className="fs-1 fw-bold" style={{ lineHeight: "1" }}>
                      +
                    </div>
                    <small>Click to add picture</small>
                  </div>
                )}
                <input
                  id="imageUpload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                />
              </div>

              <div className="mb-2">
                <label className="form-label fw-semibold">Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={form.item_name}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, item_name: e.target.value }))
                  }
                />
              </div>

              <div className="mb-2">
                <label className="form-label fw-semibold">Dine-in Price</label>
                <input
                  type="number"
                  className="form-control"
                  value={form.dine_in_price}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, dine_in_price: e.target.value }))
                  }
                />
              </div>

              <div className="mb-2">
                <label className="form-label fw-semibold">Online Price</label>
                <input
                  type="number"
                  className="form-control"
                  value={form.online_price}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, online_price: e.target.value }))
                  }
                />
              </div>

              <div className="mb-2">
                <label className="form-label fw-semibold">Description</label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={form.description}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, description: e.target.value }))
                  }
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Category</label>
                <select
                  className="form-select"
                  value={form.category}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, category: e.target.value }))
                  }
                >
                  <option value="main-dish">Main Dish</option>
                  <option value="beverages">Beverages</option>
                  <option value="vegetables">Vegetables</option>
                  <option value="add-ons">Add Ons</option>
                </select>
              </div>
            </div>

            <div
              className="p-3 border-top bg-white d-flex justify-content-end gap-2"
              style={{ position: "sticky", bottom: 0 }}
            >
              <button
                className="btn btn-secondary"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button className="btn btn-success" onClick={handleSave}>
                {editingItem ? "Save Changes" : "Add Menu"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}