import { Pie } from 'react-chartjs-2';

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
  return vaccSet && labelSet ? <Pie data={data} /> : null;
};

export default PieChart;
