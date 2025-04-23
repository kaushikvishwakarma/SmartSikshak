import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from "@/components/ui/avatar";
import { useSelector } from "react-redux";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Info, Pencil } from "lucide-react";
import { useState } from "react";
import StudentProfileEditDialog from "./StudentprofileEdit.jsx";

export default function StudentProfile() {
  const user = useSelector((state) => state.auth.user);
  console.log(user);
  console.log("this is me");
  const [opendialog, setOpendialog] = useState(false);
  return (
    <div className="min-h-screen bg-[#f9f9ff] p-6">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Top Section */}
        <div className="flex flex-col md:flex-row items-start gap-6">
          {/* Profile Avatar Section */}
          <div className="flex flex-col items-center gap-2">
            <div className="relative group">
              <Avatar className="w-28 h-28 border-4 border-white shadow-md">
                <AvatarImage src={user?.profilePicture} />
                <AvatarFallback>NA</AvatarFallback>
              </Avatar>
              <div className="absolute bottom-0 right-0 bg-purple-600 p-1 rounded-full cursor-pointer group-hover:scale-110 transition-transform">
                <Pencil className="w-4 h-4 text-white" />
              </div>
            </div>
            <div className="text-center font-medium text-gray-800">{user?.name}</div>
          </div>

          {/* XP Overview Section */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4 space-y-1">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-sm text-blue-800">Total XP</h3>
                  <Info className="w-4 h-4 text-blue-500" />
                </div>
                <p className="text-xl font-bold text-blue-700">0 🧠</p>
              </CardContent>
            </Card>

            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4 space-y-1">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-sm text-blue-800">Highest Level</h3>
                  <Info className="w-4 h-4 text-blue-500" />
                </div>
                <p className="text-xl font-bold text-blue-700">NA</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Profile Details */}
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Profile Details</h2>
              <Button onClick={() => setOpendialog(true)}>Edit Profile</Button>
              <StudentProfileEditDialog
                user={user}
                open={opendialog}
                setOpen={setOpendialog}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-700">
              {/* Personal Details */}
              <div className="space-y-3">
                <Detail label="Name" value={user?.name ||" "} />
                <Detail label="Mobile No" value={user?.phone || " "} />
                <Detail label="Email" value={user?.email || " "} />
                <Detail label="City/Village/Town" value={user?.address || " "} />
              </div>

              {/* Academic Details */}
              <div className="space-y-3">
                <Detail label="FatherName" value={user?.fatherName || " "} />
                <Detail label="AadharNO" value={user?.aadharNumber || " "} />
                <Detail label="Board" value="STATE BOARD" />
                <Detail label="Exams" value="skills" />
                <Detail label="Language" value="English" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Section */}
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-md font-semibold text-gray-800">
                Performance as Doubt Solver
              </h3>
              <a
                href="#"
                className="text-sm text-blue-600 hover:underline"
              >
                Know more
              </a>
            </div>
            <p className="text-sm text-gray-600 italic">No performance data available.</p>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}

// Reusable Detail field
function Detail({ label, value }) {
  return (
    <div>
      <div className="text-xs uppercase text-gray-400">{label}</div>
      <div className="text-sm font-medium">{value}</div>
    </div>
  );
} 