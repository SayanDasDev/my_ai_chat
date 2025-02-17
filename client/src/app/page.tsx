"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    fetch("http://127.0.0.1:5000/users")
      .then((response) => response.json())
      .then((data) => setMessage(data.message))
      .catch(() => setMessage("Error fetching data"));
  }, []);

  return <div>{message}</div>;
}
