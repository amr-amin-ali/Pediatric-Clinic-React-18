import { useEffect, useState } from "react";
import ServiceItemPreview from "./service-item-preview";
import { useStore } from "../../../hooks-store/store";
import { httpPOSTWithFile } from "../../../http/httpPOSTWithFile";
import { serviceModel } from "../../../models/clinic-service-model";
import { api } from "../../../utility/api";
import { closeBootstrapModal } from "../../../utility/close-bootstrap-modal";
import DashboardLoader from "../../components/loader/dashboardLoader";
import ModalFooter from "../../components/bootstrap-modal/modal-footer";
import TextInput from "../../components/inputs/text-input";
import TextareaInput from "../../components/inputs/textarea-input";
import ModalHeader from "../../components/bootstrap-modal/modal-header";

const AddServiceModal = () => {
  const dispatch = useStore()[1];
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newService, setNewService] = useState(serviceModel);
  const [errors, setErrors] = useState({});
  const [serverErrors, setServerErrors] = useState([]);

  /////////Image////////////////////////
  const [buttonText, setButtonText] = useState("إضافة صورة");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  const imgInputChangeHandler = (event) => {
    console.log("imgInputChangeHandler");
    if (event.target.files[0]) {
      setButtonText("تغيير الصورة");
      setSelectedImage(event.target.files[0]);
    }
  };
  useEffect(() => {
    if (selectedImage) {
      newService.image = URL.createObjectURL(selectedImage);
      setImageUrl(URL.createObjectURL(selectedImage));
    }
  }, [selectedImage, newService]);

  ///////End Image/////////////////////////////

  const inputsChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    if (name === "title") {
      setNewService({ ...newService, title: value });
      if (!value) {
        setErrors({ ...errors, title: "يجب إدخال إسم الخدمة" });
      }
    }
    if (name === "text") {
      setNewService({ ...newService, text: value });
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
  const resetFormClickHandler = (event) => {
    setNewService(serviceModel);
  };

  const submitFormHandler = async (event) => {
    event.preventDefault();
    if (!newService.title) {
      setErrors({ ...errors, title: "يجب إدخال إسم الخدمة" });
      return;
    }
    if (!newService.text) {
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
      formData.append("title", newService.title);
      formData.append("text", newService.text);

      httpPOSTWithFile(api.clinic_services.add_new_service, formData)
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
          if (response.status === 401) {
            alert("Please login first");
            dispatch("LOGOUT");
          }
          if (response.status === 201) {
            response.json().then((data) => {
              dispatch("ADD_SERVICE_TO_STORE", data);
              setNewService({});
              setErrors({});
              //AFTER SUCCESS
              setButtonText("إضافة صورة");
              setImageUrl(null);
              setSelectedImage(null);
              setIsSubmitting(false);
              closeBootstrapModal();
            });
          }
        })
        .catch((c) => {
          alert("Network error while publishing article!!");
          setIsSubmitting(false);
          closeBootstrapModal();
        });
    }
    return;
  };

  return (
    <div>
      <div
        className="modal  fade bg-blue-dark"
        data-bs-backdrop="static"
        id="addServiceModal"
        tabIndex="-1"
        aria-labelledby="addServiceModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl">
          <div className="modal-content bg-blue-light">
            <form>
              <ModalHeader title="إضافة خدمة جديدة" />
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
                  <div className="col-sm-12 col-md-6 my-1">
                    <div className="my-1">
                      <TextInput
                        onChangeHandler={inputsChangeHandler}
                        name="title"
                        placeholder="إسم الخدمة"
                        required={true}
                        value={newService.title ?? ""}
                      />
                      {errors.title && (
                        <span style={{ color: "red" }}>{errors.title}</span>
                      )}
                    </div>
                    <div className="my-1">
                      <TextareaInput
                        name="text"
                        placeholder="وصف الخدمة"
                        onChangeHandler={inputsChangeHandler}
                        value={newService.text ?? ""}
                      />
                      {errors.text && (
                        <span style={{ color: "red" }}>{errors.text}</span>
                      )}
                    </div>
                  </div>

                  <div className="col-sm-12 col-md-6 col-lg-4">
                    <ServiceItemPreview
                      image={imageUrl}
                      title={newService.title}
                      text={newService.text}
                    />

                    <label htmlFor="service-image" className="my-1">
                      <div
                        type="button"
                        className="my-btn my-primary btn btn-primary w-100 py-3 fw-bold"
                      >
                        {buttonText}
                      </div>
                      <input
                        onChange={imgInputChangeHandler}
                        type="file"
                        name="clinicLogo"
                        id="service-image"
                        hidden
                      />
                    </label>
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
                  أضف الآن
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
export default AddServiceModal;
