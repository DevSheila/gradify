import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import CreateStudentForm from '@/components/students/CreateStudentForm';

const CreateStudentPage = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Create New Student</h1>
        <Button variant="outline" onClick={() => navigate('/students')}>
          Back to Students
        </Button>
      </div>

      <CreateStudentForm />
    </div>
  );
};

export default CreateStudentPage; 