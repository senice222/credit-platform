import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import Login from "./pages/Login/Login";
import { NotAllowed } from "./pages/NotAllowed/NotAllowed.jsx";
import { Provider } from "react-redux";
import PanelLayout from "./Layout/PanelLayout/PanelLayout.jsx";
import { store } from "./store/store";
import ActiveApplications from "./components/ActiveApplications/ActiveApplications";
import DetailedApplication from './pages/DetailedApplication/DetailedApplication'
import FinishedApplications from "./components/FinishedApplications/FinishedApplications";
import Companies from "./pages/Companies/Companies.jsx";
import AllApplications from "./pages/AllApplications/AllApplications.jsx";
import DetailedCompany from "./pages/DetailedCompany/DetailedCompany.jsx";
import ChooseModule from "./pages/ChooseModule/ChooseModule.jsx";
import Samples from "./pages/Samples/Samples.jsx";
import Settings from "./pages/Settings/Settings.jsx";
import DetailedClient from "./pages/DetailedClient/DetailedClient.jsx";

const router = createBrowserRouter([
  {
    path: "/notAllowed",
    element: <NotAllowed />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/module",
    element: <ChooseModule />,
  },
  {
    path: "/settings-access",
    element: <Settings />,
  },
  {
    path: "/",
    element: <PanelLayout />,
    children: [
      {
        path: "",
        element: <ActiveApplications />,
      },
      {
        path: "/finished",
        element: <FinishedApplications />,
      },
      {
        path: "/all-applications",
        element: <AllApplications />,
      },
      {
        path: "/companies",
        element: <Companies />,
      },
      {
        path: "/clients",
        element: <Samples />,
      },
      {
        path: "/companies/:inn",
        element: <DetailedCompany />,
      },
      {
        path: "/application/:id",
        element: <DetailedApplication />,
      },
      {
        path: "/clients/:id",
        element: <DetailedClient />,
      },
      
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
