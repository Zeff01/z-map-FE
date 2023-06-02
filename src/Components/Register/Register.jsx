import "./Register.css";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import CancelIcon from "@mui/icons-material/Cancel";
import { useRef } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";

const userRegisterSuccess = () => {
  toast.success("Registered successfully!");
};

const userRegisterFail = () => {
  toast.error("Failed to register!");
};

export default function Register({ setShowRegister }) {
  const nameRef = useRef();
  const emailRef = useRef();
  const passRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newUser = {
      userName: nameRef.current.value,
      email: emailRef.current.value,
      password: passRef.current.value,
    };

    try {
      await axios.post(
        "https://z-map-be.onrender.com/api/users/register",
        newUser
      );
      userRegisterSuccess();
      setShowRegister(false);
    } catch (err) {
      userRegisterFail();
    }
  };

  return (
    <div className="register_container bg-gray-100 rounded-lg p-4 shadow-md">
      <div className="flex items-center mb-4">
        <ExitToAppIcon className="mr-2 text-blue-500" />
        <h2 className="text-xl font-bold">Create a profile</h2>
      </div>
      <form onSubmit={handleSubmit}>
        <input
          className="input_field mb-2 bg-white rounded px-4 py-2 border border-gray-300 focus:outline-none focus:border-blue-500"
          type="text"
          placeholder="Username"
          ref={nameRef}
        />
        <input
          className="input_field mb-2 bg-white rounded px-4 py-2 border border-gray-300 focus:outline-none focus:border-blue-500"
          type="email"
          placeholder="Email"
          ref={emailRef}
        />
        <input
          className="input_field mb-2 bg-white rounded px-4 py-2 border border-gray-300 focus:outline-none focus:border-blue-500"
          type="password"
          placeholder="Password"
          ref={passRef}
        />
        <button className="register_btn bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
          Register
        </button>
      </form>
      <CancelIcon
        className="register_cancel cursor-pointer text-gray-500 hover:text-gray-600"
        onClick={() => setShowRegister(false)}
      />
    </div>
  );
}
