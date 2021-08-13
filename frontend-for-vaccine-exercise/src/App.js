import { useState, useEffect } from 'react';
import statsService from './services/statistics';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine } from '@fortawesome/free-solid-svg-icons';
import { Bar, Pie } from 'react-chartjs-2';
import { defaults } from 'react-chartjs-2';

const BarChart = ({ producers, orderAmount, vaccAmount }) => {
  const data = {
    labels: producers,
    datasets: [
      {
        label: 'orders',
        data: orderAmount,
        backgroundColor: 'rgba(255, 99, 132, 0.4)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
      {
        label: 'vaccinations',
        data: vaccAmount,
        backgroundColor: 'rgba(54, 162, 235, 0.4)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
  };
  return (
    <>
      <Bar data={data} options={options} />
    </>
  );
};

const PieChart = ({ vaccSet, labelSet }) => {
  const data = {
    labels: labelSet,
    datasets: [
      {
        label: 'vaccinations by gender',
        data: vaccSet,
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
  return vaccSet && labelSet ? (
    <>
      <Pie data={data} />
    </>
  ) : null;
};

const App = () => {
  const [summary, setSummary] = useState([]);
  const [firstDataTime, setFirstDataTime] = useState('');
  const [currentTimestamp, setCurrentTimestamp] = useState('');
  const [vaccLabelByGender, setVaccLabelByGender] = useState([]);
  const [vaccByGender, setVaccByGender] = useState([]);
  const [orderLabels, setOrderLabels] = useState([]);
  const [orderAmount, setOrderAmount] = useState([]);
  const [vaccAmount, setVaccAmount] = useState([]);

  useEffect(() => {
    statsService.getFullSummary().then((summary) => {
      setSummary(summary);
      setFirstDataTime(summary.first_data_point);
      setCurrentTimestamp(formatDefaultDatetime('2021-04-12T11:10:06.473587Z'));
      setVaccByGender(
        createGenderDataSet(summary.vaccinations_given_by_gender)
      );
      setVaccLabelByGender(
        createGenderLabelSet(summary.vaccinations_given_by_gender)
      );
      setOrderLabels(
        createOrderLabels(summary.orders_and_vaccinations_by_producer)
      );
      setOrderAmount(
        createOrderAmount(summary.orders_and_vaccinations_by_producer)
      );
      setVaccAmount(
        createVaccAmount(summary.orders_and_vaccinations_by_producer)
      );
    });
  }, []);

  // Disable animating charts by default.
  defaults.animation = false;

  const givenVaccinationsSum = (vaccByGender) => {
    return vaccByGender
      ? vaccByGender
          .map((genderData) => Number(genderData.vaccinations_given))
          .reduce((acc, sum) => acc + sum, 0)
      : 0;
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
    setVaccByGender(createGenderDataSet(response.vaccinations_given_by_gender));
    setVaccLabelByGender(
      createGenderLabelSet(response.vaccinations_given_by_gender)
    );
    setOrderLabels(
      createOrderLabels(response.orders_and_vaccinations_by_producer)
    );
    setOrderAmount(
      createOrderAmount(response.orders_and_vaccinations_by_producer)
    );
    setVaccAmount(
      createVaccAmount(response.orders_and_vaccinations_by_producer)
    );
  };

  const handleTimeChange = (event) => {
    setCurrentTimestamp(formatDefaultDatetime(event.target.value));
  };

  const createGenderDataSet = (genderData) => {
    return genderData
      ? genderData.map((item) => item.vaccinations_given)
      : null;
  };

  const createGenderLabelSet = (genderData) => {
    return genderData ? genderData.map((item) => item.gender) : null;
  };

  const createOrderAmount = (orderData) => {
    return orderData ? orderData.map((item) => item.orders) : null;
  };

  const createVaccAmount = (orderData) => {
    return orderData ? orderData.map((item) => item.vaccinations) : null;
  };

  const createOrderLabels = (orderData) => {
    return orderData ? orderData.map((item) => item.producer) : null;
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
        <div>
          <div className="summary-bar">
            <div className="textual-info-container">
              <div className="info-text">Vaccinations ...given</div>
              <div className="info-number">
                {givenVaccinationsSum(summary.vaccinations_given_by_gender)}
              </div>
            </div>
            <div className="divider" />
            <div className="textual-info-container">
              <div className="info-text">...in storage</div>
              <div className="info-number">
                {summary.vaccinations_remaining}
              </div>
            </div>
            <div className="divider" />
            <div className="textual-info-container">
              <div className="info-text">...expiring in ten days</div>
              <div className="info-number">{summary.expires_in_ten_days}</div>
            </div>
          </div>
          <div className="chart-container">
            <div className="vaccine-order-container">
              <div className="chart-title">
                Total number of orders and vaccinations arrived by producer
              </div>
              <BarChart
                producers={orderLabels}
                orderAmount={orderAmount}
                vaccAmount={vaccAmount}
              />
            </div>
            <div className="vaccine-by-gender-container">
              <div className="chart-title">Vaccinations given by gender</div>
              <PieChart labelSet={vaccLabelByGender} vaccSet={vaccByGender} />
            </div>
          </div>
          <div className="summary-bar">
            <div className="textual-info-container">
              <div className="info-text">Expired bottles</div>
              <div className="info-number">{summary.expired_bottles}</div>
            </div>
            <div className="divider" />
            <div className="textual-info-container">
              <div className="info-text">Expired vaccines</div>
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
