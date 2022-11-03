import "./Interactions.css";
import axios from "axios";
import ShowInteractions from "./ShowInteractions";
import { useState, useEffect, Fragment } from "react";

const Interactions = ({ current, toggleView }) => {
  const [api] = useState(process.env.REACT_APP_API_SERVER);
  const [showInteractions, setShowInteractions] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [url] = useState(process.env.REACT_APP_URL);
  const [days, setDays] = useState(14);
  const [dates, setDates] = useState([]);
  const [oneDay] = useState(86400000);
  const [fiveHours] = useState(36000000);
  const [currentDate, setCurrentDate] = useState("");
  const [defaultDate] = useState(
    new Date().toISOString().toString().slice(0, 10)
  );
  const [customDate, setCustomDate] = useState(
    new Date().toISOString().toString().slice(0, 10)
  );
  // const [fiveHours, setFiveHours] = useState(1191600000);
  //86,400,000 in one Day

  useEffect(() => {
    loadData();
    loadDates(days);
    console.log(current);
  }, []);

  const loadData = async () => {
    const data = await fetchContacts(
      Number(Date.now().toString()) - oneDay * 14
    );
    console.log(data);
    setContacts(data);
  };

  const fetchContacts = async (total) => {
    const range = total - fiveHours;
    const { data } = await axios.post(`${url}/showInteractions`, {
      id: current._id,
      range,
    });

    return data;
  };

  const updateRange = (range) => {
    let array = [];
    let start = Number(new Date(customDate).getTime());

    for (let i = 0; i < range; i++) {
      let day = {
        numeric: "",
        string: "",
      };

      day.numeric = new Date(new Date(start).toString().slice(4, 16)).getTime();
      day.string = new Date(start).toString().slice(4, 16);
      array.push(day);
      setDates(array);
      start -= oneDay;
    }
    // loadDates(range);
    // console.log(Number(Date.now().toString()) - oneDay * range);
  };

  const loadDates = (limit) => {
    let array = [];

    let now = Number(Date.now().toString());

    for (let i = 0; i < limit; i++) {
      let day = {
        numeric: "",
        string: "",
      };

      day.numeric = new Date(new Date(now).toString().slice(4, 16)).getTime();
      day.string = new Date(now).toString().slice(4, 16);
      array.push(day);
      setDates(array);
      now -= oneDay;
    }
  };

  const updateDates = (start) => {
    let array = [];

    for (let i = 0; i < days; i++) {
      let day = {
        numeric: "",
        string: "",
      };

      day.numeric = new Date(new Date(start).toString().slice(4, 16)).getTime();
      day.string = new Date(start).toString().slice(4, 16);
      array.push(day);
      setDates(array);
      start -= oneDay;
    }
  };

  const checkVisited = (value) => {
    let counter = 0;
    const limit = Number(value) + oneDay;
    contacts.forEach((con) => {
      if (Number(con.date) >= value && Number(con.date) <= limit) {
        counter++;
      }
    });
    return counter;
  };

  const viewInteractions = (date) => {
    setCurrentDate(date);
    setShowInteractions(true);
  };

  const toggleInteractions = () => {
    setShowInteractions(!showInteractions);
  };

  // const customStartDate = (value) => {
  //   alert(Number(new Date(value).getTime()));
  // };

  return (
    <div className="interactions-container ">
      {showInteractions ? (
        <ShowInteractions
          toggleInteractions={toggleInteractions}
          currentDate={currentDate}
          currentAccount={current}
        />
      ) : (
        <Fragment>
          <div className="interactions-header">
            <span onClick={() => toggleView()} className="prev-btn">
              <i className="me-2 fas fa-chevron-left"></i>
              Go Back
            </span>
          </div>
          <div className="show-proof">
            <div className="show-proof-content"></div>
          </div>
          <div className="interactions-main">
            <div className="interactions-main-left">
              <div className="interactions-main-left-card">
                <div className="current-img-container">
                  <img
                    src={`${api}/${current.image}`}
                    // src={require(`../../../../server/uploads/${current.image}`)}
                    alt={current._id}
                    className="interactions-current-img"
                  />
                </div>
                <div className="current-info current-info-name">
                  {current.firstName} {current.lastName}
                </div>
                <div className="current-info current-info-role">
                  {current.role.description}
                </div>
                <div className="current-info current-info-username">
                  {current.username}
                </div>
                <div className="notify-btn mt-3">
                  <button className="btn btn-custom-red">
                    <i className="me-2 far fa-envelope"></i>Notify Contacts
                  </button>
                </div>
              </div>
            </div>
            <div className="interactions-main-right">
              <div className="interactions-main-right-header">
                <div className="interaction-range">
                  <span>Showing Rooms Visited in last</span>
                  <div className="range-control">
                    <div
                      onClick={() => {
                        if (days > 1) {
                          setDays(days - 1);
                          updateRange(days - 1);
                        }
                      }}
                      className="decrease"
                    >
                      <i className="fas fa-chevron-down"></i>
                    </div>
                    <div className="range-display">{days}</div>
                    <div
                      onClick={() => {
                        if (days < 14) {
                          setDays(days + 1);
                          updateRange(days + 1);
                        }
                      }}
                      className="increase"
                    >
                      <i className="fas fa-chevron-up"></i>
                    </div>
                  </div>
                  <span>Day(s)</span>
                </div>
                <div className="interaction-starting-date">
                  <span>Starting Date</span>
                  <input
                    value={customDate}
                    onChange={(e) => {
                      {
                        // customStartDate(e.target.value);
                        setCustomDate(e.target.value);
                        updateDates(Number(new Date(e.target.value).getTime()));
                      }
                    }}
                    max={defaultDate}
                    type="date"
                    className="form-control"
                  />
                </div>
                <hr />
              </div>
              <div className="date-grid">
                {dates.map((d) => (
                  <div
                    onClick={() => viewInteractions(d.numeric)}
                    className="date-box  border"
                    key={Math.floor(Math.random() * 1000000)}
                  >
                    <div className="date-content-date"> {d.string}</div>
                    <div className="date-content-visited">
                      <div className="visited-total">
                        {checkVisited(d.numeric)}
                      </div>
                      <div className="visited-text">Rooms Visited</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Fragment>
      )}
    </div>
  );
};

export default Interactions;
