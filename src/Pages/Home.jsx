import React from 'react';
import Header from '../Components/Header/Header';
import Category from './Category';
import RecentBills from './RecentBills';
import WhyChooseUs from './WhyChooseUs';
import HowItWorks from './HowItWorks';
import Testimonials from './Testimonials';

const Home = () => {
    return (
        <div>
            <Header></Header>
            <Category></Category>
            <RecentBills></RecentBills>
            <WhyChooseUs></WhyChooseUs>
            <HowItWorks></HowItWorks>
            <Testimonials></Testimonials>
        </div>
    );
};

export default Home;