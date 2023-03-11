import { Fragment, useEffect } from "react";
import Slider from "../components/slider";
import BookRole from "../components/booking-section/booking-section";
import SendMessage from "../components/send-message";
import ServicesSection from "../components/services-section/services-section";
import ArticlesSection from "../components/articles-section/articles-section";
import NewsSection from "../components/news-section/news-section";

const Home = () => {
  document.title = "الرئيسية";
  useEffect(() => {
    // scroll to top on page load
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  return (
    <Fragment>
      <Slider />
      <ServicesSection />
      <BookRole />
      <NewsSection/>
      <ArticlesSection />
      <SendMessage />
    </Fragment>
  );
};
export default Home;
