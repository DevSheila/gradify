import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { FileEdit, Download, PenLine } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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
import { Button } from '@/components/ui/button';
import { getStudentAcademicHistory } from '@/lib/services/transcript-service';

export function AcademicHistory({ studentId }) {
  const navigate = useNavigate();
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

  if (!academicHistory?.transcripts) {
    return (
      <div className="flex items-center justify-center h-[400px] rounded-md border border-dashed">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <p>No academic history found</p>
        </div>
      </div>
    );
  }

  const sortedYears = Object.entries(academicHistory.transcripts)
    .sort(([yearA], [yearB]) => yearB.localeCompare(yearA));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Academic History</CardTitle>
              <CardDescription>All transcripts for this student</CardDescription>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <PenLine className="h-4 w-4" />
              <span className="text-sm">Click edit icon to modify transcript</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {sortedYears.map(([year, transcripts]) => (
            <div key={year} className="space-y-4 mb-8 last:mb-0">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Academic Year {year}</h3>
                <Badge variant="outline">
                  {transcripts[0]?.student?.gradeLevel || 'N/A'}
                </Badge>
              </div>
              
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>School Name</TableHead>
                      <TableHead>Created Date</TableHead>
                      <TableHead className="text-center">GPA</TableHead>
                      <TableHead className="text-center">Credit Hours</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transcripts.map((transcript) => (
                      <TableRow key={transcript.id}>
                        <TableCell>{transcript.student?.schoolName || 'N/A'}</TableCell>
                        <TableCell>
                          {transcript.createdAt ? format(transcript.createdAt.toDate(), 'MMM d, yyyy') : 'N/A'}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge>{transcript.gpa?.toFixed(2) || 'N/A'}</Badge>
                        </TableCell>
                        <TableCell className="text-center">{transcript.totalCreditHours || 'N/A'}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => navigate(`/transcripts/${transcript.id}/edit`)}
                              className="h-8 w-8"
                              title="Edit transcript"
                            >
                              <FileEdit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              title="Download transcript"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Academic History Accordion */}
      <Accordion type="single" collapsible className="w-full">
        {sortedYears.map(([year, transcripts]) => (
          <AccordionItem key={year} value={year}>
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-4">
                <span className="text-lg font-semibold">Academic Year {year}</span>
                <Badge variant="outline">
                  {transcripts[0]?.student?.gradeLevel || 'N/A'}
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              {transcripts.map((transcript, index) => (
                <div key={transcript.id} className="mb-6 last:mb-0">
                  {index > 0 && <div className="h-px bg-border my-4" />}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">{transcript.student?.schoolName || 'N/A'}</h4>
                        <p className="text-sm text-muted-foreground">
                          Created on {transcript.createdAt ? format(transcript.createdAt.toDate(), 'MMM d, yyyy') : 'N/A'}
                        </p>
                      </div>
                      <Badge>GPA: {transcript.gpa?.toFixed(2) || 'N/A'}</Badge>
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