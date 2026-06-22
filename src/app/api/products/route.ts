import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Product from "@/models/Product";
import { uploadToCloudinary } from "@/utils/cloudinary";

export const GET = async () => {
  try {
    await dbConnect();
    const products = await Product.find({}).sort({ createdAt: -1 });
    return NextResponse.json(products);
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ message: "Database Error" }, { status: 500 });
  }
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
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
    } = body;

    await dbConnect();

    let imageUrl = image as string | undefined;
    if (image && typeof image === "string" && image.startsWith("data:image")) {
      const uploadResult = await uploadToCloudinary(image, {
        publicId: `${title}-${Date.now()}`.replace(/\W+/g, "-"),
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
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
