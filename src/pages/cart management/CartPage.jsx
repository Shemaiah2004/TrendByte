import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiTrash2, FiShoppingBag, FiArrowLeft, FiPlus, FiMinus } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { FaExclamationTriangle } from "react-icons/fa";

export default function CartPage() {
  const { id } = useParams();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [isHovering, setIsHovering] = useState(null);
  const navigate = useNavigate();

  // Floating particles background
  const particles = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    size: Math.random() * 6 + 2,
    top: Math.random() * 100,
    left: Math.random() * 100,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 5
  }));

  // Fetch cart details
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await fetch(`/api/cart/getcart/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch cart");
        }
        const data = await response.json();
        setCart(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [id]);

  // Update product quantity
  const handleUpdateQuantity = async (productId, quantity) => {
    // Convert quantity to number if it's a string
    const numQuantity = Number(quantity);
    
    // Validate quantity limits
    if (numQuantity < 1) {
      showNotification("Quantity must be at least 1", "error");
      return;
    }
    if (numQuantity > 10) {
      showNotification("Maximum quantity allowed is 10", "error");
      return;
    }
    
    try {
      const response = await fetch(`/api/cart/${id}/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantity: numQuantity }),
      });

      if (!response.ok) {
        throw new Error("Failed to update quantity");
      }

      const updatedCart = await response.json();

      setCart((prevCart) => ({
        ...prevCart,
        items: prevCart.items.map((item) =>
          item.productId._id === productId
            ? { ...item, quantity: numQuantity }
            : item
        ),
        totalPrice: updatedCart.cart.totalPrice,
      }));
    } catch (error) {
      console.error("Error updating quantity:", error);
      showNotification("Failed to update quantity", "error");
    }
  };

  // Delete a product from the cart
  const handleDeleteProduct = async (productId) => {
    try {
      const response = await fetch(`/api/cart/${id}/${productId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete product");
      }

      const updatedCart = await response.json();

      if (updatedCart.cart === null) {
        setCart(null);
      } else {
        setCart((prevCart) => ({
          ...prevCart,
          items: prevCart.items.filter((item) => item.productId._id !== productId),
          totalPrice: updatedCart.cart.totalPrice,
        }));
      }
      showNotification("Product removed from cart", "success");
    } catch (error) {
      console.error("Error deleting product:", error);
      showNotification("Failed to remove product", "error");
    }
  };

  // Apply promo code
  const handleApplyPromo = () => {
    if (promoCode === "FUTURE20") {
      setDiscount(20);
      showNotification("Promo code applied! 20% discount", "success");
    } else {
      showNotification("Invalid promo code", "error");
    }
  };

  // Show notification
  const showNotification = (message, type) => {
    const notification = document.createElement("div");
    notification.className = `fixed top-6 right-6 z-50 px-6 py-3 rounded-xl shadow-2xl text-white font-medium transform transition-all duration-500 ${
      type === "success" ? "bg-emerald-500" : 
      type === "error" ? "bg-rose-500" :
      "bg-indigo-500"
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

  // Handle checkout
  const handleCheckout = () => {
    navigate(`/checkout/${id}`);
  };

  // Continue shopping
  const handleContinueShopping = () => {
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-500 animate-spin-reverse"></div>
          </div>
          <p className="mt-6 text-lg font-medium text-white/80">Loading your futuristic cart...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="bg-gray-800/50 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-gray-700 max-w-md text-center">
          <div className="text-rose-400 mb-4">
            <FaExclamationTriangle className="h-16 w-16 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Quantum Error</h2>
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

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="bg-gray-800/50 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-gray-700 max-w-md text-center">
          <FiShoppingBag className="h-16 w-16 mx-auto text-indigo-400 mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Your Cart is Empty</h2>
          <p className="text-gray-300 mb-6">Looks like you haven't added any futuristic items yet.</p>
          <button
            onClick={handleContinueShopping}
            className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg"
          >
            Explore Future Products
          </button>
        </div>
      </div>
    );
  }

  const discountedTotal = cart.totalPrice * (1 - discount / 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      {/* Floating particles background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle) => (
          <div 
            key={particle.id}
            className="absolute rounded-full bg-white/10"
            style={{
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              top: `${particle.top}%`,
              left: `${particle.left}%`,
              animation: `float ${particle.duration}s linear infinite`,
              animationDelay: `${particle.delay}s`
            }}
          ></div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* Header with back button */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center mb-8"
        >
          <motion.button
            whileHover={{ x: -4 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleContinueShopping}
            className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 mr-4"
          >
            <FiArrowLeft />
            Back to Shopping
          </motion.button>
          <h1 className="mb-4 p-2 text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
            Trendy Cart
          </h1>
        </motion.div>

        {/* Container with two columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Section: Cart Items (2/3 width on large screens) */}
          <div className="lg:col-span-2 space-y-6">
            <AnimatePresence>
              {cart.items.map((item) => (
                <motion.div
                  key={item.productId._id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ scale: 1.02 }}
                  onHoverStart={() => setIsHovering(item.productId._id)}
                  onHoverEnd={() => setIsHovering(null)}
                  className="bg-gray-800/50 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden border border-gray-700 relative"
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Product Image */}
                    <div className="w-full md:w-48 h-48 relative overflow-hidden">
                      <img
                        src={`http://localhost:3000/uploads/${item.productId.image}` || "/placeholder-product.jpg"}
                        alt={item.productId.productName}
                        className={`w-full h-full object-cover transition-transform duration-500 ${
                          isHovering === item.productId._id ? "scale-110" : "scale-100"
                        }`}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent"></div>
                    </div>

                    {/* Product Info */}
                    <div className="p-6 flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-bold mb-1">{item.productId.productName}</h3>
                          <p className="text-gray-400 text-sm mb-3">
                            {item.productId.category || "Future Tech"}
                          </p>
                        </div>
                        <p className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                          ${item.productId.price.toFixed(2)}
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <label className="text-sm font-medium text-gray-300">Qty</label>
                          <div className="flex items-center border border-gray-700 rounded-lg overflow-hidden">
                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleUpdateQuantity(item.productId._id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="px-3 py-1 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 transition-colors"
                            >
                              <FiMinus />
                            </motion.button>
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) =>
                                handleUpdateQuantity(item.productId._id, e.target.value)
                              }
                              min="1"
                              className="w-12 text-center py-1 bg-gray-800 border-x border-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleUpdateQuantity(item.productId._id, item.quantity + 1)}
                              className="px-3 py-1 bg-gray-700 hover:bg-gray-600 transition-colors"
                            >
                              <FiPlus />
                            </motion.button>
                          </div>
                        </div>

                        {/* Delete Button */}
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleDeleteProduct(item.productId._id)}
                          className="flex items-center gap-2 px-4 py-2 bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 rounded-lg transition-colors border border-rose-600/30"
                        >
                          <FiTrash2 />
                          Remove
                        </motion.button>
                      </div>

                      {/* Item Subtotal */}
                      <div className="mt-4 text-right">
                        <p className="text-gray-300">
                          Subtotal: <span className="font-medium text-white">${(item.productId.price * item.quantity).toFixed(2)}</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Hover Effect */}
                  {isHovering === item.productId._id && (
                    <div className="absolute inset-0 border-2 border-indigo-400/30 rounded-2xl pointer-events-none"></div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Right Section: Order Summary (1/3 width on large screens) */}
          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-800/50 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-gray-700 sticky top-6"
            >
              <h2 className="text-2xl font-bold mb-6 pb-4 border-b border-gray-700 flex items-center gap-2">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                  Order Summary
                </span>
              </h2>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Subtotal</span>
                  <span className="font-medium">${cart.totalPrice.toFixed(2)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Discount ({discount}%)</span>
                    <span className="font-medium text-emerald-400">-${(cart.totalPrice * discount / 100).toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-gray-400">Shipping</span>
                  <span className="font-medium">FREE</span>
                </div>

                <div className="flex justify-between pt-4 border-t border-gray-700">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                    ${discountedTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Promo Code Section */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3">Promo Code</h3>
                <div className="flex">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter quantum code"
                    className="flex-1 px-4 py-2 rounded-l-lg border border-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-gray-800 text-white"
                  />
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleApplyPromo}
                    className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-r-lg hover:from-indigo-700 hover:to-purple-700 transition-all"
                  >
                    Apply
                  </motion.button>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCheckout}
                className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg flex items-center justify-center gap-2"
              >
                Secure Checkout
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                </svg>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleContinueShopping}
                className="w-full mt-4 px-6 py-3 bg-transparent text-indigo-400 rounded-lg hover:bg-gray-700/50 transition-all border border-gray-700 flex items-center justify-center gap-2"
              >
                Continue Exploring
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                </svg>
              </motion.button>
            </motion.div>
          </div>
        </div>
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