import React, { useState, useEffect, useCallback } from "react";
import { mockGallery } from "../utils/mockApi";
import { useToast } from "../contexts/ToastContext";
import DashboardLayout from "../components/DashboardLayout";
import LazyImage from "../components/LazyImage";
import ImageModal from "../components/ImageModal";
import { Card, Button, Skeleton, Spinner } from "../components/ui";

const GalleryPage = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [viewMode, setViewMode] = useState("grid"); // grid, masonry
  const [sortBy, setSortBy] = useState("newest");
  const { error: toastError } = useToast();

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
    if (newIndex >= 0 && newIndex < images.length) {
      setSelectedImage({ image: images[newIndex], index: newIndex });
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
      className="overflow-hidden cursor-pointer group animate-fade-in-up"
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

        {/* Annotation count badge */}
        {image.annotations && image.annotations.length > 0 && (
          <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
            {image.annotations.length} annotation
            {image.annotations.length !== 1 ? "s" : ""}
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
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Photo Gallery
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {loading ? "Loading..." : `${images.length} images`}
            </p>
          </div>

          <div className="flex items-center space-x-3">
            {/* Sort dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name">Name</option>
              <option value="annotated">Most Annotated</option>
            </select>

            {/* View mode toggle */}
            <div className="flex border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  viewMode === "grid"
                    ? "bg-blue-600 text-white"
                    : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
                }`}
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
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                  />
                </svg>
              </button>
              <button
                onClick={() => setViewMode("masonry")}
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  viewMode === "masonry"
                    ? "bg-blue-600 text-white"
                    : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
                }`}
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
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </button>
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
              {images.map((image, index) => (
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
            images={images}
            currentIndex={selectedImage.index}
            onIndexChange={handleModalIndexChange}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default GalleryPage;
