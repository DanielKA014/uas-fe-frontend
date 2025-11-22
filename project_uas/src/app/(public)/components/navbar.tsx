"use client";

import { useEffect, useState } from "react";
import { Button, Container, Nav, Navbar, Dropdown } from "react-bootstrap";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../globals.css";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL

export default function NavbarComponent() {
    const pathname = usePathname();
    const router = useRouter();
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }

        // Verifikasi token ke backend
        const fetchUser = async () => {
            const token = localStorage.getItem("token");
            if (!token) return;

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
                    localStorage.setItem("user", JSON.stringify(data));
                } else {
                    // token invalid → logout
                    setUser(null);
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                }
            } catch (err) {
                console.error("Error fetching user:", err);
            }
        };

        fetchUser();
    }, []);

    // Logout
    const handleLogout = async () => {
        const token = localStorage.getItem("token");

        try {
            await fetch(`${BASE_URL}/api/auth/logout`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        } catch (err) {
            console.error("Logout error:", err);
        }

        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        window.location.href = "/";
    };

    const navLinks = [
        { href: "/", label: "Home" },
        { href: "/about", label: "About" },
        { href: "/menu", label: "Menu" },
        { href: "/reviews", label: "Reviews" },
    ];

    return (
        <Navbar
            bg="dark"
            expand="lg"
            variant="dark"
            fixed="top"
            style={{ backgroundColor: "#3a3a3a", padding: 0 }}
            className="py-2 shadow-sm"
        >
            <Container fluid className="px-3">
                <Link
                    href="/"
                    className="d-flex align-items-center text-white text-decoration-none"
                >
                    <Image
                        src="/images/logo.png"
                        alt="Logo"
                        width={48}
                        height={48}
                        className="me-2"
                    />
                    <span className="fw-semibold fs-2 fst-italic">
                        Ayam Bakar Ojolali
                    </span>
                </Link>

                <Navbar.Toggle aria-controls="navbarScroll" />

                <Navbar.Collapse id="navbarScroll">
                    <Nav className="mx-auto">
                        {navLinks.map(({ href, label }) => {
                            const isActive = pathname === href;
                            return (
                                <Nav.Link
                                    key={href}
                                    href={href}
                                    className={`nav-link rounded py-1 px-3 ${
                                        isActive
                                            ? "fw-semibold text-dark bg-light rounded-pill mx-2"
                                            : "text-white mx-2"
                                    }`}
                                >
                                    {label}
                                </Nav.Link>
                            );
                        })}
                    </Nav>

                    {/* Jika user BELUM login maka bakal tampilkan tombol Login */}
                    {!user && (
                        <Link href="/login">
                            <Button variant="outline-success" className="ms-lg-3 px-4">
                                Login
                            </Button>
                        </Link>
                    )}

                    {/* Jika user sudah login */}
                    {user && (
                        <Dropdown align="end" className="ms-3">
                            <Dropdown.Toggle
                                variant="dark"
                                id="dropdown-user"
                                className="d-flex align-items-center border-0"
                                style={{ backgroundColor: "transparent" }}
                            >
                                <Image
                                    src="/images/logo.png"
                                    alt="User Avatar"
                                    width={36}
                                    height={36}
                                    className="rounded-circle me-2 border"
                                />
                                <span className="text-white">{user.username}</span>
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                <Dropdown.Item
                                    onClick={() => router.push('/profile')}
                                >
                                    Profile
                                </Dropdown.Item>
                                <Dropdown.Divider />
                                <Dropdown.Item
                                    onClick={handleLogout}
                                    className="text-danger"
                                >
                                    Logout
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    )}
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
