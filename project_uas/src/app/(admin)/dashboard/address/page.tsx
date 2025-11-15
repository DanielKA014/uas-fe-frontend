'use client';

import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function AddressPage() {
  const [mainAddress, setMainAddress] = useState(
    "Jl. Letjen S. Parman No.1, Grogol, Jakarta Barat"
  );

  const [branches, setBranches] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);

  // Radio: "main" | "branch"
  const [type, setType] = useState<"main" | "branch">("branch");

  const [value, setValue] = useState("");
  const [editIndex, setEditIndex] = useState<number | null>(null);

  // Open modal for add
  const openAddModal = () => {
    setType("branch");
    setValue("");
    setEditIndex(null);
    setShowModal(true);
  };

  // Open modal for editing branch
  const openEditBranch = (index: number) => {
    setType("branch");
    setValue(branches[index]);
    setEditIndex(index);
    setShowModal(true);
  };

  // Open modal for editing main address
  const openEditMain = () => {
    setType("main");
    setValue(mainAddress);
    setEditIndex(null);
    setShowModal(true);
  };

  const handleSave = () => {
    if (!value.trim()) return;

    if (type === "main") {
      setMainAddress(value);
    } else {
      if (editIndex !== null) {
        // Edit existing branch
        const updated = [...branches];
        updated[editIndex] = value;
        setBranches(updated);
      } else {
        // Add new branch
        setBranches([...branches, value]);
      }
    }

    setShowModal(false);
    setValue("");
    setEditIndex(null);
  };

  const deleteBranch = (index: number) => {
    if (!confirm("Delete this branch?")) return;
    const updated = branches.filter((_, i) => i !== index);
    setBranches(updated);
  };

  return (
    <div className="container" style={{ paddingTop: 10 }}>
      <h3 className="fw-bold mb-4">Control Address</h3>

      {/* Main Address */}
      <div className="card shadow-sm mb-4">
        <div className="card-body d-flex justify-content-between align-items-start">
          <div>
            <h5 className="fw-semibold">Main Address</h5>
            <p className="mt-2">{mainAddress}</p>
          </div>

          <button className="btn btn-sm btn-outline-primary" onClick={openEditMain}>
            Edit
          </button>
        </div>
      </div>

      {/* Branch List */}
      {branches.length > 0 && (
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h5 className="fw-semibold mb-3">Branch Addresses</h5>

            {branches.map((branch, i) => (
              <div
                key={i}
                className="d-flex justify-content-between align-items-center border rounded p-2 mb-2 bg-light"
              >
                <span>{branch}</span>

                <div className="d-flex gap-2">
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => openEditBranch(i)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => deleteBranch(i)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Floating Add Button */}
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

      {/* Modal */}
      {showModal && (
        <div
          className="modal fade show d-block"
          style={{ background: "rgba(0,0,0,0.3)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">

              <div className="modal-header">
                <h5 className="modal-title">
                  {editIndex !== null
                    ? "Edit Address"
                    : "Add New Address"}
                </h5>
                <button
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>

              <div className="modal-body">

                {/* Radio Options */}
                <div className="mb-3">
                  <label className="fw-semibold d-block mb-2">
                    Address Type:
                  </label>

                  <div className="form-check">
                    <input
                      type="radio"
                      className="form-check-input"
                      id="radioMain"
                      checked={type === "main"}
                      onChange={() => setType("main")}
                    />
                    <label className="form-check-label" htmlFor="radioMain">
                      Main Address
                    </label>
                  </div>

                  <div className="form-check mt-2">
                    <input
                      type="radio"
                      className="form-check-input"
                      id="radioBranch"
                      checked={type === "branch"}
                      onChange={() => setType("branch")}
                    />
                    <label className="form-check-label" htmlFor="radioBranch">
                      Branch Address
                    </label>
                  </div>
                </div>

                {/* Input */}
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter address..."
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                />
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
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
