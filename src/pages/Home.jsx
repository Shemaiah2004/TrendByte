import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaSearch, FaFilter, FaSort, FaShoppingCart, FaExclamationTriangle, FaFire, FaStar, FaBolt } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [isHovering, setIsHovering] = useState(null);
  const navigate = useNavigate();

  const { currentUser } = useSelector((state) => state.user);

  // Fetch active products from the backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/product/active");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        setProducts(data.products);
        setFilteredProducts(data.products);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...products];

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter((product) =>
        product.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory
      );
    }

    // Filter by price range
    filtered = filtered.filter(
      (product) => product.price >= priceRange.min && product.price <= priceRange.max
    );

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "price-high":
          return b.price - a.price;
        case "price-low":
          return a.price - b.price;
        case "name-asc":
          return a.productName.localeCompare(b.productName);
        case "name-desc":
          return b.productName.localeCompare(a.productName);
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  }, [products, searchQuery, selectedCategory, priceRange, sortBy]);

  const handleAddToCart = async (productId, quantity) => {
    if (!currentUser) {
      // Futuristic modal instead of alert
      showNotification("Please sign in to add products to your cart", "warning");
      setTimeout(() => navigate("/signin"), 1500);
      return;
    }
    try {
      const response = await fetch("/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ productId, quantity, userId: currentUser._id }),
      });
      if (response.ok) {
        showNotification("Product added to cart!", "success");
        setTimeout(() => navigate(`/cartpage/${currentUser._id}`), 1000);
      } else {
        throw new Error("Failed to add product to cart");
      }
    } catch (error) {
      showNotification("Failed to add product to cart", "error");
    }
  };

  const showNotification = (message, type) => {
    const notification = document.createElement("div");
    notification.className = `fixed top-6 right-6 z-50 px-6 py-3 rounded-xl shadow-2xl text-white font-medium transform transition-all duration-500 ${
      type === "success" ? "bg-emerald-500" : 
      type === "error" ? "bg-rose-500" :
      type === "warning" ? "bg-amber-500" : "bg-indigo-500"
    } animate-fade-in-up`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add("opacity-0", "translate-y-4");
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 500);
    }, 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-500 animate-spin-reverse"></div>
          </div>
          <p className="mt-6 text-lg font-medium text-white/80">Loading futuristic products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="bg-gray-800/50 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-gray-700 max-w-md text-center">
          <div className="text-rose-400 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Trendy Error</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      {/* Floating particles background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-white/10"
            style={{
              width: `${Math.random() * 6 + 2}px`,
              height: `${Math.random() * 6 + 2}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 20 + 10}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`
            }}
          ></div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* Hero Section with Search */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 mt-24"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
            Explore the Future
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Discover cutting-edge products designed for tomorrow's world
          </p>
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="max-w-2xl mx-auto relative"
          >
            <input
              type="text"
              placeholder="Search Trendy products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-4 rounded-full border border-gray-700 shadow-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-800/50 backdrop-blur-sm text-white placeholder-gray-400"
            />
            <FaSearch className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </motion.div>
        </motion.div>

        {/* Featured Products Carousel */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mb-16"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center">
              <FaFire className="text-orange-400 mr-2" />
              Featured Products
            </h2>
            <div className="flex space-x-2">
              <button className="swiper-button-prev-custom p-2 rounded-full bg-gray-800/50 hover:bg-gray-700 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button className="swiper-button-next-custom p-2 rounded-full bg-gray-800/50 hover:bg-gray-700 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
          
          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            spaceBetween={30}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            navigation={{
              nextEl: ".swiper-button-next-custom",
              prevEl: ".swiper-button-prev-custom",
            }}
            className="rounded-2xl overflow-hidden"
          >
            {products.slice(0, 5).map((product) => (
              <SwiperSlide key={product._id}>
                <div className="relative group h-96 rounded-2xl overflow-hidden">
                  <img
                    src={`http://localhost:3000/uploads/${product.image}`}
                    alt={product.productName}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/30 to-transparent flex flex-col justify-end p-6">
                    <h3 className="text-2xl font-bold mb-2">{product.productName}</h3>
                    <p className="text-gray-300 line-clamp-2 mb-4">{product.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-indigo-400">${product.price}</span>
                      <button
                        onClick={() => handleAddToCart(product._id, 1)}
                        className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center gap-2"
                      >
                        <FaShoppingCart />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                  <div className="absolute top-4 right-4 bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                    <FaStar className="mr-1" /> Featured
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>

        {/* Filters Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="bg-gray-800/50 backdrop-blur-md rounded-2xl shadow-2xl p-6 mb-12 border border-gray-700"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg"
            >
              <FaFilter />
              {showFilters ? "Hide Trendy Filters" : "Show Trendy Filters"}
            </motion.button>

            <div className="flex items-center gap-4">
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none px-5 py-3 rounded-xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-800/50 text-white pr-10"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="name-asc">Name: A to Z</option>
                  <option value="name-desc">Name: Z to A</option>
                </select>
                <FaSort className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-hidden"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    <FaBolt className="inline-block mr-2 text-yellow-400" />
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-800/50 text-white"
                  >
                    <option value="All">All Dimensions</option>
                    <option value="Men">Men's Tech</option>
                    <option value="Women">Women's Tech</option>
                    <option value="Kid">Future Kids</option>
                    <option value="Accessories">Trendy Accessories</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    <FaBolt className="inline-block mr-2 text-yellow-400" />
                    Price Range
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="number"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-800/50 text-white"
                      placeholder="Min Credits"
                    />
                    <span className="text-gray-400">to</span>
                    <input
                      type="number"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-800/50 text-white"
                      placeholder="Max Credits"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Products Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        >
          <AnimatePresence>
            {filteredProducts.map((product) => (
              <motion.div
                key={product._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                whileHover={{ y: -10 }}
                onMouseEnter={() => setIsHovering(product._id)}
                onMouseLeave={() => setIsHovering(null)}
                className="bg-gray-800/50 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden border border-gray-700 relative"
              >
                {/* Product Image */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={`http://localhost:3000/uploads/${product.image}`}
                    alt={product.productName}
                    className={`w-full h-full object-cover transition-transform duration-500 ${
                      isHovering === product._id ? "scale-110" : "scale-100"
                    }`}
                  />
                  {product.quantity === 0 && (
                    <div className="absolute top-0 left-0 right-0 bg-rose-600/90 text-white py-2 px-4 text-center font-medium">
                      <FaExclamationTriangle className="inline-block mr-2" />
                      Out of Stock
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent"></div>
                </div>

                {/* Product Info */}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{product.productName}</h3>
                  <p className="text-gray-400 mb-4 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                      ${product.price}
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleAddToCart(product._id, 1)}
                      disabled={product.quantity === 0}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                        product.quantity === 0
                          ? "bg-gray-700 cursor-not-allowed"
                          : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                      } text-white transition-all shadow-md`}
                    >
                      <FaShoppingCart />
                      {product.quantity === 0 ? "Unavailable" : "Add to Cart"}
                    </motion.button>
                  </div>
                </div>

                {/* Hover Effect */}
                {isHovering === product._id && (
                  <div className="absolute inset-0 border-2 border-indigo-400/50 rounded-2xl pointer-events-none"></div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* No Results Message */}
        {filteredProducts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-16"
          >
            <div className="bg-gray-800/50 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-gray-700 inline-block">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-indigo-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-xl font-bold text-white mb-2">No Trendy Products Found</h3>
              <p className="text-gray-400 mb-4">Try adjusting your search parameters</p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                  setPriceRange({ min: 0, max: 1000 });
                  setSortBy("newest");
                }}
                className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all"
              >
                Reset All Filters
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Global styles for animations */}
      <style jsx global>{`
        @keyframes float {
          0% { transform: translateY(0) translateX(0); opacity: 1; }
          50% { transform: translateY(-100px) translateX(20px); opacity: 0.8; }
          100% { transform: translateY(-200px) translateX(0); opacity: 0; }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.5s ease-out forwards;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}