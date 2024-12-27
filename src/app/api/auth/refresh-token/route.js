import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    // อ่าน Refresh Token จาก request body
    const { refreshToken } = await req.json();

    if (!refreshToken) {
      return new Response(JSON.stringify({ error: "Refresh Token is required" }), {
        status: 400,
      });
    }

    // ตรวจสอบ Refresh Token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    // สร้าง Access Token ใหม่
    const newAccessToken = jwt.sign(
      { id: decoded.id, email: decoded.email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" } // Access Token มีอายุ 15 นาที
    );

    return new Response(
      JSON.stringify({ accessToken: newAccessToken }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Refresh Token Error:", error.message);
    return new Response(
      JSON.stringify({ error: "Invalid or expired Refresh Token" }),
      { status: 403 }
    );
  }
}
