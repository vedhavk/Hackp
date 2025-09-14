import React, { useState, useRef, useCallback, useEffect } from "react";
import { Button, Modal } from "./ui";
import useToast from "../hooks/useToast";
import { mockAnnotations } from "../utils/mockApi";

const ImageAnnotator = ({
  image,
  annotations = [],
  onAnnotationsChange,
  readOnly = false,
}) => {
  const [localAnnotations, setLocalAnnotations] = useState(annotations);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentAnnotation, setCurrentAnnotation] = useState(null);
  const [showLabelModal, setShowLabelModal] = useState(false);
  const [annotationLabel, setAnnotationLabel] = useState("");
  const [dragStart, setDragStart] = useState(null);
  const [editingAnnotation, setEditingAnnotation] = useState(null);
  const [hoveredAnnotation, setHoveredAnnotation] = useState(null);

  const imageRef = useRef(null);
  const {
    success: toastSuccess,
    error: toastError,
    info: toastInfo,
  } = useToast();

  // Sync annotations when prop changes
  useEffect(() => {
    // Only update if annotations actually changed to prevent unnecessary re-renders
    if (JSON.stringify(annotations) !== JSON.stringify(localAnnotations)) {
      setLocalAnnotations(annotations);
    }
  }, [annotations, localAnnotations]);

  const getMousePosition = useCallback((e) => {
    if (!imageRef.current) return { x: 0, y: 0 };
    const rect = imageRef.current.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }, []);

  const handleMouseDown = useCallback(
    (e) => {
      if (readOnly) return;
      e.preventDefault();

      const position = getMousePosition(e);
      setIsDrawing(true);
      setDragStart(position);
      setCurrentAnnotation({
        x: position.x,
        y: position.y,
        width: 0,
        height: 0,
      });
    },
    [readOnly, getMousePosition]
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

    if (currentAnnotation.width > 20 && currentAnnotation.height > 20) {
      setAnnotationLabel("");
      setShowLabelModal(true);
    } else {
      setCurrentAnnotation(null);
      toastInfo("Annotation too small. Please draw a larger area.");
    }

    setIsDrawing(false);
    setDragStart(null);
  }, [isDrawing, currentAnnotation, readOnly, toastInfo]);

  const handleUpdateAnnotation = useCallback(async () => {
    if (!annotationLabel.trim() || !editingAnnotation) return;

    try {
      const updatedAnnotation = await mockAnnotations.updateAnnotation(
        image.id,
        editingAnnotation.id,
        { label: annotationLabel.trim() }
      );

      const updatedAnnotations = localAnnotations.map((ann) =>
        ann.id === editingAnnotation.id ? updatedAnnotation : ann
      );
      onAnnotationsChange?.(image.id, updatedAnnotations);

      toastSuccess("Annotation updated successfully");
      setShowLabelModal(false);
      setAnnotationLabel("");
      setEditingAnnotation(null);
    } catch (error) {
      toastError("Failed to update annotation");
    }
  }, [
    annotationLabel,
    editingAnnotation,
    image.id,
    localAnnotations,
    onAnnotationsChange,
    toastSuccess,
    toastError,
  ]);

  const handleSaveAnnotation = useCallback(async () => {
    if (!annotationLabel.trim()) return;

    try {
      if (editingAnnotation) {
        // Update existing annotation
        await handleUpdateAnnotation();
        return;
      }

      // Create new annotation
      if (!currentAnnotation) return;

      const newAnnotation = {
        ...currentAnnotation,
        label: annotationLabel.trim(),
      };

      const savedAnnotation = await mockAnnotations.saveAnnotation(
        image.id,
        newAnnotation
      );

      // Only update the parent state, let useEffect sync it back to local state
      // This prevents double updates and ensures single source of truth
      const updatedAnnotations = [...localAnnotations, savedAnnotation];
      onAnnotationsChange?.(image.id, updatedAnnotations);

      toastSuccess("Annotation saved successfully");
      setCurrentAnnotation(null);
      setShowLabelModal(false);
      setAnnotationLabel("");
    } catch (error) {
      toastError("Failed to save annotation");
    }
  }, [
    annotationLabel,
    currentAnnotation,
    editingAnnotation,
    handleUpdateAnnotation,
    image.id,
    localAnnotations,
    onAnnotationsChange,
    toastSuccess,
    toastError,
  ]);

  const handleCancelAnnotation = useCallback(() => {
    setShowLabelModal(false);
    setCurrentAnnotation(null);
    setAnnotationLabel("");
    setEditingAnnotation(null);
  }, []);

  const handleDeleteAnnotation = useCallback(
    async (annotationId) => {
      try {
        await mockAnnotations.deleteAnnotation(image.id, annotationId);

        const updatedAnnotations = localAnnotations.filter(
          (ann) => ann.id !== annotationId
        );
        onAnnotationsChange?.(image.id, updatedAnnotations);

        toastSuccess("Annotation deleted successfully");
      } catch (error) {
        toastError("Failed to delete annotation");
      }
    },
    [image.id, localAnnotations, onAnnotationsChange, toastSuccess, toastError]
  );

  const handleEditAnnotation = useCallback((annotation) => {
    setEditingAnnotation(annotation);
    setAnnotationLabel(annotation.label);
    setShowLabelModal(true);
  }, []);

  const handleInputChange = useCallback((e) => {
    setAnnotationLabel(e.target.value);
  }, []);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" && e.target.value.trim()) {
        if (editingAnnotation) {
          handleUpdateAnnotation();
        } else {
          handleSaveAnnotation();
        }
      } else if (e.key === "Escape") {
        handleCancelAnnotation();
      }
    },
    [
      editingAnnotation,
      handleUpdateAnnotation,
      handleSaveAnnotation,
      handleCancelAnnotation,
    ]
  );

  return (
    <div className="relative">
      <div className="relative">
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

        {localAnnotations
          .filter(
            (annotation, index, self) =>
              // Remove any duplicate annotations by ID to prevent duplicate keys
              self.findIndex((a) => a.id === annotation.id) === index
          )
          .map((annotation) => (
            <div
              key={annotation.id}
              className="absolute border-2 border-blue-500 bg-blue-500 bg-opacity-10 group"
              style={{
                left: annotation.x,
                top: annotation.y,
                width: annotation.width,
                height: annotation.height,
              }}
              onMouseEnter={() => setHoveredAnnotation(annotation.id)}
              onMouseLeave={() => setHoveredAnnotation(null)}
              onContextMenu={(e) => {
                if (!readOnly) {
                  e.preventDefault();
                  const rect = e.currentTarget.getBoundingClientRect();
                  // You could implement a context menu here if desired
                }
              }}
            >
              <div className="absolute -top-6 left-0 px-2 py-1 text-xs font-medium text-white rounded bg-blue-500 flex items-center gap-1">
                <span>{annotation.label}</span>
                {!readOnly && hoveredAnnotation === annotation.id && (
                  <div className="flex items-center gap-1 ml-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditAnnotation(annotation);
                      }}
                      className="w-4 h-4 flex items-center justify-center bg-yellow-500 hover:bg-yellow-600 rounded text-white text-xs transition-colors"
                      title="Edit annotation"
                    >
                      <svg
                        className="w-3 h-3"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (
                          window.confirm(
                            "Are you sure you want to delete this annotation?"
                          )
                        ) {
                          handleDeleteAnnotation(annotation.id);
                        }
                      }}
                      className="w-4 h-4 flex items-center justify-center bg-red-500 hover:bg-red-600 rounded text-white text-xs transition-colors"
                      title="Delete annotation"
                    >
                      <svg
                        className="w-3 h-3"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"
                          clipRule="evenodd"
                        />
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

        {currentAnnotation && isDrawing && (
          <div
            className="absolute border-2 border-dashed border-yellow-500 bg-yellow-500 bg-opacity-20"
            style={{
              left: currentAnnotation.x,
              top: currentAnnotation.y,
              width: currentAnnotation.width,
              height: currentAnnotation.height,
            }}
          />
        )}

        {!readOnly && localAnnotations.length === 0 && !currentAnnotation && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-center p-4 pointer-events-none">
            <div>
              <h3 className="text-lg font-medium mb-2">Start Annotating</h3>
              <p className="text-sm">
                Click and drag to create rectangular annotations
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Annotation Management Panel */}
      {!readOnly && localAnnotations.length > 0 && (
        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
            Annotations ({localAnnotations.length})
          </h4>
          <div className="space-y-2">
            {localAnnotations.map((annotation) => (
              <div
                key={annotation.id}
                className="flex items-center justify-between p-2 bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600"
              >
                <span className="text-sm text-gray-700 dark:text-gray-300 truncate flex-1">
                  {annotation.label}
                </span>
                <div className="flex items-center gap-1 ml-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEditAnnotation(annotation)}
                    className="text-yellow-600 hover:text-yellow-800 p-1"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      if (
                        window.confirm(
                          "Are you sure you want to delete this annotation?"
                        )
                      ) {
                        handleDeleteAnnotation(annotation.id);
                      }
                    }}
                    className="text-red-600 hover:text-red-800 p-1"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"
                        clipRule="evenodd"
                      />
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <Modal
        isOpen={showLabelModal}
        onClose={handleCancelAnnotation}
        title={
          editingAnnotation ? "Edit Annotation Label" : "Add Annotation Label"
        }
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Annotation Label
            </label>
            <input
              key="annotation-label-input"
              type="text"
              value={annotationLabel}
              onChange={handleInputChange}
              placeholder="Enter a description for this annotation"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              autoFocus
              onKeyDown={handleKeyDown}
            />
          </div>

          <div className="flex justify-end space-x-3">
            <Button variant="ghost" onClick={handleCancelAnnotation}>
              Cancel
            </Button>
            <Button
              onClick={
                editingAnnotation
                  ? handleUpdateAnnotation
                  : handleSaveAnnotation
              }
              disabled={!annotationLabel.trim()}
            >
              {editingAnnotation ? "Update Annotation" : "Save Annotation"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ImageAnnotator;
