import React from 'react'
import { IoLogoInstagram } from 'react-icons/io'
import { RiTwitterXFill } from 'react-icons/ri'
import { TbBrandMeta, TbFilePhone } from 'react-icons/tb'
import { FaFacebookF, FaTiktok } from 'react-icons/fa'   // ✅ Ajout Facebook & TikTok
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
   <footer className="border-t py-12">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-4 lg:px-0">
            {/* Newsletter */}
            <div>
                <h3 className="text-lg text-gray-800 mb-4">NewsLetter</h3>
                <p className="text-gray-500 mb-4">
                    Be the first to hear about new products, exclusive events, and online offers.
                </p>
                <p className='font-medium text-sm text-gray-600 mb-6'>Sign up and get 10% off your first order.</p>
                <form className="flex">
                    <input 
                      type="email" 
                      placeholder='Enter your email here'
                      className="p-3 w-full text-sm border-t border-l border-gray-300 rounded-l-md focus:outline-none
                      focus:ring-2 focus:ring-gray-500 transition-all" required 
                    />
                    <button 
                      type="submit" 
                      className="bg-black text-white px-6 py-3 text-sm rounded-r-md hover:bg-rabbit-red transition-all">
                      Subscribe
                    </button>
                </form>
            </div>

            {/* Shop links */}
            <div>
                <h3 className="text-lg text-gray-800 mb-4">Shop</h3>
                <ul className="space-y-2 text-gray-600">
                    <li><Link to="#" className="hover:text-gray-500">Men's top wear</Link></li>
                    <li><Link to="#" className="hover:text-gray-500">Women's top wear</Link></li>
                    <li><Link to="#" className="hover:text-gray-500">Men's bottom wear</Link></li>
                    <li><Link to="#" className="hover:text-gray-500">Women's bottom wear</Link></li>
                </ul>
            </div>

            {/* Support links */}
            <div>
                <h3 className="text-lg text-gray-800 mb-4">Support</h3>
                <ul className="space-y-2 text-gray-600">
                    <li><Link to="#" className="hover:text-gray-500">Contact Us</Link></li>
                    <li><Link to="#" className="hover:text-gray-500">About Us</Link></li>
                    <li><Link to="#" className="hover:text-gray-500">FAQs</Link></li>
                    <li><Link to="#" className="hover:text-gray-500">Features</Link></li>
                </ul>
            </div>

            {/* Follow us */}
            <div>
                <h3 className="text-lg text-gray-800 mb-4">Follow Us</h3>
                <div className="flex items-center space-x-4 mb-6">
                    <a href="https://www.facebook.com/share/1AAyn1W8kJ/" className='hover:text-gray-300'>
                        <FaFacebookF className='h-5 w-5' />
                    </a>
                    <a href="#" className='hover:text-gray-300'>
                        <IoLogoInstagram className='h-5 w-5' />
                    </a>
                    <a href="#" className='hover:text-gray-300'>
                        <RiTwitterXFill className='h-5 w-5' />
                    </a>
                    <a href="#" className='hover:text-gray-300'>
                        <FaTiktok className='h-5 w-5' />
                    </a>
                    <a href="#" className='hover:text-gray-300'>
                        <TbBrandMeta className='h-5 w-5' />
                    </a>
                </div>
                <p className="text-gray-500">Call Us</p>
                <p>
                    <TbFilePhone className="inline-block mr-2" />
                    (+237) 681423149
                </p>
            </div>
        </div>

        {/* Footer bottom */}
        <div className="container mx-auto mt-12 px-4 lg:px-0 border-t border-gray-200 pt-6">
            <p className="text-gray-500 text-sm tracking-tighter text-center">
              {'\u00a9'} 2026, compileTab. All rights Reserved by Awakening Group
            </p>
        </div>
   </footer>
  )
}

export default Footer
