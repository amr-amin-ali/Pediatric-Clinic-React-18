import { api } from "../../../utility/api";
import clinicLogo from "../../../assets/clinicLogo.jpg";

const NewsItem = ({ news}) => {
  return (
    <div className="row m-0 shadow border mb-3 rounded-3 overflow-hidden">

      <div className="col-sm-12 col-md-5 p-0 d-flex flex-column align-items-center">
        <img src={news.image ? `${api.base_url}${news.image}` : clinicLogo} alt={news.title} className="img-fluid w-100"/>
      </div>

      <div className="col-sm-12 col-md-7 blog-content-tab p-1">
        <h2 className="fs-4 ps-2 pt-3">{news.title}</h2>
        <p className="text-truncate ps-2" style={{ fontSize: "12px", textIndent: "20px" }}>
          {news.text}
        </p>
      </div>

    </div>
  );
};

export default NewsItem;
