import { Link } from "react-router-dom";
import "../assets/css/HomePage.css";
import { useState } from "react";

const HomePage = () => {
  const [url] = useState(process.env.REACT_APP_URL);

  return (
    <div className="wrapper-bg">
      <div className="home-main">
        <div className=" home-main-content">
          <div className="home-main-content-left">
            <div className="main-text">
              Let's help stop the spread of COVID-19 within our campus.
            </div>
            <Link to="/login">
              <button className="get-started">Get Started</button>
            </Link>
          </div>
          <div className="home-main-content-right">
            <div className="home-main-image"></div>
          </div>
        </div>
      </div>
      {/* # REACT_APP_URL = http://localhost:5000/ct-api # REACT_APP_API_SERVER =
      http://localhost:5000/uploads # REACT_APP_API_SERVER =
      https://rose-shrimp-wear.cyclic.app/uploads */}
    </div>
  );
};

export default HomePage;
