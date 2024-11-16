import React from "react";
import "../styles/gOne.css";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

const PaginationComponent = ({
  pageSize,
  setPageSize,
  currentPage,
  pagesCount,
  handleClick,
}) => {
  return (
    <div className="pagination_container">
      <div className="pageSize_container">
        Page Size -
        <FormControl>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={pageSize}
            onChange={(e) => setPageSize(e.target.value)}
          >
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={20}>20</MenuItem>
            <MenuItem value={30}>30</MenuItem>
          </Select>
        </FormControl>
      </div>

      <div className="pagination_btns_grp">
        <button
          type="button"
          className={
            "pagination_btn" +
            `${currentPage <= 0 ? " pagination_btn_diable" : ""}`
          }
          disabled={currentPage <= 0}
          onClick={(e) => handleClick(e, currentPage - 1)}
        >
          Prev
        </button>
        <span>
          {currentPage + 1} / {pagesCount}{" "}
        </span>
        <button
          type="button"
          className={
            "pagination_btn" +
            `${currentPage >= pagesCount - 1 ? " pagination_btn_diable" : ""}`
          }
          disabled={currentPage >= pagesCount - 1}
          onClick={(e) => handleClick(e, currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PaginationComponent;
