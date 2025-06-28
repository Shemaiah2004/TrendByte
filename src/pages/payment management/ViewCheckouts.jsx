import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { employeeLogout } from "../../redux/employee/employeeSlice";
import { motion, AnimatePresence } from "framer-motion";
import { FaSignOutAlt, FaEye, FaTrash, FaBoxOpen, FaTruck, FaCheckCircle, FaTimesCircle, FaClock } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

export default function ViewCheckouts() {
  const [checkouts, setCheckouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Fetch all checkouts
  useEffect(() => {
    const fetchCheckouts = async () => {
      try {
        const response = await fetch("/api/checkout");
        if (!response.ok) {
          throw new Error("Failed to fetch checkouts");
        }
        const data = await response.json();
        setCheckouts(data);
      } catch (error) {
        setError(error.message);
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCheckouts();
  }, []);

  // Handle status update
  const handleStatusUpdate = async (checkoutId, status) => {
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
      setCheckouts((prevCheckouts) =>
        prevCheckouts.map((checkout) =>
          checkout._id === checkoutId ? { ...checkout, status: data.checkout.status } : checkout
        )
      );
      toast.success("Status updated successfully!");
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  // Handle checkout deletion
  const handleDeleteCheckout = async (checkoutId) => {
    if (!window.confirm("Are you sure you want to delete this checkout?")) return;
    
    try {
      const response = await fetch(`/api/checkout/${checkoutId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete checkout");

      setCheckouts((prevCheckouts) =>
        prevCheckouts.filter((checkout) => checkout._id !== checkoutId)
      );
      toast.success("Checkout deleted successfully!");
    } catch (error) {
      console.error("Error deleting checkout:", error);
      toast.error("Failed to delete checkout");
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
          <p className="mt-6 text-lg font-medium text-white/80">Loading Trendy checkouts...</p>
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

  // Helper function to truncate address
  const truncateAddress = (address, maxLength = 30) => {
    if (!address) return "No address provided";
    if (address.length <= maxLength) return address;
    return `${address.substring(0, maxLength)}...`;
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
          <motion.h1 
            whileHover={{ scale: 1.02 }}
            className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400"
          >
            Trendy Admin Portal
          </motion.h1>
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

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        <Swiper
          modules={[Autoplay]}
          spaceBetween={20}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 4 },
          }}
          autoplay={{ delay: 5000 }}
          className="rounded-2xl mb-12"
        >
          {[
            { title: "Total Orders", value: checkouts.length, color: "from-indigo-600 to-purple-600" },
            { title: "Pending", value: checkouts.filter(c => c.status === "Pending").length, color: "from-yellow-600 to-amber-600" },
            { title: "Processing", value: checkouts.filter(c => c.status === "Processing").length, color: "from-blue-600 to-cyan-600" },
            { title: "Delivered", value: checkouts.filter(c => c.status === "Delivered").length, color: "from-green-600 to-emerald-600" },
          ].map((stat, index) => (
            <SwiperSlide key={index}>
              <div className={`bg-gradient-to-r ${stat.color} p-6 rounded-2xl shadow-xl h-full`}>
                <h3 className="text-lg font-medium text-white/90 mb-2">{stat.title}</h3>
                <p className="text-3xl font-bold text-white">{stat.value}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400"
        >
          Trendy Order Management
        </motion.h1>

        {/* Checkouts Table */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-800/50 backdrop-blur-md rounded-2xl shadow-xl border border-gray-700 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-700/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                <AnimatePresence>
                  {checkouts.map((checkout) => (
                    <motion.tr
                      key={checkout._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      whileHover={{ backgroundColor: "rgba(55, 65, 81, 0.3)" }}
                      className="transition-colors duration-200"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                            {checkout.userId?.username?.charAt(0).toUpperCase() || "U"}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-white">
                              {checkout.userId?.username || "Unknown User"}
                            </div>
                            <div 
                              className="text-sm text-gray-400 cursor-help"
                              title={checkout.address}
                            >
                              {truncateAddress(checkout.address)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white">{checkout.email}</div>
                        <div className="text-sm text-gray-400">{checkout.phoneNumber}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                        ${checkout.totalPrice.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={checkout.status}
                          onChange={(e) => handleStatusUpdate(checkout._id, e.target.value)}
                          className={`text-sm rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-700/50 border border-gray-600 ${{
                            Pending: "text-yellow-400",
                            Processing: "text-blue-400",
                            Shipped: "text-indigo-400",
                            Delivered: "text-green-400",
                            Cancelled: "text-rose-400"
                          }[checkout.status]}`}
                        >
                          <option value="Pending" className="bg-gray-800 text-yellow-400">Pending</option>
                          <option value="Processing" className="bg-gray-800 text-blue-400">Processing</option>
                          <option value="Shipped" className="bg-gray-800 text-indigo-400">Shipped</option>
                          <option value="Delivered" className="bg-gray-800 text-green-400">Delivered</option>
                          <option value="Cancelled" className="bg-gray-800 text-rose-400">Cancelled</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {new Date(checkout.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate(`/checkoutdetails/${checkout._id}`)}
                            className="inline-flex items-center px-3 py-1.5 rounded-lg bg-indigo-600/20 text-indigo-400 hover:bg-indigo-700/30 transition-colors"
                          >
                            <FaEye className="mr-1" /> View
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleDeleteCheckout(checkout._id)}
                            className="inline-flex items-center px-3 py-1.5 rounded-lg bg-rose-600/20 text-rose-400 hover:bg-rose-700/30 transition-colors"
                          >
                            <FaTrash className="mr-1" /> Delete
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </motion.div>

        {checkouts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="bg-gray-800/50 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-gray-700 inline-block">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-indigo-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-xl font-bold text-white mb-2">No Trendy Orders Found</h3>
              <p className="text-gray-400 mb-4">The order dimension seems to be empty</p>
            </div>
          </motion.div>
        )}
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