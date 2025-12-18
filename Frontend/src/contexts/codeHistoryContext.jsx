import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../utils/firebase';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';

const CodeHistoryContext = createContext();

export const CodeHistoryProvider = ({ children }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUser = auth.currentUser;

  useEffect(() => {
    if (!currentUser) {
      setReviews([]);
      setLoading(false);
      return;
    }

    // Real-time listener: This runs automatically whenever the DB changes
    const q = query(
      collection(db, "reviews"),
      where("userId", "==", currentUser.uid),
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const reviewsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setReviews(reviewsData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching history:", error);
      setLoading(false);
    });

    // Cleanup listener when component unmounts
    return () => unsubscribe();
  }, [currentUser]);

  return (
    <CodeHistoryContext.Provider value={{ reviews, loading }}>
      {children}
    </CodeHistoryContext.Provider>
  );
};

// Custom hook to use it easily in other files
export const useCodeHistory = () => useContext(CodeHistoryContext);