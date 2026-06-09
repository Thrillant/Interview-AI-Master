const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
});

const InterviewReportSchema = {
    type: "OBJECT",
    properties: {
        matchScore: { 
            type: "NUMBER", 
            description: "A score between 0 and 100 indicating match." 
        },
        title: { 
            type: "STRING", 
            description: "The job title" 
        },
        technicalQuestions: {
            type: "ARRAY",
            items: {
                type: "OBJECT",
                properties: {
                    question: { type: "STRING" },
                    intention: { type: "STRING" },
                    answer: { type: "STRING" }
                },
                required: ["question", "intention", "answer"]
            }
        },
        behavioralQuestions: {
            type: "ARRAY",
            items: {
                type: "OBJECT",
                properties: {
                    question: { type: "STRING" },
                    intention: { type: "STRING" },
                    answer: { type: "STRING" }
                },
                required: ["question", "intention", "answer"]
            }
        },
        skillGaps: {
            type: "ARRAY",
            items: {
                type: "OBJECT",
                properties: {
                    skill: { type: "STRING" },
                    severity: { type: "STRING", description: "Must be exactly 'low', 'medium', or 'high'" }
                },
                required: ["skill", "severity"]
            }
        },
        preparationPlan: {
            type: "ARRAY",
            items: {
                type: "OBJECT",
                properties: {
                    day: { type: "NUMBER" },
                    focus: { type: "STRING" },
                    tasks: {
                        type: "ARRAY",
                        items: { type: "STRING" }
                    }
                },
                required: ["day", "focus", "tasks"]
            }
        }
    },
    required: ["matchScore", "title", "technicalQuestions", "behavioralQuestions", "skillGaps", "preparationPlan"]
};

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
    const prompt = `
        You are an expert technical interviewer, recruiter, and career coach.
        Analyze the following candidate profile and generate a detailed interview report.

        Resume:
        ${resume}

        Self Description:
        ${selfDescription}

        Job Description:
        ${jobDescription}

        Carefully compare the resume against the job description.
        Be realistic and objective while assigning the match score.
    `;

    const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: InterviewReportSchema
        }
    });

    return JSON.parse(response.text);
}

module.exports = generateInterviewReport;