const { GoogleGenAI } = require('@google/genai');
const puppeteer = require('puppeteer');

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

async function generateInterviewReport({ resume, selfDescription, jobDescription, aiModel }) {
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
        Generate at least 20 technical and 10 behavioral interview questions based on the job description, candidate's background, and industry standards.
        For each question, provide the intention behind asking it and a sample answer that a strong candidate might give.
        Identify skill gaps and categorize them as low, medium, or high severity based on how critical they are for the role.
        Create a 14-day preparation plan with specific daily focus areas and tasks to help the candidate improve their chances of success in the interview.
    `;

    const response = await ai.models.generateContent({
        model: aiModel,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: InterviewReportSchema
        }
    });

    return JSON.parse(response.text);
}

async function convertHtmlToPdf(htmlContent) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    const pdf = await page.pdf({
        format: "A4", margin: {
            top: "15mm",
            bottom: "15mm",
            left: "10mm",
            right: "10mm"
        }
    })

    await browser.close();
    return pdf;
}

async function generateResumePdf({resume, selfDescription, jobDescription, aiModel}) {
    const modelToUse = aiModel || "gemini-3.1-flash-lite";

    const resumePdfSchema = {
        type: "OBJECT",
        properties: {
            resumePdf: {
                type: "STRING",
                description: "The HTML content of the resume which can be converted to PDF using a library like puppeteer."
            }
        }
    };

    const prompt = `
        You are an expert Executive Resume Writer. Your task is to generate a highly optimized, single-page HTML resume tailored specifically to the target Job Description.

        INPUT DATA:
        - Candidate's Base Resume Text: """${resume}"""
        - Candidate's Self-Description: """${selfDescription}"""
        - Target Job Description: """${jobDescription}"""

        CRITICAL ANTI-HALLUCINATION RULES:
        1. NO PLACEHOLDERS: You are strictly forbidden from using fake names like "Aarav Sen" or "John Doe". You MUST extract the candidate's real name from the very top of the "Candidate's Base Resume Text".
        2. EXACT CONTACT INFO: Extract the real email, phone number, LinkedIn, and GitHub links exactly as they appear in the input text. Do not invent or fabricate links.
        3. If a piece of contact info is missing from the input, do not make one up. Just leave it out entirely.
        4. Don't add white spaces after the resume content ends.

        CONTENT STRATEGY (Tailoring):
        1. Analyze the Job Description to identify key technical skills, soft skills, and core responsibilities.
        2. Filter, rewrite, and elevate the candidate's inputs to strongly align with the JD. Use strong action verbs.
        3. Keep the content ruthlessly concise to enforce a ONE-PAGE constraint.

        REQUIRED SECTIONS & STRICT HTML/CSS STRUCTURE:
        - Output ONLY valid HTML. DO NOT wrap the output in markdown code blocks.
        - Wrap the entire content in this exact container to simulate A4 paper:
          <div style="max-width: 210mm; min-height: 297mm; margin: 0 auto; padding: 40px; font-family: Arial, sans-serif; font-size: 13px; line-height: 1.6; color: #333; box-sizing: border-box; background: #fff;">

        1. Top Header:
          - Name: <h1 style="text-align: center; font-size: 28px; color: #1e3a8a; margin: 0 0 5px 0;">[INSERT REAL EXTRACTED NAME HERE]</h1>
          - Contact & Links: Center the text (font-size: 12px). Render the email, LinkedIn, and GitHub as actual clickable HTML <a> tags with href attributes. Style links with color: #1e3a8a; text-decoration: none;. Separate items with a pipe ( | ).
          - Divider: Add a solid line below the contact info: <hr style="border: none; border-top: 2px solid #1e3a8a; margin: 15px 0;">

        2. Section Headers (Professional Summary, Education, Experience, Projects, Skills):
          - Style: <h2 style="font-size: 16px; color: #1e3a8a; text-transform: uppercase; border-bottom: 1px solid #1e3a8a; padding-bottom: 4px; margin-top: 0; margin-bottom: 12px;">SECTION TITLE</h2>
          - Spacing: Add <div style="margin-bottom: 18px;"> around each section's content to distribute the layout evenly.

        3. Layout inside sections (Flexbox):
          - For Education, Experience, and Projects, use <div style="display: flex; justify-content: space-between; font-weight: bold; margin-bottom: 2px;"> to put the Title/Company on the left and the Date on the right.
          - Bullet points: <ul style="margin: 5px 0 0 0; padding-left: 20px;"> with <li style="margin-bottom: 5px;">.
        
    `;

    const response = await ai.models.generateContent({
        model: modelToUse,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: resumePdfSchema
        }
    });

    const jsonResponse = JSON.parse(response.text);
    const htmlContent = jsonResponse.resumePdf;
    const pdf = await convertHtmlToPdf(htmlContent);
    return pdf;
}


module.exports = { generateInterviewReport, generateResumePdf };