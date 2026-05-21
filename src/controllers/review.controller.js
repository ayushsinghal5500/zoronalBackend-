import Review from "../models/review.model.js";
import Company from "../models/company.model.js";

export const addReview = async (req, res) => {
  try {
    const {companyId,fullName,subject,reviewText,rating,} = req.body;

    // Validation
    if (!companyId ||!fullName ||!subject ||!reviewText ||!rating) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check company exists
    const company = await Company.findById(companyId);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    // Create review
    await Review.create({
      companyId,
      fullName,
      subject,
      reviewText,
      rating,
    });

    // Calculate Average Rating
    const result = await Review.aggregate([
      {
        $match: {
          companyId: company._id,
        },
      },
      {
        $group: {
          _id: "$companyId",
          averageRating: {
            $avg: "$rating",
          },
          totalReviews: {
            $sum: 1,
          },
        },
      },
    ]);

    // Update company
    company.averageRating = result[0]?.averageRating || 0;
    company.totalReviews = result[0]?.totalReviews || 0;

    await company.save();

    return res.status(201).json({
      success: true,
      message: "Review added successfully",
    });

  } catch (error) {
    console.log("Add Review Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const likeReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { action } = req.body; // 'like' or 'unlike'

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    if (action === 'unlike') {
      review.likes = Math.max(0, review.likes - 1);
    } else {
      review.likes += 1;
    }
    
    await review.save();

    return res.status(200).json({
      success: true,
      message: action === 'unlike' ? "Review unliked" : "Review liked",
      data: review,
    });
  } catch (error) {
    console.log("Like Review Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const dislikeReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { action } = req.body; // 'dislike' or 'undislike'

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    if (action === 'undislike') {
      review.dislikes = Math.max(0, review.dislikes - 1);
    } else {
      review.dislikes += 1;
    }

    await review.save();

    return res.status(200).json({
      success: true,
      message: action === 'undislike' ? "Review undisliked" : "Review disliked",
      data: review,
    });
  } catch (error) {
    console.log("Dislike Review Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const addComment = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { fullName, commentText } = req.body;

    if (!fullName || !commentText) {
      return res.status(400).json({
        success: false,
        message: "Full name and comment text are required",
      });
    }

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    review.comments.push({
      fullName,
      commentText,
    });

    await review.save();

    return res.status(201).json({
      success: true,
      message: "Comment added successfully",
      data: review,
    });
  } catch (error) {
    console.log("Add Comment Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getCompanyReviews = async (req, res) => {
  try {
    const { companyId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const totalReviews = await Review.countDocuments({ companyId });
    const reviews = await Review.find({
      companyId,
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    return res.status(200).json({
      success: true,
      total: totalReviews,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(totalReviews / limitNum),
      data: reviews,
    });

  } catch (error) {
    console.log("Get Reviews Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};