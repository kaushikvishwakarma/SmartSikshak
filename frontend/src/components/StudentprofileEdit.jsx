import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import axios from 'axios'
export default function StudentProfileEditDialog({ user, open, setOpen }) {
  const [formData, setFormData] = useState({
    fatherName: user.fatherName || "",
    motherName: user.motherName || "",
    address: user.address || "",
    dob: user.dob || "",
    gender: user.gender || "",
    aadharNumber: user.aadharNumber || "",
    class: user.class || "",
  })

  const [profilePictureFile, setProfilePictureFile] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    setProfilePictureFile(e.target.files[0])
  }

  const handleSave = async () => {
    setLoading(true)
    const body = new FormData()
  
    Object.entries(formData).forEach(([key, value]) => {
      if (value) body.append(key, value)
    })
  
    if (profilePictureFile) {
      body.append("profilePicture", profilePictureFile)
    }
  
    try {
      console.log("User object:", user)
      console.log("User ID for API call:", user?.id)
  
      const res = await axios.post(
        `http://localhost:8080/api/users/${user?.id}/upload-profile-picture`,
        body,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
  
      setOpen(false) // Success
    } catch (err) {
      console.error(err)
      alert("Something went wrong!")
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800">
            Edit Profile
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          {/* Disabled Fields */}
          <div>
            <Label>Name</Label>
            <Input value={user.name} disabled />
          </div>
          <div>
            <Label>Email</Label>
            <Input value={user.email} disabled />
          </div>
          <div>
            <Label>User Type</Label>
            <Input value={user.usertype} disabled />
          </div>

          {/* Editable Fields */}
          <div>
            <Label>Father's Name</Label>
            <Input name="fatherName" value={formData.fatherName} onChange={handleChange} />
          </div>
          <div>
            <Label>Mother's Name</Label>
            <Input name="motherName" value={formData.motherName} onChange={handleChange} />
          </div>
          <div>
            <Label>Address</Label>
            <Input name="address" value={formData.address} onChange={handleChange} />
          </div>
          <div>
            <Label>Date of Birth</Label>
            <Input type="date" name="dob" value={formData.dob} onChange={handleChange} />
          </div>
          <div>
            <Label>Gender</Label>
            <Input name="gender" value={formData.gender} onChange={handleChange} />
          </div>
          <div>
            <Label>Aadhar Number</Label>
            <Input name="aadharNumber" value={formData.aadharNumber} onChange={handleChange} />
          </div>
          <div>
            <Label>Class</Label>
            <Input name="class" value={formData.class} onChange={handleChange} />
          </div>
          <div>
            <Label>Upload Profile Picture</Label>
            <Input type="file" accept="image/*" onChange={handleFileChange} />
          </div>
        </div>

        <DialogFooter className="flex justify-end gap-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// import {
//     Dialog,
//     DialogContent,
//     DialogHeader,
//     DialogTitle,
//     DialogFooter,
//   } from "@/components/ui/dialog";
//   import { Button } from "@/components/ui/button";
//   import { Input } from "@/components/ui/input";
//   import { Label } from "@/components/ui/label";
//   import { useState } from "react";
//   import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
//   import { Upload } from "lucide-react";
  
//   // Simulate backend API call
//   const editStudentProfileController = async (formData) => {
//     console.log("FormData being sent to backend:");
//     for (let pair of formData.entries()) {
//       console.log(pair[0], pair[1]);
//     }
//     return new Promise((resolve) => setTimeout(resolve, 1000));
//   };
  
//   export default function StudentProfileEditDialog({ user, open, setOpen }) {
//     const [formData, setFormData] = useState({
//       fatherName: user?.fatherName || "",
//       motherName: user?.motherName || "",
//       address: user?.address || "",
//       dob: user?.dob || "",
//       gender: user?.gender || "",
//       aadharNumber: user?.aadharNumber || "",
//       class: user?.class || "",
//     });
  
//     const [profileImage, setProfileImage] = useState(null);
//     const [previewUrl, setPreviewUrl] = useState(user?.profilePicture || "");
//     const [loading, setLoading] = useState(false);
  
//     const handleChange = (e) => {
//       const { name, value } = e.target;
//       setFormData({ ...formData, [name]: value });
//     };
  
//     const handleFileChange = (e) => {
//       const file = e.target.files[0];
//       if (file) {
//         setProfileImage(file);
//         setPreviewUrl(URL.createObjectURL(file));
//       }
//     };
  
//     const handleSave = async () => {
//       setLoading(true);
//       const data = new FormData();
//       Object.entries(formData).forEach(([key, value]) => {
//         data.append(key, value);
//       });
//       if (profileImage) {
//         data.append("profilePicture", profileImage);
//       }
//       data.append("email", user.email);
//       data.append("name", user.name);
//       data.append("usertype", user.usertype);
  
//       await editStudentProfileController(data);
//       setLoading(false);
//       setOpen(false);
//     };
  
//     return (
//       <Dialog open={open} onOpenChange={setOpen}>
//         <DialogContent className="max-w-2xl">
//           <DialogHeader>
//             <DialogTitle className="text-2xl font-bold text-gray-800">
//               Edit Profile
//             </DialogTitle>
//           </DialogHeader>
  
//           {/* Profile Picture Preview */}
//           <div className="flex flex-col items-center gap-2 mb-4">
//             <Avatar className="w-24 h-24">
//               <AvatarImage src={previewUrl} />
//               <AvatarFallback>IMG</AvatarFallback>
//             </Avatar>
//             <label className="flex items-center gap-2 cursor-pointer text-sm text-blue-600 hover:underline">
//               <Upload className="w-4 h-4" />
//               <span>Change Profile Picture</span>
//               <input
//                 type="file"
//                 name="profilePicture"
//                 accept="image/*"
//                 onChange={handleFileChange}
//                 className="hidden"
//               />
//             </label>
//           </div>
  
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
//             {/* Disabled Fields */}
//             <div>
//               <Label>Name</Label>
//               <Input value={user?.name || ""} disabled />
//             </div>
//             <div>
//               <Label>Email</Label>
//               <Input value={user?.email || ""} disabled />
//             </div>
//             <div>
//               <Label>User Type</Label>
//               <Input value={user?.usertype || ""} disabled />
//             </div>
  
//             {/* Editable Fields */}
//             <div>
//               <Label>Father's Name</Label>
//               <Input
//                 name="fatherName"
//                 value={formData.fatherName}
//                 onChange={handleChange}
//               />
//             </div>
//             <div>
//               <Label>Mother's Name</Label>
//               <Input
//                 name="motherName"
//                 value={formData.motherName}
//                 onChange={handleChange}
//               />
//             </div>
//             <div>
//               <Label>Address</Label>
//               <Input
//                 name="address"
//                 value={formData.address}
//                 onChange={handleChange}
//               />
//             </div>
//             <div>
//               <Label>Date of Birth</Label>
//               <Input
//                 type="date"
//                 name="dob"
//                 value={formData.dob}
//                 onChange={handleChange}
//               />
//             </div>
//             <div>
//               <Label>Gender</Label>
//               <Input
//                 name="gender"
//                 value={formData.gender}
//                 onChange={handleChange}
//               />
//             </div>
//             <div>
//               <Label>Aadhar Number</Label>
//               <Input
//                 name="aadharNumber"
//                 value={formData.aadharNumber}
//                 onChange={handleChange}
//               />
//             </div>
//             <div>
//               <Label>Class</Label>
//               <Input
//                 name="class"
//                 value={formData.class}
//                 onChange={handleChange}
//               />
//             </div>
//           </div>
  
//           <DialogFooter className="flex justify-end gap-4">
//             <Button variant="outline" onClick={() => setOpen(false)}>
//               Cancel
//             </Button>
//             <Button onClick={handleSave} disabled={loading}>
//               {loading ? "Saving..." : "Save Changes"}
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     );
//   }
  