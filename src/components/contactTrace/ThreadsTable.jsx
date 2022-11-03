const ThreadsTable = ({ data, showInteractions, api, roles, showMsgProof }) => {
  const getRole = (id) => {
    let description = "";
    roles.forEach((role) => {
      if (role._id === id) description = role.description;
    });
    return description;
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
            Date Reported
          </th>
          {/* <th className="fw-bold" scope="col">
            Address
          </th> */}

          <th className="fw-bold text-center" scope="col">
            <i className="ms-2 fas fas fa-tools"></i>
          </th>
        </tr>
      </thead>
      <tbody>
        {data.map((list) => (
          <tr key={list._id}>
            <td>
              <img
                src={`${api}/${list.accountOwner.image}`}
                // src={require(`../../../../server/uploads/${list.image}`)}
                alt={list._id}
                className="table-image"
              />
            </td>
            <td>
              {list.accountOwner.lastName}, {list.accountOwner.firstName}
            </td>
            <td>{getRole(list.accountOwner.role)}</td>
            <td>{list.accountOwner.username}</td>
            <td>{dateFormatter(list.dateSent)}</td>
            {/* <td>{list.accountOwner.address}</td> */}
            <td className="text-center">
              <button
                onClick={() => showMsgProof(list.accountOwner)}
                className="btn btn-primary"
              >
                Details
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ThreadsTable;
