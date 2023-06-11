import { Modal, ModalBody, ModalOverlay } from "components/Modal/Modal";
import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import getCroppedImg from "utils/cropImage";

export default function CropImageModal({ isOpen, onClose, applyCrop, image }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const showCroppedImage = useCallback(async () => {
    try {
      const croppedImage = await getCroppedImg(image, croppedAreaPixels);
      applyCrop(croppedImage);
    } catch (e) {
      console.error(e);
    }
  }, [croppedAreaPixels, image, applyCrop]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalBody className="h-[550px] w-[600px]">
        <div className="px-[18px] pt-5">
          <p className="text-lg">Суретіңізді өзгерту</p>
          <div className="relative mt-5 h-[300px] overflow-hidden">
            <Cropper
              image={image}
              crop={crop}
              aspect={1}
              cropShape="round"
              zoom={zoom}
              maxZoom={5}
              zoomSpeed={0.3}
              showGrid={false}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>

          <div className="mt-5 flex w-full justify-center pt-6">
            <input
              type="range"
              step="0.1"
              min="1"
              max="5"
              value={zoom}
              onChange={(e) => setZoom(e.target.value)}
              className="h-[9px] w-[80%] appearance-none rounded-sm bg-[#2b3a49] outline-none [&::-moz-range-thumb]:h-[22px] [&::-moz-range-thumb]:w-[12px] [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:rounded-sm [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:bg-[#d3d3d3] [&::-webkit-slider-thumb]:h-[22px] [&::-webkit-slider-thumb]:w-[12px] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-sm [&::-webkit-slider-thumb]:border-none [&::-webkit-slider-thumb]:bg-[#d3d3d3]"
            />
          </div>
          <div className="mt-10 flex h-[70px] w-full items-center justify-between px-2">
            <button
              className="rounded-md bg-[#3178d6] p-[10px] px-4 text-sm hover:bg-[#2c6bbe]"
              type="button"
              onClick={showCroppedImage}
            >
              Өзгерту
            </button>
            <button
              className="hover:underline"
              type="button"
              onClick={() => onClose()}
            >
              Артқа қайту
            </button>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
}
