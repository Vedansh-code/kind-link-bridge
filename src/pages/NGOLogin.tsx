
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const BACKEND_URL = "https://kind-link-bridge-backend-1.onrender.com";

const NGOLogin: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        // Note: Using the same login endpoint as generic login for now, assuming backend handles role based logic or generic auth
        // If there is a specific NGO login endpoint, it should be used here.
        // Given the requirement "successfully login", I'll stick to the standard login.
        try {
            const response = await fetch(`${BACKEND_URL}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                // INJECT ROLE: NGO
                const ngoUser = { ...data, role: 'ngo' };
                localStorage.setItem("user", JSON.stringify(ngoUser));

                setMessage("✅ Login successful!");
                // Redirect to NGO dashboard
                setTimeout(() => navigate("/ngo/dashboard"), 1000);
            } else {
                setMessage(`❌ ${data.error || "Login failed"}`);
            }
        } catch (error) {
            setMessage("⚠️ Server connection failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 font-sans px-4">

            <div className="bg-white shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-[2rem] p-10 pt-12 w-full max-w-md border border-slate-100 relative">
                <div className="text-center mb-10">
                    <div className="text-4xl mb-4">🏢</div>
                    <h2 className="text-3xl font-black text-slate-800 tracking-tight">NGO Partner Login</h2>
                    <p className="text-slate-400 text-sm mt-2">Access your organization dashboard</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-1">
                        <input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:bg-white outline-none transition-all placeholder:text-slate-400"
                            required
                        />
                    </div>

                    <div className="space-y-1">
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:bg-white outline-none transition-all placeholder:text-slate-400"
                            required
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-6 text-lg rounded-2xl font-bold text-white transition-all transform active:scale-[0.97] shadow-lg shadow-emerald-200 ${loading ? "bg-slate-400 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-700"
                            }`}
                    >
                        {loading ? "Verifying..." : "Login to Dashboard"}
                    </Button>
                </form>

                <div className="relative my-10 flex items-center">
                    <div className="flex-grow border-t border-slate-100"></div>
                </div>

                <button
                    type="button"
                    onClick={() => {
                        localStorage.setItem('pending_role', 'ngo');
                        window.open(`${BACKEND_URL}/auth/google?role=ngo`, "_self");
                    }}
                    className="flex items-center justify-center w-full py-3 font-medium transition-colors bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 hover:shadow-sm"
                >
                    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                        <path
                            fill="#EA4335"
                            d="M24 12.27c0-.85-.07-1.66-.21-2.44H12v4.62h6.72c-.29 1.58-1.18 2.92-2.52 3.81v3.17h4.08c2.39-2.2 3.72-5.44 3.72-9.16z"
                        />
                        <path
                            fill="#FBBC05"
                            d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-4.08-3.17c-1.13.75-2.57 1.2-3.85 1.2-2.97 0-5.49-2.01-6.39-4.7H1.53v3.23C3.51 21.82 7.46 24 12 24z"
                        />
                        <path
                            fill="#34A853"
                            d="M5.61 14.42c-.24-.71-.37-1.46-.37-2.42s.13-1.71.37-2.42V6.35H1.53c-.8 1.6-1.26 3.4-1.26 5.3s.46 3.7 1.26 5.3l4.08-3.23z"
                        />
                        <path
                            fill="#4285F4"
                            d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.45-3.45C17.95 1.08 15.24 0 12 0 7.46 0 3.51 2.18 1.53 5.58l4.08 3.23c.9-2.69 3.42-4.7 6.39-4.7z"
                        />
                    </svg>
                    Continue with Google
                </button>

                <p className="mt-8 text-center text-sm text-slate-500">
                    Not a partner yet? <Link to="/ngo-register" className="text-emerald-600 font-bold hover:text-emerald-700 transition-colors">Register Organization</Link>
                </p>
            </div>

            {message && (
                <div className="mt-8 px-6 py-3 bg-white shadow-lg rounded-full border border-slate-100 text-sm font-bold text-slate-700 animate-[bounce_1s_infinite]">
                    {message}
                </div>
            )}
        </div>
    );
};

export default NGOLogin;
