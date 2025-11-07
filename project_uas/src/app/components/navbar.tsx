'use client';
import { use } from 'react';
import { Button, Container, Nav, Navbar } from 'react-bootstrap';
import Link from 'next/link';
import 'bootstrap/dist/css/bootstrap.min.css';
import Image from 'next/image';

function NavbarComponent() {
    return (
        <Navbar bg="dark" expand="lg" variant="dark" style={{backgroundColor:'#3a3a3a'}} className='py-3 shadow-sm'>
            <Container fluid className='px-4'>
                <Link
                    href="/"
                    className="d-flex align-items-center text-white text-decoration-none"
                    >
                    <Image
                        src="/images/logo.png"
                        alt="Ayam Bakar Ojolali Logo"
                        width={60}
                        height={60}
                        className="me-2"
                    />
                    <span className="fw-semibold fs-2 fst-italic">Ayam Bakar Ojolali</span>
                </Link>
                <Navbar.Toggle aria-controls="navbarScroll" className='border-0' />
                <Navbar.Collapse id="navbarScroll">
                    <Nav
                        className="mx-auto my-2 my-lg-0"
                        style={{ maxHeight: '100px' }}
                        navbarScroll
                    >
                        <Nav.Link href="#home" className="nav-link text-white mx-2">Home</Nav.Link>
                        <Nav.Link href="#about" className="nav-link text-white mx-2">About</Nav.Link>
                        <Nav.Link href="#menu" className="nav-link text-white mx-2">Menu</Nav.Link>
                        <Nav.Link href="#reviews" className="nav-link text-white mx-2">Reviews</Nav.Link>
                        <Nav.Link href="#contact" className="nav-link text-white mx-2">Contact</Nav.Link>
                    </Nav>
                    <Link href="/auth/login">
                        <Button variant="outline-success" className="ms-lg-3 px-4">Login</Button>
                    </Link>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavbarComponent;