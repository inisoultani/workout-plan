import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function useLogin() {
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            console.log("user is logged in, navigating to home page : ", user);
            navigate("/");
        }
        else {
            console.log("user is not logged in");
        }
    }, [user]);

    return {  };
}