import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Search, Download } from 'lucide-react';
import { AcademicHistory } from '@/components/AcademicHistory';
import { PDFDownloadLink } from '@react-pdf/renderer';
import AcademicHistoryPDF from '@/components/AcademicHistoryPDF';
import { useQuery } from '@tanstack/react-query';
import { getStudentAcademicHistory } from '@/lib/services/transcript-service';

export default function AcademicHistoryPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [studentId, setStudentId] = useState(searchParams.get('studentId') || '');
  const [searchedId, setSearchedId] = useState(searchParams.get('studentId') || '');

  const { data: academicHistory } = useQuery({
    queryKey: ['academicHistory', searchedId],
    queryFn: () => getStudentAcademicHistory(searchedId),
    enabled: !!searchedId,
  });

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchedId(studentId);
    setSearchParams({ studentId });
  };

  useEffect(() => {
    const urlStudentId = searchParams.get('studentId');
    if (urlStudentId) {
      setStudentId(urlStudentId);
      setSearchedId(urlStudentId);
    }
  }, [searchParams]);

  return (
    <div className="container py-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Academic History</h1>
        </div>
        {academicHistory && (
          <PDFDownloadLink
            document={<AcademicHistoryPDF academicHistory={academicHistory} />}
            fileName={`academic-history-${searchedId}.pdf`}
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