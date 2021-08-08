import { useState, useEffect } from 'react';
import axios from 'axios';

const PerGender = ({ data }) => {
  return data
    ? data.map((item) => (
        <div key={item.gender}>
          <div>
            {item.gender} {item.vaccinations_given}
          </div>
        </div>
      ))
    : null;
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

  useEffect(() => {
    axios.get('http://localhost:3001').then((response) => {
      setSummary(response.data);
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

  return (
    <>
      <h1>Vaccine statistics</h1>
      <div>Expired Bottles: {summary.expired_bottles}</div>
      <div>Expired vaccines: {summary.expired_vaccines}</div>
      <div>Vaccinations remaining: {summary.vaccinations_remaining}</div>
      <div>Expires in 10 days: {summary.expires_in_ten_days}</div>
      <PerGender data={summary.vaccinations_given_by_gender} />
      <div>
        Total vaccinations given:{' '}
        {givenVaccinationsSum(summary.vaccinations_given_by_gender)}
      </div>
      <OrdersByProducer data={summary.orders_and_vaccinations_by_producer} />
      <div>
        Orders total: {ordersSum(summary.orders_and_vaccinations_by_producer)}
      </div>
      <div>
        Vaccinations total:{' '}
        {vaccinationsSum(summary.orders_and_vaccinations_by_producer)}
      </div>
    </>
  );
};

export default App;
