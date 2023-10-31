import React, { useState } from "react";
import { Link } from "react-router-dom";
import { BiHeart } from "react-icons/bi";
import AD3 from "./ad3.png";
import AD4 from "./ad4.png";
import AD5 from "./ad5.png";
import AD8 from "./ad8.png";
import User1 from "./user1.png";
import User2 from "./user2.png";
import User3 from "./user3.png";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const { signIn, currentUser } = useAuth();
  console.log("homepage currentuser:", currentUser?.phone)

  const checkAuthenticationAndNavigate = (userType: string) => {
    if (currentUser) {
      // Assuming `currentUser` comes from `useAuth()`
      // Navigate user to their dashboard or any other route you see fit
      // Depending on the `userType` you might want to navigate to different dashboards
      if (userType === "caregiver") {
        navigate(
          `/careneeders/phone/${currentUser.phone}/userType/${userType}`
        );
      } else if (userType === "careneeder") {
        navigate(`/caregivers/phone/${currentUser.phone}/userType/${userType}`);
      } else if (userType === "animalcaregiver") {
        navigate(
          `/animalcareneeders/phone/${currentUser.phone}/userType/${userType}`
        );
      } else if (userType === "animalcareneeder") {
        navigate(
          `/animalcaregivers/phone/${currentUser.phone}/userType/${userType}`
        );
      }
    } else {
      // If not logged in, navigate to the respective sign-in page
      navigate(`/signin/${userType}`);
    }
  };

  return (
    <div className="relative container mx-auto px-6 py-2">
      <header className="flex w-full justify-center items-center h-20 text-white relative px-2 md:px-1 mx-auto">
        {/* Logo */}
        <div className="absolute left-8 flex items-center">
          <BiHeart size={30} className="text-red-500 heart-icon my-auto" />
          <h1 className="font-bold text-red-500 text-3xl ml-2 my-auto">
            关爱网
          </h1>
        </div>
      </header>

      <hr className="border-t border-black-300 mx-1 my-1" />

      {/* New Image Container */}
      <div className="flex flex-wrap justify-between items-center my-0">
        <div className="w-full md:w-1/2 p-0 md:p-2">
          <img
            src="https://cdn.animaapp.com/projects/64fb8a71af563afc18530806/releases/64fb8af17216e74c07a20a05/img/screenshot-2023-09-08-at-1-06-1.png"
            alt="Description of First Image"
            className="w-full h-full object-cover rounded flex-grow"
          />
        </div>
        <div className="hidden md:w-1/2 md:block p-2">
          <img
            src="https://cdn.animaapp.com/projects/64fb8a71af563afc18530806/releases/64fb8af17216e74c07a20a05/img/screenshot-2023-09-08-at-1-01-1.png"
            alt="Description of Second Image"
            className="w-full h-[300px] md:h-[400px] object-contain object-right-bottom rounded"
          />
        </div>
      </div>

      {/* Pinkish rounded rectangle */}
      <div className="flex justify-center relative bg-cyan-200 rounded-lg my-4 p-4 h-[200px] z-0">
        <h5>寻找你身边的帮工</h5>
      </div>

      <div className="grid grid-cols-2 gap-2 -mt-12 hover:z-10 md:flex md:flex-row md:mt-0 justify-between">
        {/* Make this button overlap with the pinkish section on mobile */}
        <button 
          onClick={() => checkAuthenticationAndNavigate("caregiver")}
          className="flex-none p-6 rounded-lg bg-white hover:bg-gray-600 transition duration-300 flex flex-col items-center justify-center m-1 shadow-md -mt-8 md:mt-0 z-10"
        >
          <img src={AD3} alt="caregiver" className="w-20 h-16 mb-3" />
          <span className="text-black text-sm no-underline">成为护工</span>
        </button>

        <button
          onClick={() => checkAuthenticationAndNavigate("careneeder")}
          className="flex-none p-6 rounded-lg bg-white hover:bg-gray-600 transition duration-300 flex flex-col items-center justify-center m-1 shadow-md -mt-8 md:mt-0 z-10"
        >
          <img src={AD4} alt="careneeder" className="w-20 h-16 mb-3" />
          <span className="text-black text-sm no-underline">雇主发布</span>
        </button>

        <button
          onClick={() => checkAuthenticationAndNavigate("animalcaregiver")}
          className="flex-none p-6 rounded-lg bg-white hover:bg-gray-600 transition duration-300 flex flex-col items-center justify-center m-1 shadow-md -mt-8 md:mt-0 z-10"
        >
          <img src={AD5} alt="animalcaregiver" className="w-20 h-16 mb-3" />
          <span className="text-black text-sm no-underline">成为宠托师</span>
        </button>

        <button
          onClick={() => checkAuthenticationAndNavigate("animalcareneeder")}
          className="flex-none p-6 rounded-lg bg-white hover:bg-gray-600 transition duration-300 flex flex-col items-center justify-center m-1 shadow-md -mt-8 md:mt-0 z-10"
        >
          <img src={AD8} alt="animalcareneeder" className="w-20 h-16 mb-3" />
          <span className="text-black text-sm no-underline">宠物托管</span>
        </button>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="flex flex-col m-2 shadow-md p-4 rounded-lg">
            <div className="flex flex-row items-center mb-4">
              <img
                src={User1}
                alt="User 1"
                className="w-16 h-16 rounded-full"
              />
              <span className="text-black font-bold ml-4">陈女士</span>
            </div>
            <p className="text-gray-700">
              护工对我肠梗阻手术后的母亲提供了非常专业和细心的服务。他们不仅技术娴熟，还很有爱心和耐心。让我母亲在康复过程中感到非常安心和舒适。强烈推荐！
            </p>
          </div>

          <div className="flex flex-col m-2 shadow-md p-4 rounded-lg">
            <div className="flex flex-row items-center mb-4">
              <img
                src={User2}
                alt="User 2"
                className="w-16 h-16 rounded-full"
              />
              <span className="text-black font-bold ml-4">张女士</span>
            </div>
            <p className="text-gray-700">
              由于工作原因，我无法每时每刻照顾我有阿尔兹海默症的父亲，但是我有幸找到一位经验丰富的长期护工，这样我不在家的时候，也不会担心我父亲出现任何意外了。
            </p>
          </div>

          <div className="flex flex-col m-2 shadow-md p-4 rounded-lg">
            <div className="flex flex-row items-center mb-4">
              <img
                src={User3}
                alt="User 3"
                className="w-16 h-16 rounded-full"
              />
              <span className="text-black font-bold ml-4">王先生</span>
            </div>
            <p className="text-gray-700">
              强烈推荐小玲护工，她工作能力出色，高效又细致。具备很强的责任心和对细节的敏感度。如果你需要一个负责的人，她就是你的首选。非常诚实，让我随时都能信任她照看我的家。
            </p>
          </div>
        </div>
      </div>

      <footer className="bg-gray-200 text-black py-4 mt-8">
        <div className="container mx-auto flex flex-wrap">
          {/* About Section */}
          <div className="w-full md:w-1/4 text-center md:text-left ">
            <h5 className="uppercase mb-6 font-bold">关于关爱网</h5>
            <ul className="mb-4">
              <li className="mt-2">
                <Link to="/" className="hover:underline">
                  关于我们
                </Link>
              </li>
              <li className="mt-2">
                <Link to="/" className="hover:underline">
                  联系我们
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="w-full md:w-1/4 text-center md:text-left">
            <h5 className="uppercase mb-6 font-bold">快速链接</h5>
            <ul className="mb-4">
              <li className="mt-2">
                <Link to="/signin/caregiver" className="hover:underline">
                  护工登陆
                </Link>
              </li>
              <li className="mt-2">
                <Link to="/signin/careneeder" className="hover:underline">
                  雇主登陆
                </Link>
              </li>
              <li className="mt-2">
                <Link to="/register/caregiver" className="hover:underline">
                  护工注册
                </Link>
              </li>
              <li className="mt-2">
                <Link to="/register/careneeder" className="hover:underline">
                  雇主注册
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div className="w-full md:w-1/4 text-center md:text-left">
            <h5 className="uppercase mb-6 font-bold">社交媒体</h5>
            <ul className="mb-4">
              <li className="mt-2">
                <a href="#" className="hover:underline">
                  Facebook
                </a>
              </li>
              <li className="mt-2">
                <a href="#" className="hover:underline">
                  Twitter
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Us */}
          <div className="w-full md:w-1/4 text-center md:text-left">
            <h5 className="uppercase mb-6 font-bold">联系方式</h5>
            <ul className="mb-4">
              <li className="mt-2">
                <span>Email: info@guanaiwang.com</span>
              </li>
              <li className="mt-2">
                <span>电话: +1 (555) 123-4567</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-sm">©2023 关爱网. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
