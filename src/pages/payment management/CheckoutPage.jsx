import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaUpload, FaCheckCircle, FaArrowLeft } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";


export default function CheckoutPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [address, setAddress] = useState("");
  const [mobile, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [receipt, setReceipt] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkoutComplete, setCheckoutComplete] = useState(false);

  // Fetch cart and user details
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch cart details
        const [cartResponse, userResponse] = await Promise.all([
          fetch(`/api/cart/getcart/${id}`),
          fetch(`/api/users/user/${id}`)
        ]);

        if (!cartResponse.ok) throw new Error("Failed to fetch cart");
        if (!userResponse.ok) throw new Error("Failed to fetch user details");

        const [cartData, userData] = await Promise.all([
          cartResponse.json(),
          userResponse.json()
        ]);

        setCart(cartData);
        setUser(userData);
        setEmail(userData.email);
        setAddress(userData.address || "");
        setPhoneNumber(userData.mobile || "");
      } catch (error) {
        setError(error.message);
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleReceiptUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setReceipt(file);
      toast.success("Receipt uploaded successfully");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("userId", id);
      formData.append("address", address);
      formData.append("phoneNumber", mobile);
      formData.append("email", email);
      formData.append("items", JSON.stringify(cart.items));
      formData.append("totalPrice", cart.totalPrice);
      if (receipt) formData.append("receipt", receipt);

      const response = await fetch("/api/checkout/checkout", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to submit checkout");

      const result = await response.json();
      setCheckoutComplete(true);
      toast.success("Checkout successful!");
    } catch (error) {
      console.error("Error during checkout:", error);
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
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
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Checkout Error</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!cart) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="bg-gray-800/50 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-gray-700 max-w-md text-center">
          <div className="text-indigo-400 mb-4">
            <FaShoppingCart className="h-16 w-16 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Your Cart is Empty</h2>
          <p className="text-gray-300 mb-6">Explore our futuristic products to add something amazing!</p>
          <button 
            onClick={() => navigate("/")}
            className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  if (checkoutComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="bg-gray-800/50 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-gray-700 max-w-md text-center">
          <div className="text-emerald-400 mb-4">
            <FaCheckCircle className="h-16 w-16 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Checkout Complete!</h2>
          <p className="text-gray-300 mb-6">Your futuristic order is being prepared for delivery.</p>
          <div className="flex gap-4 justify-center">
            <button 
              onClick={() => navigate("/")}
              className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg"
            >
              Continue Shopping
            </button>
            <button 
              onClick={() => navigate(`/order-history/${id}`)}
              className="px-6 py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-300 shadow-lg"
            >
              View Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white py-12 px-4 sm:px-6 lg:px-8">
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

      <div className="max-w-7xl mx-auto relative z-10">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 mb-8 transition-colors"
        >
          <FaArrowLeft /> Back to Shopping
        </button>

        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold mb-12 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 text-center"
        >
          Futuristic Checkout
        </motion.h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items Section */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:w-2/3"
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <FaShoppingCart className="text-indigo-400" />
              Your Tech Collection
            </h2>
            
            <div className="space-y-6">
              {cart.items.map((item) => (
                <motion.div
                  key={item.productId._id}
                  whileHover={{ y: -5 }}
                  className="bg-gray-800/50 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-gray-700 hover:border-indigo-500/50 transition-all"
                >
                  <div className="flex flex-col sm:flex-row gap-6">
                    <div className="flex-shrink-0">
                      <img
                        src={`http://localhost:3000/uploads/${item.productId.image}`}
                        alt={item.productId.productName}
                        className="w-32 h-32 object-cover rounded-xl"
                      />
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-xl font-bold text-white mb-2">
                        {item.productId.productName}
                      </h3>
                      <p className="text-gray-400 mb-3 line-clamp-2">
                        {item.productId.description}
                      </p>
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <span className="text-lg font-semibold text-indigo-400">
                          ${item.productId.price} × {item.quantity}
                        </span>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                          ${(item.productId.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Checkout Form Section */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:w-1/3"
          >
            <div className="bg-gray-800/50 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-gray-700 sticky top-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <FaCheckCircle className="text-emerald-400" />
                Order Summary
              </h2>

              <div className="space-y-6 mb-8">
                <div className="flex justify-between text-lg">
                  <span className="text-gray-400">Subtotal</span>
                  <span className="font-semibold">${cart.totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg">
                  <span className="text-gray-400">Shipping</span>
                  <span className="font-semibold text-emerald-400">FREE</span>
                </div>
                <div className="border-t border-gray-700 pt-4 flex justify-between text-xl">
                  <span className="text-gray-300">Total</span>
                  <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                    ${cart.totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Delivery Address
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-800/50 text-white placeholder-gray-500"
                    placeholder="Enter your futuristic address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Contact Number
                  </label>
                  <input
                    type="tel"
                    value={mobile}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-800/50 text-white placeholder-gray-500"
                    placeholder="Your holographic communicator"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-800/50 text-white placeholder-gray-500"
                    placeholder="Your quantum email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <FaUpload className="inline mr-2" />
                    Payment Receipt (Optional)
                  </label>
                  <div className="flex items-center gap-4">
                    <label className="flex-1 cursor-pointer">
                      <div className="border-2 border-dashed border-gray-600 hover:border-indigo-500 rounded-xl p-4 text-center transition-colors">
                        {receipt ? (
                          <span className="text-indigo-400">{receipt.name}</span>
                        ) : (
                          <span className="text-gray-400">Upload your payment proof</span>
                        )}
                        <input
                          type="file"
                          onChange={handleReceiptUpload}
                          className="hidden"
                        />
                      </div>
                    </label>
                  </div>
                </div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all shadow-2xl ${
                    isSubmitting
                      ? "bg-gray-700 cursor-not-allowed"
                      : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Processing...
                    </span>
                  ) : (
                    "Complete Quantum Purchase"
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Global styles for animations */}
      <style jsx global>{`
        @keyframes float {
          0% { transform: translateY(0) translateX(0); opacity: 1; }
          50% { transform: translateY(-100px) translateX(20px); opacity: 0.8; }
          100% { transform: translateY(-200px) translateX(0); opacity: 0; }
        }
      `}</style>
    </div>
  );
}