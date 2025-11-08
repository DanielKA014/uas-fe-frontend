'use client';
import Image from 'next/image';
import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaInstagram, FaWhatsapp } from 'react-icons/fa';
import { SiGojek, SiGrab, SiShopee } from 'react-icons/si';

export default function Footer() {
    return (
        <footer
            style={{
                backgroundColor: '#3a3a3a',
                color: 'white',
                padding: '50px 0 20px',
            }}
            className='text-center'
        >
            <Container>
                {/* Logo dan Nama */}
                <div className="mb-4 d-flex justify-content-center align-items-center gap-3">
                    <Image
                        src="/images/logo.png"
                        alt="Ayam Bakar Ojolali Logo"
                        width={60}
                        height={60}
                        className="mb-2"
                    />
                    <h5 className="fw-semibold fst-italic fs-3">Ayam Bakar Ojolali</h5>
                </div>

                {/* Social Media dan E-Commerce */}
                <div className='d-flex justify-content-center gap-5 mb-4 flex-wrap'>
                    <div>
                        <h6 className='mb-3'>Social Media</h6>
                        <div className='d-flex justify-content-center gap-3'>
                            <a 
                                href="https://www.instagram.com/ayam_bakar_ojolali_tomang/?hl=id"
                                target="_blank"
                                rel="noopener noreferrer"
                                className='text-white fs-4'
                            >
                                <FaInstagram />
                            </a>

                            <a 
                                href="https://api.whatsapp.com/send?phone=628174807745"
                                target="_blank"
                                rel="noopener noreferrer"
                                className='text-white fs-4'
                            
                            >
                                <FaWhatsapp />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h6 className='mb-3'>Pesan Online</h6>
                        <div className='d-flex justify-content-center gap-3'>
                            <a 
                                href="https://gofood.co.id/jakarta/restaurant/ayam-bakar-ojolali-tomang-293aa337-09e8-41a0-bba8-7284f8226bb2"
                                target="_blank"
                                rel="noopener noreferrer"
                                className='text-white fs-4'
                            >
                                <SiGojek color="#00B14F" size={30} />
                            </a>
                            <a 
                                href="#"
                                className='mx-2'
                                title="GrabFood (Available in App)"
                            >
                                <SiGrab color="#00B14F" size={30} />
                            </a>
                            <a 
                                href="#"
                                className='mx-2'
                                title="ShopeeFood (Available in App)"
                            >
                                <SiShopee color="#EE4D2D" size={30} />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bagian Divider */}
                <hr
                    style={{
                        borderColor: 'rgba{255,255,255,0,2}',
                        width: '80%',
                        margin: '20px auto',
                    }}
                />

                {/* Alamat */}
                <div className="mb-3">
                    <h6 className="mb-2">Alamat</h6>
                    <p className="mb-0">
                        Jl. Tanjung Gedong No.24 6, RT.6/RW.8, Tomang, Kec. Grogol petamburan, Kota Jakarta Barat, Daerah Khusus Ibukota Jakarta  
                    </p>
                </div>

                {/* Divider */}
                <hr
                    style={{
                        borderColor: 'rgba{255,255,255,0,2}',
                        width: '80%',
                        margin: '20px auto',
                    }}
                />

                {/* Hak Cipta */}
                <p className="small mb-0">&copy; 2025 Ayam Bakar Ojolali. All rights reserved.</p>
            </Container>
        </footer>
    );
}