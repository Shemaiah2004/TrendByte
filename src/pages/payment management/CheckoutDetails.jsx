import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { employeeLogout } from "../../redux/employee/employeeSlice";
import { motion, AnimatePresence } from "framer-motion";
import { FaSignOutAlt, FaArrowLeft, FaBoxOpen, FaTruck, FaCheckCircle, FaTimesCircle, FaClock, FaShoppingBasket, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaDollarSign, FaCalendarAlt } from "react-icons/fa";


export default function CheckoutDetails() {
  const { checkoutId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [checkout, setCheckout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch checkout details
  useEffect(() => {
    const fetchCheckoutDetails = async () => {
      try {
        const response = await fetch(`/api/checkout/${checkoutId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch checkout details");
        }
        const data = await response.json();
        setCheckout(data);
      } catch (error) {
        setError(error.message);
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCheckoutDetails();
  }, [checkoutId]);

  // Handle status update
  const handleStatusUpdate = async (status) => {
    try {
      const response = await fetch(`/api/checkout/${checkoutId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) throw new Error("Failed to update status");

      const data = await response.json();
      setCheckout(prev => ({ ...prev, status: data.checkout.status }));
      toast.success("Status updated successfully!");
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  // Handle sign out
  const handleSignOut = () => {
    localStorage.removeItem("token");
    dispatch(employeeLogout());
    navigate("/employeeLogin");
    toast.success("Logged out successfully");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-500 animate-spin-reverse"></div>
          </div>
          <p className="mt-6 text-lg font-medium text-white/80">Loading Trendy order details...</p>
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
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!checkout) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="bg-gray-800/50 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-gray-700 max-w-md text-center">
          <div className="text-indigo-400 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Order Not Found</h2>
          <p className="text-gray-300 mb-6">The requested order could not be found in our system.</p>
          <button 
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  // Status badge component
  const StatusBadge = ({ status }) => {
    const statusConfig = {
      Pending: { icon: <FaClock className="mr-1" />, color: "bg-yellow-500/20 text-yellow-400" },
      Processing: { icon: <FaBoxOpen className="mr-1" />, color: "bg-blue-500/20 text-blue-400" },
      Shipped: { icon: <FaTruck className="mr-1" />, color: "bg-indigo-500/20 text-indigo-400" },
      Delivered: { icon: <FaCheckCircle className="mr-1" />, color: "bg-green-500/20 text-green-400" },
      Cancelled: { icon: <FaTimesCircle className="mr-1" />, color: "bg-rose-500/20 text-rose-400" }
    };

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusConfig[status]?.color || "bg-gray-500/20 text-gray-400"}`}>
        {statusConfig[status]?.icon}
        {status}
      </span>
    );
  };

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

      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800/50 backdrop-blur-md shadow-xl border-b border-gray-700 sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-700/50 hover:bg-gray-700/70 transition-all shadow-lg"
            >
              <FaArrowLeft />
              Back
            </motion.button>
            <motion.h1 
              whileHover={{ scale: 1.02 }}
              className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400"
            >
              Trendy Order Details
            </motion.h1>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSignOut}
            className="flex items-center gap-2 px-6 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 transition-all shadow-lg"
          >
            <FaSignOutAlt />
            Sign Out
          </motion.button>
        </div>
      </motion.header>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-2">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gray-800/50 backdrop-blur-md rounded-2xl shadow-xl border border-gray-700 p-6 mb-8"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">Order #{checkout._id.slice(-8).toUpperCase()}</h2>
                  <p className="text-gray-400 text-sm">
                    Placed on {new Date(checkout.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <div className="flex items-center">
                  <StatusBadge status={checkout.status} />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-400 mb-2">Update Status</label>
                <select
                  value={checkout.status}
                  onChange={(e) => handleStatusUpdate(e.target.value)}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Pending" className="bg-gray-800 text-yellow-400">Pending</option>
                  <option value="Processing" className="bg-gray-800 text-blue-400">Processing</option>
                  <option value="Shipped" className="bg-gray-800 text-indigo-400">Shipped</option>
                  <option value="Delivered" className="bg-gray-800 text-green-400">Delivered</option>
                  <option value="Cancelled" className="bg-gray-800 text-rose-400">Cancelled</option>
                </select>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center">
                  <FaShoppingBasket className="mr-2 text-indigo-400" />
                  Order Items
                </h3>
                <div className="divide-y divide-gray-700">
                  {checkout.items.map((item) => (
                    <motion.div 
                      key={item.productId._id}
                      whileHover={{ backgroundColor: "rgba(55, 65, 81, 0.3)" }}
                      className="py-4 flex justify-between items-center transition-colors duration-200"
                    >
                      <div className="flex items-center">
                        <div className="w-16 h-16 bg-gray-700/50 rounded-lg flex items-center justify-center mr-4 overflow-hidden">
                          {(() => {
                            console.log('Product Image Debug:', {
                              productName: item.productId.productName,
                              images: item.productId.images,
                              imageUrl: item.productId.images && item.productId.images.length > 0 
                                ? `http://localhost:3000/uploads/${item.productId.images[0]}`
                                : 'No image URL'
                            });
                            
                            if (item.productId.images && item.productId.images.length > 0) {
                              return (
                                <img 
                                  src={`http://localhost:3000/uploads/${item.productId.images[0]}`} 
                                  alt={item.productId.productName}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    console.error('Image load error:', e.target.src);
                                    e.target.style.display = 'none';
                                  }}
                                />
                              );
                            }
                            return <FaBoxOpen className="text-gray-400 text-xl" />;
                          })()}
                        </div>
                        <div>
                          <h4 className="font-medium text-white">{item.productId.productName}</h4>
                          <p className="text-sm text-gray-400">SKU: {item.productId._id.slice(-6).toUpperCase()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white">${item.productId.price.toFixed(2)} × {item.quantity}</p>
                        <p className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                          ${(item.productId.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Customer and Payment Info */}
          <div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gray-800/50 backdrop-blur-md rounded-2xl shadow-xl border border-gray-700 p-6 mb-8"
            >
              <h3 className="text-lg font-semibold text-white flex items-center mb-4">
                <FaUser className="mr-2 text-indigo-400" />
                Customer Information
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-400">Customer</p>
                  <p className="text-white">{checkout.userId?.username || "Guest"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 flex items-center">
                    <FaEnvelope className="mr-1" /> Email
                  </p>
                  <p className="text-white">{checkout.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 flex items-center">
                    <FaPhone className="mr-1" /> Phone
                  </p>
                  <p className="text-white">{checkout.phoneNumber || "Not provided"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 flex items-center">
                    <FaMapMarkerAlt className="mr-1" /> Shipping Address
                  </p>
                  <p className="text-white">{checkout.address}</p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gray-800/50 backdrop-blur-md rounded-2xl shadow-xl border border-gray-700 p-6"
            >
              <h3 className="text-lg font-semibold text-white flex items-center mb-4">
                <FaDollarSign className="mr-2 text-indigo-400" />
                Order Summary
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <p className="text-gray-400">Subtotal</p>
                  <p className="text-white">${checkout.totalPrice.toFixed(2)}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-gray-400">Shipping</p>
                  <p className="text-white">$0.00</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-gray-400">Tax</p>
                  <p className="text-white">$0.00</p>
                </div>
                <div className="border-t border-gray-700 my-2 pt-2 flex justify-between">
                  <p className="font-medium text-white">Total</p>
                  <p className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                    ${checkout.totalPrice.toFixed(2)}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

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