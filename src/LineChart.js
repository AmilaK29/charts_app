import React from "react";
import { useState, useEffect, useRef } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  time,
} from "chart.js";

import firebaseConfig from "./firebaseConfig";
import firebase from "firebase/compat/app";
import "firebase/compat/database";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

const LineChart = () => {
  const [xValues, setXValues] = useState([null]);
  const [yValues, setYValues] = useState([null]);
  const [zValues, setZValues] = useState([null]);

  const [RotxValues, setRotXValues] = useState([null]);
  const [RotyValues, setRotYValues] = useState([null]);
  const [RotzValues, setRotZValues] = useState([null]);



  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [z, setZ] = useState(0);

  const [rotx, setrotX] = useState(0);
  const [roty, setrotY] = useState(0);
  const [rotz, setrotZ] = useState(0);


  const [timeStamps, setTimestamps] = useState([null]);
  const [active, setActive] = useState(false);

  const intervalRef = useRef(null);
  const intervalRef2 = useRef(null);    

  const [buttonText, setButtonText] = useState("Start");

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  // Create a reference to the "gForce" node in your Firebase Realtime Database
  const gForceRef = firebase.database().ref("gForce");
  const rotRef = firebase.database().ref("rot");

  const resetCharts = () => {
    setXValues([null]);
    setYValues([null]);
    setZValues([null]);

    setRotXValues([null]);
    setRotYValues([null]);
    setRotZValues([null]);
  };

  const updaterotData = () => {
    intervalRef2.current = setInterval(() => {
        const currentTimestamp = new Date().getTime() / 1000; // Get current timestamp in seconds
        setTimestamps((prevTimestamps) => [...prevTimestamps, currentTimestamp]);
  
        // Retrieve the x-value from Firebase for the current second
        rotRef.once("value", (snapshot) => {
          const data = snapshot.val();
          const newXValue = data.x;
          const newYValue = data.y;
          const newZValue = data.z;
          setrotX(newXValue);
          setrotY(newYValue);
          setrotZ(newZValue);

          setRotXValues((prevRotXValues) => [...prevRotXValues, newXValue]);
          setRotYValues((prevRotYValues) => [...prevRotYValues, newYValue]);
          setRotZValues((prevRotZValues) => [...prevRotZValues, newZValue]);
        });
      }, 1000);
  };

  const updategForceData = () => {
    intervalRef.current = setInterval(() => {
      const currentTimestamp = new Date().getTime() / 1000; // Get current timestamp in seconds
      setTimestamps((prevTimestamps) => [...prevTimestamps, currentTimestamp]);

      // Retrieve the x-value from Firebase for the current second
      gForceRef.once("value", (snapshot) => {
        const data = snapshot.val();
        const newXValue = data.x;
        const newYValue = data.y;
        const newZValue = data.z;
        setX(newXValue);
        setY(newYValue);
        setZ(newZValue);

        setXValues((prevXValues) => [...prevXValues, newXValue]);
        setYValues((prevYValues) => [...prevYValues, newYValue]);
        setZValues((prevZValues) => [...prevZValues, newZValue]);
      });
    }, 1000);
    //   return () => {
    //     clearInterval(interval);
    //   };
  };

  const activate = () => {
    setActive((prevActive) => !prevActive);
  };

  useEffect(() => {
    // Update timestamps every second
    if (active) {
      console.log(active);
      setButtonText("Stop");
      updategForceData();
      updaterotData();
    } else {
      console.log("Not Active");
      setButtonText("Start");
      clearInterval(intervalRef.current);
      clearInterval(intervalRef2.current);
    }

    return () => {
      clearInterval(intervalRef.current);
      clearInterval(intervalRef2.current);
    };

    // Clean up the interval when the component unmounts
  }, [active]);

  const datax = {
    labels: timeStamps.map((_, index) => index),
    datasets: [
      {
        label: "Sales",
        data: xValues,
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
        backgroundColor: "blue",
        pointBorderColor: "aqua",
      },
    ],
  };

  const datay = {
    labels: timeStamps.map((_, index) => index),
    datasets: [
      {
        label: "Sales",
        data: yValues,
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.9,
        backgroundColor: "blue",
        pointBorderColor: "aqua",
      },
    ],
  };

  const dataz = {
    labels: timeStamps.map((_, index) => index),
    datasets: [
      {
        label: "Sales",
        data: zValues,
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.9,
        backgroundColor: "blue",
        pointBorderColor: "aqua",
      },
    ],
  };

  const datarotx = {
    labels: timeStamps.map((_, index) => index),
    datasets: [
      {
        label: "Sales",
        data: RotxValues,
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
        backgroundColor: "blue",
        pointBorderColor: "aqua",
      },
    ],
  };

  const dataroty = {
    labels: timeStamps.map((_, index) => index),
    datasets: [
      {
        label: "Sales",
        data: RotyValues,
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
        backgroundColor: "blue",
        pointBorderColor: "aqua",
      },
    ],
  };

  const datarotz = {
    labels: timeStamps.map((_, index) => index),
    datasets: [
      {
        label: "Sales",
        data: RotzValues,
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
        backgroundColor: "blue",
        pointBorderColor: "aqua",
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgb(150, 153, 151)", // Change the grid color here
        },
      },
      x: {
        type: "linear",
        time: {
          unit: "second",
        },
        ticks: {
          source: "labels",
        },
        grid: {
          color: "rgb(150, 153, 151)", // Change the grid color here
        },
      },
    },
  };

  return (
    <div>
      <div className="row">
        <div className="col-6">
          <div className="App">
            <div style={{ paddingLeft: 100, paddingTop: 30 }}>
              <h5 style={{ color: "rgb(202, 207, 204)" }}>
                Spring Ball Web Application
              </h5>
            </div>
          </div>
        </div>
        <div className="col-6">
          <div class="btn-group" role="group" aria-label="Basic example">
            <div class="btn-group" role="group" aria-label="Basic example">
            <button
            type="button"
            className="btn btn-success"
            onClick={activate}
            style={{ marginLeft: 300, marginBottom: 30, marginTop: 30 ,width:160}}
          >
            {buttonText}
          </button>
          <button
            type="button"
            className="btn btn-danger   "
            onClick={resetCharts}
            style={{ marginLeft: 0, marginBottom: 30, marginTop: 30 ,width:160}}
          >
            Reset
          </button>
              
            </div>
            
          </div>
        </div>
      </div>

      <div
        class="container text-center shadow-lg p-3 mb-5"
        style={{
          backgroundColor: "rgb(1,28,58)",
          paddingBottom: "20px",
          borderRadius: "9px",
        }}
      >
        <div class="row">
          <div class="col-4">
            <div>
              <p style={{ color: "white" }}>x Value : {x}</p>
            </div>

            <Line
              data={datax}
              options={options}
              style={{ backgroundColor: "black" }}
            />
          </div>
          <div class="col-4">
            <div>
              <p style={{ color: "white" }}>y Value : {y}</p>
            </div>

            <Line
              data={datay}
              options={options}
              style={{ backgroundColor: "black" }}
            />
          </div>
          <div class="col-4">
            <div>
              <p style={{ color: "white" }}>z Value : {z}</p>
            </div>

            <Line
              data={dataz}
              options={options}
              style={{ backgroundColor: "black" }}
            />
          </div>
        </div>
        
        <br></br>

        <div class="row">
          <div class="col-4">
            <div>
              <p style={{ color: "white" }}>x Rot Value : {rotx}</p>
            </div>

            <Line
              data={datarotx}
              options={options}
              style={{ backgroundColor: "black" }}
            />
          </div>
          <div class="col-4">
            <div>
              <p style={{ color: "white" }}>y Rot Value : {roty}</p>
            </div>

            <Line
              data={dataroty}
              options={options}
              style={{ backgroundColor: "black" }}
            />
          </div>
          <div class="col-4">
            <div>
              <p style={{ color: "white" }}>z Rot Value : {rotz}</p>
            </div>

            <Line
              data={datarotz}
              options={options}
              style={{ backgroundColor: "black" }}
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default LineChart;
