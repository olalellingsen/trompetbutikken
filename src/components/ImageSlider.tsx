"use client";
import React, { useState } from "react";
import Image from "next/image";
import placeholder from "@/public/placeholder.png";
import { CircleChevronLeft, CircleChevronRight } from "lucide-react";

interface ImageSliderProps {
  images: string[];
}

function ImageSlider({ images }: ImageSliderProps) {
  const [currentImage, setCurrentImage] = useState(0);
  const totalImages = images.length;

  function handleNext() {
    if (currentImage === totalImages - 1) {
      setCurrentImage(0);
      return;
    }
    setCurrentImage(currentImage + 1);
  }

  function handlePrev() {
    if (currentImage === 0) {
      setCurrentImage(totalImages - 1);
      return;
    }
    setCurrentImage(currentImage - 1);
  }

  return (
    <div className="relative w-full">
      <Image
        src={images[currentImage] || placeholder}
        alt="Product image"
        width={200}
        height={100}
        className="w-full"
      />
      {totalImages > 1 && (
        <div className="flex justify-between p-4">
          <CircleChevronLeft
            strokeWidth={1}
            onClick={handleNext}
            className="md:absolute top-1/2 left-2 transform md:-translate-y-1/2 md:dark:text-background hover:scale-105 hover:cursor-pointer"
            size={40}
          />

          <CircleChevronRight
            strokeWidth={1}
            onClick={handleNext}
            className="md:absolute top-1/2 right-2 transform md:-translate-y-1/2 md:dark:text-background hover:scale-105 hover:cursor-pointer"
            size={40}
          />
        </div>
      )}
    </div>
  );
}

export default ImageSlider;
