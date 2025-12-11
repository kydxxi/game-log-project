// src/components/MyNavbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import api from '../api';

function MyNavbar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout'); //
      alert('로그아웃 되었습니다.');
      navigate('/');
    } catch (error) {
      navigate('/');
    }
  };

  return (
    // 상단에 고정(sticky="top"), 배경 흰색, 그림자(shadow-sm)
    <Navbar bg="white" expand="lg" className="shadow-sm" sticky="top">
      <Container>
        {/* 로고 (클릭하면 대시보드로) */}
        <Navbar.Brand as={Link} to="/dashboard" className="fw-bold fs-4">
          🎮 Game Log
        </Navbar.Brand>
        
        {/* 모바일에서 메뉴 숨기기 버튼 (햄버거 메뉴) */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto ms-3">
            {/* 메뉴 링크들 */}
            <Nav.Link as={Link} to="/dashboard" className="fw-bold">홈</Nav.Link>
            <Nav.Link as={Link} to="/write">기록하기</Nav.Link>
            <Nav.Link as={Link} to="/stats">통계</Nav.Link>
            <Nav.Link as={Link} to="/friends">친구</Nav.Link>
          </Nav>
          
          {/* 우측 로그아웃 버튼 */}
          <Nav>
            <Button 
              variant="outline-danger" 
              size="sm" 
              className="rounded-pill px-3"
              onClick={handleLogout}
            >
              로그아웃
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default MyNavbar;