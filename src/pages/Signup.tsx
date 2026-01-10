import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const BACKEND_URL = "https://kind-link-bridge-backend-1.onrender.com";

const Signup: React.FC = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Normal signup
    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const response = await fetch(`${BACKEND_URL}/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem("user", JSON.stringify(data));
                setMessage("✅ Signup successful!");
                navigate("/dashboard");
            } else {
                setMessage(`❌ Error: ${data.error || "Signup failed"}`);
            }
        } catch (error) {
            setMessage("⚠️ Server not reachable");
        } finally {
            setLoading(false);
        }
    };

    // Google signup
    const signupWithGoogle = () => {
        window.open(`${BACKEND_URL}/auth/google`, "_self");
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <form
                onSubmit={handleSignup}
                className="bg-white shadow-lg rounded-lg p-6 w-96"
            >
                <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>

                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full p-2 mb-3 border rounded"
                    required
                />

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 mb-3 border rounded"
                    required
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 mb-3 border rounded"
                    required
                />

                <button
                    type="submit"
                    className={`w-full py-2 rounded text-white ${
                        loading
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-green-500 hover:bg-green-600"
                    }`}
                    disabled={loading}
                >
                    {loading ? "Signing up..." : "Sign Up"}
                </button>

                {/* Google signup */}
                <button
                    type="button"
                    onClick={signupWithGoogle}
                    className="w-full py-2 mt-3 rounded bg-red-500 text-white hover:bg-red-600"
                >
                    Sign up with Google
                </button>

                <center className="mt-3">
                    <Link to="/login" className="text-blue-500 hover:underline">
                        Already a user? Login
                    </Link>
                </center>
            </form>

            {message && <p className="mt-4 font-medium">{message}</p>}
        </div>
    );
};

export default Signup;
