import React from "react";
import {createRoot} from "react-dom/client";
import Home from "./page.js";
import "./globals.css";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(<Home />);