import * as React from "react";
import Map, { Marker } from "react-map-gl";
import { Popup } from "react-map-gl";
import { useState } from "react";
import StarIcon from "@mui/icons-material/Star";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import axios from "axios";
import { format } from "timeago.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import { NavigationControl } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import Register from "./Components/Register/Register";
import Login from "./Components/Login/Login";
import { FiMapPin } from "react-icons/fi";
import Rating from "react-rating";

const pinAddSuccess = () => {
  toast.success("Added pin!");
};

const userNotLoggedIn = () => {
  toast.warning("Login to account to set pins!");
};
const userLoggedOut = (userS) => {
  toast.warning("Logout from " + userS);
};

const pinAddFailure = () => {
  toast.error("Couldn't add pin. Please fill all data");
};

function App() {
  const myStorage = window.localStorage;

  const [pins, setPins] = useState([]);
  const [newPlace, setNewPlace] = useState(null);
  const [title, setTitle] = useState(null);
  const [descr, setDescr] = useState(null);
  const [rating, setRating] = useState(1);
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);

  React.useEffect(() => {
    const getPins = async () => {
      try {
        const responce = await axios.get(
          "https://z-map-be.onrender.com/api/pins"
        );
        setPins(responce.data);
      } catch (err) {
        console.log(err);
      }
    };

    getPins();
  }, []);

  const handleMarkerClicked = (id) => {
    setCurrentPlaceId(id);
  };

  const handleAddClick = (e) => {
    let lat = e.lngLat.lat;
    let long = e.lngLat.lng;
    setNewPlace({
      lat: lat,
      lng: long,
    });
  };

  const handlePinSubmit = async (e) => {
    e.preventDefault();

    const newPin = {
      userName: currentUser,
      title: title,
      description: descr,
      rating: rating,
      lat: newPlace.lat,
      long: newPlace.lng,
    };

    try {
      if (!currentUser) {
        userNotLoggedIn();
      } else {
        const response = await axios.post(
          "https://z-map-be.onrender.com/api/pins",
          newPin
        );
        setPins([...pins, response.data]);
        setNewPlace(null);
        pinAddSuccess();
        setRating(1);
        setDescr(null);
        setTitle(null);
      }
    } catch (err) {
      console.log(err);
      pinAddFailure();
    }
  };

  const handleLogout = () => {
    myStorage.removeItem("user");
    userLoggedOut(currentUser);
    setCurrentUser(null);
  };

  const viewPort = {
    latitude: 14.58351,
    longitude: 121.07483,
    zoom: 1,
  };

  return (
    <div className="app">
      <Map
        container={"map"}
        projection={"globe"}
        initialViewState={{
          latitude: 14.58351, // Replace with your desired latitude
          longitude: 121.07483, // Replace with your desired longitude
          zoom: 2, // Replace with your desired zoom level
          bearing: 0, // Replace with your desired bearing (optional)
          pitch: 0, // Replace with your desired pitch (optional)
        }}
        mapboxAccessToken={process.env.REACT_APP_TOKEN}
        style={{ width: "100vw", height: "100vh" }}
        mapStyle="mapbox://styles/jzeff01/clhvr48iz00rn01poatjtbxks"
        onDblClick={handleAddClick}
      >
        <ToastContainer position="top-left" theme="dark" />
        <NavigationControl />
        {pins &&
          pins.map((p) => {
            console.log(p);
            return (
              <div key={p._id}>
                <Marker longitude={p.long} latitude={p.lat} anchor="center">
                  <FiMapPin
                    className="icon"
                    onClick={() => handleMarkerClicked(p._id, p.lat, p.long)}
                    style={{
                      fontSize: viewPort.zoom * 2,
                      color:
                        p.userName === currentUser ? "tomato" : "slateblue",
                    }}
                  />
                </Marker>

                {p._id === currentPlaceId && (
                  <Popup
                    longitude={p.long}
                    latitude={p.lat}
                    closeOnClick={false}
                    closeOnMove={false}
                    onClose={() => setCurrentPlaceId(null)}
                    anchor="left"
                    className="py-2  w-[550px]"
                  >
                    <div className="rounded-md px-2 m-2">
                      <label className="text-gray-600">Place</label>
                      <h4 className="place text-xl font-bold mb-2">
                        {p.title}
                      </h4>
                      <label className="text-gray-600">Review</label>
                      <p className="descr text-gray-800">{p.description}</p>
                      <label className="text-gray-600">Rating</label>
                      <div className="stars flex items-center mt-2">
                        {Array.from({ length: p.rating }, (_, index) => (
                          <StarIcon
                            key={index}
                            className="star text-yellow-500"
                          />
                        ))}
                      </div>
                      <label className="text-gray-600">Information</label>
                      <div className="info flex items-center mt-2">
                        <span className="username font-bold text-gray-800">
                          Created by <b>{p.userName}</b>
                        </span>
                        <span className="date text-gray-600 ml-2">
                          {format(p.createdAt)}
                        </span>
                      </div>
                    </div>
                  </Popup>
                )}
              </div>
            );
          })}
        {newPlace && (
          <Popup
            longitude={newPlace.lng}
            latitude={newPlace.lat}
            closeOnClick={false}
            closeOnMove={false}
            onClose={() => setNewPlace(null)}
            anchor="left"
            className="py-2 w-[550px] h-[350px]"
          >
            <form
              onSubmit={handlePinSubmit}
              className="flex flex-col justify-between gap-6 m-2"
            >
              <div className="flex flex-col">
                <label className="text-gray-600">Title</label>
                <input
                  className="bg-white rounded-md py-2 px-3 outline-none focus:bg-white focus:shadow-md"
                  placeholder="Enter a title..."
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="flex flex-col">
                <label className="text-gray-600">Review</label>
                <textarea
                  className=" rounded-md py-2 px-3 outline-none focus:bg-white focus:shadow-md"
                  placeholder="Say something about this place..."
                  onChange={(e) => setDescr(e.target.value)}
                />
              </div>

              <div className="flex flex-col">
                <label className="text-gray-600">Rating</label>
                <Rating
                  emptySymbol={<FaStar className="star-empty text-4xl" />}
                  fullSymbol={
                    <FaStar className="star-filled text-yellow-500 text-4xl" />
                  }
                  onChange={(value) => setRating(value)}
                />
              </div>

              <button className="submitButton" type="submit">
                Add Pin
              </button>
            </form>
          </Popup>
        )}
      </Map>

      <div className="footer">
        <div className="footer_down">
          {currentUser ? (
            <button className="button logout" onClick={handleLogout}>
              Log out
            </button>
          ) : (
            <div className="buttons">
              <button
                className="button login"
                onClick={() => {
                  setShowLogin(true);
                  setShowRegister(false);
                }}
              >
                Login
              </button>
              <button
                className="button register"
                onClick={() => {
                  setShowRegister(true);
                  setShowLogin(false);
                }}
              >
                Register
              </button>
            </div>
          )}
        </div>
      </div>

      {showRegister && <Register setShowRegister={setShowRegister} />}
      {showLogin && (
        <Login
          setShowLogin={setShowLogin}
          myStorage={myStorage}
          setCurrentUser={setCurrentUser}
        />
      )}
    </div>
  );
}

export default App;
