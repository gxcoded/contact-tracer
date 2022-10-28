import "./ReportHistory.css";
import { useState, useEffect } from "react";
import axios from "axios";

const ReportHistory = ({ accountInfo }) => {
  const [url] = useState(process.env.REACT_APP_URL);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    const fetchedMessages = await fetchMessages();
    setMessages(fetchedMessages);
  };

  const fetchMessages = async () => {
    const { data } = await axios.post(`${url}/getSentMessages`, {
      account: accountInfo._id,
    });
    console.log(data);
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

  return (
    <div className="sent-messages-container">
      <div className="sent-messages-main">
        {messages.map((msg) => (
          <div className="sent-message">
            <img
              src={require(`../../../../../server/uploads/${msg.imgProof}`)}
              alt={msg._id}
              className="sent-message-img"
            />
            <div className="sent-message-details">
              <div className="sent-message-date">
                <div className="sent-message-date-label">Date Sent</div>
                {dateFormatter(msg.dateSent)}
              </div>
              <div className="sent-message-status">
                <div className="status-label">
                  Message Status:{" "}
                  {msg.seen ? (
                    <span>
                      Seen<i className="ms-2 fas fa-eye text-success"></i>
                    </span>
                  ) : (
                    <span>
                      Delivered
                      <i className="ms-2 fas fa-check-circle text-primary"></i>
                    </span>
                  )}
                </div>
              </div>
              <hr />
              <div className="sent-message-text">{msg.message}</div>
              <div className="sent-message-reply-section">
                {msg.reply.length > 0 ? (
                  <div className="admin-reply">
                    <div className="admin-reply-msg">{msg.reply}</div>
                    <div className="admin-reply-date">
                      {dateFormatter(msg.replyDate)}
                    </div>
                  </div>
                ) : (
                  <div>School Admin has no reply yet..</div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReportHistory;
