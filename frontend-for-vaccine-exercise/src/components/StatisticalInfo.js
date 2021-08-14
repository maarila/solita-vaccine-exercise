import TextInfo from './TextInfo';
import ChartRow from './ChartRow';

const givenVaccinationsSum = (vaccByGender) => {
  return vaccByGender
    ? vaccByGender
        .map((genderData) => Number(genderData.vaccinations_given))
        .reduce((acc, sum) => acc + sum, 0)
    : 0;
};

const createGenderDataSet = (genderData) => {
  return genderData ? genderData.map((item) => item.vaccinations_given) : null;
};

const createOrderLabels = (orderData) => {
  return orderData ? orderData.map((item) => item.producer) : null;
};

const createVaccAmount = (orderData) => {
  return orderData ? orderData.map((item) => item.vaccinations) : null;
};

const createGenderLabelSet = (genderData) => {
  return genderData ? genderData.map((item) => item.gender) : null;
};

const createOrderAmount = (orderData) => {
  return orderData ? orderData.map((item) => item.orders) : null;
};

const StatisticalInfo = ({ summary }) => {
  return (
    <div className="statistics-view">
      <div className="summary-bar">
        <TextInfo
          text="Vaccinations ...given"
          number={givenVaccinationsSum(summary.vaccinations_given_by_gender)}
        />
        <div className="divider" />
        <TextInfo
          text="...in storage"
          number={summary.vaccinations_remaining}
        />
        <div className="divider" />
        <TextInfo
          text="...expiring in ten days"
          number={summary.expires_in_ten_days}
        />
      </div>
      <ChartRow
        orderLabels={createOrderLabels(
          summary.orders_and_vaccinations_by_producer
        )}
        orderAmount={createOrderAmount(
          summary.orders_and_vaccinations_by_producer
        )}
        vaccAmount={createVaccAmount(
          summary.orders_and_vaccinations_by_producer
        )}
        vaccLabelByGender={createGenderLabelSet(
          summary.vaccinations_given_by_gender
        )}
        vaccByGender={createGenderDataSet(summary.vaccinations_given_by_gender)}
      />
      <div className="summary-bar">
        <TextInfo text="Expired bottles" number={summary.expired_bottles} />
        <div className="divider" />
        <TextInfo text="Expired vaccines" number={summary.expired_vaccines} />
      </div>
    </div>
  );
};

export default StatisticalInfo;
