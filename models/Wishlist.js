import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema({
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
}, {
    timestamps: true
});

export default mongoose.model("wishlists", wishlistSchema);

