import React, { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

export default function CustomerDashboard() {
  const [customers, setCustomers] = useState([]);
  const token = JSON.parse(localStorage.getItem("token"));

  // Function to fetch customers from the database
  const fetchCustomerUsers = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/get_customers_list",
        { user_type: "customer" }, // Send user_type as "customer" to retrieve customers
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status) {
        setCustomers(response.data.users); // Set the customer users data
      } else {
        throw new Error("Failed to load customers");
      }
    } catch (error) {
      console.error("Error fetching customer users", error);
      toast.error("Failed to load customer users");
    }
  };

  // Fetch customers on component mount
  useEffect(() => {
    fetchCustomerUsers();
  }, []);

  return (
    <div>
      <Toaster />

      {/* Center the Customers List heading */}
      <div style={{ textAlign: "center", margin: "20px 0" }}>
        <h3>Customers List</h3>
      </div>

      {/* Customers Table */}
      <div style={{ overflowX: "auto" }}>
        <table className="table" style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>Date of Birth</th>
              <th>Username</th>
              <th>Customer Status</th> {/* New column for customer status */}
            </tr>
          </thead>
          <tbody>
            {customers.length > 0 &&
              customers.map((customer, index) => (
                <tr key={index}>
                  <td>{customer.first_name}</td>
                  <td>{customer.last_name}</td>
                  <td>{customer.email}</td>
                  <td>{customer.mobile}</td>
                  <td>{customer.dob}</td>
                  <td>{customer.user_name}</td>
                  <td>{customer.customer_status || "N/A"}</td>{" "}
                  {/* Display customer status */}
                </tr>
              ))}
            {customers.length === 0 && (
              <tr>
                <td colSpan={7}>No Records Found</td>{" "}
                {/* Adjust colspan to 7 */}
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
