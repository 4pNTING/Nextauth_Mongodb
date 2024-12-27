"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

function Navbar() {
  const { data: session } = useSession(); // ดึงข้อมูล session เพื่อตรวจสอบสถานะล็อกอิน

  return (
    <nav className="bg-gradient-to-r from-gray-800 to-gray-900 shadow-md py-4">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center">
          {/* โลโก้ */}
          <Link
            href="/"
            className="text-2xl font-bold text-white hover:text-blue-400 transition duration-300"
          >
            NextAuth
          </Link>

          {/* เมนู */}
          <ul className="flex items-center space-x-4">
            {session ? (
              <>
                {/* แสดงปุ่ม Logout เมื่อผู้ใช้ล็อกอิน */}
                <li>
                  <button
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="text-white bg-red-600 hover:bg-red-700 border border-red-600 rounded-md px-5 py-2 font-medium transition duration-300"
                  >
                    Sign Out
                  </button>
                </li>
              </>
            ) : (
              <>
                {/* แสดงปุ่ม Login และ Register เมื่อผู้ใช้ไม่ได้ล็อกอิน */}
                <li>
                  <Link
                    href="/register"
                    className="text-white hover:text-blue-400 transition duration-300 font-medium px-4 py-2"
                  >
                    Register
                  </Link>
                </li>
                <li>
                  <Link
                    href="/login"
                    className="text-white hover:text-blue-400 transition duration-300 font-medium px-4 py-2"
                  >
                    Login
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
