import React from "react";
import {createRoot} from "react-dom/client";
import Home from "./page.js";
import "./globals.css";
import store from "./store.js";
import {Provider} from "react-redux";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(<Provider store={store}><Home /></Provider>);