import React, { useState, useRef, useCallback } from "react";
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

  const imageRef = useRef(null);
  const {
    success: toastSuccess,
    error: toastError,
    info: toastInfo,
  } = useToast();

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

  const handleSaveAnnotation = async () => {
    if (!annotationLabel.trim() || !currentAnnotation) return;

    try {
      const newAnnotation = {
        ...currentAnnotation,
        label: annotationLabel.trim(),
      };

      const savedAnnotation = await mockAnnotations.saveAnnotation(
        image.id,
        newAnnotation
      );
      const updatedAnnotations = [...localAnnotations, savedAnnotation];
      setLocalAnnotations(updatedAnnotations);
      onAnnotationsChange?.(image.id, updatedAnnotations);

      toastSuccess("Annotation saved successfully");
      setCurrentAnnotation(null);
      setShowLabelModal(false);
      setAnnotationLabel("");
    } catch (error) {
      toastError("Failed to save annotation");
    }
  };

  const handleCancelAnnotation = () => {
    setShowLabelModal(false);
    setCurrentAnnotation(null);
    setAnnotationLabel("");
  };

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

        {localAnnotations.map((annotation) => (
          <div
            key={annotation.id}
            className="absolute border-2 border-blue-500 bg-blue-500 bg-opacity-10"
            style={{
              left: annotation.x,
              top: annotation.y,
              width: annotation.width,
              height: annotation.height,
            }}
          >
            <div className="absolute -top-6 left-0 px-2 py-1 text-xs font-medium text-white rounded bg-blue-500">
              {annotation.label}
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

      <Modal
        isOpen={showLabelModal}
        onClose={handleCancelAnnotation}
        title="Add Annotation Label"
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
              onKeyDown={(e) => {
                if (e.key === "Enter" && annotationLabel.trim()) {
                  handleSaveAnnotation();
                } else if (e.key === "Escape") {
                  handleCancelAnnotation();
                }
              }}
            />
          </div>

          <div className="flex justify-end space-x-3">
            <Button variant="ghost" onClick={handleCancelAnnotation}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveAnnotation}
              disabled={!annotationLabel.trim()}
            >
              Save Annotation
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ImageAnnotator;
