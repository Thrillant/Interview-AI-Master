const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const interviewController = require("../controllers/interview.controller");
const upload = require("../middlewares/file.middleware");
const rateLimit = require("express-rate-limit");

const interviewRouter = express.Router();

const aiGenerationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  message: {
    status: 429,
    message: "Too many interview strategies generated. Please try again after 15 minutes."
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * @route POST/api/interview/
 * @description Generate interview report based on resume, self description and job description points
 * @access private
 */
interviewRouter.post("/", aiGenerationLimiter, authMiddleware.authUser, upload.single("resume"), interviewController.generateInterviewReportController);

/**
 * @route GET/api/interview/report/:interviewId
 * @description Get interview report by interview id
 * @access private
 */
interviewRouter.get("/report/:interviewId", authMiddleware.authUser, interviewController.getInterviewReportByIdController);

/**
 * @route GET/api/interview/
 * @description Get all interview reports of the logged-in user
 * @access private
 */
interviewRouter.get("/", authMiddleware.authUser, interviewController.getAllInterviewReportsController);

/**
 * @route GET/api/interview/resume/pdf
 * @description Generate Resume Pdf on the basis of user self description, resume and job description
 * @access private
 */
interviewRouter.post("/resume/pdf/:interviewId", aiGenerationLimiter, authMiddleware.authUser, interviewController.generateResumePdfController);

module.exports = interviewRouter;