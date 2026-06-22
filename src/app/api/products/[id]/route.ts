import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Product from "@/models/Product";
import { uploadToCloudinary, deleteFromCloudinary } from "@/utils/cloudinary";

type RouteContext = { params: Promise<{ id: string }> };

export const GET = async (_req: NextRequest, { params }: RouteContext) => {
  try {
    const { id } = await params;
    await dbConnect();
    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ message: "Database Error" }, { status: 500 });
  }
};

export const PUT = async (req: NextRequest, { params }: RouteContext) => {
  try {
    const { id } = await params;
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
    } = await req.json();

    await dbConnect();

    let imageUrl = image as string;
    if (image && typeof image === "string" && image.startsWith("data:image")) {
      const uploadResult = await uploadToCloudinary(image, {
        publicId: `${title}-${Date.now()}`.replace(/\W+/g, "-"),
      });
      imageUrl = uploadResult.secure_url;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        title,
        description,
        price: Number(price),
        category,
        image: imageUrl,
        design,
        currency,
        mog,
        bills_quantity,
      },
      { new: true }
    );

    if (!updatedProduct) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("Update Error:", error);
    return NextResponse.json({ message: "Update Error" }, { status: 500 });
  }
};

export const DELETE = async (_req: NextRequest, { params }: RouteContext) => {
  try {
    const { id } = await params;
    await dbConnect();
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    if (product.image) {
      await deleteFromCloudinary(product.image);
    }

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Delete Error:", error);
    return NextResponse.json({ message: "Delete Error" }, { status: 500 });
  }
};
