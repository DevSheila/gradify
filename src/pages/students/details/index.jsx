import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * @typedef {Object} Student
 * @property {string} id - Auto-generated Firestore ID
 * @property {string} studentId - Unique student ID (used as main identifier)
 * @property {string} fullName
 * @property {string} schoolName
 * @property {string} year
 * @property {Date} createdAt
 */

/**
 * @typedef {Object} Unit
 * @property {string} code
 * @property {string} name
 * @property {string} grade
 * @property {number} gradePoints
 * @property {number} creditHours
 */

/**
 * @typedef {Object} Transcript
 * @property {string} id
 * @property {string} studentId - References Student.studentId
 * @property {string} userId - Clerk user ID
 * @property {Unit[]} units
 * @property {number} gpa
 * @property {number} totalCreditHours
 * @property {Date} createdAt
 */

const StudentDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: student, isLoading: isLoadingStudent } = useQuery({
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

  const { data: transcripts, isLoading: isLoadingTranscripts } = useQuery({
    queryKey: ["transcripts", id],
    queryFn: async () => {
      const q = query(
        collection(db, "transcripts"),
        where("studentId", "==", id)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    },
    enabled: !!student,
  });

  if (isLoadingStudent) {
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
          <h1 className="text-3xl font-bold">{student?.fullName}</h1>
          <p className="text-muted-foreground">Student ID: {student?.studentId}</p>
        </div>
        <Button onClick={() => navigate(`/students/${id}/create-transcript`)}>
          Create New Transcript
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Student Information</CardTitle>
          <CardDescription>Basic details about the student</CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-4">
            <div>
              <dt className="font-medium">School Name</dt>
              <dd className="text-muted-foreground">{student?.schoolName}</dd>
            </div>
            <div>
              <dt className="font-medium">Year</dt>
              <dd className="text-muted-foreground">{student?.year}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Academic History</CardTitle>
          <CardDescription>All transcripts for this student</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingTranscripts ? (
            <Skeleton className="h-[200px] w-full" />
          ) : transcripts?.length === 0 ? (
            <p className="text-muted-foreground">No transcripts found.</p>
          ) : (
            <div className="space-y-4">
              {transcripts?.map((transcript) => (
                <Card key={transcript.id}>
                  <CardHeader>
                    <CardTitle>
                      Transcript - {new Date(transcript.createdAt.toDate()).toLocaleDateString()}
                    </CardTitle>
                    <CardDescription>
                      GPA: {transcript.gpa} | Total Credit Hours: {transcript.totalCreditHours}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {transcript.units.map((unit, index) => (
                        <div
                          key={index}
                          className="grid grid-cols-4 gap-4 text-sm"
                        >
                          <div>{unit.code}</div>
                          <div>{unit.name}</div>
                          <div>Grade: {unit.grade}</div>
                          <div>Credits: {unit.creditHours}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentDetailsPage; 