import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false); // 🔹 new state
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // start loading
    setMessage("");

    try {
      const response = await fetch("https://kind-link-bridge-backend-1.onrender.com/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      let data;
      try {
        data = await response.json();
      } catch {
        setMessage("⚠️ Unexpected server response");
        setLoading(false);
        return;
      }

      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(data));
        setMessage("✅ Login successful!");
        navigate("/dashboard");
      } else {
        setMessage(`❌ Error: ${data.error || "Login failed"}`);
      }
    } catch (error) {
      setMessage("⚠️ Server not reachable");
    } finally {
      setLoading(false); // stop loading in all cases
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-lg rounded-lg p-6 w-96"
      >
        <h2 className="text-2xl font-bold mb-4">Login</h2>

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
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"
          }`}
          disabled={loading} // 🔹 disable while loading
        >
          {loading ? "Logging in..." : "Login"} {/* 🔹 dynamic text */}
        </button>
      </form>

      {message && <p className="mt-4">{message}</p>}
    </div>
  );
};

export default Login;
