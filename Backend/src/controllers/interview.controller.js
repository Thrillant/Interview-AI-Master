const pdfParse = require("pdf-parse");
const {generateInterviewReport, generateResumePdf} = require("../services/ai.service");
const interviewReportModel = require("../models/interviewReport.model");

/**
 * @description Controller to generate interview report based on user self description, resume and job description.
 */
async function generateInterviewReportController(req, res){

    let resumeText = "";
    if (req.file && req.file.buffer) {
        try {
            const pdfData = await pdfParse(req.file.buffer);
            resumeText = pdfData.text;
        } catch (error) {
            console.error("Failed to parse PDF, proceeding without resume text:", error.message);
        }
    }
    const {selfDescription, jobDescription, aiModel} = req.body;

    const interviewReportByAi = await generateInterviewReport({
        resume: resumeText,
        selfDescription,
        jobDescription,
        aiModel
    })


    const interviewReport = await interviewReportModel.create({
        user: req.user.id,
        resume: resumeText,
        selfDescription,
        jobDescription,
        ...interviewReportByAi
    })
    res.status(201).json({
        message: "Interview Report generated successfully.",
        interviewReport
    })
}

/**
 * @description Controller to get interview report by interview id.
 */
async function getInterviewReportByIdController(req, res){
    const {interviewId} = req.params;
    const interviewReport = await interviewReportModel.findById(interviewId);

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found."
        });
    }

    res.status(200).json({
        message: "Interview report retrieved successfully.",
        interviewReport
    });
}

/**
 * @description Controller to get all interview reports of the logged-in user.
 */
async function getAllInterviewReportsController(req, res){
    const interviewReports = await interviewReportModel.find({ user: req.user.id }).sort({ createdAt: -1 }).select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan");

    res.status(200).json({
        message: "Interview reports retrieved successfully.",
        interviewReports
    });
}

/**
 * @description Controller to generate interview report based on user self description, resume and job description.
 */
async function generateResumePdfController(req, res){
    try {
        const {interviewId} = req.params;
        const aiModel = req.query.aiModel || "gemini-3.1-flash-lite";
        const interviewReport = await interviewReportModel.findById(interviewId);

        if(!interviewReport) {
            return res.status(404).json({
                message: "Interview Report not found."
            })
        }

        const {resume, jobDescription, selfDescription} = interviewReport;

        const pdfBuffer = await generateResumePdf({resume, jobDescription, selfDescription, aiModel});
        
        res.set({
            "content-type": "application/pdf",
            "content-Disposition": `attachment; filename=resume_${interviewId}.pdf`
        });

        res.send(pdfBuffer);
        
    } catch (error) {
        console.error("Fatal Error generating PDF:", error);
        res.status(500).json({ message: "Failed to generate PDF.", error: error.message });
    }
}

module.exports = { generateInterviewReportController, getInterviewReportByIdController, getAllInterviewReportsController,
generateResumePdfController
}