'use client';

import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

type AddressType = {
  id: number;
  alamat_lengkap: string;
  kelurahan: string;
  kabupaten_kota: string;
  provinsi: string;
};

export default function AddressPage() {
  const [addresses, setAddresses] = useState<AddressType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editAddress, setEditAddress] = useState<AddressType | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is authenticated (you'll need to implement proper auth)
  useEffect(() => {
    // Temporary: Check if user is logged in as admin
    // You'll need to replace this with your actual auth check
    const token = localStorage.getItem('authToken'); // or however you store tokens
    setIsAuthenticated(!!token);
  }, []);

  // Fetch addresses
  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3001/api/address/");
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("API Response:", data);
      
      if (Array.isArray(data)) {
        setAddresses(data);
      } else {
        setAddresses([]);
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
      alert("Failed to load addresses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  // Add new address - FIXED ENDPOINT
  const handleAddAddress = async (addressData: Omit<AddressType, 'id'>) => {
    if (!isAuthenticated) {
      alert("Please log in as admin to add addresses");
      return;
    }

    try {
      console.log("Adding address:", addressData);
      
      const response = await fetch("http://localhost:3001/api/address/add", { // FIXED: added "/add"
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}` // Add auth header
        },
        body: JSON.stringify(addressData),
      });

      console.log("Add response status:", response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Add success:", result);
      
      await fetchAddresses();
      setShowModal(false);
      alert("Address added successfully!");
    } catch (error: any) {
      console.error("Add error:", error);
      alert("Failed to add address: " + error.message);
    }
  };

  // Update address - FIXED ENDPOINT
  const handleUpdateAddress = async (id: number, addressData: Partial<AddressType>) => {
    if (!isAuthenticated) {
      alert("Please log in as admin to update addresses");
      return;
    }

    try {
      console.log("Updating address:", id, addressData);
      
      const response = await fetch(`http://localhost:3001/api/address/${id}/update`, { // FIXED: added "/update"
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}` // Add auth header
        },
        body: JSON.stringify(addressData),
      });

      console.log("Update response status:", response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `HTTP error! status: ${response.status}`);
      }

      await fetchAddresses();
      setShowModal(false);
      setEditAddress(null);
      alert("Address updated successfully!");
    } catch (error: any) {
      console.error("Update error:", error);
      alert("Failed to update address: " + error.message);
    }
  };

  // Delete address - FIXED ENDPOINT
  const handleDeleteAddress = async (id: number) => {
    if (!isAuthenticated) {
      alert("Please log in as admin to delete addresses");
      return;
    }

    if (!confirm("Are you sure you want to delete this address?")) return;

    try {
      console.log("Deleting address:", id);
      
      const response = await fetch(`http://localhost:3001/api/address/${id}/delete`, { // FIXED: added "/delete"
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}` // Add auth header
        }
      });

      console.log("Delete response status:", response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `HTTP error! status: ${response.status}`);
      }

      await fetchAddresses();
      alert("Address deleted successfully!");
    } catch (error: any) {
      console.error("Delete error:", error);
      alert("Failed to delete: " + error.message);
    }
  };

  const openAddModal = () => {
    if (!isAuthenticated) {
      alert("Please log in as admin to add addresses");
      return;
    }
    setEditAddress(null);
    setShowModal(true);
  };

  const openEditModal = (address: AddressType) => {
    if (!isAuthenticated) {
      alert("Please log in as admin to edit addresses");
      return;
    }
    setEditAddress(address);
    setShowModal(true);
  };

  const handleSubmit = (formData: Omit<AddressType, 'id'>) => {
    if (editAddress) {
      handleUpdateAddress(editAddress.id, formData);
    } else {
      handleAddAddress(formData);
    }
  };

  if (loading) {
    return (
      <div className="container d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: 20 }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold">Manage Addresses</h3>
        {!isAuthenticated && (
          <div className="alert alert-warning mb-0">
            <small>Admin login required to modify addresses</small>
          </div>
        )}
      </div>

      <div className="row">
        {addresses.length === 0 ? (
          <div className="col-12">
            <div className="text-center py-5">
              <h5>No addresses found</h5>
              <p className="text-muted">Add your first address to get started</p>
            </div>
          </div>
        ) : (
          addresses.map((a, i) => (
            <div key={a.id} className="col-md-6 mb-3">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h5 className="card-title">
                    Address #{i + 1}
                  </h5>
                  <p className="mb-1"><strong>Alamat:</strong> {a.alamat_lengkap}</p>
                  <p className="mb-1"><strong>Kelurahan:</strong> {a.kelurahan}</p>
                  <p className="mb-1"><strong>Kab/Kota:</strong> {a.kabupaten_kota}</p>
                  <p className="mb-0"><strong>Provinsi:</strong> {a.provinsi}</p>
                </div>
                <div className="card-footer bg-transparent">
                  <div className="d-flex gap-2">
                    <button 
                      className="btn btn-outline-primary btn-sm" 
                      onClick={() => openEditModal(a)}
                      disabled={!isAuthenticated}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn btn-outline-danger btn-sm" 
                      onClick={() => handleDeleteAddress(a.id)}
                      disabled={!isAuthenticated || addresses.length <= 1}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <button
        className="btn btn-primary rounded-circle shadow-lg position-fixed"
        style={{ 
          width: 60, 
          height: 60, 
          bottom: 30, 
          right: 30, 
          fontSize: 28,
          zIndex: 999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        onClick={openAddModal}
        title={isAuthenticated ? "Add New Address" : "Login required to add addresses"}
      >
        +
      </button>

      {showModal && (
        <AddressModal
          address={editAddress}
          onClose={() => { setShowModal(false); setEditAddress(null); }}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}

// Modal Component (keep your existing modal code)
function AddressModal({ 
  address, 
  onClose, 
  onSubmit 
}: { 
  address: AddressType | null;
  onClose: () => void;
  onSubmit: (data: Omit<AddressType, 'id'>) => void;
}) {
  const [formData, setFormData] = useState({
    alamat_lengkap: address?.alamat_lengkap || '',
    kelurahan: address?.kelurahan || '',
    kabupaten_kota: address?.kabupaten_kota || '',
    provinsi: address?.provinsi || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.alamat_lengkap.trim() || 
        !formData.kelurahan.trim() || 
        !formData.kabupaten_kota.trim() || 
        !formData.provinsi.trim()) {
      alert('Please fill all fields');
      return;
    }
    
    onSubmit(formData);
  };

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{address ? "Edit Address" : "Add New Address"}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Alamat Lengkap</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={formData.alamat_lengkap}
                  onChange={(e) => handleChange('alamat_lengkap', e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Kelurahan</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={formData.kelurahan}
                  onChange={(e) => handleChange('kelurahan', e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Kabupaten/Kota</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={formData.kabupaten_kota}
                  onChange={(e) => handleChange('kabupaten_kota', e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Provinsi</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={formData.provinsi}
                  onChange={(e) => handleChange('provinsi', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {address ? "Update" : "Add"} Address
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}