import {useAuth} from "../hooks/useAuth.js";
import {Navigate} from "react-router";
import Loader from "../../../Loader.jsx";

const Protected = ({children}) => {
    const {user, loading} = useAuth();

    if(loading) {
        return <Loader />;
    }

    if(!user) {
        return <Navigate to={"/login"} />
    }

    return children;
}

export default Protected;