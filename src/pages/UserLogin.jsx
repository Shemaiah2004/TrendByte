import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice.js";
import background from "../images/background.jpg";
import { toast } from 'react-toastify';

export default function UserLogin() {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch("/api/user/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: 'include' // Important for session cookies
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        toast.error(data.message);
        return;
      }
      dispatch(signInSuccess(data));
      toast.success('Sign in successful!');
      navigate("/");
    } catch (error) {
      dispatch(signInFailure(error.message));
      toast.error(error.message);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${background})` }}>
      <div className="absolute inset-0 bg-black opacity-50"></div> {/* Dark overlay */}
      <div className="relative z-10 bg-white bg-opacity-80 p-10 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-4xl font-extrabold text-center text-red-600 mb-8">Sign In</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <input
            type="email"
            placeholder="Email"
            className="border-2 border-red-500 p-4 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-600"
            id="email"
            onChange={handleChange}
            disabled={loading}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="border-2 border-red-500 p-4 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-600"
            id="password"
            onChange={handleChange}
            disabled={loading}
            required
          />
          <button
            disabled={loading}
            className={`${
              loading 
                ? "opacity-80 cursor-not-allowed bg-red-400" 
                : "bg-red-500 hover:bg-red-600"
            } text-lg font-semibold mt-4 transition-all ease-in-out duration-200 text-white py-3 px-8 rounded-full flex items-center justify-center`}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Signing in...</span>
              </div>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center">
            {error}
          </div>
        )}

        {/* Register Page Link */}
        <div className="mt-4 text-center">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <span
              onClick={() => !loading && navigate("/register")}
              className={`text-red-600 ${!loading ? "cursor-pointer hover:underline" : "cursor-not-allowed"}`}
            >
              Register here
            </span>
          </p>
        </div>

        {/* Employee Login Link */}
        <div className="mt-4 text-center">
          <p className="text-gray-600">
            Are you an employee?{" "}
            <span
              onClick={() => !loading && navigate("/employeeLogin")}
              className={`text-red-600 ${!loading ? "cursor-pointer hover:underline" : "cursor-not-allowed"}`}
            >
              Employee Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}