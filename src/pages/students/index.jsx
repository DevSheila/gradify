import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import StudentTable from "@/components/students/StudentTable";

const StudentsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Students</h1>
          <p className="text-muted-foreground">
            Manage your students and their academic records
          </p>
        </div>
        <Button onClick={() => navigate("/students/create")}>
          Create New Student
        </Button>
      </div>

      <StudentTable />
    </div>
  );
};

export default StudentsPage; 