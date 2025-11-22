'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import 'bootstrap/dist/css/bootstrap.min.css';

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();


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
      >
        <div className="offcanvas-header border-bottom">
          <h5 className="fw-semibold">Admin Panel</h5>
          <button type="button" className="btn-close" data-bs-dismiss="offcanvas"></button>
        </div>

        <div className="offcanvas-body d-flex flex-column justify-content-between">
          <nav className="nav flex-column">
            {navLinks.map(({ href, label }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`nav-link rounded py-2 px-2 ${
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

      {/* Mobile Toggle */}
      <button
        className="btn btn-light border d-md-none position-fixed top-0 start-0 m-2 shadow-sm"
        type="button"
        data-bs-toggle="offcanvas"
        data-bs-target="#sidebarOffcanvas"
        aria-controls="sidebarOffcanvas"
      >
        <i className="bi bi-list fs-4"></i>
      </button>
    </>
  );
}
