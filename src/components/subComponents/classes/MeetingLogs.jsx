import "./MeetingLogs.css";
import ClassAttendanceLog from "./ClassAttendanceLog";
import { useState, useEffect, Fragment } from "react";
import axios from "axios";
import swal from "sweetalert";

const MeetingLogs = ({ room }) => {
  const [meetings, setMeetings] = useState([]);
  const [url] = useState(process.env.REACT_APP_URL);
  const [listView, setListView] = useState(true);
  const [currentList, setCurrentList] = useState({});

  useEffect(() => {
    loadMeetingList();
  }, []);

  const loadMeetingList = async () => {
    const meetingList = await fetchMeetingList();
    setMeetings(meetingList);
  };
  const fetchMeetingList = async () => {
    const { data } = await axios.post(`${url}/getMeetingList`, {
      classId: room._id,
    });
    console.log(data);
    return data;
  };

  const toggleList = () => {
    setListView(!listView);
  };

  return (
    <div className="meeting-logs-container">
      {listView ? (
        <div className="table-list">
          <div className="table-header px-2 d-flex justify-content-between align-items-center">
            <div className="table-header-text fw-bold">Meeting List</div>
            <div>
              {/* <div className="input-group">
              <input
                placeholder="ID Number or Last Name"
                onKeyUp={(e) => search(e.target.value)}
                type="search"
                className="form-control search-control rounded"
                aria-label="Search"
                aria-describedby="search-addon"
              />
              <button type="button" className="btn btn-outline-primary">
                Search
              </button>
            </div> */}
            </div>
          </div>
          <table className="campus-table table table-striped">
            <thead>
              <tr>
                <th className="fw-bold" scope="col">
                  Meeting
                </th>
                <th className="fw-bold" scope="col">
                  Date
                </th>
                <th className="fw-bold" scope="col">
                  Time Start
                </th>
                <th className="fw-bold" scope="col">
                  Time End
                </th>
                <th className="fw-bold text-center" scope="col">
                  View
                </th>
              </tr>
            </thead>
            <tbody>
              {meetings.length > 0 &&
                meetings.map((list) => (
                  <tr key={list._id}>
                    <td>Class Meeting</td>
                    <td>
                      {new Date(Number(list.date)).toString().slice(0, 16)}
                    </td>
                    <td>
                      {new Date(Number(list.start)).toString().slice(16, 25)}
                    </td>
                    <td>
                      {new Date(Number(list.end)).toString().slice(16, 25)}
                    </td>
                    <td>
                      <div
                        className="view-record-btn"
                        onClick={() => {
                          setCurrentList(list);
                          toggleList();
                        }}
                      >
                        <span className="eye-btn">
                          <i className="fas fa-eye"></i>
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          <div className="show-count p-4 mt-5">
            Showing{" "}
            <span className="text-primary fw-bold">{meetings.length}</span> out
            of <span className="text-primary fw-bold">{meetings.length}</span>{" "}
            Records
          </div>
        </div>
      ) : (
        <ClassAttendanceLog currentList={currentList} toggleList={toggleList} />
      )}
    </div>
  );
};

export default MeetingLogs;
