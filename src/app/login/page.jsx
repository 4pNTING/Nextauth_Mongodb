"use client";
import React, { useState ,useEffect } from "react";
import Navbar from "../components/Navbar";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Image from "next/image";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      router.push("/welcome");
    }
  }, [session, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
  
    try {
      const res = await signIn("credentials", {
        redirect: false, // ป้องกัน NextAuth Redirect อัตโนมัติ
        email: email,
        password: password,
      });
  
      console.log("Sign-in Response:", res); // ดูผลลัพธ์ของ signIn()
  
      if (res.error) {
        setError("Invalid credentials");
        return;
      }
  
      // **ดึง Session เพื่อตรวจสอบ Token**
      const session = await fetch("/api/auth/session").then((res) => res.json());
      console.log("Session Data:", session); // แสดงข้อมูล Session ทั้งหมด
  
      // **เก็บ Token ไว้ใน localStorage**
      if (session?.accessToken && session?.refreshToken) {
        localStorage.setItem("accessToken", session.accessToken);
        localStorage.setItem("refreshToken", session.refreshToken);
  
        // แสดง Access Token และ Refresh Token
        console.log("Access Token:", session.accessToken);
        console.log("Refresh Token:", session.refreshToken);
      }
  
      router.push("/welcome");
    } catch (error) {
      setError(error.message);
      console.error("Login Error:", error); // แสดงข้อผิดพลาดใน console
    }
  };
  

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Section */}
      <div className="lg:w-1/2 w-full bg-blue-500 text-white flex flex-col justify-center items-center relative overflow-hidden px-8 py-12">
        {/* 3D Character */}
        <div className="relative w-full h-64">
  <Image
    src="/images/3dcharacter.png"
    alt="3D Character"
    fill
    className="object-contain"
    priority // โหลดภาพเร็วขึ้น
  />
</div>

        <div className="z-10 text-center">
          <h1 className="text-3xl lg:text-5xl font-bold mb-4">Welcome Back!</h1>
          <p className="text-sm lg:text-lg">
            Log in to access your account and explore amazing features.
          </p>
        </div>
      </div>

      {/* Right Section */}
      <div className="lg:w-1/2 w-full bg-white flex flex-col justify-center items-center p-8">
        <h2 className="text-2xl lg:text-3xl font-bold text-gray-700 mb-6">
          Sign In
        </h2>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4 w-full max-w-sm text-center">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="w-full max-w-sm">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block bg-gray-100 border border-gray-300 p-3 my-2 rounded-md w-full"
            type="email"
            placeholder="Enter your email"
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="block bg-gray-100 border border-gray-300 p-3 my-2 rounded-md w-full"
            type="password"
            placeholder="Enter your password"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-bold py-3 rounded-md hover:bg-blue-600 transition"
          >
            Sign In
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm lg:text-base text-gray-500">
            Don’t have an account?{" "}
            <Link
              href="/register"
              className="text-blue-500 hover:underline font-medium"
            >
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
