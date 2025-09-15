import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { mockGallery, mockUploadedImages } from "../utils/mockApi";
import { useToast } from "../contexts/ToastContext";
import DashboardLayout from "../components/DashboardLayout";
import LazyImage from "../components/LazyImage";
import ImageModal from "../components/ImageModal";
import { Card, Button, Skeleton, Spinner } from "../components/ui";

const GalleryPage = () => {
  const location = useLocation();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [viewMode, setViewMode] = useState("grid"); // grid, masonry
  const [sortBy, setSortBy] = useState("newest");
  const [filterBy, setFilterBy] = useState("all"); // all, uploaded, mock
  const { error: toastError, success: toastSuccess } = useToast();

  const loadImages = useCallback(
    async (page = 1, append = false) => {
      try {
        if (page === 1) {
          setLoading(true);
        } else {
          setLoadingMore(true);
        }

        const response = await mockGallery.getImages(page, 12);

        if (append) {
          setImages((prev) => [...prev, ...response.images]);
        } else {
          setImages(response.images);
        }

        setHasMore(response.hasMore);
        setCurrentPage(page);
      } catch (error) {
        toastError("Failed to load images");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [toastError]
  );

  useEffect(() => {
    loadImages(1);
  }, [loadImages]);

  // Reload images when filterBy changes
  useEffect(() => {
    loadImages(1);
  }, [filterBy, loadImages]);

  // Add a listener for storage changes to detect when images are uploaded
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "uploadedImages") {
        // New image was uploaded, reload the gallery
        loadImages(1);
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Also listen for custom events from same window (same-tab uploads/deletes)
    const handleImageUploaded = (e) => {
      loadImages(1);
    };

    const handleImageDeleted = (e) => {
      loadImages(1);
    };

    window.addEventListener("imageUploaded", handleImageUploaded);
    window.addEventListener("imageDeleted", handleImageDeleted);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("imageUploaded", handleImageUploaded);
      window.removeEventListener("imageDeleted", handleImageDeleted);
    };
  }, [loadImages]);

  // Filter and sort images
  const filteredAndSortedImages = useMemo(() => {
    let filtered = images;

    // Apply filter
    if (filterBy === "uploaded") {
      filtered = images.filter((img) => img.isUploaded);
    } else if (filterBy === "mock") {
      filtered = images.filter((img) => !img.isUploaded);
    }

    // Apply sort
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          if (a.uploadedAt && b.uploadedAt) {
            return new Date(b.uploadedAt) - new Date(a.uploadedAt);
          }
          // For mixed types, prioritize uploaded images (which have uploadedAt)
          if (a.uploadedAt && !b.uploadedAt) return -1;
          if (!a.uploadedAt && b.uploadedAt) return 1;
          // For same type, use ID comparison safely
          const aId =
            typeof a.id === "string" ? parseInt(a.id.split("_")[1]) || 0 : a.id;
          const bId =
            typeof b.id === "string" ? parseInt(b.id.split("_")[1]) || 0 : b.id;
          return bId - aId;
        case "oldest":
          if (a.uploadedAt && b.uploadedAt) {
            return new Date(a.uploadedAt) - new Date(b.uploadedAt);
          }
          // For mixed types, prioritize mock images (older)
          if (a.uploadedAt && !b.uploadedAt) return 1;
          if (!a.uploadedAt && b.uploadedAt) return -1;
          // For same type, use ID comparison safely
          const aIdOld =
            typeof a.id === "string" ? parseInt(a.id.split("_")[1]) || 0 : a.id;
          const bIdOld =
            typeof b.id === "string" ? parseInt(b.id.split("_")[1]) || 0 : b.id;
          return aIdOld - bIdOld;
        case "name":
          return a.title.localeCompare(b.title);
        case "annotated":
          return (b.annotations?.length || 0) - (a.annotations?.length || 0);
        default:
          return 0;
      }
    });
  }, [images, filterBy, sortBy]);

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      loadImages(currentPage + 1, true);
    }
  };

  const handleImageClick = (image, index) => {
    setSelectedImage({ image, index });
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  const handleModalIndexChange = (newIndex) => {
    if (newIndex >= 0 && newIndex < filteredAndSortedImages.length) {
      setSelectedImage({
        image: filteredAndSortedImages[newIndex],
        index: newIndex,
      });
    }
  };

  const handleDeleteImage = async (imageId, event) => {
    // Prevent the card click event from firing
    event.stopPropagation();

    if (
      !window.confirm(
        "Are you sure you want to delete this image? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await mockUploadedImages.deleteImage(imageId);

      // Remove the image from local state immediately for better UX
      setImages((prevImages) => prevImages.filter((img) => img.id !== imageId));

      // If the deleted image was selected in modal, close the modal
      if (selectedImage && selectedImage.image.id === imageId) {
        setSelectedImage(null);
      }

      toastSuccess("Image deleted successfully");

      // Reload images to ensure consistency
      loadImages(1);
    } catch (error) {
      toastError("Failed to delete image");
    }
  };

  const handleDeleteFromModal = async (imageId) => {
    try {
      await mockUploadedImages.deleteImage(imageId);

      // Remove the image from local state immediately for better UX
      setImages((prevImages) => prevImages.filter((img) => img.id !== imageId));

      // Close the modal since the current image was deleted
      setSelectedImage(null);

      toastSuccess("Image deleted successfully");

      // Reload images to ensure consistency
      loadImages(1);
    } catch (error) {
      toastError("Failed to delete image");
    }
  };

  const GridSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: 12 }).map((_, index) => (
        <Card key={index} padding="none" className="overflow-hidden">
          <Skeleton variant="rectangular" width="100%" height="200px" />
          <div className="p-3">
            <Skeleton variant="text" width="80%" height="1rem" />
            <Skeleton variant="text" width="60%" height="0.75rem" />
          </div>
        </Card>
      ))}
    </div>
  );

  const ImageCard = ({ image, index, onClick }) => (
    <Card
      padding="none"
      hover
      className="overflow-hidden cursor-pointer group animate-fade-in-up relative"
      onClick={() => onClick(image, index)}
    >
      <div className="relative">
        <LazyImage
          src={image.url}
          thumbnail={image.thumbnail}
          alt={image.title}
          aspectRatio="4/3"
          className="group-hover:scale-105 transition-transform duration-300"
        />

        {/* Overlay on hover */}
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
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          </div>
        </div>

        {/* Delete button for uploaded images */}
        {image.isUploaded && (
          <button
            onClick={(e) => handleDeleteImage(image.id, e)}
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300"
            title="Delete image"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        )}

        {/* Annotation count badge */}
        {image.annotations && image.annotations.length > 0 && (
          <div
            className={`absolute top-2 ${
              image.isUploaded ? "left-2" : "right-2"
            } bg-blue-600 text-white text-xs px-2 py-1 rounded-full`}
          >
            {image.annotations.length} annotation
            {image.annotations.length !== 1 ? "s" : ""}
          </div>
        )}

        {/* Uploaded image badge */}
        {image.isUploaded && (
          <div
            className={`absolute ${
              image.annotations && image.annotations.length > 0
                ? "bottom-2"
                : "top-2"
            } left-2 bg-green-600 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1`}
          >
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
            Uploaded
          </div>
        )}
      </div>

      <div className="p-3">
        <h3 className="font-medium text-gray-900 dark:text-white truncate">
          {image.title}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          ID: {image.id}
        </p>
      </div>
    </Card>
  );

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="p-6 space-y-8">
          {/* Enhanced Header */}
          <div className="relative overflow-hidden rounded-3xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl shadow-xl shadow-gray-200/20 dark:shadow-gray-900/40 border border-white/20 dark:border-gray-700/50">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-pink-600/5"></div>
            <div className="relative p-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
                    Photo Gallery
                  </h1>
                  <p className="text-lg text-gray-600 dark:text-gray-400 mt-2 font-light">
                    {loading
                      ? "Loading your collection..."
                      : `Discover and manage your ${filteredAndSortedImages.length} images`}
                  </p>
                </div>

                <div className="flex items-center space-x-4">
                  {/* Enhanced Filter dropdown */}
                  <div className="relative">
                    <select
                      value={filterBy}
                      onChange={(e) => setFilterBy(e.target.value)}
                      className="appearance-none px-4 py-3 pr-10 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm text-gray-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
                    >
                      <option value="all">All Images</option>
                      <option value="uploaded">Uploaded Only</option>
                      <option value="mock">Gallery Only</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Enhanced Sort dropdown */}
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="appearance-none px-4 py-3 pr-10 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm text-gray-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                      <option value="name">Name</option>
                      <option value="annotated">Most Annotated</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Refresh Button */}
                  <button
                    onClick={() => loadImages(1)}
                    disabled={loading}
                    className="px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Refresh Gallery"
                  >
                    <svg
                      className={`w-5 h-5 ${loading ? "animate-spin" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                  </button>

                  {/* Enhanced View mode toggle */}
                  <div className="flex border-2 border-gray-200 dark:border-gray-600 rounded-xl overflow-hidden shadow-lg backdrop-blur-sm bg-white/50 dark:bg-gray-700/50">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`px-4 py-3 text-sm font-semibold transition-all duration-300 ${
                        viewMode === "grid"
                          ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg"
                          : "bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                      }`}
                      title="Grid View"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => setViewMode("masonry")}
                      className={`px-4 py-3 text-sm font-semibold transition-all duration-300 ${
                        viewMode === "masonry"
                          ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg"
                          : "bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                      }`}
                      title="Masonry View"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Gallery */}
          {loading ? (
            <GridSkeleton />
          ) : images.length === 0 ? (
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
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No images found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Upload some images to get started.
              </p>
            </div>
          ) : (
            <>
              <div
                className={`grid gap-4 ${
                  viewMode === "grid"
                    ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                    : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                }`}
              >
                {filteredAndSortedImages.map((image, index) => (
                  <ImageCard
                    key={image.id}
                    image={image}
                    index={index}
                    onClick={handleImageClick}
                  />
                ))}
              </div>

              {/* Load more button */}
              {hasMore && (
                <div className="flex justify-center mt-8">
                  <Button
                    onClick={handleLoadMore}
                    loading={loadingMore}
                    disabled={loadingMore}
                    size="lg"
                  >
                    {loadingMore ? (
                      <>
                        <Spinner size="sm" className="mr-2" />
                        Loading more...
                      </>
                    ) : (
                      "Load More Images"
                    )}
                  </Button>
                </div>
              )}
            </>
          )}

          {/* Image Modal */}
          {selectedImage && (
            <ImageModal
              isOpen={true}
              onClose={handleCloseModal}
              images={filteredAndSortedImages}
              currentIndex={selectedImage.index}
              onIndexChange={handleModalIndexChange}
              onDelete={handleDeleteFromModal}
            />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default GalleryPage;
