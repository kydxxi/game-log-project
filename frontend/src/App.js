// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // 부트스트랩 CSS

// 페이지들
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import WritePage from './pages/WritePage';
import StatsPage from './pages/StatsPage';
import FollowPage from './pages/FollowPage';

// 방금 만든 네비게이션 바
import MyNavbar from './components/MyNavbar';

// Navbar를 조건부로 보여주기 위한 껍데기 컴포넌트
function Layout() {
  const location = useLocation();
  
  // Navbar가 숨겨져야 할 페이지들 목록
  const hideNavbarPaths = ['/', '/signup'];
  const showNavbar = !hideNavbarPaths.includes(location.pathname);

  return (
    <>
      {/* 조건에 맞을 때만 Navbar 표시 */}
      {showNavbar && <MyNavbar />}
      
      {/* 실제 페이지 내용 */}
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/write" element={<WritePage />} />
        <Route path="/stats" element={<StatsPage />} />
        <Route path="/friends" element={<FollowPage />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

export default App;