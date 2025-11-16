"use client";
import { useState, useEffect, useCallback } from "react";
import { Container, Row, Col, Button, Modal, Form } from "react-bootstrap";
import { FaStar } from "react-icons/fa";
import Image from "next/image";
import "./page.css";

export default function ReviewPage() {
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [hover, setHover] = useState(0);
  const [selectedBadges, setSelectedBadges] = useState<string[]>([]);

  type ReviewUI = {
    name: string;
    rating: number;
    text: string;
    badges: string[];
  };

  const [reviews, setReviews] = useState<ReviewUI[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const badges = [
    {
      name: "rasa-enak",
      icon: (
        <Image
          src="/images/review/rasa-enak.webp"
          alt="Rasa Enak"
          width={40}
          height={40}
        />
      ),
      count: 80,
    },
    {
      name: "porsi-pas",
      icon: (
        <Image
          src="/images/review/porsi-pas.webp"
          alt="Porsi Pas"
          width={40}
          height={40}
        />
      ),
      count: 70,
    },
    {
      name: "bersih",
      icon: (
        <Image
          src="/images/review/bersih.webp"
          alt="Porsi Pas"
          width={40}
          height={40}
        />
      ),
      count: 60,
    },
  ];

  // transform backend review row to frontend shape
  const mapServerToUI = (row: any): ReviewUI => {
    return {
      name: row.user_id ? `User ${row.user_id}` : "Anonymous",
      rating: row.stars ?? 0,
      text: row.comment ?? "",
      badges: row.overview ? [row.overview] : [],
    };
  };

  const fetchReviews = useCallback(async (page = 1, limit = 20) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`http://localhost:3001/api/restaurant-reviews/?page=${page}&limit=${limit}`);
      if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setReviews(data.map(mapServerToUI));
      } else {
        setError('Unexpected response from server');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleBadgeSelect = (badgeName: string) => {
    if (selectedBadges.includes(badgeName)) {
      setSelectedBadges(selectedBadges.filter((b) => b !== badgeName));
    } else {
      setSelectedBadges([...selectedBadges, badgeName]);
    }
  };

  const handleAddComment = async () => {
    if (newRating <= 0 || newComment.trim() === "") return;

    const overviewValue = selectedBadges.length > 0 ? selectedBadges[0] : 'lainnya';

    const payload = {
      stars: newRating,
      comment: newComment,
      overview: overviewValue,
    };

    try {
      const res = await fetch('http://localhost:3001/api/restaurant-reviews/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || `Failed to post review: ${res.status}`);
      }

      const created = await res.json();
      setReviews(prev => [mapServerToUI(created), ...prev]);
      setNewRating(0);
      setNewComment('');
      setSelectedBadges([]);
      setShowModal(false);
    } catch (err: any) {
      alert(err.message || 'Failed to submit review');
    }
  };

  const averageRating =
    reviews.reduce((acc, cur) => acc + cur.rating, 0) / reviews.length;

  const filteredReviews =
    selectedRating !== null
      ? reviews.filter((r) => r.rating === selectedRating)
      : reviews;

  return (
    <Container className="py-5">
      {/* Average Rating Section */}
      <Row className="align-items-center mb-4">
        <Col md={6}>
          <h2 className="fw-bold">{averageRating.toFixed(1)}</h2>
          <div className="fs-3 text-warning">
            {[...Array(5)].map((_, i: number) => (
              <FaStar
                key={i}
                color={i < Math.round(averageRating) ? "#ffc107" : "#e4e5e9"}
              />
            ))}
          </div>
          <p className="text-muted mt-1">1rb+ rating</p>
          <p className="text-muted mt-1">Recent Rating</p>
          <div className="d-flex flex-wrap gap-2">
            {[4, 4, 5, 5, 5, 5, 5].map((r: number, i: number) => (
              <div
                key={i}
                className="d-flex align-items-center border rounded-pill px-3 py-1 bg-light"
              >
                <FaStar color="#ffc107" className="me-1" /> {r.toFixed(1)}
              </div>
            ))}
          </div>
        </Col>

        {/* Badges */}
        <Col
          md={6}
          className="d-flex justify-content-center gap-3 mt-4 mt-md-0"
        >
          {badges.map((b: { name: string; icon: any; count: number }) => (
            <div
              key={b.name}
              className="text-center border rounded p-3"
              style={{ width: 120 }}
            >
              {b.icon}
              <h6 className="mt-2">{b.name}</h6>
              <small className="text-muted">{b.count}+ rating</small>
            </div>
          ))}
        </Col>
      </Row>

      {/* Filter and Review List */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="fw-bold">Apa kata pelanggan</h5>
        <div className="d-flex gap-2">
          {[5, 4, 3, 2, 1].map((r) => (
            <Button
              key={r}
              variant={selectedRating === r ? "danger" : "outline-danger"}
              size="sm"
              onClick={() => setSelectedRating(selectedRating === r ? null : r)}
            >
              {r}★
            </Button>
          ))}
        </div>
      </div>

      {filteredReviews.map((review, idx) => (
        <div
          key={idx}
          className="p-3 mb-3 rounded"
          style={{ backgroundColor: "#fff7f7" }}
        >
          <strong>{review.name}</strong>
          <div className="text-warning mb-1">
            {[...Array(5)].map((_, i: number) => (
              <FaStar
                key={i}
                size={16}
                color={i < review.rating ? "#ffc107" : "#e4e5e9"}
              />
            ))}
          </div>
          <p className="mb-1">{review.text}</p>
          <div className="d-flex gap-2">
            {review.badges.map((b: string, i: number) => (
              <span key={i} className="badge bg-light text-dark border">
                {b}
              </span>
            ))}
          </div>
        </div>
      ))}

      <div className="text-center mt-4">
        <Button variant="danger" onClick={() => setShowModal(true)}>
          + Add Review
        </Button>
      </div>

      {/* Add Review Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Review</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center mb-3">
            {[...Array(5)].map((_, i: number) => {
              const starValue = i + 1;
              return (
                <FaStar
                  key={i}
                  size={30}
                  style={{ cursor: "pointer" }}
                  color={
                    starValue <= (hover || newRating) ? "#ffc107" : "#e4e5e9"
                  }
                  onClick={() => setNewRating(starValue)}
                  onMouseEnter={() => setHover(starValue)}
                  onMouseLeave={() => setHover(0)}
                />
              );
            })}
          </div>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Write your comment..."
            className="mb-3"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            {badges.map((b) => (
              <Button
                key={b.name}
                variant={
                  selectedBadges.includes(b.name)
                    ? "success"
                    : "outline-success"
                }
                className="d-flex align-items-center gap-2"
                onClick={() => handleBadgeSelect(b.name)}
              >
                {b.icon}
                {b.name}
              </Button>
            ))}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleAddComment}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}