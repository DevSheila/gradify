export interface Course {
  name: string;
  credits: number;
  grade: string;
}

export interface Term {
  year: string;
  gradeLevel: string;
  courses: Course[];
  totalCredits: number;
  gpa: number;
}

export interface Student {
  fullName: string;
  dateOfBirth: string;
  gender: 'MALE' | 'FEMALE';
  classOf: string;
  id: string;
}

export interface TranscriptData {
  schoolName: string;
  schoolCode: string;
  schoolAddress: string;
  schoolPhone: string;
  student: Student;
  terms: Term[];
  cumulativeGPA: number;
  totalCredits: number;
  diplomaEarned: boolean;
  graduationDate: string;
  signatureDate: string;
} 