"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import './lightbox.css';

type LightboxImage = {
  src: string;
  id: number;
};

type LightboxProps = {
  activeImage: LightboxImage;
  images: LightboxImage[];
};

export default function Lightbox(props: LightboxProps) {
  const { images, activeImage } = props;
  const [lightboxImage, setLightboxImage] = useState<LightboxImage | null>(activeImage);

  useEffect(() => {
    setLightboxImage(activeImage);
  }, [activeImage])

  const hideLightBox = () => {
    setLightboxImage(null);
  };

  const showNext = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    const currentIndex = images.findIndex((e) => e.id === lightboxImage?.id);
    if (currentIndex >= images.length - 1) {
      setLightboxImage(images[0]);
    } else {
      const nextImage = images[currentIndex + 1];
      setLightboxImage(nextImage);
    }
  };

  const showPrev = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    const currentIndex = images.findIndex((e) => e.id === lightboxImage?.id);
    if (currentIndex <= 0) {
      setLightboxImage(images[images.length - 1]);
    } else {
      const nextImage = images[currentIndex - 1];
      setLightboxImage(nextImage);
    }
  };

  return (
    <>
      {lightboxImage && (
        <div key={lightboxImage.id} className="lightbox" onClick={hideLightBox}>
          <div className="nav-wrapper">
            <div className="nav-prev cursor-pointer" onClick={showPrev}>
              <ChevronLeft size={"28px"} color="#000000" />
            </div>
            <div className="nav-next cursor-pointer" onClick={showNext}>
              <ChevronRight size={"28px"} color="#000000" />
            </div>
          </div>

          <picture className="lightbox-pict">
            <Image
              layout="fill"
              className="lightbox-img"
              alt={lightboxImage.src}
              src={lightboxImage.src}
            />
          </picture>
        </div>
      )}
    </>
  );
}
