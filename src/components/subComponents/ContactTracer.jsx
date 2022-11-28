import "../subComponents/subCss/ContactTracer.css";
import { Fragment, useState, useEffect } from "react";
import Interactions from "../contactTrace/Interactions";
import Table from "../contactTrace/Table";
import ThreadsTable from "../contactTrace/ThreadsTable";
import axios from "axios";

const ContactTracer = ({ campus, showMsgProof }) => {
  const [requested, setRequested] = useState(false);
  const [text, setText] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [url] = useState(process.env.REACT_APP_URL);
  const [current, setCurrent] = useState({});
  const [viewContacts, setViewContacts] = useState(false);
  const [api] = useState(process.env.REACT_APP_API_SERVER);
  const [allThreads, setAllThreads] = useState([]);
  const [newThreads, setNewThreads] = useState([]);
  const [showSearchResult, setShowSearchResult] = useState(false);
  const [showAllThreads, setShowAllThreads] = useState(false);
  const [showNewThreads, setShowNewThreads] = useState(false);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    loadMessages();
    loadRoles();
  }, []);

  const resetBoard = () => {
    setShowAllThreads(false);
    setShowNewThreads(false);
    setShowSearchResult(false);
  };

  const submitSearch = async (e) => {
    e.preventDefault();
    fetchRequest();
    setRequested(true);
    resetBoard();
    setShowSearchResult(true);
  };

  const fetchRequest = async () => {
    const result = await sendSearch();

    setSearchResult(result);
  };

  const sendSearch = async () => {
    const { data } = await axios.post(`${url}/contact-tracer-search`, {
      campus,
      text,
    });

    return data;
  };

  const showInteractions = (list) => {
    setCurrent(list);
    toggleView();
  };

  const toggleView = () => {
    setViewContacts(!viewContacts);
  };

  //messages
  const loadMessages = async () => {
    let array = [];

    const msgs = await fetchMessages();

    msgs.forEach((msg) => {
      if (!msg.seen) {
        array.push(msg);
        setNewThreads(array);
      }
    });

    setAllThreads(msgs);
  };

  const fetchMessages = async () => {
    const { data } = await axios.post(`${url}/getAllMessages`, {
      campus,
    });

    return data;
  };

  const dateFormatter = (timeString) => {
    const date = new Date(Number(timeString)).toString().slice(4, 15);
    const time = new Date(Number(timeString)).toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });

    return `${date} ${time}`;
  };

  const loadRoles = async () => {
    const roleList = await fetchRoles();
    setRoles(roleList);
  };

  const fetchRoles = async () => {
    const { data } = await axios.get(`${url}/allRoles`);

    return data;
  };

  return (
    <div className="tracer-container">
      {viewContacts ? (
        <Interactions
          showMsgProof={showMsgProof}
          current={current}
          toggleView={toggleView}
        />
      ) : (
        <Fragment>
          <div className="contact-tracer-summary">
            <div className="tracer-form-title">Contact Tracer</div>
            <div className="contact-tracer-summary-cards">
              <div
                onClick={() => {
                  resetBoard();
                  setShowNewThreads(true);
                }}
                className="contact-tracer-card"
              >
                <div className="contact-tracer-card-counter">
                  {newThreads.length}
                </div>
                <div className="contact-tracer-card-label">
                  New Reported Positive
                </div>
              </div>
              <div
                onClick={() => {
                  resetBoard();
                  setShowNewThreads(true);
                }}
                className="contact-tracer-card"
              >
                <div className="contact-tracer-card-counter">
                  {newThreads.length}
                </div>
                <div className="contact-tracer-card-label">
                  New Reported Negative
                </div>
              </div>
              <div
                onClick={() => {
                  resetBoard();
                  setShowAllThreads(true);
                }}
                className="contact-tracer-card"
              >
                <div className="contact-tracer-card-counter">
                  {allThreads.length}
                </div>
                <div className="contact-tracer-card-label">
                  All Reported Cases
                </div>
              </div>
              {/* <div className="contact-tracer-search border">
                <form onSubmit={submitSearch}>
                  <div className="tracer-form-title">Search For Accounts</div>
                  <div className="mt-3">
                    <input
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      required
                      minLength={"2"}
                      type="text"
                      className="form-control"
                      placeholder="Name"
                    />
                  </div>
                  <div className="mt-3">
                    <button className="btn-block btn btn-primary">
                      Search
                    </button>
                  </div>
                </form>
              </div> */}
            </div>
          </div>
          {/* <div className="contact-tracer-main">
            <div className="contact-tracer-main-left">
              <div className="contact-tracer-form">
                <div className="tracer-search-section">
                  <form onSubmit={submitSearch}>
                    <div className="tracer-form-title">Contact Tracer</div>
                    <div className="mt-3">
                      <label>Type Name Here</label>
                      <input
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        required
                        minLength={"2"}
                        type="text"
                        className="form-control"
                        placeholder="Name"
                      />
                    </div>
                    <div className="mt-3">
                      <button className="btn-block btn btn-primary">
                        Search
                      </button>
                    </div>
                    <div className="contact-tracer-words bg-light">
                      <span>
                        Trace someone's interaction by typing the Full Name of
                        the person you want to trace.
                      </span>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="contact-tracer-main-right">
              <div className="tracer-calendar bg-light">
                <div className="tracer-calendar-content text-center">
                  <div className="tracer-calendar-icon text-primary">
                    <i className="fas fa-calendar-alt"></i>
                  </div>
                  <div className="tracer-calendar-date">
                    {new Date().toString().slice(0, 16)}
                  </div>
                </div>
              </div>
            </div>
          </div> */}

          <div className="search-result-table">
            {showSearchResult && (
              <Fragment>
                {searchResult.length > 0 ? (
                  <Table
                    showMsgProof={showMsgProof}
                    data={searchResult}
                    showInteractions={showInteractions}
                    api={api}
                  />
                ) : (
                  <div className="trace-result-stats text-muted bg-light">
                    {requested
                      ? "Search Result is Empty..."
                      : "Result Will be displayed here..."}
                  </div>
                )}
              </Fragment>
            )}
            {showAllThreads && (
              <ThreadsTable
                data={allThreads}
                showInteractions={showInteractions}
                api={api}
                roles={roles}
              />
            )}
            {showNewThreads && (
              <ThreadsTable
                showMsgProof={showMsgProof}
                data={newThreads}
                showInteractions={showInteractions}
                api={api}
                roles={roles}
              />
            )}
          </div>
        </Fragment>
      )}
    </div>
  );
};

export default ContactTracer;
