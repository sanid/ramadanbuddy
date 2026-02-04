import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { AppProvider } from './context/AppContext';
import Dashboard from './pages/Dashboard';
import Prayers from './pages/Prayers';
import Quran from './pages/Quran';
import Tracker from './pages/Tracker';

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="prayers" element={<Prayers />} />
            <Route path="quran" element={<Quran />} />
            <Route path="tracker" element={<Tracker />} />
          </Route>
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;
