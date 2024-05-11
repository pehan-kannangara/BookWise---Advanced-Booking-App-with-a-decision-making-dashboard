import useFetch from "../../hooks/useFetch";
import "./propertyList.css";

const PropertyList = () => {
  const { data, loading, error } = useFetch("/hotels/countByType");

  const images = [
    "https://th.bing.com/th?id=OIP.SOC44y_4TAqBldWsoeA0fQHaER&w=329&h=189&c=8&rs=1&qlt=90&o=6&dpr=1.6&pid=3.1&rm=2",
    "https://th.bing.com/th/id/R.bf3f2f0ab470b6ae0acd69d3366b8e71?rik=zDfPdp%2fp8597XA&riu=http%3a%2f%2fwww.pixelstalk.net%2fwp-content%2fuploads%2f2016%2f10%2fPhotos-Apartment-HD.jpg&ehk=68xff7gTwc8dN2zuON1jZ0soOcByscrd6C9hwSszjyw%3d&risl=&pid=ImgRaw&r=0",
    "https://th.bing.com/th/id/R.cfe8f108afbd5c2f8e357c0737224b67?rik=Y%2bUArYwgo1RxlQ&pid=ImgRaw&r=0",
    "https://th.bing.com/th/id/OIP.hER-CPz-pa9sjGKLJFG8-gHaEg?w=720&h=438&rs=1&pid=ImgDetMain",
    "https://th.bing.com/th/id/OIP.WCTB4HvyP9IN_JCZCv8DQgHaEK?w=333&h=180&c=7&r=0&o=5&dpr=1.6&pid=1.7",
  ];

  return (
    <div className="pList">
      {loading ? (
        "loading"
      ) : (
        <>
          {data &&
            images.map((img,i) => (
              <div className="pListItem" key={i}>
                <img
                  src={img}
                  alt=""
                  className="pListImg"
                />
                <div className="pListTitles">
                  <h1>{data[i]?.type}</h1>
                  <h2>{data[i]?.count} {data[i]?.type}</h2>
                </div>
              </div>
            ))}
        </>
      )}
    </div>
  );
};

export default PropertyList;
