import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { pdf, Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';

// Register a standard font
Font.register({
  family: 'Times-Roman',
  src: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf'
});

// Create styles for PDF
const styles = StyleSheet.create({
  page: {
    padding: 35,
    fontFamily: 'Times-Roman',
  },
  container: {
    border: '1pt solid #777',
  },
  header: {
    borderBottom: '1pt solid #777',
    padding: 10,
    textAlign: 'center',
  },
  schoolName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#444',
  },
  subHeader: {
    fontSize: 10,
    color: '#555',
    marginTop: 3,
  },
  studentInfoRow: {
    flexDirection: 'row',
    borderBottom: '1pt solid #777',
    padding: 8,
    fontSize: 9,
  },
  academicRecordHeader: {
    borderBottom: '1pt solid #777',
    padding: 8,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 12,
  },
  academicYearsContainer: {
    borderBottom: '1pt solid #777',
  },
  academicYearRow: {
    flexDirection: 'row',
  },
  yearColumn: {
    width: '50%',
    padding: 8,
    fontSize: 9,
  },
  yearHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  yearHeaderLabel: {
    fontSize: 8,
    color: '#666',
  },
  courseTable: {
    width: '100%',
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottom: '0.5pt solid #ddd',
    paddingBottom: 2,
    marginBottom: 3,
    fontSize: 8,
    fontWeight: 'bold',
  },
  courseRow: {
    flexDirection: 'row',
    marginVertical: 1,
    fontSize: 8,
  },
  courseTitle: {
    flex: 6,
  },
  credits: {
    flex: 2,
    textAlign: 'center',
  },
  grade: {
    flex: 2,
    textAlign: 'center',
  },
  yearFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
    paddingTop: 3,
    fontSize: 8,
  },
  academicSummaryContainer: {
    flexDirection: 'row',
    borderBottom: '1pt solid #777',
  },
  academicSummary: {
    width: '67%',
    borderRight: '1pt solid #777',
    padding: 8,
  },
  gradingScale: {
    width: '33%',
    padding: 8,
  },
  sectionTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 8,
    marginVertical: 2,
  },
  scaleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 8,
    marginVertical: 2,
  },
  signatureContainer: {
    flexDirection: 'row',
    padding: 8,
    fontSize: 9,
  },
  signatureColumn: {
    flex: 1,
  },
  signatureLabel: {
    fontSize: 8,
    color: '#666',
  },
  signature: {
    marginTop: 10,
    fontStyle: 'italic',
  },
  borderRight: {
    borderRight: '1pt solid #777',
  },
  verticalDivider: {
    borderRight: '1pt solid #777',
    height: '100%',
  },
  bordered: {
    border: '1pt solid #777',
  },
  label: {
    fontSize: 8,
    color: '#666',
  },
  value: {
    fontSize: 9,
  },
  infoSection: {
    margin: 2,
  }
});

