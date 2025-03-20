import { PDFViewer } from '@react-pdf/renderer';
import TranscriptPDF from './TranscriptPDF';

const sampleData = {
  schoolName: 'SEQUOYAH HIGH SCHOOL',
  schoolCode: '373453',
  schoolAddress: '17091 S Muskogee Ave, Tahlequah, OK 74464',
  schoolPhone: '918-453-5400',
  student: {
    fullName: 'ETHAN MEADOWS',
    dateOfBirth: '09/10/2006',
    gender: 'MALE',
    classOf: '2024',
    id: '24778245',
  },
  terms: [
    {
      year: '2020-2021',
      gradeLevel: '9',
      courses: [
        { name: 'Algebra 1', credits: 1, grade: 'A-' },
        { name: 'American Literature 1', credits: 1, grade: 'C' },
        { name: 'World Geography', credits: 1, grade: 'C+' },
        { name: 'Physical Science', credits: 1, grade: 'B' },
        { name: 'AP History Elective', credits: 1, grade: 'B-' },
        { name: 'World History', credits: 1, grade: 'B' },
      ],
      totalCredits: 6,
      gpa: 3.16,
    },
    {
      year: '2021-2022',
      gradeLevel: '10',
      courses: [
        { name: 'Algebra II', credits: 1, grade: 'A-' },
        { name: 'Calculus AB', credits: 1, grade: 'C+' },
        { name: 'American Literature I', credits: 1, grade: 'B-' },
        { name: 'Spanish I', credits: 0.5, grade: 'C' },
        { name: 'Biology', credits: 1, grade: 'A-' },
        { name: 'World History', credits: 1, grade: 'C' },
        { name: 'Physical Education', credits: 1, grade: 'B+' },
      ],
      totalCredits: 7,
      gpa: 2.85,
    },
  ],
  cumulativeGPA: 3.10,
  totalCredits: 27,
  diplomaEarned: true,
  graduationDate: 'May 24, 2024',
  signatureDate: 'May 24, 2024',
};

const TranscriptViewer = () => {
  return (
    <div className="w-full h-screen">
      <PDFViewer width="100%" height="100%">
        <TranscriptPDF data={sampleData} />
      </PDFViewer>
    </div>
  );
};

export default TranscriptViewer; 