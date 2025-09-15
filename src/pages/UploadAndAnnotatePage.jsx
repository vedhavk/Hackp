import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import ImageUpload from "../components/ImageUpload";
import ImageAnnotator from "../components/ImageAnnotator";
import { Card, Button } from "../components/ui";
import { mockUploadedImages, mockAnnotations } from "../utils/mockApi";
import { useToast } from "../contexts/ToastContext";

const UploadAndAnnotatePage = () => {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [annotations, setAnnotations] = useState([]);
  const [recentUploads, setRecentUploads] = useState([]);
  const navigate = useNavigate();
  const { success: toastSuccess, error: toastError } = useToast();

  useEffect(() => {
    loadRecentUploads();
  }, []);

  const loadRecentUploads = async () => {
    try {
      const uploads = await mockUploadedImages.getUploadedImages();
      setRecentUploads(uploads.slice(0, 5)); // Show only 5 most recent
    } catch (error) {
      console.error("Failed to load recent uploads:", error);
    }
  };

  const handleImageUpload = async (imageData) => {
    try {
      await mockUploadedImages.saveImage(imageData);
      setUploadedImage(imageData);
      setAnnotations([]);
      toastSuccess("Image uploaded successfully! You can now annotate it.");
      await loadRecentUploads();
    } catch (error) {
      toastError("Failed to upload image");
    }
  };

  const handleAnnotationsChange = async (imageId, newAnnotations) => {
    setAnnotations(newAnnotations);
  };

  const handleSelectRecentImage = async (image) => {
    setUploadedImage(image);
    try {
      const imageAnnotations = await mockAnnotations.getAnnotations(image.id);
      setAnnotations(imageAnnotations);
    } catch (error) {
      console.error("Failed to load annotations:", error);
      setAnnotations([]);
    }
  };

  const handleNewUpload = () => {
    setUploadedImage(null);
    setAnnotations([]);
  };

  const handleViewGallery = () => {
    navigate("/gallery");
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="p-6 space-y-8">
          {/* Enhanced Header */}
          <div className="relative overflow-hidden rounded-3xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl shadow-xl shadow-gray-200/20 dark:shadow-gray-900/40 border border-white/20 dark:border-gray-700/50">
            <div className="absolute inset-0 bg-gradient-to-r from-green-600/5 via-blue-600/5 to-purple-600/5"></div>
            <div className="relative p-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="flex items-center space-x-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-600 via-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-green-800 to-blue-800 dark:from-white dark:via-green-200 dark:to-blue-200 bg-clip-text text-transparent">
                      Upload & Annotate
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 mt-2 font-light">
                      Upload your images and create intelligent annotations with
                      advanced labeling tools
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <Button onClick={handleViewGallery} variant="glass" size="lg">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    View Gallery
                  </Button>
                  {uploadedImage && (
                    <Button
                      onClick={handleNewUpload}
                      variant="success"
                      size="lg"
                    >
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      Upload New Image
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main content area */}
            <div className="lg:col-span-3">
              {!uploadedImage ? (
                <Card padding="lg">
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Upload Your Image
                  </h2>
                  <ImageUpload onImageUpload={handleImageUpload} />

                  {/* Instructions */}
                  <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                      How to annotate:
                    </h3>
                    <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                      <li>• Upload an image using the area above</li>
                      <li>
                        • Click and drag on the image to draw annotation boxes
                      </li>
                      <li>• Add labels to describe what you've annotated</li>
                      <li>• Your annotations are automatically saved</li>
                    </ul>
                  </div>
                </Card>
              ) : (
                <Card padding="none">
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                        Annotating: {uploadedImage.filename}
                      </h2>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {annotations.length} annotation
                        {annotations.length !== 1 ? "s" : ""}
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <ImageAnnotator
                      image={uploadedImage}
                      annotations={annotations}
                      onAnnotationsChange={handleAnnotationsChange}
                    />
                  </div>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card padding="lg">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Recent Uploads
                </h3>

                {recentUploads.length === 0 ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    No recent uploads yet
                  </p>
                ) : (
                  <div className="space-y-3">
                    {recentUploads.map((upload) => (
                      <div
                        key={upload.id}
                        className={`p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                          uploadedImage?.id === upload.id
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                            : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                        }`}
                        onClick={() => handleSelectRecentImage(upload)}
                      >
                        <div className="aspect-video rounded overflow-hidden mb-2">
                          <img
                            src={upload.url}
                            alt={upload.filename}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          <div className="font-medium truncate">
                            {upload.filename}
                          </div>
                          <div>
                            {new Date(upload.uploadedAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {recentUploads.length > 0 && (
                  <Button
                    onClick={handleViewGallery}
                    variant="outline"
                    className="w-full mt-4"
                  >
                    View All Uploads
                  </Button>
                )}
              </Card>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UploadAndAnnotatePage;
