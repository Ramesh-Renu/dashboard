import React from "react";
import AnimatedCounter from "CommonModule/AnimatedCounter";
import CommonIcon from "CommonModule/CommonIcon";

const CountListing = ({ data, selectedOrderType, tabs, handleTabClick }) => {

  const colors = [
    "#F62088",
    "#6cc3e0",
    "#128983",
    "#FF500D",
    "#A32147",
    "#0096FF",
  ];

  const getFilteredSum = (key) => {
    return data?.[0]?.orderInfo?.[key] || "0";
  };

  const renderHeader = () => {
    if (selectedOrderType === "active") {
      return (
        <div className="header_container_row mt-3">
          {["Order", "Tool"].map((label, index) => (
            <div key={index} className="header_container">
              <CommonIcon name={`total${label}s`} width="50"/>
              <div className="value_box">
                <p className="field_value">
                  <AnimatedCounter targetValue={getFilteredSum(`total${label.toLowerCase()}`)} />
                </p>
                <p>Total {label}</p>
              </div>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="header_container_row mt-3 all_orders">
        {["Received", "Active", "Complete", ].map((label, index) => (
          <div key={index} className="header_container">
            <div className="value_box">
              <p>{`Order ${label}`}</p>
              <p className="field_value" style={{ lineHeight: "1.5" }}>
                <AnimatedCounter targetValue={getFilteredSum(`order${label.toLowerCase()}`)} />
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderTabDetails = () => {
    return data?.[0]?.tab_Details?.filter((t)=> t.type?.toLowerCase() !== "orders").map((row, i) => (
      <div
        className="value_container"
        style={{ width: data?.[0]?.tab_Details?.length > 6 ? "25%" : "33%" }}
        key={i}
      >
        <div className="value_row">
          <h4>
            <AnimatedCounter targetValue={row?.totalorder} />
          </h4>
          <div className="tool_box">
            <p>Tool : </p>
            <p className="tool_box_count">{row?.totaltool}</p>
          </div>
        </div>
        <p
          className="field_name"
          style={{
            color: data?.[0]?.tabname === "Orders" ? colors[i] : "#082B45",
          }}
        >
          {row?.type?.toLowerCase()}
        </p>
      </div>
    ));
  };

  return (
    <div className="active_orders-container">
      <div className="tabs_row">
        {tabs?.map((tab, index) => (
          <button
            key={index}
            className={tab.isActive ? "active_button" : "inActive_button"}
            onClick={() => handleTabClick(index)}
          >
            {tab.tabName}
          </button>
        ))}
      </div>

      <div className="render_container">
        {renderHeader()}

        <div className="value_container_row mt-3">
          {data?.[0]?.tab_Details?.length > 0 ? renderTabDetails() : <p className="text-center">No Data Found</p>}
        </div>
      </div>
    </div>
  );
};

export default CountListing;
