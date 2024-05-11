import useFetch from "../../hooks/useFetch";
import "./featured.css";

const Featured = () => {
  const { data, loading, error } = useFetch("/hotels/countByCity?cities=Colombo,Kalutara,Kandy");

  return (
    <div className="featured">
      {loading ? "Loading please wait" : <><div className="featuredItem">
        <img
          src="https://th.bing.com/th/id/OIP.ORyC7wGou80nRhTngXhuVAHaEG?rs=1&pid=ImgDetMain"
          alt=""
          className="featuredImg"
        />
        <div className="featuredTitles">
          <h1>Colombo</h1>
          <h2>{data[0]}</h2>
        </div>
      </div>
      
      <div className="featuredItem">
        <img
          src="https://th.bing.com/th/id/OIP.7OFo_xA8j7IClRkzbLpd-QHaFS?rs=1&pid=ImgDetMain"
          alt=""
          className="featuredImg"
        />
        <div className="featuredTitles">
          <h1>Kalutara</h1>
          <h2>{data[1]}</h2>
        </div>
      </div>
      <div className="featuredItem">
        <img
          src="https://th.bing.com/th/id/OIP.LJkr8_bFdhMC8T83xJsqbAHaFj?pid=ImgDet&w=201&h=150&c=7&dpr=1.6"
          alt=""
          className="featuredImg"
        />
        <div className="featuredTitles">
          <h1>Kandy</h1>
          <h2>{data[2]}</h2>
        </div>
      </div></>}
    </div>
  );
};

export default Featured;
