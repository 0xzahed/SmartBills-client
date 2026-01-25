import React from "react";
import Header from "../Components/Header/Header";
import Category from "./Category";
import RecentBills from "./RecentBills";
import WhyChooseUs from "./WhyChooseUs";
import HowItWorks from "./HowItWorks";
import Testimonials from "./Testimonials";
import Features from "./Features";
import Statistics from "./Statistics";
import Newsletter from "./Newsletter";
import CTA from "./CTA";

const Home = () => {
  return (
    <div>
      {/* 1. Hero Section */}
      <Header></Header>

      {/* 2. Features Section */}
      <Features></Features>

      {/* 3. Category Section */}
      <Category></Category>

      {/* 4. Statistics Section */}
      <Statistics></Statistics>

      {/* 5. Recent Bills Section */}
      <RecentBills></RecentBills>

      {/* 6. Why Choose Us Section */}
      <WhyChooseUs></WhyChooseUs>

      {/* 7. How It Works Section */}
      <HowItWorks></HowItWorks>

      {/* 8. Testimonials Section */}
      <Testimonials></Testimonials>

      {/* 9. Newsletter Section */}
      <Newsletter></Newsletter>

      {/* 10. CTA Section */}
      <CTA></CTA>
    </div>
  );
};

export default Home;
