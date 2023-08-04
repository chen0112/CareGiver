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
        <header className="flex w-full justify-between items-center h-20 text-white">
          <div className="flex items-center">
            <BiHeart size={30} className="text-red-500 heart-icon my-auto" />
            <h1
              onClick={handleNav}
              className={`font-bold text-3xl ml-2 my-auto ${
                logo ? "hidden" : "block"
              }`}
            >
              关爱网
            </h1>
          </div>
          <ul className="hidden md:flex justify-center space-x-8 items-center m-0 p-0">
            <li>
              <Link
                to="/signup"
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
          </ul>

          <BiHeart
            size={30}
            className="hidden md:block text-red-500 heart-icon my-auto"
          />

          <div onClick={handleNav} className="md:hidden z-10">
            {nav ? (
              <AiOutlineClose className="text-black" size={20} />
            ) : (
              <HiOutlineMenuAlt4 size={20} />
            )}
          </div>

          {/* Mobile menu dropdown */}
          <div
            onClick={handleNav}
            className={
              nav
                ? "absolute text-black left-0 top-0 w-full bg-gray-100/90 px-4 py-7 flex flex-col"
                : "absolute left-[-100%]"
            }
          >
            <ul>
              <h1>关爱网</h1>
              <li>
                <Link to="/signup">成为护工</Link>
              </li>
              <li>
                <Link to="/caregivers">护工展示</Link>
              </li>
              <li className="border-b">Travel</li>
              <li className="border-b">View</li>
              <li className="border-b">Book</li>
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
