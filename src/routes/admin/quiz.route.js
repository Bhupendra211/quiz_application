import express from 'express';
import { addQuestion, createQuiz, deleteQuestion, getAllQuestions, getAllQuiz, updateQuestion } from '../../controllers/admin/quiz.controller.js';
import { getAllUser } from '../../controllers/admin/users.controller.js';
import { errorResponse } from '../../utils/responseHandler.js';

const adminQuiz = express.Router();

// ************************User Related Routes************************************
adminQuiz.get('/all-users', getAllUser);


// **************************Quiz&Question Routes*************************************
adminQuiz.post('/create-quiz', createQuiz);
adminQuiz.get('/all-quizzes', getAllQuiz);


adminQuiz.post('/add-question', (req, res) => {
    return errorResponse(res, 400, "Bad Request", "ID parameter is required");
});
adminQuiz.post('/add-question/:id', addQuestion);

// Get All Questions By Quiz Id
adminQuiz.get('/get-question', (req, res) => {
    return errorResponse(res, 400, "Bad Request", "ID parameter is required");
});
adminQuiz.get('/get-question/:id', getAllQuestions);

// Update Question By Question Id
adminQuiz.put('/update-question', (req, res) => {
    return errorResponse(res, 400, "Bad Request", "ID parameter is required");
});
adminQuiz.put("/update-question/:id", updateQuestion);

// Delete Question By Question Id
adminQuiz.delete('/delete-question', (req, res) => {
    return errorResponse(res, 400, "Bad Request", "ID parameter is required");
});
adminQuiz.delete("/delete-question/:id", deleteQuestion);



export default adminQuiz;