import { useNavigate } from "react-router-dom";
import { googleLogout } from "@react-oauth/google";
import React from "react";

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    googleLogout();
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <nav className="navbar">
      {user &&
        <div className="nav-user">
          <img src={user.picture} alt="profile" className="nav-profile-image" />
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>}
    </nav>
  );
}

export default Navbar;
