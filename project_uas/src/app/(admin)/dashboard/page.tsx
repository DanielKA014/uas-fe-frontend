"use client";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react"; 
import { FaStar, FaStarHalfAlt, FaRegStar, FaTimes } from "react-icons/fa";
import Sidebar from "./components/sidebar";
import LoadingSpinner from "../../components/LoadingSpinner";
import AdminTopbarUser from "./components/AdminTopbarUser";
import LoadMorePagination from "./components/LoadMorePagination";

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
  user_id: number;
  created_at?: string;
  createdAt?: string;
};

type RestaurantRating = {
  average: number;
  totalReviews: number;
}

declare const Buffer: any; 

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL
const FOODS_BASE_URL = `${BASE_URL}/api/foods`;
const RESTAURANT_BASE_URL = `${BASE_URL}/api/restaurant-reviews`;
const ITEMS_PER_PAGE = 8;

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

    // Restaurant reviews popup
    const [showRestaurantReviewsModal, setShowRestaurantReviewsModal] = useState(false);
    const [restaurantReviews, setRestaurantReviews] = useState<any[]>([]);
    const [restaurantReviewsLoading, setRestaurantReviewsLoading] = useState(false);

    // pagination purpose
    const [currentPage, setCurrentPage] = useState(1);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const loadNextPage = () => {
        const nextPage = currentPage + 1;
        setCurrentPage(nextPage);
        fetchAllMenusWithRatings(nextPage, true);
    };

    const fetchMenuReviews = useCallback(async (itemId: number) => {
        setReviewLoading(true);
        setCurrentReviews([]);
        try {
            const res = await fetch(`${FOODS_BASE_URL}/${itemId}/reviews?limit=100`);
            if (!res.ok) throw new Error(`Failed to fetch reviews: ${res.status}`);

            const data: FoodReview[] = await res.json();
            setCurrentReviews(data);
        } catch (err: any) {
            console.error(`Error fetching reviews for item ${itemId}:`, err);
        } finally {
            setReviewLoading(false);
        }
    }, []);

    const fetchRestaurantRating = useCallback(async () => {
        try {
            const res = await fetch(`${RESTAURANT_BASE_URL}/?page=1&limit=1`); 
            if (!res.ok) throw new Error("Failed to fetch restaurant rating.");

            const data = await res.json();
            
            setRestaurantRating({
                average: parseFloat(data.average_stars),
                totalReviews: parseInt(data.count) || 0,
            });
        } catch (err) {
            console.error("Error fetching restaurant rating:", err);
        }
    }, []);

    const fetchAllMenusWithRatings = useCallback(async (page: number, append: boolean = false) => {  
        setLoading(true);
        setError(null);
        try {
            append ? setLoadingMore(true) : setLoading(true);

            const menuRes = await fetch(`${FOODS_BASE_URL}/?page=${page}&limit=${ITEMS_PER_PAGE}`);
            if (!menuRes.ok) throw new Error(`Failed to fetch menus: ${menuRes.status}`);

            const menuData = await menuRes.json();
            const fetchedMenus = menuData.result || [];

            const ratingPromises = fetchedMenus.map(async (menu: any) => {
                // Backend already converts image_bytes to base64 and returns image_data_url
                let imageDataUrl = menu.image_data_url || '/images/makanan/default.jpg';
                const itemId = menu.item_id
                try {
                    const reviewRes = await fetch(`${FOODS_BASE_URL}/${itemId}/reviews-overview`);
                    if (reviewRes.ok) {
                        const reviewSummary = await reviewRes.json();
                        
                        console.log(`Ini isi field item menu dengan id ${itemId}`)
                        console.log(reviewSummary.average_rating)
                        console.log(reviewSummary.review_count);
                        
                        return {
                            item_id: itemId,
                            item_name: menu.item_name,
                            category: menu.category,
                            image_data_url: imageDataUrl, 
                            rating: parseFloat(reviewSummary.average_rating) || 0, 
                            reviews: parseInt(reviewSummary.review_count) || 0,
                        };
                    }
                
                } catch (fetchError) {
                    console.warn(`Could not fetch rating for item ${itemId}. Using default.`, fetchError);
                }
                return {
                    item_id: itemId,
                    item_name: menu.item_name,
                    category: menu.category,
                    image_data_url: imageDataUrl,

                    rating: 0, 
                    reviews: 0,
                };
            });

            const menusWithActualRatings: MenuItemType[] = await Promise.all(ratingPromises);
            
            append ? setMenuItems((prev) => [...prev, ...menusWithActualRatings]) : setMenuItems(menusWithActualRatings);

            setHasMore(menusWithActualRatings.length === ITEMS_PER_PAGE);
            setError(null);
        } catch (err: any) {
            console.error("Error fetching menus:", err);
            setError("Failed to load menus or ratings.");
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, []);

    useEffect(() => {
        fetchAllMenusWithRatings(1, false);
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

    const fetchRestaurantReviews = useCallback(async () => {
        setRestaurantReviewsLoading(true);
        try {
            const res = await fetch(`${RESTAURANT_BASE_URL}/?page=1&limit=1000`);
            if (!res.ok) throw new Error(`Failed to fetch restaurant reviews: ${res.status}`);

            const data = await res.json();
            setRestaurantReviews(data.reviews || []);
        } catch (err) {
            console.error("Error fetching restaurant reviews:", err);
            setRestaurantReviews([]);
        } finally {
            setRestaurantReviewsLoading(false);
        }
    }, []);

    const handleOpenRestaurantReviewsModal = async () => {
        setShowRestaurantReviewsModal(true);
        await fetchRestaurantReviews();
    };

    const handleCloseRestaurantReviewsModal = () => {
        setShowRestaurantReviewsModal(false);
        setRestaurantReviews([]);
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

    if (loading) return <LoadingSpinner fullScreen size="lg" />;
    if (error) return <div style={{ padding: 20, textAlign: 'center', color: 'red' }}>Error: {error}</div>;
    
    return (
        <>
          <Sidebar />
                    <main className="admin-main p-4">
                        <AdminTopbarUser />
                        <div className="admin-content-inner" style={{ padding: '20px', background: '#f8f8f8', minHeight: '100vh', overflowX: 'hidden' }}>
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
                        <div style={{ cursor: 'pointer' }} onClick={handleOpenRestaurantReviewsModal}>
                            <div style={{ fontSize: 40, color: "#d97706", fontWeight: 700 }}>
                                {restaurantRating.average.toFixed(1)}
                            </div>
                            <div style={{ display: "flex", gap: 2 }}>{renderStars(restaurantRating.average)}</div>
                            <div style={{ color: "#6b7280", marginTop: 6 }}>
                                {restaurantRating.totalReviews} reviews
                            </div>
                            <div style={{ color: "#3b82f6", fontSize: 12, marginTop: 8 }}>
                                (Click to see recent comments)
                            </div>
                        </div>
                        <div>
                            <Image
                                src="/images/makanan/ayam-bakar.jpeg"
                                alt="overview"
                                width={160}
                                height={120}
                                style={{ borderRadius: 8, objectFit: "cover" }} />
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
                        flexWrap: "wrap",
                        gap: 12,
                    }}
                >
                    <h3 style={{ margin: 0, minWidth: '150px' }}>Menu Ratings ({menuItems.length} items)</h3>
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc', minWidth: '150px' }}
                    >
                        <option value="mostReviews">Most Reviews</option>
                        <option value="highestRated">Highest Rated</option>
                    </select>
                </div>

                {/* Cards - Responsive Grid */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
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
                                flexDirection: "column",
                                alignItems: "center",
                                textAlign: "center",
                                gap: 12,
                                boxShadow: "0 6px 18px rgba(0,0,0,0.04)",
                                cursor: "pointer",
                                transition: "box-shadow 0.2s",
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.1)"}
                            onMouseLeave={(e) => e.currentTarget.style.boxShadow = "0 6px 18px rgba(0,0,0,0.04)"}
                        >
                            <div
                                style={{
                                    width: 80,
                                    height: 80,
                                    borderRadius: 8,
                                    overflow: "hidden",
                                }}
                            >
                                <Image
                                    src={item.image_data_url}
                                    alt={item.item_name}
                                    width={80}
                                    height={80}
                                    style={{ objectFit: "cover" }} />
                            </div>
                            <div style={{ width: '100%' }}>
                                <div style={{ fontWeight: 700, fontSize: '14px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.item_name}</div>
                                <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 6, justifyContent: 'center' }}>
                                    {renderStars(item.rating)}
                                    <span style={{ color: "#6b7280", marginLeft: 6, fontSize: '12px' }}>
                                        {item.rating}
                                    </span>
                                </div>
                                <div style={{ color: "#6b7280", marginTop: 6, fontSize: '12px' }}>
                                    {item.reviews} reviews
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {hasMore && (
                <LoadMorePagination 
                    nextPage={loadNextPage} isLoadingMore={loadingMore}            
                ></LoadMorePagination>
                )}

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
                                width: "95%",
                                maxWidth: "600px",
                                maxHeight: "85vh",
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
                                            {(review.created_at || review.createdAt) && (
                                                <small style={{ color: '#999', display: 'block', marginTop: 8 }}>
                                                  {new Date(review.created_at || review.createdAt || '').toLocaleDateString('id-ID', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                  })}
                                                </small>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p style={{ textAlign: 'center', color: '#666' }}>No reviews match the current filter.</p>
                            )}
                        </div>
                    </div>
                )}

                {/* Restaurant Reviews Modal */}
                {showRestaurantReviewsModal && (
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
                        onClick={handleCloseRestaurantReviewsModal}
                    >
                        <div
                            style={{
                                background: "#fff",
                                padding: 25,
                                borderRadius: 10,
                                width: "95%",
                                maxWidth: "600px",
                                maxHeight: "85vh",
                                overflowY: "auto",
                                boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                                <h3 style={{ margin: 0 }}>Recent Restaurant Reviews</h3>
                                <button
                                    onClick={handleCloseRestaurantReviewsModal}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: '#333' }}
                                >
                                    <FaTimes />
                                </button>
                            </div>

                            {restaurantReviewsLoading ? (
                                <p style={{ textAlign: 'center' }}>Loading reviews...</p>
                            ) : restaurantReviews.length > 0 ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
                                    {restaurantReviews.slice(0, 10).map((review: any) => (
                                        <div key={review.review_id || review.comment_id} style={{ border: '1px solid #eee', padding: 15, borderRadius: 5 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                                                <div style={{ display: 'flex', gap: 2 }}>{renderStars(review.stars)}</div>
                                                <span style={{ fontSize: 12, color: '#999' }}>
                                                    {review.stars} star{review.stars !== 1 ? 's' : ''}
                                                </span>
                                            </div>
                                            <p style={{ margin: '8px 0', fontStyle: 'italic', color: '#666' }}>
                                                "{review.comment}"
                                            </p>
                                            {(review.created_at || review.createdAt) && (
                                                <small style={{ color: '#999', display: 'block', marginTop: 8 }}>
                                                    {new Date(review.created_at || review.createdAt || '').toLocaleDateString('id-ID', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    })}
                                                </small>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p style={{ textAlign: 'center', color: '#666' }}>No reviews available.</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </main></>
    );
}