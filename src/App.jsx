import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import SeoManager from './components/SeoManager';
import Home from './pages/Home';
import About from './pages/About';
import Products from './pages/Products';
import BrandCatalogue from './pages/BrandCatalogue';
import Gallery from './pages/Gallery';
import Offers from './pages/Offers';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';

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
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/offers" element={<Offers />} />
          <Route path="/help" element={<FAQ />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </Layout>
    </>
  );
}

export default App;
