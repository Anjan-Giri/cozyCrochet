import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import { Provider } from "react-redux";
import Store from "./redux/store";

// ReactDOM.render(
//   <Provider store={Store}>
//     <App />
//   </Provider>,
//   document.getElementById("root")
// );

const rootElement = document.getElementById("root");
const root = ReactDOM.createRoot(rootElement); // Use createRoot
root.render(
  // <React.StrictMode>
  <Provider store={Store}>
    <App />
  </Provider>
  // {/* </React.StrictMode> */}
);

reportWebVitals();
