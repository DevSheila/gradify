import { Outlet } from "react-router-dom";
import Navbar from "@/components/Navbar";

const RootLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default RootLayout; 