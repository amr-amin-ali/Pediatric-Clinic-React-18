import { useState } from "react";
import { vaccinModel } from "../../../models/vaccin-model";
import { httpPOST } from "../../../http/httpPOST";
import { useStore } from "../../../hooks-store/store";
import { api } from "../../../utility/api";
import { closeBootstrapModal } from "../../../utility/close-bootstrap-modal";
import ModalFooter from "../../components/bootstrap-modal/modal-footer";
import ModalHeader from "../../components/bootstrap-modal/modal-header";
import TextInput from "../../components/inputs/text-input";
import DashboardLoader from "../../components/loader/dashboardLoader";

const CreateVaccineModal = () => {
  const dispatch = useStore()[1];
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverErrors, setServerErrors] = useState([]);

  const resetFormClickHandler = (event) => {
    setModel(vaccinModel);
  };
  const [model, setModel] = useState(vaccinModel);
  const [errors, setErrors] = useState({});

  const inputChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    if (name === "name") {
      if (!value.trim()) {
        setErrors({ ...errors, name: "أدخل إسم اللقاح." });
      } else {
        setModel({ ...model, name: value });
      }
    }

    if (name === "age") {
      if (!value.trim()) {
        setErrors({ ...errors, age: "أدخل العمر المناسب." });
      } else {
        setModel({ ...model, age: value });
      }
    }

    if (name === "description") {
      if (!value.trim()) {
        setErrors({ ...errors, description: "أدخل وصف اللقاح." });
      } else {
        setModel({ ...model, description: value });
      }
    }

    if (name === "dates") {
      if (!value.trim()) {
        setErrors({ ...errors, dates: "أدخل مواعيد الذهاب للتلقيح." });
      } else {
        setModel({ ...model, dates: value });
      }
    }

    if (value) {
      const ers = { ...errors };
      delete ers[name];
      setErrors({ ...ers });
    }
  };

  /////////////////////////////////////////////////////////////////////
  const submitFormHandler = async (event) => {
    event.preventDefault();
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    if (!model.name) {
      setErrors({ ...errors, name: "أدخل إسم اللقاح." });
      return;
    }
    if (!model.age) {
      setErrors({ ...errors, age: "أدخل العمر المناسب." });
      return;
    }

    if (!model.dates) {
      setErrors({ ...errors, dates: "أدخل مواعيد الذهاب للتلقيح." });
      return;
    }

    if (!model.description) {
      setErrors({ ...errors, description: "أدخل وصف اللقاح." });
      return;
    }

    if (errors && Object.keys(errors).length === 0) {
      setIsSubmitting(true);
      httpPOST(api.vaccins.add_new_vaccin, {
        name: model.name,
        age: model.age,
        description: model.description,
        dates: model.dates,
      })
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
            closeBootstrapModal();
          }
          if (response.status === 201) {
            response.json().then((data) => {
              dispatch("ADD_VACCINS_TO_STORE", data);
              setModel(vaccinModel);
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
        id="createNewFileModal"
        tabIndex="-1"
        aria-labelledby="createNewFileModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl">
          <div className="modal-content bg-blue-light">
            <form>
              <ModalHeader title="إضافة لقاح جديد" />
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
                <div className="row m-0 p-2">
                  <div className="col-sm-12 col-lg-6 my-1">
                    <TextInput
                      onChangeHandler={inputChangeHandler}
                      name="name"
                      value={model.name ?? ""}
                      placeholder="إسم اللقاح"
                    />
                    {errors.name && (
                      <span style={{ color: "red" }}>{errors.name}</span>
                    )}
                  </div>
                  <div className="col-sm-12 col-lg-6 my-1">
                    <TextInput
                      onChangeHandler={inputChangeHandler}
                      name="age"
                      value={model.age ?? ""}
                      placeholder="العمر"
                    />
                    {errors.age && (
                      <span style={{ color: "red" }}>{errors.age}</span>
                    )}
                  </div>
                  <div className="col-12 my-1">
                    <TextInput
                      onChangeHandler={inputChangeHandler}
                      name="dates"
                      value={model.dates ?? ""}
                      placeholder="المواعيد"
                    />
                    {errors.dates && (
                      <span style={{ color: "red" }}>{errors.dates}</span>
                    )}
                  </div>
                  <div className="col-12 my-1">
                    <TextInput
                      onChangeHandler={inputChangeHandler}
                      name="description"
                      value={model.description ?? ""}
                      placeholder="الوصف"
                    />
                    {errors.description && (
                      <span style={{ color: "red" }}>{errors.description}</span>
                    )}
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
export default CreateVaccineModal;
