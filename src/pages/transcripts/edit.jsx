import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getTranscriptById, updateTranscript } from '@/lib/services/transcript-service';
import { TranscriptForm } from '@/components/TranscriptForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function EditTranscriptPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: transcript, isLoading, error } = useQuery({
    queryKey: ['transcript', id],
    queryFn: () => getTranscriptById(id),
  });

  const updateMutation = useMutation({
    mutationFn: (data) => updateTranscript(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transcripts'] });
      queryClient.invalidateQueries({ queryKey: ['transcript', id] });
      toast.success('Transcript updated successfully', {
        description: 'The changes have been saved.',
      });
      navigate('/dashboard');
    },
    onError: (error) => {
      toast.error('Failed to update transcript', {
        description: error.message,
      });
    },
  });

  const handleSubmit = (data) => {
    updateMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <svg
            className="animate-spin h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p>Loading transcript...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="flex flex-col items-center gap-2 text-destructive">
          <p className="font-semibold">Error loading transcript</p>
          <p className="text-sm text-muted-foreground">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-6 max-w-4xl">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/dashboard')}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Edit Transcript</h1>
      </div>

      <TranscriptForm
        defaultValues={transcript}
        onSubmit={handleSubmit}
        isSubmitting={updateMutation.isPending}
        submitText="Save Changes"
      />
    </div>
  );
} 