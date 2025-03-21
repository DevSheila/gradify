import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import StudentForm from "@/components/students/StudentForm";

const CreateStudentPage = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Create New Student</h1>
          <p className="text-muted-foreground">
            Add a new student to the system
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => navigate("/students")}
        >
          Cancel
        </Button>
      </div>

      <div className="max-w-2xl">
        <StudentForm />
      </div>
    </div>
  );
};

export default CreateStudentPage; 