import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { VehiclePage } from './pages/VehiclePage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="vehicles/:vehicleId" element={<VehiclePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
