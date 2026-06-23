// src/App.jsx

import { useEffect, useState } from "react";
import { fetchNotifications } from "./api/notifications";
import { Log } from "./api/logger";

const token = import.meta.env.VITE_ACCESS_TOKEN;

export default function App() {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("All");

  const [viewed, setViewed] = useState(
    JSON.parse(localStorage.getItem("viewed")) || []
  );

  const markViewed = (id) => {
    if (viewed.includes(id)) return;

    const updated = [...viewed, id];

    setViewed(updated);

    localStorage.setItem(
      "viewed",
      JSON.stringify(updated)
    );
  };

  useEffect(() => {
    async function loadData() {
      try {
        await Log(
          "frontend",
          "info",
          "page",
          "Notifications page loaded",
          token
        );

        const data = await fetchNotifications(token);

        setNotifications(data);

        await Log(
          "frontend",
          "info",
          "api",
          "Notifications fetched successfully",
          token
        );
      } catch (error) {
        console.error(error);

        await Log(
          "frontend",
          "error",
          "api",
          error.message,
          token
        );
      }
    }

    loadData();
  }, []);

  const filteredNotifications =
    filter === "All"
      ? notifications
      : notifications.filter(
          (n) => n.Type === filter
        );

  return (
    <div style={{ padding: "20px" }}>
      <h1>Notifications App</h1>

      <select
        value={filter}
        onChange={async (e) => {
          setFilter(e.target.value);

          await Log(
            "frontend",
            "info",
            "component",
            `Filter changed to ${e.target.value}`,
            token
          );
        }}
      >
        <option>All</option>
        <option>Event</option>
        <option>Result</option>
        <option>Placement</option>
      </select>

      <br />
      <br />

      {filteredNotifications.map((n) => (
        <div
          key={n.ID}
          onClick={() => markViewed(n.ID)}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            marginBottom: "10px",
            cursor: "pointer",
          }}
        >
          <h3>{n.Type}</h3>

          <p>{n.Message}</p>

          <small>{n.Timestamp}</small>

          <p>
            <strong>
              {viewed.includes(n.ID)
                ? "Viewed"
                : "New"}
            </strong>
          </p>
        </div>
      ))}
    </div>
  );
}