import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [auth, setAuth] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/user/auth", {
          method: "POST",
          credentials: "include",
        });
        const responseParse = await response.json();

        setLoading(false);

        if (response.ok && responseParse.auth) {
          setAuth(true);
        } else {
          setAuth(false);
        }
      } catch (error) {
        console.log("Auth error: ", error);
        setAuth(false);
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <div>
        <h1>Authenticating...</h1>
      </div>
    );
  }

  return auth ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
