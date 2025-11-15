"use client";
import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaStar } from "react-icons/fa";
import { Modal, Button } from "react-bootstrap";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./page.css";

interface MenuItem {
  id: number;
  name: string;
  price: string;
  description: string;
  category: "Main Dish" | "Beverages" | "Vegetables" | "Add-on";
  imageUrl: string;
}

interface Review {
  comment_id: number;
  stars: number;
  comment: string;
  food_id: number;
  created_at: string;
}

export default function MenuItem() {
  const [filter, setFilter] = useState<String>("All");
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newRating, setNewRating] = useState<number>(0);
  const [hover, setHover] = useState<number>(0);
  const [newComment, setNewComment] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const itemsPerPage = 8;

  const formatCategory = (cat: string) => {
    switch (cat.toLowerCase()) { 
      case "main-dish":
      case "main dish":
        return "Main Dish";
      case "beverages":
        return "Beverages";
      case "add-on":
      case "add-on":
        return "Add-on";
      case "vegetables":
        return "Vegetables";
      default:
        return cat;
    }
  };

  // Fetch menu items
  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/foods/?limit=100&page=1");
          
        const data = await response.json();

        const formatted = data.result.map((item: any) => ({
          id: item.item_id,
          name: item.item_name,
          price: item.dine_in_price,
          description: item.description,
          category: formatCategory(item.category),
          imageUrl: item.image_data_url,
        }));

        setMenuItems(formatted);
      } catch (error) {
        console.error("Error fetching foods:", error);
      }
    };

    fetchFoods();
  }, []);

  // Fetch reviews when modal opens
  const fetchReviews = async (foodId: number) => {
    try {
      setLoadingReviews(true);
      const response = await fetch(`http://localhost:3001/api/food-reviews/${foodId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch reviews');
      }
      
      const data = await response.json();
      setReviews(data.reviews || data || []);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setReviews([]);
    } finally {
      setLoadingReviews(false);
    }
  };

  const handleCardClick = async (item: MenuItem) => {
    setSelectedItem(item);
    setShowModal(true);
    await fetchReviews(item.id);
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedItem(null);
    setReviews([]);
    setNewRating(0);
    setNewComment("");
  };

  const handleAddReview = async () => {
    if (!selectedItem || !newComment.trim() || newRating === 0) {
      alert("Please provide both rating and comment");
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/api/food-reviews/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          stars: newRating,
          comment: newComment,
          food_id: selectedItem.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add review");
      }

      const newReview = await response.json();
      
      // Add new review to the list
      setReviews(prev => [newReview, ...prev]);
      setNewComment("");
      setNewRating(0);
      alert("Review added successfully!");
    } catch (error) {
      console.error("Error adding review:", error);
      alert("Failed to add review");
    }
  };

  // Calculate average rating
  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + review.stars, 0);
    return total / reviews.length;
  };

  const filteredMenu =
    filter === "All"
      ? menuItems
      : menuItems.filter((item) => item.category === filter);

  const lastIndex = currentPage * itemsPerPage; 
  const firstIndex = lastIndex - itemsPerPage;
  const currentItems = filteredMenu.slice(firstIndex, lastIndex);
  const totalPages = Math.ceil(filteredMenu.length / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  const averageRating = calculateAverageRating();
  const totalRatings = reviews.length;

  return (
    <div className="container py-5" id="menu">
      <div className="text-center mb-4">
        <h1 className="fw-bold">Our Menu</h1>
        <p className="text-muted">
          Savor the smoky flavor of perfection — from juicy grilled chicken to
          delicious sides and refreshing drinks.
        </p>
      </div>

      {/* Category */}
      <div className="d-flex justify-content-center gap-3 mb-5">
        {["All", "Main Dish", "Beverages", "Vegetables", "Add-on"].map(
          (categories) => (
            <button
              key={categories}
              className={`btn rounded-pill btn-hover-shadow ${
                filter === categories
                  ? "btn-danger text-white"
                  : "btn-outline-secondary"
              }`}
              onClick={() => setFilter(categories)}
            >
              {categories}
            </button>
          )
        )}
      </div>

      {/* Menu Card */}
      <div className="row g-4">
        {currentItems.map((item) => (
          <div
            className="col-12 col-sm-6 col-md-4 col-lg-3"
            key={item.id}
            onClick={() => handleCardClick(item)}
            style={{ cursor: "pointer" }}
          >
            <div className="card h-100 card-hover-shadow">
              <img
                src={item.imageUrl}
                className="card-img-top"
                alt={item.name}
                style={{ height: "200px", objectFit: "cover" }}
              />
              <div className="card-body d-flex flex-column">
                <h6 className="fw-bold text-danger fs-4 text-center">
                  RP. {item.price}
                </h6>
                <h5 className="card-title text-center fs-5">{item.name}</h5>
                <p className="card-text text-muted small text-truncate-2">
                  {item.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {filteredMenu.length > 0 && totalPages > 0 && ( 
        <div className="d-flex justify-content-center mt-4">
          <div className="btn-group">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                className={`btn ${
                  currentPage === i + 1
                    ? "btn-danger text-white"
                    : "btn-outline-secondary"
                }`}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Modal */}
      <Modal
        show={showModal}
        onHide={handleClose}
        centered
        size="lg"
      >
        {selectedItem && (
          <>
            <Modal.Header closeButton>
              <Modal.Title>{selectedItem.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="row">
                <div className="col-md-5 text-center">
                  <img
                    src={selectedItem.imageUrl}
                    alt={selectedItem.name}
                    className="img-fluid rounded mb-3"
                  />
                  <h5 className="fw-bold text-danger">RP. {selectedItem.price}</h5>
                  <p className="text-muted small">{selectedItem.description}</p>
                </div>

                <div className="col-md-7">
                  {/* Average Rating */}
                  <div className="border p-3 rounded mb-3">
                    <h6 className="fw-bold mb-2">Average Rating</h6>
                    <div className="d-flex align-items-center mb-2">
                      {[...Array(5)].map((_, index) => {
                        const starValue = index + 1;
                        const isHalf = averageRating - starValue >= -0.5 && averageRating - starValue < 0;

                        return (
                          <span
                            key={index}
                            className="fs-4"
                            style={{
                              color: starValue <= Math.floor(averageRating)
                                ? "#ffc107"
                                : isHalf
                                ? "#ffc107" // You can implement half stars with CSS
                                : "#e4e5e9",
                            }}
                          >
                            ★
                          </span>
                        );
                      })}
                      <span className="ms-2 fw-bold">
                        {averageRating.toFixed(1)}/5
                      </span>
                    </div>
                    <small className="text-muted">
                      {totalRatings} {totalRatings === 1 ? 'person' : 'people'} rated this
                    </small>
                  </div>

                  {/* Reviews */}
                  <div className="border p-3 rounded">
                    <h6 className="fw-bold mb-3">Customer Reviews</h6>
                    
                    {loadingReviews ? (
                      <div className="text-center py-3">
                        <div className="spinner-border text-primary" role="status">
                          <span className="visually-hidden">Loading reviews...</span>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div
                          className="mb-3"
                          style={{ maxHeight: "150px", overflowY: "auto" }}
                        >
                          {reviews.length === 0 ? (
                            <p className="text-muted text-center">No reviews yet. Be the first to review!</p>
                          ) : (
                            reviews.map((review) => (
                              <div key={review.comment_id} className="mb-2 border-bottom pb-2">
                                <div className="d-flex align-items-center mb-1">
                                  {[...Array(5)].map((_, index) => (
                                    <FaStar 
                                      key={index}
                                      className={index < review.stars ? "text-warning" : "text-muted"}
                                      size={14}
                                    />
                                  ))}
                                  <small className="text-muted ms-2">
                                    {review.stars}/5
                                  </small>
                                </div>
                                <p className="mb-1 small">{review.comment}</p>
                                <small className="text-muted">
                                  {new Date(review.created_at).toLocaleDateString()}
                                </small>
                              </div>
                            ))
                          )}
                        </div>

                        {/* Add review */}
                        <div className="d-flex flex-column gap-2">
                          <div className="d-flex align-items-center">
                            <span className="me-2 small">Your rating:</span>
                            {[...Array(5)].map((_, index) => {
                              const starValue = index + 1;
                              return (
                                <span
                                  key={index}
                                  className="fs-5 me-1"
                                  style={{
                                    cursor: "pointer",
                                    color: starValue <= (hover || newRating) ? "#ffc107" : "#919191ff",
                                  }}
                                  onClick={() => setNewRating(starValue)}
                                  onMouseEnter={() => setHover(starValue)}
                                  onMouseLeave={() => setHover(0)}
                                >
                                  ★
                                </span>
                              );
                            })}
                          </div>

                          <div className="d-flex gap-2">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Write your review..."
                              value={newComment}
                              onChange={(e) => setNewComment(e.target.value)}
                            />
                            <Button 
                              variant="danger" 
                              onClick={handleAddReview}
                              disabled={!newComment.trim() || newRating === 0}
                            >
                              Send
                            </Button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </Modal.Body>
          </>
        )}
      </Modal>
    </div>
  );
}