// PDF Document component
const TranscriptDocument = ({ studentInfo, academicYears, gradingScale }) => (
  <Document>
    <Page size="LETTER" style={styles.page}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.schoolName}>{studentInfo.schoolName}</Text>
          <Text style={styles.subHeader}>OFFICIAL HIGH SCHOOL TRANSCRIPT</Text>
        </View>

        {/* Student Info Row 1 */}
        <View style={styles.studentInfoRow}>
          <View style={{ flex: 4 }}>
            <Text style={styles.label}>STUDENT NAME</Text>
            <Text style={styles.value}>{studentInfo.name}</Text>
          </View>
          <View style={{ flex: 2 }}>
            <Text style={styles.label}>DATE OF BIRTH</Text>
            <Text style={styles.value}>{studentInfo.dob}</Text>
          </View>
          <View style={{ flex: 2 }}>
            <Text style={styles.label}>GENDER</Text>
            <Text style={styles.value}>{studentInfo.gender}</Text>
          </View>
          <View style={{ flex: 2 }}>
            <Text style={styles.label}>CLASS OF</Text>
            <Text style={styles.value}>{studentInfo.classOf}</Text>
          </View>
          <View style={{ flex: 2 }}>
            <Text style={styles.label}>STUDENT ID</Text>
            <Text style={styles.value}>{studentInfo.studentId}</Text>
          </View>
        </View>

        {/* School Info Row */}
        <View style={styles.studentInfoRow}>
          <View style={{ flex: 4 }}>
            <Text style={styles.label}>SCHOOL NAME</Text>
            <Text style={styles.value}>{studentInfo.schoolName}</Text>
          </View>
          <View style={{ flex: 2 }}>
            <Text style={styles.label}>CEED CODE</Text>
            <Text style={styles.value}>{studentInfo.ceedCode}</Text>
          </View>
          <View style={{ flex: 6 }}></View>
        </View>

        {/* School Address & Phone */}
        <View style={styles.studentInfoRow}>
          <View style={{ flex: 6 }}>
            <Text style={styles.label}>SCHOOL ADDRESS</Text>
            <Text style={styles.value}>{studentInfo.schoolAddress}</Text>
          </View>
          <View style={{ flex: 3 }}>
            <Text style={styles.label}>TELEPHONE</Text>
            <Text style={styles.value}>{studentInfo.telephone}</Text>
          </View>
          <View style={{ flex: 3 }}></View>
        </View>

        {/* Academic Record Header */}
        <View style={styles.academicRecordHeader}>
          <Text>ACADEMIC RECORD</Text>
        </View>

        {/* Academic Years Grid */}
        <View style={styles.academicYearsContainer}>
          {/* First row of academic years */}
          <View style={styles.academicYearRow}>
            {academicYears.slice(0, 2).map((year, yearIndex) => (
              <View key={yearIndex} style={[styles.yearColumn, yearIndex === 0 && styles.borderRight]}>
                <View style={styles.yearHeader}>
                  <View>
                    <Text style={styles.yearHeaderLabel}>SCHOOL YEAR:</Text>
                    <Text>{year.year}</Text>
                  </View>
                  <View>
                    <Text style={styles.yearHeaderLabel}>GRADE LEVEL:</Text>
                    <Text>{year.gradeLevel}</Text>
                  </View>
                </View>

                <View style={styles.courseTable}>
                  <View style={styles.tableHeader}>
                    <Text style={styles.courseTitle}>Course Title</Text>
                    <Text style={styles.credits}>Credits Earned</Text>
                    <Text style={styles.grade}>Final Grade</Text>
                  </View>

                  {year.courses.map((course, courseIndex) => (
                    <View key={courseIndex} style={styles.courseRow}>
                      <Text style={styles.courseTitle}>{course.title}</Text>
                      <Text style={styles.credits}>{course.credits}</Text>
                      <Text style={styles.grade}>{course.grade}</Text>
                    </View>
                  ))}

                  <View style={styles.yearFooter}>
                    <Text>Total Credits: {year.totalCredits}</Text>
                    <Text>GPA: {year.gpa}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>

          {/* Second row of academic years */}
          <View style={styles.academicYearRow}>
            {academicYears.slice(2, 4).map((year, yearIndex) => (
              <View key={yearIndex} style={[styles.yearColumn, yearIndex === 0 && styles.borderRight]}>
                <View style={styles.yearHeader}>
                  <View>
                    <Text style={styles.yearHeaderLabel}>SCHOOL YEAR:</Text>
                    <Text>{year.year}</Text>
                  </View>
                  <View>
                    <Text style={styles.yearHeaderLabel}>GRADE LEVEL:</Text>
                    <Text>{year.gradeLevel}</Text>
                  </View>
                </View>

                <View style={styles.courseTable}>
                  <View style={styles.tableHeader}>
                    <Text style={styles.courseTitle}>Course Title</Text>
                    <Text style={styles.credits}>Credits Earned</Text>
                    <Text style={styles.grade}>Final Grade</Text>
                  </View>

                  {year.courses.map((course, courseIndex) => (
                    <View key={courseIndex} style={styles.courseRow}>
                      <Text style={styles.courseTitle}>{course.title}</Text>
                      <Text style={styles.credits}>{course.credits}</Text>
                      <Text style={styles.grade}>{course.grade}</Text>
                    </View>
                  ))}

                  <View style={styles.yearFooter}>
                    <Text>Total Credits: {year.totalCredits}</Text>
                    <Text>GPA: {year.gpa}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Academic Summary and Grading Scale */}
        <View style={styles.academicSummaryContainer}>
          <View style={styles.academicSummary}>
            <Text style={styles.sectionTitle}>ACADEMIC SUMMARY</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.label}>Cumulative GPA</Text>
              <Text>{studentInfo.cumulativeGPA}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.label}>Credits Earned</Text>
              <Text>Yes</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.label}>Diploma Earned</Text>
              <Text>Yes</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.label}>Graduation Date</Text>
              <Text>{studentInfo.graduationDate}</Text>
            </View>
          </View>
          
          <View style={styles.gradingScale}>
            <Text style={styles.sectionTitle}>GRADING SCALE</Text>
            {gradingScale.map((item, index) => (
              <View key={index} style={styles.scaleRow}>
                <Text>{item.range}</Text>
                <Text>= {item.grade}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Principal's Signature */}
        <View style={styles.signatureContainer}>
          <View style={styles.signatureColumn}>
            <Text style={styles.signatureLabel}>SCHOOL PRINCIPAL'S SIGNATURE</Text>
            <Text style={styles.signature}>{studentInfo.principalName}</Text>
          </View>
          <View style={styles.signatureColumn}></View>
          <View style={styles.signatureColumn}>
            <Text style={styles.signatureLabel}>Date:</Text>
            <Text style={styles.signature}>{studentInfo.graduationDate}</Text>
          </View>
        </View>
      </View>
    </Page>
  </Document>
);

const TranscriptGenerator = () => {
  const [studentInfo, setStudentInfo] = useState({
    name: 'ETHAN MEADOWS',
    dob: '09/10/2006',
    gender: 'MALE',
    classOf: '2024',
    studentId: '24778245',
    schoolName: 'SEQUOYAH HIGH SCHOOL',
    ceedCode: '373453',
    schoolAddress: '17091 S Muskogee Ave, Tahlequah, OK 74464',
    telephone: '918-453-9400',
    principalName: 'Pedro Rivera',
    graduationDate: 'May 24, 2024',
    cumulativeGPA: '3.10'
  });

  const [academicYears, setAcademicYears] = useState([
    {
      year: '2020-2021',
      gradeLevel: '9th',
      courses: [
        { title: 'Algebra 1', credits: 1, grade: 'A-' },
        { title: 'American Literature 1', credits: 1, grade: 'C' },
        { title: 'World geography', credits: 1, grade: 'C+' },
        { title: 'Physical science', credits: 1, grade: 'B' },
        { title: 'AP History Elective', credits: 1, grade: 'B-' },
        { title: 'World History', credits: 1, grade: 'B' },
      ],
      totalCredits: 6,
      gpa: '3.10'
    },
    {
      year: '2021-2022',
      gradeLevel: '10th',
      courses: [
        { title: 'Algebra II', credits: 1, grade: 'A-' },
        { title: 'Calculus AB', credits: 1, grade: 'C+' },
        { title: 'American Literature I', credits: 1, grade: 'B-' },
        { title: 'Spanish I', credits: 0.5, grade: 'C' },
        { title: 'Biology', credits: 1, grade: 'A-' },
        { title: 'World History', credits: 1, grade: 'B' },
        { title: 'Physical Education', credits: 1, grade: 'B+' },
      ],
      totalCredits: 7,
      gpa: '2.84'
    },
    {
      year: '2022-2023',
      gradeLevel: '11th',
      courses: [
        { title: 'AP Calculus BC', credits: 1, grade: 'B+' },
        { title: 'Geometry', credits: 1, grade: 'B' },
        { title: 'World Literature CP', credits: 1, grade: 'B+' },
        { title: 'Spanish II', credits: 1, grade: 'A-' },
        { title: 'Integrated Science', credits: 1, grade: 'B' },
        { title: 'Physical Education', credits: 1, grade: 'C+' },
        { title: 'Physics Lab', credits: 0.5, grade: 'B' },
      ],
      totalCredits: 7,
      gpa: '3.01'
    },
    {
      year: '2023-2024',
      gradeLevel: '12th',
      courses: [
        { title: 'Britain Literature', credits: 1, grade: 'B' },
        { title: 'Trigonometry', credits: 0.5, grade: 'A' },
        { title: 'Chemistry Lab', credits: 1, grade: 'B' },
        { title: 'Spanish III Fine', credits: 1, grade: 'C+' },
        { title: 'Arts: Drawing', credits: 1, grade: 'B' },
        { title: 'Financial Literacy', credits: 1, grade: 'B-' },
        { title: 'Accounting 1', credits: 1, grade: 'B' },
      ],
      totalCredits: 7,
      gpa: '2.93'
    },
  ]);

  const gradingScale = [
    { range: '90 - 100', grade: 'A' },
    { range: '80 - 89', grade: 'B' },
    { range: '70 - 79', grade: 'C' },
    { range: '60 - 69', grade: 'D' },
    { range: '59 - Below', grade: 'F' }
  ];

  // Function to generate PDF
  const generatePDF = async () => {
    const blob = await pdf(
      <TranscriptDocument 
        studentInfo={studentInfo} 
        academicYears={academicYears} 
        gradingScale={gradingScale} 
      />
    ).toBlob();
    
    saveAs(blob, `${studentInfo.name.replace(/\s+/g, '_')}_Transcript.pdf`);
  };

  // Function to update student info
  const handleStudentInfoChange = (field, value) => {
    setStudentInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Function to update course data
  const handleCourseChange = (yearIndex, courseIndex, field, value) => {
    const updatedYears = [...academicYears];
    updatedYears[yearIndex].courses[courseIndex][field] = value;
    setAcademicYears(updatedYears);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-6 space-y-4">
        <h2 className="text-2xl font-bold">Transcript Generator</h2>
        
        {/* Student Info Form */}
        <Card className="mb-4">
          <CardContent className="p-4 space-y-4">
            <h3 className="text-lg font-semibold">Student Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="studentName">Student Name</Label>
                <Input 
                  id="studentName" 
                  value={studentInfo.name}
                  onChange={(e) => handleStudentInfoChange('name', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="dob">Date of Birth</Label>
                <Input 
                  id="dob" 
                  value={studentInfo.dob}
                  onChange={(e) => handleStudentInfoChange('dob', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="gender">Gender</Label>
                <Select 
                  value={studentInfo.gender}
                  onValueChange={(value) => handleStudentInfoChange('gender', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MALE">MALE</SelectItem>
                    <SelectItem value="FEMALE">FEMALE</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="classOf">Class Of</Label>
                <Input 
                  id="classOf" 
                  value={studentInfo.classOf}
                  onChange={(e) => handleStudentInfoChange('classOf', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="studentId">Student ID</Label>
                <Input 
                  id="studentId" 
                  value={studentInfo.studentId}
                  onChange={(e) => handleStudentInfoChange('studentId', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="schoolName">School Name</Label>
                <Input 
                  id="schoolName" 
                  value={studentInfo.schoolName}
                  onChange={(e) => handleStudentInfoChange('schoolName', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Button className="mb-4" onClick={generatePDF}>Generate PDF</Button>
      </div>

      {/* Transcript Preview */}
      <Card className="border-2 border-gray-300 bg-white">
        <CardContent className="p-0">
          <div className="p-8">
            {/* Header */}
            <div className="border border-gray-400 mb-1">
              <div className="text-center p-4 border-b border-gray-400">
                <h1 className="text-xl font-bold text-gray-700">{studentInfo.schoolName}</h1>
                <p className="text-sm text-gray-600">OFFICIAL HIGH SCHOOL TRANSCRIPT</p>
              </div>

              {/* Student Info - Removed partitions/borders */}
              <div className="grid grid-cols-12 text-sm border-b border-gray-400 p-2">
                <div className="col-span-4">
                  <div className="text-xs text-gray-500">STUDENT NAME</div>
                  <div>{studentInfo.name}</div>
                </div>
                <div className="col-span-2">
                  <div className="text-xs text-gray-500">DATE OF BIRTH</div>
                  <div>{studentInfo.dob}</div>
                </div>
                <div className="col-span-2">
                  <div className="text-xs text-gray-500">GENDER</div>
                  <div>{studentInfo.gender}</div>
                </div>
                <div className="col-span-2">
                  <div className="text-xs text-gray-500">CLASS OF</div>
                  <div>{studentInfo.classOf}</div>
                </div>
                <div className="col-span-2">
                  <div className="text-xs text-gray-500">STUDENT ID</div>
                  <div>{studentInfo.studentId}</div>
                </div>
              </div>

              {/* School Info - Removed partitions/borders */}
              <div className="grid grid-cols-12 text-sm border-b border-gray-400 p-2">
                <div className="col-span-4">
                  <div className="text-xs text-gray-500">SCHOOL NAME</div>
                  <div>{studentInfo.schoolName}</div>
                </div>
                <div className="col-span-2">
                  <div className="text-xs text-gray-500">CEED CODE</div>
                  <div>{studentInfo.ceedCode}</div>
                </div>
                <div className="col-span-6"></div>
              </div>

              <div className="grid grid-cols-12 text-sm p-2">
                <div className="col-span-6">
                  <div className="text-xs text-gray-500">SCHOOL ADDRESS</div>
                  <div>{studentInfo.schoolAddress}</div>
                </div>
                <div className="col-span-3">
                  <div className="text-xs text-gray-500">TELEPHONE</div>
                  <div>{studentInfo.telephone}</div>
                </div>
                <div className="col-span-3"></div>
              </div>
            </div>

            {/* Academic Record Header */}
            <div className="border border-gray-400 p-2 mb-1 text-center font-semibold">
              ACADEMIC RECORD
            </div>

            {/* Academic Years Grid */}
            <div className="border border-gray-400 mb-1">
              <div className="grid grid-cols-2 text-sm">
                {academicYears.map((year, yearIndex) => (
                  <div key={yearIndex} className={`p-2 ${yearIndex % 2 === 0 ? 'border-r' : ''} ${yearIndex < 2 ? 'border-b' : ''} border-gray-400`}>
                    <div className="flex justify-between mb-2">
                      <div>
                        <span className="text-xs text-gray-500">SCHOOL YEAR: </span>
                        <span>{year.year}</span>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500">GRADE LEVEL: </span>
                        <span>{year.gradeLevel}</span>
                      </div>
                    </div>

                    <table className="w-full text-xs">
                      <thead>
                        <tr>
                          <th className="text-left">Course Title</th>
                          <th className="text-center">Credits Earned</th>
                          <th className="text-center">Final Grade</th>
                        </tr>
                      </thead>
                      <tbody>
                        {year.courses.map((course, courseIndex) => (
                          <tr key={courseIndex}>
                            <td>{course.title}</td>
                            <td className="text-center">{course.credits}</td>
                            <td className="text-center">{course.grade}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr>
                          <td className="pt-2">
                            <span className="text-xs text-gray-500">Total Credits: </span>
                            <span>{year.totalCredits}</span>
                          </td>
                          <td></td>
                          <td className="text-right pt-2">
                            <span className="text-xs text-gray-500">GPA: </span>
                            <span>{year.gpa}</span>
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                ))}
              </div>
            </div>

            {/* Academic Summary */}
            <div className="border border-gray-400 mb-1">
              <div className="grid grid-cols-3 text-sm">
                <div className="col-span-2 border-r border-gray-400 p-2">
                  <div className="text-xs font-semibold mb-1">ACADEMIC SUMMARY</div>
                  <table className="w-full text-xs">
                    <tbody>
                      <tr>
                        <td className="py-1">
                          <span className="text-gray-500">Cumulative GPA</span>
                        </td>
                        <td className="text-right">{studentInfo.cumulativeGPA}</td>
                      </tr>
                      <tr>
                        <td className="py-1">
                          <span className="text-gray-500">Credits Earned</span>
                        </td>
                        <td className="text-right">Yes</td>
                      </tr>
                      <tr>
                        <td className="py-1">
                          <span className="text-gray-500">Diploma Earned</span>
                        </td>
                        <td className="text-right">Yes</td>
                      </tr>
                      <tr>
                        <td className="py-1">
                          <span className="text-gray-500">Graduation Date</span>
                        </td>
                        <td className="text-right">{studentInfo.graduationDate}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="p-2">
                  <div className="text-xs font-semibold mb-1">GRADING SCALE</div>
                  <table className="w-full text-xs">
                    <tbody>
                      {gradingScale.map((item, index) => (
                        <tr key={index}>
                          <td className="py-1">{item.range}</td>
                          <td className="text-right">= {item.grade}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Principal's Signature */}
            <div className="border border-gray-400">
              <div className="grid grid-cols-3 text-sm p-2">
                <div>
                  <div className="text-xs text-gray-500">SCHOOL PRINCIPAL'S SIGNATURE</div>
                  <div className="italic pt-2">{studentInfo.principalName}</div>
                </div>
                <div></div>
                <div>
                  <div className="text-xs text-gray-500">Date:</div>
                  <div className="pt-2">{studentInfo.graduationDate}</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TranscriptGenerator;