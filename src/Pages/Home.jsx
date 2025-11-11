import React from 'react';
import Header from '../Components/Header/Header';
import Category from './Category';
import RecentBills from './RecentBills';

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