import { useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle, Settings } from "lucide-react";
import { TranscriptsTable } from "@/components/TranscriptsTable";


const Dashboard = () => {
  const { user } = useUser();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {user.firstName || "User"}!
        </h1>
        <p className="text-muted-foreground">
          Manage your student transcripts and grading from one place.
        </p>
      </div>



      <div>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-semibold tracking-tight">Student Transcripts</h2>
          <Button asChild>
            <Link to="/transcripts/new" className="flex items-center gap-2">
              <PlusCircle className="w-4 h-4" />
              New Transcript
            </Link>
          </Button>
        </div>
        <TranscriptsTable />
      </div>
    </div>
  );
};

export default Dashboard; 