import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Svg,
  Path,
  Image,
} from "@react-pdf/renderer";

// Register fonts - using monospace fonts to match the typewriter style in the original
Font.register({
  family: "Courier",
  src: "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf",
});

Font.register({
  family: "Courier-Bold",
  src: "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Bold.ttf",
});

// Create styles for PDF
const styles = StyleSheet.create({
  page: {
    padding: 0,
    fontFamily: "Courier",
    position: "relative",
    backgroundColor: "white",
  },
  blueBorder: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: 10,
    borderColor: "#0c3b87", // Darker blue to match image
    zIndex: 1,
  },
  securityText: {
    position: "absolute",
    top: 5,
    left: 0,
    right: 0,
    textAlign: "center",
    color: "white",
    fontSize: 8,
    fontFamily: "Courier-Bold",
    transform: "rotate(180deg)",
    zIndex: 2,
  },
  securityTextBottom: {
    position: "absolute",
    bottom: 5,
    left: 0,
    right: 0,
    textAlign: "center",
    color: "white",
    fontSize: 8,
    fontFamily: "Courier-Bold",
    zIndex: 2,
  },
  securityTextLeft: {
    position: "absolute",
    top: "50%",
    left: -55,
    color: "white",
    fontSize: 8,
    fontFamily: "Courier-Bold",
    transform: "rotate(90deg)",
    zIndex: 2,
  },
  securityTextRight: {
    position: "absolute",
    top: "50%",
    right: -55,
    color: "white",
    fontSize: 8,
    fontFamily: "Courier-Bold",
    transform: "rotate(-90deg)",
    zIndex: 2,
  },
  container: {
    margin: 30,
    backgroundColor: "white", // White background to match image
    borderRadius: 10,
    overflow: "hidden",
    zIndex: 3,
    position: "relative",
  },
  watermark: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%) rotate(-45deg)",
    opacity: 0.08,
    zIndex: 0,
    textAlign: "center",
    fontSize: 60,
    color: "#888888",
    fontFamily: "Courier-Bold",
  },
  repeatingWatermark: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  smallWatermark: {
    fontSize: 20,
    color: "#888888",
    opacity: 0.05,
    fontFamily: "Courier-Bold",
  },
  universityLogoWatermark: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    opacity: 0.05,
    zIndex: -10,
    width: 300,
    height: 300,
  },
  pageNumber: {
    position: "absolute",
    top: 30,
    right: 30,
    fontSize: 10,
    fontFamily: "Courier",
    zIndex: 5,
  },
  contentContainer: {
    backgroundColor: "white",
    margin: 10,
    borderRadius: 5,
    overflow: "hidden",
    zIndex: 4,
    position: "relative",
  },
  header: {
    padding: 15,
    borderBottom: "1pt solid #cccccc",
  },
  schoolInfo: {
    marginBottom: 5,
  },
  schoolName: {
    fontSize: 16,
    fontFamily: "Courier-Bold",
    marginBottom: 2,
    // color: "#c41e3a", // University red color to match
    color: "#000000",
  },
  schoolAddress: {
    fontSize: 10,
    marginBottom: 2,
    // color: "#c41e3a", // University red color to match image
    color: "#000000",
  },
  studentAddress: {
    fontSize: 10,
    marginBottom: 2,
    // color: "#c41e3a", // University red color to match image
    color: "#000000",
  },
  studentInfoBox: {
    position: "absolute",
    top: 15,
    right: 15,
    width: 240,
    padding: 5,
  },
  studentInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 8,
    marginBottom: 2,
  },
  logoContainer: {
    position: "absolute",
    top: 15,
    right: 15,
    width: 50,
    height: 50,
    zIndex: 4,
  },
  tableContainer: {
    marginTop: 10,
    marginHorizontal: 15,
    marginBottom: 10,
  },
  tableHeader: {
    flexDirection: "row",
    borderTop: "1pt solid #000",
    borderBottom: "1pt solid #000",
    borderLeft: "1pt solid #000",
    borderRight: "1pt solid #000",
    fontSize: 8,
    fontFamily: "Courier-Bold",
    backgroundColor: "#f8f9fa",
  },
  deptCol: {
    width: "8%",
    textAlign: "left",
    padding: 3,
    borderRight: "1pt solid #000",
  },
  courseNoCol: {
    width: "12%",
    textAlign: "left",
    padding: 3,
    borderRight: "1pt solid #000",
  },
  titleCol: {
    width: "40%",
    padding: 3,
    borderRight: "1pt solid #000",
    textAlign: "left",
  },
  unitsAttemptedCol: {
    width: "10%",
    textAlign: "center",
    padding: 3,
    borderRight: "1pt solid #000",
  },
  unitsEarnedCol: {
    width: "10%",
    textAlign: "center",
    padding: 3,
    borderRight: "1pt solid #000",
  },
  gradeCol: {
    width: "10%",
    textAlign: "left",
    padding: 3,
    borderRight: "1pt solid #000",
  },
  gradePointsCol: {
    width: "10%",
    textAlign: "center",
    padding: 3,
    textAlign: "left",
  },
  academicHeader: {
    textAlign: "center",
    marginTop: 10,
    marginBottom: 5,
    fontFamily: "Courier-Bold",
    fontSize: 10,
  },
  termHeader: {
    fontSize: 9,
    fontFamily: "Courier-Bold",
    marginTop: 5,
    marginBottom: 2,
  },
  courseRow: {
    flexDirection: "row",
    fontSize: 8,
  },
  courseCell: {
    padding: 4,
    overflow: "hidden",
  },
  totalRow: {
    flexDirection: "row",
    fontSize: 8,
    fontFamily: "Courier-Bold",
    marginTop: 2,
    marginBottom: 5,
  },
  footerContainer: {
    marginHorizontal: 15,
    marginBottom: 10,
  },
  signatureContainer: {
    flexDirection: "row",
    borderTop: "1pt solid #000",
    borderLeft: "1pt solid #000",
    borderRight: "1pt solid #000",
    borderBottom: "1pt solid #000",
    padding: 10,
    backgroundColor: "white",
    marginTop: 20,
  },
  signatureLeft: {
    width: "70%",
  },
  signatureRight: {
    width: "30%",
    alignItems: "center",
  },
  signatureLabel: {
    fontSize: 8,
    marginBottom: 20,
  },
  signatureLine: {
    width: 150,
    borderBottom: "0.5pt solid #000",
    position: "relative",
  },
  officialSealContainer: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 80,
    height: 80,
    zIndex: 5,
  },
  issuedToStudent: {
    // position: "absolute",
    // bottom: 70,
    // left: 15,
    color: "#c41e3a", // University red color
    fontSize: 14,
    fontFamily: "Courier-Bold",
    zIndex: 5,
  },
  signature: {
    // position: "absolute",
    // bottom: 40,
    // left: 60,
    zIndex: 5,
  },
  disclaimerContainer: {
    marginHorizontal: 15,
    marginBottom: 10,
  },
  disclaimerText: {
    fontSize: 7,
    fontStyle: "italic",
    textAlign: "center",
    backgroundColor: "transparent",
    padding: 5,
  },
  gradingScaleContainer: {
    marginHorizontal: 15,
    marginBottom: 10,
    borderTop: "1pt solid #cccccc",
    paddingTop: 5,
  },
  gradingScaleTitle: {
    fontSize: 8,
    fontFamily: "Courier-Bold",
    textAlign: "center",
    marginBottom: 3,
  },
  gradingScaleRow: {
    flexDirection: "row",
    justifyContent: "center",
    fontSize: 7,
  },
  gradingScaleItem: {
    marginHorizontal: 10,
  },
});

