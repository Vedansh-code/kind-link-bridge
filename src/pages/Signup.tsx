import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

const BACKEND_URL = "https://kind-link-bridge-backend-1.onrender.com";

const Signup: React.FC = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const navigate = useNavigate();

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isPasswordFocused) {
                // Subtle tracking: 8px movement max
                const x = (e.clientX / window.innerWidth) * 16 - 8;
                const y = (e.clientY / window.innerHeight) * 16 - 8;
                setMousePos({ x, y });
            }
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [isPasswordFocused]);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        try {
            const response = await fetch(`${BACKEND_URL}/api/auth/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ username, email, password }),
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem("user", JSON.stringify(data));
                setMessage("✅ Account Created!");
                setTimeout(() => navigate("/dashboard"), 1500);
            } else {
                setMessage(`❌ ${data.error || "Signup failed"}`);
            }
        } catch (error) {
            setMessage("⚠️ Connection lost");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#f8fafc] px-4 font-sans">
            
            {/* --- PREMIUM CHARACTER --- */}
            <div className="relative mb-[-45px] z-20">
                {/* Body with Radial Gradient for 3D look */}
                <div className="w-36 h-36 bg-gradient-to-b from-green-400 to-green-600 rounded-full shadow-[0_10px_25px_-5px_rgba(34,197,94,0.4)] border-[6px] border-white relative flex items-center justify-center overflow-hidden">
                    
                    {/* Glassy Eye Socket */}
                    <div className="w-24 h-14 bg-slate-100 rounded-[40px] shadow-inner flex items-center justify-center space-x-4 relative border border-slate-200">
                        
                        {/* Eyes with Depth */}
                        {[1, 2].map((i) => (
                            <div key={i} className="w-5 h-5 bg-white rounded-full relative overflow-hidden shadow-sm">
                                <div 
                                    className="w-3 h-3 bg-slate-900 rounded-full absolute transition-transform duration-150 ease-out"
                                    style={{ 
                                        left: '20%', 
                                        top: '20%',
                                        transform: isPasswordFocused 
                                            ? 'translateY(-30px)' 
                                            : `translate(${mousePos.x}px, ${mousePos.y}px)` 
                                    }}
                                >
                                    {/* Pupil Highlight (Gives the premium "wet" eye look) */}
                                    <div className="w-1 h-1 bg-white rounded-full absolute top-0.5 left-0.5 opacity-60"></div>
                                </div>
                            </div>
                        ))}

                        {/* Blinking Eyelid Animation */}
                        <div className="absolute inset-0 bg-green-500 rounded-[40px] animate-[blink_4s_infinite] origin-top scale-y-0 opacity-100"></div>
                    </div>
                    
                    {/* Animated Hands (Covering Eyes) */}
                    <div className={`absolute inset-0 bg-green-600/90 backdrop-blur-sm transition-all duration-700 cubic-bezier(0.175, 0.885, 0.32, 1.275) flex justify-between px-3 pt-12 ${isPasswordFocused ? 'translate-y-0 opacity-100' : 'translate-y-40 opacity-0'}`}>
                        <div className="w-12 h-20 bg-green-700 rounded-t-2xl rotate-[-12deg] shadow-lg" />
                        <div className="w-12 h-20 bg-green-700 rounded-t-2xl rotate-[12deg] shadow-lg" />
                    </div>
                </div>
            </div>

            {/* --- FORM CARD --- */}
            <div className="bg-white shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-[2rem] p-10 pt-20 w-full max-w-md border border-slate-100 relative backdrop-blur-xl">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-black text-slate-800 tracking-tight">Get Started</h2>
                    <p className="text-slate-400 text-sm mt-2">Sign up to access your dashboard</p>
                </div>

                <form onSubmit={handleSignup} className="space-y-6">
                    <div className="space-y-1">
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onFocus={() => setIsPasswordFocused(false)}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-green-500/10 focus:border-green-500 focus:bg-white outline-none transition-all placeholder:text-slate-400"
                            required
                        />
                    </div>

                    <div className="space-y-1">
                        <input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onFocus={() => setIsPasswordFocused(false)}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-green-500/10 focus:border-green-500 focus:bg-white outline-none transition-all placeholder:text-slate-400"
                            required
                        />
                    </div>

                    <div className="space-y-1">
                        <input
                            type="password"
                            placeholder="Secure Password"
                            value={password}
                            onFocus={() => setIsPasswordFocused(true)}
                            onBlur={() => setIsPasswordFocused(false)}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-green-500/10 focus:border-green-500 focus:bg-white outline-none transition-all placeholder:text-slate-400"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-4 rounded-2xl font-bold text-white transition-all transform active:scale-[0.97] shadow-[0_10px_20px_-5px_rgba(34,197,94,0.3)] ${
                            loading ? "bg-slate-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"
                        }`}
                    >
                        {loading ? "Verifying..." : "Create Account"}
                    </button>
                </form>

                <div className="relative my-10 flex items-center">
                    <div className="flex-grow border-t border-slate-100"></div>
                    <span className="flex-shrink mx-4 text-slate-300 text-xs font-bold uppercase tracking-widest">Or continue with</span>
                    <div className="flex-grow border-t border-slate-100"></div>
                </div>
                        
                <button
  type="button"
  onClick={() => window.open(`${BACKEND_URL}/auth/google`, "_self")}
  className="flex items-center justify-center w-full py-2 mt-3 font-medium transition-colors bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 hover:shadow-sm"
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
                    Already have an account? <Link to="/login" className="text-green-600 font-bold hover:text-green-700 transition-colors">Login</Link>
                </p>
            </div>

            {message && (
                <div className="mt-8 px-6 py-3 bg-white shadow-lg rounded-full border border-slate-100 text-sm font-bold text-slate-700 animate-[bounce_1s_infinite]">
                    {message}
                </div>
            )}

            {/* Global Keyframes for the blink effect */}
            <style>{`
                @keyframes blink {
                    0%, 96%, 100% { transform: scaleY(0); }
                    98% { transform: scaleY(1); }
                }
            `}</style>
        </div>
    );
};

export default Signup;