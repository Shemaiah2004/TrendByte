import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { employeeLogout } from "../../redux/employee/employeeSlice";

export default function ViewFeedback() {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Fetch all feedback
  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await fetch("/api/feedback");
        if (!response.ok) {
          throw new Error("Failed to fetch feedback");
        }
        const data = await response.json();
        setFeedback(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, []);

  // Handle feedback deletion
  const handleDeleteFeedback = async (feedbackId) => {
    try {
      const response = await fetch(`/api/feedback/${feedbackId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete feedback");
      }

      // Remove the deleted feedback from the state
      setFeedback((prevFeedback) =>
        prevFeedback.filter((fb) => fb._id !== feedbackId)
      );

      alert("Feedback deleted successfully!");
    } catch (error) {
      console.error("Error deleting feedback:", error);
      alert("Failed to delete feedback");
    }
  };

  // Handle sign out
  const handleSignOut = () => {
    // Clear the token from localStorage
    localStorage.removeItem("token");

    // Dispatch the employee logout action
    dispatch(employeeLogout());

    // Navigate to the employee login page
    navigate("/employeeLogin");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg font-semibold text-[#161A1D]">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg font-semibold text-[#660708]">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F3F4]">
      {/* Header */}
      <header className="bg-[#161A1D] shadow-lg">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[#F5F3F4]">Employee Dashboard</h1>
          <button
            onClick={handleSignOut}
            className="bg-[#660708] text-[#F5F3F4] px-6 py-2 rounded-lg hover:bg-[#7A0B0B] focus:outline-none focus:ring-2 focus:ring-[#660708] focus:ring-offset-2 transition-all"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-extrabold text-[#161A1D] mb-8">All Feedback</h1>

        {/* Feedback Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-[#161A1D]">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-[#F5F3F4] uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-[#F5F3F4] uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-[#F5F3F4] uppercase tracking-wider">
                  Feedback
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-[#F5F3F4] uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-[#F5F3F4] uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-[#F5F3F4] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5F3F4]">
              {feedback.map((fb) => (
                <tr
                  key={fb._id}
                  className="hover:bg-[#F5F3F4] transition-colors duration-200"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#161A1D]">
                    {fb.userId?.username || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#161A1D]">
                    {fb.orderId?._id || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#161A1D]">
                    {fb.feedback}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#161A1D]">
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, index) => (
                        <span
                          key={index}
                          className={`text-2xl ${
                            index < fb.rating ? "text-yellow-400" : "text-gray-300"
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#161A1D]">
                    {new Date(fb.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => handleDeleteFeedback(fb._id)}
                      className="bg-[#660708] text-[#F5F3F4] px-4 py-2 rounded-md hover:bg-[#7A0B0B] focus:outline-none focus:ring-2 focus:ring-[#660708] focus:ring-offset-2 transition-all"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}