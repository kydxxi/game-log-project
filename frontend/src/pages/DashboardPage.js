// src/pages/DashboardPage.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { Container, Card, Button, Badge, Row, Col } from 'react-bootstrap';
import CommentSection from '../components/CommentSection';

function DashboardPage() {
  const [sessions, setSessions] = useState([]);
  const [user, setUser] = useState(null); // 사용자 정보 담을 그릇
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  // 데이터 가져오기 (사용자 정보 + 게임 기록)
  const fetchData = async () => {
    try {
      // 1. 내 정보 조회 (닉네임 가져오기)
      const userRes = await api.get('/auth/me');
      if (!userRes.data.user) {
        // 로그인 안 된 상태면 튕겨내기
        navigate('/');
        return;
      }
      setUser(userRes.data.user);

      // 2. 내 기록 조회
      const sessionRes = await api.get('/sessions/me');
      setSessions(sessionRes.data.sessions);

    } catch (error) {
      console.error('데이터 로딩 실패', error);
      navigate('/');
    }
  };

  // 기록 삭제 함수
  const handleDelete = async (id) => {
    if (!window.confirm('정말로 이 기록을 삭제하시겠습니까?')) return;

    try {
      // 2-4. 기록 삭제 API 호출
      await api.delete(`/sessions/${id}`);
      
      // 삭제 성공 시, 화면에서도 바로 지워주기 (새로고침 없이)
      setSessions(sessions.filter(session => session.id !== id));
      alert('삭제되었습니다.');
    } catch (error) {
      console.error('삭제 실패', error);
      alert('삭제 중 오류가 발생했습니다.');
    }
  };
  
  const handleLogout = async () => {
    try {
      await api.post('/auth/logout'); //
      alert('로그아웃 되었습니다.');
      navigate('/');
    } catch (error) {
      navigate('/'); 
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ko-KR', options);
  };

  return (
    <div style={{ 
      background: 'linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%)', 
      minHeight: '100vh',
      padding: '40px 0'
    }}>
      <Container>
        {/* 헤더 영역 */}
        <div className="d-flex justify-content-between align-items-center mb-5 px-2">
          <div>
            <h2 className="fw-bold" style={{ color: '#4a4a4a' }}>
              {/* 닉네임 표시: 형광펜 효과 추가 */}
              <span style={{ 
                background: 'linear-gradient(to top, #ffd1d1 50%, transparent 50%)',
                padding: '0 5px'
              }}>
                {user ? user.nickname : '내'}
              </span> 
              님의 기록 🎮
            </h2>
            <p className="text-muted mb-0">오늘의 플레이를 기록해보세요!</p>
          </div>
          <div className="d-flex align-items-center gap-3">
            <Button onClick={() => navigate('/stats')} variant="outline-primary" className="rounded-pill px-3">
              📊 통계
            </Button>
            <Button 
                onClick={handleLogout} 
                variant="outline-secondary" 
                size="sm"
                className="rounded-pill px-3"
            >
                로그아웃
            </Button>
            
            <Button 
              onClick={() => navigate('/write')} 
              className="rounded-pill px-4 py-2 border-0"
              style={{ 
                background: 'linear-gradient(to right, #6a11cb 0%, #2575fc 100%)',
                fontWeight: 'bold',
                boxShadow: '0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08)'
              }}
            >
              + 새 기록 작성
            </Button>
          </div>
        </div>

        <Row>
          {sessions.length === 0 ? (
            <Col className="text-center py-5">
              <p className="text-muted fs-4">아직 작성된 기록이 없습니다.</p>
              <p className="text-muted">첫 번째 게임 기록을 남겨보세요!</p>
            </Col>
          ) : (
            sessions.map((session) => (
              <Col md={6} lg={4} className="mb-4" key={session.id}>
                <Card 
                  className="h-100 shadow-sm border-0 rounded-4 card-hover"
                  style={{ transition: 'transform 0.2s, box-shadow 0.2s', position: 'relative' }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 1rem 3rem rgba(0,0,0,.175)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '';
                  }}
                >
                  <Card.Body className="p-4">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <Badge 
                        bg={session.game_code === 'lol' ? 'primary' : 'danger'}
                        pill className="px-3 py-2"
                        style={{ fontSize: '0.9rem' }}
                      >
                        {session.game_code === 'lol' ? 'LoL' : 'Valorant'}
                      </Badge>
                      
                      {/* 삭제 버튼 추가 (우측 상단) */}
                      <div className="d-flex align-items-center gap-2">
                        <small className="text-muted fw-bold">
                          {formatDate(session.play_date)}
                        </small>
                        <button 
                          onClick={() => handleDelete(session.id)}
                          className="btn btn-link p-0 text-muted"
                          style={{ textDecoration: 'none', fontSize: '1.2rem', lineHeight: 1 }}
                          title="기록 삭제"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                    
                    <h4 className="fw-bold mb-3">{session.play_time_minutes}분 플레이</h4>
                    <Card.Text className="text-muted p-3 rounded-3" style={{ background: '#f8f9fa' }}>
                      "{session.feeling}"
                    </Card.Text>

                    {session.screenshot_url && (
                      <div className="mt-3 rounded-3 overflow-hidden shadow-sm">
                        <img src={session.screenshot_url} alt="screenshot" className="img-fluid" style={{ width: '100%', objectFit: 'cover', height: '150px' }} />
                      </div>
                    )}
                    <hr className="my-3" style={{ opacity: 0.1 }} />
                    <CommentSection sessionId={session.id} />
                  </Card.Body>
                </Card>
              </Col>
            ))
          )}
        </Row>
      </Container>
    </div>
  );
}

export default DashboardPage;