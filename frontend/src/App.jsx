import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/client/home'
import Login from './pages/client/auth/login'
import Register from './pages/client/auth/register'
import Profile from './pages/client/auth/profile'
import ProductDetail from './pages/client/product_detail'
import Cart from './pages/client/cart'
import Contact from './pages/client/contact'
import Collection from './pages/client/collection'
import About from './pages/client/about'
import Blog from './pages/client/blog'
import Help from './pages/client/help'
function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="/about" element={<About />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/help" element={<Help />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App