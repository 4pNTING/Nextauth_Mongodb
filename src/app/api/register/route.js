import { NextResponse } from "next/server";
import { connectMongoDb } from "../../../../lib/mongodb"; // เส้นทางที่แก้ไข
import User from "../../../../models/users";
import bcrypt from "bcryptjs";

export async function POST(req) {
    try {
        const { username, email, password } = await req.json();
        const hashedPassword = await bcrypt.hash(password, 10);

        await connectMongoDb();
        await User.create({ username, email, password: hashedPassword });

        return NextResponse.json(
            { message: "Successfully registered" },
            { status: 201 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}
