const SendMessage = () => {
  return (
    <div>
      <div className="container col-lg-6" id="contact-us">
        <h1 className="main-title text-center">أرسل رسالة</h1>
        <form id="contactForm" className="position-relative">
          <div className="position-absolute bg-danger w-75 rounded-5"
            style={{
              rotate: "-45deg",
              top: "32%",
              height: "15%",
              lineHeight: "185%",
              textAlign: "center",
              fontWeight: "bold",
              color: "white",
              fontSize: "2rem",
              translate: "-15%"
            }}
          > قريباً </div>
          <div className="mb-3">
            <input
              disabled
              className="form-control form-control-lg mt-2"
              type="text"
              placeholder="إسمك"
              aria-label=".form-control-lg example"
            />
          </div>
          <div className="mb-3">
            <input
              disabled
              className="form-control form-control-lg mt-2"
              type="text"
              placeholder="رقم الموبايل للتواصل"
              aria-label=".form-control-lg example"
            />
          </div>
          <div className="mb-3">
            <input
              disabled
              className="form-control form-control-lg mt-2"
              type="text"
              placeholder="عنوانك"
              aria-label=".form-control-lg example"
            />
          </div>
          <div className="mb-3">
            <textarea
              disabled
              className="form-control form-control-lg mt-2"
              id="message"
              type="text"
              placeholder="رسالتك..."
              style={{ height: "10rem" }}
              data-sb-validations="required"
            ></textarea>
          </div>
          <div className="d-grid mb-3">
            
            <button disabled className="btn text-danger bg-warning fw-bold btn-lg" type="submit">
              أرسل
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default SendMessage;
