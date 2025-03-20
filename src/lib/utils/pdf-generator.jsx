import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#fff',
    padding: 30,
  },
  header: {
    marginBottom: 20,
    textAlign: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
  },
  section: {
    margin: 10,
    padding: 10,
  },
  table: {
    display: 'table',
    width: 'auto',
    marginVertical: 10,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    borderBottomStyle: 'solid',
    alignItems: 'center',
    minHeight: 24,
  },
  tableHeader: {
    backgroundColor: '#f0f0f0',
  },
  tableCell: {
    flex: 1,
    padding: 5,
  },
  summaryBox: {
    marginTop: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#000',
  },
  text: {
    fontSize: 12,
    marginBottom: 5,
  },
  bold: {
    fontWeight: 'bold',
  },
});

// Individual Transcript PDF Document
const TranscriptDocument = ({ transcript }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>{transcript.student.schoolName}</Text>
        <Text style={styles.subtitle}>Official Academic Transcript</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.text}>Student Name: {transcript.student.fullName}</Text>
        <Text style={styles.text}>Student ID: {transcript.student.studentId}</Text>
        <Text style={styles.text}>Grade Level: {transcript.student.gradeLevel}</Text>
        <Text style={styles.text}>Academic Year: {transcript.student.year}</Text>
      </View>

      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={styles.tableCell}>Code</Text>
          <Text style={styles.tableCell}>Unit Name</Text>
          <Text style={styles.tableCell}>Grade</Text>
          <Text style={styles.tableCell}>Credit Hours</Text>
        </View>
        {transcript.units.map((unit, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={styles.tableCell}>{unit.code}</Text>
            <Text style={styles.tableCell}>{unit.name}</Text>
            <Text style={styles.tableCell}>{unit.grade}</Text>
            <Text style={styles.tableCell}>{unit.creditHours}</Text>
          </View>
        ))}
      </View>

      <View style={styles.summaryBox}>
        <Text style={[styles.text, styles.bold]}>GPA: {transcript.gpa.toFixed(2)}</Text>
        <Text style={[styles.text, styles.bold]}>Total Credit Hours: {transcript.totalCreditHours}</Text>
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