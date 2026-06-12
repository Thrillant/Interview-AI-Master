import {generateInterviewReport, getInterviewReportById, getAllInterviewReports, generateResumePdf} from "../services/interview.api.js";
import { useContext, useEffect } from "react";
import { InterviewContext } from "../interview.context.jsx";
import { useParams } from "react-router";

export const useInterview = () => {
    const context = useContext(InterviewContext);
    const { interviewId } = useParams();
    
    if (!context) {
        throw new Error("useInterview must be used within an InterviewProvider");
    }

    const { 
        loading, setLoading, 
        report, setReport, 
        reports, setReports, 
        selectedModel, setSelectedModel 
    } = context;

    const generateReport = async ({resume, selfDescription, jobDescription, aiModel}) => {
        setLoading(true);
        let response = null;
        try {
            // Using the aiModel passed directly or from context
            response = await generateInterviewReport({
                resume, 
                selfDescription, 
                jobDescription, 
                aiModel: aiModel || selectedModel
            });
            setReport(response.interviewReport);
        } catch (error) {
            console.error("Error generating interview report:", error);
            if (error.response && error.response.status === 429) {
                alert(error.response.data.message || "You have exceeded your request limit. Please try again later.");
            } else {
                alert("Something went wrong while generating your report. Please try again.");
            }
        } finally {
            setLoading(false);
        }
        return response?.interviewReport;
    }

    const getReportById = async (interviewId) => {
        setLoading(true);
        let response = null;
        try {
            response = await getInterviewReportById(interviewId);
            setReport(response.interviewReport);
        } catch (error) {
            console.error("Error fetching interview report:", error);
        } finally {
            setLoading(false);
        }
        return response?.interviewReport;
    }

    const getAllReports = async () => {
        setLoading(true);
        let response = null;
        try {
            response = await getAllInterviewReports();
            setReports(response.interviewReports);
        } catch (error) {
            console.error("Error fetching interview reports:", error);
        } finally {
            setLoading(false);
        }
        return response?.interviewReports;
    };

    const getResumePdf = async (interviewId, aiModel) => {
        let response = null;
        try {
            response = await generateResumePdf(interviewId, aiModel || selectedModel);
            const url = window.URL.createObjectURL(new Blob([response], {type: "application/pdf"}));
            return url;
        } catch (error) {
            console.error("Error fetching resume:", error);
            return null;
        }
    }

    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId);
        }
    }, [interviewId]);

    return {
        loading, 
        report, 
        reports, 
        generateReport, 
        getReportById, 
        getAllReports, 
        getResumePdf, 
        selectedModel, 
        setSelectedModel 
    };
}