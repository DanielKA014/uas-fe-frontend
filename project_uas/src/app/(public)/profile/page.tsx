"use client";
import { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Alert, Spinner } from "react-bootstrap";
import { useRouter } from "next/navigation";
import Image from "next/image";
import "bootstrap/dist/css/bootstrap.min.css";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import "./page.css";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form states for editing
  const [editUsername, setEditUsername] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");

  const [showEditUsername, setShowEditUsername] = useState(false);
  const [showEditEmail, setShowEditEmail] = useState(false);
  const [showEditPassword, setShowEditPassword] = useState(false);

  const [updating, setUpdating] = useState(false);

  // Fetch current user
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const res = await fetch(`${BASE_URL}/api/auth/me`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data);
          setEditUsername(data.username);
          setEditEmail(data.email);
        } else {
          setError("Failed to fetch user data");
          router.push("/login");
        }
      } catch (err) {
        console.error("Error fetching user:", err);
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  // Update username
  const handleUpdateUsername = async () => {
    if (!editUsername.trim()) {
      setError("Username cannot be empty");
      return;
    }

    if (editUsername === user.username) {
      setError("Please provide a different username");
      return;
    }

    await updateUserInfo({
      new_username: editUsername,
      password: currentPassword,
    });
  };

  // Update email
  const handleUpdateEmail = async () => {
    if (!editEmail.trim()) {
      setError("Email cannot be empty");
      return;
    }

    if (editEmail === user.email) {
      setError("Please provide a different email");
      return;
    }

    await updateUserInfo({
      new_email: editEmail,
      password: currentPassword,
    });
  };

  // Update password
  const handleUpdatePassword = async () => {
    if (!editPassword.trim()) {
      setError("New password cannot be empty");
      return;
    }

    if (editPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      setUpdating(true);
      setError(null);
      setSuccess(null);

      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: user.email,
          new_password: editPassword,
          confirm_new_password: editPassword,
        }),
      });

      if (res.ok) {
        setSuccess("Password updated successfully!");
        setEditPassword("");
        setCurrentPassword("");
        setShowEditPassword(false);
      } else {
        const data = await res.json();
        setError(data.message || "Failed to update password");
      }
    } catch (err) {
      console.error("Error updating password:", err);
      setError("Failed to update password");
    } finally {
      setUpdating(false);
    }
  };

  // Generic update user info
  const updateUserInfo = async (updates: any) => {
    try {
      setUpdating(true);
      setError(null);
      setSuccess(null);

      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/api/auth/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });

      if (res.ok) {
        const data = await res.json();
        setSuccess("Profile updated successfully!");
        
        // Update local user data
        const updatedUser = {
          ...user,
          ...updates,
        };
        delete updatedUser.password; // Remove password from display
        
        if (updates.new_username) updatedUser.username = updates.new_username;
        if (updates.new_email) updatedUser.email = updates.new_email;
        
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));

        // Clear forms
        setCurrentPassword("");
        setShowEditUsername(false);
        setShowEditEmail(false);
      } else {
        const data = await res.json();
        setError(data.message || "Failed to update profile");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Failed to update profile");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen size="lg" />;
  }

  if (!user) {
    return (
      <Container className="py-5" style={{ paddingTop: 64 }}>
        <Alert variant="danger">Failed to load profile</Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5" style={{ paddingTop: 64, marginTop: 64 }}>
      <Row className="justify-content-center">
        <Col md={8}>
          {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}
          {success && <Alert variant="success" onClose={() => setSuccess(null)} dismissible>{success}</Alert>}

          {/* Profile Header */}
          <div className="text-center mb-5">
            <div className="mb-3">
              <Image
                src="/images/logo.png"
                alt="Profile Avatar"
                width={120}
                height={120}
                className="rounded-circle border border-3"
              />
            </div>
            <h2 className="fw-bold mb-2">{user.username}</h2>
            <p className="text-muted">{user.email}</p>
          </div>

          {/* Profile Information Cards */}
          <Row className="g-4">
            {/* Username Card */}
            <Col md={6}>
              <div className="card border-0 shadow-sm p-4">
                <h5 className="fw-bold mb-3">Username</h5>
                <p className="mb-3 text-muted">{user.username}</p>
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => setShowEditUsername(!showEditUsername)}
                >
                  {showEditUsername ? "Cancel" : "Edit"}
                </Button>

                {showEditUsername && (
                  <div className="mt-3">
                    <Form.Group className="mb-2">
                      <Form.Label>New Username</Form.Label>
                      <Form.Control
                        type="text"
                        value={editUsername}
                        onChange={(e) => setEditUsername(e.target.value)}
                        placeholder="Enter new username"
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Current Password</Form.Label>
                      <Form.Control
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Enter current password"
                      />
                    </Form.Group>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleUpdateUsername}
                      disabled={updating}
                    >
                      {updating ? "Saving..." : "Save"}
                    </Button>
                  </div>
                )}
              </div>
            </Col>

            {/* Email Card */}
            <Col md={6}>
              <div className="card border-0 shadow-sm p-4">
                <h5 className="fw-bold mb-3">Email</h5>
                <p className="mb-3 text-muted">{user.email}</p>
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => setShowEditEmail(!showEditEmail)}
                >
                  {showEditEmail ? "Cancel" : "Edit"}
                </Button>

                {showEditEmail && (
                  <div className="mt-3">
                    <Form.Group className="mb-2">
                      <Form.Label>New Email</Form.Label>
                      <Form.Control
                        type="email"
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                        placeholder="Enter new email"
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Current Password</Form.Label>
                      <Form.Control
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Enter current password"
                      />
                    </Form.Group>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleUpdateEmail}
                      disabled={updating}
                    >
                      {updating ? "Saving..." : "Save"}
                    </Button>
                  </div>
                )}
              </div>
            </Col>

            {/* Password Card */}
            <Col md={6}>
              <div className="card border-0 shadow-sm p-4">
                <h5 className="fw-bold mb-3">Password</h5>
                <p className="mb-3 text-muted">••••••••</p>
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => setShowEditPassword(!showEditPassword)}
                >
                  {showEditPassword ? "Cancel" : "Change"}
                </Button>

                {showEditPassword && (
                  <div className="mt-3">
                    <Form.Group className="mb-3">
                      <Form.Label>New Password</Form.Label>
                      <Form.Control
                        type="password"
                        value={editPassword}
                        onChange={(e) => setEditPassword(e.target.value)}
                        placeholder="Enter new password"
                      />
                      <Form.Text className="text-muted d-block mt-1">
                        Minimum 6 characters
                      </Form.Text>
                    </Form.Group>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleUpdatePassword}
                      disabled={updating}
                    >
                      {updating ? "Saving..." : "Save"}
                    </Button>
                  </div>
                )}
              </div>
            </Col>

            {/* Role Info Card */}
            <Col md={6}>
              <div className="card border-0 shadow-sm p-4">
                <h5 className="fw-bold mb-3">Account Role</h5>
                <p className="mb-3">
                  <span className={`badge ${user.role === 'admin' ? 'bg-danger' : 'bg-info'}`}>
                    {user.role?.toUpperCase() || 'USER'}
                  </span>
                </p>
              </div>
            </Col>
          </Row>

          {/* Back Button */}
          <div className="text-center mt-5">
            <Button
              variant="secondary"
              onClick={() => router.back()}
            >
              Back
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
