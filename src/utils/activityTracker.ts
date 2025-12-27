// Activity Tracker - Records user interactions with presentations and quizzes

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  activity: 'presentation_entered' | 'pre_quiz_started' | 'post_quiz_started';
  presentationId: string;
  presentationName: string;
  timestamp: string;
  date: string;
  time: string;
}

const STORAGE_KEY = 'arecheoedu_activity_logs';

/**
 * Log user activity (presentation entry or quiz start)
 */
export const logActivity = (
  userId: string,
  userName: string,
  activity: ActivityLog['activity'],
  presentationId: string,
  presentationName: string
): ActivityLog => {
  const now = new Date();
  const log: ActivityLog = {
    id: `${userId}_${presentationId}_${activity}_${Date.now()}`,
    userId,
    userName,
    activity,
    presentationId,
    presentationName,
    timestamp: now.toISOString(),
    date: now.toISOString().split('T')[0],
    time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  };

  // Get existing logs
  const existingLogs = getAllActivityLogs();
  
  // Add new log
  existingLogs.push(log);
  
  // Save back to localStorage
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existingLogs));
  
  return log;
};

/**
 * Get all activity logs from localStorage
 */
export const getAllActivityLogs = (): ActivityLog[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error retrieving activity logs:', error);
    return [];
  }
};

/**
 * Get activity logs for a specific user
 */
export const getUserActivityLogs = (userId: string): ActivityLog[] => {
  const allLogs = getAllActivityLogs();
  return allLogs.filter(log => log.userId === userId);
};

/**
 * Get activity logs for a specific presentation
 */
export const getPresentationActivityLogs = (presentationId: string): ActivityLog[] => {
  const allLogs = getAllActivityLogs();
  return allLogs.filter(log => log.presentationId === presentationId);
};

/**
 * Get activity logs by type
 */
export const getActivityLogsByType = (activity: ActivityLog['activity']): ActivityLog[] => {
  const allLogs = getAllActivityLogs();
  return allLogs.filter(log => log.activity === activity);
};

/**
 * Get activity logs for a user on a specific date
 */
export const getUserActivityLogsByDate = (userId: string, date: string): ActivityLog[] => {
  const userLogs = getUserActivityLogs(userId);
  return userLogs.filter(log => log.date === date);
};

/**
 * Get statistics about activities
 */
export const getActivityStatistics = () => {
  const allLogs = getAllActivityLogs();
  
  return {
    totalActivities: allLogs.length,
    presentationsEntered: allLogs.filter(log => log.activity === 'presentation_entered').length,
    preQuizzesTaken: allLogs.filter(log => log.activity === 'pre_quiz_started').length,
    postQuizzesTaken: allLogs.filter(log => log.activity === 'post_quiz_started').length,
    uniqueUsers: new Set(allLogs.map(log => log.userId)).size,
    uniquePresentations: new Set(allLogs.map(log => log.presentationId)).size,
  };
};

/**
 * Clear all activity logs (admin only)
 */
export const clearAllActivityLogs = (): boolean => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing activity logs:', error);
    return false;
  }
};

/**
 * Export activity logs as JSON
 */
export const exportActivityLogs = (filename: string = 'activity_logs.json'): void => {
  const logs = getAllActivityLogs();
  const dataStr = JSON.stringify(logs, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
