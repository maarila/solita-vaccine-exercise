import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine } from '@fortawesome/free-solid-svg-icons';

const MainTitle = () => {
  return (
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
  );
};

export default MainTitle;
