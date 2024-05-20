import React, { useState, useEffect } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { axisClasses, AreaElement } from "@mui/x-charts";
import { LineChart } from "@mui/x-charts/LineChart";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { useSelector } from "react-redux";
import { format, getISOWeek, parseISO } from "date-fns";

const chartSetting = {
  // yAxis: [
  //     {
  //         label: 'rainfall (mm)',
  //     },
  // ],
  width: 1850,
  height: 450,

  sx: {
    [`.${axisClasses.left} .${axisClasses.label}`]: {
      // transform: 'translate(-100px, 0)',
    },
    [`.${axisClasses.left}`]: {
      color: "white !important",
    },
    [`.${axisClasses.line}`]: {
      stroke: "white !important",
    },
    [`.${axisClasses.bar}`]: {
      stroke: "white !important", // Vertical border color
    },
    [`.${axisClasses.line}`]: {
      stroke: "white !important", // Color of the line
    },
    [`.${axisClasses.axis}:not(.${axisClasses.axisX}) .${axisClasses.line}`]: {
      stroke: "white !important", // Color of the background line
      strokeDasharray: "4", // Optional: Add dashes to the line
    },
    [`.${axisClasses.x} .${axisClasses.line}`]: {
      stroke: "white !important", // Optional: Color of the baseline grid line
    },
    [`.${axisClasses.axis}`]: {
      stroke: "white !important", // Color of axes
    },
    [`.${axisClasses.grid}`]: {
      stroke: "white !important", // Color of vertical grid lines
    },
    [`.${axisClasses.y} .${axisClasses.grid}`]: {
      stroke: "white !important", // Optional: Color of the y-axis grid line
    },
    [`.${AreaElement.className}`]: {
      fill: "rgba(255, 255, 255, 0.3)", // Change the fill color here
    },
    [`.${axisClasses.x} .${axisClasses.tickLabel}`]: {
      textAnchor: "start", // Align text to the start (left)
      fill: "white",
    },
  },
};

// Define datasets for activity
const activityMonthlyDataset = [
  {
    month: "January",
    value: 1000,
  },
  {
    month: "February",
    value: 1200,
  },
  {
    month: "March",
    value: 1500,
  },
  {
    month: "Arail",
    value: 800,
  },
  {
    month: "may",
    value: 900,
  },
  {
    month: "june",
    value: 700,
  },
  {
    month: "july",
    value: 1400,
  },
  {
    month: "Agust",
    value: 500,
  },
  {
    month: "September",
    value: 400,
  },
  {
    month: "October",
    value: 1000,
  },
  {
    month: "November",
    value: 1200,
  },
  {
    month: "December",
    value: 1400,
  },

  // Add more months as needed
];

const activityWeeklyDataset = [
  {
    week: 1,
    year: 2024,
    value: 250,
  },
  {
    week: 2,
    year: 2024,
    value: 300,
  },
  // Add more weeks as needed
];

const activityYearlyDataset = [
  {
    year: 2024,
    value: 300,
  },
  {
    year: 2025,
    value: 500,
  },
  // Add more years as needed
];

const valueFormatter = (value) => `${value}word`;

const makeLabelsUnique = (data, key) => {
  const labelCount = {};
  return data.map((item) => {
    const label = item[key];
    if (!labelCount[label]) {
      labelCount[label] = 0;
    }
    labelCount[label]++;
    return {
      ...item,
      [key]: `${label}${
        labelCount[label] > 1 ? ` (${labelCount[label]})` : ""
      }`,
    };
  });
};

