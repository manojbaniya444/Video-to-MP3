import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Register: React.FC = () => {
  const [registerCredentials, setRegisterCredentials] = useState({
    username: "",
    password: "",
  });

  const navigate = useNavigate();

  const registerHandler = async (e: any) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/api/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registerCredentials),
      });
      if (response.ok) {
        navigate("/login");
      }
    } catch (error) {
      console.log("Register error: ", error);
    }
  };

  return (
    <main className="register__main">
      <h3>Register</h3>
      <form onSubmit={registerHandler}>
        <div>
          <label>Username</label>
          <input
            required
            type="text"
            placeholder="username"
            className="input"
            name="username"
            onChange={(e) => {
              setRegisterCredentials((prev) => ({
                ...prev,
                [e.target.name]: e.target.value,
              }));
            }}
          />
        </div>
        <div>
          <label>Password</label>
          <input
            required
            type="password"
            placeholder="password"
            className="input"
            name="password"
            onChange={(e) => {
              setRegisterCredentials((prev) => ({
                ...prev,
                [e.target.name]: e.target.value,
              }));
            }}
          />
        </div>

        <button className="button">Register</button>
        <div>
          <p>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </form>
    </main>
  );
};

export default Register;
