import React, { useState } from "react";
import {useNavigate, useLocation } from "react-router-dom";
import "./CareneederSchedule.css";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
dayjs.locale("zh-cn"); // Set the locale to Chinese
import { Schedule } from "../../../types/Types";
import DatePicker, { registerLocale } from "react-datepicker";
import { zhCN } from "date-fns/locale";
import { BASE_URL } from "../../../types/Constant";
import HeaderLogo from "../../HeaderLogoComponent/HeaderLogo";

registerLocale("zh-cn", zhCN);

const CareneederSchedule: React.FC = () => {
  const [schedule, setSchedule] = useState<Schedule>({
    id: 0, // You need to include 'id' since it's part of the Schedule interface
    scheduletype: "长期",
    totalhours: "", // Add this property
    frequency: "每天", // Add this property with a default value
    startdate: dayjs(),
    selectedtimeslots: [],
    durationdays: "",
    careneeder_id: 0, // You need to include 'careneeder_id' since it's part of the Schedule interface
  });

  const [scheduleType, setScheduleType] = useState<"长期" | "单次" | null>(
    "长期"
  );

  const handleScheduleTypeChange = (type: "长期" | "单次") => {
    setScheduleType(type);
  };

  const navigate = useNavigate();

  const location = useLocation();

  // Extract the careneederId from the query parameters
  const queryParams = new URLSearchParams(location.search);
  const careneederId = queryParams.get("careneederId");
  const phoneNumber = queryParams.get("phone");

  const handleSlotSelection = (slot: string) => {
    // Check if the slot is already selected
    if (schedule.selectedtimeslots.includes(slot)) {
      // Deselect the slot
      setSchedule((prevSchedule) => ({
        ...prevSchedule,
        selectedtimeslots: prevSchedule.selectedtimeslots.filter(
          (selectedSlot) => selectedSlot !== slot
        ),
      }));
    } else {
      // Select the slot
      setSchedule((prevSchedule) => ({
        ...prevSchedule,
        selectedtimeslots: [...prevSchedule.selectedtimeslots, slot],
      }));
    }
  };

  const handleSubmit = () => {
    console.log("Schedule:", schedule);
    // Step 1: Validate user inputs
    if (!schedule.totalhours) {
      alert("请选择时长.");
      return; // Stop further execution
    }

    if (!schedule.frequency) {
      alert("请选择频率.");
      return; // Stop further execution
    }

    if (scheduleType === "单次" && !schedule.durationdays) {
      alert("请选择持续天数.");
      return; // Stop further execution
    }

    // Step 2: Create an API request
    const API_URL = `${BASE_URL}/api/careneeder/careneeder_schedule`; // Replace with your actual API endpoint

    const requestData = {
      careneeder_id: careneederId,
      scheduletype: scheduleType,
      totalhours: schedule.totalhours,
      frequency: schedule.frequency,
      startdate: schedule.startdate.format("YYYY-MM-DD"), // Format date as needed
      selectedtimeslots: JSON.stringify(schedule.selectedtimeslots),
      durationdays: schedule.durationdays,
    };

    // Step 3: Send data to the server
    fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle the server response if needed
        console.log("Server Response:", data);
        const careneederId = data.careneeder_id;
        // You can show a success message to the user or navigate to another page

        navigate(
          `/signup_careneeder/schedule/ads?careneederId=${careneederId}&phone=${phoneNumber}`
        );
      })
      .catch((error) => {
        // Handle any errors that occurred during the API call
        console.error("API Error:", error);
        // You can show an error message to the user
      });
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <HeaderLogo />
      <hr className="border-t border-black-300 mx-1 my-2" />

      <h1 className="text-center">排班列表</h1>

      <div className="flex justify-center mt-4">
        <button
          className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-2 ${
            scheduleType === "长期" ? "bg-blue-700" : ""
          }`}
          onClick={() => handleScheduleTypeChange("长期")}
        >
          长期
        </button>
        <button
          className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-2 ${
            scheduleType === "单次" ? "bg-blue-700" : ""
          }`}
          onClick={() => handleScheduleTypeChange("单次")}
        >
          单次
        </button>
      </div>

      {scheduleType === "长期" && (
        <div className="flex flex-col md:flex-row justify-center mt-4">
          <div className="flex justify-between w-full md:w-2/4">
            {/* Select for choosing duration */}
            <select
              className="w-1/2 px-2 py-1 mt-2 border rounded-md"
              value={schedule.totalhours}
              onChange={(e) =>
                setSchedule((prevSchedule) => ({
                  ...prevSchedule,
                  totalhours: e.target.value,
                }))
              }
            >
              <option value="">选择时长</option>
              {Array.from({ length: 40 }, (_, index) => (
                <option key={index + 1} value={`${index + 1}`}>
                  {index + 1} 小时
                </option>
              ))}
            </select>

            {/* Select for choosing frequency */}
            <select
              className="w-1/2 px-2 py-1 mt-2 border rounded-md"
              value={schedule.frequency}
              onChange={(e) =>
                setSchedule((prevSchedule) => ({
                  ...prevSchedule,
                  frequency: e.target.value,
                }))
              }
            >
              <option value="每天">每天</option>
              <option value="每周">每周</option>
              <option value="每两周">每两周</option>
              <option value="每月">每月</option>
            </select>
          </div>
        </div>
      )}

      {scheduleType === "长期" && (
        <div className="flex justify-center mt-4">
          <div className="w-full md:w-1/2">
            <table className="w-full border-collapse border">
              <thead>
                <tr>
                  <th className="border-t border-l"></th>
                  <th className="text-center border">周一</th>
                  <th className="text-center border">周二</th>
                  <th className="text-center border">周三</th>
                  <th className="text-center border">周四</th>
                  <th className="text-center border">周五</th>
                  <th className="text-center border">周六</th>
                  <th className="text-center border">周天</th>
                </tr>
              </thead>
              <tbody>
                {["早上", "下午", "晚上"].map((period) => (
                  <tr key={period}>
                    <td className="font-bold border">{period}</td>
                    {[
                      "周一",
                      "周二",
                      "周三",
                      "周四",
                      "周五",
                      "周六",
                      "周天",
                    ].map((day) => (
                      // Inside your TSX code
                      <td key={day} className="text-center border">
                        <button
                          className={`circle ${
                            schedule.selectedtimeslots.includes(
                              `${day}_${period}`
                            )
                              ? "selected"
                              : ""
                          }`}
                          onClick={() =>
                            handleSlotSelection(`${day}_${period}`)
                          }
                        ></button>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-4">
              <label className="block font-semibold">选择开始日期:</label>
              <DatePicker
                selected={schedule.startdate.toDate()}
                onChange={(date) =>
                  setSchedule((prevSchedule) => ({
                    ...prevSchedule,
                    startdate: dayjs(date),
                  }))
                }
                locale="zh-cn"
                dateFormat="yyyy-MM-dd"
                className="w-full px-2 py-1 mt-1 border rounded-md"
              />
            </div>
          </div>
        </div>
      )}

      {scheduleType === "单次" && (
        <div className="flex flex-col md:flex-row justify-center mt-4">
          <div className="flex w-full md:w-2/4 justify-between">
            {/* Select for choosing total hours */}
            <div className="w-1/2 pr-2">
              <select
                className="w-full px-2 py-1 mt-2 border rounded-md"
                value={schedule.totalhours}
                onChange={(e) =>
                  setSchedule((prevSchedule) => ({
                    ...prevSchedule,
                    totalhours: e.target.value,
                  }))
                }
              >
                <option value="">选择时长</option>
                {Array.from({ length: 40 }, (_, index) => (
                  <option key={index + 1} value={`${index + 1}`}>
                    {index + 1} 小时
                  </option>
                ))}
              </select>
            </div>

            {/* Select for choosing duration days */}
            <div className="w-1/2 pl-0">
              <select
                className="w-full px-2 py-1 mt-2 border rounded-md"
                value={schedule.durationdays}
                onChange={(e) =>
                  setSchedule((prevSchedule) => ({
                    ...prevSchedule,
                    durationdays: e.target.value,
                  }))
                }
              >
                <option value="">选择持续天数</option>
                {Array.from({ length: 30 }, (_, index) => (
                  <option key={index + 1} value={`${index + 1}`}>
                    {index + 1} 天
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {scheduleType === "单次" && (
        <div className="flex flex-col md:flex-row justify-center mt-4">
          <label className="block font-semibold mt-2 ml-2 md:mr-8">
            选择开始日期:
          </label>
          <DatePicker
            selected={schedule.startdate.toDate()} // Convert Dayjs to Date
            onChange={(date) =>
              setSchedule((prevSchedule) => ({
                ...prevSchedule,
                startdate: dayjs(date), // Convert Date to Dayjs
              }))
            }
            locale="zh-cn"
            dateFormat="yyyy-MM-dd"
            className="w-full px-2 py-1 mt-1 border rounded-md"
          />
        </div>
      )}

      <div className="flex justify-center mt-4">
        <button
          className="w-4/1 py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
          onClick={handleSubmit}
        >
          下一步
        </button>
      </div>
    </div>
  );
};

export default CareneederSchedule;
