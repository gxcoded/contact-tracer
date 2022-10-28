import "./subCss/StaffList.css";
import { useEffect, useState } from "react";
import axios from "axios";
import swal from "sweetalert";
import { QRCode } from "react-qrcode-logo";
import Image from "../../assets/images/psuLogo.png";

const RoomList = ({ campus }) => {
  const [url] = useState(process.env.REACT_APP_URL);
  const [rooms, setRooms] = useState([]);
  const [value, setValue] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [editDescription, setEditDescription] = useState("");
  const [selected, setSelected] = useState({});
  const [current, setCurrent] = useState({});

  //   const [buildings, setBuildings] = useState([]);
  // const [chosenBuilding, setChosenBuilding] = useState("");
  const [description, setDescription] = useState("");
  const [filterList, setFilterList] = useState([]);

  const loadData = async () => {
    const data = await fetchList();
    // const fetchedBuildings = await fetchBuildings();
    // setBuildings(fetchedBuildings);
    setRooms(data);
    setFilterList(data);
  };

  useEffect(() => {
    console.log(campus);
    loadData();
  }, []);

  const fetchList = async () => {
    const response = await axios.post(`${url}/roomList`, {
      campus,
    });
    return await response.data;
  };

  //   const fetchBuildings = async () => {
  //     const response = await axios.post(
  //       `"http://localhost:5000/ct-api/buildingList"`,
  //       {
  //         campus,
  //       }
  //     );
  //     return await response.data;
  //   };

  const deleteRoom = (id) => {
    swal({
      title: "Are you sure?",
      text: "You can not undo this.",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        setRooms(rooms.filter((list) => list.id !== id));
        swal("Deleted!", {
          icon: "success",
        });
      }
    });
  };

  const addRoom = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${url}/addRoom`, {
        campus,
        //   building: chosenBuilding,
        description,
      });
      const data = await response.data;
      swal("Added!", {
        icon: "success",
      });
      loadData();
    } catch (error) {
      console.log(error);
    }
  };

  const downloadRoomQr = async (list) => {
    setValue(list._id);
    swal(`Download QR-Code for ${list.description} ?`).then((value) => {
      value && saveCanvas(list.description);
    });
  };

  const saveCanvas = (description) => {
    const canvas = document.querySelector("#roomQrCodeDownload");
    const context = canvas.getContext("2d");
    context.font = "40px Arial";
    context.textAlign = "center";
    context.fillStyle = "yellow";
    context.fillText(`${description}`, 150, 50);
    let canvasUrl = canvas.toDataURL();

    const createEl = document.createElement("a");
    createEl.href = canvasUrl;
    createEl.download = description;
    createEl.click();
    createEl.remove();
  };

  const changeScanStatus = async () => {
    const { data } = await axios.post(`${url}/updateRoomScanControl`, {
      id: selected._id,
      isAllowed: !selected.allowStudentsAndGuests,
    });
    return data;
  };

  const updateScanStatus = async () => {
    const updated = await changeScanStatus();
    if (updated) {
      loadData();
      setShowModal(false);
      swal("Updated!", {
        icon: "success",
      });
    }
  };

  const isUpdated = async (list) => {
    const { data } = await axios.post(`${url}/updateRoomStatus`, {
      id: list._id,
      isOpen: !list.isOpen,
    });
    console.log(data);
    return data;
  };

  const updateStatus = async (list) => {
    if (await isUpdated(list)) {
      swal("Status Updated!", {
        icon: "success",
      });
    }
  };

  const saveEdit = async (e) => {
    e.preventDefault();

    const sendRequest = await axios.post(`${url}/updateRoomDescription`, {
      id: current._id,
      description: editDescription,
    });
    if (await sendRequest.data) {
      swal("Updated!", {
        icon: "success",
      });
      setEditModal(false);
      setEditDescription("");
      loadData();
    }
  };

  return (
    <div className="staff-list-container ">
      <div className="staff-list-title">
        <i className="fas fa-city me-3"></i>Manage Locations
      </div>
      <div className="campus-staff-main room-list-main">
        <div className="list-top-controls">
          <div className="list-counter-box">
            <div className="list-counter">{rooms.length}</div>
            <div className="list-counter-label">Total Locations</div>
          </div>
          <div className="list-filter-controls">
            <div className="controls-title">
              <i className="me-2 fas fa-plus"></i>Add Locations
            </div>
            <form onSubmit={addRoom}>
              <div className="form-inline ">
                {/* <div className="form-group">
                  <label>Building</label>
                  <select
                    onChange={(e) => setChosenBuilding(e.target.value)}
                    required
                    defaultValue={chosenBuilding}
                    className="form-control"
                  >
                    <option value={chosenBuilding}>Select</option>
                    {buildings.map((list) => (
                      <option key={list._id} value={list._id}>
                        {list.description}
                      </option>
                    ))}
                  </select>
                </div> */}
                <div className="form-input">
                  <div className="form-group">
                    <label>Description</label>
                    <input
                      minLength={"3"}
                      required
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      type="text"
                      className="form-control"
                    />
                  </div>
                </div>
              </div>
              <div className="px-2 mt-4 text-end">
                <button type="submit" className="btn btn-primary">
                  <i className="me-2 fas fa-save"></i>Save
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="table-list staff-table room-list-table py-5">
          {showModal && (
            <div className={`settings-modal`}>
              <div className="settings-modal-main">
                <div
                  onClick={() => setShowModal(false)}
                  className="close-settings-modal"
                >
                  <i className="fas fa-times"></i>
                </div>
                <div className="smm-selected-location">
                  {selected.description}
                </div>

                <div className="switch-display">
                  {selected.allowStudentsAndGuests ? (
                    <div className="form-check form-switch d-flex justify-content-center">
                      <input
                        onChange={() => updateScanStatus()}
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        defaultChecked={true}
                      />
                    </div>
                  ) : (
                    <div className="form-check form-switch d-flex justify-content-center">
                      <input
                        onChange={() => updateScanStatus()}
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        defaultChecked={false}
                      />
                    </div>
                  )}
                </div>
                <div className="smm-status">
                  Current Status:{" "}
                  {`${
                    selected.allowStudentsAndGuests ? "Allowed" : "Not Allowed"
                  } `}
                </div>
                <div className="smm-text">
                  Allow Student and Guest to Scan the Qr Code of this Location?
                </div>
              </div>
            </div>
          )}
          {editModal && (
            <div className={`settings-modal`}>
              <div className="edit-modal-main">
                <div
                  onClick={() => setEditModal(false)}
                  className="close-settings-modal"
                >
                  <i className="fas fa-times"></i>
                </div>
                <form onSubmit={saveEdit}>
                  <div className="form-group">
                    <input
                      required
                      minLength={"3"}
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      type="text"
                      className="form-control"
                      placeholder="Description"
                    />
                  </div>
                  <div className="px-3 mt-3 text-end">
                    <div
                      onClick={() => setEditModal(false)}
                      className="btn btn-warning"
                    >
                      Cancel
                    </div>
                    <button className="btn btn-success mx-1">Save</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="d-none">
            <QRCode
              id="roomQrCodeDownload"
              fgColor="#333"
              // fgColor="#50bfa5"
              value={value}
              logoHeight={"200"}
              logoWidth={"200"}
              size={"1000"}
              logoImage={Image}
              eyeRadius={[
                {
                  // top/left eye
                  outer: [0, 0, 0, 0],
                  inner: [0, 100, 0, 100],
                },
                [0, 0, 0, 0], // top/right eye
                [0, 0, 0, 0], // bottom/left
              ]}
            />
          </div>
          <div className="table-header px-2 mb-5 d-flex justify-content-between align-items-center">
            <div className="table-header-text fw-bold">Rooms</div>
            <div>
              <div className="input-group">
                <input
                  placeholder="Description"
                  type="search"
                  className="form-control search-control rounded"
                  aria-label="Search"
                  aria-describedby="search-addon"
                />
                <button type="button" className="btn btn-outline-primary">
                  Search
                </button>
              </div>
            </div>
          </div>
          <table className="campus-table table table-striped">
            <thead>
              <tr>
                <th className="fw-bold" scope="col">
                  Description
                </th>
                <th className="fw-bold" scope="col">
                  Available
                </th>
                <th className="fw-bold text-center" scope="col">
                  <i className="ms-2 fas fas fa-tools"></i>
                </th>
              </tr>
            </thead>
            <tbody>
              {filterList.length > 0 ? (
                filterList.map((list) => (
                  <tr key={list._id}>
                    <td>{list.description}</td>
                    <td>
                      {list.isOpen ? (
                        <div className="form-check form-switch d-flex justify-content-center">
                          <input
                            onChange={() => updateStatus(list)}
                            className="form-check-input"
                            type="checkbox"
                            role="switch"
                            defaultChecked={true}
                          />
                        </div>
                      ) : (
                        <div className="form-check form-switch  d-flex justify-content-center">
                          <input
                            onChange={() => updateStatus(list)}
                            className="form-check-input"
                            type="checkbox"
                            role="switch"
                            defaultChecked={false}
                          />
                        </div>
                      )}
                    </td>
                    <td>
                      <div className="table-options justify-content-center">
                        <span
                          onClick={() => {
                            setCurrent(list);
                            setEditDescription(list.description);
                            setEditModal(true);
                          }}
                          className="option-edit text-warning me-3"
                          data-mdb-toggle="tooltip"
                          title="Edit Description"
                        >
                          <i className="fas fa-edit"></i>
                        </span>
                        <span
                          onClick={() => downloadRoomQr(list)}
                          className="option-edit text-primary me-3"
                          data-mdb-toggle="tooltip"
                          title="Download Qr Code"
                        >
                          <i className="fas fa-file-download"></i>
                        </span>
                        <span
                          onClick={() => {
                            setSelected(list);
                            setShowModal(true);
                          }}
                          className="option-edit text-dark me-3"
                          data-mdb-toggle="tooltip"
                          title="Show Options"
                        >
                          <i className="fas fa-cog"></i>
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="fw-bold fst-italic">No Records found...</td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="show-count p-4">
            Showing{" "}
            <span className="text-primary fw-bold">{filterList.length}</span>{" "}
            out of{" "}
            <span className="text-primary fw-bold">{filterList.length}</span>{" "}
            Records
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomList;
