import { Fragment, useEffect, useState } from "react";
import { useStore } from "../../../hooks-store/store";
import ArticleItem from "./article-item";
import AddArticleModal from "./add-article-modal";
import { httpDELETE } from "../../../http/httpDELETE";
import { httpGET } from "../../../http/httpGET";
import { openBootstrapModal } from "../../../utility/open-bootstrap-modal";
import { api } from "../../../utility/api";
import EditArticleModal from "./edit-article-modal";
import DashboardLoader from "../../components/loader/dashboardLoader";

const ArticlesManagement = () => {
  document.title = "المقالات";
  const [state, dispatch] = useStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteArticle = async (articleId) => {
    if (window.confirm("هل تريد الحذف فعلاً؟") === true) {
      setIsDeleting(true);
      httpDELETE(api.articles.delete_article + articleId)
        .then((response) => {
          if (response.status === 204) {
            dispatch("DELETE_ARTICLE", articleId);
          }
          if (response.status === 404) {
            response.json().then((result) => alert(Object.values(result)[0]));
          }
          if (response.status === 400 || response.status === 422) {
            response.json().then((result) => alert(Object.values(result)[0]));
          }
          if (response.status === 401) {
            alert("Please login first");
            dispatch("LOGOUT");
          }
          setIsDeleting(false);
        })
        .catch((c) => {
          alert("Network error while deleting article!!");
          setIsDeleting(false);
        });
    }
  };

  const [articleToEdit, setArticleToEdit] = useState({});
  const editArticle = (article) => {
    setArticleToEdit(article);
    openBootstrapModal("edit-article-modal");
  };
  useEffect(() => {
    //get all articles from the server
    if (!state.articles_store.isInitiated) {
      setIsLoading(true);
      httpGET(api.articles.get_all_articles)
        .then((response) => {
          if (response.status === 401) {
            alert("Please login first");
            dispatch("LOGOUT");
          }
          if (response.status === 200) {
            response.json().then((data) => {
              if (data.length !== 0) dispatch("INITIATE_ARTICLES", data);
            });
          }
          setIsLoading(false);
        })
        .catch((c) => {
          alert("Network error while fetching articles!!");
          setIsLoading(false);
        });
    }
  }, []);

  return (
    <div className="container">
      <div className="card text-center m-3">
        <div className="card-header">الخيارات المتاحة</div>
        <div className="card-body">
          <h5 className="card-title mt-4">
            هذه الإجراءات خاصة بمقالات الدكتورة
          </h5>
          <p className="card-text mb-4">
            يمكنك الإختيار ما بين نشر مقالة جديدة أو إستعراض المقالات الحالية أو
            حذف مقال أو تعديله.
          </p>
          <div className="row justify-content-center m-0">
            <div className="col-4">
              <div
                type="button"
                className="my-btn my-primary btn btn-primary w-100 py-3 fw-bold"
                data-bs-toggle="modal"
                data-bs-target="#add-article-modal"
              >
                إضافة مقالة
              </div>
            </div>
          </div>
        </div>
        <div className="card-footer text-muted">لا تنسى أن تحظى بيوم سعيد</div>
      </div>
      <AddArticleModal />

      <div className="row justify-content-between m-3">
        {isLoading && <DashboardLoader text="جارى تحميل البيانات" />}
        {isDeleting && <DashboardLoader text="جارى الحذف" />}
        {!isLoading && state.articles_store.articles.length > 0 && (
          <Fragment>
            <h1 className="text-center text-white mt-3">المقالات</h1>

            {state.articles_store.articles.map((article) => {
              if (article) {
                return (
                  <div key={article.id + article.id} className="my-1 p-0">
                    <ArticleItem
                      key={article.id}
                      article={article}
                      deleteClickHandler={deleteArticle}
                      editClickHandler={editArticle}
                    />
                  </div>
                );
              } else {
                return null;
              }
            })}
          </Fragment>
        )}
        {!isLoading && state.articles_store.articles.length < 1 && (
          <h1 className="text-center text-white mt-3">
            لم تقم بإضافة مقالات حتى الآن
          </h1>
        )}

        <EditArticleModal article={articleToEdit} />
      </div>
    </div>
  );
};

export default ArticlesManagement;
