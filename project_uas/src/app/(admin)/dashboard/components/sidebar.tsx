'use client';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import 'bootstrap/dist/css/bootstrap.min.css';

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL

export default function Sidebar() {
  const pathname = usePathname();
  


  const navLinks = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/dashboard/menu', label: 'Control Menu' },
    { href: '/dashboard/address', label: 'Control Address' }
  ];

  return (
    <>
      {/* === Mobile Offcanvas Sidebar === */}
      <div
        className="offcanvas offcanvas-start d-md-none"
        tabIndex={-1}
        id="sidebarOffcanvas"
        aria-labelledby="sidebarOffcanvasLabel"
        style={{ top: 56, height: 'calc(100% - 56px)', zIndex: 1090 }}
      >
        <div className="offcanvas-header border-bottom">
          <h5 className="fw-semibold">Admin Panel</h5>
          <button type="button" className="btn-close" data-bs-dismiss="offcanvas"></button>
        </div>

        <div className="offcanvas-body d-flex flex-column justify-content-between">
          <nav className="nav flex-column gap-2">
            {navLinks.map(({ href, label }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`nav-link rounded py-3 px-3 text-center ${
                    isActive ? 'bg-primary text-white fw-semibold' : 'text-dark'
                  }`}
                  data-bs-dismiss="offcanvas"
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          <div>
            <p className="text-muted text-center small mt-3">© 2025 Ayam Bakar Admin</p>
          </div>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <aside
        className="d-none d-md-flex flex-column justify-content-between shadow-sm position-fixed top-0 start-0 h-100 bg-white"
        style={{
          width: '180px',
          zIndex: 10,
          borderRight: '1px solid #eee',
          marginRight: '66px',
        }}
      >
        {/* Header */}
        <div className="p-4 border-bottom">
          <h5 className="fw-bold text-primary m-0">Admin Panel</h5>
        </div>

        {/* Nav */}
        <nav className="nav flex-column p-3 gap-1">
          {navLinks.map(({ href, label }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`nav-link rounded py-2 px-3 ${
                  isActive
                    ? 'bg-primary text-white fw-semibold shadow-sm'
                    : 'text-secondary'
                }`}
                style={{
                  transition: '0.2s ease',
                }}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-3">
          <p className="text-muted text-center small mb-0">
            © {new Date().getFullYear()} Ayam Bakar Admin
          </p>
        </div>
      </aside>

      {/* Mobile Topbar (shows brand + hamburger) */}
      <div
        className="d-md-none position-fixed top-0 start-0 left-0 w-100 bg-white shadow-sm"
        style={{ zIndex: 110, height: 56, marginBottom: 20 }}
      >
        <div className="d-flex align-items-center justify-content-between px-3 h-100">
          <div className="d-flex align-items-center">
            <span className="fw-semibold">Admin Panel</span>
          </div>
          <button
            className="btn btn-light border"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#sidebarOffcanvas"
            aria-controls="sidebarOffcanvas"
          >
            <i className="bi bi-list fs-4"></i>
          </button>
        </div>
      </div>
    </>
  );
}
