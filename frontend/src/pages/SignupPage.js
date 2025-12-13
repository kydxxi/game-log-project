// src/pages/SignupPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { Container, Form, Button, Card, FloatingLabel } from 'react-bootstrap';

function SignupPage() {
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPw, setConfirmPw] = useState(''); // 비밀번호 확인용 (백엔드엔 안 보냄)
  
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    // 1. 프론트엔드 유효성 검사: 비밀번호가 서로 같은지 확인
    if (password !== confirmPw) {
      alert('비밀번호가 일치하지 않습니다! 다시 확인해주세요.');
      return;
    }

    try {
      // 2. 백엔드에 전송 (백엔드가 원하는 키 이름: email, nickname, password)
      const response = await api.post('/auth/signup', {
        email: email,
        nickname: nickname,
        password: password,
      });

      // 3. 성공 시 (201 Created)
      if (response.status === 201 || response.status === 200) {
        alert('회원가입 성공! 환영합니다 🎉\n로그인 페이지로 이동합니다.');
        navigate('/'); // 로그인 화면으로 이동
      }
    } catch (error) {
      console.error(error);
      // 백엔드에서 400 에러(이미 존재하는 이메일 등)를 보낼 때 처리
      if (error.response && error.response.data && error.response.data.message) {
         alert(`회원가입 실패: ${error.response.data.message}`);
      } else {
         alert('회원가입 중 오류가 발생했습니다.');
      }
    }
  };

  return (
    // 배경: 로그인 페이지와 동일한 그라데이션으로 통일감 주기
    <div style={{ 
      background: 'linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)', 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '20px' // 모바일에서 너무 꽉 차지 않게 여백
    }}>
      <Container style={{ maxWidth: '500px' }}>
        <Card className="shadow-lg border-0 rounded-4 p-4">
          <Card.Body>
            {/* 헤더 영역 */}
            <div className="text-center mb-4">
              <span style={{ fontSize: '3rem' }}>📝</span>
              <h2 className="fw-bold mt-2" style={{ color: '#4a4a4a' }}>Join Us!</h2>
            </div>

            <Form onSubmit={handleSignup}>
              {/* 1. 이메일 입력 */}
              <FloatingLabel controlId="floatingEmail" label="이메일 (아이디로 사용됩니다.)" className="mb-3">
                <Form.Control 
                  type="email" 
                  placeholder="name@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-3"
                  style={{ background: '#f8f9fa', border: 'none' }}
                  required
                />
              </FloatingLabel>

              {/* 2. 닉네임 입력 */}
              <FloatingLabel controlId="floatingNick" label="닉네임" className="mb-3">
                <Form.Control 
                  type="text" 
                  placeholder="Nickname" 
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="rounded-3"
                  style={{ background: '#f8f9fa', border: 'none' }}
                  required
                />
              </FloatingLabel>

              {/* 3. 비밀번호 입력 */}
              <FloatingLabel controlId="floatingPassword" label="비밀번호" className="mb-3">
                <Form.Control 
                  type="password" 
                  placeholder="Password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="rounded-3"
                  style={{ background: '#f8f9fa', border: 'none' }}
                  required
                />
              </FloatingLabel>

              {/* 4. 비밀번호 확인 */}
              <FloatingLabel controlId="floatingConfirm" label="비밀번호 확인" className="mb-4">
                <Form.Control 
                  type="password" 
                  placeholder="Confirm Password" 
                  value={confirmPw}
                  onChange={(e) => setConfirmPw(e.target.value)}
                  className="rounded-3"
                  // 비밀번호가 다르면 배경색을 살짝 붉게 표시하는 디테일
                  style={{ 
                    background: (confirmPw && password !== confirmPw) ? '#ffeef0' : '#f8f9fa', 
                    border: 'none' 
                  }}
                  required
                />
              </FloatingLabel>

              {/* 가입 버튼 */}
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
                  가입완료
                </Button>
                
                <div className="text-center mt-3">
                  <span className="text-muted small">이미 계정이 있으신가요? </span>
                  <span 
                    onClick={() => navigate('/')} 
                    style={{ cursor: 'pointer', color: '#2575fc', fontWeight: 'bold' }}
                  >
                    로그인하러 가기
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

export default SignupPage;