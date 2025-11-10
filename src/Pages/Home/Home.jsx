import React from 'react';
import Navbar from '../../Components/Navbar/Navbar';
import Header from '../../Header/Header';
import Category from '../Category/Category';
import RecentBills from '../RecentBills/RecentBills';

const Home = () => {
    return (
        <div>
            <Header></Header>
            <Category></Category>
            <RecentBills></RecentBills>
        </div>
    );
};

export default Home;