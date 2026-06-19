import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import dbConnect from "@/utils/dbConnect";
import Product from "@/models/Product";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    if (category) {
      const products = await Product.find({ category }).sort({ createdAt: -1 });
      return NextResponse.json(products);
    }

    const products = await Product.find({}).sort({ createdAt: -1 });
    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const {
      title,
      description,
      price,
      category,
      image,
      design,
      currency,
      mog,
      bills_quantity,
    } = await request.json();

    await dbConnect();

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    let imageUrl = image as string | undefined;
    if (image && typeof image === "string" && image.startsWith("data:image")) {
      const uploadResult = await cloudinary.uploader.upload(image, {
        public_id: `${title}-${Date.now()}`,
      });
      imageUrl = uploadResult.secure_url;
    }

    const product = await Product.create({
      title,
      description,
      price: Number(price),
      category,
      image: imageUrl,
      design,
      currency,
      mog,
      bills_quantity,
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
