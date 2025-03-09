import mongoose, { Schema } from "mongoose";


const quizSchema = new Schema({

    quiz_name: {
        type: String,
        required: true,
        trim: true,
    },

    description: {
        type: String,
        trim: true,
    },

    total_marks: {
        type: Number,
        required: true,
        trim: true,
    },

    per_question_marks: {
        type: Number,
        required: true,
        trim: true,
    },

    negative_marks: {
        type: Number,
        required: true,
        trim: true,
    },

    total_question: {
        type: Number,
        required: true,
        trim: true,
    },

    duration: {
        type: Number,
        required: true,
        trim: true,
    },
}, {
    timestamps: true
});

const Quiz = mongoose.model("Quiz", quizSchema);

export default Quiz;