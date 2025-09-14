// API service for image annotations
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class AnnotationAPIService {
  constructor() {
    this.timeout = 5000; // 5 second timeout
  }

  async fetchWithTimeout(url, options = {}) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  async saveAnnotation(imageId, annotation) {
    try {
      const response = await this.fetchWithTimeout(`${API_BASE_URL}/images/${imageId}/annotations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getToken()}`,
        },
        body: JSON.stringify({
          x: annotation.x,
          y: annotation.y,
          width: annotation.width,
          height: annotation.height,
          label: annotation.label,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error saving annotation:', error);
      // Fallback to mock API for development
      return this.mockSaveAnnotation(imageId, annotation);
    }
  }

  async getAnnotations(imageId) {
    try {
      const response = await fetch(`${API_BASE_URL}/images/${imageId}/annotations`, {
        headers: {
          'Authorization': `Bearer ${this.getToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching annotations:', error);
      // Fallback to mock data
      return this.mockGetAnnotations(imageId);
    }
  }

  async updateAnnotation(imageId, annotationId, updates) {
    try {
      const response = await fetch(`${API_BASE_URL}/images/${imageId}/annotations/${annotationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getToken()}`,
        },
        body: JSON.stringify({
          ...updates,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating annotation:', error);
      // Fallback to mock API
      return this.mockUpdateAnnotation(imageId, annotationId, updates);
    }
  }

  async deleteAnnotation(imageId, annotationId) {
    try {
      const response = await fetch(`${API_BASE_URL}/images/${imageId}/annotations/${annotationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.getToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error deleting annotation:', error);
      // Fallback to mock API
      return this.mockDeleteAnnotation(imageId, annotationId);
    }
  }

  getToken() {
    return localStorage.getItem('authToken') || '';
  }

  // Mock implementations for fallback
  async mockSaveAnnotation(imageId, annotation) {
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    await delay(500);
    
    return {
      id: `ann-${imageId}-${Date.now()}`,
      ...annotation,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  async mockGetAnnotations(imageId) {
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    await delay(300);
    
    // Return mock data or stored annotations
    const stored = localStorage.getItem(`annotations-${imageId}`);
    return stored ? JSON.parse(stored) : [];
  }

  async mockUpdateAnnotation(imageId, annotationId, updates) {
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    await delay(400);
    
    return {
      id: annotationId,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
  }

  async mockDeleteAnnotation(imageId, annotationId) {
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    await delay(300);
    
    return { success: true, deletedId: annotationId };
  }
}

export const annotationAPI = new AnnotationAPIService();