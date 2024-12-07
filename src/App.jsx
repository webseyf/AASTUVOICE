import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar"; // Import the Navbar
import Home from "./pages/Home";
import MarketPlace from "./pages/Marketplace";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
//import Profile from "./pages/Profile"; // Protected page
import CreatePost from "./pages/CreatePost";
import PostDetails from "./pages/PostDetails"; // New Post Details Page
//import ProductDetails from "./pages/ProductDetails"; // New Post Details Page
import PrivateRoute from "./components/PrivateRoute"; // Custom PrivateRoute
import ContactUsPage from "./pages/ContactUsPage";
import AboutUsPage from "./pages/AboutUsPage";
import Own from "./components/own";
import Footer from "./components/Footer";

const App = () => {
  return (
    <Router>
      <Navbar /> {/* Add Navbar at the top of all pages */}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/marketplace" element={<MarketPlace />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        {/* <Route path="/products/:id" element={<ProductDetails />} /> */}
        <Route path="/posts/:id" element={<PostDetails />} />
        <Route path='/contact-us' element={<ContactUsPage/>}/>
        <Route path="/about-us" element={<AboutUsPage/>}/>

        {/* Protected Routes */}
        {/* <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        /> */}
        <Route path="/create-post" element={
          <PrivateRoute>
 <CreatePost />
          </PrivateRoute>
         
          } />
      </Routes>
      <Own/>
      <Footer/>
    </Router>
  );
};

export default App;
