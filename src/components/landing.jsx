import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import React, { useEffect } from "react";

function Landing() {
  const navigate = useNavigate();

  useEffect(
    () => {
      const user = localStorage.getItem("user");
      if (user) {
        navigate("/home");
      }
    },
    [navigate]
  );

  const handleSuccess = credentialResponse => {
    const decoded = jwtDecode(credentialResponse.credential);
    console.log(decoded);
    localStorage.setItem("user", JSON.stringify(decoded));
    navigate("/home");
  };

  return (
    <div className="landing-container">
      <h1>Welcome to TextTones</h1>
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => console.log("Login failed")}
        useOneTap
      />
    </div>
  );
}

export default Landing;
