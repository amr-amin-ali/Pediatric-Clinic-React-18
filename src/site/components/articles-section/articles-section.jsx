import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useStore } from "../../../hooks-store/store";
import { api } from "../../../utility/api";
import ArticleItem from "./article-item";
import { httpGET } from "../../../http/httpGET";
import SiteLoadindSpiner from "../site-loading-spinner";

const ArticlesSection = () => {
  const dispatch = useStore(false)[1];
  const [latestTwoArticles, setLatestTwoArticles] = useState([]);
  const [isLoading, setIsLoading] = useState([]);
  let [isInitiated, setIsInitiated] = useState(false);
  useEffect(() => {
    if (latestTwoArticles.length < 1 && isInitiated === false) {
      setIsLoading(true);
      httpGET(api.articles.get_latest_two_articles)
        .then((response) => {
          if (response.status === 401) {
            alert("Please login first");
            dispatch("LOGOUT");
          }
          if (response.status === 200) {
            response.json().then((data) => {
              setLatestTwoArticles(data);
            });
          }
          setIsLoading(false);
        })
        .catch((c) => {
          console.log(c);

          alert("Network error while fetching articles !!");
          setIsLoading(false);
        });
    }
    setIsInitiated(true);
  }, [latestTwoArticles.length]);
  if (isLoading) return <SiteLoadindSpiner text="تحميل المقالات" />;
  else if (latestTwoArticles.length === 0) {
    return null;
  } else {
    return (
      <section className="py-2 px-1">
        <div className="container-fluid" style={{ maxWidth: "100%" }}>
          <h1 className="text-success font-family-hacen text-center mb-5">
            مقالات الدكتورة
          </h1>
          <div className="row">
            {latestTwoArticles.map((article) => (
              <div
                key={article.id}
                className="col-sm-12 col-lg-5 mx-lg-auto p-0"
              >
                <ArticleItem article={article} />
              </div>
            ))}
          </div>
        </div>
        <Link
          to="/Articles"
          className="text-decoration-none text-center fw-bold mb-5 d-block"
        >
          عرض جميع المقالات
        </Link>
      </section>
    );
  }
};

export default ArticlesSection;
