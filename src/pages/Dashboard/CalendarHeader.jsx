import React, { Fragment, useState } from "react";
const CalendarHeader = () => {
  const [currentDate, setCurrentDate] = useState(new Date()); // Initialize with the current date

  // Function to get the formatted month and year
  const getMonthYear = (date) => {
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.toLocaleString("default", { year: "numeric" });
    return month + " - " + year;
  };

  // Function to handle "Prev" button click
  const handlePrev = () => {
    const newDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      1
    );
    setCurrentDate(newDate);
  };

  // Function to handle "Next" button click
  const handleNext = () => {
    const newDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      1
    );
    setCurrentDate(newDate);
  };
  const ordersData = [
    {
      name: "Deadline",
      subName: "Rebranding meeting in 1 hour.",
    },
    { name: "Task Update:", subName: "2 completed, 3 pending, 2 in progress." },
    {
      name: "Exciting News:",
      subName: "Taskly's new AI for work planning makes work easy and faster!",
    },
  ];
  const images = ["icon-orange-bell", "icon-green-bell", "icon-blue-bell"];
  const colors = ["#FB9318", "#30E578", "#4339F2"];

  return (
    <Fragment>
      <div className="orders_header_row">
        <p>{getMonthYear(currentDate)}</p>
        <div className="button_row">
          <button onClick={handlePrev} className="prev-btn">
            &#8249;
          </button>
          <button onClick={handleNext} className="next-btn">
            &#8250;
          </button>
        </div>
      </div>
      <div className="orders_column mt-3">
        {ordersData?.map((item, i) => {
          return (
            <div className="Order_box" key={i}>
              <span className={images[i]} title="images" />
              <div className="mt-3">
                <p className="order_box_header" style={{ color: colors[i] }}>
                  {item?.name}
                </p>
                <p className="order_box_result">{item?.subName}</p>
              </div>
            </div>
          );
        })}
      </div>
    </Fragment>
  );
};

export default CalendarHeader;
