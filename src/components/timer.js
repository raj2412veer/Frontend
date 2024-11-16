import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

const Timer = ({ setOpen }) => {
  const initialTime = 15 * 60;
  const [timeRemaining, setTimeRemaining] = useState(initialTime);
  const [showAlert, setShowAlert] = useState(false);
  useEffect(() => {
    const timerInterval = setInterval(() => {
      setTimeRemaining((prevTime) => {
        if (prevTime === 0) {
          clearInterval(timerInterval);
          setOpen(false);
          return 0;
        } else if (prevTime === 30) {
          setShowAlert(!showAlert);
          toast.loading(`30 Seconds remaining`, {
            duration: 4000,
            style: {
              width: "100%",
              backgroundColor: "#cc950c",
              fontWeight: 700,
            },
          });
          return prevTime - 1;
        } else {
          setShowAlert(!showAlert);
          return prevTime - 1;
        }
      });
    }, 1000);

    return () => {
      clearInterval(timerInterval);
    };
  }, []);

  const hours = Math.floor(timeRemaining / 3600);
  const minutes = Math.floor((timeRemaining % 3600) / 60);
  const seconds = timeRemaining % 60;

  return (
    <>
      <h4>{`${hours}h ${minutes}m ${seconds}s`}</h4>
      {showAlert && <Toaster />}
    </>
  );
};
export default Timer;
