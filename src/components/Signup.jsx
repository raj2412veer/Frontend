import React, { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import "../styles/Signup.css";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    dob: "",
    mobile: "",
    user_name: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.first_name) newErrors.first_name = "First name is required";
    if (!formData.last_name) newErrors.last_name = "Last name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.dob) newErrors.dob = "Date of birth is required";
    if (!formData.mobile) newErrors.mobile = "Mobile number is required";
    if (!formData.user_name) newErrors.user_name = "Username is required";
    if (!formData.password) newErrors.password = "Password is required";

    // validation for email format
    const emailRegex = /\S+@\S+\.\S+/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    // validation for mobile number format
    if (formData.mobile && !/^\d{10}$/.test(formData.mobile)) {
      newErrors.mobile = "Mobile number must be 10 digits";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      const userData = {
        user_type: "customer",
        ...formData,
      };

      try {
        const response = await axios.post(
          "http://localhost:5000/api/create_user",
          userData
        );
        if (response.data.status) {
          toast.success(
            response?.data?.message || "User created successfully! "
          );
        } else {
          toast.error(response?.data?.message || "user creation failed");
        }
        navigate("/");
      } catch (error) {
        toast.error(error.response?.data?.message || error.message);
      }
    } else {
      toast.error("Please fix the errors in the form.");
    }
  };

  return (
    <div className="container">
      <h2>Signup</h2>
      <Toaster />
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="first_name" className="form-label">
            First Name
          </label>
          <input
            type="text"
            className="form-control"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
          />
          {errors.first_name && (
            <div className="text-danger">{errors.first_name}</div>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="last_name" className="form-label">
            Last Name
          </label>
          <input
            type="text"
            className="form-control"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
          />
          {errors.last_name && (
            <div className="text-danger">{errors.last_name}</div>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <div className="text-danger">{errors.email}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="dob" className="form-label">
            Date of Birth
          </label>
          <input
            type="date"
            className="form-control"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
          />
          {errors.dob && <div className="text-danger">{errors.dob}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="mobile" className="form-label">
            Mobile
          </label>
          <input
            type="text"
            className="form-control"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
          />
          {errors.mobile && <div className="text-danger">{errors.mobile}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="user_name" className="form-label">
            Username
          </label>
          <input
            type="text"
            className="form-control"
            name="user_name"
            value={formData.user_name}
            onChange={handleChange}
          />
          {errors.user_name && (
            <div className="text-danger">{errors.user_name}</div>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && (
            <div className="text-danger">{errors.password}</div>
          )}
        </div>

        <button type="submit" className="btn btn-primary">
          Signup
        </button>
      </form>

      <div className="forgot-password">
        <span>
          <a href="/"> {`<- Back to Login`}</a>
        </span>
      </div>
    </div>
  );
}
