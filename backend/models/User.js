import mongoose from "mongoose";

const teachingAssignmentSchema = new mongoose.Schema({
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
  subjectName: { type: String }, // optional if subject collection exists
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
  className: { type: String, required: true },   // optional if class collection exists
  schedule: [
    {
      day: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] },
      startTime: { type: String },  // e.g., "10:00 AM"
      endTime: { type: String },    // e.g., "11:00 AM"
      zoomLink: { type: String }
    }
  ]
}, { _id: false });

const userSchema = new mongoose.Schema({
  entityName: { type: String },
  enrollmentNumber: { type: String },
  name: { type: String, required: true },
  fatherName: { type: String },
  motherName: { type: String },
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
  dob: { type: Date },
  gender: { type: String, enum: ['male', 'female', 'other'] },
  aadharNumber: { type: String },
  email: { type: String, required: true, unique: true },
  mobileNumber: { type: String },
  address: { type: String },
  zoomAccessToken: { type: String },
  zoomRefreshToken: { type: String },
  password: { type: String, required: true },
  usertype: { type: String, enum: ['student', 'teacher', 'mentor'], required: true },
  profilePicture: { type: String, default: "" },

  // 🔥 New field for teacher-specific data
  teachingAssignments: [teachingAssignmentSchema]

}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', userSchema);

// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema({
//   entityName: { type: String },              // School/Institution Name
//   enrollmentNumber: { type: String},          // Unique student/teacher ID
//   name: { type: String, required: true },                    // Full Name
//   fatherName: { type: String },
//   motherName: { type: String },
//   class: { type: String },                                   // Class/Grade
//   dob: { type: Date },                                       // Date of Birth
//   gender: { type: String, enum: ['male', 'female', 'other'] },
//   aadharNumber: { type: String },
//   email: { type: String, required: true, unique: true },
//   mobileNumber: { type: String },
//   address: { type: String },
//   zoomAccessToken:{type:String},
//   zoomRefreshToken:{type:String},
//   password: { type: String, required: true },
//   usertype: { type: String, enum: ['student', 'teacher', 'mentor'], required: true },
//   profilePicture: { type: String ,default:""}, // URL or path to image file
// }, { timestamps: true });

// export default mongoose.models.User || mongoose.model('User', userSchema);
