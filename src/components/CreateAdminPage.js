import React, { useState, useEffect } from "react";
import axios from "axios";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import toast, { Toaster } from "react-hot-toast";
import EditAdminModal from "./EditAdminModal";


const style = {
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

export default function CreateAdminPage({ admins, setAdmins }) {
  const initialFormData = {
    first_name: "",
    last_name: "",
    email: "",
    dob: "",
    mobile: "",
    user_name: "",
    user_type: "admin",
  };
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [open, setOpen] = useState(false);

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query

const handleSearchChange = (e) => {
  setSearchQuery(e.target.value);
  fetchAdminUsers()
};

  const token = JSON.parse(localStorage.getItem("token"));

  // Function to fetch users from the database
  const fetchAdminUsers = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/get_users_list",
        { user_type: "admin", search: searchQuery, }, // Send user_type as "admin" to retrieve admins
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status) {
        setAdmins(response.data.users); // Set the admin users data
      } else {
        throw new Error("Failed to load admin users");
      }
    } catch (error) {
      console.error("Error fetching admin users", error);
      toast.error("Failed to load admin users");
    }
  };

  // Fetch users on component mount
  useEffect(() => {
    fetchAdminUsers();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let formErrors = {};
    if (!formData.first_name) formErrors.first_name = "First name is required";
    if (!formData.last_name) formErrors.last_name = "Last name is required";
    if (!formData.email) {
      formErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      formErrors.email = "Email is invalid";
    }
    if (!formData.mobile) {
      formErrors.mobile = "Mobile number is required";
    } else if (!/^\d{10}$/.test(formData.mobile)) {
      formErrors.mobile = "Mobile number must be 10 digits";
    }
    if (!formData.dob) formErrors.dob = "Date of birth is required";
    if (!formData.user_name) formErrors.user_name = "Username is required";

    return formErrors;
  };

  const closeModal = () => {
    setOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const requestObject = {
      user_type: formData.user_type,
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      dob: formData.dob,
      mobile: formData.mobile,
      user_name: formData.user_name,
      password: "",
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/api/create_user",
        requestObject
      );
      if (response.data.status) {
        console.log("Admin created successfully", response.data);
        fetchAdminUsers(); // Fetch updated list of admins from the database
        closeModal(); // Close modal
        toast.success(
          "User Created " +
            (response?.data?.message ||
              "User created successfully, password forwarded to user email"),
          {
            duration: 7000,
          }
        );
      } else {
        toast.error(response?.data?.message || "Failed to create user", {
          duration: 7000,
        });
      }
    } catch (error) {
      console.error("Error creating admin user", error);
      toast.error(
        "Error creating user: " +
          (error.response?.data?.message || error.message)
      );
    }
    setFormData(initialFormData);
  };


  const openEditModal = (admin) => {
    console.log('admin : ' + admin)
    setSelectedAdmin(admin);
    setEditModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this admin?")) {
      try {
        const response = await axios.delete(
          `http://localhost:5000/superadmin/deleteAdmin?admin_id=${id}`,
          { headers: { authorization: `Bearer ${token}` } }
        );
        if (response) {
          toast.success("Admin deleted successfully");
          fetchAdminUsers();
        } else {
          throw new Error("Failed to delete admin");
        }
      } catch (error) {
        console.error("Error deleting admin", error);
        toast.error("Failed to delete admin");
      }
    }
  };

  return (
    <div>
      <Toaster />

      {/* Center the button */}
      <div
        style={{ display: "flex", justifyContent: "center", margin: "20px 0" }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpen(true)}
        >
          Create Admin
        </Button>
      </div>

      <Modal
        open={open}
        onClose={closeModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <Typography id="transition-modal-title" variant="h6" component="h2">
              Create Admin
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                label="First Name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                fullWidth
                error={!!errors.first_name}
                helperText={errors.first_name}
                required
                margin="normal"
              />
              <TextField
                label="Last Name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                fullWidth
                error={!!errors.last_name}
                helperText={errors.last_name}
                required
                margin="normal"
              />
              <TextField
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                fullWidth
                error={!!errors.email}
                helperText={errors.email}
                required
                margin="normal"
              />
              <TextField
                label="Mobile"
                type="text"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                fullWidth
                error={!!errors.mobile}
                helperText={errors.mobile}
                required
                margin="normal"
              />
              <TextField
                label="Date of Birth"
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                fullWidth
                error={!!errors.dob}
                helperText={errors.dob}
                required
                margin="normal"
                inputProps={{ max: new Date().toISOString().split("T")[0] }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                label="Username"
                name="user_name"
                value={formData.user_name}
                onChange={handleChange}
                fullWidth
                error={!!errors.user_name}
                helperText={errors.user_name}
                required
                margin="normal"
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
              >
                Create Admin
              </Button>
              <Button
                type="button"
                variant="contained"
                color="error"
                onClick={() => {
                  setOpen(false);
                  setFormData(initialFormData);
                }}
                sx={{ mt: 2, ml: 5 }}
              >
                Cancel
              </Button>
            </form>
          </Box>
        </Fade>
      </Modal>

      {/* Center the Admins List heading */}
      <div style={{ textAlign: "center", margin: "20px 0" }}>
        <h3>Admins List</h3>
      </div>


      <EditAdminModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        adminId={selectedAdmin}
        fetchAdminUsers={fetchAdminUsers}
        token={token}
      />


<div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
  <TextField
    label="Search by Name or Email"
    variant="outlined"
    fullWidth
    value={searchQuery}
    onChange={handleSearchChange} // Update search query on change
  />
</div>

      {/* Admins Table */}
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
              <th>Admin Status</th> {/* New column for Admin Status */}
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {admins.length > 0 &&
              admins.map((admin, index) => (
                <tr key={index}>
                  <td>{admin.first_name}</td>
                  <td>{admin.last_name}</td>
                  <td>{admin.email}</td>
                  <td>{admin.mobile}</td>
                  <td>{admin.dob}</td>
                  <td>{admin.user_name}</td>
                  <td>{admin.admin_status || "N/A"}</td>{" "}
                  <td>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => openEditModal(admin._id)}
                    style={{ marginRight: "8px" }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleDelete(admin._id)}
                  >
                    Delete
                  </Button>
                </td>
                </tr>
              ))}
            {admins.length === 0 && (
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
