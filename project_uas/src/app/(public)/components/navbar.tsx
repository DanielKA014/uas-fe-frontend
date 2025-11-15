'use client';
import { Button, Container, Nav, Navbar } from 'react-bootstrap';
import Link from 'next/link';
import 'bootstrap/dist/css/bootstrap.min.css';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import '../../globals.css';

function NavbarComponent() {
    const pathname = usePathname();

    const navLinks = [
        { href: '/', label: 'Home' },
        { href: '/about', label: 'About' },
        { href: '/menu', label: 'Menu'},
        { href: '/reviews', label: 'Reviews'}
    ];
    return (
        <Navbar 
            bg="dark" 
            expand="lg" 
            variant="dark" 
            fixed='top'
            style={{backgroundColor:'#3a3a3a', padding: 0, margin: 0}} 
            className='py-2 shadow-sm m-0 border-0'
        >
            <Container fluid className='px-3'>
                <Link
                    href="/"
                    className="d-flex align-items-center text-white text-decoration-none"
                    >
                    <Image
                        src="/images/logo.png"
                        alt="Ayam Bakar Ojolali Logo"
                        width={48}
                        height={48}
                        className="me-2"
                    />
                    <span className="fw-semibold fs-2 fst-italic">
                        Ayam Bakar Ojolali
                    </span>
                </Link>
                <Navbar.Toggle aria-controls="navbarScroll" className='border-0' />
                <Navbar.Collapse id="navbarScroll">
                    <Nav
                        className="mx-auto my-2 my-lg-0"
                        style={{ maxHeight: '100px' }}
                        navbarScroll
                    >
                        {navLinks.map(({ href, label }) => {
                            const isActive = pathname === href;
                            return (
                                <Nav.Link
                                    key={href}
                                    href={href}
                                    className={`nav-link rounded py-1 px-3 ${
                                    isActive ? 'fw-semibold text-dark mx-2 bg-light rounded-pill    ' : 'text-white mx-2'
                                    }`}
                                >
                                    {label}
                                </Nav.Link>
                            );
                        })}
                    </Nav>
                    <Link href="/login">
                        <Button variant="outline-success" className="ms-lg-3 px-4">Login</Button>
                    </Link>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavbarComponent;