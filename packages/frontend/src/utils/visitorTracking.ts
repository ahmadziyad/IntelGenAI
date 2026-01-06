// Visitor tracking utilities

const VISITOR_COUNT_KEY = 'portfolio-visitor-count';
const VISITOR_SESSION_KEY = 'portfolio-visited';
const VISITOR_LAST_VISIT_KEY = 'portfolio-last-visit';

export interface VisitorData {
  count: number;
  hasVisited: boolean;
  lastVisit: string | null;
  isNewVisitor: boolean;
}

export const getVisitorData = (): VisitorData => {
  const storedCount = localStorage.getItem(VISITOR_COUNT_KEY);
  const hasVisited = localStorage.getItem(VISITOR_SESSION_KEY) === 'true';
  const lastVisit = localStorage.getItem(VISITOR_LAST_VISIT_KEY);
  
  const count = storedCount ? parseInt(storedCount, 10) : 1110;
  const isNewVisitor = !hasVisited;
  
  return {
    count,
    hasVisited,
    lastVisit,
    isNewVisitor
  };
};

export const incrementVisitorCount = (): number => {
  const currentData = getVisitorData();
  const newCount = currentData.count + 1;
  
  localStorage.setItem(VISITOR_COUNT_KEY, newCount.toString());
  localStorage.setItem(VISITOR_SESSION_KEY, 'true');
  localStorage.setItem(VISITOR_LAST_VISIT_KEY, new Date().toISOString());
  
  return newCount;
};

export const initializeVisitorTracking = (): VisitorData => {
  const data = getVisitorData();
  
  if (data.isNewVisitor) {
    // New visitor - increment count
    const newCount = incrementVisitorCount();
    return {
      ...data,
      count: newCount,
      hasVisited: true,
      isNewVisitor: false,
      lastVisit: new Date().toISOString()
    };
  }
  
  // Returning visitor - update last visit time
  localStorage.setItem(VISITOR_LAST_VISIT_KEY, new Date().toISOString());
  
  return data;
};

export const simulateVisitorIncrement = (): number => {
  // Simulate other visitors (for demo purposes)
  const currentData = getVisitorData();
  const newCount = currentData.count + 1;
  
  localStorage.setItem(VISITOR_COUNT_KEY, newCount.toString());
  
  return newCount;
};

export const formatVisitorCount = (count: number): string => {
  // Display full number with comma separators
  return count.toLocaleString();
};

export const resetVisitorCount = (newCount: number = 1110): void => {
  localStorage.setItem(VISITOR_COUNT_KEY, newCount.toString());
  localStorage.removeItem(VISITOR_SESSION_KEY);
  localStorage.removeItem(VISITOR_LAST_VISIT_KEY);
};