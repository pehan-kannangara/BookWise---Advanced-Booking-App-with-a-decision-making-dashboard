import { format } from "date-fns";
import { useState } from "react";
import { DateRange } from "react-date-range";
import { useLocation } from "react-router-dom";
import Header from "../../components/header/Header";
import Navbar from "../../components/navbar/Navbar";
import SearchItem from "../../components/searchItem/SearchItem";
import useFetch from "../../hooks/useFetch";
import "./list.css";

const List = () => {
  const location = useLocation();

  // Declare state variables
  const [destination, setDestination] = useState(
    location.state?.destination || "City"
  );
  const [dates, setDates] = useState(
    location.state?.dates || [
      { startDate: new Date(), endDate: new Date(), key: "selection" },
    ]
  );
  const [openDate, setOpenDate] = useState(false);
  const [options, setOptions] = useState(
    location.state?.options || { adult: 1, children: 0, room: 1 }
  );
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(999);

  const { data, loading, error, reFetch } = useFetch(
    `/hotels?city=${destination}&min=${min}&max=${max}`
  );

  const handleClick = () => {
    reFetch(); // Re-fetch data when search is triggered
  };

  return (
    <div>
      <Navbar />
      <Header type="list" />
      <div className="listContainer">
        <div className="listWrapper">
          <div className="listSearch">
            <h1 className="lsTitle">Search</h1>
            <div className="lsItem">
              <label>Destination</label>
              <input
                type="text"
                placeholder={destination}
                onChange={(e) => setDestination(e.target.value)}
              />
            </div>
            <div className="lsItem">
              <label>Check-in Date</label>
              <span onClick={() => setOpenDate(!openDate)}>
                {`${format(dates[0].startDate, "MM/dd/yyyy")} to ${format(
                  dates[0].endDate,
                  "MM/dd/yyyy"
                )}`}
              </span>
              {openDate && (
                <DateRange
                  onChange={(item) => setDates([item.selection])}
                  minDate={new Date()}
                  ranges={dates}
                />
              )}
            </div>
            <div className="lsItem">
              <label>Options</label>
              <div className="lsOptions">
                <div className="lsOptionItem">
                  <span className="lsOptionText">Min price per night</span>
                  <input
                    type="number"
                    value={min}
                    onChange={(e) => setMin(parseInt(e.target.value))}
                  />
                </div>
                <div className="lsOptionItem">
                  <span className="lsOptionText">Max price per night</span>
                  <input
                    type="number"
                    value={max}
                    onChange={(e) => setMax(parseInt(e.target.value))}
                  />
                </div>
                <div className="lsOptionItem">
                  <span className="lsOptionText">Adult</span>
                  <input
                    type="number"
                    min={1}
                    value={options.adult}
                    onChange={(e) =>
                      setOptions({
                        ...options,
                        adult: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="lsOptionItem">
                  <span className="lsOptionText">Children</span>
                  <input
                    type="number"
                    min={0}
                    value={options.children}
                    onChange={(e) =>
                      setOptions({
                        ...options,
                        children: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="lsOptionItem">
                  <span className="lsOptionText">Room</span>
                  <input
                    type="number"
                    min={1}
                    value={options.room}
                    onChange={(e) =>
                      setOptions({ ...options, room: parseInt(e.target.value) })
                    }
                  />
                </div>
              </div>
            </div>
            <button onClick={handleClick}>Search</button>
          </div>
          <div className="listResult">
            {loading ? (
              "Loading..."
            ) : error ? (
              <div>Error: {error.message}</div>
            ) : data && data.length > 0 ? (
              data.map((item) => <SearchItem item={item} key={item._id} />)
            ) : (
              <div>No results found</div> // Handle no data
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default List;
