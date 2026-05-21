import express from 'express';
import {addReview,getCompanyReviews, likeReview, dislikeReview, addComment} from '../controllers/review.controller.js';

const router = express.Router();

// Add review route
router.post('/add', addReview);
// Get company reviews route
router.get('/company/:companyId', getCompanyReviews);

// Like review
router.post('/:reviewId/like', likeReview);
// Dislike review
router.post('/:reviewId/dislike', dislikeReview);
// Add comment
router.post('/:reviewId/comment', addComment);
export default router;