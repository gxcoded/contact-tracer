import "../subComponents/subCss/ClassRoom.css";
import ClassStudents from "./classes/ClassStudents";
import ClassMeetings from "./classes/ClassMeetings";
import Attendance from "./classes/Attendance";
import { useState } from "react";

const ClassRoom = ({ room, options }) => {
  const [students, setStudents] = useState(false);
  const [attendance, setAttendance] = useState(false);
  const [meetings, setMeetings] = useState(true);

  const toggleActive = (target) => {
    const links = document.querySelectorAll(".class-nav-links");

    links.forEach((link) => {
      link.classList.remove("nav-active");
    });
    target.classList.add("nav-active");

    resetSelection();
  };

  const resetSelection = () => {
    setStudents(false);
    setMeetings(false);
    setAttendance(false);
  };

  return (
    <div className="class-room-container">
      <div className="class-room-header ">
        <div className="class-room-header-left">
          <img
            src={require(`../../../../server/icons/${room.icon.description}`)}
            alt=""
            className="class-icon-display"
          />
          <div className="class-room-header-text">
            {" "}
            {room.subject.courseCode} - {room.section}
          </div>
          <div className="class-room-header-course-text">
            {/* {room.course.description} */}
          </div>
        </div>
        <div className="class-room-header-right">
          <div className="class-room-header-right-content ">
            <div className="selected-display">
              {room.subject.courseDescription}
            </div>
            <nav className="class-nav">
              <div
                onClick={(e) => {
                  toggleActive(e.target);
                  setMeetings(true);
                }}
                className="class-nav-links nav-active"
              >
                <i className="me-2 fas fa-grip-vertical"></i>Meetings
              </div>
              <div
                onClick={(e) => {
                  toggleActive(e.target);
                  setStudents(true);
                }}
                className="class-nav-links"
              >
                <i className="me-2 fas fa-grip-vertical"></i>Students
              </div>
              <div
                onClick={(e) => {
                  toggleActive(e.target);
                  setAttendance(true);
                }}
                className="class-nav-links"
              >
                <i className="me-2 fas fa-grip-vertical"></i>Attendance
              </div>
              <div onClick={() => options()} className="class-nav-links">
                <i className="me-2 fas fa-undo"></i>
                Previous Page
              </div>
            </nav>
          </div>
        </div>
      </div>
      <div className="class-room-main">
        {students && <ClassStudents room={room} />}
        {meetings && <ClassMeetings room={room} />}
        {attendance && <Attendance room={room} />}
      </div>
    </div>
  );
};

export default ClassRoom;
