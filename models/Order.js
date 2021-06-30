import mongoose from "mongoose";
import orderStatus from "../constants/orderStatus";

const bookSchema = new mongoose.Schema(
  {
    orderItems: {
      type: [
        {
          book: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "books",
          },
          image_url: String,
          name: String,
          author: String,
          price: Number,
          quantity: Number,
          sub_total: Number,
        },
      ],
      required: true,
    },
    shippingAddress: {
      fullName: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      postalCode: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    paymentResult: {
      id: {
        type: String,
      },
      status: {
        type: String,
      },
      update_time: {
        type: String,
      },
      email_address: {
        type: String,
      },
    },
    itemsPrice: {
      type: Number,
      required: true,
    },
    shippingPrice: {
      type: Number,
      required: true,
    },
    taxPrice: {
      type: Number,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "users",
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    isDelivered: {
      type: Boolean,
      default: false,
    },
    deliveredAt: {
      type: Date,
    },
    additionalNote: {
      type: String,
    },
    status: {
      type: String,
      default: orderStatus.Pending
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("orders", bookSchema);
