import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { Container, Card, Button, Badge, Row, Col } from 'react-bootstrap';
import CommentSection from '../components/CommentSection';

function DashboardPage() {
  const [sessions, setSessions] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // 1. 내 정보 조회
      const userRes = await api.get('/auth/me');
      if (!userRes.data.user) {
        navigate('/');
        return;
      }
      setUser(userRes.data.user);

      // 2. 피드(친구들 기록 포함) 조회
      const sessionRes = await api.get('/sessions/feed');
      setSessions(sessionRes.data.sessions);

    } catch (error) {
      console.error('데이터 로딩 실패', error);
      navigate('/');
    }
  };

  const handleDelete = async (id) => {
    //안전장치 1: 삭제하려는 기록 찾기
    const targetSession = sessions.find(s => s.id === id);
    
    //안전장치 2: 본인 글인지 확인 (혹시 버튼이 잘못 떠서 눌렀을 경우 방지)
    // 숫자/문자 형식이 다를 수 있으니 String()으로 변환해서 비교
    if (!targetSession || String(targetSession.user_id) !== String(user.id)) {
      alert('본인의 글만 삭제할 수 있습니다!');
      return;
    }

    if (!window.confirm('정말로 이 기록을 삭제하시겠습니까?')) return;

    try {
      await api.delete(`/sessions/${id}`);
      setSessions(sessions.filter(session => session.id !== id));
      alert('삭제되었습니다.');
    } catch (error) {
      console.error('삭제 실패', error);
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ko-KR', options);
  };

  return (
    <div style={{ background: 'linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%)', minHeight: '100vh', padding: '40px 0' }}>
      <Container>
        {/* 헤더 영역 */}
        <div className="d-flex justify-content-between align-items-center mb-5 px-2">
          <div>
            <h2 className="fw-bold" style={{ color: '#4a4a4a' }}>
              <span style={{ background: 'linear-gradient(to top, #ffd1d1 50%, transparent 50%)', padding: '0 5px'}}>
                {user ? user.nickname : '내'}
              </span> 
              님의 피드 🎮
            </h2>
            <p className="text-muted mb-0">
              My ID: <span className="fw-bold text-primary">#{user ? user.id : '?'}</span>
            </p>
          </div>
           <Button 
              onClick={() => navigate('/write')} 
              className="rounded-pill px-4 py-2 border-0"
              style={{ background: 'linear-gradient(to right, #6a11cb 0%, #2575fc 100%)', fontWeight: 'bold'}}
            >
              + 새 기록 작성
            </Button>
        </div>

        <Row>
          {sessions.length === 0 ? (
            <Col className="text-center py-5">
              <p className="text-muted fs-4">아직 피드에 글이 없습니다.</p>
              <p className="text-muted">친구를 팔로우하고 소식을 받아보세요!</p>
            </Col>
          ) : (
            sessions.map((session) => {
              //안전장치 3: 렌더링 시점에서 '내 글'인지 판단 (String으로 안전 비교)
              const isOwner = user && String(user.id) === String(session.user_id);

              return (
                <Col md={6} lg={4} className="mb-4" key={session.id}>
                  <Card className="h-100 shadow-sm border-0 rounded-4 card-hover">
                    <Card.Body className="p-4">
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <Badge bg={session.game_code === 'lol' ? 'primary' : 'danger'} pill className="px-3 py-2">
                          {session.game_code === 'lol' ? 'LoL' : 'Valorant'}
                        </Badge>
                        
                        <div className="d-flex align-items-center gap-2">
                          <small className="text-muted fw-bold">{formatDate(session.play_date)}</small>
                          
                          {/* ★ 수정됨: isOwner가 true일 때만 휴지통 아이콘 표시 ★ */}
                          {isOwner && (
                            <button 
                              onClick={() => handleDelete(session.id)} 
                              className="btn btn-link p-0 text-muted" 
                              title="기록 삭제"
                            >
                              🗑️
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="mb-2 d-flex align-items-center">
                         <div className="rounded-circle bg-light text-dark d-flex align-items-center justify-content-center fw-bold me-2" style={{width: '30px', height: '30px', fontSize: '0.8rem'}}>
                            {session.nickname ? session.nickname[0] : '?'}
                         </div>
                         <span className="fw-bold text-dark">{session.nickname}</span>
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
                      <CommentSection sessionId={session.id} currentUser={user} />
                    </Card.Body>
                  </Card>
                </Col>
              );
            })
          )}
        </Row>
      </Container>
    </div>
  );
}

export default DashboardPage;