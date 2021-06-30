import data from "../data.js";
import Book from "../models/Book.js";

export const seedBooks = async (req, res) => {
  //await Book.remove({});
  const createdProducts = await Book.insertMany(data.products);
  res.send({ createdProducts });
};

export const getAllBooks = async (req, res) => {
  const books = await Book.find({}).sort([["createdAt", -1]]).exec();
  res.send(books);
};

export const getBooksRecSection = async (req, res) => {
  const newReleasesBooks = await Book.find({}).sort([["createdAt", -1]]).limit(5).exec();
  const topRatingsBooks  = await Book.find({}).sort([["ratings", -1]]).limit(5).exec();
  res.send({
    newReleasesBooks,
    topRatingsBooks
  });
};

export const getBooksRandom = async (req, res) => {
  const randomBooks = await Book.aggregate([{$sample: {size: 5}}]);
  res.send(randomBooks);
};

export const getBookByID = async (req, res) => {
  const bookID = req.params.bookID;
  const book = await Book.findById(bookID);

  if (!book) {
    return res.status(404).send({ message: "Book Not Found" });
  }

  res.send(book);
};

export const addBook = async (req, res) => {
  const { name, author, price, description, image_url, categories } = req.body;

  const book = new Book({
    name,
    author,
    price,
    description,
    image_url,
    categories,
  });

  const createdBook = await book.save();

  res.status(201).send(createdBook);
};

export const editBook = async (req, res) => {
    const bookID = req.params.bookID;
    const book = await Book.findById(bookID);

    if (!book) {
        res.status(404).send({message: "Book Not Found"});
    }
  
    const updatedBook = await Book.findByIdAndUpdate(bookID, {
        ...req.body
    });
  
    res.status(200).send(updatedBook);
  };

  export const deleteBook = async (req, res) => {
    const bookID = req.params.bookID;
    const book = await Book.findById(bookID);

    if (!book) {
        res.status(404).send({message: "Book Not Found"});
    }
  
    const deletedBook = await Book.findByIdAndDelete(bookID);
  
    res.status(200).send(deletedBook);
  };
