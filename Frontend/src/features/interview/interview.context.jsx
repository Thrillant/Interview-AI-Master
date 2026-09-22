import {createContext, useContext, useState} from "react";
import {AuthContext} from "../auth/auth.context.jsx";

export const InterviewContext = createContext();

export const InterviewProvider = ({children}) => {
    const {user} = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [report, setReport] = useState(null);
    const [reports, setReports] = useState([]);
    const [selectedModel, setSelectedModel] = useState("gemini-3.1-flash-lite");

    // Drop the previous user's reports on logout so the next login never renders them
    const [prevUser, setPrevUser] = useState(user);
    if (user !== prevUser) {
        setPrevUser(user);
        if (!user) {
            setReport(null);
            setReports([]);
        }
    }

    return (
        <InterviewContext.Provider value={{loading, setLoading, report, setReport, reports, setReports, selectedModel, setSelectedModel}}>
            {children}
        </InterviewContext.Provider>
    )
}
