import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import toast from "react-hot-toast";

const editModalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function EditAdminModal({ open, onClose, adminId, fetchAdminUsers, token }) {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    dob: "",
    mobile: "",
    user_name: "",
    user_type: "",
  });
  const [loading, setLoading] = useState(false);

  
  useEffect(() => {
      if (adminId && open) {
        console.log("admin id : " + adminId)
      const fetchAdminDetails = async () => {
        setLoading(true);
        try {
          const response = await axios.get(
            `http://localhost:5000/superadmin/getAdminDetail?adminid=${adminId}`,
            { headers: { authorization: `Bearer ${token}` } }
          );
          if (response.data) {
              console.log("response : " + response)
            setFormData(response.data.data);
          } else {
            toast.error("Failed to load admin details");
          }
        } catch (error) {
          console.error("Error fetching admin details:", error);
          toast.error("Failed to load admin details");
        } finally {
          setLoading(false);
        }
      };
      fetchAdminDetails();
    }
  }, [adminId, open, token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:5000/superadmin/updateAdminDetail`,
        { ...formData, admin_id: adminId },
        { headers: { authorization: `Bearer ${token}` } }
      );
      if (response) {
        toast.success("Admin updated successfully");
        fetchAdminUsers();
        onClose();
      } else {
        throw new Error("Failed to update admin");
      }
    } catch (error) {
      console.error("Error updating admin:", error);
      toast.error("Failed to update admin");
    }
  };

  return (
    <Modal open={open} onClose={onClose} closeAfterTransition>
      <Box sx={editModalStyle}>
        <Typography variant="h6">Edit Admin</Typography>
        {loading ? (
          <Typography>Loading...</Typography>
        ) : (
          <form onSubmit={handleUpdateSubmit}>
            <TextField
              label="First Name"
              name="first_name"
              value={formData.first_name || ""}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="Last Name"
              name="last_name"
              value={formData.last_name || ""}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              value={formData.email || ""}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
            />
            {/* <TextField
              label="Date of Birth"
              name="dob"
              type="date"
              value={formData.dob || ""}
              onChange={handleChange}
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
              margin="normal"
            /> */}
            <TextField
              label="Mobile"
              name="mobile"
              value={formData.mobile || ""}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="Username"
              name="user_name"
              value={formData.user_name || ""}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="User Type"
              name="user_type"
              value={formData.user_type || ""}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
              disabled // Remove this if User Type should be editable
            />
            <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
              Update Admin
            </Button>
          </form>
        )}
      </Box>
    </Modal>
  );
}
