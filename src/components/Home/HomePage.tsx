// src/components/HomePage.tsx
import React from 'react';
import './HomaPage.css';
import { Link } from 'react-router-dom';
import seniorCareImage from './senior_care.jpeg'; 


const HomePage: React.FC = () => {
  return (
    <div className="container">
      <header>
        <h1>Caregiver Platform</h1>
        {/* Add navigation menu if needed */}
      </header>

      <main>
        <section className="hero">
        <div className="hero-content">
            <h2>Connecting Caregivers and Patients</h2>
            <p>Join our platform to find caregiving opportunities or hire a compassionate caregiver for your loved ones.</p>
            {/* Add the "Sign Up" button */}
            <Link to="/signup" className="btn btn-primary">Sign Up</Link>
            {/* Add the "Show Caregivers" button */}
            <Link to="/caregivers" className="btn btn-primary">Show Caregivers</Link>
          </div>
          <div className="hero-image">
            <img src={seniorCareImage} alt="Senior patient being taken care of" />
          </div>
        </section>
      </main>

      <footer>
        <p>&copy; 2023 Caregiver Platform. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
