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

export default function MenuItem() {
  const [filter, setFilter] = useState<String>("All");
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [rating, setRating] = useState<number>(0);
  const [hover, setHover] = useState<number>(0);
  const [newRating, setNewRating] = useState<number>(0);
  const [comments, setComments] = useState<{ text: string; rating: number }[]>([
    { text: "The chicken was juicy and flavorful!", rating: 5 },
    { text: "Loved the sambal!", rating: 4 },
    { text: "Good portion and worth the price.", rating: 4 },
  ]);

  const [newComment, setNewComment] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
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

  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  const handleCardClick = (item: MenuItem) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false)
    setSelectedItem(null);
  };

  const filteredMenu =
    filter === "All"
      ? menuItems
      : menuItems.filter((item) => item.category === filter);

  const lastIndex = currentPage * itemsPerPage; 
  const firstIndex = lastIndex - itemsPerPage;
  const currentItems = filteredMenu.slice(firstIndex, lastIndex);
  const totalPages = Math.ceil(filteredMenu.length / itemsPerPage);

  const handleAddComment = () => {
    if (newComment.trim() && newRating > 0) {
      setComments([...comments, { text: newComment, rating: newRating }]);
      setNewComment("");
      setNewRating(0);
    }
  };

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
                  <h5 className="fw-bold text-danger">{selectedItem.price}</h5>
                </div>

                <div className="col-md-7">
                  {/* Average Rating */}
                  <div className="border p-3 rounded mb-3">
                    <h6 className="fw-bold mb-2">Average Rating</h6>
                    <div className="d-flex align-items-center mb-2">
                      {[...Array(5)].map((_, index) => {
                        const avg = 4.3;
                        const starValue = index + 1;
                        const isHalf =
                          avg - starValue >= -0.5 && avg - starValue < 0;

                        return (
                          <span
                            key={index}
                            className="fs-4"
                            style={{
                              color:
                                starValue <= Math.floor(avg)
                                  ? "#ffc107"
                                  : isHalf
                                  ? "linear-gradient(90deg, #ffc107 50%, #e4e5e9 50%)"
                                  : "#e4e5e9",
                            }}
                          >
                            ★
                          </span>
                        );
                      })}
                    </div>
                    <small className="text-muted">120 people rated this</small>
                  </div>

                  {/* Comments */}
                  <div className="border p-3 rounded">
                    <h6 className="fw-bold mb-3">Customer Comments</h6>
                    <div
                      className="mb-3"
                      style={{ maxHeight: "150px", overflowY: "auto" }}
                    >
                      {comments.map((cmt, i) => (
                        <div key={i} className="mb-2 border-bottom pb-2">
                          <p className="mb-1">{cmt.text}</p>
                          <FaStar className="text-warning me-1" />
                          <small className="text-muted">
                            {cmt.rating}/5
                          </small>
                        </div>
                      ))}
                    </div>

                    {/* Add comment */}
                    <div className="d-flex flex-column flex-sm-row gap-2">
                      <div className="d-flex align-items-center mb-2 mb-sm-0">
                        {[...Array(5)].map((_, index) => {
                          const starValue = index + 1;
                          return (
                            <span
                              key={index}
                              className="fs-5 me-1"
                              style={{
                                cursor: "pointer",
                                color:
                                  starValue <= (hover || newRating)
                                    ? "#ffc107"
                                    : "#919191ff",
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

                      <div className="d-flex flex-grow-1">
                        <input
                          type="text"
                          className="form-control me-2"
                          placeholder="Write your comment..."
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                        />
                        <Button variant="danger" onClick={handleAddComment}>
                          Send
                        </Button>
                      </div>
                    </div>
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