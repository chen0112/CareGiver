import React, { useState } from "react";
import { Link } from "react-router-dom";
import { BiHeart } from "react-icons/bi";
import { AiOutlineClose } from "react-icons/ai";
import { HiOutlineMenuAlt4 } from "react-icons/hi";
import backGroundVideo from "../../assets/Backgound.mp4";

const HomePage: React.FC = () => {
  const [nav, setNav] = useState(false);
  const [logo, setLogo] = useState(false);
  const handleNav = () => {
    setNav(!nav);
    setLogo(!logo);
  };

  return (
    <>
      <div className="container mx-auto px-6 py-2 absolute z-10">
        <header className="flex w-full justify-center items-center h-20 text-white relative px-4 md:px-0">
          {/* Logo */}
          <div className="absolute left-4 flex items-center">
            <BiHeart size={30} className="text-red-500 heart-icon my-auto" />
            <h1 className="font-bold text-3xl ml-2 my-auto">关爱网</h1>
          </div>

          {/* Links (Center-aligned) */}
          <ul className="hidden md:flex justify-center space-x-8 items-center m-0 p-0">
            <li>
              <Link
                to="/signin/caregiver"
                className="no-underline text-white font-bold py-2 px-4 rounded"
              >
                成为护工
              </Link>
            </li>
            <li>
              <Link
                to="/caregivers"
                className="no-underline text-white font-bold py-2 px-4 rounded"
              >
                护工展示
              </Link>
            </li>
            <li>
              <Link
                to="/signin/careneeder"
                className="no-underline text-white font-bold py-2 px-4 rounded"
              >
                雇主发布
              </Link>
            </li>
            <li>
              <Link
                to="/careneeders"
                className="no-underline text-white font-bold py-2 px-4 rounded"
              >
                雇主广告
              </Link>
            </li>
          </ul>

          {/* Mobile Menu Icon */}
          <div
            onClick={handleNav}
            className="md:hidden z-10 absolute right-4 top-1/2 transform -translate-y-1/2"
          >
            {nav ? (
              <AiOutlineClose className="text-black" size={20} />
            ) : (
              <HiOutlineMenuAlt4 size={20} />
            )}
          </div>

          {/* Mobile menu dropdown */}
          <div
            onClick={handleNav}
            className="md:hidden z-10 absolute right-4 top-1/2 transform -translate-y-1/2"
          >
            {nav ? (
              <AiOutlineClose className="text-black" size={20} />
            ) : (
              <HiOutlineMenuAlt4 size={20} />
            )}
          </div>

          {/* Mobile menu dropdown */}
          <div
            className={
              nav
                ? "absolute text-black left-0 top-0 w-full bg-gray-100 transition-all ease-in-out duration-500"
                : "absolute left-0 top-0 w-full bg-gray-100 transition-all ease-in-out duration-500 h-0 overflow-hidden"
            }
          >
            <ul className={nav ? "py-4 px-7" : "h-0 overflow-hidden"}>
              <h1 className="font-bold text-3xl ml-2 my-auto align-middle text-red-500">
                关爱网
              </h1>

              <hr className="border-t border-black-300 mx-1 my-2" />

              <li>
                <Link to="/signin/caregiver" className="text-black">
                  成为护工
                </Link>
              </li>
              <li>
                <Link to="/caregivers" className="text-black">
                  护工展示
                </Link>
              </li>
              <li>
                <Link to="/signin/careneeder" className="text-black">
                  寻找护工
                </Link>
              </li>
              <li>
                <Link to="/careneeders" className="text-black">
                  招聘护工
                </Link>
              </li>
            </ul>
          </div>
        </header>
      </div>
      <div className="w-screen h-screen overflow-hidden">
        <video
          autoPlay
          loop
          muted
          className="w-full h-full object-cover absolute top-0 left-0 z-0"
          src={backGroundVideo}
        />
      </div>
    </>
  );
};

export default HomePage;
