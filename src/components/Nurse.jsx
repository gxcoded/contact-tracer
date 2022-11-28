import "../assets/css/SuperAdmin.css";
import "../assets/css/SchoolAdmin.css";
import PsuLogo from "../assets/images/psuLogo.png";
import { Link } from "react-router-dom";
import ContactTracer from "./subComponents/ContactTracer";
import CredentialsPage from "./subComponents/CredentialsPage";
import BounceLoader from "react-spinners/BounceLoader";
import LoggedOut from "./LoggedOut";
import Messages from "./subComponents/notify/Messages";
import MapContainer from "./map/MapContainer";
import { useState, useEffect, Fragment } from "react";
import axios from "axios";
import Chats from "./subComponents/Chats";

const SchoolAdmin = () => {
  const [url] = useState(process.env.REACT_APP_URL);
  const [accountInfo, setAccountInfo] = useState("");
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [roles, setRoles] = useState([]);
  const [contactTrace, setContactTrace] = useState(true);
  const [credentials, setCredentials] = useState(false);
  const [messages, setMessages] = useState([]);
  const [showMsgs, setShowMsgs] = useState(false);
  const [api] = useState(process.env.REACT_APP_API_SERVER);
  const [currentPerson, setCurrentPerson] = useState({});
  const [currentState, setCurrentState] = useState(true);
  const [showMap, setShowMap] = useState(true);
  const [notification, setNotification] = useState(false);
  const [chat, setChat] = useState(false);

  useEffect(() => {
    localStorage.getItem("ctIdToken") !== null && setLoggedIn(true);

    const fetchInfo = async () => {
      const info = await getInfo();
      const fetchedRoles = await fetchRoles();

      setAccountInfo(info);

      setRoles(fetchedRoles);

      // setInterval(() => {
      //   msgReload(info.campus._id);
      // }, 1000);
    };

    fetchInfo();

    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  //messages

  const msgReload = async (id) => {
    const fetchedMessages = await fetchMessages(id);
    console.log(id);
    setMessages(fetchedMessages);
  };

  const fetchMessages = async (id) => {
    const { data } = await axios.post(`${url}/countNewMessages`, {
      campus: id,
    });

    return data;
  };

  //get account Information
  const getInfo = async () => {
    const id = localStorage.getItem("ctIdToken");
    const response = await axios.post(`${url}/accountInfo`, { id: id });

    return await response.data;
  };

  //Fetch Courses
  const fetchRoles = async () => {
    const response = await axios.get(`${url}/getRole`);
    return await response.data;
  };

  const toggleActive = (e) => {
    reset();
    document.querySelectorAll(".side-button").forEach((btn) => {
      btn.classList.remove("activ");
    });

    e.target.classList.add("activ");
  };

  const msgToggler = (state) => {
    setCurrentState(state);
    setShowMsgs(!showMsgs);
  };

  const showMsgProof = (list) => {
    setCurrentPerson(list);
    setShowMsgs(true);
    // setContactTrace(false);

    // setTimeout(() => {
    //   setContactTrace(true);
    // }, 500);
  };
  const mapToggler = () => {
    setShowMap(!showMap);
  };

  const reset = () => {
    setContactTrace(false);
    setCredentials(false);
    toggleLeftBar();
    setNotification(false);
    setChat(false);
  };
  const toggleLeftBar = () => {
    document.querySelector("#navLeft").classList.toggle("shown");
  };
  return (
    <div className="sudo-container school-admin-container">
      {/* {showMap && <MapContainer mapToggler={mapToggler} />} */}
      {loading ? (
        <div className="spinner border loader-effect">
          <BounceLoader color="#5dcea1" loading={loading} size={150} />
        </div>
      ) : (
        <Fragment>
          {!loggedIn ? (
            <LoggedOut />
          ) : (
            <Fragment>
              <div id="navLeft" className="sudo-left">
                <div className="sudo-left-header">
                  <div className="img-top">
                    <img className="logo-top" src={PsuLogo} alt="logo" />
                  </div>
                  <div className="psu-title text-center mt-2">
                    Pangasinan State University
                  </div>
                  <div className="psu-sub-text text-center mt-2">
                    {accountInfo.campus.campusName} Campus
                  </div>
                </div>
                <hr className="mt-5" />
                <div className="admin-label my-4">
                  <img
                    src={`${api}/${accountInfo.image}`}
                    alt="img"
                    className="me-3"
                  />
                  <div className="label-container">
                    <div className="sudo-name me-5">{`${accountInfo.firstName} ${accountInfo.lastName}`}</div>
                    <div className="sub-name-title">
                      Campus {accountInfo.role.description}
                    </div>
                  </div>
                </div>
                <hr className="mt-3" />
                <div className="links">
                  <ul className="list-group list-group-light">
                    <li className="list-group-item px-4 border-0">
                      <div
                        onClick={(e) => {
                          toggleActive(e);
                          setContactTrace(true);
                        }}
                        className="ct-nav-btn  side-button activ"
                      >
                        <span className="">
                          <i className="fas fa-street-view me-3"></i>Contact
                          Tracer
                        </span>
                        {messages.length > 0 && (
                          <span className="notification-counter">
                            {messages.length}
                          </span>
                        )}
                      </div>
                    </li>
                    <li className="list-group-item px-4 border-0">
                      <div
                        onClick={(e) => {
                          toggleActive(e);
                          setChat(true);
                        }}
                        className="ct-nav-btn  side-button"
                      >
                        <span className="">
                          <i className="fab fa-rocketchat me-3"></i>Chats
                        </span>
                        {messages.length > 0 && (
                          <span className="notification-counter">
                            {messages.length}
                          </span>
                        )}
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="links-bottom mt-2">
                  <hr />
                  <div className="sub-label px-5">
                    <i className="fas fa-sliders-h me-3"></i>Options
                  </div>
                  <ul className="list-group list-group-light">
                    <li className="list-group-item px-4 border-0">
                      <div
                        onClick={(e) => {
                          toggleActive(e);
                          setCredentials(true);
                        }}
                        className="side-button"
                      >
                        <i className="fas fa-cogs me-3"></i>Credentials
                      </div>
                    </li>
                    <li className="list-group-item px-4 border-0">
                      <Link to="/login">
                        <div className="side-button">
                          <i className="fas fa-sign-out-alt me-3"></i>Logout
                        </div>
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="sudo-right bg-light s-admin-right">
                {showMsgs && (
                  <Messages
                    accountInfo={accountInfo}
                    msgToggler={msgToggler}
                    msgReload={msgReload}
                    currentPerson={currentPerson}
                    currentState={currentState}
                  />
                )}
                <div className="sudo-right-top sa-right-top">
                  <div
                    onClick={() => msgToggler()}
                    className={`notification-link d-flex align-items-center ${
                      messages.length > 0 && "bold-notif"
                    }`}
                  >
                    <i className="fas fa-bell me-2 "></i>
                    <span>Notification</span>
                    {messages.length > 0 && (
                      <span className="notification-counter mx-2">
                        {messages.length}
                      </span>
                    )}
                  </div>
                  <div className="burger-menu  d-flex justify-content-end align-items-center">
                    <div onClick={toggleLeftBar} className="burger-bars p-3">
                      <i className="fas fa-bars"></i>
                    </div>
                  </div>
                </div>
                <div className="sudo-right-main">
                  {contactTrace && (
                    <ContactTracer
                      campus={accountInfo.campus._id}
                      roles={roles}
                      showMsgProof={showMsgProof}
                    />
                  )}

                  {credentials && <CredentialsPage accountInfo={accountInfo} />}
                  {chat && <Chats accountInfo={accountInfo} />}
                </div>
              </div>
            </Fragment>
          )}
        </Fragment>
      )}
    </div>
  );
};

export default SchoolAdmin;
