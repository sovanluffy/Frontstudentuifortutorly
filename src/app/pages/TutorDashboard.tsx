import React from "react";

export default function TutorDashboard() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-black text-gray-800">
        Tutor Dashboard
      </h1>

      <p className="text-gray-500 mt-2">
        Welcome to your dashboard overview.
      </p>

      {/* You can later add charts, stats, earnings, etc */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">

        <div className="bg-white border rounded-xl p-5">
          <p className="text-gray-500 text-sm">Total Students</p>
          <p className="text-xl font-bold">48</p>
        </div>

        <div className="bg-white border rounded-xl p-5">
          <p className="text-gray-500 text-sm">Active Classes</p>
          <p className="text-xl font-bold">12</p>
        </div>

        <div className="bg-white border rounded-xl p-5">
          <p className="text-gray-500 text-sm">Earnings</p>
          <p className="text-xl font-bold">$1,240</p>
        </div>

      </div>
    </div>
  );
}