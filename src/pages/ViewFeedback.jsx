import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { FaStar } from "react-icons/fa";

export default function ViewFeedback() {
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const res = await fetch(`/api/feedback/${id}`);
        const data = await res.json();
        
        if (!data.success) {
          throw new Error(data.message || "Failed to fetch feedback");
        }

        setFeedback(data.feedback);
      } catch (error) {
        setError(error.message);
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this feedback?")) {
      return;
    }

    try {
      const res = await fetch(`/api/feedback/delete/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      
      if (!data.success) {
        throw new Error(data.message || "Failed to delete feedback");
      }

      toast.success("Feedback deleted successfully");
      navigate("/feedback");
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Feedback Details</h1>
          <div className="flex gap-4">
            {currentUser.id === feedback.userId && (
              <>
                <button
                  onClick={() => navigate(`/feedback/edit/${id}`)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </>
            )}
            <button
              onClick={() => navigate("/feedback")}
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
            >
              Back
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">Rating</h2>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  className={`text-2xl ${
                    star <= feedback.rating ? "text-yellow-400" : "text-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Comment</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{feedback.comment}</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Submitted By</h2>
            <p className="text-gray-700">{feedback.userName}</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Date</h2>
            <p className="text-gray-700">
              {new Date(feedback.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 