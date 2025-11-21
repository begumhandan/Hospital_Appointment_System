import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AppointmentList from './components/AppointmentList';
import AppointmentForm from './components/AppointmentForm';
import AppointmentDetail from './components/AppointmentDetail';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-blue-600 text-white shadow-lg">
          <div className="container mx-auto px-6 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold tracking-wide">Antigravity Hospital</h1>
            <div className="space-x-6">
              <Link to="/" className="hover:text-blue-200 transition-colors">Randevular</Link>
              <Link to="/new" className="bg-white text-blue-600 px-4 py-2 rounded-full font-semibold hover:bg-blue-50 transition-colors">Yeni Randevu</Link>
            </div>
          </div>
        </nav>

        <div className="container mx-auto px-6 py-8">
          <Routes>
            <Route path="/" element={<AppointmentList />} />
            <Route path="/new" element={<AppointmentForm />} />
            <Route path="/appointments/:id" element={<AppointmentDetail />} />
            <Route path="/appointments/:id/edit" element={<AppointmentForm />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
