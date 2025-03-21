import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

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

const gradingScale = [
  { range: '90 - 100', grade: 'A' },
  { range: '80 - 89', grade: 'B' },
  { range: '70 - 79', grade: 'C' },
  { range: '60 - 69', grade: 'D' },
  { range: '59 - Below', grade: 'F' }
];

const AcademicHistoryPDF = ({ academicHistory }) => {
  // Get the latest transcript for student information
  const years = Object.keys(academicHistory.transcripts).sort((a, b) => b.localeCompare(a));
  const latestYear = years[0];
  const latestTranscript = academicHistory.transcripts[latestYear][0];

  // Transform transcripts into academic years format and track last valid values
  let lastValidValues = {
    gradeLevel: '',
    schoolName: '',
    schoolCode: '',
    schoolAddress: '',
    schoolPhone: '',
    principalName: '',
  };

  const academicYears = years.map(year => {
    const yearTranscripts = academicHistory.transcripts[year];
    const firstTranscript = yearTranscripts[0];
    
    // Update last valid values if current values are not N/A
    if (firstTranscript.student.gradeLevel && firstTranscript.student.gradeLevel !== 'N/A') {
      lastValidValues.gradeLevel = firstTranscript.student.gradeLevel;
    }
    if (firstTranscript.student.schoolName && firstTranscript.student.schoolName !== 'N/A') {
      lastValidValues.schoolName = firstTranscript.student.schoolName;
    }
    if (firstTranscript.student.schoolCode && firstTranscript.student.schoolCode !== 'N/A') {
      lastValidValues.schoolCode = firstTranscript.student.schoolCode;
    }
    if (firstTranscript.student.schoolAddress && firstTranscript.student.schoolAddress !== 'N/A') {
      lastValidValues.schoolAddress = firstTranscript.student.schoolAddress;
    }
    if (firstTranscript.student.schoolPhone && firstTranscript.student.schoolPhone !== 'N/A') {
      lastValidValues.schoolPhone = firstTranscript.student.schoolPhone;
    }
    if (firstTranscript.student.principalName && firstTranscript.student.principalName !== 'N/A') {
      lastValidValues.principalName = firstTranscript.student.principalName;
    }
    
    return {
      year,
      gradeLevel: firstTranscript.student.gradeLevel === 'N/A' ? lastValidValues.gradeLevel : firstTranscript.student.gradeLevel,
      courses: yearTranscripts.flatMap(transcript => 
        transcript.units.map(unit => ({
          title: unit.name,
          credits: unit.creditHours,
          grade: unit.grade
        }))
      ),
      totalCredits: yearTranscripts.reduce((sum, t) => sum + t.totalCreditHours, 0),
      gpa: yearTranscripts[0].gpa.toFixed(2)
    };
  });

  // Prepare student info using last valid values for N/A fields
  const studentInfo = {
    name: latestTranscript.student.fullName,
    gender: latestTranscript.student.gender || 'N/A',
    studentId: latestTranscript.student.studentId,
    schoolName: latestTranscript.student.schoolName === 'N/A' ? lastValidValues.schoolName : latestTranscript.student.schoolName,
    schoolAddress: latestTranscript.student.schoolAddress === 'N/A' ? lastValidValues.schoolAddress : latestTranscript.student.schoolAddress,
    principalName: latestTranscript.student.principalName === 'N/A' ? lastValidValues.principalName : latestTranscript.student.principalName,
    cumulativeGPA: academicHistory.summary.cumulativeGPA
  };

  return (
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
              <Text style={styles.label}>GENDER</Text>
              <Text style={styles.value}>{studentInfo.gender}</Text>
            </View>
            <View style={{ flex: 2 }}>
              <Text style={styles.label}>STUDENT ID</Text>
              <Text style={styles.value}>{studentInfo.studentId}</Text>
            </View>
            <View style={{ flex: 4 }}></View>
          </View>

          {/* School Info Row */}
          <View style={styles.studentInfoRow}>
            <View style={{ flex: 4 }}>
              <Text style={styles.label}>SCHOOL NAME</Text>
              <Text style={styles.value}>{studentInfo.schoolName}</Text>
            </View>
            <View style={{ flex: 8 }}></View>
          </View>

          {/* School Address */}
          <View style={styles.studentInfoRow}>
            <View style={{ flex: 6 }}>
              <Text style={styles.label}>SCHOOL ADDRESS</Text>
              <Text style={styles.value}>{studentInfo.schoolAddress}</Text>
            </View>
            <View style={{ flex: 6 }}></View>
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
            {academicYears.length > 2 && (
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
            )}
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
                <Text>{academicHistory.summary.totalCredits}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.label}>Years Completed</Text>
                <Text>{academicHistory.summary.yearsCompleted}</Text>
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
              <Text style={styles.signature}></Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default AcademicHistoryPDF; 