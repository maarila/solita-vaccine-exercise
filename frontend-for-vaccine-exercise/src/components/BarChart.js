import { Bar } from 'react-chartjs-2';

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
  return producers && orderAmount && vaccAmount ? (
    <Bar data={data} options={options} />
  ) : null;
};

export default BarChart;
