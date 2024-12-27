"use client";
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
// import css
import Style from "../welcome/style.css";

function WelcomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showAlert, setShowAlert] = useState(false); // State สำหรับแจ้งเตือน

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
    if (status === "authenticated") {
      setShowAlert(true); // แสดงแจ้งเตือนเมื่อ Login สำเร็จ
      setTimeout(() => setShowAlert(false), 3000); // ซ่อนแจ้งเตือนหลัง 3 วินาที
    }
  }, [status, router]);

  

  // Debug ค่า session และ status
  useEffect(() => {
    console.log("Session Data1:", session);
    console.log("Session Status1:", status);
  }, [session, status]);

  if (status === "loading") {
    return <p className="text-center mt-20">ກຳລັງໂຫຼດ...</p>;
  }

  if (!session) {
    return <p className="text-center mt-20">ທ່ານບໍ່ໄດ້ລ໋ອກອິນ.</p>;
  }

  const user = session.user;

  if (!user || !user.name || !user.email) {
    return <p className="text-center mt-20">ຂໍ້ມູນບໍ່ຄົບຖ້ວນ.</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* แจ้งเตือนเมื่อ Login สำเร็จ */}
      {showAlert && (
  <div
    role="alert"
    className="alert alert-success fixed top-20 right-4 flex items-center gap-4 bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded-lg shadow-lg z-50 animate-shake w-80"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6 shrink-0 stroke-current"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
    <span className="flex-1 text-center">
      {user.name} ທ່ານໄດ້ລ໋ອກອິນສໍາເລັດ!
    </span>
  </div>
)}



      {/* Main Content */}
      <div className="flex flex-1 items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl w-full">
          <h3 className="text-4xl font-bold text-blue-600 mb-6 text-center">
            ຍິນດີຕ້ອນຮັບ, {user.name}!
          </h3>
          <p className="text-gray-600 mb-6 text-center">
            ຂໍ້ມູນຂອງທ່ານມີດັ່ງນີ້:
          </p>

          {/* Table */}
          <table className="table-auto w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2 text-left">
                  ລາຍການ
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  ຂໍ້ມູນ
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-4 py-2">ຊື່</td>
                <td className="border border-gray-300 px-4 py-2">
                  {user.name}
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">ອີເມວ</td>
                <td className="border border-gray-300 px-4 py-2">
                  {user.email}
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">ສະຖານະ</td>
                <td className="border border-gray-300 px-4 py-2">
                  {user.role || "ບໍ່ມີຂໍ້ມູນ"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-400 py-4 text-center">
        <p>
          © {new Date().getFullYear()} ບໍລິສັດຂອງທ່ານ. ສິດທິທັງໝົດສະຫງວນ.
        </p>
      </footer>
    </div>
  );
}

export default WelcomePage;
