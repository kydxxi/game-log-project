// src/pages/LoginPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { Container, Form, Button, Card, FloatingLabel } from 'react-bootstrap';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', {
        email: email,
        password: password,
      });
      if (response.status === 200) {
        alert('로그인 성공!');
        navigate('/dashboard');
      }
    } catch (error) {
      console.error(error);
      alert('아이디 또는 비밀번호를 확인해주세요.');
    }
  };

  return (
    // 배경: 은은한 파스텔 블루 그라데이션
    <div style={{ 
      background: 'linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)', 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center' 
    }}>
      <Container style={{ maxWidth: '450px' }}>
        {/* 그림자(shadow-lg), 테두리 없음(border-0), 둥근 모서리(rounded-4) */}
        <Card className="shadow-lg border-0 rounded-4 p-4">
          <Card.Body>
            {/* 로고 영역 (이모지로 대체) */}
            <div className="text-center mb-4">
              <span style={{ fontSize: '3rem' }}>🎮</span>
              <h2 className="fw-bold mt-2" style={{ color: '#4a4a4a' }}>Welcome!</h2>
              <p className="text-muted">게임 기록을 관리하러 오셨나요?</p>
            </div>

            <Form onSubmit={handleLogin}>
              {/* 플로팅 라벨 1: 아이디 */}
              <FloatingLabel controlId="floatingInput" label="아이디" className="mb-3">
                <Form.Control 
                  type="text" 
                  placeholder="name@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-3"
                  style={{ background: '#f8f9fa', border: 'none' }}
                />
              </FloatingLabel>

              {/* 플로팅 라벨 2: 비밀번호 */}
              <FloatingLabel controlId="floatingPassword" label="비밀번호" className="mb-4">
                <Form.Control 
                  type="password" 
                  placeholder="Password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="rounded-3"
                  style={{ background: '#f8f9fa', border: 'none' }}
                />
              </FloatingLabel>

              {/* 로그인 버튼: 그라데이션 적용 */}
              <div className="d-grid gap-2">
                <Button 
                  type="submit" 
                  size="lg" 
                  className="rounded-pill border-0"
                  style={{ 
                    background: 'linear-gradient(to right, #6a11cb 0%, #2575fc 100%)',
                    fontWeight: 'bold'
                  }}
                >
                  로그인
                </Button>
                
                <div className="text-center mt-3">
                  <span className="text-muted small">계정이 없으신가요? </span>
                  <span 
                    onClick={() => navigate('/signup')} 
                    style={{ cursor: 'pointer', color: '#2575fc', fontWeight: 'bold' }}
                  >
                    회원가입
                  </span>
                </div>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

export default LoginPage;