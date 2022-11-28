import "./TraceAll.css";
import { Fragment, useEffect, useState } from "react";
import InteractionLoop from "./InteractionLoop";

const TraceAll = ({
  current,
  toggleTrace,
  customDate,
  contacts,
  toggleInteractions,
}) => {
  const [api] = useState(process.env.REACT_APP_API_SERVER);
  const [oneDay] = useState(86400000);
  const [dates, setDates] = useState([]);
  const [mapView, setMapView] = useState(false);
  const [allVisited, setAllVisited] = useState([]);
  const [currentId, setCurrentId] = useState(0);
  let all = [];
  let count = "";

  useEffect(() => {
    loadDates(14);
  }, []);

  const loadDates = (limit) => {
    let array = [];

    let now = Number(new Date(customDate).getTime());
    console.log(now);
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

  const checkVisited = (value) => {
    let counter = [];

    const limit = Number(value) + oneDay;

    contacts.forEach((con) => {
      if (Number(con.date) >= value && Number(con.date) <= limit) {
        counter.push(con);
      }
    });
    counter.length > 0 && all.push(counter);
    console.log(counter);
    // counter.length > 0 && setAllVisited([...allVisited, counter]);
    return counter;
  };

  const mapViewToggler = () => {
    setMapView(!mapView);
    console.log(allVisited);
  };

  const idSetter = (id) => {
    count = id;
  };

  return (
    <div className="trace-all-container ">
      {/* ===============Map View Pop=================== */}
      {mapView && (
        <div className="trace-all-map-view">
          <div className="trace-all-map-view-left">
            <div onClick={() => mapViewToggler()} className="map-view-closer">
              Close
            </div>
          </div>
          <div className="trace-all-map-view-right"></div>
        </div>
      )}
      {/* ===============Map View Pop=================== */}
      <div onClick={() => toggleTrace()} className="trace-all-header">
        <span className="back-span">
          {" "}
          <i className="fas fa-angle-left me-2"></i>Back
        </span>
      </div>
      <div className="trace-all-main">
        <div className="trace-all-main-header">
          <div className="trace-all-main-profile">
            <div className="current-img-container">
              <img
                src={`${api}/${current.image}`}
                // src={require(`../../../../server/uploads/${currentAccount.image}`)}
                alt={current._id}
                className="interactions-current-img"
              />
            </div>
            <div className="s-i-m-profile-info">
              <div className="s-i-m-profile-name">
                {current.firstName} {current.lastName}
              </div>
              <div className="s-i-m-profile-username text-center">
                {current.username}
              </div>
            </div>
          </div>
          <div className="trace-all-main-date">
            <div className="s-i-m-date-content">
              <i className="fas fa-calendar"></i>
              <span>{new Date(customDate).toString().slice(4, 16)}</span>
              <div className="trace-all-starting-date">Starting Date</div>
            </div>
          </div>
          <div className="trace-all-main-date tam-restrict text-center">
            <div className="s-i-m-date-content">
              <i className="fas fa-ban"></i>
              Notify and Restrict <br /> all Contacts
            </div>
          </div>
          <div className="trace-all-main-date tam-report text-center">
            <div
              onClick={() => mapViewToggler()}
              className="s-i-m-date-content"
            >
              <i className="fas fa-map-marked"></i>
              Map View
            </div>
          </div>
          <div className="trace-all-main-date tam-report text-center">
            <div className="s-i-m-date-content">
              <i className="far fa-file-alt"></i>
              Generate Report
            </div>
          </div>
        </div>
        <div className="trace-all-main-content">
          {dates.map((d) => (
            <div
              key={Math.floor(Math.random() * 1000000)}
              className={"fragment-wrap border mt-5"}
            >
              <div onClick={() => {}} className="dates-header border">
                <div className="date-content"> {d.string}</div>
              </div>
              <div className="all-rooms-visited-section">
                {checkVisited(d.numeric).length > 0 ? (
                  <Fragment key={Math.random() * 100000}>
                    {checkVisited(d.numeric).map((room) => (
                      <div className="visited-room-details">
                        <div className="vrd-header bg-warning">
                          {room.room.description}
                        </div>
                        <InteractionLoop
                          toggleInteractions={toggleInteractions}
                          currentDate={d.numeric}
                          currentAccount={current}
                          currentRoom={room.room._id}
                          currentId={currentId}
                          idSetter={idSetter}
                          count={count}
                        />
                      </div>
                    ))}
                  </Fragment>
                ) : (
                  <div>No Rooms Visited</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TraceAll;
