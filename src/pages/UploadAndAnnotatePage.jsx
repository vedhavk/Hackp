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
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Upload & Annotate
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Upload your own images and annotate them with custom labels
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button onClick={handleViewGallery} variant="outline">
              View Gallery
            </Button>
            {uploadedImage && (
              <Button
                onClick={handleNewUpload}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Upload New Image
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
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
    </DashboardLayout>
  );
};

export default UploadAndAnnotatePage;
