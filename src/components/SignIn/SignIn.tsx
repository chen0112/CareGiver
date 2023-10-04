import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { BiHeart } from "react-icons/bi";

interface SignInProps {
  userType: "caregiver" | "careneeder" | "animalcaregiver" | "animalcareneeder"; // Define the valid user types here
}

const SignIn: React.FC<SignInProps> = ({ userType }) => {
  const [formData, setFormData] = useState({
    phone: "",
    passcode: "",
  });

  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "https://nginx.yongxinguanai.com/api/signin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        // Check if the user has posted ads before
        if (data.hasPostedAds) {
          // Use dynamic navigation paths based on userType
          if (userType === "caregiver") {
            navigate(`/careneeders/phone/${formData.phone}`);
          } else if (userType === "careneeder") {
            navigate(`/caregivers/phone/${formData.phone}`);
          } else if (userType === "animalcaregiver") {
            navigate(`/animalcareneeders/phone/${formData.phone}`);
          } else if (userType === "animalcareneeder") {
            navigate(`/animalcaregivers/phone/${formData.phone}`);
          }
        } else {
          // Use dynamic navigation paths based on userType
          navigate(`/signup_${userType}`);
        }
      } else {
        // Handle error
        setErrorMsg("登录失败: " + data.message);
      }
    } catch (error: any) {
      console.error("登录失败:", error);
      setErrorMsg("登录失败: " + error.message);
    }
  };

  return (
    <div>
      <div className="flex items-center mx-9 py-3">
        <Link
          to="/"
          className="flex items-center mx-8 py-3 text-black no-underline"
        >
          <BiHeart size={30} className="text-red-500 heart-icon my-auto" />
          <h1 className="font-bold text-4xl ml-2 my-auto align-middle text-red-500">
            关爱网
          </h1>
        </Link>
      </div>

      <hr className="border-t border-black-300 mx-1 my-2" />

      {errorMsg && (
        <div className="text-red-500 text-center mb-4">{errorMsg}</div>
      )}
      <form
        onSubmit={handleSignInSubmit}
        className="max-w-md mx-auto w-full md:w-1/2 lg:w-1/3"
      >
        <div className="flex flex-col items-center justify-center bg-white shadow p-4 rounded-lg mb-4">
          <label className="mb-2 text-gray-700" htmlFor="phone">
            电话:
          </label>
          <input
            className="border border-gray-300 rounded-md p-2 w-full"
            placeholder="联系方式"
            title="请输入联系方式"
            required={true}
            type="text"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-col items-center justify-center bg-white shadow p-4 rounded-lg mb-4">
          <label className="mb-2 text-gray-700" htmlFor="passcode">
            密码:
          </label>
          <input
            className="border border-gray-300 rounded-md p-2 w-full"
            placeholder="请输入密码"
            title="请输入密码"
            required={true}
            type="password"
            id="passcode"
            name="passcode"
            value={formData.passcode}
            onChange={handleChange}
          />
        </div>

        <button
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
          type="submit"
        >
          登录
        </button>
      </form>
      <div className="text-center mt-4">
        <Link
          to={`/register/${userType}`}
          className="text-blue-600 hover:text-blue-800"
        >
          没有账号? 注册
        </Link>
      </div>
    </div>
  );
};

export default SignIn;
