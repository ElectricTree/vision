import "./index.css"
import "./fonts/whyte-inktrap/whyte-inktrap.css"

import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import React from "react"
import ReactDOM from "react-dom"
import { Helmet } from "react-helmet"
import Modal from "react-modal"
import { Route, BrowserRouter as Router, Routes } from "react-router-dom"

import App from "./App"
import { tracker } from "./helpers/openreplay"
import reportWebVitals from "./reportWebVitals"

ReactDOM.render(
  <React.StrictMode>
    <Helmet>
      <title>Vision | Electric Tree</title>

      {/* <!-- Social media tags --> */}
      <meta property="og:type" content="article" />

      <meta property="og:title" content="Vision | Electric Tree" />

      <meta
        property="og:description"
        content="Towards a regenerative renaissance, come friend to resonate with Electric Tree and sign our vision."
      />

      <meta property="og:site_name" content="Electric Tree" />

      <meta name="twitter:title" content="Vision | Electric Tree" />

      <meta
        name="twitter:description"
        content="Towards a regenerative renaissance, come friend to resonate with Electric Tree and sign our vision."
      />

      <meta name="twitter:site" content="@TheEdenDao" />

      <meta name="twitter:creator" content="@TheEdenDao" />
    </Helmet>
    <Router>
      <Routes>
        <Route path="/*" element={<App />} />
      </Routes>
    </Router>
  </React.StrictMode>,
  document.getElementById("root"),
)

tracker.start()
dayjs.extend(utc)
Modal.setAppElement("#root")

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
