import { Outlet, ScrollRestoration } from "react-router";
import Navbar from "./Navbar";
import Footer from "./Footer";
import MobileNav from "./MobileNav";

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF8]">
      <ScrollRestoration />
      <Navbar />
      <main className="flex-1 pt-16 pb-16 lg:pb-0">
        <Outlet />
      </main>
      <Footer />
      <MobileNav />
    </div>
  );
}
