import express from "express";
import { getQuestions, submitQuestionOnSaveNext, submitQuiz } from "../../controllers/user/competition.controller.js";

const competitionRoutesManager = express.Router();

competitionRoutesManager.get('/question/:id', getQuestions);
competitionRoutesManager.post('/save-next', submitQuestionOnSaveNext);
competitionRoutesManager.post('/submit-quiz', submitQuiz);




export default competitionRoutesManager;