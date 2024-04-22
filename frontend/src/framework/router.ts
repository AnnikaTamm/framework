import { Component } from "./framework.js";
import HomePage from "../pages/HomePage.js";
import DonePage from "../pages/DonePage.js";
import ActivePage from "../pages/ActivePage.js";

type routes = {
  [key: string]: {
    pageComponent: () => Component;
    metaTitle: string;
    metaDescription: string;
    dynamic: boolean;
  };
};

const Routes: routes = {
  "#": {
    pageComponent: HomePage,
    metaTitle: "Home",
    metaDescription: "This is home",
    dynamic: false,
  },
  "#Done": {
    pageComponent: DonePage,
    metaTitle: "Done",
    metaDescription: "Done todos",
    dynamic: false,
  },
  "#Active": {
    pageComponent: ActivePage,
    metaTitle: "Active",
    metaDescription: "Active todos",
    dynamic: false,
  },
};

export default Routes;
