import React from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { getRouter } from "./router";
import "./styles.css";

const element = document.getElementById("root");
if (!element) throw new Error("Missing #root element");

const router = getRouter();
createRoot(element).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
