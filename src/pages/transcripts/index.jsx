import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TranscriptsTable } from '@/components/TranscriptsTable';

export default function TranscriptsPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Transcripts</h1>
        <Button asChild>
          <Link to="/transcripts/new" className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Transcript
          </Link>
        </Button>
      </div>
      
      <TranscriptsTable />
    </div>
  );
} 