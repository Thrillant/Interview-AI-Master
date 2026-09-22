import { createContext, useEffect, useState } from "react";
import { getMe } from "./services/auth.api.js";

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Restore the session once per app load, not once per useAuth() consumer —
    // a late /get-me from a freshly mounted component could otherwise undo a logout.
    useEffect(()=>{
        const getAndSetUser = async()=>{
            try{
                const data = await getMe();
                setUser(data.user);
            } catch(err) {} finally{
                setLoading(false)
            }
        }

        getAndSetUser()
    },[])

    return (
        <AuthContext.Provider value={{user, setUser, loading, setLoading}} >
            {children}
        </AuthContext.Provider>
    )
}