const express = require('express');
const {
  createSubject,
  getAllSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject,
} = require('../controller/subjectController');

const router = express.Router();

router.post('/', createSubject);       
router.get('/', getAllSubjects);   
router.get('/:id', getSubjectById);    
router.put('/:id', updateSubject);       
router.delete('/:id', deleteSubject);    

module.exports = router;
