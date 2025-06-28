import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaStar, FaPlus, FaTrash, FaEye } from "react-icons/fa";

export default function Feedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [averageRating, setAverageRating] = useState(0);
  const [totalFeedbacks, setTotalFeedbacks] = useState(0);
  const [editingFeedback, setEditingFeedback] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  // Fetch all feedbacks
  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const res = await fetch("/api/feedback/all");
        const data = await res.json();
        setFeedbacks(data);
      } catch (error) {
        toast.error("Failed to fetch feedbacks");
      }
    };

    const fetchAverageRating = async () => {
      try {
        const res = await fetch("/api/feedback/average");
        const data = await res.json();
        setAverageRating(data.averageRating);
        setTotalFeedbacks(data.totalFeedbacks);
      } catch (error) {
        toast.error("Failed to fetch average rating");
      }
    };

    fetchFeedbacks();
    fetchAverageRating();
  }, []);

  // Handle feedback submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingFeedback) {
        // Edit existing feedback
        const res = await fetch(`/api/feedback/edit/${editingFeedback._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ rating, comment }),
          credentials: "include",
        });
        const data = await res.json();
        if (data.success) {
          toast.success("Feedback updated successfully");
          setEditingFeedback(null);
        }
      } else {
        // Add new feedback
        const res = await fetch("/api/feedback/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ rating, comment }),
          credentials: "include",
        });
        const data = await res.json();
        if (data.success) {
          toast.success("Feedback submitted successfully");
        }
      }
      
      // Reset form and hide it
      setRating(0);
      setComment("");
      setShowForm(false);
      
      // Refresh feedbacks
      const updatedFeedbacks = await fetch("/api/feedback/all").then(res => res.json());
      setFeedbacks(updatedFeedbacks);
      
      // Refresh average rating
      const updatedRating = await fetch("/api/feedback/average").then(res => res.json());
      setAverageRating(updatedRating.averageRating);
      setTotalFeedbacks(updatedRating.totalFeedbacks);
    } catch (error) {
      toast.error(editingFeedback ? "Failed to update feedback" : "Failed to submit feedback");
    }
  };

  // Handle edit button click
  const handleEdit = (feedback) => {
    navigate(`/feedback/edit/${feedback._id}`);
  };

  // Handle view button click
  const handleView = (feedback) => {
    navigate(`/feedback/view/${feedback._id}`);
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditingFeedback(null);
    setRating(0);
    setComment("");
    setShowForm(false);
  };

  // Handle feedback deletion
  const handleDelete = async (feedbackId) => {
    if (window.confirm("Are you sure you want to delete this feedback?")) {
      try {
        const res = await fetch(`/api/feedback/delete/${feedbackId}`, {
          method: "DELETE",
          credentials: "include",
        });
        const data = await res.json();
        if (data.success) {
          toast.success("Feedback deleted successfully");
          // Refresh feedbacks
          const updatedFeedbacks = await fetch("/api/feedback/all").then(res => res.json());
          setFeedbacks(updatedFeedbacks);
          // Refresh average rating
          const updatedRating = await fetch("/api/feedback/average").then(res => res.json());
          setAverageRating(updatedRating.averageRating);
          setTotalFeedbacks(updatedRating.totalFeedbacks);
        }
      } catch (error) {
        toast.error("Failed to delete feedback");
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Header with Add Button */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Customer Feedback</h1>
        {currentUser && !showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center gap-2"
          >
            <FaPlus /> Add Feedback
          </button>
        )}
      </div>

      {/* Average Rating Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">Overall Rating</h2>
        <div className="flex items-center gap-2">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                className={`text-2xl ${
                  star <= averageRating ? "text-yellow-400" : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-lg font-semibold">
            {averageRating.toFixed(1)} ({totalFeedbacks} reviews)
          </span>
        </div>
      </div>

      {/* Feedback Form */}
      {currentUser && showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">
            {editingFeedback ? "Edit Review" : "Write a Review"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={star}
                    className={`text-2xl cursor-pointer ${
                      star <= rating ? "text-yellow-400" : "text-gray-300"
                    }`}
                    onClick={() => setRating(star)}
                  />
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comment
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full p-2 border rounded-md"
                rows="4"
                required
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                {editingFeedback ? "Update Review" : "Submit Review"}
              </button>
              <button
                type="button"
                onClick={handleCancelEdit}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Feedback List */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">All Reviews</h2>
        <div className="space-y-4">
          {feedbacks.map((feedback) => (
            <div key={feedback._id} className="border-b pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar
                          key={star}
                          className={`text-lg ${
                            star <= feedback.rating
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-semibold">{feedback.userName}</span>
                  </div>
                  <p className="mt-2 text-gray-600">{feedback.comment}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(feedback.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleView(feedback)}
                    className="text-blue-500 hover:text-blue-700 flex items-center gap-1"
                  >
                    <FaEye /> View
                  </button>
                  {currentUser && currentUser.id === feedback.userId && (
                    <>
                      <button
                        onClick={() => handleEdit(feedback)}
                        className="text-green-500 hover:text-green-700 flex items-center gap-1"
                      >
                        <FaPlus /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(feedback._id)}
                        className="text-red-500 hover:text-red-700 flex items-center gap-1"
                      >
                        <FaTrash /> Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 