import Class from '../models/Class.js';

// Create a new class
export const createClass = async (req, res) => {
  try {
    const { className, section, academicYear, subjects, classTeacher } = req.body;

    const newClass = new Class({
      className,
      section,
      academicYear,
      subjects,
      classTeacher
    });

    const savedClass = await newClass.save();
    res.status(201).json(savedClass);
  } catch (err) {
    console.error('Error creating class:', err);
    res.status(500).json({ error: 'Failed to create class' });
  }
};

// Get all classes
export const getAllClasses = async (req, res) => {
  try {
    const classes = await Class.find().populate('classTeacher').populate('subjects.subjectId');
    res.json(classes);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch classes' });
  }
};

// Get single class by ID
export const getClassById = async (req, res) => {
  try {
    const cls = await Class.findById(req.params.id)
      .populate('classTeacher')
      .populate('subjects.subjectId');

    if (!cls) return res.status(404).json({ error: 'Class not found' });

    res.json(cls);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching class' });
  }
};

// Update class by ID
export const updateClass = async (req, res) => {
  try {
    const updated = await Class.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('classTeacher')
      .populate('subjects.subjectId');

    if (!updated) return res.status(404).json({ error: 'Class not found' });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Error updating class' });
  }
};
export const getClassSubjects = async (req, res) => {
  try {
    const { classId } = req.params;

    const classDoc = await Class.findById(classId).populate('subjects.subjectId');

    if (!classDoc) {
      return res.status(404).json({ message: 'Class not found' });
    }

    // Return the subjects array
    res.status(200).json({ subjects: classDoc.subjects });
  } catch (error) {
    console.error('Error fetching class subjects:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
