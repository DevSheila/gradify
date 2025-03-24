import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { doc, getDoc, collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { PlusCircle, Pencil, Calendar, BookOpen, GraduationCap } from 'lucide-react';
import CreateTranscriptForm from '@/components/transcripts/CreateTranscriptForm';
import EditTranscriptForm from '@/components/transcripts/EditTranscriptForm';

const StudentTranscriptsPage = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);
  const [editingTranscript, setEditingTranscript] = useState(null);

  const { data: student, isLoading: isLoadingStudent } = useQuery({
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

  const { data: transcripts = [], isLoading: isLoadingTranscripts } = useQuery({
    queryKey: ['transcripts', studentId],
    queryFn: async () => {
      console.log('Fetching transcripts for student:', studentId); // Debug log
      const transcriptsRef = collection(db, 'transcripts');
      const q = query(
        transcriptsRef,
        where('studentId', '==', studentId)
      );
      
      const querySnapshot = await getDocs(q);
      console.log('Found transcripts:', querySnapshot.size); // Debug log
      
      const results = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt ? new Date(data.createdAt).toISOString() : new Date().toISOString()
        };
      }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      console.log('Processed transcripts:', results); // Debug log
      return results;
    },
    enabled: !!studentId
  });

  if (isLoadingStudent) {
    return <div className="text-center py-8">Loading student details...</div>;
  }

  if (!student) {
    return <div className="text-center py-8">Student not found</div>;
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{student.fullName}'s Transcripts</h1>
          <p className="text-muted-foreground">
            Student ID: {student.schoolId} | School: {student.schoolName}
          </p>
        </div>
        <Button onClick={() => navigate('/students')}>
          Back to Students
        </Button>
      </div>

      {!isCreating && !editingTranscript && (
        <Button onClick={() => setIsCreating(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create New Transcript
        </Button>
      )}

      {isCreating && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Create New Transcript</h2>
              <Button variant="ghost" onClick={() => setIsCreating(false)}>
                Cancel
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <CreateTranscriptForm
              student={student}
              onSuccess={() => {
                setIsCreating(false);
              }}
            />
          </CardContent>
        </Card>
      )}

      {editingTranscript && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Edit Transcript</h2>
              <Button variant="ghost" onClick={() => setEditingTranscript(null)}>
                Cancel
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <EditTranscriptForm
              transcript={editingTranscript}
              student={student}
              onSuccess={() => {
                setEditingTranscript(null);
              }}
            />
          </CardContent>
        </Card>
      )}

      {!isCreating && !editingTranscript && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoadingTranscripts ? (
            <Card className="col-span-full">
              <CardContent className="pt-6 text-center">
                Loading transcripts...
              </CardContent>
            </Card>
          ) : transcripts.length === 0 ? (
            <Card className="col-span-full">
              <CardContent className="pt-6 text-center">
                <p>No transcripts found</p>
                <p className="text-sm text-muted-foreground mt-2">Student ID: {studentId}</p>
              </CardContent>
            </Card>
          ) : (
            transcripts.map((transcript) => (
              <Card key={transcript.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="flex items-center space-x-2">
                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    <h3 className="font-semibold">Transcript</h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditingTranscript(transcript)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(transcript.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">GPA</p>
                      <p className="text-2xl font-bold">{transcript.gpa.toFixed(2)}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Credit Hours</p>
                      <p className="text-2xl font-bold">{transcript.totalCreditHours}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <h4 className="text-sm font-semibold mb-2">Courses</h4>
                    <div className="space-y-2">
                      {transcript.units.map((unit, index) => (
                        <div key={index} className="text-sm flex justify-between items-center">
                          <div className="flex-1">
                            <span className="font-medium">{unit.name}</span>
                            <span className="text-muted-foreground ml-2">({unit.code})</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="font-semibold">{unit.grade}</span>
                            <span className="text-muted-foreground">{unit.creditHours} cr</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <BookOpen className="h-4 w-4" />
                    <span>{transcript.units.length} courses</span>
                  </div>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default StudentTranscriptsPage; 