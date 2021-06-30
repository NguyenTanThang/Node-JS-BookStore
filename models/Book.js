import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    ratings: {
        type: Number,
        default: 0
    },
    number_of_reviews: {
        type: Number,
        default: 0
    },
    description: {
        type: String,
        required: true
    },
    image_url: {
        type: String,
        required: true
    },
    categories: {
        type: [String],
        default: "Pending"
    }
}, {
    timestamps: true
});

export default mongoose.model("books", bookSchema);

