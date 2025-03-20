import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Search } from 'lucide-react';
import { AcademicHistory } from '@/components/AcademicHistory';

export default function AcademicHistoryPage() {
  const navigate = useNavigate();
  const [studentId, setStudentId] = useState('');
  const [searchedId, setSearchedId] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchedId(studentId);
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
        <h1 className="text-2xl font-bold">Academic History</h1>
      </div>

      <div className="mb-8">
        <form onSubmit={handleSearch} className="flex gap-4 max-w-md">
          <Input
            placeholder="Enter student ID"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
          />
          <Button type="submit">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </form>
      </div>

      {searchedId && <AcademicHistory studentId={searchedId} />}
    </div>
  );
} 