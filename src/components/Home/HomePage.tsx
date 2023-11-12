import React, { useState } from "react";
import { Link } from "react-router-dom";
import AD3 from "./ad3.png";
import AD4 from "./ad4.png";
import AD5 from "./ad5.png";
import AD8 from "./ad8.png";
import User1 from "./user1.png";
import User2 from "./user2.png";
import User3 from "./user3.png";
import header1 from "./header1.png";
import header2 from "./header2.png";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { SearchOutlined } from "@ant-design/icons";
import HeaderLogo from "../HeaderLogoComponent/HeaderLogo";

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const { signIn, currentUser } = useAuth();
  console.log("homepage currentuser:", currentUser?.phone);

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

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false, // to use default tailwind styles without arrows
    className: "md:hidden", // only display on mobile
  };

  const [location, setLocation] = useState<string>("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocation(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && location.trim()) {
      navigate("/signin/caregiver");
    }
  };

  return (
    <div className="relative py-1 bg-warm-beige">
      <header className="flex w-full justify-left items-center text-white relative px-2 md:px-1 mx-auto">
        {/* Logo */}
        < HeaderLogo/>
      </header>

      <hr className="border-t border-black-300 mx-1 my-1" />
      {/* New Image Container */}
      <div className="flex flex-wrap mx-6 justify-between items-center my-0">
        <div className="w-full md:w-1/2 md:p-1">
          <img
            src={header1}
            alt="Description of First Image"
            className="w-full h-full object-cover rounded"
          />
        </div>
        <div className="hidden md:w-1/2 md:block p-2">
          <img
            src={header2}
            alt="Description of Second Image"
            className="w-full h-full object-cover rounded "
          />
        </div>
      </div>

      {/* Pinkish rounded rectangle */}
      <div className="flex flex-col mx-6 items-center justify-center relative bg-soft-peach rounded-lg p-4 h-[200px] z-0">
        <h5 className="text-center mb-4 text-dark-gray">寻找你身边的帮工</h5>
        <div className="relative w-3/4">
          <input
            type="text"
            value={location}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="输入地点..."
            className="ml-1 w-full px-10 py-2 border rounded-md shadow-sm focus:outline-none focus:border-blue-300"
          />
          <SearchOutlined className="absolute text-gray-400 left-3 top-1/2 transform -translate-y-2/4 ml-1" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 -mt-10 hover:z-10 mx-8 md:flex md:flex-row md:mt-0 justify-between">
        {/* Make this button overlap with the pinkish section on mobile */}
        <button
          onClick={() => checkAuthenticationAndNavigate("caregiver")}
          className="flex-none p-6 rounded-lg bg-light-gray hover:bg-gray-600 transition duration-300 flex flex-col items-center justify-center m-1 shadow-md -mt-8 md:mt-0 z-10"
        >
          <img src={AD3} alt="caregiver" className="w-20 h-16 mb-3" />
          <span className="text-dark-gray font-bold text-sm no-underline">成为护工</span>
        </button>

        <button
          onClick={() => checkAuthenticationAndNavigate("careneeder")}
          className="flex-none p-6 rounded-lg bg-light-gray hover:bg-gray-600 transition duration-300 flex flex-col items-center justify-center m-1 shadow-md -mt-8 md:mt-0 z-10"
        >
          <img src={AD4} alt="careneeder" className="w-20 h-16 mb-3" />
          <span className="text-dark-gray font-bold text-sm no-underline">雇主发布</span>
        </button>

        <button
          onClick={() => checkAuthenticationAndNavigate("animalcaregiver")}
          className="flex-none p-6 rounded-lg bg-light-gray hover:bg-gray-600 transition duration-300 flex flex-col items-center justify-center m-1 shadow-md -mt-8 md:mt-0 z-10"
        >
          <img src={AD5} alt="animalcaregiver" className="w-20 h-16 mb-3" />
          <span className="text-dark-gray font-bold text-sm no-underline">成为宠托师</span>
        </button>

        <button
          onClick={() => checkAuthenticationAndNavigate("animalcareneeder")}
          className="flex-none p-6 rounded-lg bg-light-gray hover:bg-gray-600 transition duration-300 flex flex-col items-center justify-center m-1 shadow-md -mt-8 md:mt-0 z-10"
        >
          <img src={AD8} alt="animalcareneeder" className="w-20 h-16 mb-3" />
          <span className="text-dark-gray font-bold text-sm no-underline">宠物托管</span>
        </button>
      </div>

      <div className="container mx-auto px-6 py-8 md:hidden">
        <div className="reviews-carousel">
          <Slider {...settings}>
            {/* Repeat the following block for each review */}
            <div className="flex flex-col m-2 shadow-md p-4 rounded-lg">
              <div className="flex flex-row items-center mb-4">
                <img
                  src={User1}
                  alt="User 1"
                  className="w-16 h-16 rounded-full"
                />
                <span className="text-dark-gray font-bold ml-4">陈女士</span>
              </div>
              <p className="text-dark-gray">
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
                <span className="text-dark-gray font-bold ml-4">张女士</span>
              </div>
              <p className="text-dark-gray">
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
                <span className="text-dark-gray font-bold ml-4">王先生</span>
              </div>
              <p className="text-dark-gray">
                强烈推荐小玲护工，她工作能力出色，高效又细致。具备很强的责任心和对细节的敏感度。如果你需要一个负责的人，她就是你的首选。非常诚实，让我随时都能信任她照看我的家。
              </p>
            </div>
            {/* End of review block */}
          </Slider>
        </div>
      </div>

      <div className="hidden md:flex md:flex-row justify-between">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="flex flex-col m-2 shadow-md p-4 rounded-lg">
            <div className="flex flex-row items-center mb-4">
              <img
                src={User1}
                alt="User 1"
                className="w-16 h-16 rounded-full"
              />
              <span className="text-dark-gray font-bold ml-4">陈女士</span>
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
              <span className="text-dark-gray font-bold ml-4">张女士</span>
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
              <span className="text-dark-gray font-bold ml-4">王先生</span>
            </div>
            <p className="text-gray-700">
              强烈推荐小玲护工，她工作能力出色，高效又细致。具备很强的责任心和对细节的敏感度。如果你需要一个负责的人，她就是你的首选。非常诚实，让我随时都能信任她照看我的家。
            </p>
          </div>
        </div>
      </div>

      <footer className="text-black py-4 mt-8">
        <div className="container mx-auto flex flex-wrap">
          {/* About Section */}
          <div className="w-full md:w-1/4 text-center md:text-left ">
            <h5 className="uppercase mb-6 text-gray-700 font-bold">关于关爱网</h5>
            <ul className="mr-8 mb-4">
              <li className="mt-2">
                <Link to="/" className=" no-underline hover:underline text-gray-700">
                  关于我们
                </Link>
              </li>
              <li className="mt-2">
                <Link to="/" className="no-underline hover:underline text-gray-700">
                  联系我们
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="w-full md:w-1/4 text-center md:text-left">
            <h5 className="uppercase mb-6 font-bold text-gray-700">快速链接</h5>
            <ul className="mr-8 mb-4">
              <li className="mt-2">
                <Link to="/signin/caregiver" className="no-underline hover:underline text-gray-700">
                  护工登陆
                </Link>
              </li>
              <li className="mt-2">
                <Link to="/signin/careneeder" className="no-underline hover:underline text-gray-700">
                  雇主登陆
                </Link>
              </li>
              <li className="mt-2">
                <Link to="/register/caregiver" className="no-underline hover:underline text-gray-700">
                  护工注册
                </Link>
              </li>
              <li className="mt-2">
                <Link to="/register/careneeder" className="no-underline hover:underline text-gray-700">
                  雇主注册
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div className="w-full md:w-1/4 text-center md:text-left">
            <h5 className="uppercase no-underline mb-6 font-bold">社交媒体</h5>
            <ul className="mr-8 mb-4">
              <li className="mt-2">
                <a href="#" className="no-underline hover:underline">
                  Facebook
                </a>
              </li>
              <li className="mt-2">
                <a href="#" className="no-underline hover:underline">
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
