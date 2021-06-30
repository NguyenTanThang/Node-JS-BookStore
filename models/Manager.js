import mongoose from "mongoose";
import userRoles from "../constants/userRoles";

const managerSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        default: userRoles.Staff
    }
}, {
    timestamps: true
});

export default mongoose.model("managers", managerSchema);

