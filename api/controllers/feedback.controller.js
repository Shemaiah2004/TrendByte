import Feedback from "../models/feedback.model.js";
import Checkout from "../models/checkout.model.js";
import { errorHandler } from "../utils/error.js";

// Submit Feedback
export const submitFeedback = async (req, res) => {
  try {
    const { orderId } = req.params; // Get orderId from URL params
    const { feedback, rating, userId } = req.body; // Get data from request body

    // Validate required fields
    if (!feedback || !userId) {
      return res.status(400).json({ message: "Feedback and userId are required" });
    }

    // Check if the order exists
    const order = await Checkout.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if the order is delivered
    if (order.status !== "Delivered") {
      return res.status(400).json({ message: "Feedback can only be submitted for delivered orders" });
    }

    // Create a new feedback document
    const newFeedback = new Feedback({
      orderId,
      userId,
      feedback,
      rating: rating || 5, // Default to 5 if no rating is provided
    });

    // Save the feedback to the database
    await newFeedback.save();

    // Send success response
    res.status(201).json({
      message: "Feedback submitted successfully",
      feedback: newFeedback,
    });
  } catch (error) {
    console.error("Error submitting feedback:", error);
    res.status(500).json({ message: "Failed to submit feedback" });
  }
};

export const getFeedbackByOrderId = async (req, res) => {
  try {
    const { orderId } = req.params;

    // Find feedback for the given orderId
    const feedback = await Feedback.findOne({ orderId }).populate("userId", "name email");

    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found for this order" });
    }

    // Send success response
    res.status(200).json(feedback);
  } catch (error) {
    console.error("Error fetching feedback:", error);
    res.status(500).json({ message: "Failed to fetch feedback" });
  }
};

// Get All Feedback for a User
export const getFeedbackByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find all feedback for the given userId
    const feedback = await Feedback.find({ userId }).populate("orderId", "status totalPrice"); // Populate order details

    if (!feedback || feedback.length === 0) {
      return res.status(404).json({ message: "No feedback found for this user" });
    }

    // Send success response
    res.status(200).json(feedback);
  } catch (error) {
    console.error("Error fetching feedback:", error);
    res.status(500).json({ message: "Failed to fetch feedback" });
  }
};

// Update Feedback
export const updateFeedback = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { feedback, rating } = req.body;

    // Validate required fields
    if (!feedback || !rating) {
      return res.status(400).json({ message: "Feedback and rating are required" });
    }

    // Find and update the feedback
    const updatedFeedback = await Feedback.findOneAndUpdate(
      { orderId },
      { feedback, rating },
      { new: true } // Return the updated document
    );

    if (!updatedFeedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    res.status(200).json({ message: "Feedback updated successfully", feedback: updatedFeedback });
  } catch (error) {
    console.error("Error updating feedback:", error);
    res.status(500).json({ message: "Failed to update feedback" });
  }
};

// Delete Feedback
export const deleteFeedback = async (req, res, next) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    
    if (!feedback) {
      return next(errorHandler(404, "Feedback not found"));
    }

    // Check if the user is the owner of the feedback
    if (feedback.userId.toString() !== req.session.user.id) {
      return next(errorHandler(403, "You can only delete your own feedback"));
    }

    await Feedback.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      message: "Feedback deleted successfully"
    });
  } catch (error) {
    next(error);
  }
};

// Get all feedback
export const getAllFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find()
      .populate("userId", "username email") // Populate user details
      .populate("orderId", "status totalPrice"); // Populate order details

    res.status(200).json(feedback);
  } catch (error) {
    console.error("Error fetching feedback:", error);
    res.status(500).json({ message: "Failed to fetch feedback" });
  }
};

// Delete feedback
export const deleteAdminFeedback = async (req, res) => {
  try {
    const { feedbackId } = req.params;

    // Find and delete the feedback
    const deletedFeedback = await Feedback.findByIdAndDelete(feedbackId);

    if (!deletedFeedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    res.status(200).json({ message: "Feedback deleted successfully", feedback: deletedFeedback });
  } catch (error) {
    console.error("Error deleting feedback:", error);
    res.status(500).json({ message: "Failed to delete feedback" });
  }
};

// Get feedback for a product by searching for the product ID in orders
export const getFeedbackByProductId = async (req, res) => {
  try {
    const { productId } = req.params;

    // Find orders that contain the product ID
    const orders = await Checkout.find({ "items.productId": productId });

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found for this product" });
    }

    // Extract order IDs
    const orderIds = orders.map((order) => order._id);

    // Find feedback for these orders
    const feedback = await Feedback.find({ orderId: { $in: orderIds } })
      .populate("userId", "username") // Populate user details
      .populate("orderId", "status"); // Populate order details (optional)

    res.status(200).json(feedback);
  } catch (error) {
    console.error("Error fetching feedback:", error);
    res.status(500).json({ message: "Failed to fetch feedback" });
  }
};

// Add feedback
export const addFeedback = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const userId = req.session.user.id;
    const userName = req.session.user.username;

    const newFeedback = new Feedback({
      userId,
      userName,
      rating,
      comment
    });

    await newFeedback.save();
    res.status(201).json({
      success: true,
      message: "Feedback added successfully",
      feedback: newFeedback
    });
  } catch (error) {
    next(error);
  }
};

// Get all feedbacks
export const getFeedbacks = async (req, res, next) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.status(200).json(feedbacks);
  } catch (error) {
    next(error);
  }
};

// Get average rating
export const getAverageRating = async (req, res, next) => {
  try {
    const result = await Feedback.aggregate([
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          totalFeedbacks: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      averageRating: result[0]?.averageRating || 0,
      totalFeedbacks: result[0]?.totalFeedbacks || 0
    });
  } catch (error) {
    next(error);
  }
};

// Edit feedback
export const editFeedback = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const feedbackId = req.params.id;
    const userId = req.session.user.id;

    const feedback = await Feedback.findById(feedbackId);
    
    if (!feedback) {
      return next(errorHandler(404, "Feedback not found"));
    }

    // Check if the user is the owner of the feedback
    if (feedback.userId.toString() !== userId) {
      return next(errorHandler(403, "You can only edit your own feedback"));
    }

    const updatedFeedback = await Feedback.findByIdAndUpdate(
      feedbackId,
      { rating, comment },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Feedback updated successfully",
      feedback: updatedFeedback
    });
  } catch (error) {
    next(error);
  }
};