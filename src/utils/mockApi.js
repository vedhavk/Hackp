// Mock API utilities with realistic delays and responses

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock user data stored in localStorage for persistence
const getStoredUsers = () => {
  const stored = localStorage.getItem("registeredUsers");
  return stored
    ? JSON.parse(stored)
    : [
        {
          id: 1,
          username: "admin",
          password: "password",
          name: "Admin User",
          email: "admin@example.com",
        },
        {
          id: 2,
          username: "user",
          password: "password",
          name: "Regular User",
          email: "user@example.com",
        },
      ];
};

const saveUsers = (users) => {
  localStorage.setItem("registeredUsers", JSON.stringify(users));
};

// Mock authentication API
export const mockAuth = {
  async login({ username, password }) {
    await delay(1000); // Simulate network delay

    const users = getStoredUsers();
    const user = users.find(
      (u) => u.username === username && u.password === password
    );

    if (!user) {
      throw new Error("Invalid username or password");
    }

    // Generate mock JWT token
    const token = `mock-jwt-token-${Date.now()}-${user.id}`;

    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
      },
    };
  },

  async register({ email, username, password }) {
    await delay(1500); // Simulate network delay

    const users = getStoredUsers();

    // Check if user already exists
    const existingUser = users.find(
      (u) => u.email === email || u.username === username
    );

    if (existingUser) {
      if (existingUser.email === email) {
        throw new Error("User with this email already exists");
      }
      if (existingUser.username === username) {
        throw new Error("Username already exists");
      }
    }

    // Create new user
    const newUser = {
      id: Math.max(...users.map((u) => u.id), 0) + 1,
      email,
      username,
      password,
      name: username, // Use username as default name
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    saveUsers(users);

    return {
      message: "Registration successful",
      user: {
        id: newUser.id,
        username: newUser.username,
        name: newUser.name,
        email: newUser.email,
      },
    };
  },

  async validateToken(token) {
    await delay(500);

    if (!token || !token.startsWith("mock-jwt-token-")) {
      throw new Error("Invalid token");
    }

    // Extract user ID from token
    const parts = token.split("-");
    const userId = parseInt(parts[parts.length - 1]);
    const users = getStoredUsers();
    const user = users.find((u) => u.id === userId);

    if (!user) {
      throw new Error("User not found");
    }

    return {
      id: user.id,
      username: user.username,
      name: user.name,
      email: user.email,
    };
  },
};

// Mock images data with localStorage persistence
const getStoredAnnotations = () => {
  const stored = localStorage.getItem("imageAnnotations");
  return stored ? JSON.parse(stored) : {};
};

const saveAnnotationsToStorage = (annotations) => {
  localStorage.setItem("imageAnnotations", JSON.stringify(annotations));
};

const mockImages = Array.from({ length: 20 }, (_, index) => {
  const seed = index + 1;
  const storedAnnotations = getStoredAnnotations();
  const imageId = index + 1;

  return {
    id: imageId,
    // Use deterministic Picsum URLs that will always return the same image
    url: `https://picsum.photos/id/${100 + seed}/800/600`,
    thumbnail: `https://picsum.photos/id/${100 + seed}/800/600`,
    title: `Image ${index + 1}`,
    annotations:
      storedAnnotations[imageId] ||
      (index % 3 === 0
        ? [
            {
              id: `ann-${index}-1`,
              x: 50,
              y: 50,
              width: 100,
              height: 80,
              label: `Annotation ${index + 1}-1`,
            },
          ]
        : []),
  };
});

// Mock gallery API
export const mockGallery = {
  async getImages(page = 1, limit = 10) {
    await delay(800);

    const start = (page - 1) * limit;
    const end = start + limit;
    const storedAnnotations = getStoredAnnotations();

    // Return images with persisted annotations
    const images = mockImages.slice(start, end).map((image) => ({
      ...image,
      annotations: storedAnnotations[image.id] || image.annotations || [],
    }));

    return {
      images,
      total: mockImages.length,
      page,
      totalPages: Math.ceil(mockImages.length / limit),
      hasMore: end < mockImages.length,
    };
  },

  async getImage(id) {
    await delay(500);

    const storedAnnotations = getStoredAnnotations();
    const imageId = parseInt(id);
    const image = mockImages.find((img) => img.id === imageId);
    if (!image) {
      throw new Error("Image not found");
    }

    // Return image with persisted annotations
    return {
      ...image,
      annotations: storedAnnotations[imageId] || image.annotations || [],
    };
  },
};

// Mock annotations API
export const mockAnnotations = {
  async saveAnnotation(imageId, annotation) {
    await delay(800);

    const image = mockImages.find((img) => img.id === parseInt(imageId));
    if (!image) {
      throw new Error("Image not found");
    }

    // Generate a more unique ID with higher precision timestamp and longer random string
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substr(2, 12);
    const uniqueId = `ann-${imageId}-${timestamp}-${randomString}`;

    const newAnnotation = {
      ...annotation,
      id: uniqueId,
      createdAt: new Date().toISOString(),
    };

    // Persist to localStorage for data persistence across refreshes
    const storedAnnotations = getStoredAnnotations();
    const imageIdNum = parseInt(imageId);
    if (!storedAnnotations[imageIdNum]) {
      storedAnnotations[imageIdNum] = [];
    }
    storedAnnotations[imageIdNum].push(newAnnotation);
    saveAnnotationsToStorage(storedAnnotations);

    return newAnnotation;
  },

  async updateAnnotation(imageId, annotationId, updates) {
    await delay(600);

    const storedAnnotations = getStoredAnnotations();
    const imageIdNum = parseInt(imageId);

    if (!storedAnnotations[imageIdNum]) {
      throw new Error("Image not found");
    }

    const annotationIndex = storedAnnotations[imageIdNum].findIndex(
      (ann) => ann.id === annotationId
    );
    if (annotationIndex === -1) {
      throw new Error("Annotation not found");
    }

    storedAnnotations[imageIdNum][annotationIndex] = {
      ...storedAnnotations[imageIdNum][annotationIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    saveAnnotationsToStorage(storedAnnotations);
    return storedAnnotations[imageIdNum][annotationIndex];
  },

  async deleteAnnotation(imageId, annotationId) {
    await delay(500);

    const storedAnnotations = getStoredAnnotations();
    const imageIdNum = parseInt(imageId);

    if (!storedAnnotations[imageIdNum]) {
      throw new Error("Image not found");
    }

    const annotationIndex = storedAnnotations[imageIdNum].findIndex(
      (ann) => ann.id === annotationId
    );
    if (annotationIndex === -1) {
      throw new Error("Annotation not found");
    }

    storedAnnotations[imageIdNum].splice(annotationIndex, 1);
    saveAnnotationsToStorage(storedAnnotations);
    return { success: true };
  },
};

// Generic API utilities
export const apiUtils = {
  getAuthHeaders() {
    const token = localStorage.getItem("authToken");
    return token ? { Authorization: `Bearer ${token}` } : {};
  },

  handleApiError(error) {
    console.error("API Error:", error);

    if (
      error.message.includes("token") ||
      error.message.includes("Unauthorized")
    ) {
      // Token expired or invalid
      localStorage.removeItem("authToken");
      window.location.href = "/login";
    }

    return error.message || "An unexpected error occurred";
  },
};
