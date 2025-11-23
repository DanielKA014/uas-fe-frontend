"use client";
import "bootstrap/dist/css/bootstrap.min.css";
import Image from "next/image";
import React from 'react'
import { Col, Container, Row } from "react-bootstrap";
import "./page.css";

const page = () => {
  return (
    <Container className="py-5 px-3">
      <Row className="align-items-center text-md-start text-center g-4">

        {/* Left side: Image */}
        <Col md={6} className="text-center">
          <Image
            src="/images/ayam_bakar_history.jpeg"
            alt="About Us Image"
            width={512}
            height={512}
            className="img-fluid rounded"
          />
        </Col>

        {/* Right side: Text */}
        <Col md={6} className="history-text">
          <h1 className="fs-1 fw-bold mb-4">Our History Progress</h1>
          <p style={{ lineHeight: "1.75", textAlign: "justify"}}>
            Semuanya berawal pada tahun 2001, pada saat warung makan ini masih berlokasi di samping eks kantor walikota Jakarta Barat lama (sudah digusur).
            Warung ini berawal dengan tempat yang kecil. Meskipun demikian, kami tetap berupaya menyajikan hidangan yang terbaik sedari awal hingga sekarang
            dengan bumbu-bumbu kami yang khas sekali.
            <br/><br/>
            Banyak lika-liku yang harus dihadapi dalam menjalankan usaha ini pada tahun awal berdirinya warung ini, seperti keterbatasan tempat dan upaya untuk
            bertahan dari persaingan. Namun, dengan tekad dan kerja keras, warung ini terus berkembang hingga menjadi cukup terkenal sekarang.
            <br/><br/>
            Dua tahun setelah memulai usaha ini, kami memutuskan untuk pindah lokasi dari eks kantor walikota lama ke Jalan Tanjung Gedong di samping gedung 
            Universitas Tarumanagara (Untar) 1. Keputusan ini adalah salah satu keputusan terbaik yang kami lakukan, warung ini berkembang semakin pesat dan semakin
            semakin ramai, dengan mayoritas pelanggan kami adalah kalangan mahasiswa. Oleh karena inilah kami menyediakan hidangan dengan harga yang menyesuaikan 
            kantong pelanggan kami.
            <br/><br/>
            Hingga sekarang, kami tetap mempertahankan resep yang sudah digunakan sejak berdirinya warung ini. Selain itu, kami menyediakan hidangan yang lezat serta
            terjangkau bagi semua kalangan.
          </p>
        </Col>
      </Row>
    </Container>
  )
}

export default page