export default function BarsDataset({ Children_Name }) {
  const [selectedDataset, setSelectedDataset] = useState("day");
  const [chartDimensions, setChartDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [DayData, setDayData] = useState([]);
  const [WeekData, setWeekData] = useState([]);
  const [monthData, setMonthData] = useState([]);
  const WordCount = useSelector((state) => state.auth.WordCount);

  console.log(WordCount[0]?.CounttimeStamps);

  const timestamp = WordCount[0]?.CounttimeStamps[0];
  console.log(timestamp);
  const getWeekOfMonth = (date) => {
    const startWeekDayIndex = 0; // 0 for Sunday, 1 for Monday, etc.
    const firstOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const dayOfWeek = firstOfMonth.getDay() - startWeekDayIndex;
    const offsetDate = date.getDate() + dayOfWeek - 1;
    return Math.floor(offsetDate / 7) + 1;
  };

  //   useEffect(() => {
  //     WordCount[0]?.CounttimeStamps.forEach((timestamp) => {
  //       const date = new Date(timestamp);
  //       const day = date.getDate();
  //       const weekOfMonth = getWeekOfMonth(date);
  //       const dayOfWeek = date.toLocaleString("default", { weekday: "long" });
  //       const month = date.toLocaleString("default", { month: "long" });

  //       console.log(dayOfWeek, day, weekOfMonth, month);
  //     });

  //   }, [WordCount]);
  // useEffect(() => {
  //   // Initialize objects to store counts
  //   const weekdayCounts = {};
  //   const monthCounts = {};
  //   const weekOfMonthCounts = {};

  //   WordCount[0]?.CounttimeStamps.forEach((timestamp) => {
  //     const date = new Date(timestamp);
  //     const dayOfWeek = date.toLocaleString("default", { weekday: "long" });
  //     const day = date.getDate();
  //     const weekOfMonth = getWeekOfMonth(date);
  //     const month = date.toLocaleString("default", { month: "long" });

  //     // Increment counts
  //     weekdayCounts[dayOfWeek] = (weekdayCounts[dayOfWeek] || 0) + 1;
  //     monthCounts[month] = (monthCounts[month] || 0) + 1;
  //     weekOfMonthCounts[weekOfMonth] = (weekOfMonthCounts[weekOfMonth] || 0) + 1;
  //   });

  //   console.log("Weekday Counts:", weekdayCounts);
  //   console.log("Month Counts:", monthCounts);
  //   console.log("Week of Month Counts:", weekOfMonthCounts);
  // }, [WordCount]);

  useEffect(() => {
    const weekdayCounts = {};
    const monthCounts = {};
    const weekOfMonthCounts = [];

    WordCount[0]?.CounttimeStamps.forEach((timestamp) => {
      const date = new Date(timestamp);
      const dayOfWeek = date.toLocaleString("default", { weekday: "long" });
      const day = date.getDate();
      const weekOfMonth = getWeekOfMonth(date);
      const month = date.toLocaleString("default", { month: "long" });

      weekdayCounts[dayOfWeek] = (weekdayCounts[dayOfWeek] || 0) + 1;
      monthCounts[month] = (monthCounts[month] || 0) + 1;
      weekOfMonthCounts[weekOfMonth] =
        (weekOfMonthCounts[weekOfMonth] || 0) + 1;
    });

    // Convert objects into an array of objects
    const weekdayCountsArray = Object.entries(weekdayCounts).map(
      ([day, value]) => ({ day, value })
    );
    const monthCountsArray = Object.entries(monthCounts).map(
      ([month, value]) => ({ month, value })
    );
    const weekOfMonthCountsArray = Object.entries(weekOfMonthCounts).map(
      ([week, value]) => ({ week, value })
    );
    console.log(weekdayCountsArray, monthCountsArray, weekOfMonthCountsArray);
    setDayData(weekdayCountsArray);
    setWeekData(weekOfMonthCountsArray);
    setMonthData(monthCountsArray);
  }, [WordCount]);

  const handleButtonClick = (datasetType) => {
    setSelectedDataset(datasetType);
  };

  const handleDatasetChange = (event) => {
    setSelectedDataset(event.target.value);
  };

  useEffect(() => {
    const handleResize = () => {
      setChartDimensions({
        width: window.innerWidth * 0.9,
        height: window.innerHeight * 0.4,
      });
    };

    window.addEventListener("resize", handleResize);

    // Initial size on component mount
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  let datasetToRender = [];
  let xAxis = [];

  if (selectedDataset === "day") {
    datasetToRender = makeLabelsUnique(DayData, "day");
    xAxis = [
      { scaleType: "band", dataKey: "day", padding: { left: 0, right: 0.1 } },
    ];
  } else if (selectedDataset === "weekly") {
    datasetToRender = makeLabelsUnique(WeekData, "week");
    xAxis = [
      { scaleType: "band", dataKey: "week", padding: { left: 0, right: 0.1 } },
    ];
  } else if (selectedDataset === "month") {
    datasetToRender = makeLabelsUnique(monthData, "month");
    xAxis = [
      { scaleType: "band", dataKey: "month", padding: { left: 0, right: 0.1 } },
    ];
  }

  return (
    <div
      style={{
        color: "white",
        alignItems: "end",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <FormControl variant="filled">
        <Select
          value={selectedDataset}
          onChange={handleDatasetChange}
          className="chart-dropdown"
          style={{ color: "white", backgroundColor: "#333" }}
        >
          <MenuItem value="day">show by days</MenuItem>
          <MenuItem value="weekly">show by Weeks</MenuItem>
          <MenuItem value="month">show by months</MenuItem>
        </Select>
      </FormControl>
      <LineChart
        dataset={datasetToRender}
        xAxis={xAxis}
        series={[
          {
            dataKey: "value",
            showMark: ({ index }) => index % 2 === 0,
            valueFormatter,
            area: true,
          },
        ]}
        {...chartSetting}
        leftAxis={null}
        labelStyle={{ color: "white !important" }}
        grid={{
          vertical: true,
        }}
        domain={{ x: [0, "dataMax"], y: [0, datasetToRender.length - 1] }}
        axisHighlight={{ x: "none" }}
        width={chartDimensions.width}
        height={chartDimensions.height}
      ></LineChart>
    </div>
  );
}
