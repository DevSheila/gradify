import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import TranscriptForm from "@/components/transcripts/TranscriptForm";

const CreateTranscriptPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: student, isLoading } = useQuery({
    queryKey: ["student", id],
    queryFn: async () => {
      const q = query(
        collection(db, "students"),
        where("studentId", "==", id)
      );
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        throw new Error("Student not found");
      }
      return { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() };
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-[200px]" />
        <Skeleton className="h-[200px] w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Create Transcript</h1>
          <p className="text-muted-foreground">
            Creating transcript for {student?.fullName} ({student?.studentId})
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate(`/students/${id}`)}>
          Cancel
        </Button>
      </div>

      <div className="max-w-4xl">
        <TranscriptForm 
          studentId={id} 
          onSuccess={() => navigate(`/students/${id}`)}
        />
      </div>
    </div>
  );
};

export default CreateTranscriptPage; 