import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import allReducers from "./reducers/index.";
import { createStore } from "redux";
import { BrowserRouter } from "react-router-dom";

// Import client navigation for SSE redirect handling
import "./services/client_navigation";

const store = createStore(allReducers);
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
      {/* <ContextMenu /> */}
      {/* <Modal /> */}
    </BrowserRouter>
  </Provider>
);
reportWebVitals();
