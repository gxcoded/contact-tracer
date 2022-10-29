import "../subComponents/subCss/ContactTracer.css";
import { Fragment, useState } from "react";
import Interactions from "../contactTrace/Interactions";
import axios from "axios";

const ContactTracer = ({ campus }) => {
  const [requested, setRequested] = useState(false);
  const [text, setText] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [url] = useState(process.env.REACT_APP_URL);
  const [current, setCurrent] = useState({});
  const [viewContacts, setViewContacts] = useState(false);
  const [api] = useState(process.env.REACT_APP_API_SERVER);

  const submitSearch = async (e) => {
    e.preventDefault();
    fetchRequest();
    setRequested(true);
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

  return (
    <div className="tracer-container">
      {viewContacts ? (
        <Interactions current={current} toggleView={toggleView} />
      ) : (
        <Fragment>
          <div className="contact-tracer-summary">
            <div className="tracer-form-title">Contact Tracer</div>
            <div className="contact-tracer-summary-cards">
              <div className="contact-tracer-card"></div>
              <div className="contact-tracer-card"></div>
              <div className="contact-tracer-card"></div>
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
            {searchResult.length > 0 ? (
              <table className="campus-table table table-striped">
                <thead>
                  <tr>
                    <th className="fw-bold" scope="col">
                      Img
                    </th>
                    <th className="fw-bold" scope="col">
                      Full Name
                    </th>
                    <th className="fw-bold" scope="col">
                      Role
                    </th>
                    <th className="fw-bold" scope="col">
                      ID Number
                    </th>
                    <th className="fw-bold" scope="col">
                      Contact Number
                    </th>
                    <th className="fw-bold" scope="col">
                      Address
                    </th>
                    <th className="fw-bold text-center" scope="col">
                      <i className="ms-2 fas fas fa-tools"></i>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {searchResult.map((list) => (
                    <tr key={list._id}>
                      <td>
                        <img
                          src={`${api}/${list.image}`}
                          // src={require(`../../../../server/uploads/${list.image}`)}
                          alt={list._id}
                          className="table-image"
                        />
                      </td>
                      <td>
                        {list.lastName}, {list.firstName}
                      </td>
                      <td>{list.role.description}</td>
                      <td>{list.username}</td>
                      <td>{list.phoneNumber}</td>
                      <td>{list.address}</td>
                      <td className="text-center">
                        <button
                          onClick={() => showInteractions(list)}
                          className="btn btn-primary"
                        >
                          Trace Contacts
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="trace-result-stats text-muted bg-light">
                {requested
                  ? "Search Result is Empty..."
                  : "Result Will be displayed here..."}
              </div>
            )}
          </div>
        </Fragment>
      )}
    </div>
  );
};

export default ContactTracer;
