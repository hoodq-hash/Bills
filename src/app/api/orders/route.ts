import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Order from "@/models/Order";
import Product from "@/models/Product";
import type { AdminStats, CreateOrderPayload } from "@/types";
import { generateOrderNumber } from "@/utils/orderNumber";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const statsOnly = searchParams.get("stats") === "true";
    const orderNumber = searchParams.get("orderNumber");

    if (orderNumber) {
      const order = await Order.findOne({ orderNumber });
      if (!order) {
        return NextResponse.json({ message: "Order not found" }, { status: 404 });
      }
      return NextResponse.json(order);
    }

    if (statsOnly) {
      const [orders, productCount] = await Promise.all([
        Order.find({}),
        Product.countDocuments(),
      ]);

      const stats: AdminStats = {
        totalOrders: orders.length,
        pendingOrders: orders.filter((o) => o.status === "pending").length,
        paidOrders: orders.filter((o) => o.paymentStatus === "paid").length,
        totalRevenue: orders
          .filter((o) => o.paymentStatus === "paid")
          .reduce((sum, o) => sum + o.total, 0),
        totalProducts: productCount,
        totalCustomers: new Set(
          orders.map((o) => o.customer.email.toLowerCase())
        ).size,
      };

      return NextResponse.json(stats);
    }

    const orders = await Order.find({}).sort({ createdAt: -1 });
    return NextResponse.json(orders);
  } catch (error) {
    console.error("Orders fetch error:", error);
    return NextResponse.json({ message: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CreateOrderPayload;

    if (!body.items?.length || !body.email || !body.firstName || !body.lastName) {
      return NextResponse.json(
        { message: "Invalid order data" },
        { status: 400 }
      );
    }

    await dbConnect();

    const orderNumber = generateOrderNumber();

    const order = await Order.create({
      orderNumber,
      receiptNumber: orderNumber,
      status: "pending",
      paymentStatus: "pending",
      paymentMethod: body.paymentMethod,
      shippingMethod: body.shippingMethod,
      customer: {
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        phone: body.phone,
        company: body.company,
      },
      billing: {
        country: body.country,
        city: body.city,
        zipCode: body.zipCode,
      },
      shippingAddress: body.shippingAddress || undefined,
      items: body.items,
      subtotal: body.subtotal,
      shippingCost: body.shippingCost,
      discount: body.discount || 0,
      total: body.total,
      notes: body.notes,
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("Order create error:", error);
    return NextResponse.json({ message: "Failed to create order" }, { status: 500 });
  }
}
