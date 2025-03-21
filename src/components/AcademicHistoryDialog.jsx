import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { FileEdit, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getStudentAcademicHistory } from '@/lib/services/transcript-service';
import { Skeleton } from '@/components/ui/skeleton';

export function AcademicHistoryDialog({ studentId, open, onOpenChange }) {
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ['academic-history', studentId],
    queryFn: () => getStudentAcademicHistory(studentId),
    enabled: !!studentId && open,
  });

  if (!open) return null;

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Academic History</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Skeleton className="h-[200px] w-full" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const years = Object.keys(data?.transcripts || {}).sort((a, b) => b.localeCompare(a));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Academic History</DialogTitle>
        </DialogHeader>

        {/* Academic Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Academic Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Cumulative GPA</p>
                <p className="text-2xl font-bold">{data?.summary.cumulativeGPA}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Credits</p>
                <p className="text-2xl font-bold">{data?.summary.totalCredits}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Years Completed</p>
                <p className="text-2xl font-bold">{data?.summary.yearsCompleted}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transcripts by Year */}
        <Tabs defaultValue={years[0]} className="w-full">
          <TabsList className="w-full justify-start">
            {years.map((year) => (
              <TabsTrigger key={year} value={year}>
                {year}
              </TabsTrigger>
            ))}
          </TabsList>
          {years.map((year) => (
            <TabsContent key={year} value={year}>
              <Card>
                <CardHeader>
                  <CardTitle>Academic Year {year}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>School</TableHead>
                          <TableHead>Grade Level</TableHead>
                          <TableHead className="text-center">GPA</TableHead>
                          <TableHead className="text-center">Credits</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {data?.transcripts[year].map((transcript) => (
                          <TableRow key={transcript.id}>
                            <TableCell>{transcript.student?.schoolName || 'N/A'}</TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {transcript.student?.gradeLevel || 'N/A'}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge variant={
                                transcript.gpa >= 3.5 ? 'default' :
                                transcript.gpa >= 3.0 ? 'secondary' :
                                transcript.gpa >= 2.0 ? 'outline' :
                                'destructive'
                              }>
                                {transcript.gpa?.toFixed(2) || 'N/A'}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-center">
                              {transcript.totalCreditHours || 'N/A'}
                            </TableCell>
                            <TableCell>
                              {transcript.createdAt ? format(transcript.createdAt, 'MMM d, yyyy') : 'N/A'}
                            </TableCell>
                            <TableCell>
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
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
} 