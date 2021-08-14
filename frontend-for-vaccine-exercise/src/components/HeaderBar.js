const HeaderBar = ({ lastDate }) => {
  const formatTimestamp = (timestamp) => {
    if (timestamp) {
      const newTimestamp = new Date(timestamp);
      const day = newTimestamp.getDate();
      const month = newTimestamp.getMonth() + 1;
      const year = newTimestamp.getFullYear();
      let hours = newTimestamp.getUTCHours();
      hours = hours < 10 ? (hours = '0' + hours) : hours;
      let minutes = newTimestamp.getMinutes() + 1;
      minutes = minutes < 10 ? (minutes = '0' + minutes) : minutes;

      return `${day}.${month}.${year} ${hours}:${minutes}`;
    }
    return null;
  };

  return (
    <div className="header-bar-container">
      <div className="header-bar">
        Statistics last updated on <strong>{formatTimestamp(lastDate)}</strong>.
      </div>
    </div>
  );
};

export default HeaderBar;
