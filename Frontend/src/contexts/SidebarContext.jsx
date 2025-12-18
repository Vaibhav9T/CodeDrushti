import React, { createContext, useContext, useState, useEffect } from 'react';

const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsCollapsed(true); // Auto-collapse on mobile
      } else {
        // Load saved collapse state for desktop
        const savedState = localStorage.getItem('sidebarCollapsed');
        if (savedState !== null) {
          setIsCollapsed(JSON.parse(savedState));
        }
      }
    };

    const checkTablet = () => {
    const tablet = window.innerWidth >= 768 && window.innerWidth < 1024;
    setIsTablet(tablet);
  };
    checkTablet();
    checkMobile();

    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
   
  }, []);

  const toggleSidebar = (newState) => {
    setIsCollapsed(newState);
    if (!isMobile) {
      localStorage.setItem('sidebarCollapsed', JSON.stringify(newState));
    }
  };

  

  return (
    <SidebarContext.Provider value={{ isCollapsed, isMobile, toggleSidebar, isTablet }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within SidebarProvider');
  }
  return context;
};
