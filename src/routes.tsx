import { createHashRouter } from "react-router";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Saas from "./pages/Saas";
import BuildSaas from "./pages/BuildSaas";
import Startups from "./pages/Startups";
import StartupDetail from "./pages/StartupDetail";
import SubmitIdea from "./pages/SubmitIdea";
import Investors from "./pages/Investors";
import InvestorProfile from "./pages/InvestorProfile";
import News from "./pages/News";
import NewsDetail from "./pages/NewsDetail";
import Contact from "./pages/Contact";
import Feed from "./pages/Feed";
import Messages from "./pages/Messages";
import Account from "./pages/Account";
import Search from "./pages/Search";
import Admin from "./pages/Admin";

function NotFound() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
      <div className="text-center">
        <p className="text-[80px] font-bold text-[#E5E5E2] leading-none" style={{ fontFamily: "'DM Sans', sans-serif" }}>404</p>
        <h1 className="text-[22px] font-bold text-[#0D1421] mt-2 mb-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>Page not found</h1>
        <a href="/" className="text-[13.5px] text-[#2557D6] hover:underline" style={{ fontFamily: "'Inter', sans-serif" }}>← Go home</a>
      </div>
    </div>
  );
}


export const router = createHashRouter([
  { path: "/admin", Component: Admin },
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "saas", Component: Saas },
      { path: "build-saas", Component: BuildSaas },
      { path: "startups", Component: Startups },
      { path: "startups/:id", Component: StartupDetail },
      { path: "submit-idea", Component: SubmitIdea },
      { path: "investors", Component: Investors },
      { path: "investors/:id", Component: InvestorProfile },
      { path: "news", Component: News },
      { path: "news/:slug", Component: NewsDetail },
      { path: "contact", Component: Contact },
      { path: "feed", Component: Feed },
      { path: "messages", Component: Messages },
      { path: "account", Component: Account },
      { path: "search", Component: Search },
      { path: "*", Component: NotFound },
    ],
  },
]);
