import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CreateAdminPage from "./components/CreateAdminPage";
import LoginSignup from "./components/LoginSignup.jsx";
import Navbar from "./components/navbar.jsx";
import Signup from "./components/Signup";
import Errorpage from "./components/errorpage.js";
import GOne from "./components/GOne.jsx";
import CustomerDashboard from "./components/CustomerDashboard.js";
import Appointments from "./components/Appointments.jsx";

function App() {
  const [admins, setAdmins] = useState([]); // Maintain the list of admins

  return (
    <div>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<LoginSignup />} />
          <Route
            path="/create-admin"
            element={<CreateAdminPage admins={admins} setAdmins={setAdmins} />}
          />
          <Route path="/customer-board" element={<CustomerDashboard />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/g1" element={<GOne />} />

          <Route path="/404" element={<Errorpage />} />
          <Route path="*" element={<Errorpage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
