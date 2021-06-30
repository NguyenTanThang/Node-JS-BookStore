import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    book: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "books"
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "users"
    },
    star: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

export default mongoose.model("reviews", reviewSchema);

