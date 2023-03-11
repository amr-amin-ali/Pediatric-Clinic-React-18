import { Fragment, useEffect } from "react";
import { useStore } from "../../hooks-store/store";
import { httpGET } from "../../http/httpGET";
import { api } from "../../utility/api";
const Vaccines = () => {
  document.title = "جدول التطعيمات";

  const [state, dispatch] = useStore();
  let vaccinesCounter = 0;
  useEffect(() => {
    if (!state.vaccins_store.isInitiated) {
      httpGET(api.vaccins.get_all_vaccins).then((response) => {
        if (response.status === 401) {
          alert("Please login first");
          dispatch("LOGOUT");
        }
        if (response.status === 200) {
          response.json().then((data) => {
            if (data.length !== 0) dispatch("INITIATE_VACCINS", data);
          });
        }
      });
    }
  }, []);
  if (state.vaccins_store.vaccins.length === 0) {
    return null;
  }
  return (
    <Fragment>
      <h1 className="text-success font-family-hacen text-center my-3">
        التطعيمات
      </h1>
      <div className="accordion accordion-flush" id="accordionFlushExample">
        {state.vaccins_store.vaccins.map((vaccin) => {
          vaccinesCounter++;
          return (
            <div key={vaccin.id} className="accordion-item">
              <h2 className="accordion-header" id={`flush-heading${vaccin.id}`}>
                <button
                  className="accordion-button vaccinCollapsed collapsed shadow-none"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target={`#flush-collapse${vaccin.id}`}
                  aria-expanded="false"
                  aria-controls={`flush-collapse${vaccin.id}`}
                >
                  {vaccinesCounter} - {vaccin.name}
                </button>
              </h2>
              <div
                id={`flush-collapse${vaccin.id}`}
                className="accordion-collapse collapse"
                aria-labelledby={`flush-heading${vaccin.id}`}
                data-bs-parent="#accordionFlushExample"
              >
                <div className="accordion-body">
                  <p>
                    <b className="text-success">العمر: </b>
                    {vaccin.age}
                  </p>
                  <p>
                    <b className="text-success">الوصف: </b>
                    {vaccin.description}
                  </p>
                  <p>
                    <b className="text-success">المواعيد: </b>
                    {vaccin.dates}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Fragment>
  );
};
export default Vaccines;
