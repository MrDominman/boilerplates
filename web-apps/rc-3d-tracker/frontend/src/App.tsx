import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ProjectDashboard from './pages/ProjectDashboard';
import CreateProject from './pages/CreateProject';
import ProjectDetails from './pages/ProjectDetails';
import ComponentManager from './pages/ComponentManager';
import PartsManager from './pages/PartsManager';
import './styles/globals.css';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<ProjectDashboard />} />
          <Route path="/projects/new" element={<CreateProject />} />
          <Route path="/projects/:id" element={<ProjectDetails />} />
          <Route path="/projects/:id/components" element={<ComponentManager />} />
          <Route path="/projects/:id/parts" element={<PartsManager />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;

