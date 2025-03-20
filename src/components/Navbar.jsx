import { Link } from "react-router-dom";
import {
  SignInButton,
  SignUpButton,
  UserButton,
  useAuth,
} from "@clerk/clerk-react";
import { ModeToggle } from "./mode-toggle";
import { Home, LayoutDashboard } from "lucide-react";

const Navbar = () => {
  const { isSignedIn } = useAuth();

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center py-2 pl-4">
          <img src="/logo.svg" className="h-6 me-3 sm:h-7" alt="Logo" />
          <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            Gradify
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <ModeToggle />
          {isSignedIn ? (
            <>
              <Link
                to="/"
                className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-2"
              >
                <Home className="h-4 w-4" />
                Home
              </Link>
              <Link
                to="/dashboard"
                className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-2"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
              <UserButton afterSignOutUrl="/" />
            </>
          ) : (
            <div className="flex items-center gap-4">
              <SignInButton mode="modal">
                <button className="text-sm font-medium hover:text-primary transition-colors">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm font-medium transition-colors">
                  Sign Up
                </button>
              </SignUpButton>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
