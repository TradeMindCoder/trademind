import React from "react";
import ReactDOM from "react-dom/client";

// Import the correct component based on which Vercel project this is deployed to
// Landing page project: import Landing from "./Landing.jsx"
// App/Dashboard project: import App from "./App.jsx"

// For the LANDING PAGE (trademind-lake-five.vercel.app → traderpoise landing):
import Landing from "./Landing.jsx";

// For the APP/DASHBOARD (trademind-app-psi.vercel.app → traderpoise app):
// import App from "./App.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Landing />
    {/* <App /> */}
  </React.StrictMode>
);
