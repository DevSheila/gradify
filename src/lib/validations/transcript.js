import { z } from 'zod';

export const genderEnum = {
  MALE: 'Male',
  FEMALE: 'Female',
  OTHER: 'Other',
};

export const gradeLevelEnum = {
  FRESHMAN: '9th Grade',
  SOPHOMORE: '10th Grade',
  JUNIOR: '11th Grade',
  SENIOR: '12th Grade',
};

export const gradeEnum = {
  A_PLUS: 'A+',
  A: 'A',
  A_MINUS: 'A-',
  B_PLUS: 'B+',
  B: 'B',
  B_MINUS: 'B-',
  C_PLUS: 'C+',
  C: 'C',
  C_MINUS: 'C-',
  D_PLUS: 'D+',
  D: 'D',
  D_MINUS: 'D-',
  F: 'F',
};

const gradePoints = {
  'A+': 4.0,
  'A': 4.0,
  'A-': 3.7,
  'B+': 3.3,
  'B': 3.0,
  'B-': 2.7,
  'C+': 2.3,
  'C': 2.0,
  'C-': 1.7,
  'D+': 1.3,
  'D': 1.0,
  'D-': 0.7,
  'F': 0.0,
};

export const calculateGPA = (units) => {
  if (!units || units.length === 0) {
    return { gpa: 0, totalCreditHours: 0 };
  }

  let totalPoints = 0;
  let totalCreditHours = 0;

  units.forEach((unit) => {
    const creditHours = Number(unit.creditHours) || 0;
    const gradePoint = gradePoints[unit.grade] || 0;
    
    totalPoints += creditHours * gradePoint;
    totalCreditHours += creditHours;
  });

  const gpa = totalCreditHours > 0 ? totalPoints / totalCreditHours : 0;

  return {
    gpa: Number(gpa.toFixed(2)),
    totalCreditHours,
  };
};

export const transcriptSchema = z.object({
  student: z.object({
    fullName: z.string().min(3, 'Full name must be at least 3 characters'),
    studentId: z.string().min(1, 'Student ID is required'),
    schoolName: z.string().min(1, 'School name is required'),
    schoolAddress: z.string().min(1, 'School address is required'),
    studentAddress: z.string().min(1, 'Student address is required'),
    gender: z.nativeEnum(genderEnum, {
      errorMap: () => ({ message: 'Please select a gender' }),
    }),
    gradeLevel: z.nativeEnum(gradeLevelEnum, {
      errorMap: () => ({ message: 'Please select a grade level' }),
    }),
    year: z.string().min(4, 'Year must be at least 4 characters'),
  }),
  units: z
    .array(
      z.object({
        code: z.string().min(1, 'Unit code is required'),
        name: z.string().min(1, 'Unit name is required'),
        grade: z.nativeEnum(gradeEnum, {
          errorMap: () => ({ message: 'Please select a grade' }),
        }),
        creditHours: z.string().or(z.number()).transform(Number).pipe(
          z.number().min(0.5, 'Credit hours must be at least 0.5')
        ),
      })
    )
    .min(1, 'At least one unit is required'),
}); 