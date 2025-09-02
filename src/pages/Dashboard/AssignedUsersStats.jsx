import React, { useEffect, useState } from "react";
import LogoAvatarShowLetter from "CommonModule/LogoAvatarShowLetter";
import CommonIcon from "CommonModule/CommonIcon";

const AssignedUsersStats = ({ assignedUsers, activeTab }) => {
  const [viewData, setViewData] = useState([]);
  const [searchInputFlag, setSearchInputFlag] = useState(false);

  useEffect(() => {
    setViewData(assignedUsers[0]?.tab_Details || []);
  }, [assignedUsers]);

  const getColorCode = (type) => {
    const colors = {
      "ON BOARDING": { border: "#F6208899", bg: "#F6208826", font: "#F62088" },
      "SUPPORT PRODUCTION": { border: "#6cc3e0", bg: "#6cc3f0", font: "#6cc3e0" },
      "SALES TEAM": { border: "#6cc3e0", bg: "#6cc3f0", font: "#6cc3e0" },
      "QC": { border: "#12898399", bg: "#12898340", font: "#128983" },
      "AGENCY": { border: "#12898399", bg: "#12898340", font: "#128983" },
      "UPDATES TEAM": { border: "#FF500D99", bg: "#FF500D80", font: "#FF500D" },
      "ANALYST CONSENSUS TEAM": { border: "#A3214799", bg: "#A321474D", font: "#A32147" },
      "DIVIDENDS TEAM": { border: "#0096FF99", bg: "#0096FF4D", font: "#0096FF" },
    };
    return colors[type] || {};
  };

  const handleSearch = (e) => {
    const value = e.toLowerCase();
    if(value?.length > 0){
      const results = assignedUsers[0]?.tab_Details?.filter(
        (item) => item?.type?.toLowerCase().includes(value) || item?.displayname?.toLowerCase().includes(value)
      );
      setViewData(results);
    }else{
      setViewData(assignedUsers[0]?.tab_Details || []);
    }
  };

  return (
    <div>
      <div className="tabs_row">
        <p className="title">{activeTab[0]?.tabname === "Orders" ? "All Teams" : activeTab[0]?.tabname}</p>
        <div className="search-ticket">
          { searchInputFlag && (
            <input className="search-input" type="text" onChange={(e) => handleSearch(e.target.value)} autoFocus/>
          )}
          <CommonIcon name={searchInputFlag ? 'closedRoundIcon' : 'searchIcon'}  className="search-icon" alt="search icon" onClick={()=> { setSearchInputFlag(!searchInputFlag); handleSearch(""); }} />          
        </div>
      </div>

      <div className="users_container">
        {viewData?.length ? (
          viewData?.map((row, i) => (
            <div className="users_row" key={i}>
              <div className="users_row__container-info">
                <LogoAvatarShowLetter
                  genaralData={{ profileName: row?.displayname }}
                  profileName="profileName"
                  outerClassName="data_section_list_image"
                  index={`team-${i}`}
                />
                <div className="user_data_column">
                  <p className="user_name">{row?.displayname}</p>
                  <p className="user_type" style={{ color: getColorCode(row?.type)?.font }}>
                    {row?.type?.toLowerCase()}
                  </p>
                </div>
              </div>
              <div className="user_score_board">
                <p className="order_board">Order : {row?.totalorder}</p>
                <p className="tool_board">Tool : {row?.totaltool}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="w-100">
            <p className="text-center">No Data Found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignedUsersStats;
