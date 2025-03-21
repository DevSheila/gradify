import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';

// Create styles
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
  table: {
    width: '100%',
    marginVertical: 10,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '0.5pt solid #ddd',
    paddingVertical: 4,
    fontSize: 8,
  },
  tableHeader: {
    backgroundColor: '#f0f0f0',
    fontWeight: 'bold',
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
  label: {
    fontSize: 8,
    color: '#666',
  },
  value: {
    fontSize: 9,
  }
});

const gradingScale = [
  { range: '90 - 100', grade: 'A' },
  { range: '80 - 89', grade: 'B' },
  { range: '70 - 79', grade: 'C' },
  { range: '60 - 69', grade: 'D' },
  { range: '59 - Below', grade: 'F' }
];

// Individual Transcript PDF Document
const TranscriptDocument = ({ transcript }) => (
  <Document>
    <Page size="LETTER" style={styles.page}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.schoolName}>{transcript.student.schoolName}</Text>
          <Text style={styles.subHeader}>OFFICIAL HIGH SCHOOL TRANSCRIPT</Text>
        </View>

        {/* Student Info Row 1 */}
        <View style={styles.studentInfoRow}>
          <View style={{ flex: 4 }}>
            <Text style={styles.label}>STUDENT NAME</Text>
            <Text style={styles.value}>{transcript.student.fullName}</Text>
          </View>
          <View style={{ flex: 2 }}>
            <Text style={styles.label}>GENDER</Text>
            <Text style={styles.value}>{transcript.student.gender || 'N/A'}</Text>
          </View>
          <View style={{ flex: 2 }}>
            <Text style={styles.label}>STUDENT ID</Text>
            <Text style={styles.value}>{transcript.student.studentId}</Text>
          </View>
          <View style={{ flex: 4 }}></View>
        </View>

        {/* School Info Row */}
        <View style={styles.studentInfoRow}>
          <View style={{ flex: 4 }}>
            <Text style={styles.label}>SCHOOL NAME</Text>
            <Text style={styles.value}>{transcript.student.schoolName}</Text>
          </View>
          <View style={{ flex: 8 }}></View>
        </View>

        {/* School Address */}
        <View style={styles.studentInfoRow}>
          <View style={{ flex: 6 }}>
            <Text style={styles.label}>SCHOOL ADDRESS</Text>
            <Text style={styles.value}>{transcript.student.schoolAddress}</Text>
          </View>
          <View style={{ flex: 6 }}></View>
        </View>

        {/* Academic Record Header */}
        <View style={styles.academicRecordHeader}>
          <Text>ACADEMIC RECORD</Text>
        </View>

        {/* Course Table */}
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={styles.courseTitle}>Course Title</Text>
            <Text style={styles.credits}>Credits</Text>
            <Text style={styles.grade}>Grade</Text>
          </View>
          {transcript.units.map((unit, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.courseTitle}>{unit.name}</Text>
              <Text style={styles.credits}>{unit.creditHours}</Text>
              <Text style={styles.grade}>{unit.grade}</Text>
            </View>
          ))}
        </View>

        {/* Academic Summary and Grading Scale */}
        <View style={styles.academicSummaryContainer}>
          <View style={styles.academicSummary}>
            <Text style={styles.sectionTitle}>ACADEMIC SUMMARY</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.label}>GPA</Text>
              <Text>{transcript.gpa.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.label}>Credits Earned</Text>
              <Text>{transcript.totalCreditHours}</Text>
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
            <Text style={styles.signature}>{transcript.student.principalName}</Text>
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

// Academic History PDF Document
const AcademicHistoryDocument = ({ history }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>Academic History Record</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.text}>Student Name: {history.transcripts[Object.keys(history.transcripts)[0]][0].student.fullName}</Text>
        <Text style={styles.text}>Student ID: {history.transcripts[Object.keys(history.transcripts)[0]][0].student.studentId}</Text>
        <Text style={styles.text}>School: {history.transcripts[Object.keys(history.transcripts)[0]][0].student.schoolName}</Text>
      </View>

      {Object.entries(history.transcripts).map(([year, transcripts]) => (
        <View key={year} style={styles.section}>
          <Text style={[styles.text, styles.bold]}>Academic Year: {year}</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={styles.tableCell}>Code</Text>
              <Text style={styles.tableCell}>Unit Name</Text>
              <Text style={styles.tableCell}>Grade</Text>
              <Text style={styles.tableCell}>Credit Hours</Text>
            </View>
            {transcripts.flatMap(transcript => 
              transcript.units.map((unit, index) => (
                <View key={`${year}-${index}`} style={styles.tableRow}>
                  <Text style={styles.tableCell}>{unit.code}</Text>
                  <Text style={styles.tableCell}>{unit.name}</Text>
                  <Text style={styles.tableCell}>{unit.grade}</Text>
                  <Text style={styles.tableCell}>{unit.creditHours}</Text>
                </View>
              ))
            )}
          </View>
        </View>
      ))}

      <View style={styles.summaryBox}>
        <Text style={[styles.text, styles.bold]}>Cumulative GPA: {history.summary.cumulativeGPA}</Text>
        <Text style={[styles.text, styles.bold]}>Total Credits Earned: {history.summary.totalCredits}</Text>
        <Text style={[styles.text, styles.bold]}>Years Completed: {history.summary.yearsCompleted}</Text>
      </View>
    </Page>
  </Document>
);

export { TranscriptDocument, AcademicHistoryDocument }; 