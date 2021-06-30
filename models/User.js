import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    validated: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

export default mongoose.model("users", bookSchema);

