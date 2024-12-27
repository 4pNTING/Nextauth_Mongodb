"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
function RegisterPage() {
  const router = useRouter(); // ใช้สำหรับเปลี่ยนเส้นทาง
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
 const {data: session} = useState();  

   useEffect(() => {
      if (session) {
        router.push("/welcome");
      }
    }, [session, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!username || !email || !password || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Invalid email format");
      return;
    }

    try {
      // Check if user already exists
      const resCheckUser = await fetch("http://localhost:3000/api/checkUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
const { user} = await resCheckUser();
      if (user) {
        // หากพบผู้ใช้
        return NextResponse.json(
            { message: "User already exists" },
            { status: 400 }
        );
    } else {
        // หากไม่พบผู้ใช้
        return NextResponse.json(
            { message: "User does not exist" },
            { status: 200 }
        );
    }
      if (!resCheckUser.ok) {
        const errorData = await resCheckUser.json();
        setError(errorData.message || "User already exists");
        return;
      }

      // Send registration request to the server
      const response = await fetch("http://localhost:3000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (response.ok) {
        // Registration successful
        setUsername("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setError("");
        setSuccess("Registration successful");

        // แสดงข้อความ success 3 วินาที แล้วเปลี่ยนเส้นทางไปที่ /login
        setTimeout(() => {
          setSuccess("");
          router.push("/login"); // เปลี่ยนเส้นทางไปหน้า Login
        }, 3000);

        console.log("Registration successful");
      } else {
        // Registration failed
        const errorData = await response.json();
        setError(errorData.error || "Registration failed");
        console.log("Registration failed", errorData);
      }
    } catch (error) {
      setError(error.message || "An unexpected error occurred");
      console.log("Error:", error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Register Page</h1>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-100 text-green-700 p-3 rounded-md mb-4">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="block bg-gray-300 p-2 my-2 rounded-md w-full"
            type="text"
            placeholder="Enter your name"
          />

          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block bg-gray-300 p-2 my-2 rounded-md w-full"
            type="email"
            placeholder="Enter your email"
          />

          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="block bg-gray-300 p-2 my-2 rounded-md w-full"
            type="password"
            placeholder="Enter your password"
          />

          <input
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="block bg-gray-300 p-2 my-2 rounded-md w-full"
            type="password"
            placeholder="Confirm your password"
          />

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition"
          >
            Sign Up
          </button>
        </form>

        <div className="text-center mt-4">
          Do you have an account?{" "}
          <Link href="/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
