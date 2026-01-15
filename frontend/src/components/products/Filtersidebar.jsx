import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

const Filtersidebar = () => {

    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const [Filters, setFilters] = useState({
        category: "",
        gender: "",
        color: "",
        size: [],
        material: [],
        brand: [],
        minPrice: 0,
        maxPrice: 30000,
    })

    const [priceRange, setPriceRange] = useState([0, 30000]);

    const categories = ["Top Wear", "Bottom Wear"];

    const colors = [
        "Red",
        "Browm",
        "Black",
        "Light browm",
        "Yellow",
        "Gray",
        "white",
        "Pink",
        "Beige",
        "Green",
    ];
    const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

    const materials = [
        "coton",
        "Wool",
        "Denim",
        "Polyester",
        "silk",
        "Linen",
        "Viscose",
        "Fleece",
        "Cuir",
    ];
    const brands = [
        "Urban Threads",
        "Modern Fit",
        "Street Style",
        "Beach Breeze",
        "Fashionista",
        "ChicStyle",
        "Jeep",
    ]
    const genders = ["Men", "Women"];

    useEffect(() => {
        const params = Object.fromEntries([...searchParams]);

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setFilters( {
            category: params.category || "",
            gender: params.gender || "",
            color: params.color || "",
            size: params.size ? params.size.split(",") : [],
            material: params.material ? params.material.split(",") : [],
            brand: params.brand ? params.brand.split(",") : [],
            minPrice: params.minPrice || 0,
            maxPrice: params.maxPrice || 100,
        });
        setPriceRange([0, params.maxPrice || 100]);
    }, [searchParams]);

    const handleFilterChange = (e) => {
        const { name, value, checked, type} = e.target;
       let newFilters = { ...Filters };

       if (type === "checkbox") {
            if (checked) {
                newFilters[name] = [...(newFilters[name] || []), value];
            }else{
                newFilters[name] = newFilters[name].filter((item) => item !== value);
            }
       }else{
        newFilters[name] = value;
       }
       setFilters(newFilters);
       updateURLparams(newFilters);

    }

    const updateURLparams = (newFilters) => {
        const params = new URLSearchParams();
        // category "topwear", size 
        Object.keys(newFilters).forEach((key) => {
            if (Array.isArray(newFilters[key]) && newFilters[key].length > 0) {
                params.append(key,newFilters[key].join(","));
            }else if (newFilters[key]) {
                params.append(key, newFilters[key]);
            }
        });
        setSearchParams(params);
        navigate(`?${params.toString()}`);
    }

    const handlePriceChange = (e) => {
        const newPrice = e.target.value;
        setPriceRange([0, newPrice]);
        const newFilters = { ...Filters, minPrice: 0, maxPrice: newPrice};
        setFilters(Filters);
        updateURLparams(newFilters);
    }

  return (
    <div className="p-4">
      <h3 className="text-xl font-meduim text-gray-800 mb-4">Filter</h3>

      {/* category filter  */}
      <div className="mb-6">
        <label className="block text-gray-600 font-medium mb-2 ">Category</label>
        {categories.map((category) => (
            <div key={category} className="flex items-center mb-1">
                <input type="radio" 
                name="category" 
                value={category}
                onChange={handleFilterChange}
                checked={Filters.category === category}
                className="mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300" />
                <span className="text-gray-700">{category}</span>
            </div>
        ))}
      </div>
       {/* gender filter  */}
      <div className="mb-6">
        <label className="block text-gray-600 font-medium mb-2 ">Gender</label>
        {genders.map((gender) => (
            <div key={gender} className="flex items-center mb-1">
                <input type="radio" 
                name="gender" 
                value={gender}
                onChange={handleFilterChange}
                checked={Filters.gender === gender}
                className={`mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300`} />
                <span className="text-gray-700">{gender}</span>
            </div>
        ))}
      </div>

        {/* color filter  */}
        <div className="mb-6">
            <label className="block text-gray-600 font-medium">
                <div className="flex flex-wrap gap-2">
                    {colors.map((color) => (
                        <button
                        key={color}
                        name="color"
                        value={color}
                        onClick={handleFilterChange}
                        className={`w-8 h-8 rounded-full border border-gray-300 cursor-pointer
                        transition hover:scale-105 ${Filters.color === color ? "ring-2 ring-blue-500" :"" }`}
                        style={{ backgroundColor: color.toLocaleLowerCase() }}
                        ></button>

                    ))}
                </div>
            </label>
        </div>

        {/* size filter  */}
        <div className="mb-6">
        <label className="block text-gray-600 font-medium mb-2">Size</label>
        {sizes.map((size) => (
            <div key={size} className="flex items-center mb-1">
            <input
                type="checkbox"
                name="size"
                value={size}
                onChange={handleFilterChange}
                checked={Filters.size.includes(size)}
                className="mr-2 h-4 text-blue-500 focus:ring-blue-400 border-gray-300"
            />
            <span className="text-gray-700">{size}</span>
            </div>
        ))}
        </div>

        {/* material filter  */}
        <div className="mb-6">
        <label className="block text-gray-600 font-medium mb-2">Material</label>
        {materials.map((material) => (
            <div key={material} className="flex items-center mb-1">
            <input
                type="checkbox"
                name="material"
                value={material}
                onChange={handleFilterChange}
                checked={Filters.material.includes(material)}
                className="mr-2 h-4 text-blue-500 focus:ring-blue-400 border-gray-300"
            />
            <span className="text-gray-700">{material}</span>
            </div>
        ))}
        </div>

        {/* Brand filter  */}
        <div className="mb-6">
        <label className="block text-gray-600 font-medium mb-2">Brand</label>
        {brands.map((brand) => (
            <div key={brand} className="flex items-center mb-1">
            <input
                type="checkbox"
                name="brand"
                value={brand}
                onChange={handleFilterChange}
                checked={Filters.brand.includes(brand)}
                className="mr-2 h-4 text-blue-500 focus:ring-blue-400 border-gray-300"
            />
            <span className="text-gray-700">{brand}</span>
            </div>
        ))}
        </div>

        {/* price range filter  */}
        <div className="mb-8">
            <label className="block text-gray-600 font-meduim mb-2"> Price Range</label>
            <input 
            type="range"
             name="priceRange" 
             value={priceRange[1]}
             onChange={handlePriceChange}
             min={0} max={30000}
             className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer" />
        </div>
        <div className="flex justify-between text-gray-600 mt-2">
            <span>0 FCFA</span>
            <span>{priceRange[1]} FCFA</span>
        </div>

    </div>
  )
}

export default Filtersidebar
