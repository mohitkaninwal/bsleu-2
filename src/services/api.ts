// API Service for BSLEU Exam Booking Platform

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
  (import.meta.env.MODE === 'production' 
    ? 'https://bsleu-backend.onrender.com/api'  // Your deployed backend
    : 'http://localhost:5000/api');

// Types
export interface User {
  id: string;
  familyName: string;
  firstName: string;
  email: string;
  telephone: string;
  dateOfBirth: string;
  birthPlace: string;
  countryOfBirth: string;
  nativeLanguage: string;
  gender: string;
  placeOfResidence: string;
  countryOfResidence: string;
  role: string;
  isVerified: boolean;
  isActive: boolean;
}

export interface RegistrationData {
  familyName: string;
  firstName: string;
  email: string;
  password: string;
  telephone: string;
  dateOfBirth: string;
  birthPlace: string;
  countryOfBirth: string;
  nativeLanguage: string;
  gender: string;
  placeOfResidence: string;
  countryOfResidence: string;
}

export interface BookingData {
  scheduleId: number;
  examLevel: string;
  examType: 'full' | 'partial';
  partialComponent?: 'written' | 'oral';
}

export interface Document {
  id: number;
  documentType: 'passport_front' | 'passport_back' | 'passport_photo' | 'telc_certificate';
  originalName: string;
  verificationStatus: 'pending' | 'approved' | 'rejected';
  uploadedAt: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  user?: User;
  booking?: any;
  document?: Document;
  accessToken?: string;
  refreshToken?: string;
}

// API Helper Functions
const getAuthHeaders = () => {
  const token = localStorage.getItem('accessToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Enhanced fetch with timeout and better error handling for production
const fetchWithTimeout = async (url: string, options: RequestInit = {}, timeout = 30000) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timed out. Please check your connection and try again.');
    }
    throw error;
  }
};

const handleResponse = async (response: Response): Promise<ApiResponse> => {
  let data: ApiResponse;
  try {
    data = await response.json();
  } catch {
    data = { success: false, message: 'API request failed' } as ApiResponse;
  }
  // Do not throw on non-2xx; return structured response so UI can display errors
  return data;
};

// Authentication APIs
export const authAPI = {
  register: async (userData: RegistrationData): Promise<ApiResponse> => {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(userData),
      }, 45000); // Longer timeout for registration

      // Attempt to parse JSON regardless of status
      let data: ApiResponse;
      try {
        data = await response.json();
      } catch {
        data = { success: false, message: 'Registration failed' } as ApiResponse;
      }

      if (!response.ok) {
        // Return server-provided error without throwing so UI can show it
        return data;
      }

      // Store tokens if registration successful
      if (data.success && data.accessToken) {
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken || '');
      }

      return data;
    } catch (error) {
      // Network or CORS error
      throw error;
    }
  },

  login: async (email: string, password: string): Promise<ApiResponse> => {
    const response = await fetchWithTimeout(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ email, password }),
    });
    
    const result = await handleResponse(response);
    
    // Store tokens if login successful
    if (result.success && result.accessToken) {
      localStorage.setItem('accessToken', result.accessToken);
      localStorage.setItem('refreshToken', result.refreshToken || '');
    }
    
    return result;
  },

  logout: async (): Promise<void> => {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  },

  getCurrentUser: async (): Promise<ApiResponse> => {
    const response = await fetch(`${API_BASE_URL}/users/me`, {
      headers: getAuthHeaders(),
    });
    
    return handleResponse(response);
  },
};

// Booking APIs
export const bookingAPI = {
  createBooking: async (bookingData: BookingData): Promise<ApiResponse> => {
    const response = await fetch(`${API_BASE_URL}/bookings`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(bookingData),
    });
    
    return handleResponse(response);
  },

  downloadReceipt: async (bookingId: number): Promise<Blob> => {
    const token = localStorage.getItem('accessToken');
    const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}/receipt`, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
    if (!response.ok) {
      throw new Error('Failed to download receipt');
    }
    return await response.blob();
  },

  getUserBookings: async (): Promise<ApiResponse> => {
    const response = await fetch(`${API_BASE_URL}/users/me/bookings`, {
      headers: getAuthHeaders(),
    });
    
    return handleResponse(response);
  },

  getBookingById: async (bookingId: string): Promise<ApiResponse> => {
    const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}`, {
      headers: getAuthHeaders(),
    });
    
    return handleResponse(response);
  },
};

