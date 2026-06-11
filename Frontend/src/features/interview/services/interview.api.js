import axios from 'axios';

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true
});

/**
 * @description Service to generate interview report based on user self description, resume and job description.
 */
export const generateInterviewReport = async ({resume, selfDescription, jobDescription}) => {
    const formData = new FormData();
    formData.append("resume", new Blob([resume], { type: "application/pdf" }), "resume.pdf");
    formData.append("selfDescription", selfDescription);
    formData.append("jobDescription", jobDescription);

    const response = await api.post("/api/interview/", formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });

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