import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { createTranscript } from '@/lib/services/transcript-service';
import { TranscriptForm } from '@/components/TranscriptForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function NewTranscriptPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createTranscript,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transcripts'] });
      toast.success('Transcript created successfully', {
        description: 'The transcript has been saved.',
      });
      navigate('/dashboard');
    },
    onError: (error) => {
      toast.error('Failed to create transcript', {
        description: error.message,
      });
    },
  });

  const handleSubmit = (data) => {
    createMutation.mutate(data);
  };

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
        <h1 className="text-2xl font-bold">Create New Transcript</h1>
      </div>

      <TranscriptForm
        onSubmit={handleSubmit}
        isSubmitting={createMutation.isPending}
        submitText="Create Transcript"
      />
    </div>
  );
} 