// PDF Document component
const TranscriptGenerator = ({ academicHistory }) => {
  // Get the latest transcript for student information
  const years = Object.keys(academicHistory.transcripts).sort((a, b) =>
    b.localeCompare(a)
  );
  const latestYear = years[0];
  const latestTranscript = academicHistory.transcripts[latestYear][0];

  // Transform transcripts into academic years format and track last valid values
  const lastValidValues = {
    gradeLevel: "",
    schoolName: "",
    schoolCode: "",
    schoolAddress: "",
    studentAddress: "",
    schoolPhone: "",
    principalName: "",
  };

  // Helper function to extract numeric grade level
  const getGradeLevel = (gradeStr) => {
    if (!gradeStr) return 0;
    const match = gradeStr.match(/\d+/);
    return match ? parseInt(match[0]) : 0;
  };

  const academicYears = years
    .map((year) => {
      const yearTranscripts = academicHistory.transcripts[year];
      const firstTranscript = yearTranscripts[0];

      // Update last valid values if current values are not N/A
      if (
        firstTranscript.student.gradeLevel &&
        firstTranscript.student.gradeLevel !== "N/A"
      ) {
        lastValidValues.gradeLevel = firstTranscript.student.gradeLevel;
      }
      if (
        firstTranscript.student.schoolName &&
        firstTranscript.student.schoolName !== "N/A"
      ) {
        lastValidValues.schoolName = firstTranscript.student.schoolName;
      }
      if (
        firstTranscript.student.schoolCode &&
        firstTranscript.student.schoolCode !== "N/A"
      ) {
        lastValidValues.schoolCode = firstTranscript.student.schoolCode;
      }
      if (
        firstTranscript.student.schoolAddress &&
        firstTranscript.student.schoolAddress !== "N/A"
      ) {
        lastValidValues.schoolAddress = firstTranscript.student.schoolAddress;
      }
      if (
        firstTranscript.student.studentAddress &&
        firstTranscript.student.studentAddress !== "N/A"
      ) {
        lastValidValues.studentAddress = firstTranscript.student.studentAddress;
      }
      if (
        firstTranscript.student.schoolPhone &&
        firstTranscript.student.schoolPhone !== "N/A"
      ) {
        lastValidValues.schoolPhone = firstTranscript.student.schoolPhone;
      }
      if (
        firstTranscript.student.principalName &&
        firstTranscript.student.principalName !== "N/A"
      ) {
        lastValidValues.principalName = firstTranscript.student.principalName;
      }

      return {
        year,
        gradeLevel:
          firstTranscript.student.gradeLevel === "N/A"
            ? lastValidValues.gradeLevel
            : firstTranscript.student.gradeLevel,
        courses: yearTranscripts.flatMap((transcript) =>
          transcript.units.map((unit) => ({
            code: unit.code,
            title: unit.name,
            credits: unit.creditHours,
            grade: unit.grade,
          }))
        ),
        totalCredits: yearTranscripts.reduce(
          (sum, t) => sum + t.totalCreditHours,
          0
        ),
        gpa: yearTranscripts[0].gpa.toFixed(2),
      };
    })
    .sort((a, b) => getGradeLevel(a.gradeLevel) - getGradeLevel(b.gradeLevel));

  // Prepare student info using last valid values for N/A fields
  const studentInfo = {
    name: latestTranscript.student.fullName,
    gender: latestTranscript.student.gender || "N/A",
    studentId: latestTranscript.student.studentId,
    schoolName:
      latestTranscript.student.schoolName === "N/A"
        ? lastValidValues.schoolName
        : latestTranscript.student.schoolName,
    schoolAddress:
      latestTranscript.student.schoolAddress === "N/A"
        ? lastValidValues.schoolAddress
        : latestTranscript.student.schoolAddress,
    studentAddress:
      latestTranscript.student.studentAddress === "N/A"
        ? lastValidValues.studentAddress
        : latestTranscript.student.studentAddress,
    principalName:
      latestTranscript.student.principalName === "N/A"
        ? lastValidValues.principalName
        : latestTranscript.student.principalName,
    cumulativeGPA: academicHistory.summary.cumulativeGPA,
  };

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        {/* Blue Border */}
        <View style={styles.blueBorder} />

        {/* Main Watermark */}
        <Text style={styles.watermark}>OFFICIAL TRANSCRIPT</Text>

        {/* Repeating Watermarks */}
        <View style={styles.repeatingWatermark}>
          {Array(10)
            .fill()
            .map((_, i) => (
              <View
                key={i}
                style={{
                  position: "absolute",
                  top: `${i * 10}%`,
                  left: "10%",
                  transform: "rotate(-45deg)",
                }}
              >
                <Text style={styles.smallWatermark}>OFFICIAL</Text>
              </View>
            ))}
          {Array(10)
            .fill()
            .map((_, i) => (
              <View
                key={i}
                style={{
                  position: "absolute",
                  top: `${i * 10}%`,
                  left: "60%",
                  transform: "rotate(-45deg)",
                }}
              >
                <Text style={styles.smallWatermark}>TRANSCRIPT</Text>
              </View>
            ))}
          {Array(10)
            .fill()
            .map((_, i) => (
              <View
                key={i}
                style={{
                  position: "absolute",
                  top: `${i * 10 + 5}%`,
                  left: "35%",
                  transform: "rotate(-45deg)",
                }}
              >
                <Text style={styles.smallWatermark}>VERIFIED</Text>
              </View>
            ))}
        </View>

        {/* Security Text on Borders */}
        <Text style={styles.securityText}>
          OFFICIAL SCHOOL TRANSCRIPT - SECURITY PAPER
        </Text>
        <Text style={styles.securityTextBottom}>
          OFFICIAL SCHOOL TRANSCRIPT - SECURITY PAPER
        </Text>
        <Text style={styles.securityTextLeft}>
          OFFICIAL SCHOOL TRANSCRIPT - SECURITY PAPER
        </Text>
        <Text style={styles.securityTextRight}>
          OFFICIAL SCHOOL TRANSCRIPT - SECURITY PAPER
        </Text>

        {/* Page Number */}
        <Text style={styles.pageNumber}>Page 1 of 1</Text>

        <View style={styles.container}>
          <View style={styles.contentContainer}>
            {/* Header Section */}
            <View style={styles.header}>
              <View style={styles.schoolInfo}>
                <Text style={styles.schoolName}>{studentInfo.schoolName}</Text>
                <Text style={styles.schoolAddress}>Registrar's Office</Text>
                <Text style={styles.schoolAddress}>
                  {studentInfo.schoolAddress}
                </Text>
              </View>

              {/* University Logo Watermark */}
              <Image
                src="https://png.pngtree.com/png-vector/20230306/ourmid/pngtree-scool-college-logo-victor-vector-png-image_6634445.png"
                style={styles.logoContainer}
              />

              {/* </View> */}

              {/* Student Info Box */}
              <View style={styles.studentInfoBox}>
                <View style={styles.studentInfoRow}>
                  <Text></Text>
                  <Text></Text>
                </View>
                <View style={styles.studentInfoRow}>
                  <Text></Text>
                  <Text></Text>
                </View>
                <View style={styles.studentInfoRow}>
                  <Text>Record Of: {studentInfo.name}</Text>
                </View>
                <View style={styles.studentInfoRow}>
                  <Text>Student ID: {studentInfo.studentId}</Text>
                </View>
                <View style={styles.studentInfoRow}>
                  <Text>Gender: {studentInfo.gender}</Text>
                </View>
                <View style={styles.studentInfoRow}>
                  <Text>Address: {studentInfo.studentAddress}</Text>
                </View>
              </View>
            </View>

            {/* Table Container */}
            <View style={styles.tableContainer}>
              {/* Academic Header */}
              <Text style={styles.academicHeader}>ACADEMIC HISTORY</Text>

              {/* Table Header */}
              <View style={styles.tableHeader}>
                <Text style={styles.courseNoCol}>Unit Code </Text>
                <Text style={styles.titleCol}>Unit Name</Text>
                <Text style={styles.gradeCol}>Grade</Text>
                <Text style={styles.gradePointsCol}>Credits</Text>
              </View>

              {/* Academic Records */}
              {academicYears.map((year, yearIndex) => (
                <View key={yearIndex}>
                  <Text style={styles.termHeader}>
                    {year.year} {year.gradeLevel}
                  </Text>

                  {year.courses.map((course, courseIndex) => (
                    <View key={courseIndex} style={styles.courseRow}>
                      <Text style={[styles.courseCell, { width: "12%" }]}>
                        {/* {course.title.substring(0, 8)} */}
                        {course.code}
                      </Text>
                      <Text style={[styles.courseCell, { width: "40%" }]}>
                        {course.title}
                      </Text>
                      <Text
                        style={[
                          styles.courseCell,
                          { width: "10%", textAlign: "left" },
                        ]}
                      >
                        {course.grade}
                      </Text>
                      <Text
                        style={[
                          styles.courseCell,
                          { width: "10%", textAlign: "center" },
                        ]}
                      >
                        {course.credits}
                      </Text>
                    </View>
                  ))}

                  <View style={styles.totalRow}>
                    <Text style={[styles.courseCell, { width: "12%" }]}></Text>
                    <Text style={[styles.courseCell, { width: "40%" }]}>
                      TOTALS
                    </Text>

                    <Text
                      style={[
                        styles.courseCell,
                        { width: "10%", textAlign: "left" },
                      ]}
                    >
                      {year.gpa}
                    </Text>
                    <Text
                      style={[
                        styles.courseCell,
                        { width: "10%", textAlign: "center" },
                      ]}
                    >
                      {year.totalCredits}
                    </Text>
                  </View>
                </View>
              ))}

              <View style={styles.totalRow}>
                <Text style={[styles.courseCell, { width: "12%" }]}></Text>
                <Text style={[styles.courseCell, { width: "40%" }]}>
                  CUMULATIVE TOTALS
                </Text>

                <Text
                  style={[
                    styles.courseCell,
                    { width: "10%", textAlign: "left" },
                  ]}
                >
                  {studentInfo.cumulativeGPA}
                </Text>
                <Text
                  style={[
                    styles.courseCell,
                    { width: "10%", textAlign: "center" },
                  ]}
                >
                  {academicHistory.summary.totalCredits}
                </Text>
              </View>
            </View>
          </View>

          <Image
            src="https://png.pngtree.com/png-vector/20230306/ourmid/pngtree-scool-college-logo-victor-vector-png-image_6634445.png"
            style={styles.universityLogoWatermark}
          />

          {/* Footer */}
          <View style={styles.footerContainer}>
            {/* Signature Section */}
            <View style={styles.signatureContainer}>
              <View style={styles.signatureLeft}>
                <Text style={styles.signatureLabel}>Registrar</Text>
                <View style={styles.signatureLine}>
                  {/* Signature will be overlaid here */}
                </View>
                {/* ISSUED TO STUDENT text */}
                <Text style={styles.issuedToStudent}>ISSUED TO STUDENT</Text>

                {/* Signature */}
                <View style={styles.signature}>
                  <Svg width={120} height={40} viewBox="0 0 120 40">
                    <Path
                      d="M10 20 C20 10, 30 30, 40 15 C50 5, 60 25, 70 15 C80 5, 90 20, 110 10"
                      stroke="#000"
                      strokeWidth={1}
                      fill="none"
                    />
                  </Svg>
                </View>
              </View>

              <View style={styles.signatureRight}>
                <Image
                  src="https://png.pngtree.com/png-vector/20230306/ourmid/pngtree-scool-college-logo-victor-vector-png-image_6634445.png"
                  style={{ width: 60, height: 60 }}
                />
              </View>
            </View>

            <View style={styles.gradingScaleContainer}>
              <Text style={styles.gradingScaleTitle}>GRADING SCALE</Text>
              <View style={styles.gradingScaleRow}>
                <Text style={styles.gradingScaleItem}>90 - 100 = A</Text>
                <Text style={styles.gradingScaleItem}>80 - 89 = B</Text>
                <Text style={styles.gradingScaleItem}>70 - 79 = C</Text>
                <Text style={styles.gradingScaleItem}>60 - 69 = D</Text>
                <Text style={styles.gradingScaleItem}>59 - Below = F</Text>
              </View>
            </View>
            {/* Disclaimer */}
            <View style={styles.disclaimerContainer}>
              <Text style={styles.disclaimerText}>
                Abbreviations: A-Excellent, B-Good, C-Average of grade,
                IN-Incomplete removed, IC-Incomplete changed
              </Text>
              <Text style={styles.disclaimerText}>
                AU-Repeated class, S-Satisfactory, NC-No petition, NR-No grade
                reported, CR-Credit toward Masters
              </Text>
              <Text style={styles.disclaimerText}>
                Degree, NC-No credit toward Masters Degree, P-Pass only, no
                credit received
              </Text>
              <Text style={styles.disclaimerText}>
                Student in in good standing unless otherwise indicated.
              </Text>
            </View>
            {/* Grading Scale */}
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default TranscriptGenerator;
