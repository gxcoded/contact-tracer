import "../assets/css/Student.css";
import "../assets/css/SuperAdmin.css";
import { Fragment } from "react";
import PsuLogo from "../assets/images/psuLogo.png";
import { Link } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import QrCodeDisplay from "./QrCodeDisplay";
import LoggedOut from "./LoggedOut";
import Profile from "./subComponents/Profile";
import CredentialsPage from "./subComponents/CredentialsPage";
import BounceLoader from "react-spinners/BounceLoader";
import SvgDisplay from "./SvgDisplay";
import Movement from "./subComponents/Movement";
import Positive from "./subComponents/Positive";
import Scanner from "./subComponents/Scanner";
import ChatNurse from "./subComponents/ChatNurse";
import swal from "sweetalert";

const Student = ({ vaxStatsList, genderList }) => {
  const [accountInfo, setAccountInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [profile, setProfile] = useState(true);
  const [credentials, setCredentials] = useState(false);
  const [movements, setMovements] = useState(false);
  const [positive, setPositive] = useState(false);
  const [scan, setScan] = useState(false);
  const [url] = useState(process.env.REACT_APP_URL);
  const [api] = useState(process.env.REACT_APP_API_SERVER);
  const [allowed, setAllowed] = useState(false);
  const [chat, setChat] = useState(false);

  useEffect(() => {
    localStorage.getItem("ctIdToken") !== null && setLoggedIn(true);

    const fetchInfo = async () => {
      const info = await getInfo();
      console.log(info);
      setAccountInfo(info);
      isAllowed(info._id);
    };

    fetchInfo();
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  //status checker
  const isAllowed = async (id) => {
    const response = await requestChecker(id);

    setAllowed(response);
  };

  const requestChecker = async (id) => {
    const { data } = await axios.post(`${url}/statusChecker`, {
      id,
    });

    return data;
  };

  //get account Information
  const getInfo = async () => {
    const id = localStorage.getItem("ctIdToken");
    const response = await axios.post(`${url}/accountInfo`, { id: id });

    return await response.data;
  };

  const toggleActive = (e) => {
    document.querySelectorAll(".side-button").forEach((btn) => {
      btn.classList.remove("activ");
    });

    e.target.classList.add("activ");
    setProfile(false);
    setCredentials(false);
    setMovements(false);
    setPositive(false);
    setScan(false);
    setChat(false);
    toggleLeftBar();
  };

  const toggleLeftBar = () => {
    document.querySelector("#navLeft").classList.toggle("shown");
  };

  const notAllowedAlert = () => {
    swal("Not Allowed!", "You are not allowed to use this Feature!", "warning");
  };
  return (
    <div className="sudo-container">
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
                    <div className="sudo-name me-5">
                      {" "}
                      {`${accountInfo.firstName} ${accountInfo.lastName}`}
                    </div>
                    <div className="sub-name-title">
                      {accountInfo.role.description}
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
                          setProfile(true);
                        }}
                        className="side-button activ"
                      >
                        <i className="fas fa-id-card-alt me-3"></i>Profile
                      </div>
                    </li>
                    <li className="list-group-item px-4 border-0">
                      <div
                        onClick={(e) => {
                          if (allowed) {
                            toggleActive(e);
                            setScan(true);
                          } else {
                            notAllowedAlert();
                          }
                        }}
                        className="side-button"
                      >
                        <i className="fas fa-vector-square me-3"></i>Scanner3
                      </div>
                    </li>
                    <li className="list-group-item px-4 border-0">
                      <div
                        onClick={(e) => {
                          toggleActive(e);
                          setMovements(true);
                        }}
                        className="side-button"
                      >
                        <i className="fas fa-history me-3"></i>Movements
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
                          <i className="fab fa-rocketchat me-3"></i>Chat Campus
                          Nurse
                        </span>
                      </div>
                    </li>
                    <li className="list-group-item px-4 border-0">
                      <div
                        onClick={(e) => {
                          toggleActive(e);
                          setPositive(true);
                        }}
                        className="side-button"
                      >
                        <i className="text-danger fas fa-prescription me-3"></i>
                        Health Status
                      </div>
                    </li>
                  </ul>
                </div>
                <div className="links-bottom mt-5">
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
              <div className="sudo-right bg-light">
                <div className="sudo-right-top">
                  {/* <div>
                    <i className="fas fa-qrcode me-3 "></i>
                    <span>PSU-Trace</span>
                  </div> */}
                  <div
                    onClick={() => alert()}
                    className="notification-link d-flex align-items-center"
                  >
                    <i className="fas fa-bell me-2 "></i>
                    <span>Notification</span>
                    <span className="notification-counter mx-2">1</span>
                  </div>
                  <div className="burger-menu  d-flex justify-content-end align-items-center">
                    <div onClick={toggleLeftBar} className="burger-bars p-3">
                      <i className="fas fa-bars"></i>
                    </div>
                  </div>
                </div>
                {profile && (
                  <div className="sudo-right-main override ">
                    {/* <SvgDisplay /> */}
                    <div className="profile-container">
                      <div className="student-main">
                        <div className="student-profile">
                          <div className="student-profile-left">
                            <div className="profile-upper-section">
                              <div className="profile-name">
                                <img
                                  src={`${api}/${accountInfo.image}`}
                                  alt="profile"
                                  className="profile-image"
                                />
                                <div className="profile-text-display">
                                  {`${accountInfo.firstName} ${accountInfo.lastName}`}
                                </div>
                                <div className="profile-id-display">
                                  {accountInfo.idNumber}
                                </div>
                                <div className="profile-status mt-4 ">
                                  {accountInfo.allowed ? (
                                    <div className="status-content text-success">
                                      Allowed{" "}
                                      <i className="ms-2 fas fa-thumbs-up"></i>
                                    </div>
                                  ) : (
                                    <div className="status-content text-danger">
                                      Not Allowed{" "}
                                      <i className="ms-2 fas fa-times"></i>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="student-profile-right shadow-0">
                            <QrCodeDisplay value={accountInfo._id} />
                          </div>
                        </div>
                      </div>
                      <Profile
                        accountInfo={accountInfo}
                        vaxStatsList={vaxStatsList}
                        genderList={genderList}
                        type={1}
                      />
                    </div>
                  </div>
                )}
                {credentials && <CredentialsPage accountInfo={accountInfo} />}
                {chat && <ChatNurse accountInfo={accountInfo} />}
                {scan && <Scanner accountInfo={accountInfo} />}
                {movements && <Movement accountInfo={accountInfo} />}
                {positive && <Positive accountInfo={accountInfo} />}
              </div>
            </Fragment>
          )}
        </Fragment>
      )}
    </div>
  );
};

export default Student;
