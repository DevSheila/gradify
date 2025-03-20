import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

// Register fonts
Font.register({
  family: 'Times-Roman',
  src: 'https://cdn.jsdelivr.net/npm/@canvas-fonts/times-new-roman@1.0.4/Times%20New%20Roman.ttf',
});

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Times-Roman',
  },
  header: {
    marginBottom: 20,
  },
  schoolName: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 20,
  },
  studentInfo: {
    border: '1pt solid black',
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    borderBottom: '1pt solid black',
    fontSize: 10,
    padding: 4,
  },
  infoCell: {
    flex: 1,
    padding: '2 4',
  },
  infoLabel: {
    fontWeight: 'bold',
    marginRight: 4,
  },
  academicRecord: {
    marginTop: 20,
  },
  termGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  termBlock: {
    width: '48%',
    border: '1pt solid black',
    marginBottom: 10,
  },
  termHeader: {
    borderBottom: '1pt solid black',
    padding: 4,
    fontSize: 10,
  },
  courseRow: {
    flexDirection: 'row',
    borderBottom: '0.5pt solid black',
    fontSize: 9,
    padding: '2 4',
  },
  courseTitle: {
    flex: 2,
  },
  credits: {
    width: 50,
    textAlign: 'center',
  },
  grade: {
    width: 50,
    textAlign: 'center',
  },
  totals: {
    flexDirection: 'row',
    fontSize: 9,
    padding: '2 4',
  },
  footer: {
    flexDirection: 'row',
    marginTop: 20,
    borderTop: '1pt solid black',
    paddingTop: 10,
  },
  summary: {
    flex: 1,
    fontSize: 10,
  },
  gradingScale: {
    flex: 1,
    fontSize: 10,
  },
  signature: {
    marginTop: 20,
    fontSize: 10,
  },
});

const TranscriptPDF = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.schoolName}>{data.schoolName}</Text>
        <Text style={styles.subtitle}>OFFICIAL HIGH SCHOOL TRANSCRIPT</Text>
      </View>

      {/* Student Info */}
      <View style={styles.studentInfo}>
        <View style={styles.infoRow}>
          <View style={styles.infoCell}>
            <Text>
              <Text style={styles.infoLabel}>STUDENT NAME:</Text>
              {data.student.fullName}
            </Text>
          </View>
          <View style={styles.infoCell}>
            <Text>
              <Text style={styles.infoLabel}>DATE OF BIRTH:</Text>
              {data.student.dateOfBirth}
            </Text>
          </View>
          <View style={styles.infoCell}>
            <Text>
              <Text style={styles.infoLabel}>STUDENT ID:</Text>
              {data.student.id}
            </Text>
          </View>
        </View>
        <View style={styles.infoRow}>
          <View style={styles.infoCell}>
            <Text>
              <Text style={styles.infoLabel}>SCHOOL NAME:</Text>
              {data.schoolName}
            </Text>
          </View>
          <View style={styles.infoCell}>
            <Text>
              <Text style={styles.infoLabel}>TELEPHONE:</Text>
              {data.schoolPhone}
            </Text>
          </View>
        </View>
        <View style={[styles.infoRow, { borderBottom: 'none' }]}>
          <View style={styles.infoCell}>
            <Text>
              <Text style={styles.infoLabel}>SCHOOL ADDRESS:</Text>
              {data.schoolAddress}
            </Text>
          </View>
        </View>
      </View>

      {/* Academic Record */}
      <View style={styles.academicRecord}>
        <Text style={{ fontSize: 12, marginBottom: 10 }}>ACADEMIC RECORD</Text>
        <View style={styles.termGrid}>
          {data.terms.map((term, index) => (
            <View key={index} style={styles.termBlock}>
              <View style={styles.termHeader}>
                <Text>
                  SCHOOL YEAR: {term.year} GRADE LEVEL: {term.gradeLevel}
                </Text>
              </View>
              {term.courses.map((course, courseIndex) => (
                <View key={courseIndex} style={styles.courseRow}>
                  <Text style={styles.courseTitle}>{course.name}</Text>
                  <Text style={styles.credits}>{course.credits}</Text>
                  <Text style={styles.grade}>{course.grade}</Text>
                </View>
              ))}
              <View style={styles.totals}>
                <Text style={styles.courseTitle}>Total Credits: {term.totalCredits}</Text>
                <Text style={styles.credits}>GPA: {term.gpa}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.summary}>
          <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>ACADEMIC SUMMARY</Text>
          <Text>Cumulative GPA: {data.cumulativeGPA}</Text>
          <Text>Credits Earned: {data.totalCredits}</Text>
          <Text>Diploma Earned: {data.diplomaEarned ? 'Yes' : 'No'}</Text>
          <Text>Graduation Date: {data.graduationDate}</Text>
        </View>
        <View style={styles.gradingScale}>
          <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>GRADING SCALE</Text>
          <Text>90 - 100 = A</Text>
          <Text>80 - 89 = B</Text>
          <Text>70 - 79 = C</Text>
          <Text>60 - 69 = D</Text>
          <Text>59 - Below = F</Text>
        </View>
      </View>

      {/* Signature */}
      <View style={styles.signature}>
        <Text>SCHOOL PRINCIPAL'S SIGNATURE</Text>
        <Text style={{ marginTop: 20 }}>Date: {data.signatureDate}</Text>
      </View>
    </Page>
  </Document>
);

export default TranscriptPDF; 