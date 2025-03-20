import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/Navbar";

const TranscriptsLayout = () => {
  return (
    <main className="container mx-auto px-4 py-8">
      <Outlet />
    </main>
  );
};

export default TranscriptsLayout;
