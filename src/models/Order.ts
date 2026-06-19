import mongoose, { Schema, Model } from "mongoose";
import type { Order, OrderStatus, PaymentStatus } from "@/types";

const cartItemSchema = new Schema(
  {
    _id: String,
    title: String,
    image: String,
    quantity: Number,
    selectedAmount: String,
    price: Number,
  },
  { _id: false }
);

const orderSchema = new Schema<Order>(
  {
    orderNumber: { type: String, required: true, unique: true },
    receiptNumber: { type: String, required: true, unique: true },
    status: {
      type: String,
      enum: ["pending", "paid", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    paymentMethod: { type: String, required: true },
    shippingMethod: { type: String, required: true },
    customer: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      company: String,
    },
    billing: {
      country: { type: String, required: true },
      city: { type: String, required: true },
      zipCode: { type: String, required: true },
    },
    shippingAddress: String,
    items: [cartItemSchema],
    subtotal: { type: Number, required: true },
    shippingCost: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true },
    notes: String,
  },
  { timestamps: true }
);

const OrderModel: Model<Order> =
  mongoose.models.Order || mongoose.model<Order>("Order", orderSchema);

export default OrderModel;