// Document APIs
export const documentAPI = {
  uploadDocument: async (
    file: File, 
    documentType: 'passport_front' | 'passport_back' | 'passport_photo' | 'telc_certificate',
    bookingId?: number
  ): Promise<ApiResponse> => {
    const formData = new FormData();
    formData.append('document', file);
    formData.append('documentType', documentType);
    if (bookingId) {
      formData.append('bookingId', bookingId.toString());
    }

    const token = localStorage.getItem('accessToken');
    const response = await fetch(`${API_BASE_URL}/documents/upload`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });
    
    return handleResponse(response);
  },

  getUserDocuments: async (): Promise<ApiResponse> => {
    const response = await fetch(`${API_BASE_URL}/documents/user`, {
      headers: getAuthHeaders(),
    });
    
    return handleResponse(response);
  },
};

// Schedule APIs
export const scheduleAPI = {
  getAvailableSchedules: async (params?: { level?: string; type?: string; date?: string }): Promise<ApiResponse> => {
    const query = params
      ? `?${new URLSearchParams({
          ...(params.level ? { level: params.level } : {}),
          ...(params.type ? { type: params.type } : {}),
          ...(params.date ? { date: params.date } : {}),
        }).toString()}`
      : '';
    const response = await fetch(`${API_BASE_URL}/schedules${query}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  createSchedule: async (payload: {
    examDate: string;
    examTime: 'morning' | 'evening';
    examLevel: string;
    examType: string;
    totalSlots: number;
  }): Promise<ApiResponse> => {
    const response = await fetch(`${API_BASE_URL}/schedules`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    return handleResponse(response);
  },

  updateSchedule: async (id: number, payload: Partial<{ examDate: string; examTime: 'morning'|'evening'; examLevel: string; examType: string; totalSlots: number; isActive: boolean }>): Promise<ApiResponse> => {
    const response = await fetch(`${API_BASE_URL}/schedules/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    return handleResponse(response);
  },

  deleteSchedule: async (id: number): Promise<ApiResponse> => {
    const response = await fetch(`${API_BASE_URL}/schedules/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};

// Payment APIs
export const paymentAPI = {
  createOrder: async (bookingId: number): Promise<ApiResponse> => {
    const response = await fetch(`${API_BASE_URL}/payments/create-order`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ bookingId }),
    });
    
    return handleResponse(response);
  },

  verifyPayment: async (paymentData: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    bookingId: number;
  }): Promise<ApiResponse> => {
    const response = await fetch(`${API_BASE_URL}/payments/verify`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(paymentData),
    });
    
    return handleResponse(response);
  },
};

// Admin APIs (for admin panel)
export const adminAPI = {
  getAllUsers: async (): Promise<ApiResponse> => {
    const response = await fetch(`${API_BASE_URL}/admin/users`, {
      headers: getAuthHeaders(),
    });
    
    return handleResponse(response);
  },

  getAllBookings: async (): Promise<ApiResponse> => {
    const response = await fetch(`${API_BASE_URL}/admin/bookings`, {
      headers: getAuthHeaders(),
    });
    
    return handleResponse(response);
  },

  getDashboardStats: async (): Promise<ApiResponse> => {
    const response = await fetch(`${API_BASE_URL}/admin/stats`, {
      headers: getAuthHeaders(),
    });
    
    return handleResponse(response);
  },
};

// Utility function to check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('accessToken');
};

// Utility function to get current user from localStorage
export const getCurrentUserFromStorage = (): User | null => {
  const userStr = localStorage.getItem('currentUser');
  return userStr ? JSON.parse(userStr) : null;
};

// Utility function to save current user to localStorage
export const saveCurrentUserToStorage = (user: User): void => {
  localStorage.setItem('currentUser', JSON.stringify(user));
};
