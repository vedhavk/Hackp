import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { Modal, Button, Spinner } from "../components/ui";

const ImageModal = ({
  isOpen,
  onClose,
  images = [],
  currentIndex = 0,
  onIndexChange,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(currentIndex);
  const [imageLoading, setImageLoading] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const currentImage = images[currentImageIndex];

  useEffect(() => {
    setCurrentImageIndex(currentIndex);
  }, [currentIndex]);

  useEffect(() => {
    if (currentImage) {
      setImageLoading(true);
      setZoomLevel(1);
      setImagePosition({ x: 0, y: 0 });
      onIndexChange?.(currentImageIndex);
    }
  }, [currentImageIndex, currentImage, onIndexChange]);

  const handlePrevious = useCallback(() => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex((prev) => prev - 1);
    }
  }, [currentImageIndex]);

  const handleNext = useCallback(() => {
    if (currentImageIndex < images.length - 1) {
      setCurrentImageIndex((prev) => prev + 1);
    }
  }, [currentImageIndex, images.length]);

  const handleKeyDown = useCallback(
    (e) => {
      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          handlePrevious();
          break;
        case "ArrowRight":
          e.preventDefault();
          handleNext();
          break;
        case "Escape":
          e.preventDefault();
          onClose();
          break;
        case "+":
        case "=":
          e.preventDefault();
          setZoomLevel((prev) => Math.min(prev * 1.2, 3));
          break;
        case "-":
          e.preventDefault();
          setZoomLevel((prev) => Math.max(prev / 1.2, 0.5));
          break;
        case "0":
          e.preventDefault();
          setZoomLevel(1);
          setImagePosition({ x: 0, y: 0 });
          break;
      }
    },
    [handlePrevious, handleNext, onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, handleKeyDown]);

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev * 1.2, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev / 1.2, 0.5));
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
    setImagePosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e) => {
    if (zoomLevel > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - imagePosition.x,
        y: e.clientY - imagePosition.y,
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && zoomLevel > 1) {
      setImagePosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  if (!currentImage) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="full"
      showCloseButton={false}
      className="bg-black bg-opacity-95"
    >
      <div className="relative h-screen flex flex-col">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black to-transparent p-4">
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center space-x-4">
              <h3 className="text-lg font-medium">
                {currentImage.title || `Image ${currentImageIndex + 1}`}
              </h3>
              <span className="text-sm text-gray-300">
                {currentImageIndex + 1} of {images.length}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              {/* Zoom controls */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleZoomOut}
                className="text-white hover:bg-white hover:bg-opacity-20"
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
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7"
                  />
                </svg>
              </Button>

              <span className="text-sm text-gray-300 min-w-12 text-center">
                {Math.round(zoomLevel * 100)}%
              </span>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleZoomIn}
                className="text-white hover:bg-white hover:bg-opacity-20"
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
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                  />
                </svg>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetZoom}
                className="text-white hover:bg-white hover:bg-opacity-20"
              >
                Reset
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-white hover:bg-white hover:bg-opacity-20"
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </Button>
            </div>
          </div>
        </div>

        {/* Image container */}
        <div
          className="flex-1 flex items-center justify-center overflow-hidden cursor-move"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Spinner size="xl" className="text-white" />
            </div>
          )}

          <img
            src={currentImage.url}
            alt={currentImage.title || "Image"}
            className="max-w-none transition-transform duration-200"
            style={{
              transform: `scale(${zoomLevel}) translate(${
                imagePosition.x / zoomLevel
              }px, ${imagePosition.y / zoomLevel}px)`,
              cursor:
                zoomLevel > 1 ? (isDragging ? "grabbing" : "grab") : "default",
            }}
            onLoad={handleImageLoad}
            onDragStart={(e) => e.preventDefault()}
          />
        </div>

        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              disabled={currentImageIndex === 0}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <button
              onClick={handleNext}
              disabled={currentImageIndex === images.length - 1}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </>
        )}

        {/* Thumbnails strip */}
        {images.length > 1 && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
            <div className="flex justify-center">
              <div className="flex space-x-2 max-w-full overflow-x-auto py-2">
                {images.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      index === currentImageIndex
                        ? "border-white scale-110"
                        : "border-transparent hover:border-gray-400"
                    }`}
                  >
                    <img
                      src={image.thumbnail || image.url}
                      alt={image.title || `Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Keyboard shortcuts help */}
        <div className="absolute bottom-20 right-4 text-white text-xs space-y-1 bg-black bg-opacity-50 p-3 rounded-lg">
          <div>← → Navigate</div>
          <div>+ - Zoom</div>
          <div>0 Reset</div>
          <div>Esc Close</div>
        </div>
      </div>
    </Modal>
  );
};

ImageModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  images: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      url: PropTypes.string.isRequired,
      thumbnail: PropTypes.string,
      title: PropTypes.string,
    })
  ).isRequired,
  currentIndex: PropTypes.number,
  onIndexChange: PropTypes.func,
};

export default ImageModal;
