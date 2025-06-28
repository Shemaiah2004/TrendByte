import express from "express";
import { submitFeedback, getFeedbackByOrderId, updateFeedback, deleteFeedback, getAllFeedback, deleteAdminFeedback, getFeedbackByProductId, addFeedback, getFeedbacks, getAverageRating, editFeedback } from "../controllers/feedback.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

// Submit feedback for an order
router.post("/add/:orderId", submitFeedback);

router.get("/order/:orderId", getFeedbackByOrderId);

// PATCH /api/feedback/update/:orderId - Update feedback
router.patch("/update/:orderId", updateFeedback);

// DELETE /api/feedback/delete/:orderId - Delete feedback
router.delete("/delete/:orderId", deleteFeedback);

// GET /api/feedback - Get all feedback
router.get("/", getAllFeedback);

// DELETE /api/feedback/:feedbackId - Delete feedback
router.delete("/:feedbackId", deleteAdminFeedback);

router.get("/product/:productId", getFeedbackByProductId);

// Add feedback (protected route)
router.post("/add", verifyToken, addFeedback);

// Get all feedbacks (public route)
router.get("/all", getFeedbacks);

// Get average rating (public route)
router.get("/average", getAverageRating);

// Delete feedback (protected route)
router.delete("/delete/:id", verifyToken, deleteFeedback);

// Edit feedback (protected route)
router.put("/edit/:id", verifyToken, editFeedback);

export default router;