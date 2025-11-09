"use client";

import React, { useState } from "react";
import Image from "next/image";

type MenuItemType = {
  id: number;
  name: string;
  price: number | string;
  ingredients: string;
  category: string;
  image: string;
};

export default function MenuPage() {
  const [menus, setMenus] = useState<MenuItemType[]>([
    {
      id: 1,
      name: "Ayam Goreng Kremes",
      price: 25000,
      ingredients: "Ayam, kremes, bawang, cabai",
      category: "Main Dish",
      image: "/images/makanan/ayam-goreng-kremes.jpeg",
    },
    {
      id: 2,
      name: "Es Teh Manis",
      price: 8000,
      ingredients: "Teh, gula, es batu",
      category: "Beverage",
      image: "/images/makanan/es-teh.png",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItemType | null>(null);

  const [form, setForm] = useState({
    name: "",
    price: "",
    ingredients: "",
    category: "Main Dish",
    image: "",
  });

  // Image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({ ...prev, image: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  // Open modal for Add or Edit
  const openAddModal = () => {
    setEditingItem(null);
    setForm({
      name: "",
      price: "",
      ingredients: "",
      category: "Main Dish",
      image: "",
    });
    setShowModal(true);
  };

  const openEditModal = (menu: MenuItemType) => {
    setEditingItem(menu);
    setForm({
      name: menu.name,
      price: String(menu.price),
      ingredients: menu.ingredients,
      category: menu.category,
      image: menu.image,
    });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.name || !form.price) {
      alert("Please fill in the name and price!");
      return;
    }

    if (editingItem) {
      // Update existing
      setMenus((prev) =>
        prev.map((m) =>
          m.id === editingItem.id
            ? {
                ...m,
                name: form.name,
                price: Number(form.price),
                ingredients: form.ingredients,
                category: form.category,
                image: form.image || m.image,
              }
            : m
        )
      );
    } else {
      {
        /* Add Menu */
      }
      const newItem: MenuItemType = {
        id: Date.now(),
        name: form.name,
        price: Number(form.price),
        ingredients: form.ingredients,
        category: form.category,
        image: form.image || "/makanan/default.jpg",
      };
      setMenus((prev) => [newItem, ...prev]);
    }

    setShowModal(false);
    setEditingItem(null);
    setForm({
      name: "",
      price: "",
      ingredients: "",
      category: "Main Dish",
      image: "",
    });
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this menu?")) {
      setMenus((prev) => prev.filter((m) => m.id !== id));
    }
  };

  return (
    <div className="p-4">
      <h2 className="fw-bold mb-4">Menu Management</h2>

      <button className="btn btn-success mb-3" onClick={openAddModal}>
        + Add Menu
      </button>

      <div className="row">
        {menus.map((menu) => (
          <div key={menu.id} className="col-md-4 mb-4">
            <div className="card shadow-sm">
              <Image
                src={menu.image}
                alt={menu.name}
                width={400}
                height={250}
                className="card-img-top object-fit-cover"
              />
              <div className="card-body">
                <h5 className="card-title fw-semibold">{menu.name}</h5>
                <p className="mb-1">Price: Rp {menu.price}</p>
                <p className="mb-1 text-muted small">{menu.ingredients}</p>
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
                    onClick={() => handleDelete(menu.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
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
              maxHeight: "90vh", // prevents overflowing viewport
            }}
          >
            <div
              className="p-4 overflow-auto"
              style={{
                flex: 1,
                minHeight: 0, // ensures overflow works properly
              }}
            >
              <h5 className="mb-3">
                {editingItem ? "Edit Menu" : "Add New Menu"}
              </h5>

              {/* Image upload area */}
              <div
                className="border border-2 border-secondary rounded mb-3 d-flex flex-column align-items-center justify-content-center"
                style={{
                  height: "200px",
                  backgroundColor: "#f8f9fa",
                  cursor: "pointer",
                }}
                onClick={() =>
                  (
                    document.getElementById("imageUpload") as HTMLInputElement
                  )?.click()
                }
              >
                {form.image ? (
                  <Image
                    src={form.image}
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

              {/* Inputs */}
              <div className="mb-2">
                <label className="form-label fw-semibold">Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={form.name}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                />
              </div>

              <div className="mb-2">
                <label className="form-label fw-semibold">Price</label>
                <input
                  type="number"
                  className="form-control"
                  value={form.price}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, price: e.target.value }))
                  }
                />
              </div>

              <div className="mb-2">
                <label className="form-label fw-semibold">Ingredients</label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={form.ingredients}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      ingredients: e.target.value,
                    }))
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
                  <option>Main Dish</option>
                  <option>Beverage</option>
                  <option>Vegetables</option>
                  <option>Add Ons</option>
                </select>
              </div>
            </div>

            {/* Sticky footer for buttons */}
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
