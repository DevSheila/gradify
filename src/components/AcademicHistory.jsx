import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getStudentAcademicHistory } from '@/lib/services/transcript-service';

export function AcademicHistory({ studentId }) {
  const { data: academicHistory, isLoading, error } = useQuery({
    queryKey: ['academicHistory', studentId],
    queryFn: () => getStudentAcademicHistory(studentId),
    enabled: !!studentId,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[400px] rounded-md border border-dashed animate-pulse">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <p>Loading academic history...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[400px] rounded-md border border-dashed">
        <div className="flex flex-col items-center gap-2 text-destructive">
          <p className="font-semibold">Error loading academic history</p>
          <p className="text-sm text-muted-foreground">{error.message}</p>
        </div>
      </div>
    );
  }

  if (!academicHistory) return null;

  const { transcripts, summary } = academicHistory;
  
  // Helper function to extract numeric grade level
  const getGradeLevel = (gradeStr) => {
    if (!gradeStr) return 0;
    const match = gradeStr.match(/\d+/);
    return match ? parseInt(match[0]) : 0;
  };

  // Sort years by grade level
  const years = Object.keys(transcripts)
    .sort((a, b) => {
      const gradeA = getGradeLevel(transcripts[a][0].student.gradeLevel);
      const gradeB = getGradeLevel(transcripts[b][0].student.gradeLevel);
      return gradeA - gradeB;
    });

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle>Academic Summary</CardTitle>
          <CardDescription>Overall academic performance across all years</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Cumulative GPA</p>
              <p className="text-2xl font-bold">{summary.cumulativeGPA}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Credits</p>
              <p className="text-2xl font-bold">{summary.totalCredits}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Years Completed</p>
              <p className="text-2xl font-bold">{summary.yearsCompleted}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Academic History Accordion */}
      <Accordion type="single" collapsible className="w-full">
        {years.map((year) => (
          <AccordionItem key={year} value={year}>
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-4">
                <span className="text-lg font-semibold">Academic Year {year}</span>
                <Badge variant="outline">
                  {transcripts[year][0].student.gradeLevel}
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              {transcripts[year].map((transcript, index) => (
                <div key={transcript.id} className="mb-6 last:mb-0">
                  {index > 0 && <div className="h-px bg-border my-4" />}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">{transcript.student.schoolName}</h4>
                        <p className="text-sm text-muted-foreground">
                          Created on {format(transcript.createdAt, 'MMM d, yyyy')}
                        </p>
                      </div>
                      <Badge>GPA: {transcript.gpa}</Badge>
                    </div>

                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Code</TableHead>
                            <TableHead>Unit Name</TableHead>
                            <TableHead className="text-right">Grade</TableHead>
                            <TableHead className="text-right">Credit Hours</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {transcript.units.map((unit, unitIndex) => (
                            <TableRow key={unitIndex}>
                              <TableCell className="font-medium">{unit.code}</TableCell>
                              <TableCell>{unit.name}</TableCell>
                              <TableCell className="text-right">
                                <Badge variant={
                                  unit.grade.startsWith('A') ? 'default' :
                                  unit.grade.startsWith('B') ? 'secondary' :
                                  unit.grade.startsWith('C') ? 'outline' :
                                  'destructive'
                                }>
                                  {unit.grade}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                {unit.creditHours}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
} 