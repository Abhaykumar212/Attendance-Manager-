const subjectModel = require('../model/subjectModel');

// CREATE
const createSubject = async (req, res) => {
  try {
    const { subjectName, subjectCode } = req.body;
    const subject = new subjectModel({ subjectName, subjectCode });
    await subject.save();
    res.status(201).json(subject);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// READ ALL
const getAllSubjects = async (req, res) => {
  try {
    const subjects = await subjectModel.find();
    res.status(200).json(subjects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// READ BY ID
const getSubjectById = async (req, res) => {
  try {
    const subject = await subjectModel.findById(req.params.id);
    if (!subject) return res.status(404).json({ message: 'Subject not found' });
    res.status(200).json(subject);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE
const updateSubject = async (req, res) => {
  try {
    const { subjectName, subjectCode } = req.body;
    const updated = await subjectModel.findByIdAndUpdate(
      req.params.id,
      { subjectName, subjectCode },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: 'Subject not found' });
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE
const deleteSubject = async (req, res) => {
  try {
    const deleted = await subjectModel.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Subject not found' });
    res.status(200).json({ message: 'Subject deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createSubject,
  getAllSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject,
};
