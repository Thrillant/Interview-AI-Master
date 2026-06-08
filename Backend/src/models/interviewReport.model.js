const mongoose = require('mongoose');

/**
 * Job Description Schema : String
 * Resume text : String
 * Self Description : String
 * 
 * matchScore : Number
 * 
 * Technical Questions : [{question: String, intension : String, answer: String}]
 * Behavioral Questions : [{question: String, intention : String, answer: String}]
 * Skill Gaps : [{skill: String, severity: {type: String, enum: ["low", "medium", "high"]}}]
 * Preparation Plan : [{day: number, focus: String, tasks: [String]}]
 */
const technicalQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [true, "Question is required"]
    },
    intention: {
        type: String,
        required: [true, "Intention is required"]
    },
    answer: {
        type: String,
        required: [true, "Answer is required"]
    }
});

const interviewReportSchema = new mongoose.Schema({
    jobDescription: {
        type: String,
        required: [true, "Job description is required"]
    },
    resume: {
        type: String,
    },
    selfDescription: {
        type: String,
    },
    matchScore: {
        type: Number,
        required: [true, "Match score is required"],
        min: 0,
        max: 100
    },
    technicalQuestions: [technicalQuestionSchema],
});

