import React, { useEffect, useMemo, useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { classNames } from "@euroland/libs";
import Table from "CommonModule/Table";
import { Dropdown } from "react-bootstrap";
import Pagination from "CommonModule/Pagination";
import appConstants from "CommonModule/Constant/Common";
import SelectDropDown from "CommonModule/SelectDropDown";
import CommonIcon from "CommonModule/CommonIcon";

const DashboardTable = ({ ...props }) => {
  const columnHelper = createColumnHelper();
  const [ticketTable, setTicketTable] = useState([]);
  const [sortedColumn,setSortedColumn] = useState("");
  // const startIndex = (currentPage - 1) * appConstants.pageSize;
  // const endIndex = startIndex + appConstants.pageSize;
  
  const getColorCode = (param) => {
    let type = param?.toLowerCase();
    let font_color = "";
    if (type === "on boarding") {
      font_color = "#F62088";
    }
    if (type === "production") {
      font_color = "#0000FF";
    }
    if (type === "qc") {
      font_color = "#128983";
    }
    if (type === "updates") {
      font_color = "#FF500D";
    }
    if (type === "analyst") {
      font_color = "#A32147";
    }
    if (type === "dividends") {
      font_color = "#0096FF";
    }
    return font_color;
  };
  const [selectedFilter, setSelectedFilter] = useState({
    teams: [],
    cardStage: [],
    teamMember: [],
  });

  const columns = [
    columnHelper.accessor("cardName", {
      header: "Card Name",
      cell: (info) => info.getValue(),
      canSort: true,
      action: true,
    }),
    columnHelper.accessor("companyName", {
      header: "Company Name",
      cell: (info) => info.getValue() || "--",
      canSort: true,
      action: true,
    }),
    columnHelper.accessor("orderDate", {
      header: "Order Date",
      cell: (info) => info.getValue() || "--",
    }),
    columnHelper.accessor("dueDate", {
      header: "Due Date",
      cell: (info) => info.getValue() || "--",
    }),
    columnHelper.accessor("daysLeft", {
      header: "Days Left",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("toolsOrderedCount", {
      header: "Tools",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("boardName", {
      header: "Teams",
      cell: (info) => (
        <div style={{ color: getColorCode(info.getValue()) }}>
          {" "}
          {info.getValue()}
        </div>
      ),
    }),
    columnHelper.accessor("currentStage", {
      header: "Card Stage",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("state", {
      header: "State",
      cell: (info) => (
        <div style={{ color: "#FF9407" }}>&#8226; {info.getValue()}</div>
      ),
    }),
    columnHelper.accessor("displayName", {
      header: "Order Responsible",
      cell: (info) => info.getValue(),
    }),
  ];

  const [sorting, setSorting] = useState([
    {
      id: "companyName",
      asc: true,
    },
    {
      id: "orderDate",
      asc: true,
    },
    {
      id: "dueDate",
      asc: true,
    },
    {
      id: "daysLeft",
      asc: true,
    },
    {
      id: "boardName",
      asc: true,
    },
  ]);

  useEffect(() =>{
    resetAllFilter();
  },[props?.activeTab[0]?.tabName])

  useEffect(()=>{
    props?.handleSortingChange(sortedColumn, sorting)
  },[sorting])

  const handleEUTeaSortingChange = (columnId, newSorting) => {
    const columnIndex = newSorting.findIndex((sort) => sort.id === columnId);
    newSorting.unshift(newSorting.splice(columnIndex, 1)[0]);
    setSorting(newSorting);
    setSortedColumn(columnId);
  };

  const getCard = (e) => {
    console.log("Data_clicked_e", e);
  };

  const handlePageChange = (page) => {
    props?.updateCurrentPage(page);
  };

  const resetAllFilter = () => {
    // setCardStage([]);
    setSelectedFilter({
      teams: [],
      cardStage: [],
      teamMember: [],
    });
  };

  const selectFilter = (value, name) => {
    if (value && name) {
      setSelectedFilter({
        ...selectedFilter,
        ...(name === "teams") && { cardStage: [] },
        ...(name === "teams") && { teamMember: [] },
        [name]: value
      });
      props?.updateSearchFilter(value, name);
    }
  };

  const resetFilterObj = (name) => {
    if (name) {
      setSelectedFilter({
        ...selectedFilter,
        [name]: []
      })
    }
  };

  // const sortedData = useMemo(() => {
  //   let sortedArray = [...props?.listData];

  //   if (sorting.length > 0) {
  //     const { id, desc } = sorting[0]; // Get the column and sort order

  //     sortedArray.sort((a, b) => {
  //       const aValue = a[id] || ''; // Default to empty string if undefined or null
  //       const bValue = b[id] || ''; // Default to empty string if undefined or null

  //       if (typeof aValue === 'string' && typeof bValue === 'string') {
  //         return aValue.localeCompare(bValue, 'en', { sensitivity: 'base' }) * (desc ? -1 : 1); // case-insensitive compare
  //       }

  //       // Fallback to regular number sorting if values are not strings
  //       if (aValue < bValue) return desc ? 1 : -1;
  //       if (aValue > bValue) return desc ? -1 : 1;
  //       return 0;
  //     });
  //   }

  //   return sortedArray;
  // }, [sorting, props?.listData]);


  useEffect(() => {
    // setTicketTable(sortedData?.slice(startIndex, endIndex));
    setTicketTable(props?.listData?.dashboardDetails)
  }, [props?.listData])


  const handleCardSearch = (e) => {
    props?.updateSearchFilter(e.target.value, "searchTxt");
  }

  return (
    <div className="dashboard_table mt-4">
      <div className="header_row">
        <div className="search_row">
          <div className="header_text"> Active Count List</div>
          <div className="header_text search-ticket">
            <CommonIcon name={'searchIcon'} className="search-icon"  alt="searchIcon" onClick={(e) => props?.applySearchFilter(e)}/>
            <input
              className="search-input"
              placeholder="Search by card name, company name"
              type="text"
              value={props?.searchFilter?.searchTxt}
              // disabled={}
              onChange={handleCardSearch}
              onKeyDown={(e) => props?.applySearchFilter(e)}
            />
          </div>
        </div>
        <div className="filters_row">
          <Dropdown align={"start"}>
            <Dropdown.Toggle
              className="filters_container"
              variant="white"
              id="dropdown-basic"
            >
              Filter
              {/* <CommonIcon name={'filterIcon'} /> */}
              <span className={"icon-filter-icon"} title="filterIcon" />
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <div className="filter_btn_container">
                <h6 className="header">Filter</h6>
                <hr className="m-0 py-1" />
                <div className="filter_render_container">
                  {props?.activeTab[0]?.tabName === "Orders" && (
                    <><div className="header_row">
                      <p>Select Teams</p>
                      <p className="reset_btn btn btn-0 border-0" onClick={() => resetFilterObj("teams")}>Reset</p>
                    </div>
                      <div className="dropdown_select">
                        <SelectDropDown
                          multi={false}
                          options={props?.filterListingData}
                          labelField="teamName"
                          valueField="typeid"
                          values={selectedFilter?.teams}
                          searchable={false}
                          title={"Teams"}
                          onChange={(e) => selectFilter(e, "teams")}
                          placeholder={"Select teams"}
                          className="custom_drop_down"
                          disabled={props?.filterListingData?.length === 0 ? true : false}
                          optionType="checkbox"
                          dropdownPosition="auto"
                        />
                      </div>
                    </>
                  )}
                  {/* Card Stage */}
                  <div className="header_row">
                    <p>Card Stage</p>
                    <p className="reset_btn btn btn-0 border-0" onClick={() => resetFilterObj("cardStage")}>Reset</p>
                  </div>
                  <div className="dropdown_select">
                    {selectedFilter && <SelectDropDown
                      multi={false}
                      options={props?.activeTab[0]?.tabName === "Orders" ? props?.filterListingData?.filter(tab => tab.teamName === selectedFilter?.teams[0]?.teamName)[0]?.cardStages : props?.filterListingData[0]?.cardStages}
                      labelField="type"
                      valueField="type"
                      values={selectedFilter?.cardStage}
                      searchable={false}
                      title={"Card Stage"}
                      onChange={(e) => selectFilter(e, "cardStage")}
                      placeholder={"Select card stage"}
                      className="custom_drop_down"
                      disabled={props?.filterListingData?.cardStages?.length === 0 ? true : false}
                      optionType="checkbox"
                      dropdownPosition="auto"
                    />}
                  </div>
                  {/* Team Member  */}
                  <div className="header_row">
                    <p>Team Member</p>
                    <p className="reset_btn btn btn-0 border-0" onClick={() => resetFilterObj("teamMember")}>Reset</p>
                  </div>
                  <div className="dropdown_select">
                    <SelectDropDown
                      multi={false}
                      // options={props?.userListing}
                      options = {props?.activeTab[0]?.tabName === "Orders" ? props?.userListing?.filter(d => d.type === selectedFilter?.teams[0]?.teamName) : props?.userListing}
                      labelField="displayname"
                      valueField="regid"
                      values={selectedFilter?.teamMember}
                      searchable={false}
                      title={"Team Member"}
                      onChange={(e) => selectFilter(e, "teamMember")}
                      placeholder={"Select team member"}
                      className="custom_drop_down"
                      disabled={props?.userListing?.length === 0 ? true : false}
                      optionType="checkbox"
                      dropdownPosition="auto"
                      nestedList={false}
                    />
                  </div>
                  <div className="bottom_btn_row">
                    <button
                      className="btn reset_btn"
                      onClick={() => resetAllFilter()}
                    >
                      Reset All
                    </button>
                    <button className="btn apply_btn" onClick={(e) => props?.applySearchFilter(e)}>Apply</button>
                  </div>
                </div>
              </div>
            </Dropdown.Menu>
          </Dropdown>
          <Dropdown align={"start"}>
            <Dropdown.Toggle
              className="filters_container downloadReport py-2"
              variant="white"
              id="dropdown-basic"
            >
              {/* <CommonIcon name={'downloadFile'} width={'16'}/> */}
              <span className={"icon-download_file"} title="downloadReport" />
              Download Report
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <div className="download_btn_container">
                <button className="btn btn-0">Download PDF</button>
                <button className="btn btn-0" onClick={()=>props?.handleDownload(1)}>Download Excel</button>
              </div>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
      <div className="products__body-table table_container">
        { ticketTable && <Table
          columns={columns}
          columnData={ticketTable}
          getDatas={getCard}
          className={classNames("products__body-table  dashboard_table")}
          onSortingChange={handleEUTeaSortingChange}
          sorting={sorting}
          setSorting={setSorting}
          tableName={"active_count_list"}
          paramToRedirect="cardName"
        />}
      </div>
      <Pagination
        className="pagination-bar"
        currentPage={props?.currentPage + 1}
        totalCount={props?.listData?.totalCount || 0}
        pageSize={appConstants.pageSize}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default DashboardTable;
