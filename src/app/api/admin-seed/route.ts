import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import dbConnect from "@/utils/dbConnect";

export const GET = async () => {
  try {
    await dbConnect();

    const existingAdmin = await User.findOne({
      name: "adminclonecards",
      role: "admin",
    });

    if (existingAdmin) {
      return NextResponse.json({ message: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash("adminclonecards@123", 10);
    const newAdmin = await User.create({
      name: "adminclonecards",
      password: hashedPassword,
      role: "admin",
    });

    return NextResponse.json({
      message: "Admin created successfully",
      admin: { name: newAdmin.name, role: newAdmin.role },
    });
  } catch (error) {
    console.error("Error creating admin:", error);
    return NextResponse.json(
      { message: "Error creating admin" },
      { status: 500 }
    );
  }
};
