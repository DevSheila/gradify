import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getStudentAcademicHistory } from '@/lib/services/transcript-service';
import { GraduationCap, Calendar, School, Award } from 'lucide-react';

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
  const years = Object.keys(transcripts).sort((a, b) => b.localeCompare(a));
  const latestTranscript = transcripts[years[0]][0];

  return (
    <div className="space-y-8">
      {/* Student Overview Card */}
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <GraduationCap className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Student</p>
                <p className="text-lg font-semibold">{latestTranscript.student.fullName}</p>
                <p className="text-sm text-muted-foreground">ID: {studentId}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <School className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Current School</p>
                <p className="text-lg font-semibold">{latestTranscript.student.schoolName}</p>
                <p className="text-sm text-muted-foreground">{latestTranscript.student.gradeLevel}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Award className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Cumulative GPA</p>
                <p className="text-lg font-semibold">{summary.cumulativeGPA}</p>
                <p className="text-sm text-muted-foreground">Total Credits: {summary.totalCredits}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Academic Progress</p>
                <p className="text-lg font-semibold">{summary.yearsCompleted} Years</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Academic Timeline */}
      <div className="relative space-y-8">
        {years.map((year, yearIndex) => (
          <div key={year} className="relative">
            {/* Timeline Line */}
            {yearIndex !== years.length - 1 && (
              <div className="absolute left-[15px] top-[40px] bottom-0 w-[2px] bg-border" />
            )}
            
            {/* Year Marker */}
            <div className="flex items-center gap-4 mb-4">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center z-10">
                <div className="h-4 w-4 rounded-full bg-primary" />
              </div>
              <h3 className="text-lg font-semibold">Academic Year {year}</h3>
            </div>

            {/* Transcripts for the Year */}
            <div className="ml-12 space-y-4">
              {transcripts[year].map((transcript, index) => (
                <Card key={`${year}-${index}`} className="overflow-hidden">
                  <div className="border-l-4 border-primary p-6 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-lg">{transcript.student.schoolName}</h4>
                        <p className="text-sm text-muted-foreground">
                          Created on {format(transcript.createdAt, 'MMM d, yyyy')}
                        </p>
                      </div>
                      <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                        GPA: {transcript.gpa.toFixed(2)}
                      </Badge>
                    </div>

                    {/* Units Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {transcript.units.map((unit, unitIndex) => (
                        <div
                          key={unitIndex}
                          className="p-3 rounded-lg bg-muted/50 flex justify-between items-center"
                        >
                          <div>
                            <p className="font-medium">{unit.name}</p>
                            <p className="text-sm text-muted-foreground">{unit.code}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge variant="outline">{unit.creditHours} Credits</Badge>
                            <Badge
                              variant={
                                unit.grade.startsWith('A') ? 'default' :
                                unit.grade.startsWith('B') ? 'secondary' :
                                unit.grade.startsWith('C') ? 'outline' :
                                'destructive'
                              }
                            >
                              {unit.grade}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Semester Summary */}
                    <div className="flex justify-between items-center pt-4 border-t">
                      <p className="text-sm text-muted-foreground">
                        Total Credit Hours: <span className="font-medium">{transcript.totalCreditHours}</span>
                      </p>
                      <Badge variant="outline" className="ml-auto">
                        {transcript.student.gradeLevel}
                      </Badge>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 