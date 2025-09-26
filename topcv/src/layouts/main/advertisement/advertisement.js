import "./advertisement.css";
import { useState, useEffect } from "react";
import dataAdvertisement from "../../../data/dataAdvertisement";

function Advertisement() {
  const [page, setPage] = useState(0);
  const itemsPerPage = 3;
  const itemWidth = 307 + 10; // 307px ảnh + 10px margin (5 trái + 5 phải)
  const maxPage = Math.ceil(dataAdvertisement.length / itemsPerPage);

  useEffect(() => {
    const interval = setInterval(() => {
      setPage((prev) => (prev + 1) % maxPage);
    }, 10000);

    return () => clearInterval(interval);
  }, [maxPage]);

  const handleNext = () => {
    setPage((prev) => (prev + 1) % maxPage);
  };

  const handlePrev = () => {
    setPage((prev) => (prev - 1 + maxPage) % maxPage);
  };

  return (
    <>
      <h3>Advertisement</h3>
      <div className="advers">
        <button onClick={handlePrev}>&lt;</button>

        <div className="adver-wrapper">
          <div
            className="adver-slider"
            style={{
              transform: `translateX(-${page * itemsPerPage * itemWidth}px)`,
            }}
          >
            {dataAdvertisement.map((item, index) => (
              <div className="adver-item" key={index}>
                <img src={item.avatar} alt={item.title} />
              </div>
            ))}
          </div>
        </div>

        <button onClick={handleNext}>&gt;</button>
      </div>
    </>
  );
}

export default Advertisement;
