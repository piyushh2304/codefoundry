import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/axios";

export default function AuthSuccess() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      // Immediately fetch user data with the new token
      api.get("/auth/me", {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => {
        login(token, res.data);
        navigate("/dashboard");
      }).catch(() => {
        navigate("/login?error=GoogleAuthFailed");
      });
    } else {
      navigate("/login");
    }
  }, [token, navigate, login]);

  return <div className="flex h-screen items-center justify-center">Authenticating...</div>;
}
