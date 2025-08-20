import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useLogin } from "@/hooks/useLogin";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();
  const { user, setUser } = useLogin();

  const handleSubmit = async (e) => {
    console.log("handleSubmit called");
    e.preventDefault(); // prevent the default form submission behavior
    let result;
    if (isSignUp) {
      console.log("signing up with email and password : ", email, password);
      result = await supabase.auth.signUp({ email, password }); // sign up with email and password
    } else {
      console.log("signing in with email and password : ", email, password);
      result = await supabase.auth.signInWithPassword({ email, password }); // sign in with email and password
    }

    if (result.error) {
      alert(result.error.message); // show error message
    } else {
      navigate("/"); // navigate to home page
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      alert("Enter your email first.");
      return;
    }

    const redirectTo =
      import.meta.env.VITE_RESET_PASSWORD_REDIRECT_URL ||
      `${window.location.origin}${import.meta.env.BASE_URL}reset-password`;
    console.log("redirectTo : ", redirectTo);
    // const { error } = await supabase.auth.resetPasswordForEmail(email, {
    //   redirectTo, // must be whitelisted in Supabase Auth settings
    // });

    // if (error) {
    //     alert(error.message); // show error message
    // } else {
    //     alert("Password reset email sent! Check your inbox.");
    // }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-black text-white">
      <h1 className="text-2xl font-bold mb-4">
        {isSignUp ? "Sign Up" : "Login"}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4 w-72">
        <input
          type="email"
          className="w-full p-2 rounded bg-gray-800"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="w-full p-2 rounded bg-gray-800"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-500 py-2 rounded"
        >
          {isSignUp ? "Sign Up" : "Login"}
        </button>
      </form>
      <button
        className="mt-4 text-sm text-gray-400 underline"
        onClick={() => setIsSignUp(!isSignUp)}
      >
        {isSignUp ? "Already have an account? Login" : "No account? Sign Up"}
      </button>
       {/* Reset password button */}
       <button
        onClick={handleResetPassword}
        className="mt-4 text-sm text-blue-400 hover:underline"
      >
        Forgot Password?
      </button>
    </div>
  );
}
