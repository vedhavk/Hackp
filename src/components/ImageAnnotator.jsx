import React, { useState, useRef, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import { Button, Modal } from "../components/ui";
import { useToast } from "../contexts/ToastContext";
import { mockAnnotations } from "../utils/mockApi";

const ImageAnnotator = ({
  image,
  annotations = [],
  onAnnotationsChange,
  readOnly = false,
  className = "",
}) => {
  const [localAnnotations, setLocalAnnotations] = useState(annotations);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentAnnotation, setCurrentAnnotation] = useState(null);
  const [selectedAnnotation, setSelectedAnnotation] = useState(null);
  const [showLabelModal, setShowLabelModal] = useState(false);
  const [annotationLabel, setAnnotationLabel] = useState("");
  const [dragStart, setDragStart] = useState(null);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState(null);

  const containerRef = useRef(null);
  const imageRef = useRef(null);
  const { success: toastSuccess, error: toastError } = useToast();

  useEffect(() => {
    setLocalAnnotations(annotations);
  }, [annotations]);

  const getMousePosition = useCallback((e) => {
    if (!imageRef.current) return { x: 0, y: 0 };

    const rect = imageRef.current.getBoundingClientRect();
    const scaleX = imageRef.current.naturalWidth / rect.width;
    const scaleY = imageRef.current.naturalHeight / rect.height;

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  }, []);

  const getDisplayPosition = useCallback((annotation) => {
    if (!imageRef.current) return annotation;

    const rect = imageRef.current.getBoundingClientRect();
    const scaleX = rect.width / imageRef.current.naturalWidth;
    const scaleY = rect.height / imageRef.current.naturalHeight;

    return {
      ...annotation,
      x: annotation.x * scaleX,
      y: annotation.y * scaleY,
      width: annotation.width * scaleX,
      height: annotation.height * scaleY,
    };
  }, []);

  const handleMouseDown = useCallback(
    (e) => {
      if (readOnly) return;

      e.preventDefault();
      const position = getMousePosition(e);

      // Check if clicking on an existing annotation
      const clickedAnnotation = localAnnotations.find((ann) => {
        const display = getDisplayPosition(ann);
        const relativeX =
          e.clientX - imageRef.current.getBoundingClientRect().left;
        const relativeY =
          e.clientY - imageRef.current.getBoundingClientRect().top;

        return (
          relativeX >= display.x &&
          relativeX <= display.x + display.width &&
          relativeY >= display.y &&
          relativeY <= display.y + display.height
        );
      });

      if (clickedAnnotation) {
        setSelectedAnnotation(clickedAnnotation);
        return;
      }

      // Start drawing new annotation
      setIsDrawing(true);
      setSelectedAnnotation(null);
      setDragStart(position);
      setCurrentAnnotation({
        x: position.x,
        y: position.y,
        width: 0,
        height: 0,
      });
    },
    [readOnly, localAnnotations, getMousePosition, getDisplayPosition]
  );

  const handleMouseMove = useCallback(
    (e) => {
      if (!isDrawing || !dragStart || readOnly) return;

      const position = getMousePosition(e);
      const width = Math.abs(position.x - dragStart.x);
      const height = Math.abs(position.y - dragStart.y);
      const x = Math.min(position.x, dragStart.x);
      const y = Math.min(position.y, dragStart.y);

      setCurrentAnnotation({ x, y, width, height });
    },
    [isDrawing, dragStart, readOnly, getMousePosition]
  );

  const handleMouseUp = useCallback(() => {
    if (!isDrawing || !currentAnnotation || readOnly) return;

    // Only create annotation if it has meaningful size
    if (currentAnnotation.width > 20 && currentAnnotation.height > 20) {
      setAnnotationLabel("");
      setShowLabelModal(true);
    } else {
      setCurrentAnnotation(null);
    }

    setIsDrawing(false);
    setDragStart(null);
  }, [isDrawing, currentAnnotation, readOnly]);

  const handleSaveAnnotation = async () => {
    if (!annotationLabel.trim() || !currentAnnotation) return;

    try {
      const newAnnotation = {
        ...currentAnnotation,
        label: annotationLabel.trim(),
      };

      // Save to API
      const savedAnnotation = await mockAnnotations.saveAnnotation(
        image.id,
        newAnnotation
      );

      const updatedAnnotations = [...localAnnotations, savedAnnotation];
      setLocalAnnotations(updatedAnnotations);
      onAnnotationsChange?.(updatedAnnotations);

      toastSuccess("Annotation saved successfully");

      setCurrentAnnotation(null);
      setShowLabelModal(false);
      setAnnotationLabel("");
    } catch (error) {
      toastError("Failed to save annotation");
    }
  };

  const handleDeleteAnnotation = async (annotationToDelete) => {
    try {
      await mockAnnotations.deleteAnnotation(image.id, annotationToDelete.id);

      const updatedAnnotations = localAnnotations.filter(
        (ann) => ann.id !== annotationToDelete.id
      );
      setLocalAnnotations(updatedAnnotations);
      onAnnotationsChange?.(updatedAnnotations);

      setSelectedAnnotation(null);
      toastSuccess("Annotation deleted");
    } catch (error) {
      toastError("Failed to delete annotation");
    }
  };

  const handleEditAnnotation = (annotation) => {
    setSelectedAnnotation(annotation);
    setAnnotationLabel(annotation.label);
    setShowLabelModal(true);
  };

  const handleUpdateAnnotation = async () => {
    if (!selectedAnnotation || !annotationLabel.trim()) return;

    try {
      const updatedAnnotation = await mockAnnotations.updateAnnotation(
        image.id,
        selectedAnnotation.id,
        { label: annotationLabel.trim() }
      );

      const updatedAnnotations = localAnnotations.map((ann) =>
        ann.id === selectedAnnotation.id ? updatedAnnotation : ann
      );

      setLocalAnnotations(updatedAnnotations);
      onAnnotationsChange?.(updatedAnnotations);

      toastSuccess("Annotation updated");

      setSelectedAnnotation(null);
      setShowLabelModal(false);
      setAnnotationLabel("");
    } catch (error) {
      toastError("Failed to update annotation");
    }
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {/* Image */}
      <img
        ref={imageRef}
        src={image.url}
        alt={image.title || "Annotatable image"}
        className="w-full h-auto select-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{ cursor: readOnly ? "default" : "crosshair" }}
        draggable={false}
      />

      {/* Existing annotations */}
      {localAnnotations.map((annotation) => {
        const display = getDisplayPosition(annotation);
        const isSelected = selectedAnnotation?.id === annotation.id;

        return (
          <div
            key={annotation.id}
            className={`absolute border-2 bg-opacity-10 ${
              isSelected
                ? "border-red-500 bg-red-500"
                : "border-blue-500 bg-blue-500"
            } ${readOnly ? "" : "cursor-pointer"}`}
            style={{
              left: display.x,
              top: display.y,
              width: display.width,
              height: display.height,
            }}
            onClick={() => !readOnly && setSelectedAnnotation(annotation)}
          >
            {/* Label */}
            <div
              className={`absolute -top-6 left-0 px-2 py-1 text-xs font-medium text-white rounded ${
                isSelected ? "bg-red-500" : "bg-blue-500"
              }`}
            >
              {annotation.label}
            </div>

            {/* Controls for selected annotation */}
            {isSelected && !readOnly && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditAnnotation(annotation);
                  }}
                  className="absolute -top-8 -right-8 bg-blue-500 hover:bg-blue-600 text-white p-1 rounded"
                  title="Edit annotation"
                >
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteAnnotation(annotation);
                  }}
                  className="absolute -top-8 -right-16 bg-red-500 hover:bg-red-600 text-white p-1 rounded"
                  title="Delete annotation"
                >
                  <svg
                    className="w-3 h-3"
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
              </>
            )}
          </div>
        );
      })}

      {/* Current annotation being drawn */}
      {currentAnnotation && isDrawing && (
        <div
          className="absolute border-2 border-dashed border-yellow-500 bg-yellow-500 bg-opacity-20"
          style={{
            left: getDisplayPosition(currentAnnotation).x,
            top: getDisplayPosition(currentAnnotation).y,
            width: getDisplayPosition(currentAnnotation).width,
            height: getDisplayPosition(currentAnnotation).height,
          }}
        />
      )}

      {/* Instructions overlay */}
      {!readOnly && localAnnotations.length === 0 && !currentAnnotation && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-center p-4">
          <div>
            <svg
              className="w-12 h-12 mx-auto mb-4"
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
            <h3 className="text-lg font-medium mb-2">Start Annotating</h3>
            <p className="text-sm">
              Click and drag to create rectangular annotations
            </p>
          </div>
        </div>
      )}

      {/* Label modal */}
      <Modal
        isOpen={showLabelModal}
        onClose={() => {
          setShowLabelModal(false);
          setCurrentAnnotation(null);
          setSelectedAnnotation(null);
        }}
        title={selectedAnnotation ? "Edit Annotation" : "Add Annotation Label"}
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Annotation Label
            </label>
            <input
              type="text"
              value={annotationLabel}
              onChange={(e) => setAnnotationLabel(e.target.value)}
              placeholder="Enter a description for this annotation"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              autoFocus
            />
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              variant="ghost"
              onClick={() => {
                setShowLabelModal(false);
                setCurrentAnnotation(null);
                setSelectedAnnotation(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={
                selectedAnnotation
                  ? handleUpdateAnnotation
                  : handleSaveAnnotation
              }
              disabled={!annotationLabel.trim()}
            >
              {selectedAnnotation ? "Update" : "Save"} Annotation
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

ImageAnnotator.propTypes = {
  image: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    url: PropTypes.string.isRequired,
    title: PropTypes.string,
  }).isRequired,
  annotations: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired,
      width: PropTypes.number.isRequired,
      height: PropTypes.number.isRequired,
      label: PropTypes.string.isRequired,
    })
  ),
  onAnnotationsChange: PropTypes.func,
  readOnly: PropTypes.bool,
  className: PropTypes.string,
};

export default ImageAnnotator;
