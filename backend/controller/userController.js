// controllers/authController.js
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import asyncHandler from 'express-async-handler';
import cloudinary from '../config/cloudinary.js';
import getDataUri from '../config/datauri.js';


const generateToken = (user) => {
  return jwt.sign({ id: user._id, usertype: user.usertype }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

// Login Controller
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please enter all fields' });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = generateToken(user);
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // true in production (HTTPS)
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    res.status(200).json({
      message: 'Login successful',
      token,
      user,
      // user: {
      //   id: user._id,
      //   name: user.name,
      //   email: user.email,
      //   usertype: user.usertype,
      //   entityName:user.entityName,
      //     enrollmentNumber: user.enrollmentNumber,
          
      //     fatherName: user.fatherName,
      //     motherName: user.motherName,
      //     classId: user.classId,,
      //     dob:user.dob,
      //     gender: user.gender,
      //     aadharNumber: user.aadharNumber,
          
      //     mobileNumber: user.mobilNumber,
      //     address: { type: String },
      //     zoomAccessToken: { type: String },
      //     zoomRefreshToken: { type: String },
      //     password: { type: String, required: true },
      //     usertype: { type: String, enum: ['student', 'teacher', 'mentor'], required: true },
      //     profilePicture: { type: String, default: "" },
        
      //     // 🔥 New field for teacher-specific data
      //     teachingAssignments: [teachingAssignmentSchema]
      // },
      success:true,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Profile (view own profile)
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get profile' });
  }
};

// Update Profile
export const updateProfile = async (req, res) => {
  try {
    const updates = req.body;
    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select('-password');
    res.status(200).json({ message: 'Profile updated', user });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update profile' });
  }
};

// Change Password
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Current password is incorrect' });

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error changing password' });
  }
};

// Mentor Creates Users (teacher/student)
export const publicRegister = async (req, res) => {
  try {
    const { name, email, usertype, password } = req.body;

    if (!name || !email || !usertype || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const allowedRoles = ['student', 'teacher', 'mentor'];
    if (!allowedRoles.includes(usertype)) {
      return res.status(400).json({ message: 'Invalid usertype' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(409).json({ message: 'Email already in use' });

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User({
      name,
      email,
      usertype,
      password: hashedPassword,
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Registration failed' });
  }
};

// Mentor Creates Users (teacher/student)
export const registerUserByMentor = async (req, res) => {
  try {
    const { name, email, phone, usertype, password,classId } = req.body;

    if (!name || !email || !phone || !usertype || !password || !classId) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const allowedRoles = ['student', 'teacher'];
    if (!allowedRoles.includes(usertype)) {
      return res.status(400).json({ message: 'Only student or teacher can be registered' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(409).json({ message: 'Email already in use' });

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User({
      name,
      email,
      phone,
      usertype,
      password: hashedPassword,
      classId,
    });

    await user.save();

    res.status(201).json({
      message: `${usertype} created successfully`,
      credentials: {
        email: user.email,
        password,
      },
    });
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Mentor registration failed' });
  }
};
//userProfilecontrller

// @desc    Get user profile
// @route   GET /api/users/:id
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) return res.status(404).json({ message: 'User not found' });

  res.status(200).json(user);
});

// @desc    Update user profile
// @route   PUT /api/users/:id
export const updateUserProfile = asyncHandler(async (req, res) => {
  if (req.user._id.toString() !== req.params.id && req.user.usertype !== 'admin') {
    //req.user middleware should be used to get the logged in user
    return res.status(403).json({ message: 'Access denied' });
  }

  const { name, email, phone, address } = req.body;

  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  user.name = name || user.name;
  user.email = email || user.email;
  user.phone = phone || user.phone;
  user.address = address || user.address;

  const updatedUser = await user.save();
  res.status(200).json({
    message: 'Profile updated',
    user: updatedUser,
  });
});

// @desc    Change user roles (admin only)
// @route   PUT /api/users/:id/roles
export const updateUserRoles = asyncHandler(async (req, res) => {
  if (req.user.usertype !== 'admin') {
    return res.status(403).json({ message: 'Access denied: Admins only' });
  }

  const { usertype } = req.body;
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  user.usertype = usertype;
  await user.save();

  res.status(200).json({ message: 'User role updated successfully' });
});

// @desc    Upload/change profile picture
// @route   POST /api/users/:id/upload-profile-picture
export const uploadProfilePicture = asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  user.profilePicture = req.file.path;
  await user.save();

  res.status(200).json({ message: 'Profile picture uploaded successfully', path: req.file.path });
});
export const updateUserProfileDetails = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const loggedInUserId = req.user._id.toString();
  const isAdminOrSelf = loggedInUserId === userId || req.user.usertype === 'mentor';

  if (!isAdminOrSelf) return res.status(403).json({ message: 'Access denied' });

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: 'User not found' });

  // ✅ Allowed fields to update
  const allowedFields = ['fatherName', 'motherName', 'address', 'dob', 'gender', 'aadharNumber', 'class'];

  allowedFields.forEach(field => {
    if (req.body[field]) user[field] = req.body[field];
  });

  // ✅ Profile Picture Upload (if file is sent)
  if (req.file) {
    
      const fileUri=getDataUri(req.file );
      //multer ne memory storage per upload kar ke req.file  se access kara diya other wise we can't use here req.file
      //ab file Uri me convert karke simply ise cloudinary.uploader.upload(fileUrI)
      

    const uploadResult = await cloudinary.uploader.upload(fileUri, {
      folder: 'teacher-assistant/profiles',
      public_id: `${userId}-profile`,
      overwrite: true,
    });
    user.profilePicture = uploadResult.secure_url;
  }

  await user.save();

  res.status(200).json({
    message: 'Profile updated successfully',
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      usertype: user.usertype,
      profilePicture: user.profilePicture,
      fatherName: user.fatherName,
      motherName: user.motherName,
      address: user.address,
      dob: user.dob,
      gender: user.gender,
      aadharNumber: user.aadharNumber,
      class: user.class,
    },
  });
});
export const getAllUsers = asyncHandler(async (req, res) => {
  const usertype = req.query.usertype;

  let filter = {};
  if (usertype) {
    filter.usertype = usertype;
  }

  const users = await User.find(filter).select('-password'); // Hide password field
  res.status(200).json(users);
});
//for getting all registerd teachers
export const getAllTeachers = async (req, res) => {
  try {
    const teachers = await User.find({ usertype: 'teacher' }).select('-password'); // exclude password
    res.status(200).json({ teachers });
  } catch (error) {
    console.error('Failed to fetch teachers:', error);
    res.status(500).json({ error: 'Server error while fetching teachers' });
  }
};
export const logout = async (_, res) => {
  try {
      return res.cookie("token", "", { maxAge: 0 }).json({
          message: 'Logged out successfully.',
          success: true
      });
  } catch (error) {
      console.log(error);
  }
};
