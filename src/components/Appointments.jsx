import React, { useState } from "react";
import "../styles/appointment.css";
import axios from "axios";

const Appointments = () => {
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    testType: "Driving Test", // Default option
  });

  const [slots, setSlots] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.date || !formData.time) {
      alert("Please select both date and time for the time slot.");
      return;
    }

    setSlots((prevSlots) => [...prevSlots, { ...formData }]);
    setFormData({
      date: "",
      time: "",
      testType: "Driving Test",
    });
    const response = await axios.post(
      "http://localhost:5000/api/create_appointment",
      formData
    );
  };

  return (
    <div className="time-slot-form">
      <h2>Create Available Time Slot</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Date:</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Time:</label>
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Test Type:</label>
          <select
            name="testType"
            value={formData.testType}
            onChange={handleChange}
          >
            <option value="Driving Test">Driving Test</option>
            <option value="Written Test">Written Test</option>
          </select>
        </div>
        <button type="submit">Add Time Slot</button>
      </form>

      <h3>Available Time Slots</h3>
      <ul>
        {slots.map((slot, index) => (
          <li key={index}>
            {slot.date} at {slot.time} ({slot.testType})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Appointments;
