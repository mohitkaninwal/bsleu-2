import { useState, useEffect, useCallback } from 'react';

interface UseFormPersistenceOptions {
  key: string;
  initialData: any;
  saveOnChange?: boolean;
  clearOnSubmit?: boolean;
}

export function useFormPersistence<T extends Record<string, any>>({
  key,
  initialData,
  saveOnChange = true,
  clearOnSubmit = true
}: UseFormPersistenceOptions) {
  // State to hold the current form data
  const [formData, setFormData] = useState<T>(initialData);
  
  // Flag to track if data was loaded from storage
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // Load data from localStorage on component mount
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(`form_${key}`);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        
        // Handle Date objects that were stringified
        const processedData = Object.keys(parsedData).reduce((acc, key) => {
          const value = parsedData[key];
          // Try to parse date strings back to Date objects
          if (typeof value === 'string' && key.toLowerCase().includes('date') && value.match(/^\d{4}-\d{2}-\d{2}T/)) {
            try {
              acc[key] = new Date(value);
            } catch {
              acc[key] = value;
            }
          } else {
            acc[key] = value;
          }
          return acc;
        }, {} as any);
        
        // Merge with initial data to ensure all required fields exist
        const mergedData = { ...initialData, ...processedData };
        setFormData(mergedData);
      }
    } catch (error) {
      console.warn(`Failed to load form data for key ${key}:`, error);
    } finally {
      setIsDataLoaded(true);
    }
  }, [key, initialData]);

  // Save data to localStorage whenever form data changes
  useEffect(() => {
    if (isDataLoaded && saveOnChange) {
      try {
        // Filter out File objects and undefined values before saving
        const dataToSave = Object.keys(formData).reduce((acc, key) => {
          const value = formData[key];
          // Skip File objects (for security) and undefined values
          if (value instanceof File || value === undefined) {
            return acc;
          }
          acc[key] = value;
          return acc;
        }, {} as any);
        
        localStorage.setItem(`form_${key}`, JSON.stringify(dataToSave));
      } catch (error) {
        console.warn(`Failed to save form data for key ${key}:`, error);
      }
    }
  }, [formData, key, saveOnChange, isDataLoaded]);

  // Function to update form data
  const updateFormData = useCallback((updates: Partial<T> | ((prevData: T) => Partial<T>)) => {
    setFormData(prevData => {
      if (typeof updates === 'function') {
        return { ...prevData, ...updates(prevData) };
      }
      return { ...prevData, ...updates };
    });
  }, []);

  // Function to update a single field
  const updateField = useCallback((fieldName: keyof T, value: any) => {
    setFormData(prevData => ({
      ...prevData,
      [fieldName]: value
    }));
  }, []);

  // Function to clear form data
  const clearFormData = useCallback(() => {
    try {
      localStorage.removeItem(`form_${key}`);
      setFormData(initialData);
    } catch (error) {
      console.warn(`Failed to clear form data for key ${key}:`, error);
    }
  }, [key, initialData]);

  // Function to manually save data
  const saveFormData = useCallback(() => {
    try {
      localStorage.setItem(`form_${key}`, JSON.stringify(formData));
    } catch (error) {
      console.warn(`Failed to save form data for key ${key}:`, error);
    }
  }, [key, formData]);

  // Function to handle form submission
  const handleSubmit = useCallback((onSubmit: (data: T) => void | Promise<void>) => {
    return async (e?: React.FormEvent) => {
      if (e) {
        e.preventDefault();
      }
      
      try {
        await onSubmit(formData);
        if (clearOnSubmit) {
          clearFormData();
        }
      } catch (error) {
        console.error('Form submission failed:', error);
        throw error;
      }
    };
  }, [formData, clearOnSubmit, clearFormData]);

  return {
    formData,
    updateFormData,
    updateField,
    clearFormData,
    saveFormData,
    handleSubmit,
    isDataLoaded
  };
}
