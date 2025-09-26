import "./jobs.css";

export default function JobItem({ item, handleHover, clearHover }) {
  return (
    <div className="job">
      <div className="job_item">
        <img
          className="companie-img"
          src={item?.company_id?.logo_url}
          alt={item?.company_id?.name}
        />
        <div className="job-info">
          <a href={`/jobs/${item._id}`}>
            <p
              className="job-info-title"
              onMouseEnter={(e) => handleHover(e, item)}
              onMouseLeave={clearHover}
            >
              {item.title}
            </p>
          </a>
          <p className="job-categoriesName">{item?.category_id?.name}</p>
          <a className="job-name" href={`/companies/${item.company_id._id}`}>
            <p className="job-name">{item?.company_id?.name}</p>
          </a>
        </div>
      </div>
      <div className="job-text">
        <div className="job-textItem">
          <div className="job-many">
            {item.salary_min > 100 ? (
              <>
                <p className="job-founded_yea">{item.salary_min}</p> -
                <p className="job-founded_yea">{item.salary_max} $</p>
              </>
            ) : (
              <>
                <p className="job-founded_yea">{item.salary_min}</p> -
                <p className="job-founded_yea">{item.salary_max} triệu</p>
              </>
            )}
          </div>
          <p className="job-location">{item.location}</p>
        </div>
        <i className="fa-regular fa-heart heart-click"></i>
      </div>
    </div>
  );
}
