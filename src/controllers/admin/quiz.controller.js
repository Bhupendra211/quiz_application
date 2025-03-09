import Quiz from "../../models/quiz.model.js";
import Question from "../../models/questions.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { paginate } from "../../utils/paginate.js";
import { errorResponse, successResponse } from "../../utils/responseHandler.js";
import { validateFields } from "../../utils/validateFields.js";

// Create new Quiz
export const createQuiz = asyncHandler(async (req, res) => {
    try {

        const requiredFields = ["quiz_name", "description", "total_marks", "per_question_marks", "negative_marks", "total_question", "duration"];
        const errorMessage = validateFields(requiredFields, req.body);
        if (errorMessage) {
            return errorResponse(res, 400, errorMessage);
        }

        const { quiz_name, description, total_marks, per_question_marks, negative_marks, total_question, duration } = req.body;

        const manager = new Quiz({ quiz_name, description, total_marks, per_question_marks, negative_marks, total_question, duration });
        await manager.save();

        return successResponse(res, 201, "Quiz Created Successfully.", Quiz);

    } catch (error) {
        return errorResponse(res, 500, error.message);
    }
});


// Get all quizzes
export const getAllQuiz = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;

    try {
        const quizzes = await paginate(Quiz, {}, parseInt(page), parseInt(limit));

        if (!quizzes.data.length) {
            return errorResponse(res, 404, "No quizzes found", null);
        }

        return successResponse(res, 200, "Quizzes fetched successfully", quizzes);
    } catch (error) {
        return errorResponse(res, 500, "Internal Server Error", error.message);
    }
});

// Add Questions in a quiz
export const addQuestion = asyncHandler(async (req, res) => {
    try {
        const requiredFields = ["question", "option1", "option2", "answer", "number"];
        const errorMessage = validateFields(requiredFields, req.body);
        if (errorMessage) {
            return errorResponse(res, 400, errorMessage);
        }
        const { id } = req.params;
        const { question, option1, option2, option3, option4, answer, number } = req.body;

        const questionManager = new Question({ quiz_id: id, question, option1, option2, option3, option4, answer, number });
        await questionManager.save();

        return successResponse(res, 201, "Question Added Successfully");
    } catch (error) {
        console.log(error.message)
        return errorResponse(res, 500, "Internal Server Error", error.message);
    }
});

// Get all questions by a quiz id
export const getAllQuestions = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;

    try {
        const { id } = req.params;

        const questions = await paginate(Question, { quiz_id: id }, parseInt(page), parseInt(limit));

        if (!questions.data.length) {
            return errorResponse(res, 404, "No Question Found", null);
        }

        return successResponse(res, 200, "Questions fetched Successfully", questions);
    } catch (error) {
        return errorResponse(res, 500, "Internal Server Error", error.message);
    }
});


// Update question by id
export const updateQuestion = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const { question, option1, option2, option3, option4, answer, number } = req.body;

        const questionExist = await Question.findById(id);
        if (!questionExist) {
            return errorResponse(res, 404, "Question Not Found");
        }

        questionExist.question = question ?? questionExist.question;
        questionExist.option1 = option1 ?? questionExist.option1;
        questionExist.option2 = option2 ?? questionExist.option2;
        questionExist.option3 = option3 ?? questionExist.option3;
        questionExist.option4 = option4 ?? questionExist.option4;
        questionExist.answer = answer ?? questionExist.answer;
        questionExist.number = number ?? questionExist.number;

        await questionExist.save();

        return successResponse(res, 200, "Question Updated Successfully");
    } catch (error) {
        console.log(error.message);
        return errorResponse(res, 500, "Internal Server Error", error.message);

    }
});

// Delete question by id
export const deleteQuestion = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;

        const deleteQuestion = await Question.findByIdAndDelete(id);

        if (!deleteQuestion) {
            return errorResponse(res, 404, "Question Not Found");
        }

        return successResponse(res, 200, "Question Deleted Successfully");
    } catch (error) {
        return errorResponse(res, 500, "Internal Server Error", error.message);
    }
});
