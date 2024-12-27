import { NextResponse } from "next/server";
import { connectMongoDb } from "../../../../lib/mongodb";
import User from "../../../../models/users";

export async function POST(req) {
    try {
        await connectMongoDb();
        const { email } = await req.json(); // ดึงข้อมูล email จาก request body
        
        // ค้นหาผู้ใช้ในฐานข้อมูลโดยใช้ email
        const user = await User.findOne({ email }).select("-_id");
         

        return NextResponse.json(user, { status: 200 });
       
    } catch (error) {
        console.error(error); // แสดงข้อผิดพลาดใน console
        return NextResponse.json(
            { error: "An error occurred" },
            { status: 500 }
        );
    }
}
