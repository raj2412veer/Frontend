import React, { useState, useEffect } from "react";
import "../styles/gOne.css";
import Table from "@mui/joy/Table";
import TextField from "@mui/material/TextField";
import PaginationComponent from "../utils/paginationComponent";
import WrittenTestModal from "./g1_written_modal";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import G1WrittenResponse from "./g1_written_response";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import "../styles/errorpage.css";

const GOne = () => {
  // const pageSize = 5;
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(0);

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [examStatus, setExamStatus] = useState("");
  const [totalExamResult, setTotalExamResult] = useState({});
  const [userHistory, setUserHistory] = useState([]);
  const token = JSON.parse(localStorage.getItem("token"));
  const userData = JSON.parse(localStorage.getItem("userRole"));
  const navigate = useNavigate();

  const handlePagination = (e, index) => {
    e.preventDefault();
    setCurrentPage(index);
  };

  let pagesCount = Math.ceil((userHistory ? userHistory.length : 0) / pageSize);

  if (currentPage >= pagesCount && pagesCount !== 0) setCurrentPage(0);

  const filteredData =
    search !== ""
      ? userHistory.filter(
          (item) =>
            item.result.toLowerCase().startsWith(search.toLowerCase()) ||
            moment(item.dateTime)
              .format("DD MMM YYYY HH:mm")
              .toString()
              .toLowerCase()
              .includes(search.toLowerCase()) ||
            item.total_marks.toLowerCase().startsWith(search.toLowerCase()) ||
            item.license_stage.toLowerCase().startsWith(search.toLowerCase())
        )
      : userHistory;

  const handleWrittenQuestionSubmit = async (answersData) => {
    setOpen(false);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/validate_written_questions",
        { data: answersData, user_id: userData.user_id },
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status) {
        const result = response.data.data;
        setTotalExamResult(result);
        setExamStatus("completed");
      } else {
        toast.error("Failed to submit written exam");
      }
    } catch (error) {
      toast.error("Internal server error");
    }
  };

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/get_user_history",
          { license_stage: "G1", user_id: userData.user_id },
          {
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.status) {
          setUserHistory(response.data.data);
        } else {
          toast.error("Failed to fetch history data");
        }
      } catch (error) {
        toast.error("Internal server error");
      }
    };
    fetchHistory();
  }, [open, examStatus]);

  return (
    <div>
      {((totalExamResult.result ? totalExamResult.result !== "Pass" : false) ||
        userData.license_completed_stage !== "G1") && (
        <>
          <h1>Welcome to G1</h1>
          <div
            className="takeTest"
            onClick={() => {
              setOpen(true);
              setExamStatus("pending");
            }}
          >
            Take test
          </div>
        </>
      )}
      {((totalExamResult && totalExamResult.result === "Pass") ||
        userData.license_completed_stage === "G1") && (
        <>
          <h1>congratulations you passed your G1 test</h1>
          <div className="takeTest" onClick={() => navigate("/g2")}>
            Book G2
          </div>
        </>
      )}
      <div className="table_Container">
        <h2>History</h2>
        <TextField
          label="Search"
          name="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          margin="normal"
          color="primary"
        />
        <Table aria-label="table">
          <thead>
            <tr>
              <th style={{ width: "40%" }}>Date</th>
              <th>Stage</th>
              <th>Score</th>
              <th>Result</th>
            </tr>
          </thead>
          <tbody>
            {filteredData
              .slice(currentPage * pageSize, (currentPage + 1) * pageSize)
              .map((item, ind) => (
                <tr
                  key={`${ind}`}
                  style={{
                    backgroundColor: item.result === "Pass" ? "#6bbb6b" : "",
                  }}
                >
                  <td>
                    {moment(item.dateTime)
                      .format("DD MMM YYYY HH:mm")
                      .toString()}
                  </td>
                  <td>{item.license_stage}</td>
                  <td>
                    {item.total_marks}/{item.total_questions}
                  </td>
                  <td
                    style={{
                      color: item.result === "Fail" ? "red" : "",
                      fontWeight: "bold",
                    }}
                  >
                    {item.result}
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
        {filteredData.length === 0 && (
          <span className="not_records">No Records Found</span>
        )}
        {filteredData.length > 0 && (
          <PaginationComponent
            pageSize={pageSize}
            setPageSize={setPageSize}
            currentPage={currentPage}
            pagesCount={pagesCount}
            handleClick={handlePagination}
          />
        )}
      </div>
      {open && (
        <WrittenTestModal
          setOpen={setOpen}
          handleWrittenQuestionSubmit={handleWrittenQuestionSubmit}
        />
      )}
      {examStatus === "completed" && (
        <G1WrittenResponse
          setOpen={setOpen}
          setExamStatus={setExamStatus}
          totalExamResult={totalExamResult}
        />
      )}
    </div>
  );
};

export default GOne;
