"use client";
import Image from "next/image";
import NavbarHome from "./components/Navbar";
import { useSession } from "next-auth/react";


export default function Home() {
  const { data: session } = useSession();
  return (
    <div >
     <NavbarHome session={session} />
    <div className="container mx-auto">
      <div className="flex justify-center items-center h-screen"></div>
        <div className="text-center bg-slate-600">
          <h1 className="text-4xl font-bold mb-4">Welcome to NextAuth</h1>
          <p className="text-lg text-blue-800">A secure authentication solution for Next.js</p>
    </div>
   
    </div>
    </div>
  );
}
