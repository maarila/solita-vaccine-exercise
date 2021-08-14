import ChartTitle from './ChartTitle';
import BarChart from './BarChart';
import PieChart from './PieChart';

const ChartRow = ({
  orderLabels,
  orderAmount,
  vaccAmount,
  vaccLabelByGender,
  vaccByGender,
}) => {
  return (
    <div className="chart-container">
      <div className="vaccine-order-container">
        <ChartTitle text="Total number of orders and vaccinations arrived by producer" />
        <BarChart
          producers={orderLabels}
          orderAmount={orderAmount}
          vaccAmount={vaccAmount}
        />
      </div>
      <div className="vaccine-by-gender-container">
        <ChartTitle text="Vaccinations given by gender" />
        <PieChart labelSet={vaccLabelByGender} vaccSet={vaccByGender} />
      </div>
    </div>
  );
};

export default ChartRow;
