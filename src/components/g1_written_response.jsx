import * as React from "react";
import "../styles/gOne.css";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "45%",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const G1WrittenResponse = ({ setOpen, setExamStatus, totalExamResult }) => {
  const navigate = useNavigate();

  return (
    <div>
      <Modal
        open={true}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Result
          </Typography>
          <Typography
            id="modal-modal-description"
            sx={{
              mt: 2,
              fontWeight: "800",
              color: totalExamResult?.result === "Pass" ? "green" : "red",
            }}
          >
            {totalExamResult?.message}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Total Marks Secured:{" "}
            <span style={{ color: "blue", fontWeight: "600" }}>
              {totalExamResult?.total_marks}/{totalExamResult?.total_questions}
            </span>
          </Typography>
          <Button
            type="button"
            variant="contained"
            sx={{
              mt: 5,
              ml: "20%",
              mr: 5,
              backgroundColor: "#4b5e9c",
              color: "whitesmoke",
            }}
            onClick={(e) => {
              e.preventDefault();
              if (totalExamResult?.result === "Pass") {
                navigate("/g2");
                setExamStatus("");
              } else {
                setOpen(true);
                setExamStatus("");
              }
            }}
          >
            {totalExamResult?.result === "Pass"
              ? "Book G2 Test"
              : "Retake G1 test ?"}
          </Button>
          <Button
            type="button"
            variant="outlined"
            color="error"
            sx={{
              mt: 5,
            }}
            onClick={(e) => {
              e.preventDefault();
              setOpen(false);
              setExamStatus("");
            }}
          >
            Cancel
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default G1WrittenResponse;
