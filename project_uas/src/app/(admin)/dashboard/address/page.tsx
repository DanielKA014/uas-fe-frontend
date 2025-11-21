'use client';

import { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

// Helper to get auth headers (assumes token is in localStorage)
const getAuthHeaders = () => {
  const token = localStorage.getItem('token'); // Adjust if your token key differs
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
};

export default function AddressPage() {
  const [addresses, setAddresses] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null); // For displaying errors

  // Form states
  const [alamatLengkap, setAlamatLengkap] = useState("");
  const [kelurahan, setKelurahan] = useState("");
  const [kabupatenKota, setKabupatenKota] = useState("");
  const [provinsi, setProvinsi] = useState("");

  // Load data from backend
  const fetchAddresses = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/address/`);
      if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
      const data = await res.json();
      setAddresses(data);
      setError(null);
    } catch (err) {
      console.error("Failed fetching addresses", err);
      setError("Failed to load addresses. Please try again.");
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  // Open modal for add
  const openAddModal = () => {
    setEditId(null);
    setAlamatLengkap("");
    setKelurahan("");
    setKabupatenKota("");
    setProvinsi("");
    setShowModal(true);
    setError(null);
  };

  // Open modal for edit
  const openEditModal = (item: any) => {
    setEditId(item.id);
    setAlamatLengkap(item.alamat_lengkap);
    setKelurahan(item.kelurahan);
    setKabupatenKota(item.kabupaten_kota);
    setProvinsi(item.provinsi);
    setShowModal(true);
    setError(null);
  };

  // Save (Add / Edit)
  const handleSave = async () => {
    const body = {
      alamat_lengkap: alamatLengkap,
      kelurahan,
      kabupaten_kota: kabupatenKota,
      provinsi,
    };

    try {
      const url = editId === null ? `${BASE_URL}/api/address/add` : `${BASE_URL}/api/address/${editId}/update`;
      const method = editId === null ? "POST" : "PUT";
      const res = await fetch(url, {
        method,
        headers: getAuthHeaders(), // Added auth headers
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `Failed: ${res.status}`);
      }

      setShowModal(false);
      fetchAddresses(); // Refresh list
      setError(null);
    } catch (err: any) {
      console.error("Save failed", err);
      setError(err.message || "Save failed. Check authentication or try again.");
    }
  };

  // Delete
  const deleteAddress = async (id: number) => {
    if (!confirm("Delete this address?")) return;

    try {
      const res = await fetch(`${BASE_URL}/${id}/delete`, {
        method: "DELETE",
        headers: getAuthHeaders(), // Added auth headers (no body needed)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `Failed: ${res.status}`);
      }

      fetchAddresses(); // Refresh list
      setError(null);
    } catch (err: any) {
      console.error("Delete failed", err);
      setError(err.message || "Delete failed. Check authentication or try again.");
    }
  };

  return (
    <div className="container" style={{ paddingTop: 10 }}>
      <h3 className="fw-bold mb-4">Control Address</h3>

      {/* Error Display */}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* LIST ADDRESS */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h5 className="fw-semibold mb-3">Address List</h5>

          {addresses.length === 0 ? (
            <p className="text-muted">No address yet.</p>
          ) : (
            addresses.map((item, i) => (
              <div
                key={item.id}
                className="d-flex justify-content-between align-items-center border rounded p-2 mb-2 bg-light"
              >
                <div>
                  <b>{item.alamat_lengkap}</b>
                  <div className="text-muted small">
                    {item.kelurahan}, {item.kabupaten_kota}, {item.provinsi}
                  </div>
                </div>

                <div className="d-flex gap-2">
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => openEditModal(item)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => deleteAddress(item.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ADD BUTTON */}
      <button
        className="btn btn-primary rounded-circle shadow-lg position-fixed"
        style={{
          width: 60,
          height: 60,
          bottom: 20,
          right: 20,
          fontSize: 28,
          zIndex: 999,
        }}
        onClick={openAddModal}
      >
        +
      </button>

      {/* MODAL */}
      {showModal && (
        <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,0.3)" }}>
          <div className="modal-dialog">
            <div className="modal-content">

              <div className="modal-header">
                <h5 className="modal-title">
                  {editId === null ? "Add New Address" : "Edit Address"}
                </h5>
                <button className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>

              <div className="modal-body">

                <label className="fw-semibold">Alamat Lengkap</label>
                <input
                  type="text"
                  className="form-control mb-3"
                  value={alamatLengkap}
                  onChange={(e) => setAlamatLengkap(e.target.value)}
                />

                <label className="fw-semibold">Kelurahan</label>
                <input
                  type="text"
                  className="form-control mb-3"
                  value={kelurahan}
                  onChange={(e) => setKelurahan(e.target.value)}
                />

                <label className="fw-semibold">Kabupaten / Kota</label>
                <input
                  type="text"
                  className="form-control mb-3"
                  value={kabupatenKota}
                  onChange={(e) => setKabupatenKota(e.target.value)}
                />

                <label className="fw-semibold">Provinsi</label>
                <input
                  type="text"
                  className="form-control"
                  value={provinsi}
                  onChange={(e) => setProvinsi(e.target.value)}
                />

              </div>

              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={handleSave}>
                  Save
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}