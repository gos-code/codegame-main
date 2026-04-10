import { createBrowserRouter } from "react-router";
import Layout from "./components/Layout";
import Home from "./components/pages/Home";
import Marketplace from "./components/pages/Marketplace";
import Requests from "./components/pages/Requests";
import Guide from "./components/pages/Guide";
import Community from "./components/pages/Community";
import Contact from "./components/pages/Contact";
import DeveloperVillage from "./components/pages/DeveloperVillage";
import MyPage from "./components/pages/MyPage";
import Login from "./components/pages/Login";
import NotFound from "./components/pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "marketplace", Component: Marketplace },
      { path: "requests", Component: Requests },
      { path: "guide", Component: Guide },
      { path: "community", Component: Community },
      { path: "contact", Component: Contact },
      { path: "developer-village", Component: DeveloperVillage },
      { path: "mypage", Component: MyPage },
      { path: "login", Component: Login },
      { path: "*", Component: NotFound },
    ],
  },
]);
