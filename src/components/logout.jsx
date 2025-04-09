import { googleLogout } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import React from "react";

function Logout() {
    const navigate = useNavigate();

    const handleLogout = () => {
        googleLogout();
        localStorage.removeItem('user');
        navigate("/");
    };

    const user = JSON.parse(localStorage.getItem('user'));

    return (
        <div className="logout-container">
            <div className="user-info">
                {user && (
                    <>
                        <img 
                            src={user.picture} 
                            alt="profile" 
                            className="profile-image"
                        />
                        <h3>{user.name}</h3>
                        <p>{user.email}</p>
                    </>
                )}
            </div>
            <button 
                onClick={handleLogout}
                className="logout-button"
            >
                Sign Out
            </button>
        </div>
    );
}

export default Logout;