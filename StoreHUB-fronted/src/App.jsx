
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Layout from './Layout';
import Register from './pages/Register'
import ComponentDetailPage from './pages/ComponentDetailPage';
import ProfilePage from './pages/Profile';
import NotFoundPage from './pages/NotFound';
import UnauthorizedPage from './pages/Unauth';
import PostCreatePage from './pages/CreatePost';
const App = () => {
  return (
    <Router>
      <Routes>
        {/* Routes that include Navbar (use Layout) */}
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard/>} />
          <Route path="/component" element={<ComponentDetailPage/>} />
          <Route path="/profile" element={<ProfilePage/>}/>
          <Route path="/create" element={<PostCreatePage/>}/>
        </Route>
        
        {/* Routes that do not include Navbar */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register/>} />
        <Route path="/notfound" element={<NotFoundPage />} />
        <Route path="/unauth" element={<UnauthorizedPage />} />
     
      </Routes>
    </Router>
  );
};

export default App;
