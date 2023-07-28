// src/components/HomePage.tsx
import React from 'react';
import './HomaPage.css';
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
