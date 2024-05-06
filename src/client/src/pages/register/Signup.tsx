import React from "react";
import { Link } from "react-router-dom";

const Register: React.FC = () => {
  return (
    <main className="register__main">
        <h3>Register</h3>
      <form>
        <div>
          <label>Username</label>
          <input type="text" placeholder="username" />
        </div>
        <div>
          <label>Password</label>
          <input type="password" placeholder="password" />
        </div>

        <button>Register</button>
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
