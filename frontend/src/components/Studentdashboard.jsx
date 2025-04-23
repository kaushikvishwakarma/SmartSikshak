import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Bell } from "lucide-react";

export default function StudentDashboard() {
  return (
    <div className="p-6 space-y-6 bg-[#f4f4fc] min-h-screen">
      
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <input
          type="text"
          placeholder="Search..."
          className="rounded-full px-4 py-2 w-1/3 shadow-sm"
        />
        <div className="flex items-center gap-4">
          <Bell />
          <div className="text-right">
            <div className="font-semibold">Kaushik</div>
            <div className="text-xs text-gray-500">3rd Year</div>
          </div>
          <Avatar>
            <AvatarImage src="/profile.jpg" />
            <AvatarFallback>KV</AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Welcome Banner */}
      <div className="bg-purple-500 text-white rounded-xl p-6 flex justify-between items-center shadow-md">
        <div>
          <h2 className="text-xl font-semibold">Welcome back, Kaushik!</h2>
          <p>Always stay updated in your student portal</p>
        </div>
        <img
          src="/graduation-illustration.png"
          alt="Illustration"
          className="w-40"
        />
      </div>

      {/* Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <InfoCard title="Attendance Status" value="92%" />
        <InfoCard title="Assignments Due" value="3" />
        <InfoCard title="Class Recordings" value="12 Videos" />
      </div>

      {/* Lower Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg mb-2">Study Material</h3>
            <ul className="text-sm text-gray-700 space-y-2">
              <li>📘 Object Oriented Programming - PDF</li>
              <li>📗 DBMS - Video Lectures</li>
              <li>📙 Math - Notes</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg mb-2">Latest Discussions</h3>
            <ul className="text-sm text-gray-700 space-y-2">
              <li>👨‍🏫 Teacher replied to: “Doubt in Binary Tree Traversal”</li>
              <li>🧑‍🎓 You posted: “What is the difference between JOIN and UNION?”</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function InfoCard({ title, value }) {
  return (
    <Card className="bg-white shadow-md">
      <CardContent className="p-6 text-center">
        <h4 className="text-md font-medium text-gray-600">{title}</h4>
        <p className="text-2xl font-bold text-purple-700">{value}</p>
      </CardContent>
    </Card>
  );
}
