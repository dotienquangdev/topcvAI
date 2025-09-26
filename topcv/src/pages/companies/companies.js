import "./companies.css";

function Companie({ item }) {
  return (
    <>
      <div className="companie" key={item._id}>
        <div className="companie_item">
          <img className="companie-img" src={item.logo_url} alt={item.name} />
          <div className="comnie-info">
            <span className="companie-description">{item.description}</span>
            <p className="companie-name">{item.name}</p>
          </div>
          <div className="companie-text">
            <div className="companie-textItem">
              <p className="companie-founded_yea">
                {/* {companie.founded_year} */}
              </p>
              <p className="companie-size">{item.size}</p>
              <p className="companie-location">{item.location}</p>
            </div>
            <i className="fa-regular fa-heart"></i>
          </div>
        </div>
      </div>
    </>
  );
}

export default Companie;
