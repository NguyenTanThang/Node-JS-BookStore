import orderStatus from "../constants/orderStatus.js";
import Order from "../models/Order.js";

export const getAllOrders = async (req, res) => {
    const orders = await Order.find()
      .sort([["createdAt", -1]])
      .populate("user")
      .exec();
    res.send(orders);
  };

export const getOrdersDashboard = async (req, res) => {
  const orders = await Order.find({status: orderStatus.Completed})
    .sort([["createdAt", 1]])
    .populate("user")
    .exec();
  res.send(orders);
};

export const editBook = async (req, res) => {
  const bookID = req.params.bookID;
  const book = await Book.findById(bookID);

  if (!book) {
    res.status(404).send({ message: "Book Not Found" });
  }

  const updatedBook = await Book.findByIdAndUpdate(bookID, {
    ...req.body,
  });

  res.status(200).send(updatedBook);
};
