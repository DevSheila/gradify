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
import { TranscriptDocument } from '@/lib/utils/pdf-generator.jsx';

export function TranscriptDetailsDialog({ transcript, open, onOpenChange }) {
  if (!transcript) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Transcript Details</DialogTitle>
            <PDFDownloadLink
              document={<TranscriptDocument transcript={transcript} />}
              fileName={`transcript-${transcript.student.studentId}-${transcript.student.year}.pdf`}
            >
              {({ loading }) => (
                <Button variant="outline" className="gap-2" disabled={loading}>
                  <Download className="h-4 w-4" />
                  {loading ? 'Generating PDF...' : 'Download Transcript'}
                </Button>
              )}
            </PDFDownloadLink>
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
                  <p className="font-medium">{transcript.student.fullName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Student ID</p>
                  <p className="font-medium">{transcript.student.studentId}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Gender</p>
                  <p className="font-medium">{transcript.student.gender}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Student Address</p>
                  <p className="font-medium">{transcript.student.studentAddress}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Grade Level</p>
                  <Badge variant="outline" className="mt-1">
                    {transcript.student.gradeLevel}
                  </Badge>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">School Name</p>
                  <p className="font-medium">{transcript.student.schoolName}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">School Address</p>
                  <p className="font-medium">{transcript.student.schoolAddress}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Academic Year</p>
                  <p className="font-medium">{transcript.student.year}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Created</p>
                  <p className="font-medium">
                    {transcript.createdAt
                      ? format(transcript.createdAt, 'MMM d, yyyy')
                      : 'N/A'}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Units Table */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Units</h3>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="text-right">Grade</TableHead>
                    <TableHead className="text-right">Credit Hours</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transcript.units.map((unit, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{unit.code}</TableCell>
                      <TableCell>{unit.name}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant={unit.grade.startsWith('A') ? 'default' : 
                                      unit.grade.startsWith('B') ? 'secondary' :
                                      unit.grade.startsWith('C') ? 'outline' :
                                      'destructive'}>
                          {unit.grade}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">{unit.creditHours}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Summary */}
          <Card className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Total Credit Hours</p>
                <p className="text-2xl font-bold">{transcript.totalCreditHours}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">GPA</p>
                <p className="text-2xl font-bold">{transcript.gpa.toFixed(2)}</p>
              </div>
            </div>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
} 