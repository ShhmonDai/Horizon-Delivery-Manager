import React from 'react';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import SignIn from './pages/SignIn';
import Home from './pages/Home';
import Header from './components/Header';

export default function App() {
  return (
<BrowserRouter>
    <Header />
    <Routes>
      <Route path="/" element={<SignIn /> } />
      <Route path="/home" element={<Home />} />
    </Routes>
</BrowserRouter>
  )
}
