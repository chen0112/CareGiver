import { Link } from "react-router-dom";
import { BiHeart } from "react-icons/bi";
import useWindowSize from "./useWindowSize";

const HeaderLogo = () => {
  const { width } = useWindowSize(); // This hook returns the current window size
  const isMobile = width !== undefined && width < 768; // Check if width is defined before comparing

  return (
    <div className="flex items-center mx-3 py-3">
      <Link to="/" className="flex items-center text-black no-underline ml-0">
        <BiHeart
          size={isMobile ? 24 : 30} // Use 'isMobile' to conditionally set the size
          className={`text-red-500 heart-icon my-auto ${
            isMobile ? "" : "md:text-3xl"
          }`}
        />
        <h1
          className={`font-bold ${
            isMobile ? "text-2xl" : "text-3xl"
          } my-auto align-middle text-red-500`}
        >
          关爱网
        </h1>
      </Link>
    </div>
  );
};

export default HeaderLogo;
