import "./Login.css";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import CancelIcon from "@mui/icons-material/Cancel";
import { useRef } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";

const userRegisterSuccess = () => {
  toast.success("Login successfully!");
};

const userRegisterFail = () => {
  toast.error("Login failed!");
};

export default function Login({ setShowLogin, myStorage, setCurrentUser }) {
  const nameRef = useRef();
  const passRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newUser = {
      userName: nameRef.current.value,
      password: passRef.current.value,
    };

    try {
      const responce = await axios.post(
        "https://z-map-be.onrender.com/api/users/login",
        newUser
      );
      userRegisterSuccess();
      console.log(responce);
      myStorage.setItem("user", responce.data.userName);
      setCurrentUser(responce.data.userName);
      setShowLogin(false);
    } catch (err) {
      userRegisterFail();
    }
  };

  return (
    <div className="login_container bg-gray-100 rounded-lg p-4 shadow-md">
      <div className="flex items-center mb-4">
        <ExitToAppIcon className="mr-2 text-blue-500" />
        <h2 className="text-xl font-bold">Login to your profile</h2>
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
          type="password"
          placeholder="Password"
          ref={passRef}
        />
        <button className="login_btn bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
          Login
        </button>
      </form>
      <CancelIcon
        className="login_cancel cursor-pointer text-gray-500 hover:text-gray-600"
        onClick={() => setShowLogin(false)}
      />
    </div>
  );
}
