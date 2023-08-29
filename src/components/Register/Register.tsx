import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import bcrypt from "bcryptjs";
import { Link } from "react-router-dom";
import { BiHeart } from "react-icons/bi";

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    phone: "",
    passcode: "",
  });

  const navigate = useNavigate();
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Hash the passcode
    const salt = await bcrypt.genSalt(10);
    const hashedPasscode = await bcrypt.hash(formData.passcode, salt);

    // Replace plain text passcode with hashed one
    const payload = {
      ...formData,
      passcode: hashedPasscode,
    };

    try {
      const response = await fetch(
        "https://nginx.yongxinguanai.com/api/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const responseText = await response.text(); // Add this line
      console.log("Response Text:", responseText); // Add this line

      const data = JSON.parse(responseText); // Replace this line with existing line to parse JSON

      if (response.ok && data.success) {
        setSuccessMsg("创建账号成功!");
        // Optionally, navigate to another page after some delay
        setTimeout(() => navigate("/signup_caregiver"), 2000);
      } else {
        // Handle error
        console.error("注册失败:", data);
      }
    } catch (error) {
      console.error("注册失败:", error);
    }
  };

  return (
    <div>
      <div className="flex items-center mx-9 py-3">
        <Link
          to="/"
          className="flex items-center text-black no-underline ml-0" // Remove 'mx-8 py-3' and add 'ml-0' to push it to the far left
        >
          <BiHeart size={30} className="text-red-500 heart-icon my-auto" />
          <h1 className="font-bold text-3xl ml-2 my-auto align-middle text-red-500">
            关爱网
          </h1>
        </Link>
      </div>

      <hr className="border-t border-black-300 mx-1 my-2" />

      {successMsg && (
        <div className="text-green-500 text-center mb-4">{successMsg}</div>
      )}
      <form
        onSubmit={handleRegisterSubmit}
        className="max-w-md mx-auto w-full md:w-1/2 lg:w-1/3"
      >
        {/* ... Other input fields for name, description, age, etc. ... */}
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
          注册
        </button>
      </form>
    </div>
  );
};

export default Register;
