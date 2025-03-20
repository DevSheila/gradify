import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Download } from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getStudentAcademicHistory } from '@/lib/services/transcript-service';
import { AcademicHistoryDocument } from '@/lib/utils/pdf-generator.jsx';

export function AcademicHistoryDialog({ studentId, open, onOpenChange }) {
  const { data: academicHistory, isLoading, error } = useQuery({
    queryKey: ['academicHistory', studentId],
    queryFn: () => getStudentAcademicHistory(studentId),
    enabled: !!studentId && open,
  });

  if (!studentId || isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <div className="flex items-center justify-center h-40">
            <p className="text-muted-foreground">Loading academic history...</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Academic History</DialogTitle>
            <PDFDownloadLink
              document={<AcademicHistoryDocument history={academicHistory} />}
              fileName={`academic-history-${studentId}.pdf`}
            >
              {({ loading }) => (
                <Button variant="outline" className="gap-2" disabled={loading}>
                  <Download className="h-4 w-4" />
                  {loading ? 'Generating PDF...' : 'Download History'}
                </Button>
              )}
            </PDFDownloadLink>
          </div>
        </DialogHeader>

        {error && (
          <div className="flex items-center justify-center h-[400px] text-destructive">
            <p>Error loading academic history: {error.message}</p>
          </div>
        )}

        {academicHistory && (
          <div className="space-y-6">
            {/* Summary Card */}
            <Card className="p-6">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Cumulative GPA</p>
                  <p className="text-2xl font-bold">{academicHistory.summary.cumulativeGPA}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Credits</p>
                  <p className="text-2xl font-bold">{academicHistory.summary.totalCredits}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Years Completed</p>
                  <p className="text-2xl font-bold">{academicHistory.summary.yearsCompleted}</p>
                </div>
              </div>
            </Card>

            {/* Academic History Accordion */}
            <Accordion type="single" collapsible className="w-full">
              {Object.entries(academicHistory.transcripts)
                .sort(([yearA], [yearB]) => yearB.localeCompare(yearA))
                .map(([year, transcripts]) => (
                  <AccordionItem key={year} value={year}>
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-4">
                        <span className="text-lg font-semibold">Academic Year {year}</span>
                        <Badge variant="outline">
                          {transcripts[0].student.gradeLevel}
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
                                <h4 className="font-medium">{transcript.student.schoolName}</h4>
                                <p className="text-sm text-muted-foreground">
                                  Created on {format(transcript.createdAt, 'MMM d, yyyy')}
                                </p>
                              </div>
                              <Badge>GPA: {transcript.gpa.toFixed(2)}</Badge>
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
        )}
      </DialogContent>
    </Dialog>
  );
} 