import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";

import { Link } from "react-router-dom";

const login: React.FC = () => {
  const [loginCredentials, setLoginCredentials] = useState<{
    username: string | null;
    password: string | null;
  }>({
    username: null,
    password: null,
  });

  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginCredentials(
      (prev: { username: string | null; password: string | null }) => ({
        ...prev,
        [e.target.name]: e.target.value,
      })
    );
  };

  const loginHandler = async (e: any) => {
    e.preventDefault();
    console.log("Login credentials: ", loginCredentials);
    try {
      const response = await fetch("http://localhost:8080/api/user/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginCredentials),
      });

      navigate("/");
    } catch (error) {
      console.log("Login error: ", error);
    }
  };

  return (
    <main className="login__main">
      <h3 className="login__h3">Login Page</h3>
      <form className="login__form" onSubmit={loginHandler}>
        <div>
          <label>Username</label>
          <input
            type="text"
            placeholder="username"
            name="username"
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label>Password</label>
          <input
            type="password"
            placeholder="password"
            name="password"
            onChange={handleInputChange}
            required
          />
        </div>

        <button>Login</button>
        <div>
          <p>
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </div>
      </form>
    </main>
  );
};

export default login;
