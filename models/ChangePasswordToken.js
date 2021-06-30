import mongoose from "mongoose";

const schema = new mongoose.Schema({
    customerID: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true
    },
    expiryDate: {
        type: Date,
        required: true,
    },
    last_modified_date: {
        type: Date,
        default: Date.now()
    },
    created_date: {
        type: Date,
        default: Date.now()
    }
});

export default mongoose.model("change-password-tokens", schema);