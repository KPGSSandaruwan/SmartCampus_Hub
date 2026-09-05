import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ListingForm from './components/common/ListingForm';
import Home from './pages/Home';
import Auth from './pages/Auth';
import ListingDetail from './pages/ListingDetail';
import Dashboard from './pages/Dashboard';

import Rentals from './pages/Rentals';
import RideList from './pages/RideList';
import CreateRide from './pages/CreateRide';
import RideDetails from './pages/RideDetails';
import ParcelList from './pages/ParcelList';
import CreateParcel from './pages/CreateParcel';
import ParcelDetails from './pages/ParcelDetails';
import About from './pages/About';
import Contact from './pages/Contact';
import PartTimeJobs from './pages/PartTimeJobs';

function App() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <div className="app-container">
      <Navbar onOpenCreateModal={() => setIsCreateModalOpen(true)} />
      
      <main className="main-content">
        <Routes>
          <Route 
            path="/" 
            element={<Home onOpenCreateModal={() => setIsCreateModalOpen(true)} />} 
          />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/part-time-jobs" element={<PartTimeJobs />} />
          <Route path="/rentals" element={<Rentals />} />
          <Route path="/rentals/:category" element={<Rentals />} />
          <Route path="/rides" element={<RideList />} />
          <Route path="/rides/create" element={<CreateRide />} />
          <Route path="/rides/:id" element={<RideDetails />} />
          <Route path="/parcels" element={<ParcelList />} />
          <Route path="/parcels/create" element={<CreateParcel />} />
          <Route path="/parcels/:id" element={<ParcelDetails />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/listings/:id" element={<ListingDetail />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </main>

      <Footer />

      {/* Global Create Listing Modal */}
      <ListingForm 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        onCreated={() => {
          setIsCreateModalOpen(false);
          window.location.reload();
        }} 
      />
    </div>
  );
}

export default App;
