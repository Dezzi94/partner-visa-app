import React, { createContext, useContext, useState, useEffect } from 'react';

interface ProgressState {
  documents: {
    required: number;
    optional: number;
  };
  forms: {
    completed: number;
    total: number;
  };
  timeline: {
    milestones: number;
    recommended: number;
  };
  interview: {
    completed: number;
    total: number;
  };
}

interface ProgressContextType {
  progress: ProgressState;
  updateDocumentsProgress: (required: number, optional: number) => void;
  updateFormsProgress: (completed: number, total: number) => void;
  updateTimelineProgress: (milestones: number, recommended: number) => void;
  updateInterviewProgress: (completed: number, total: number) => void;
  calculateCategoryProgress: (category: keyof ProgressState) => number;
  calculateOverallProgress: () => number;
}

const initialProgress: ProgressState = {
  documents: {
    required: 0,
    optional: 0,
  },
  forms: {
    completed: 0,
    total: 0,
  },
  timeline: {
    milestones: 0,
    recommended: 0,
  },
  interview: {
    completed: 0,
    total: 0,
  },
};

const ProgressContext = createContext<ProgressContextType>({
  progress: initialProgress,
  updateDocumentsProgress: () => {},
  updateFormsProgress: () => {},
  updateTimelineProgress: () => {},
  updateInterviewProgress: () => {},
  calculateCategoryProgress: () => 0,
  calculateOverallProgress: () => 0,
});

export const useProgress = () => useContext(ProgressContext);

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [progress, setProgress] = useState<ProgressState>(() => {
    const savedProgress = localStorage.getItem('progress');
    return savedProgress ? JSON.parse(savedProgress) : initialProgress;
  });

  useEffect(() => {
    localStorage.setItem('progress', JSON.stringify(progress));
  }, [progress]);

  const updateDocumentsProgress = (required: number, optional: number) => {
    setProgress(prev => ({
      ...prev,
      documents: { required, optional },
    }));
  };

  const updateFormsProgress = (completed: number, total: number) => {
    setProgress(prev => ({
      ...prev,
      forms: { completed, total },
    }));
  };

  const updateTimelineProgress = (milestones: number, recommended: number) => {
    setProgress(prev => ({
      ...prev,
      timeline: { milestones, recommended },
    }));
  };

  const updateInterviewProgress = (completed: number, total: number) => {
    setProgress(prev => ({
      ...prev,
      interview: { completed, total },
    }));
  };

  const calculateCategoryProgress = (category: keyof ProgressState): number => {
    switch (category) {
      case 'documents':
        const totalDocs = progress.documents.required + progress.documents.optional;
        return totalDocs > 0 ? Math.round((progress.documents.required / totalDocs) * 100) : 0;
      case 'forms':
        return progress.forms.total > 0 ? Math.round((progress.forms.completed / progress.forms.total) * 100) : 0;
      case 'timeline':
        return progress.timeline.recommended > 0 ? Math.round((progress.timeline.milestones / progress.timeline.recommended) * 100) : 0;
      case 'interview':
        return progress.interview.total > 0 ? Math.round((progress.interview.completed / progress.interview.total) * 100) : 0;
      default:
        return 0;
    }
  };

  const calculateOverallProgress = (): number => {
    const categories = Object.keys(progress) as Array<keyof ProgressState>;
    const totalProgress = categories.reduce((sum, category) => sum + calculateCategoryProgress(category), 0);
    return Math.round(totalProgress / categories.length);
  };

  return (
    <ProgressContext.Provider
      value={{
        progress,
        updateDocumentsProgress,
        updateFormsProgress,
        updateTimelineProgress,
        updateInterviewProgress,
        calculateCategoryProgress,
        calculateOverallProgress,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
};

export default ProgressContext; 