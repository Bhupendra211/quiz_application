import mongoose, { Schema } from "mongoose";

const attemptSchema = new Schema({
    student_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },

    question_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'questions',
        required: true,
    },

    quiz_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz',
        required: true,
    },

    selected_option: {
        type: String,
        required: true,
        trim: true,
    },

    answer_status: {
        type: String,
        enum: ['right', 'wrong'],
        required: true,
    },
}, {
    timestamps: true,
});


const StudentAttempt = mongoose.model('student_attempt', attemptSchema);

export default StudentAttempt;