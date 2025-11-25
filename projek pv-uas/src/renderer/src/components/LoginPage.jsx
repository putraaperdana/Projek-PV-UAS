import { useContext, useState, useEffect } from "react"; 
import { AuthContext } from "./Auth";
import { Navigate, NavLink, useNavigate } from "react-router";

export default function LoginPage() {
  const { login, isLoginError, user } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.role == "admin") {
        navigate('/admin');
      } else if (user.role == "company") {
        navigate('/company');
      } else {
        navigate('/applicant');
      }
    }
  }, [user, navigate]);

  if (user) {
    return null; 
  }


  return (
    <div>
      <div className="page-header">Job Seeker App</div>
      
      <div className="form-container">
        <h2>Logan</h2>
        
        {isLoginError && <p className="error-message">Login gagal! Username atau password salah.</p>}

        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text" id="username" value={username} 
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password" id="password" value={password} 
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        
        <button onClick={() => login(username, password)} type="submit" className="form-button">
          Login
        </button>
        
        <p className="form-link">
          Doesn't have an account? <NavLink to="/register">Register</NavLink>
        </p>
      </div>
    </div>
  );
}

