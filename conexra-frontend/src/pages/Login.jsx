import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserTie, FaUser, FaLock, FaEnvelope } from "react-icons/fa";
import { login } from "../services/authService";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("employee");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    setLoading(true);
    setError("");

    login({ email, password })
      .then((data) => {
        const user = data.user;

        if (user.role !== role) {
          setError(`This account is not registered as ${role}`);
          setLoading(false);
          return;
        }

        if (role === "admin" || role === "hr") {
          navigate("/dashboard");
        } else {
          navigate("/employee/dashboard");
        }

        setLoading(false);
      })
      .catch((err) => {
        const message = err?.response?.data?.error || err?.message || "Login failed";
        setError(message);
        setLoading(false);
      });
  };

  return (
    <div style={container}>
      <div style={loginCard}>
        {/* Logo with Conexra text */}
        <div style={logoContainer}>
          <h1 style={logo}>Conexra</h1>
          <p style={logoSubtitle}>HR Administration Platform</p>
        </div>

        {/* Role Selector */}
        <div style={roleSelector}>
          <button
            onClick={() => setRole("admin")}
            style={{
              ...roleButton,
              ...(role === "admin" ? activeRole : {}),
            }}
          >
            <FaUserTie style={roleIcon} />
            <span>Admin</span>
          </button>
          <button
            onClick={() => setRole("employee")}
            style={{
              ...roleButton,
              ...(role === "employee" ? activeRole : {}),
            }}
          >
            <FaUser style={roleIcon} />
            <span>Employee</span>
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div style={errorStyle}>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} style={form}>
          <div style={inputGroup}>
            <label style={label}>Email</label>
            <div style={inputWrapper}>
              <FaEnvelope style={inputIcon} />
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={input}
                disabled={loading}
              />
            </div>
          </div>

          <div style={inputGroup}>
            <label style={label}>Password</label>
            <div style={inputWrapper}>
              <FaLock style={inputIcon} />
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={input}
                disabled={loading}
              />
            </div>
          </div>

          <button 
            type="submit" 
            style={loginButton}
            disabled={loading}
            onMouseEnter={(e) => e.target.style.opacity = "0.9"}
            onMouseLeave={(e) => e.target.style.opacity = "1"}
          >
            {loading ? "Signing in..." : `Sign in as ${role === "admin" ? "Admin" : "Employee"}`}
          </button>
        </form>

        {/* Forgot Password Link */}
        <div style={footer}>
          <a 
            href="#" 
            style={link}
            onMouseEnter={(e) => e.target.style.color = "#3b82f6"}
            onMouseLeave={(e) => e.target.style.color = "#64748b"}
          >
            Forgot password?
          </a>
        </div>
      </div>
    </div>
  );
}

// ============ FIXED STYLES - INPUT TEXT NOW VISIBLE ============

const container = {
  height: "100vh",
  width: "100vw",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  margin: 0,
  padding: 0,
  position: "fixed",
  top: 0,
  left: 0,
  fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
};

const loginCard = {
  background: "white",
  borderRadius: "20px",
  padding: "48px 40px",
  width: "400px",
  boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
};

const logoContainer = {
  textAlign: "center",
  marginBottom: "32px",
};

const logo = {
  fontSize: "32px",
  fontWeight: "700",
  color: "#1e293b",
  margin: "0 0 4px 0",
  letterSpacing: "-0.5px",
};

const logoSubtitle = {
  fontSize: "14px",
  color: "#64748b",
  margin: 0,
  fontWeight: "400",
};

const roleSelector = {
  display: "flex",
  gap: "12px",
  marginBottom: "24px",
  padding: "4px",
  background: "#f1f5f9",
  borderRadius: "12px",
};

const roleButton = {
  flex: 1,
  padding: "12px",
  border: "none",
  background: "transparent",
  borderRadius: "10px",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: "500",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  transition: "all 0.2s ease",
  color: "#64748b",
};

const activeRole = {
  background: "white",
  color: "#3b82f6",
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
};

const roleIcon = {
  fontSize: "16px",
};

const form = {
  width: "100%",
};

const inputGroup = {
  marginBottom: "20px",
  width: "100%",
};

const label = {
  display: "block",
  fontSize: "14px",
  fontWeight: "500",
  color: "#334155",
  marginBottom: "6px",
};

const inputWrapper = {
  position: "relative",
  width: "100%",
};

const inputIcon = {
  position: "absolute",
  left: "14px",
  top: "50%",
  transform: "translateY(-50%)",
  color: "#64748b", // Darker icon color
  fontSize: "16px",
  zIndex: 1,
};

// FIXED: Input text color is now dark and visible
const input = {
  width: "100%",
  padding: "14px 14px 14px 45px",
  border: "2px solid #e2e8f0",
  borderRadius: "12px",
  fontSize: "14px",
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.2s ease, box-shadow 0.2s ease",
  backgroundColor: "#ffffff", // Pure white background
  color: "#0f172a", // Dark color for typed text
  fontWeight: "500", // Slightly bolder for better visibility
  caretColor: "#3b82f6", // Blue cursor
};

// Add focus style
const inputFocus = {
  ...input,
  borderColor: "#3b82f6",
  boxShadow: "0 0 0 3px rgba(59,130,246,0.1)",
};

const errorStyle = {
  background: "#fef2f2",
  color: "#dc2626",
  padding: "12px 16px",
  borderRadius: "10px",
  fontSize: "14px",
  marginBottom: "20px",
  textAlign: "center",
  border: "1px solid #fecaca",
  width: "100%",
  boxSizing: "border-box",
};

const loginButton = {
  width: "100%",
  padding: "14px",
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  color: "white",
  border: "none",
  borderRadius: "12px",
  fontSize: "16px",
  fontWeight: "600",
  cursor: "pointer",
  marginTop: "8px",
  marginBottom: "20px",
  transition: "opacity 0.2s ease, transform 0.1s ease",
  boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
};

const footer = {
  textAlign: "center",
};

const link = {
  color: "#64748b",
  fontSize: "14px",
  textDecoration: "none",
  transition: "color 0.2s ease",
  cursor: "pointer",
};

export default Login;