import axios from 'axios';
import { InterviewContext } from '../interview.context';

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true
});

/**
 * @description Service to generate interview report based on user self description, resume and job description.
 */
export const generateInterviewReport = async ({resume, selfDescription, jobDescription, aiModel}) => {
    const formData = new FormData();
    if(resume){
        formData.append("resume", resume);
    }
    formData.append("selfDescription", selfDescription || "");
    formData.append("jobDescription", jobDescription || "");
    formData.append("aiModel", aiModel || "gemini-3.1-flash-lite");

    const response = await api.post("/api/interview/", formData);

    return response.data;
}

/**
 * @description Service to get interview report by interview id
 */
export const getInterviewReportById = async (interviewId) => {
    const response = await api.get(`/api/interview/report/${interviewId}`);
    return response.data;
}

/**
 * @description Service to get all interview reports of the logged-in user
 */
export const getAllInterviewReports = async () => {
    const response = await api.get("/api/interview/");
    return response.data;
}

/**
 * @description Service to generate a resume based on users input
 */
export const generateResumePdf = async(interviewId, aiModel) => {
    const response = await api.post(`/api/interview/resume/pdf/${interviewId}?aiModel=${aiModel || 'gemini-3.1-flash-lite'}`, null, {
        responseType: "blob"
    });

    return response.data;
}