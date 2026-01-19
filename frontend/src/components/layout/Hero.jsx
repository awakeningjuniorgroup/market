import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import heroImg1 from "../../assets/image1.png";
import heroImg2 from "../../assets/image2.jpeg";
import heroImg3 from "../../assets/image9.jpeg";
import heroImg4 from "../../assets/image18.jpeg";
import heroImg5 from "../../assets/image19.jpeg";
import heroImg6 from "../../assets/image45.jpeg";

const images = [heroImg1, heroImg2, heroImg3, heroImg4, heroImg5, heroImg6];

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Défilement automatique toutes les 4 secondes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // Fonctions pour les boutons
  const goToPrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <section className="relative">
      <img
        src={images[currentIndex]}
        alt="Hero"
        className="w-full h-[700px] md:h-[700px] lg:h-[750px] object-cover transition-all duration-700"
      />

      {/* Boutons gauche/droite */}
      <button
        onClick={goToPrev}
        className="absolute top-1/2 left-4 -translate-y-1/2 bg-black bg-opacity-40 text-white p-3 rounded-full hover:bg-opacity-70 transition"
      >
        ‹
      </button>
      <button
        onClick={goToNext}
        className="absolute top-1/2 right-4 -translate-y-1/2 bg-black bg-opacity-40 text-white p-3 rounded-full hover:bg-opacity-70 transition"
      >
        ›
      </button>

      {/* Petits points en bas */}
      <div className="absolute bottom-6 w-full flex justify-center space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition ${
              currentIndex === index
                ? "bg-white scale-110"
                : "bg-gray-400 hover:bg-gray-200"
            }`}
          ></button>
        ))}
      </div>
    </section>
  );
};

export default Hero;
