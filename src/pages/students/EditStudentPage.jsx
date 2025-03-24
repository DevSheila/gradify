import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import EditStudentForm from '@/components/students/EditStudentForm';

const EditStudentPage = () => {
  const navigate = useNavigate();
  const { studentId } = useParams();

  const { data: student, isLoading } = useQuery({
    queryKey: ['student', studentId],
    queryFn: async () => {
      const docRef = doc(db, 'students', studentId);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        throw new Error('Student not found');
      }
      return { id: docSnap.id, ...docSnap.data() };
    }
  });

  if (isLoading) {
    return <div className="text-center py-8">Loading student details...</div>;
  }

  if (!student) {
    return <div className="text-center py-8">Student not found</div>;
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Edit Student</h1>
        <Button variant="outline" onClick={() => navigate('/students')}>
          Back to Students
        </Button>
      </div>

      <EditStudentForm
        student={student}
        onSuccess={() => navigate('/students')}
      />
    </div>
  );
};

export default EditStudentPage; 