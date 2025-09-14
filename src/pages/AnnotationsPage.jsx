import React, { useState, useEffect } from "react";
import { mockGallery } from "../utils/mockApi";
import { useToast } from "../contexts/ToastContext";
import DashboardLayout from "../components/DashboardLayout";
import ImageAnnotator from "../components/ImageAnnotator";
import { Card, Button, Skeleton, Modal } from "../components/ui";

const AnnotationsPage = () => {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAnnotator, setShowAnnotator] = useState(false);
  const [filter, setFilter] = useState("all"); // all, annotated, unannotated
  const { error: toastError, success: toastSuccess } = useToast();

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    try {
      setLoading(true);
      const response = await mockGallery.getImages(1, 50); // Load more images for annotation
      setImages(response.images);
    } catch (error) {
      toastError("Failed to load images");
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = (image) => {
    setSelectedImage(image);
    setShowAnnotator(true);
  };

  const handleAnnotationsChange = (imageId, newAnnotations) => {
    setImages((prev) =>
      prev.map((img) =>
        img.id === imageId ? { ...img, annotations: newAnnotations } : img
      )
    );
  };

  const filteredImages = images.filter((image) => {
    switch (filter) {
      case "annotated":
        return image.annotations && image.annotations.length > 0;
      case "unannotated":
        return !image.annotations || image.annotations.length === 0;
      default:
        return true;
    }
  });

  const stats = {
    total: images.length,
    annotated: images.filter(
      (img) => img.annotations && img.annotations.length > 0
    ).length,
    totalAnnotations: images.reduce(
      (sum, img) => sum + (img.annotations?.length || 0),
      0
    ),
  };

  const ImageCard = ({ image, onClick }) => (
    <Card
      padding="none"
      hover
      className="overflow-hidden cursor-pointer group"
      onClick={() => onClick(image)}
    >
      <div className="relative">
        <img
          src={image.thumbnail || image.url}
          alt={image.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Annotation status badge */}
        <div
          className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${
            image.annotations && image.annotations.length > 0
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
              : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
          }`}
        >
          {image.annotations?.length || 0} annotations
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-medium text-gray-900 dark:text-white truncate">
          {image.title}
        </h3>
        <div className="flex items-center justify-between mt-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            ID: {image.id}
          </span>
          <span
            className={`text-sm font-medium ${
              image.annotations && image.annotations.length > 0
                ? "text-green-600 dark:text-green-400"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            {image.annotations && image.annotations.length > 0
              ? "Annotated"
              : "Not annotated"}
          </span>
        </div>
      </div>
    </Card>
  );

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <Skeleton variant="text" width="200px" height="2rem" />
            <Skeleton variant="rectangular" width="150px" height="40px" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <Card key={index} padding="none" className="overflow-hidden">
                <Skeleton variant="rectangular" width="100%" height="192px" />
                <div className="p-4">
                  <Skeleton variant="text" width="80%" height="1rem" />
                  <Skeleton variant="text" width="60%" height="0.75rem" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Image Annotations
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Add and manage annotations on your images
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Images</option>
              <option value="annotated">Annotated Only</option>
              <option value="unannotated">Not Annotated</option>
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {stats.total}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Total Images
              </div>
            </div>
          </Card>

          <Card>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {stats.annotated}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Annotated Images
              </div>
            </div>
          </Card>

          <Card>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {stats.totalAnnotations}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Total Annotations
              </div>
            </div>
          </Card>
        </div>

        {/* Progress bar */}
        <Card>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Annotation Progress
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {stats.total > 0
                ? Math.round((stats.annotated / stats.total) * 100)
                : 0}
              %
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${
                  stats.total > 0 ? (stats.annotated / stats.total) * 100 : 0
                }%`,
              }}
            />
          </div>
        </Card>

        {/* Images grid */}
        {filteredImages.length === 0 ? (
          <div className="text-center py-12">
            <svg
              className="w-16 h-16 mx-auto mb-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No images found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {filter === "all"
                ? "No images available for annotation."
                : `No ${filter} images found.`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredImages.map((image) => (
              <ImageCard
                key={image.id}
                image={image}
                onClick={handleImageSelect}
              />
            ))}
          </div>
        )}

        {/* Annotation Modal */}
        {selectedImage && (
          <Modal
            isOpen={showAnnotator}
            onClose={() => {
              setShowAnnotator(false);
              setSelectedImage(null);
            }}
            title={`Annotate: ${selectedImage.title}`}
            size="4xl"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Current annotations: {selectedImage.annotations?.length || 0}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowAnnotator(false);
                    setSelectedImage(null);
                  }}
                >
                  Done
                </Button>
              </div>

              <div className="max-h-[70vh] overflow-auto">
                <ImageAnnotator
                  image={selectedImage}
                  annotations={selectedImage.annotations || []}
                  onAnnotationsChange={(newAnnotations) => {
                    handleAnnotationsChange(selectedImage.id, newAnnotations);
                    setSelectedImage((prev) => ({
                      ...prev,
                      annotations: newAnnotations,
                    }));
                  }}
                />
              </div>

              <div className="text-sm text-gray-500 dark:text-gray-400 border-t pt-4">
                <strong>Instructions:</strong> Click and drag to create
                rectangular annotations. Click on existing annotations to edit
                or delete them.
              </div>
            </div>
          </Modal>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AnnotationsPage;
