"use client";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react"; 
import { FaStar, FaStarHalfAlt, FaRegStar, FaTimes } from "react-icons/fa";

// --- Tipe Data Frontend ---
type MenuItemType = {
  item_id: number;
  item_name: string;
  image_data_url: string;
  category: string;
  rating: number; 
  reviews: number; 
};

type FoodReview = {
  comment_id: number;
  stars: number;
  comment: string;
  // Tambahkan user_id atau username jika tersedia di skema DB
};

type RestaurantRating = {
    average: number;
    totalReviews: number;
}

// Tambahkan deklarasi Buffer Node.js secara eksplisit jika environment Next.js client component belum menginjeksikannya
declare const Buffer: any; 

const BASE_URL = "http://localhost:3001/api/foods";
const RESTAURANT_BASE_URL = "http://localhost:3001/api/restaurant-reviews"; // Asumsi route untuk restaurant review

export default function AdminHome() {
    // ... (State declarations remain the same) ...
    const [filter, setFilter] = useState("mostReviews");
    const [menuItems, setMenuItems] = useState<MenuItemType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [restaurantRating, setRestaurantRating] = useState<RestaurantRating>({ average: 0, totalReviews: 0 }); 

    const [showReviewModal, setShowReviewModal] = useState(false);
    const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItemType | null>(null);
    const [currentReviews, setCurrentReviews] = useState<FoodReview[]>([]);
    const [reviewLoading, setReviewLoading] = useState(false);
    const [reviewStarFilter, setReviewStarFilter] = useState<number | 'all'>('all');

    // --- 1. Fungsi Fetch Ulasan Menu Tertentu (Unchanged) ---
    const fetchMenuReviews = useCallback(async (itemId: number) => {
        setReviewLoading(true);
        setCurrentReviews([]);
        try {
            const res = await fetch(`${BASE_URL}/${itemId}/reviews?limit=100`);
            if (!res.ok) throw new Error(`Failed to fetch reviews: ${res.status}`);

            const data: FoodReview[] = await res.json();
            setCurrentReviews(data);
        } catch (err: any) {
            console.error(`Error fetching reviews for item ${itemId}:`, err);
        } finally {
            setReviewLoading(false);
        }
    }, []);

    // --- 2. Fungsi Fetch Rating Restoran (Unchanged) ---
    const fetchRestaurantRating = useCallback(async () => {
        try {
            const res = await fetch(`${RESTAURANT_BASE_URL}/rating-summary`); 
            if (!res.ok) throw new Error("Failed to fetch restaurant rating.");

            const data = await res.json();
            
            setRestaurantRating({
                average: parseFloat(data.average_rating) || 0,
                totalReviews: parseInt(data.total_reviews) || 0,
            });
        } catch (err) {
            console.error("Error fetching restaurant rating:", err);
        }
    }, []);


    // --- 3. Fungsi Fetch Semua Menu dan Ratingnya (DIPERBAIKI UNTUK GAMBAR) ---
    const fetchAllMenusWithRatings = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`${BASE_URL}?limit=100`);
            if (!res.ok) throw new Error(`Failed to fetch menus: ${res.status}`);

            const data = await res.json();
            const fetchedMenus = data.result || [];

            const menusWithActualRatings: MenuItemType[] = fetchedMenus.map((menu: any) => {
                // Backend already converts image_bytes to base64 and returns image_data_url
                let image_data_url = menu.image_data_url || '/images/makanan/default.jpg';

                return {
                    item_id: menu.item_id,
                    item_name: menu.item_name,
                    category: menu.category,
                    image_data_url: image_data_url,
                    rating: parseFloat(menu.average_rating) || 0, 
                    reviews: parseInt(menu.review_count) || 0,
                }
            });

            setMenuItems(menusWithActualRatings);
        } catch (err: any) {
            console.error("Error fetching menus:", err);
            setError("Failed to load menus or ratings.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAllMenusWithRatings();
        fetchRestaurantRating();
    }, [fetchAllMenusWithRatings, fetchRestaurantRating]); 

    // ... (sisa fungsi handleOpenReviewModal, handleCloseReviewModal, renderStars) ...
    
    const sorted =
    filter === "highestRated"
      ? [...menuItems].sort((a, b) => b.rating - a.rating)
      : [...menuItems].sort((a, b) => b.reviews - a.reviews);

    const handleOpenReviewModal = (item: MenuItemType) => {
        setSelectedMenuItem(item);
        setShowReviewModal(true);
        fetchMenuReviews(item.item_id); 
    };

    const handleCloseReviewModal = () => {
        setShowReviewModal(false);
        setSelectedMenuItem(null);
        setCurrentReviews([]);
        setReviewStarFilter('all');
    };

    const renderStars = (rating: number) => {
        const validRating = (rating && isFinite(rating)) ? rating : 0; 
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (validRating >= i) stars.push(<FaStar key={i} color="#facc15" />);
            else if (validRating >= i - 0.5) stars.push(<FaStarHalfAlt key={i} color="#facc15" />);
            else stars.push(<FaRegStar key={i} color="#facc15" />);
        }
        return stars;
    };
  
    const reviewsToDisplay = currentReviews.filter(
        (review) => reviewStarFilter === 'all' || review.stars === reviewStarFilter
    );


    if (loading) return <div style={{ padding: 20, textAlign: 'center' }}>Loading menu data...</div>;
    if (error) return <div style={{ padding: 20, textAlign: 'center', color: 'red' }}>Error: {error}</div>;

    return (
        <div style={{ padding: '20px', background: '#f8f8f8', minHeight: '100vh' }}>
            {/* ... (Restaurant Overview) ... */}
            <div
                style={{
                    background: "#fff",
                    padding: 24,
                    borderRadius: 8,
                    boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
                    marginBottom: 20,
                }}
            >
                <h2 style={{ margin: 0 }}>Restaurant Overview</h2>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginTop: 12,
                    }}
                >
                    <div>
                        <div style={{ fontSize: 40, color: "#d97706", fontWeight: 700 }}>
                            {restaurantRating.average.toFixed(1)} 
                        </div>
                        <div style={{ display: "flex", gap: 2 }}>{renderStars(restaurantRating.average)}</div>
                        <div style={{ color: "#6b7280", marginTop: 6 }}>
                            {restaurantRating.totalReviews} reviews 
                        </div>
                    </div>
                    <div>
                        <Image
                            src="/images/makanan/ayam-bakar.jpeg"
                            alt="overview"
                            width={160}
                            height={120}
                            style={{ borderRadius: 8, objectFit: "cover" }}
                        />
                    </div>
                </div>
            </div>
            
            {/* Filter */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 12,
                }}
            >
                <h3 style={{ margin: 0 }}>Menu Ratings ({menuItems.length} items)</h3>
                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc' }}
                >
                    <option value="mostReviews">Most Reviews</option>
                    <option value="highestRated">Highest Rated</option>
                </select>
            </div>

            {/* Cards */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                    gap: 16,
                }}
            >
                {sorted.map((item) => (
                    <div
                        key={item.item_id}
                        onClick={() => handleOpenReviewModal(item)} 
                        style={{
                            background: "#fff",
                            padding: 14,
                            borderRadius: 8,
                            display: "flex",
                            gap: 12,
                            alignItems: "center",
                            boxShadow: "0 6px 18px rgba(0,0,0,0.04)",
                            cursor: "pointer", 
                            transition: "box-shadow 0.2s",
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.1)"}
                        onMouseLeave={(e) => e.currentTarget.style.boxShadow = "0 6px 18px rgba(0,0,0,0.04)"}
                    >
                        <div
                            style={{
                                width: 90,
                                height: 90,
                                borderRadius: 8,
                                overflow: "hidden",
                            }}
                        >
                            <Image
                                src={item.image_data_url} 
                                alt={item.item_name}
                                width={90}
                                height={90}
                                style={{ objectFit: "cover" }}
                            />
                        </div>
                        <div>
                            <div style={{ fontWeight: 700 }}>{item.item_name}</div>
                            <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 6 }}>
                                {renderStars(item.rating)}
                                <span style={{ color: "#6b7280", marginLeft: 6 }}>
                                    {item.rating.toFixed(1)}
                                </span>
                            </div>
                            <div style={{ color: "#6b7280", marginTop: 6 }}>
                                {item.reviews} reviews
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Review Modal */}
            {showReviewModal && selectedMenuItem && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        background: "rgba(0, 0, 0, 0.5)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 1000,
                    }}
                    onClick={handleCloseReviewModal}
                >
                    <div
                        style={{
                            background: "#fff",
                            padding: 25,
                            borderRadius: 10,
                            width: "90%",
                            maxWidth: "600px",
                            maxHeight: "90vh",
                            overflowY: "auto",
                            boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
                        }}
                        onClick={(e) => e.stopPropagation()} 
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                            <h3 style={{ margin: 0 }}>Reviews for {selectedMenuItem.item_name}</h3>
                            <button 
                                onClick={handleCloseReviewModal} 
                                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: '#333' }}
                            >
                                <FaTimes />
                            </button>
                        </div>
                        
                        {/* Review Filter */}
                        <div style={{ marginBottom: 15, borderBottom: '1px solid #eee', paddingBottom: 10 }}>
                            <span style={{ fontWeight: 'bold', marginRight: 10 }}>Filter by Stars:</span>
                            <button 
                                onClick={() => setReviewStarFilter('all')}
                                style={{ background: reviewStarFilter === 'all' ? '#d97706' : '#eee', color: reviewStarFilter === 'all' ? '#fff' : '#333', padding: '5px 10px', borderRadius: 5, border: 'none', cursor: 'pointer', marginRight: 5 }}
                            >
                                All ({currentReviews.length})
                            </button>
                            {[5, 4, 3, 2, 1].map(star => (
                                <button 
                                    key={star}
                                    onClick={() => setReviewStarFilter(star)}
                                    style={{ background: reviewStarFilter === star ? '#d97706' : '#eee', color: reviewStarFilter === star ? '#fff' : '#333', padding: '5px 10px', borderRadius: 5, border: 'none', cursor: 'pointer', marginRight: 5 }}
                                >
                                    {star} Star (
                                    {currentReviews.filter(r => r.stars === star).length}
                                    )
                                </button>
                            ))}
                        </div>

                        {/* List of Reviews */}
                        {reviewLoading ? (
                            <p style={{ textAlign: 'center' }}>Loading reviews...</p>
                        ) : reviewsToDisplay.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
                                {reviewsToDisplay.map((review) => (
                                    <div key={review.comment_id} style={{ border: '1px solid #eee', padding: 10, borderRadius: 5 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                                            <div style={{ display: 'flex', gap: 2 }}>{renderStars(review.stars)}</div>
                                            <span style={{ fontWeight: 'bold' }}>User: {review.comment_id}</span> 
                                        </div>
                                        <p style={{ margin: 0 }}>{review.comment}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p style={{ textAlign: 'center', color: '#666' }}>No reviews match the current filter.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}