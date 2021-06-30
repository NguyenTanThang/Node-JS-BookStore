import Book from "../models/Book";

export const addNewReviewToBook = async (createdReview) => {
  let book = await Book.findById(createdReview.book);
  let currentRatings = book.ratings;
  let currentNumberOfReviews = book.number_of_reviews;

  if (currentRatings > 0) {
    currentRatings = currentNumberOfReviews * currentRatings + createdReview.star;
    currentNumberOfReviews += 1;
    currentRatings = currentRatings / currentNumberOfReviews;
    await Book.findByIdAndUpdate(book._id, {
      ratings: currentRatings.toFixed(1),
      number_of_reviews: currentNumberOfReviews,
    });
    return;
  }

  currentRatings = createdReview.star;
  currentNumberOfReviews += 1;
  await Book.findByIdAndUpdate(book._id, {
    ratings: currentRatings.toFixed(1),
    number_of_reviews: currentNumberOfReviews,
  });
  return;
};

export const removeReviewFromBook = async (deletedReview) => {
  let book = await Book.findById(deletedReview.book);
  let currentRatings = book.ratings;
  let currentNumberOfReviews = book.number_of_reviews;

  currentRatings = currentNumberOfReviews * currentRatings - createdReview.star;
  currentNumberOfReviews -= 1;
  currentRatings = currentRatings / currentNumberOfReviews;

  book = await Book.findByIdAndUpdate(book._id, {
    ratings: currentRatings.toFixed(1),
    number_of_reviews: currentNumberOfReviews,
  });
};
