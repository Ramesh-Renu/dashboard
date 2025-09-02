import React, { useEffect, useState } from "react";
import useAuth from "BaseApp/useAuth";
// import DateTime from "react-datetime";
import DashboardHeader from "./DashboardHeader";
import CountListing from "./CountListing";
import AssignedUsersStats from "./AssignedUsersStats";
// import CalendarHeader from "./CalendarHeader";
import DashboardTable from "./DashboardTable";
import { getDashboard, getDashboardCardListing } from "services";
import { getLast30DaysDate, generateExcelFile } from "utils/common";
import dayjs from "dayjs";
import appConstants from "CommonModule/Constant/Common";

const Dashboard = () => {

  /** VARIABLE DECLARATIONS */
  const [selectedOrderType, setSelectedOrderType] = useState("active");
  const [defaultDateFilter, setDefaultDateFilter] = useState({
    fromDate: null,
    toDate: null
  });
  const [activeDateFilter, setActiveDateFilter] = useState({
    fromDate: null,
    toDate: null
  });
  const [switchName, setSwitchName] = useState([
    {
      id: 1,
      name: "Internal Order Delivery",
    },
  ]);
  const [calendar_tab, setCalendar_tab] = useState([
    { name: "Calender", isActive: true },
    { name: "Orders", isActive: false },
  ]);
  const [calendar_Active, setCalendar_Active] = useState("Calender");
  const [{ data: auth }] = useAuth();
  const [activeTabListingData, setActiveTabListingData] = useState([]);
  const [activeUsersListingData, setActiveUsersListingData] = useState([]);
  const [filterListingData, setFilterListingData] = useState([]);
  const [overAllListingCount, setOverAllListingCount] = useState([]);
  const [userListing, setUserListing] = useState([]);
  const [tabList, setTabList] = useState([]);
  const [cardListing, setCardListing] = useState([]);
  const [sortingField, setSortingField] = useState({
    name: "CompanyName",
    orderBy: "ASC"
  });  
  const [searchFilter, setSearchFilter] = useState({
    searchTxt: "",
    filter: []
  });  
  const [currentPage, setCurrentPage] = useState(0);
  const [downloadInfo, setDownloadInfo] = useState({
    type: null,
    data: [],
  });

  /** OVERALL COUNT & USER LISTING */
  const handleDashboardAPI = () => {
    const param = {
      type: selectedOrderType,
      from_date: activeDateFilter?.fromDate,
      to_date: activeDateFilter?.toDate,
      search_text: "string"
    };

    getDashboard(param).then((res) => {
      if (res.status === 200) {
        const updatedTabs = res.data?.ticket_list?.map((row, index) => {
          return { ...row, tabName: row.tabname, isActive: index === 0 };
        });

        setOverAllListingCount(updatedTabs);
        setTabList(updatedTabs);
        setUserListing(res.data?.ticket_user_list);
        handleCardListingAPI(); // TRIGGERS CARD LISTING API
      }
    });
  }

  /** HANDLE CARD LISTING API CALLS */
  const handleCardListingAPI = (isDownload=false) => {
    // setCardListing([]);
    const param = {
      type: "",
      from_date: activeDateFilter?.fromDate,
      to_date: activeDateFilter?.toDate,
      search_text: searchFilter?.searchTxt,
      order_type: "",
      order_by: sortingField?.name,
      sort_type: sortingField?.orderBy,
      offsetno: currentPage,
      page_size: appConstants?.pageSize,
      card_stage: searchFilter?.filter?.cardStage && searchFilter?.filter?.cardStage[0]?.typeid || null,
      team: searchFilter?.filter?.teams && searchFilter?.filter?.teams[0]?.typeid || null,
      team_member: searchFilter?.filter?.teamMember && searchFilter?.filter?.teamMember[0]?.regid || null,
      is_excel_download: isDownload
    };

    getDashboardCardListing(param).then((res)=>{
      if (res.status === 200) {
        if(isDownload){
          setDownloadInfo((prev)=> ({...prev, data: res?.data}))
        }else{
          setCardListing(res?.data)
        }
      }
    })
  }

  /** USED TO FORMAT DATA AND TRIGGERS DOWNLOAD ACTION */
  useEffect(() => {
    if (Object.keys(downloadInfo?.data)?.length > 0 && downloadInfo?.data?.dashboardDetails?.length > 0 ) {
      const formattedData = downloadInfo?.data?.dashboardDetails.map(item => [
        item.sno,
        item.ticketId,
        item.orderID,        
        item.cardName,
        item.companyName,
        item.companyCode,
        item.orderDate,
        item.dueDate,
        item.boardName,  // "Team"
        item.toolNames,  // "Tools Name"
        item.toolsOrderedCount,  // "Tools Count"
        item.currentStage,  // "Current Stage"
        item.displayName,  // "Order Responsible"
      ]);
  
      const headers = [
        "Sno.", 
        "Ticket ID",
        "Order ID",  
        "Card Name",  
        "Company Name", 
        "Company Code",
        "Order Date", 
        "Due Date",  
        "Team",   // boardName
        "Tools Name", // toolNames
        "Tools Count",  // toolsOrderedCount
        "Current Stage",  // currentStage
        "Order Responsible"  // displayName
      ];
  
      const dataForExcel = [headers, ...formattedData];
      generateExcelFile(dataForExcel);
    }
  }, [downloadInfo?.data]);

  /** HANDLE DOWNLOAD LISTING */
  const handleDownload = (type) => {
    setDownloadInfo((prev)=>({...prev, type: type}));
    handleCardListingAPI(true);    
  }

  /** TRIGGER API CALL WHEN ACTION CHANGES */
  useEffect(() => {
    handleDashboardAPI();
  }, [activeDateFilter]);

  /** USED TO FILTER OUT AND SHOW ACTIVE TAB RELEVANT DATAS */
  useEffect(() => {
    const activeTabs = overAllListingCount?.filter(tab => tab.isActive);
    const activeUsers = userListing?.filter((user) => user.tabname === activeTabs[0]?.tabname);
    const ordersTab = overAllListingCount?.filter(tab => tab.tabname === "Orders");
    const combinedInformation = activeTabs.map(tab => {      
        const ordersTabDetails = ordersTab[0]?.tab_Details?.filter(orderTab => orderTab.type === tab.tabName);
        return {
            ...tab,
            orderInfo: ordersTabDetails[0]
        };
    });

    setActiveTabListingData(combinedInformation);
    setActiveUsersListingData(activeUsers);
    getTeamListAndCardStages(combinedInformation);
  }, [overAllListingCount]);

  /** USED TO HANDLE TAB CHANGES */
  const handleTabClick = (index, type) => {
    if (type === "calendar") {
      setCalendar_tab((prevTabs) =>
        prevTabs.map((tab, i) => ({
          ...tab,
          isActive: i === index,
        }))
      );
      setCalendar_Active(calendar_tab[index].name);
    } else {
      const updatedTabs = overAllListingCount.map((tab, i) => ({
        ...tab,
        isActive: i === index
      }));

      setOverAllListingCount(updatedTabs);
      setTabList(updatedTabs);

      const activeTabs = updatedTabs?.filter(tab => tab.isActive);
      getTeamListAndCardStages(activeTabs);
    }
  };

  /** RESET DATE FILTER */
  const resetFilter = () => {
    setDefaultDateFilter({
      fromDate: null,
      toDate: null
    })
    setActiveDateFilter({
      fromDate: null,
      toDate: null
    })
  };

  /** SHOWS CALENDAR EVENT */
  const renderDay = (props, currentDate, selectedDate) => {
    const classes = ["custom-day"];
    if (selectedDate && currentDate.isSame(selectedDate, "day")) {
      classes.push("rdtActive");
    }
    return (
      <td {...props} className={classes.join(" ")}>
        {currentDate.date()}
      </td>
    );
  };

  /** DATE FILTER  */
  const applyDateFilter = () => {
    if (defaultDateFilter?.fromDate !== null && defaultDateFilter?.toDate !== null) {
      setActiveDateFilter(defaultDateFilter);
    }
  }

  /** SEARCH FILTER UPDATION */
  const updateSearchFilter = (e, type) => {
    setSearchFilter((prev) => ({
      ...prev,
      filter: {
        ...prev.filter,
        ...(type !== "searchTxt" ? { [type]: e } : {})
      },
      ...(type === "searchTxt" ? { [type]: e } : {})
    }));
  }

  /** CARD SEARCH FILTER */
  const applySearchFilter = (e) => {
    if (e.type == "click" || e.key === "Enter") {
      handleCardListingAPI();
    }
  }

  /** ACTIVE / OVERALL ORDER - TAB SWITCHING */
  const handleSwitchOrders = (val) => {
    if(val === "overall"){
      const last30DaysDate = getLast30DaysDate();
      setDefaultDateFilter({
        fromDate: last30DaysDate,
        toDate: dayjs().format('YYYY-MM-DD')
      })
      setActiveDateFilter({
        fromDate: last30DaysDate,
        toDate: dayjs().format('YYYY-MM-DD')
      });
      setSelectedOrderType(val);
    }else{
      resetFilter();
      setSelectedOrderType(val)
    }
  }

  /** UPDATE DATE FIELD */
  const updateDefaultDateFilter = (type, dateVal) => {
    setDefaultDateFilter({
      ...defaultDateFilter,
      [type]: dateVal,
    })
  }
  
  /** USED TO FORMAT DATA - FOR FILTERATION */
  const getTeamListAndCardStages = (activeTab) => {
    if (activeTab[0]?.tabname === "Orders") {
      setFilterListingData(overAllListingCount
        .filter(tab => tab.tabname !== "Orders")
        .map((tab)=> {
          const ordersTab = overAllListingCount.find(tabItem => tabItem.tabname === "Orders");
          const matchingType = ordersTab?.tab_Details.find(orderDetail => orderDetail.type === tab.tabname);
          return {
            teamName: tab.tabname,
            cardStages: tab.tab_Details,
            tabid: matchingType?.tabid,
            typeid: matchingType?.typeid
          };
        }));
    } else {
      setFilterListingData(activeTab
        .filter(tab => tab.tabname === activeTab[0]?.tabname)
        .map(tab => {
          const ordersTab = overAllListingCount.find(tabItem => tabItem.tabname === "Orders");
          const matchingType = ordersTab?.tab_Details.find(orderDetail => orderDetail.type === tab.tabname);
          return {
            teamName: tab.tabname,
            cardStages: tab.tab_Details,
            tabid: matchingType?.tabid,
            typeid: matchingType?.typeid
          };
        }))
    }
  }

  /** PAGINATION CHANGE */
  const handlePageChange = (e) => {
    setCurrentPage(e-1);
  }

  /** TRIGGERS LISTING API */
  useEffect(()=>{
    handleCardListingAPI();
  },[sortingField, currentPage])

  /** UPDATE SORTING COLUMN INFO */
  const handleSortingChange = (field,val) => {
    setSortingField({
      name: field,
      orderBy: val?.filter((d)=> d.id === field)[0]?.desc ? "DESC" : "ASC"
    })
  }

  return (
    <div className="dashboard-container">

      {/* HEADER WITH FILTERS */}
      <DashboardHeader auth={auth} switchName={switchName} switchDashboard={(e) => setSwitchName(e)} selectedOrderType={selectedOrderType} handleSwitchOrders={handleSwitchOrders} applyDateFilter={(d) => applyDateFilter(d)} resetFilter={resetFilter} defaultDateFilter={defaultDateFilter} updateDefaultDateFilter={updateDefaultDateFilter}/>

      {/* CONTAINERS */}
      <div className="dashboard-container__grid_row">
        <div className="dashboard-container__tabs_container">
          <CountListing data={activeTabListingData} tabs={tabList} selectedOrderType={selectedOrderType} handleTabClick={(i) => handleTabClick(i)} />
        </div>

        <div className="dashboard-container__qc_container">
          <AssignedUsersStats
            activeTab={activeTabListingData}
            assignedUsers={activeUsersListingData}
          />
        </div>

        {/* <div className="dashboard-container__tabs_container dashboard-container__calender_container">
          <div className="tabs_row">
            {calendar_tab?.map((tab, index) => (
              <button
                className={tab.isActive ? "active_button" : "inActive_button"}
                key={index}
                onClick={() => handleTabClick(index, "calendar")}
              >
                {tab.name}
              </button>
            ))}
          </div>
          <div
            className="calendar_render_container"
          // style={{
          //   padding:
          //     calendar_Active === "Calender" ? "11px 0px" : "0px 22px",
          // }}
          >
            {calendar_Active === "Calender" ? (
              <DateTime
                renderDay={renderDay}
                input={false}
                dateFormat="DD MMMM YYYY"
                timeFormat={false}
              />
            ) : (
              <div className="orders_container">
                <CalendarHeader />
              </div>
            )}
          </div>
        </div> */}
      </div>

      <div className="dashboard_table_container">
        <DashboardTable
          listData={cardListing}
          searchFilter={searchFilter}
          updateSearchFilter={updateSearchFilter}
          applySearchFilter={applySearchFilter}
          activeTab={activeTabListingData}
          userListing={activeUsersListingData[0]?.tab_Details}
          filterListingData={filterListingData}
          currentPage={currentPage}
          updateCurrentPage={handlePageChange}
          handleSortingChange={handleSortingChange}
          handleDownload={(t)=>handleDownload(t)}
        />
      </div>

      <div className="footer_dashboard">
        <p>
          Powered by Euroland IR
          <span>Copyright © Orion</span>
        </p>
      </div>

    </div>
  );
};

export default Dashboard;