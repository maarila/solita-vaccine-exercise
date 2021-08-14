const TextInfo = ({ text, number }) => {
  return (
    <div className="textual-info-container">
      <div className="info-text">{text}</div>
      <div className="info-number">{number}</div>
    </div>
  );
};

export default TextInfo;
