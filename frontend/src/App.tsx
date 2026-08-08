import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Home } from "./pages/Home";
import { Search } from "./pages/Search";
import { Trip } from "./pages/Trip";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Preferences } from "./pages/Preferences";
import { ListingDetail } from "./pages/ListingDetail";
import { Bookings } from "./pages/Bookings";
import { AmbientBackground } from "./components/AmbientBackground";
import { ErrorBoundary } from "./components/ErrorBoundary";

function App() {
  return (
    <BrowserRouter>
      <AmbientBackground />
      <Navbar />
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/trip" element={<Trip />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/preferences" element={<Preferences />} />
          <Route path="/listings/:id" element={<ListingDetail />} />
          <Route path="/bookings" element={<Bookings />} />
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;