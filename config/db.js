import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URL || "mongodb://localhost/book-store-api", {
            useCreateIndex: true,
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log(`Database connected on ${conn.connection.host}:${conn.connection.port}`);
    } catch (error) {
        console.log(error.message);
    }
}