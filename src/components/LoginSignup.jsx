import React, { useState } from "react";
import "../styles/LoginSignup.css";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const LoginSignup = () => {
  const navigate = useNavigate();

  const [activeForm, setActiveForm] = useState("login");
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
  });
  const [errors, setErrors] = useState({});
  const [signupSuccess, setSignupSuccess] = useState(false);

  const validateLogin = () => {
    const newErrors = {};
    if (!loginData.email) newErrors.email = "Email is required";
    if (!loginData.password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateSignup = () => {
    const newErrors = {};
    if (!signupData.firstName) newErrors.firstName = "First name is required";
    if (!signupData.lastName) newErrors.lastName = "Last name is required";
    if (!signupData.email) newErrors.email = "Email is required";
    if (!signupData.password) newErrors.password = "Password is required";
    if (!signupData.phone) newErrors.phone = "Phone number is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (validateLogin()) {
      console.log("Login successful:", loginData);
      // Perform login action
      try {
        const reqObj = {
          user_name: loginData.email,
          password: loginData.password,
        };
        const response = await axios.post(
          "http://localhost:5000/api/login_user",
          reqObj
        );
        console.log("resssss", response);
        if (response.data.status) {
          const responseData = response.data.data || {};
          localStorage.setItem("userRole", JSON.stringify(responseData));
          localStorage.setItem("token", JSON.stringify(response.data.token));
          if (responseData.user_type === "super_admin") {
            navigate("/create-admin");
          } else if (responseData.user_type === "admin") {
            navigate("/admin-dashboard");
          } else if (responseData.user_type === "customer") {
            navigate("/g1");
          } else navigate("/404");
        } else {
          toast.error(
            "Invalid Credentials " +
              (response?.message || "enter correct credentials")
          );
        }
        console.log("response", response);
      } catch (error) {
        toast.error(
          "Error logging user: " +
            (error.response?.data?.message || error.message)
        );
      }
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (validateSignup()) {
      console.log("Signup successful:", signupData);

      setSignupSuccess(true);
      setSignupData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        phone: "",
      }); // Reset form
      setErrors({});
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <h1>{activeForm === "login" ? "Login" : "Signup"}</h1>
        <Toaster />

        {/* Signup Success Message */}
        {signupSuccess && (
          <div className="success-message">
            <p>Signup successful! You can now login.</p>
            <a
              href="#"
              onClick={() => {
                setActiveForm("login");
                setSignupSuccess(false);
              }}
            >
              Go to Login
            </a>
          </div>
        )}

        {/* Login Form */}
        {!signupSuccess && activeForm === "login" && (
          <form className="form" onSubmit={handleLogin}>
            <div className="input">
              <input
                type="text"
                placeholder="User Name"
                value={loginData.email}
                onChange={(e) =>
                  setLoginData({ ...loginData, email: e.target.value })
                }
              />
              {errors.email && <span className="error">{errors.email}</span>}
            </div>
            <div className="input">
              <input
                type="password"
                placeholder="Password"
                value={loginData.password}
                onChange={(e) =>
                  setLoginData({ ...loginData, password: e.target.value })
                }
              />
              {errors.password && (
                <span className="error">{errors.password}</span>
              )}
            </div>
            <div className="submit">
              <button className="submit-button">Login</button>
            </div>
            <div className="forgot-password">
              <span>
                New user? <a href="/signup">Sign up here.</a>
              </span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginSignup;
