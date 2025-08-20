import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [sessionSet, setSessionSet] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Parse hash fragment from URL
    const hash = window.location.hash.substring(1); // remove "#"
    const params = new URLSearchParams(hash);

    const access_token = params.get("access_token");
    const refresh_token = params.get("refresh_token");

    if (access_token && refresh_token) {
      supabase.auth.setSession({
        access_token,
        refresh_token,
      }).then(({ error }) => {
        if (error) {
          console.error("Error setting session:", error);
        } else {
          setSessionSet(true);
        }
      });
    }
  }, []);

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (!sessionSet) {
      alert("Session not set yet. Try refreshing.");
      return;
    }
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      alert(error.message);
    } else {
      alert("Password updated successfully!");
      navigate("/");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <h1 className="text-2xl mb-4">Set New Password</h1>
      <form onSubmit={handleUpdatePassword} className="space-y-4 w-72">
        <input
          type="password"
          className="w-full p-2 rounded bg-gray-800"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-500 py-2 rounded"
        >
          Update Password
        </button>
      </form>
    </div>
  );
}
