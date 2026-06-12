import {createContext, useState} from "react";

export const InterviewContext = createContext();

export const InterviewProvider = ({children}) => {
    const [loading, setLoading] = useState(false);
    const [report, setReport] = useState(null);
    const [reports, setReports] = useState([]);
    const [selectedModel, setSelectedModel] = useState("gemini-3.1-flash-lite");

    return (
        <InterviewContext.Provider value={{loading, setLoading, report, setReport, reports, setReports, selectedModel, setSelectedModel}}>
            {children}
        </InterviewContext.Provider>
    )
}