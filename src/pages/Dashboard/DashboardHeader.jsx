import DateTimeCalendar from "CommonModule/DateTimeCalendar";
import React, { useCallback, useEffect, useState } from "react";
import dayjs from "dayjs";
import SelectDropDown from "CommonModule/SelectDropDown";
import CommonIcon from "CommonModule/CommonIcon";
const DashboardHeader = ({ auth, selectedOrderType, switchName, switchDashboard, applyDateFilter, resetFilter, ...props }) => {

    /** VARIABLE DECLARATIONS */
    const [greeting, setGreeting] = useState("");
    const updateGreeting = useCallback(() => {
        const hours = new Date().getHours();
        setGreeting(hours >= 5 && hours < 12 ? "Good Morning" : hours >= 12 && hours < 17 ? "Good Afternoon" : hours >= 17 && hours < 21 ? "Good Evening" : "Good Night");
    }, []);

    const handleDateUpdate = (date, type) => {
        const formattedDate = dayjs(date._d).format("YYYY-MM-DD");
        type === "fromDate" ? props?.updateDefaultDateFilter("fromDate", formattedDate) : props?.updateDefaultDateFilter("toDate", formattedDate);
    };

    useEffect(() => updateGreeting(), [updateGreeting]);

    const handleReset = () => {
        resetFilter();
    };

    const handleSwitchOrders = (d) => {
        props?.handleSwitchOrders(d);
    }

    return (
        <>
            <div className="dashboard-container__greetings__row">
                <div>
                    <h4>{greeting}, {auth?.details?.displayName}!</h4>
                    <p>Here's what's happening with your Team today.</p>
                </div>
                <div className="dropdown_select">
                    <p>Select Dashboard</p>
                    <SelectDropDown
                        multi={false}
                        options={auth?.details?.workspaceDTO}
                        labelField="name"
                        valueField="work_space_id"
                        values={switchName}
                        onChange={(values) => switchDashboard(values)}
                        placeholder="Select Workspace"
                        className="custom_drop_down switch-dashboard"
                        disabled={!auth?.details?.workspaceDTO?.length}
                        optionType="checkbox"
                        nestedList={false}
                    />
                </div>
            </div>

            <div className="all-orders_container">
                {["active", "overall"].map((orderType) => (
                    <button
                        key={orderType}
                        className={`radio_btn_row ${selectedOrderType === orderType ? "active" : ""}`}
                        onClick={() => handleSwitchOrders(orderType)}
                    >
                        <span className="custom-circle">
                            {selectedOrderType === orderType && <div className="selected_dot" />}
                        </span>
                        {`${orderType.charAt(0).toUpperCase() + orderType.slice(1)} Orders`}
                    </button>
                ))}
            </div>

            <div className="filters_row">
                {["fromDate", "toDate"].map((dateType) => (
                    <div key={dateType} className="date_picker">
                        <DateTimeCalendar
                            dateFormat="YYYY-MM-DDTHH:mm:ss"
                            placeholder="YYYY-MM-DD"
                            getDateTime={(date) => handleDateUpdate(date, dateType)}
                            customRenderInput={
                                <button className="btn btn-0 custom_date_picker">
                                    {dateType === "fromDate" ? props?.defaultDateFilter?.fromDate || "YYYY-MM-DD" : props?.defaultDateFilter?.toDate || "YYYY-MM-DD"}
                                    <CommonIcon name={'calendarBlue'} alt="calendar" width="24" />
                                </button>
                            }
                            assignDueDateValidation={false}
                            isDueDate={false}
                            timeFormat={false}
                        />
                    </div>
                ))}
                <button
                    className="btn btn-apply"
                    onClick={applyDateFilter}
                    disabled={props?.defaultDateFilter?.fromDate === null || props?.defaultDateFilter?.toDate === null}
                >
                    Apply
                </button>
                <button className="btn btn-reset" onClick={handleReset} disabled={props?.defaultDateFilter?.fromDate === null && props?.defaultDateFilter?.toDate === null}>
                    <span className="text-decoration-underline">Reset</span>
                    <CommonIcon name={'clockCounterClockWise'} alt="calendar" width="18" style={{verticalAlign:'0px'}}/>
                </button>
            </div>
        </>
    );
};

export default DashboardHeader;
