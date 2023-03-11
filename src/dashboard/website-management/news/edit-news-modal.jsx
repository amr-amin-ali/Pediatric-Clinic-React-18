import { useEffect, useState } from "react";
import NewsItemPreview from "./news-item-preview";
import { newsModel } from "../../../models/news-model";
import { useStore } from "../../../hooks-store/store";
import { httpPUTWithFile } from "../../../http/httpPUTWithFile";
import { api } from "../../../utility/api";
import { closeBootstrapModal } from "../../../utility/close-bootstrap-modal";
import ModalFooter from "../../components/bootstrap-modal/modal-footer";
import ModalHeader from "../../components/bootstrap-modal/modal-header";
import TextInput from "../../components/inputs/text-input";
import TextareaInput from "../../components/inputs/textarea-input";
import DashboardLoader from "../../components/loader/dashboardLoader";

const EditNewsModal = ({ news }) => {
  const dispatch = useStore()[1];
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newsToEdit, setNewsToEdit] = useState(news);
  const [serverErrors, setServerErrors] = useState([]);

  /////////Image////////////////////////
  const [buttonText, setButtonText] = useState("إضافة صورة");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  const imgInputChangeHandler = (event) => {
    if (event.target.files[0]) {
      setButtonText("تغيير الصورة");
      setSelectedImage(event.target.files[0]);
    }
  };
  useEffect(() => {
    if (selectedImage) {
      newsToEdit.image = URL.createObjectURL(selectedImage);
      setImageUrl(URL.createObjectURL(selectedImage));
    }
  }, [selectedImage, newsToEdit]);

  ///////End Image/////////////////////////////

  const [errors, setErrors] = useState({});
  const inputsChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    if (name === "title") {
      setNewsToEdit({ ...newsToEdit, title: value });
      if (!value) {
        setErrors({ ...errors, title: "يجب إدخال إسم الخدمة" });
      }
    }
    if (name === "text") {
      setNewsToEdit({ ...newsToEdit, text: value });
      if (!value) {
        setErrors({ ...errors, text: "يجب إدخال وصف الخدمة" });
      }
    }
    if (value) {
      const ers = { ...errors };
      delete ers[name];
      setErrors({ ...ers });
    }
  };

  const submitFormHandler = async (event) => {
    event.preventDefault();
    if (!newsToEdit.title) {
      setErrors({ ...errors, title: "يجب إدخال إسم الخدمة" });
      return;
    }
    if (!newsToEdit.text) {
      setErrors({ ...errors, text: "يجب إدخال وصف للخدمة" });
      return;
    }
    if (errors && Object.keys(errors).length === 0) {
      setIsSubmitting(true);
      // Create an object of formData
      const formData = new FormData();
      // Update the formData object
      if (selectedImage) {
        formData.append("image", selectedImage, selectedImage.name);
      }
      formData.append("id", newsToEdit.id);
      formData.append("title", newsToEdit.title);
      formData.append("text", newsToEdit.text);

      httpPUTWithFile(api.news.update_news, formData)
        .then((response) => {
          if (response.status === 400 || response.status === 422) {
            response.json().then((result) => {
              const backendErrors = [];
              for (const key in result) {
                backendErrors.push(`${key}: ${result[key]}`);
              }
              setServerErrors(backendErrors);
              setIsSubmitting(false);
            });
            return;
          }
          if (response.status === 404) {
            response.json().then((result) => alert(Object.values(result)[0]));
            isSubmitting(false);
            closeBootstrapModal();
          }
          if (response.status === 401) {
            alert("Please login first");
            dispatch("LOGOUT");
          }
          if (response.status === 200) {
            response.json().then((data) => {
              dispatch("UPDATE_NEWS_IN_STORE", data);
              setNewsToEdit({});
              setErrors({});
              //AFTER SUCCESS
              setButtonText("إضافة صورة");
              setImageUrl(null);
              setSelectedImage(null);
              setIsSubmitting(false);
              closeBootstrapModal();
            });
          } else {
            alert("Some thing went wrong!");
            setIsSubmitting(false);
          }
        })
        .catch((c) => {
          alert("Network error while publishing article!!");
          isSubmitting(false);
        });
    }
  };
  const resetFormClickHandler = (event) => {
    setNewsToEdit(newsModel);
  };
  useEffect(() => {
    setNewsToEdit(news);
  }, [news]);

  return (
    <div>
      <button
        id="showEditNewsModelBtn"
        hidden
        data-bs-toggle="modal"
        data-bs-target="#editVaccinModel"
      ></button>

      <div
        className="modal  fade bg-blue-dark"
        data-bs-backdrop="static"
        id="editVaccinModel"
        tabIndex="-2"
        aria-labelledby="editVaccinModelLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl">
          <div className="modal-content bg-blue-light">
            <form>
              <ModalHeader title="تعديل بيانات الخبر" />
              {serverErrors.length > 0 && (
                <div
                  className="alert alert-danger alert-dismissible fade show border-0"
                  role="alert"
                >
                  <button
                    type="button"
                    className="btn-close bg-danger"
                    data-bs-dismiss="alert"
                    aria-label="Close"
                  ></button>
                  <ul className="text-danger" dir="ltr">
                    {serverErrors &&
                      serverErrors.map((error) => {
                        return <li key={error}>{error}</li>;
                      })}
                  </ul>
                </div>
              )}
              {isSubmitting && <DashboardLoader />}
              {!isSubmitting && (
                <div className="row justify-content-between m-0">
                  <div className="col-sm-12 col-lg-6 text-warning">
                    <div className="mx-0 my-1">
                      <TextInput
                        onChangeHandler={inputsChangeHandler}
                        name="title"
                        placeholder="عنوان الخبر"
                        required={true}
                        value={newsToEdit.title ?? ""}
                      />
                      {errors.title && (
                        <span style={{ color: "red" }}>{errors.title}</span>
                      )}
                    </div>
                    <div className="mx-0 my-1">
                      <TextareaInput
                        name="text"
                        placeholder="نص الخبر"
                        onChangeHandler={inputsChangeHandler}
                        value={newsToEdit.text ?? ""}
                      />
                      {errors.text && (
                        <span style={{ color: "red" }}>{errors.text}</span>
                      )}
                    </div>
                  </div>
                  <div className="col-sm-12 col-lg-6">
                    <NewsItemPreview
                      image={
                        imageUrl ?? (news.image && api.base_url + news.image)
                      }
                      title={newsToEdit.title}
                      text={newsToEdit.text}
                    />
                    <div className="mx-0 my-1">
                      <div className="my-3">
                        <label htmlFor="updateNewsImage">
                          <div
                            type="button"
                            className="my-btn my-primary btn btn-primary w-100 py-3 fw-bold"
                          >
                            {buttonText}
                          </div>
                          <input
                            onChange={imgInputChangeHandler}
                            type="file"
                            name="clinicLogoUpdate"
                            id="updateNewsImage"
                            hidden
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <ModalFooter>
                <button
                  onClick={submitFormHandler}
                  type="button"
                  className="my-btn my-success btn btn-success py-3 px-5 fw-bold"
                  style={{ width: "200px" }}
                >
                  حفظ التعديلات
                </button>
                <button
                  onClick={resetFormClickHandler}
                  type="reset"
                  style={{
                    backgroundColor: "var(--blue-dark)",
                    width: "190px",
                  }}
                  className="my-btn btn py-3 px-5 fw-bold btn-dark text-white"
                >
                  تفريغ الحقول
                </button>
              </ModalFooter>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default EditNewsModal;
