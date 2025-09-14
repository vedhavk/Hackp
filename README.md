# PhotoAnnotator 📸

A modern, responsive web application for image management, annotation, and gallery organization. Built with React, Vite, and Tailwind CSS, this platform provides a comprehensive solution for photo annotation and management needs.

## 🚀 Features

### 🔐 Authentication System

- **User Registration**: Create new accounts with secure validation
- **User Login**: Secure authentication with session management
- **Protected Routes**: Access control for authenticated users only
- **User Profiles**: Personalized user profile management

### 📁 Image Management

- **Image Upload**:
  - Drag & drop interface
  - Support for JPEG, PNG, GIF, WebP formats
  - File size validation (max 10MB)
  - Real-time upload progress
- **Gallery View**:
  - Grid and masonry layout options
  - Lazy loading for performance
  - Filter by uploaded/gallery images
  - Sort by newest, oldest, name, or annotation count
- **Image Modal**: Full-screen image viewing with navigation

### 🎯 Advanced Annotation System

- **Interactive Annotation**:
  - Click and drag to create annotation boxes
  - Real-time visual feedback
  - Custom label assignment
  - Edit and delete existing annotations
- **Annotation Management**:
  - Save annotations automatically
  - View annotation history
  - Export annotation data
  - Annotation statistics and analytics

### 📊 Dashboard & Analytics

- **Dashboard Overview**:
  - Total images count
  - Annotation statistics
  - Recent activity feed
  - Quick action buttons
- **Analytics Page**:
  - Upload trends and patterns
  - Annotation completion rates
  - Category breakdowns
  - Performance metrics
- **Activity Tracking**:
  - Real-time activity logging
  - Activity history
  - Activity-based navigation

### 🎨 User Experience

- **Dark/Light Theme**: Toggle between themes with system preference detection
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Toast Notifications**: Real-time feedback for user actions
- **Error Handling**: Comprehensive error boundaries and user-friendly error messages
- **Loading States**: Skeleton loaders and spinners for better UX

## 🛠️ Technology Stack

### Frontend

- **React 19.1.1**: Modern React with hooks and context
- **React Router DOM 7.9.1**: Client-side routing
- **Vite 7.1.2**: Fast build tool and development server
- **Tailwind CSS 3.4.1**: Utility-first CSS framework
- **PostCSS**: CSS processing and optimization

### Development Tools

- **ESLint**: Code linting and formatting
- **PropTypes**: Runtime type checking
- **Autoprefixer**: CSS vendor prefixing

## 📦 Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/vedhavk/Hackp.git
   cd hack
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Start development server**:

   ```bash
   npm run dev
   ```

4. **Build for production**:

   ```bash
   npm run build
   ```

5. **Preview production build**:
   ```bash
   npm run preview
   ```

## 🗂️ Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Basic UI components (Button, Card, Modal, etc.)
│   ├── DashboardLayout.jsx
│   ├── ImageAnnotator.jsx
│   ├── ImageModal.jsx
│   ├── ImageUpload.jsx
│   ├── LazyImage.jsx
│   └── ProtectedRoute.jsx
├── contexts/            # React Context providers
│   ├── AuthContext.jsx
│   ├── ThemeContext.jsx
│   └── ToastContext.jsx
├── hooks/               # Custom React hooks
│   ├── useIntersectionObserver.js
│   └── useToast.js
├── pages/               # Application pages/routes
│   ├── AnalyticsPage.jsx
│   ├── AnnotationsPage.jsx
│   ├── DashboardPage.jsx
│   ├── GalleryPage.jsx
│   ├── LoginPage.jsx
│   ├── ProfilePage.jsx
│   ├── RegisterPage.jsx
│   ├── SettingsPage.jsx
│   └── UploadAndAnnotatePage.jsx
├── services/            # API services
│   └── annotationAPI.js
├── utils/               # Utility functions
│   └── mockApi.js
├── assets/              # Static assets
└── App.jsx              # Main application component
```

## 🔧 Configuration Files

- **`tailwind.config.js`**: Tailwind CSS configuration
- **`vite.config.js`**: Vite build tool configuration
- **`eslint.config.js`**: ESLint linting rules
- **`postcss.config.js`**: PostCSS processing configuration

## 🎮 Usage Guide

### Getting Started

1. **Registration**: Create a new account or login with existing credentials
2. **Dashboard**: Access the main dashboard to see overview statistics
3. **Upload Images**: Use the upload page to add new images
4. **Annotation**: Click and drag on images to create annotation boxes
5. **Gallery**: Browse all images with filtering and sorting options

### Key Features Usage

#### Image Upload

- Navigate to "Upload & Annotate" page
- Drag and drop images or click to browse
- Supported formats: JPEG, PNG, GIF, WebP (max 10MB)
- Images are automatically saved and can be annotated immediately

#### Creating Annotations

- Select an image in the annotation interface
- Click and drag to create rectangular annotation boxes
- Add descriptive labels for each annotation
- Annotations are saved automatically

#### Gallery Management

- View all images in grid or masonry layout
- Filter by uploaded images or gallery images
- Sort by date, name, or annotation count
- Click on images for full-screen viewing

#### Analytics Dashboard

- Monitor upload trends and statistics
- View annotation completion rates
- Analyze category breakdowns
- Track activity patterns

## 🔑 Key Components

### Authentication

- **AuthContext**: Manages user authentication state
- **ProtectedRoute**: Ensures routes require authentication
- **Login/Register Pages**: User authentication interfaces

### Image Management

- **ImageUpload**: Drag-and-drop file upload with validation
- **LazyImage**: Performance-optimized image loading
- **ImageModal**: Full-screen image viewer with navigation

### Annotation System

- **ImageAnnotator**: Interactive annotation creation and editing
- **Annotation API**: Backend service for annotation persistence
- **Annotation Analytics**: Statistics and reporting

### UI Components

- **Responsive Design**: Mobile-first responsive layouts
- **Theme System**: Dark/light mode with system preference detection
- **Toast Notifications**: User feedback system
- **Error Boundaries**: Graceful error handling

## 🌟 Performance Features

- **Lazy Loading**: Images load only when needed
- **Optimized Builds**: Vite-powered fast builds and hot reload
- **Code Splitting**: Automatic code splitting for better performance
- **Responsive Images**: Optimized image loading for different screen sizes
- **Error Boundaries**: Prevents entire app crashes from component errors

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a Pull Request

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🐛 Known Issues

- Annotation persistence uses localStorage (consider backend integration for production)
- Mock API implementation (replace with real backend for production use)

## 🚀 Future Enhancements

- [ ] Backend API integration
- [ ] Real-time collaboration features
- [ ] Advanced annotation tools (polygons, circles)
- [ ] Batch processing capabilities
- [ ] Export/import functionality
- [ ] Advanced search and filtering
- [ ] User roles and permissions
- [ ] API documentation

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- **Vedha** - Initial work - [@vedhavk](https://github.com/vedhavk)

## 🙏 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- Vite team for the fast build tool
- All contributors and users of this project

---

**PhotoAnnotator** - Making image annotation simple, fast, and efficient! 🎨📸
