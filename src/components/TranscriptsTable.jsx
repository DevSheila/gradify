import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, FileEdit, Trash2, GraduationCap, Download } from "lucide-react";
import {
  getTranscripts,
  deleteTranscript,
} from "@/lib/services/transcript-service";
import { TranscriptDetailsDialog } from "./TranscriptDetailsDialog";
import { DeleteTranscriptDialog } from "./DeleteTranscriptDialog";
import { TranscriptsEmptyState } from "./EmptyState";
import { Badge } from "@/components/ui/badge";

export function TranscriptsTable() {
  const [selectedTranscript, setSelectedTranscript] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [transcriptToDelete, setTranscriptToDelete] = useState(null);
  const queryClient = useQueryClient();

  const {
    data: transcripts,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["transcripts"],
    queryFn: getTranscripts,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTranscript,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transcripts"] });
      toast.success("Transcript deleted successfully", {
        description: "The transcript has been permanently removed.",
      });
      setDeleteDialogOpen(false);
      setTranscriptToDelete(null);
    },
    onError: (error) => {
      toast.error("Failed to delete transcript", {
        description: error.message,
      });
    },
  });

  const handleViewTranscript = (transcript) => {
    setSelectedTranscript(transcript);
    setDialogOpen(true);
  };

  const handleDeleteClick = (transcript) => {
    setTranscriptToDelete(transcript);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (transcriptToDelete) {
      await deleteMutation.mutateAsync(transcriptToDelete.id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[400px] rounded-md border border-dashed animate-pulse">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <p>Loading transcripts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[400px] rounded-md border border-dashed">
        <div className="flex flex-col items-center gap-2 text-destructive">
          <p className="font-semibold">Error loading transcripts</p>
          <p className="text-sm text-muted-foreground">{error.message}</p>
        </div>
      </div>
    );
  }

  if (!transcripts?.length) {
    return <TranscriptsEmptyState />;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Student Name</TableHead>
            <TableHead>School</TableHead>
            <TableHead>Grade Level</TableHead>
            <TableHead>Academic Year</TableHead>
            <TableHead>GPA</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transcripts.map((transcript) => (
            <TableRow key={transcript.id}>
              <TableCell className="font-medium">
                {transcript.student.fullName}
              </TableCell>
              <TableCell>{transcript.student.schoolName}</TableCell>
              <TableCell>
                <Badge variant="secondary">
                  {transcript.student.gradeLevel}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="outline">
                  {transcript.student.year}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{transcript.gpa.toFixed(2)}</Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => handleViewTranscript(transcript)}
                  >
                    <Eye className="h-4 w-4" />
                    View Details
                  </Button>
                  <Link to={`/transcripts/${transcript.id}/edit`}>
                    <Button variant="outline" size="sm" className="gap-2">
                      <FileEdit className="h-4 w-4" /> 
                      Edit
                    </Button>
                  </Link>
                  <Link 
                    to={`/transcripts/history?studentId=${transcript.student.studentId}`}
                    className="inline-flex"
                  >
                    <Button variant="outline" size="sm" className="gap-2">
                      <GraduationCap className="h-4 w-4" />
                      History
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteClick(transcript)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <TranscriptDetailsDialog
        transcript={selectedTranscript}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />

      <DeleteTranscriptDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
}
