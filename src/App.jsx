import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import SeoManager from './components/SeoManager';
import Home from './pages/Home';
import About from './pages/About';
import Products from './pages/Products';
import BrandCatalogue from './pages/BrandCatalogue';
import Brands from './pages/Brands';
import Gallery from './pages/Gallery';
import Offers from './pages/Offers';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import SeoAdmin from './pages/SeoAdmin';

function App() {
  return (
    <>
      <SeoManager />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:brandName" element={<BrandCatalogue />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/offers" element={<Offers />} />
          <Route path="/help" element={<FAQ />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/seo-admin" element={<SeoAdmin />} />
        </Routes>
      </Layout>
    </>
  );
}

export default App;
