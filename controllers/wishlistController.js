import Wishlist from "../models/Wishlist";

export const getAllWishLists = async (req, res) => {
  const wishlists = await Wishlist.find().sort([["createdAt", "descending"]]);

  res.send(wishlists);
};

export const getUserWishLists = async (req, res) => {
  const userID = req.user._id;
  const wishlists = await Wishlist.find({ user: userID })
    .populate("book")
    .populate("user")
    .exec();

  res.send(wishlists);
};

export const getWishListByUserIDAndBookID = async (req, res) => {
  const userID = req.user._id;
  const bookID = req.params.bookID;
  const wishlist = await Wishlist.findOne({ user: userID, book: bookID });

  res.send(wishlist);
};

export const addWishList = async (req, res) => {
  const userID = req.user._id;
  const { bookID } = req.body;

  const wishlist = new Wishlist({
    user: userID,
    book: bookID,
  });

  const createdWishlist = await wishlist.save();

  res.status(201).send(createdWishlist);
};

export const deleteWishList = async (req, res) => {
  const { bookID } = req.params;
  const userID = req.user._id;
  const wishlist = await Wishlist.findOne({ book: bookID, user: userID });

  if (!wishlist) {
    return res.status(404).send({ message: "Wishlist Record Not Found" });
  }

  const deletedWishlist = await Wishlist.findByIdAndDelete(wishlist._id);

  res.status(200).send(deletedWishlist);
};
