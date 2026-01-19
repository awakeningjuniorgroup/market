import React from 'react';
import { Link } from 'react-router-dom';
import mensCollectionimage from "../../assets/image2.jpeg";
import womensCollectionimage from "../../assets/image18.jpeg";

const GenderCollectionSection = () => {
  return (
    <section className="py-16 px-4 lg:px-0">
      <div className="container mx-auto flex flex-col md:flex-row gap-8">
        
        {/* Women's collection */}
        <div className="relative flex-1 overflow-hidden rounded-md">
          <img 
            src={womensCollectionimage}
            alt="Women's Collection"
            className="w-full h-full max-h-[700px] object-cover object-center"
          />
          <div className="absolute inset-0 flex items-end">
            <div className="bg-white bg-opacity-90 p-4 m-6 rounded shadow-md">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Women's Collection
              </h2>
              <Link 
                to="/collections/all?gender=Women"
                className="text-gray-900 underline"
              >
                Shop Now
              </Link>
            </div>
          </div>
        </div>

        {/* Men's collection */}
        <div className="relative flex-1 overflow-hidden rounded-md">
          <img 
            src={mensCollectionimage}
            alt="Men's Collection"
            className="w-full h-full max-h-[700px] object-cover object-center"
          />
          <div className="absolute inset-0 flex items-end">
            <div className="bg-white bg-opacity-90 p-4 m-6 rounded shadow-md">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Men's Collection
              </h2>
              <Link 
                to="/collections/all?gender=Men"
                className="text-gray-900 underline"
              >
                Shop Now
              </Link>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default GenderCollectionSection;
