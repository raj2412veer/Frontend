import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import driveTestLogo from "../images/Drive_test_logo.png";
import "../styles/LoginSignup.css";
import { useNavigate, useLocation } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const pagePathName = location.pathname;
  const userRole = JSON.parse(localStorage.getItem("userRole"));
  const token = JSON.parse(localStorage.getItem("token"));

  console.log("navbar=>", { userRole, token });

  const handleSignOut = async () => {
    await axios.post("http://localhost:5000/api/logout_user", {
      user_id: userRole.user_id,
      user_name: userRole.user_name,
    });
    localStorage.removeItem("userRole");
    localStorage.removeItem("token");
    navigate("/");
  };

  useEffect(() => {
    if (
      !token &&
      location.pathname !== "/" &&
      location.pathname !== "/signup"
    ) {
      toast.error("Unauthorized request please login");
      localStorage.removeItem("userRole");
      navigate("/");
    }
  }, [location.pathname]);
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <img className="logo" src={driveTestLogo} alt="Drive Test" />
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              {userRole?.user_type === "super_admin" && (
                <>
                  <li className="nav-item">
                    <Link
                      className={
                        "nav-link" +
                        `${
                          pagePathName === "/create-admin"
                            ? " nav_link_active"
                            : ""
                        }`
                      }
                      to="/create-admin"
                    >
                      Admin Board
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className={
                        "nav-link" +
                        `${
                          pagePathName === "/customer-board"
                            ? " nav_link_active"
                            : ""
                        }`
                      }
                      to="/customer-board"
                    >
                      Customer Board
                    </Link>
                  </li>
                </>
              )}
              {userRole?.user_type === "admin" && (
                <>
                  <li className="nav-item">
                    <Link
                      className={
                        "nav-link" +
                        `${
                          pagePathName === "/appointments"
                            ? " nav_link_active"
                            : ""
                        }`
                      }
                      to="/appointments"
                    >
                      Appointments
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className={
                        "nav-link" +
                        `${
                          pagePathName === "/dashboard"
                            ? " nav_link_active"
                            : ""
                        }`
                      }
                      to="/dashboard"
                    >
                      Dashboard
                    </Link>
                  </li>
                </>
              )}
              {userRole?.user_type === "customer" && (
                <>
                  <li className="nav-item">
                    <Link
                      className={
                        "nav-link" +
                        `${pagePathName === "/g1" ? " nav_link_active" : ""}`
                      }
                      to="/g1"
                    >
                      G1
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className={
                        "nav-link" +
                        `${pagePathName === "/g2" ? " nav_link_active" : ""}`
                      }
                      to="/g2"
                    >
                      G2
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className={
                        "nav-link" +
                        `${pagePathName === "/g3" ? " nav_link_active" : ""}`
                      }
                      to="/g3"
                    >
                      G3
                    </Link>
                  </li>
                </>
              )}
            </ul>
            {userRole?.user_type && (
              <ul className="navbar-nav ms-auto">
                <li className="nav-item">
                  <button
                    className="btn btn-outline-danger"
                    onClick={handleSignOut}
                  >
                    Sign Out
                  </button>
                </li>
              </ul>
            )}
          </div>
        </div>
      </nav>
      <Toaster />
    </>
  );
};

export default Navbar;
