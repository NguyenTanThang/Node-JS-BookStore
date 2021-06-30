import Review from "../models/Review";
import { addNewReviewToBook, removeReviewFromBook } from "../requests/reviewRequests";

export const getAllReviews = async (req, res) => {
  const reviews = await Review.find().sort([["createdAt", "descending"]]);

  res.send(reviews);
};

export const getBookReviews = async (req, res) => {
  const bookID = req.params.bookID;
  const reviews = await Review.find({ book: bookID })
    .populate("book")
    .populate("user")
    .exec();

  res.send(reviews);
};

export const addReview = async (req, res) => {
  const userID = req.user._id;
  const { bookID, star, title, body } = req.body;

  const review = new Review({
    user: userID,
    book: bookID,
    star, title, body
  });

  const createdReview = await review.save();
  await addNewReviewToBook(createdReview);

  res.status(201).send(createdReview);
};

export const deleteReview = async (req, res) => {
  const { reviewID } = req.params;
  const review = await Review.findById(reviewID);

  if (!review) {
    return res.status(404).send({ message: "Review Record Not Found" });
  }

  const deletedReview  = await Review.findByIdAndDelete(review._id);
  await removeReviewFromBook(deleteReview);

  res.status(200).send(deletedReview);
};
