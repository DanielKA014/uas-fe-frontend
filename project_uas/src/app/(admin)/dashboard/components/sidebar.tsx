'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Sidebar() {
  const pathname = usePathname();

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/dashboard/menu', label: 'Control Menu' },
  ];

  return (
    <>
      {/* Mobile Offcanvas Sidebar */}
      <div
        className="offcanvas offcanvas-start d-md-none"
        tabIndex={-1}
        id="sidebarOffcanvas"
        aria-labelledby="sidebarOffcanvasLabel"
      >
        <div className="offcanvas-header bg-white border-bottom">
          <h5 className="offcanvas-title" id="sidebarOffcanvasLabel">
            Admin Panel
          </h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body d-flex flex-column justify-content-between">
          <nav className="nav flex-column">
            {navLinks.map(({ href, label }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`nav-link ${
                    isActive ? 'fw-semibold text-primary' : 'text-dark'
                  }`}
                  data-bs-dismiss="offcanvas"
                >
                  {label}
                </Link>
              );
            })}
          </nav>
          <p className="text-muted text-center small mt-3">
            © 2025 Ayam Bakar Admin
          </p>
        </div>
      </div>

      {/* Sidebar */}
      <aside
        className="d-none d-md-flex flex-column justify-content-between bg-white shadow position-fixed top-0 start-0 h-100"
        style={{
          width: '180px',
          zIndex: 1030,
          transition: 'width 0.3s ease',
        }}
      >
        {/* Header */}
        <div className="p-3 border-bottom">
          <h5 className="mb-0">Admin Panel</h5>
        </div>

        {/* Nav */}
        <nav className="nav flex-column p-3">
          {navLinks.map(({ href, label }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`nav-link rounded py-2 ${
                  isActive ? 'bg-light fw-semibold text-primary' : 'text-muted'
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <p className="text-muted text-center small p-3 mb-0">
          © 2025 Ayam Bakar Admin
        </p>
      </aside>

      {/* === Mobile Toggle Button === */}
      <button
        className="btn btn-outline-secondary d-md-none position-fixed top-0 start-0 m-2"
        type="button"
        data-bs-toggle="offcanvas"
        data-bs-target="#sidebarOffcanvas"
        aria-controls="sidebarOffcanvas"
      >
        <i className="bi bi-list"></i>
      </button>
    </>
  );
}
