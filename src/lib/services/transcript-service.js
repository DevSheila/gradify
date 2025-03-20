import { collection, addDoc, serverTimestamp, getDocs, query, orderBy, doc, deleteDoc, getDoc, updateDoc, where } from 'firebase/firestore';
import { db } from '../firebase';
import { calculateGPA } from '../validations/transcript';

export const createTranscript = async (data) => {
  try {
    const { gpa, totalCreditHours } = calculateGPA(data.units);

    const transcriptData = {
      ...data,
      gpa,
      totalCreditHours,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, 'transcripts'), transcriptData);
    return { id: docRef.id, ...transcriptData };
  } catch (error) {
    console.error('Error creating transcript:', error);
    throw new Error('Failed to create transcript');
  }
};

export const getTranscripts = async () => {
  try {
    const q = query(collection(db, 'transcripts'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    }));
  } catch (error) {
    console.error('Error fetching transcripts:', error);
    throw new Error('Failed to fetch transcripts');
  }
};

export async function deleteTranscript(transcriptId) {
  try {
    const transcriptRef = doc(db, 'transcripts', transcriptId);
    await deleteDoc(transcriptRef);
    return true;
  } catch (error) {
    console.error('Error deleting transcript:', error);
    throw new Error('Failed to delete transcript');
  }
}

export async function getTranscriptById(id) {
  try {
    const transcriptRef = doc(db, 'transcripts', id);
    const transcriptSnap = await getDoc(transcriptRef);
    
    if (!transcriptSnap.exists()) {
      throw new Error('Transcript not found');
    }

    const data = transcriptSnap.data();
    return {
      id: transcriptSnap.id,
      ...data,
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate(),
    };
  } catch (error) {
    console.error('Error fetching transcript:', error);
    throw new Error('Failed to fetch transcript');
  }
}

export async function updateTranscript(id, data) {
  try {
    const transcriptRef = doc(db, 'transcripts', id);
    
    // Calculate GPA and total credit hours
    const { gpa, totalCreditHours } = calculateGPA(data.units);
    
    // Prepare update data with calculated values
    const updateData = {
      ...data,
      gpa,
      totalCreditHours,
      updatedAt: serverTimestamp(),
    };

    // Log the update data for debugging
    console.log('Updating transcript with data:', updateData);

    await updateDoc(transcriptRef, updateData);
    return { id, ...updateData };
  } catch (error) {
    console.error('Error updating transcript:', error);
    throw new Error('Failed to update transcript');
  }
}

export const getStudentAcademicHistory = async (studentId) => {
  try {
    // Simplified query that only uses the where clause
    const q = query(
      collection(db, 'transcripts'),
      where('student.studentId', '==', studentId)
    );
    
    const querySnapshot = await getDocs(q);
    const transcripts = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    }));

    // Sort the results in memory instead of in the query
    transcripts.sort((a, b) => {
      // First sort by year in descending order
      const yearComparison = b.student.year.localeCompare(a.student.year);
      if (yearComparison !== 0) return yearComparison;
      
      // Then sort by createdAt in descending order
      return b.createdAt - a.createdAt;
    });

    // Group transcripts by academic year
    const academicHistory = transcripts.reduce((acc, transcript) => {
      const year = transcript.student.year;
      if (!acc[year]) {
        acc[year] = [];
      }
      acc[year].push(transcript);
      return acc;
    }, {});

    // Calculate cumulative GPA
    let totalPoints = 0;
    let totalCredits = 0;
    transcripts.forEach(transcript => {
      totalPoints += transcript.gpa * transcript.totalCreditHours;
      totalCredits += transcript.totalCreditHours;
    });

    const cumulativeGPA = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : 0;

    return {
      transcripts: academicHistory,
      summary: {
        totalCredits,
        cumulativeGPA,
        yearsCompleted: Object.keys(academicHistory).length,
      }
    };
  } catch (error) {
    console.error('Error fetching academic history:', error);
    throw new Error('Failed to fetch academic history');
  }
}; 