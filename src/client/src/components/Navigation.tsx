import React from "react";
import "./navigation.css";

const Navigation = () => {
  const isLoggedIn = true;

  return (
    <nav className="nav__nav">
      <div className="nav__div">
        <div>
          <p className="nav__div__logo">Media Converter</p>
        </div>
        <div>
          {!isLoggedIn ? (
            <ul>
              <li>
                <a href="/register">Register</a>
              </li>
              <li>
                <a href="/login">Login</a>
              </li>
            </ul>
          ) : (
            <p>Welcome</p>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
