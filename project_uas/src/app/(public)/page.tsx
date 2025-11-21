'use client';
import Image from "next/image";
import { Button, Container, Row, Col, Card } from "react-bootstrap";
import { useRouter } from "next/navigation";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaDrumstickBite, FaGlassWhiskey, FaCube } from "react-icons/fa";
import { GiTomato } from "react-icons/gi";
import "./menu/page.css";

export default function Home() {
  const router = useRouter();

  const handleCategoryClick = (category: string) => {
    router.push(`/menu?category=${encodeURIComponent(category)}`);
  };
  return (
    <main id="home">
      {/* Hero section */}
      <section className="position-relative text-center text-dark">
        <Image
          src="/images/hero.png"
          alt="Hero Image"
          fill
          className="object-cover"
          style={{ zIndex: -1, opacity: 1 }}
          priority
        />
        <div className="d-flex flex-column justify-content-center align-items-center vh-100">
          <h1 className="fw-bold display-4 mb-3">
            Best Food for your taste
          </h1>
          <p className="lead mb-4">
            Discover delectable cuisine and unforgetitable moments in our welcoming, culinary haven.
          </p>
          <Button
            variant="outline-secondary"
            size="lg"
            className="rounded-pill px-4 py-2"
            onClick={() => router.push('/menu')}
          >
            Explore Menu
          </Button>
        </div>  
      </section>

      {/* About Section */}
      <section className="bg-white text-center" style={{padding: "100px 0"}}>
        <Container>
          <Row className="align-items-center text-md-start text-center">
            {/* Left side: Image */}
            <Col md={6} className="mb-4 mb-md-0 text-center">
              <Image
                src="/images/page.jpg"
                alt="About Us Image"
                width={400}
                height={400}
                className="img-fluid rounded"
              />
            </Col>

            {/* Right side: Text */}
            <Col md={6}>
              <h2 className="fw-bold mb-4">
                We provide healthy food for your family & friends.
              </h2>
              <p className="text-muted mb-4">
                It all began in 2001 beside Walikota Lama, where our founders started with a small grill,
                a family recipe, and a big dream. Through hard times and simple beginnings, they served
                freshly grilled chicken with warmth that kept customers coming back.
                <br /><br />
                In 2003, we moved beside Universitas Tarumanagara (UNTAR), where our little stall grew
                into a local favorite. Even today, we stay true to our roots — grilling over open flames
                and serving each dish with heart, passion, and family spirit.
              </p>
              <a href="/about" className="btn btn-outline-danger rounded-pill btn-lg">
                Learn More
              </a>
            </Col>
          </Row>
        </Container>
      </section>


      {/* Menu section */}
      <section className="bg-light text-center vh-70" style={{padding: "100px 0"}}>
        <Container>
          <h2 className="fw-bold mb-5 mt-2">
            Browse Our Menu
          </h2>
          <Row className="justify-content-center g-4">
            {/* Main Dish Card */}
            <Col md={3}>
              <Card className="border-0 h-100 card-hover-shadow">
                <Card.Body>
                  <FaDrumstickBite size={40} className="text-danger mb-3" />
                  <Card.Title className="fw-bold mb-2">Main Dish</Card.Title>
                  <Card.Text className="text-muted">
                    Savor our signature grilled chicken, marinated to perfection and served with delicious sides.
                  </Card.Text>
                  <Button 
                    variant="outline-danger" 
                    className="rounded-pill"
                    onClick={() => handleCategoryClick('Main Dish')}
                  >
                    Explore Menu
                  </Button>
                </Card.Body>
              </Card>
            </Col>
            {/* Beverage Dish Card */}
            <Col md={3}>
              <Card className="border-0 card-hover-shadow h-100">
                <Card.Body>
                  <FaGlassWhiskey size={40} className="mb-3 text-danger" />
                  <Card.Title>Drinks</Card.Title>
                  <Card.Text className="text-muted">
                    In the new era of technology we look to the future with
                    certainty and pride for our life.
                  </Card.Text>
                  <Button 
                    variant="outline-danger" 
                    className="rounded-pill"
                    onClick={() => handleCategoryClick('Beverages')}
                  >
                    Explore Menu
                  </Button>
                </Card.Body>
              </Card>
            </Col>
            {/* Vegetable Dish Card */}
            <Col md={3}>
              <Card className="border-0 card-hover-shadow h-100">
                <Card.Body>
                  <GiTomato size={40} className="mb-3 text-danger" />
                  <Card.Title>Vegetables</Card.Title>
                  <Card.Text className="text-muted">
                    In the new era of technology we look to the future with
                    certainty and pride for our life.
                  </Card.Text>
                  <Button 
                    variant="outline-danger" 
                    className="rounded-pill"
                    onClick={() => handleCategoryClick('Vegetables')}
                  >
                    Explore Menu
                  </Button>
                </Card.Body>
              </Card>
            </Col>
            {/* Add Ons Dish Card */}
            <Col md={3}>
              <Card className="border-0 card-hover-shadow h-100">
                <Card.Body>
                  <FaCube size={40} className="mb-3 text-danger" />
                  <Card.Title>Add Ons</Card.Title>
                  <Card.Text className="text-muted">
                    In the new era of technology we look to the future with
                    certainty and pride for our life.
                  </Card.Text>
                  <Button 
                    variant="outline-danger" 
                    className="rounded-pill"
                    onClick={() => handleCategoryClick('Add-on')}
                  >
                    Explore Menu
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      
    </main>
  );
}
