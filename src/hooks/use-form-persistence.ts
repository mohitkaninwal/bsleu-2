import { useState, useEffect, useCallback, useRef } from 'react';

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
  // Create a stable reference to initial data to prevent re-renders
  const initialDataRef = useRef(initialData);
  
  // State to hold the current form data - start with empty object to prevent controlled/uncontrolled switch
  const [formData, setFormData] = useState<T>(() => {
    // Try to load from localStorage immediately during initialization
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
        return { ...initialData, ...processedData };
      }
    } catch (error) {
      console.warn(`Failed to load form data for key ${key}:`, error);
    }
    
    return initialData;
  });
  
  // Flag to track if data was loaded from storage
  const [isDataLoaded, setIsDataLoaded] = useState(true); // Set to true since we load in useState

  // Update initial data reference if it changes (but don't reload from storage)
  useEffect(() => {
    initialDataRef.current = initialData;
  }, [initialData]);

  // Save data to localStorage with debouncing to prevent excessive saves
  useEffect(() => {
    if (isDataLoaded && saveOnChange) {
      const timeoutId = setTimeout(() => {
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
      }, 300); // Debounce for 300ms

      return () => clearTimeout(timeoutId);
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
      setFormData(initialDataRef.current);
    } catch (error) {
      console.warn(`Failed to clear form data for key ${key}:`, error);
    }
  }, [key]);

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
