import React from "react";
import { LayoutDashboard, Users, BookOpen, TrendingUp } from "lucide-react";

export default function TutorDashboard() {
  return (
    <div className="p-6 space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-black text-gray-800">
          Tutor Dashboard
        </h1>
        <p className="text-gray-500 text-sm">
          Overview of your teaching activity
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <div className="bg-white p-5 rounded-xl border flex items-center gap-4">
          <LayoutDashboard className="text-blue-600" />
          <div>
            <p className="text-gray-400 text-xs">Total Classes</p>
            <p className="text-xl font-bold">12</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border flex items-center gap-4">
          <Users className="text-green-600" />
          <div>
            <p className="text-gray-400 text-xs">Students</p>
            <p className="text-xl font-bold">48</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border flex items-center gap-4">
          <TrendingUp className="text-purple-600" />
          <div>
            <p className="text-gray-400 text-xs">Earnings</p>
            <p className="text-xl font-bold">$1,240</p>
          </div>
        </div>

      </div>

      {/* RECENT ACTIVITY */}
      <div className="bg-white p-5 rounded-xl border">
        <h2 className="font-bold mb-3">Recent Activity</h2>
        <p className="text-sm text-gray-500">
          No recent activity yet.
        </p>
      </div>

    </div>
  );
}