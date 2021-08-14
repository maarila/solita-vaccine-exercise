import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine } from '@fortawesome/free-solid-svg-icons';

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-icon">
        <FontAwesomeIcon icon={faChartLine} size="lg" />
      </div>
      <div className="footer-text">Vaccine statistics</div>
      <span className="footer-neutral-text">
        , a web dev exercise for Solita Dev Academy, 2021
      </span>
    </footer>
  );
};

export default Footer;
