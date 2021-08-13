import { useState, useEffect } from 'react';
import statsService from './services/statistics';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine } from '@fortawesome/free-solid-svg-icons';
import { Pie } from 'react-chartjs-2';

const PieChart = ({ dataSet }) => {
  const data = {
    labels: ['female', 'male', 'nonbinary'],
    datasets: [
      {
        label: '# of Votes',
        data: dataSet,
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };
  return dataSet ? (
    <>
      <Pie data={data} />
    </>
  ) : null;
};

const OrdersByProducer = ({ data }) => {
  return data
    ? data.map((item) => (
        <div key={item.producer}>
          producer: {item.producer} orders: {item.orders} vaccinations:{' '}
          {item.vaccinations}
        </div>
      ))
    : null;
};

const App = () => {
  const [summary, setSummary] = useState([]);
  const [firstDataTime, setFirstDataTime] = useState('');
  const [currentTimestamp, setCurrentTimestamp] = useState('');
  const [vaccByGender, setVaccByGender] = useState([]);

  useEffect(() => {
    statsService.getFullSummary().then((summary) => {
      setSummary(summary);
      setFirstDataTime(summary.first_data_point);
      setCurrentTimestamp(formatDefaultDatetime('2021-04-12T11:10:06.473587Z'));
      setVaccByGender(
        createGenderDataSet(summary.vaccinations_given_by_gender)
      );
    });
  }, []);

  const givenVaccinationsSum = (vaccByGender) => {
    return vaccByGender
      ? vaccByGender
          .map((genderData) => Number(genderData.vaccinations_given))
          .reduce((acc, sum) => acc + sum, 0)
      : null;
  };

  const ordersSum = (orderByProducer) => {
    return orderByProducer
      ? orderByProducer
          .map((order) => Number(order.orders))
          .reduce((acc, sum) => acc + sum, 0)
      : null;
  };

  const vaccinationsSum = (orderByProducer) => {
    return orderByProducer
      ? orderByProducer
          .map((order) => Number(order.vaccinations))
          .reduce((acc, sum) => acc + sum, 0)
      : null;
  };

  const formatTimestamp = (timestamp, rounding) => {
    if (timestamp) {
      const newTimestamp = new Date(timestamp);
      const day = newTimestamp.getDate();
      const month = newTimestamp.getMonth() + 1;
      const year = newTimestamp.getFullYear();
      let hours = newTimestamp.getUTCHours();
      hours = hours < 10 ? (hours = '0' + hours) : hours;
      let minutes = newTimestamp.getMinutes();
      minutes = rounding === 'up' ? minutes + 1 : minutes;
      minutes = minutes < 10 ? (minutes = '0' + minutes) : minutes;

      return `${day}.${month}.${year} ${hours}:${minutes}`;
    }
    return null;
  };

  const formatDefaultDatetime = (timestamp, rounding) => {
    if (timestamp) {
      const splitTimestamp = timestamp.split(':');
      let minutes = splitTimestamp[1];
      if (rounding === 'up') {
        if (minutes.startsWith('0')) {
          minutes = '0' + (Number(minutes.slice(1)) + 1);
        } else {
          minutes = Number(minutes) + 1;
        }
      }
      return splitTimestamp[0] + ':' + minutes;
    }
  };

  const getUntilDate = async (event) => {
    event.preventDefault();
    const response = await statsService.getSummaryUntil(currentTimestamp);
    setSummary(response);
  };

  const handleTimeChange = (event) => {
    setCurrentTimestamp(formatDefaultDatetime(event.target.value));
  };

  const createGenderDataSet = (genderData) => {
    return genderData
      ? genderData.map((item) => item.vaccinations_given)
      : null;
  };

  return (
    <div>
      <div className="header-bar-container">
        <div className="header-bar">
          Statistics last updated on{' '}
          <strong>{formatTimestamp(summary.last_data_point, 'up')}</strong>.
        </div>
      </div>
      <div className="container">
        <div className="header-container">
          <div className="title">
            <div className="title-line">
              <div className="header-icon">
                <FontAwesomeIcon icon={faChartLine} size="lg" />
              </div>
              <h1>Vaccine statistics</h1>
            </div>
          </div>
        </div>
        <div className="dateform-container">
          <div className="dateform">
            <form onSubmit={getUntilDate}>
              <label htmlFor="getStatisticsUntilTime">
                Currently showing:{' '}
              </label>
              <br />
              <input
                className="datetime-picker"
                type="datetime-local"
                id="timeToGet"
                name="timeToGet"
                onChange={handleTimeChange}
                value={currentTimestamp}
                min={formatDefaultDatetime(firstDataTime, 'up')}
              />
              <button className="submit-button" type="submit">
                Get statistics
              </button>
            </form>
          </div>
        </div>
        <div className="sub-title">
          <h3>
            Statistics available from {formatTimestamp(firstDataTime, 'up')}.
          </h3>
        </div>
        <div className="main-view-container">
          <div className="summary-bar">
            <div className="textual-info-container">
              <div className="info-text">Vaccinations ...given</div>
              <div className="info-number">
                {givenVaccinationsSum(summary.vaccinations_given_by_gender)}
              </div>
            </div>
            <div className="textual-info-container">
              <div className="info-text">...in storage</div>
              <div className="info-number">
                {summary.vaccinations_remaining}
              </div>
            </div>
            <div className="textual-info-container">
              <div className="info-text">...expiring in ten days</div>
              <div className="info-number">{summary.expires_in_ten_days}</div>
            </div>
          </div>
          <div className="chart-container">
            <div className="vaccine-order-container">
              <OrdersByProducer
                data={summary.orders_and_vaccinations_by_producer}
              />
              <div className="orders-total">
                Orders total:{' '}
                {ordersSum(summary.orders_and_vaccinations_by_producer)}
              </div>
              <div className="vaccinations-total">
                Vaccinations total:{' '}
                {vaccinationsSum(summary.orders_and_vaccinations_by_producer)}
              </div>
            </div>
            <div className="vaccine-by-gender-container">
              <div className="chart-title">Given vaccinations by gender</div>
              <PieChart dataSet={vaccByGender} />
            </div>
          </div>
          <div className="summary-bar">
            <div className="textual-info-container">
              <div className="info-text">Expired ...bottles</div>
              <div className="info-number">{summary.expired_bottles}</div>
            </div>
            <div className="textual-info-container">
              <div className="info-text">...vaccines</div>
              <div className="info-number">{summary.expired_vaccines}</div>
            </div>
          </div>
        </div>
        <footer className="footer-container">
          <div className="footer-icon">
            <FontAwesomeIcon icon={faChartLine} size="lg" />
          </div>
          <div className="footer-text">Vaccine statistics</div>
          <span className="footer-neutral-text">
            , a web dev exercise for Solita Dev Academy, 2021
          </span>
        </footer>
      </div>
    </div>
  );
};

export default App;
