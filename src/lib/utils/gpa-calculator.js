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
  'F': 0.0,
};

export const calculateGPA = (units) => {
  let totalPoints = 0;
  let totalHours = 0;

  units.forEach((unit) => {
    if (unit.grade && unit.creditHours) {
      const points = gradePoints[unit.grade];
      const hours = parseFloat(unit.creditHours);
      
      if (!isNaN(points) && !isNaN(hours)) {
        totalPoints += points * hours;
        totalHours += hours;
      }
    }
  });

  return {
    gpa: totalHours > 0 ? totalPoints / totalHours : 0,
    totalCreditHours: totalHours,
  };
}; 