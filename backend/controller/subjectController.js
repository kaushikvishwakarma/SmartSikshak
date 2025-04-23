import asyncHandler from 'express-async-handler';
import Subject from '../models/Subject.js';

export const getAllSubjects = asyncHandler(async (req, res) => {
  const subjects = await Subject.find().sort({ createdAt: -1 });
  res.status(200).json(subjects);
});
export const createSubject = async (req, res) => {
  try {
    const {
      name,
      code,
      description,
      credits,
      semester,
      academicSession,
      classGroup,
      evaluationWeightage,
      weeklySchedule,
    } = req.body;

    // Check for duplicate code
    const existing = await Subject.findOne({ code });
    if (existing) {
      return res.status(400).json({ error: 'Subject with this code already exists.' });
    }

    const subject = new Subject({
      name,
      code,
      description,
      credits,
      semester,
      academicSession,
      classGroup,
      evaluationWeightage,
      weeklySchedule,
    });

    await subject.save();
    res.status(201).json({ message: 'Subject created successfully', subject });
  } catch (err) {
    console.error('Error creating subject:', err);
    res.status(500).json({ error: 'Server error while creating subject.' });
  }
};
export const getSubjectbyId=async(req,res)=>{
  try{
    const {id}=req.params;
    const subject=await Subject.findById(id);
    return res.status(200).json(subject);
  }
  catch(err){
    console.log(err);
  }
}

