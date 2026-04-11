import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../utils/firebase';
import { onAuthStateChanged } from 'firebase/auth';

const CodeHistoryContext = createContext();

export const useCodeHistory = () => useContext(CodeHistoryContext);

export const CodeHistoryProvider = ({ children }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  // 1. Listen for User Authentication State
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (!user) {
        setReviews([]);
        setLoading(false);
      }
    });
    return () => unsubscribeAuth();
  }, []);

  // 2. Listen to Firestore in Real-Time for that specific user
  useEffect(() => {
    if (!currentUser) return;

    setLoading(true);
    
    const q = query(
      collection(db, 'reviews'),
      where('userId', '==', currentUser.uid),
      orderBy('timestamp', 'desc') // Show newest reviews first
    );

    const unsubscribeSnapshot = onSnapshot(q, (querySnapshot) => {
      const fetchedReviews = [];
      querySnapshot.forEach((doc) => {
        fetchedReviews.push({ id: doc.id, ...doc.data() });
      });
      setReviews(fetchedReviews);
      setLoading(false);
    }, (error) => {
      console.error("Firestore Query Error:", error.message);
      setLoading(false);
    });

    return () => unsubscribeSnapshot();
  }, [currentUser]);

  return (
    <CodeHistoryContext.Provider value={{ reviews, loading }}>
      {children}
    </CodeHistoryContext.Provider>
  );
};