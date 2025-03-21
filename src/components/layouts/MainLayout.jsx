import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const MainLayout = ({ children }) => {
  const location = useLocation();

  const isActive = (path) => {
    if (path === "/students" && location.pathname === "/") return true;
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center px-4">
          <nav className="flex items-center space-x-4 lg:space-x-6">
            <Link
              to="/students"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                isActive("/students")
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              Students
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-6">{children}</div>
      </main>
    </div>
  );
};

export default MainLayout; 