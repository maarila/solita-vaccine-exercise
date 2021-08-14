import SubmitButton from './SubmitButton';

const DateTimePicker = ({
  handleSubmit,
  handleTimeChange,
  currentTimestamp,
  formatDefaultDatetime,
  firstDate,
}) => {
  return (
    <div className="dateform-container">
      <div className="dateform">
        <form onSubmit={handleSubmit}>
          <label htmlFor="getStatisticsUntilTime">Currently showing: </label>
          <br />
          <input
            className="datetime-picker"
            type="datetime-local"
            id="timeToGet"
            name="timeToGet"
            onChange={handleTimeChange}
            value={currentTimestamp}
            min={formatDefaultDatetime(firstDate, 'up')}
          />
          <SubmitButton />
        </form>
      </div>
    </div>
  );
};

export default DateTimePicker;
