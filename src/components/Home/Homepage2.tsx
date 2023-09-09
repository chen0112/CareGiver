import React, { useState } from "react";
import { Link } from "react-router-dom";
import { BiHeart } from "react-icons/bi";
import { AiOutlineClose } from "react-icons/ai";
import { HiOutlineMenuAlt4 } from "react-icons/hi";
import "./style.css";

const HomePage2: React.FC = () => {
  const [nav, setNav] = useState(false);
  const [logo, setLogo] = useState(false);
  const handleNav = () => {
    setNav(!nav);
    setLogo(!logo);
  };

  return (
    <div className="index">
      <div className="div">
        <div className="navbar">
          <div className="text-wrapper">关爱网</div>
          <Link to="/signin/caregiver">
            <div className="text-wrapper-2">成为护工</div>
          </Link>
          <Link to="/signin/caregiver">
            <div className="text-wrapper-3">登陆</div>
          </Link>
          <div className="overlap-group">
            <Link to="/signin/caregiver">
              <div className="text-wrapper-4">注册</div>
            </Link>
          </div>
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
                  雇主发布
                </Link>
              </li>
              <li>
                <Link to="/careneeders" className="text-black">
                  雇主广告
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="hero">
          <img
            className="screenshot"
            alt="Screenshot"
            src="https://cdn.animaapp.com/projects/64fb8a71af563afc18530806/releases/64fb8af17216e74c07a20a05/img/screenshot-2023-09-08-at-1-01-1.png"
          />
          <img
            className="img"
            alt="Screenshot"
            src="https://cdn.animaapp.com/projects/64fb8a71af563afc18530806/releases/64fb8af17216e74c07a20a05/img/screenshot-2023-09-08-at-1-06-1.png"
          />
          <div className="text-wrapper-5">
            欢迎来到我们独一无二的护工平台，这里是连接护工和需要护工的人的免费市场。在这里，您不需要担心有中间人插手赚取高额费用，因为我们的目标是直接、高效、公平地为您服务。更值得一提的是，我们的护工都经过严格的资质审核和专业培训，确保为您提供最高水平的照护服务。无论您是护工还是需要照护的人，我们的平台都将为您提供一个安全、可靠、高效的连接渠道。立即加入我们，体验无中介、高质量照护的全新模式！
          </div>
          <div className="text-wrapper-6">国内最大护工平台</div>
        </div>
        <div className="services">
          <div className="pet-care">
            <Link to="/caregivers">
              <div className="overlap-group-2">
                <img
                  className="screenshot-2"
                  alt="Screenshot"
                  src="https://cdn.animaapp.com/projects/64fb8a71af563afc18530806/releases/64fb8af17216e74c07a20a05/img/screenshot-2023-09-08-at-1-45-1@2x.png"
                />
                <div className="text-wrapper-7">护工展示</div>
              </div>
            </Link>
          </div>
          <div className="senior-care">
            <Link to="/signin/careneeder">
              <div className="overlap">
                <div className="text-wrapper-8">雇主发布</div>
                <img
                  className="screenshot-3"
                  alt="Screenshot"
                  src="https://cdn.animaapp.com/projects/64fb8a71af563afc18530806/releases/64fb8af17216e74c07a20a05/img/screenshot-2023-09-08-at-1-44-1@2x.png"
                />
              </div>
            </Link>
          </div>
          <div className="caregiver-showcase">
            <Link to="/careneeders">
              <div className="overlap-2">
                <div className="text-wrapper-9">雇主广告</div>
                <img
                  className="screenshot-4"
                  alt="Screenshot"
                  src="https://cdn.animaapp.com/projects/64fb8a71af563afc18530806/releases/64fb8af17216e74c07a20a05/img/screenshot-2023-09-08-at-1-47-1@2x.png"
                />
              </div>
            </Link>
          </div>
        </div>
        <div className="user-review">
          <div className="overlap-3">
            <div className="rectangle" />
            <img
              className="mask-group"
              alt="Mask group"
              src="https://cdn.animaapp.com/projects/64fb8a71af563afc18530806/releases/64fb8af17216e74c07a20a05/img/mask-group@2x.png"
            />
            <div className="text-wrapper-10">张女士</div>
            <div className="text-wrapper-11">
              护工对我肠梗阻手术后的母亲提供了非常专业和细心的服务。他们不仅技术娴熟，还很有爱心和耐心。让我母亲在康复过程中感到非常安心和舒适。强烈推荐！
            </div>
          </div>
          <div className="overlap-4">
            <div className="rectangle" />
            <img
              className="mask-group-2"
              alt="Mask group"
              src="https://cdn.animaapp.com/projects/64fb8a71af563afc18530806/releases/64fb8af17216e74c07a20a05/img/mask-group-1@2x.png"
            />
            <div className="text-wrapper-12">陈女士</div>
            <div className="text-wrapper-13">
              由于工作原因，我无法每时每刻照顾我有阿尔兹海默症的父亲，但是我有幸找到一位经验丰富的长期护工，这样我不在家的时候，也不会担心我父亲出现任何意外了。
            </div>
          </div>
          <div className="overlap-5">
            <div className="rectangle" />
            <img
              className="mask-group-3"
              alt="Mask group"
              src="https://cdn.animaapp.com/projects/64fb8a71af563afc18530806/releases/64fb8af17216e74c07a20a05/img/mask-group-2@2x.png"
            />
            <div className="text-wrapper-14">王先生</div>
            <div className="text-wrapper-15">
              强烈推荐小玲护工，她工作能力出色，高效又细致。具备很强的责任心和对细节的敏感度。如果你需要一个负责的人，她就是你的首选。非常诚实，让我随时都能信任她照看我的家。
            </div>
          </div>
          <img
            className="rating-stars"
            alt="Rating stars"
            src="https://cdn.animaapp.com/projects/64fb8a71af563afc18530806/releases/64fb8af17216e74c07a20a05/img/rating-stars.svg"
          />
          <img
            className="rating-stars-2"
            alt="Rating stars"
            src="https://cdn.animaapp.com/projects/64fb8a71af563afc18530806/releases/64fb8af17216e74c07a20a05/img/rating-stars.svg"
          />
          <img
            className="rating-stars-3"
            alt="Rating stars"
            src="https://cdn.animaapp.com/projects/64fb8a71af563afc18530806/releases/64fb8af17216e74c07a20a05/img/rating-stars.svg"
          />
          <div className="text-wrapper-16">用户评价</div>
        </div>
      </div>
    </div>
  );
};

export default HomePage2;
