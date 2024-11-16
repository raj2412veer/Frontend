import React, { useState, useEffect, useContext } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import "../styles/gOne.css";
import Radio from "@mui/joy/Radio";
import RadioGroup from "@mui/joy/RadioGroup";
import Timer from "./timer";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxHeight: "90%",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
  overflowY: "auto",
};
const stickyHeader = {
  position: "sticky",
  top: 0,
  backgroundColor: "white",
  zIndex: 10,
  paddingBottom: "10px",
  borderBottom: "1px solid #ccc",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};
const scrollableContent = {
  flex: 1,
  overflowY: "auto",
};

const WrittenTestModal = ({ setOpen, handleWrittenQuestionSubmit }) => {
  const [selectedAnswerList, setSelectedAnswerList] = useState([]);
  const [questionsData, setQuestionsData] = useState([]);
  const token = JSON.parse(localStorage.getItem("token"));

  useEffect(() => {
    const fetchWrittenQuestions = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/get_written_questions",
          {
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.status) {
          setQuestionsData(response.data.data);
        } else {
          toast.error("Failed to fetch questions");
        }
      } catch (error) {
        toast.error("Internal server error");
      }
    };
    fetchWrittenQuestions();
  }, []);

  const handleChange = (event, question) => {
    const existingSelectionData = [...selectedAnswerList];
    const reqObj = {
      question,
      answer: event.target.value,
    };
    const index = existingSelectionData.findIndex(
      (x) => x.question === question
    );
    if (index !== -1) {
      existingSelectionData.splice(index, 1, reqObj);
    } else {
      existingSelectionData.push(reqObj);
    }
    setSelectedAnswerList(existingSelectionData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleWrittenQuestionSubmit(selectedAnswerList);
  };
  return (
    <div>
      <Modal
        open={questionsData.length > 0}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <form onSubmit={handleSubmit}>
          <Box sx={style}>
            <Box sx={stickyHeader}>
              <div>
                <h4>Exam</h4>
                <p style={{ color: "#1e1ed5", fontWeight: "bold" }}>
                  Secure atleast 8 marks to get pass
                </p>
              </div>
              <Timer setOpen={setOpen} />
            </Box>
            <Box sx={scrollableContent}>
              {questionsData.map((item, ind) => (
                <React.Fragment key={`${item}_${ind}`}>
                  <h3 key={`${item}_${ind}_${ind + 1}`}>
                    {ind + 1}. {item.question_text}
                  </h3>
                  <div
                    key={`${item}_${ind}_${ind}_${ind + 2}`}
                    className="options"
                  >
                    {item.options.map((option, optionIndex) => (
                      <div key={`${option}_${optionIndex}`}>
                        <RadioGroup
                          defaultValue="outlined"
                          name="radio-buttons-group"
                        >
                          <Radio
                            value={optionIndex + 1}
                            label={option}
                            variant="soft"
                            checked={selectedAnswerList.some(
                              (x) =>
                                x.answer === String(optionIndex + 1) &&
                                x.question === String(ind + 1)
                            )}
                            onChange={(e) => handleChange(e, String(ind + 1))}
                            name="options"
                          />
                        </RadioGroup>
                      </div>
                    ))}
                  </div>
                </React.Fragment>
              ))}
            </Box>
            <Button
              type="submit"
              variant="contained"
              sx={{
                mt: 4,
                mr: "30%",
                ml: "30%",
                backgroundColor: "#4b5e9c",
                color: "whitesmoke",
              }}
            >
              Submit
            </Button>
          </Box>
        </form>
      </Modal>
    </div>
  );
};

export default WrittenTestModal;
