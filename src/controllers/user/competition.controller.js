import { asyncHandler } from "../../utils/asyncHandler.js";
import redis from '../../config/redis.js';
import { successResponse, errorResponse } from "../../utils/responseHandler.js";
import Question from "../../models/questions.model.js";
import Quiz from "../../models/quiz.model.js";
import { validateFields } from "../../utils/validateFields.js";
import StudentAttempt from "../../models/studentAttempt.model.js";
import Result from "../../models/result.model.js";

export const getQuestions = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;

        const quiz = await Quiz.findOne({ _id: id }).select(['total_question', 'duration']).lean();
        const totalQuestions = quiz?.total_question || 0;
        const duration = quiz?.duration || 0;

        if (totalQuestions === 0 || duration === 0) {
            return errorResponse(res, 404, "No Questions Found", null);
        }

        const questionsCacheKey = `quiz_questions_${id}`;

        let questions = await redis.get(questionsCacheKey);

        if (!questions) {
            questions = await Question.find({ quiz_id: id }).lean();

            if (questions.length === 0) {
                return errorResponse(res, 404, "No Questions Found", null);
            }
            await redis.set(questionsCacheKey, JSON.stringify(questions), { EX: 60 * 60 * 3 });
        } else {
            questions = JSON.parse(questions);
        }

        const data = {
            "statusResponse": "200",
            "status": "success",
            "total_questions": totalQuestions,
            "duration": duration,
            "question": questions,
        }

        return successResponse(res, 200, "Question Fetched Successfully", data);

    } catch (error) {
        console.log(error.message);
        return errorResponse(res, 500, "Internal Server Error", null);

    }
});


// Get all quizzes
export const getAllQuiz = asyncHandler(async (req, res) => {
    try {
        const quizzes = await Quiz.find();

        // if (!quizzes.data.length) {
        //     return errorResponse(res, 404, "No quizzes found", null);
        // }

        return successResponse(res, 200, "Quizzes fetched successfully", quizzes);
    } catch (error) {
        return errorResponse(res, 500, `Internal Server Error ${error}`, error.message);
    }
});



export const submitQuestionOnSaveNext = asyncHandler(async (req, res) => {
    try {
        const requiredFields = ["user_id", "quiz_id", "question_id", "selected_option", "answer_status"];
        const errorMessage = validateFields(requiredFields, req.body);
        if (errorMessage) {
            return errorResponse(res, 400, errorMessage);
        }

        const { user_id, quiz_id, question_id, selected_option, answer_status } = req.body;

        await StudentAttempt.findOneAndUpdate(
            { student_id: user_id, quiz_id, question_id },
            { selected_option, answer_status },
            { upsert: true, new: true }
        );

        return successResponse(res, 201, "Answer Update Successfully");
    } catch (error) {
        console.log(error.message);
        return errorResponse(res, 500, "Internal Server Error");
    }
});

export const submitQuiz = asyncHandler(async (req, res) => {
    try {
        const requiredFields = ["user_id", "quiz_id", "question_id", "selected_option", "answer_status"];
        const errorMessage = validateFields(requiredFields, req.body);
        if (errorMessage) {
            return errorResponse(res, 400, errorMessage);
        }

        const { user_id, quiz_id, question_id, selected_option, answer_status } = req.body;

        const quiz = await Quiz.findById({ _id: quiz_id });
        if (!quiz) {
            return errorResponse(res, 400, "Quiz Not Found");
        }

        const negative_marks = quiz.negative_marks;
        const per_question_marks = quiz.per_question_marks;


        await StudentAttempt.findOneAndUpdate(
            { student_id: user_id, quiz_id, question_id },
            { selected_option, answer_status },
            { upsert: true, new: true }
        );

        const attempts = await StudentAttempt.find({ student_id: user_id, quiz_id });


        const { correctCount, incorrectCount } = attempts.reduce(
            (acc, attempt) => {
                if (attempt.answer_status.trim().toLowerCase() === 'right') acc.correctCount++;
                if (attempt.answer_status.trim().toLowerCase() === 'wrong') acc.incorrectCount++;
                return acc;
            },
            { correctCount: 0, incorrectCount: 0 }
        );

        let total_score = (parseInt(correctCount) * parseInt(per_question_marks)) - (parseInt(incorrectCount) * parseInt(negative_marks))
        let total_attempt = parseInt(correctCount) + parseInt(incorrectCount);

        const resultManager = new Result(
            {
                student_id: user_id,
                quiz_id: quiz_id,
                total_score: total_score,
                total_correct: correctCount,
                total_attempt: total_attempt
            }
        );
        await resultManager.save();

        return successResponse(res, 201, "Quiz Submitted Successfully");
    } catch (error) {
        console.log(error.message)
        return errorResponse(res, 500, "Internal Server Error");
    }
})
