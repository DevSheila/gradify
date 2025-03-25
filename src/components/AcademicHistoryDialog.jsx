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
import AcademicHistoryPDF from './AcademicHistoryPDF';
import TranscriptGenerator from '@/pages/TranscriptGenerator';

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

  if (error || !academicHistory) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <div className="flex items-center justify-center h-40">
            <p className="text-destructive">
              {error ? `Error loading academic history: ${error.message}` : 'No academic history found'}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const sortedYears = Object.entries(academicHistory.transcripts || {})
    .sort(([yearA], [yearB]) => yearB.localeCompare(yearA));

  if (sortedYears.length === 0) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Academic History</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center h-40">
            <p className="text-muted-foreground">No academic records found</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Get the latest transcript for student information
  const latestYear = sortedYears[0]; 
  const latestTranscript = latestYear[1][0];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Academic History</DialogTitle>
            {academicHistory && (
              // <PDFDownloadLink
              //   document={<AcademicHistoryPDF academicHistory={academicHistory} />}
              //   fileName={`academic-history-${studentId}.pdf`}
              // >
              //   {({ loading }) => (
              //     <Button variant="outline" className="gap-2" disabled={loading}>
              //       <Download className="h-4 w-4" />
              //       {loading ? 'Generating PDF...' : 'Download Academic History'}
              //     </Button>
              //   )}
              // </PDFDownloadLink>

              <PDFDownloadLink
              document={<TranscriptGenerator academicHistory={academicHistory} />}
              fileName={`academic-history-${studentId}.pdf`}
            >
              {({ loading }) => (
                <Button variant="outline" className="gap-2" disabled={loading}>
                  <Download className="h-4 w-4" />
                  {loading ? 'Generating PDF...' : 'Download Academic History'}
                </Button>
              )}
            </PDFDownloadLink>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Student Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Student Information</h3>
            <Card className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Full Name</p>
                  <p className="font-medium">{latestTranscript?.student?.fullName || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Student ID</p>
                  <p className="font-medium">{studentId}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Current Grade Level</p>
                  <Badge variant="outline" className="mt-1">
                    {latestTranscript?.student?.gradeLevel || 'N/A'}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Current School</p>
                  <p className="font-medium">{latestTranscript?.student?.schoolName || 'N/A'}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Academic Records by Year */}
          {sortedYears.map(([year, transcripts]) => (
            <div key={year} className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Academic Year {year}</h3>
                <Badge variant="outline">
                  {transcripts[0]?.student?.gradeLevel || 'N/A'}
                </Badge>
              </div>
              
              {transcripts.map((transcript, index) => (
                <Card key={`${year}-${index}`} className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">{transcript.student?.schoolName || 'N/A'}</h4>
                        <p className="text-sm text-muted-foreground">
                          Created on {transcript.createdAt ? format(transcript.createdAt, 'MMM d, yyyy') : 'N/A'}
                        </p>
                      </div>
                      <Badge>GPA: {transcript.gpa?.toFixed(2) || 'N/A'}</Badge>
                    </div>

                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Unit Code</TableHead>
                          <TableHead>Unit Name</TableHead>
                          <TableHead className="text-right">Grade</TableHead>
                          <TableHead className="text-right">Credit Hours</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {transcript.units?.map((unit, unitIndex) => (
                          <TableRow key={unitIndex}>
                            <TableCell>{unit.code}</TableCell>
                            <TableCell>{unit.name}</TableCell>
                            <TableCell className="text-right">{unit.grade}</TableCell>
                            <TableCell className="text-right">{unit.creditHours}</TableCell>
                          </TableRow>
                        ))}
                        <TableRow>
                          <TableCell colSpan={2} className="font-medium">Total Credit Hours</TableCell>
                          <TableCell colSpan={2} className="text-right font-medium">
                            {transcript.totalCreditHours}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </Card>
              ))}
            </div>
          ))}

          {/* Academic Summary */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Academic Summary</h3>
            <Card className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Cumulative GPA</p>
                  <p className="font-medium">{academicHistory.summary.cumulativeGPA}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Credits Earned</p>
                  <p className="font-medium">{academicHistory.summary.totalCredits}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Years Completed</p>
                  <p className="font-medium">{academicHistory.summary.yearsCompleted}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 