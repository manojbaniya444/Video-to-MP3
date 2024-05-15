import "./navigation.css";
import { useNavigate } from "react-router-dom";

const Navigation = () => {
  const isLoggedIn = true;
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/user/logout", {
        method: "POST",
        credentials: "include",
      });
      navigate("/login");
    } catch (error) {
      console.log("Logout Error: ", error);
    }
  };

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
            <div>
              <p>Welcome</p>
              <button onClick={logoutHandler}>Logout</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
