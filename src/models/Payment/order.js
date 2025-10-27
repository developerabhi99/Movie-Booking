const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    paymentGateway: {
      type: String,
      enum: ["RAZORPAY", "STRIPE", "PAYPAL",'MOCKPAY'],
      default: "MOCKPAY",
    },
    orderId: {
      type: String, // e.g., Razorpay order ID
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "INR",
    },
    status: {
      type: String,
      enum: ["CREATED", "PAID", "FAILED"],
      default: "CREATED",
    },
    paymentId: {
      type: String,
    },
    signature: {
      type: String,
    },
    paymentDetails: {
      type: Object, // store raw payment response
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Orders", orderSchema)

module.exports = Order;
