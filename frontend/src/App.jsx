import { useState, useEffect, useCallback } from "react";
import "./App.css";
import { LineChart } from "@mui/x-charts/LineChart";

export default function App() {
  const [coins, setCoins] = useState([]);
  const containerWidth = 500; // px

  const fetchAndUpdate = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:3000/coins");
      const coin = await response.json();
      setCoins((currentCoins) => [...currentCoins, coin]);
    } catch (error) {
      console.error("Error fetching coins:", error);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchAndUpdate();
    }, 5000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [fetchAndUpdate]);

  return (
    <>
      <center>
        <h1>Bitcoin Price Updates</h1>
        <div style={{ maxWidth: containerWidth }}>
          <LineChart
            series={[{ data: coins.map((coin) => coin.rateUsd) }]} // [{data: [1, 2, 3]}, {data: [1, 3, 4]}]
            //   xAxis={[{ data: coins.map((coin) => coin.timestamp) }]}
            width={containerWidth}
            height={300}
          />
          <ol>
            {coins.map((coin, index) => (
              <li key={index}>
                At timestamp: {coin.timestamp} Bitcoin&apos;s rate in USD was{" "}
                {Number(coin.rateUsd).toFixed(4)}
              </li>
            ))}
          </ol>
        </div>
      </center>
    </>
  );
}
