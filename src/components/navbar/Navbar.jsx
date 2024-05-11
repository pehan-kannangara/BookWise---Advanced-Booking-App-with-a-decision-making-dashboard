import { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./navbar.css";

const Navbar = () => {
  const { user } = useContext(AuthContext);

  // Debugging: Log the user state
  useEffect(() => {
    console.log("Navbar - AuthContext user:", user);
  }, [user]);

  return (
    <div className="navbar">
      <div className="navContainer">
        <Link to="/" style={{ color: "inherit", textDecoration: "none" }}>
          <span className="logo">BookWise</span>
        </Link>

        {user ? (
          <div className="navItems">
            <span>{`Hello, ${user.username}`}</span> {/* Display username */}
            <button
              className="navButton"
              onClick={() => {
                // Logic for logout
              }}
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="navItems">
            <Link to="/register">
              <button className="navButton">Register</button>
            </Link>
            <Link to="/login">
              <button className="navButton">Login</button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
