// src/pages/FollowPage.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { Container, Card, Button, ListGroup, Form, InputGroup } from 'react-bootstrap';

function FollowPage() {
  const [followingList, setFollowingList] = useState([]);
  const [targetId, setTargetId] = useState(''); // 친구 추가할 아이디 입력값
  const navigate = useNavigate();

  useEffect(() => {
    fetchFollowing();
  }, []);

  const fetchFollowing = async () => {
    try {
      // 4-3. 내 팔로잉 목록 조회
      const res = await api.get('/follows/me');
      setFollowingList(res.data.following);
    } catch (error) {
      console.error('팔로우 목록 로딩 실패');
      // 백엔드 미구현 시 테스트용 더미 데이터
      // setFollowingList([{ id: 99, nickname: "페이커", email: "faker@t1.gg" }]);
    }
  };

  // 친구 추가 (아이디로 추가)
  const handleFollow = async (e) => {
    e.preventDefault();
    if (!targetId) return;

    try {
      // 4-1. 팔로우 요청
      await api.post(`/follows/${targetId}`);
      alert('팔로우 성공!');
      setTargetId('');
      fetchFollowing(); // 목록 새로고침
    } catch (error) {
      alert('팔로우 실패 (존재하지 않는 ID이거나 이미 친구입니다)');
    }
  };

  // 친구 끊기 (언팔로우)
  const handleUnfollow = async (userId) => {
    if (!window.confirm('정말 팔로우를 취소하시겠습니까?')) return;

    try {
      // 4-2. 언팔로우 요청
      await api.delete(`/follows/${userId}`);
      // 목록에서 즉시 제거
      setFollowingList(followingList.filter(user => user.id !== userId));
    } catch (error) {
      alert('언팔로우 실패');
    }
  };

  return (
    <div style={{ background: '#f8f9fa', minHeight: '100vh', padding: '40px 0' }}>
      <Container style={{ maxWidth: '500px' }}>

        <Card className="shadow-sm border-0 rounded-4 p-3 mb-4">
          <Card.Body>
            <h4 className="fw-bold mb-3">🤝 친구 추가</h4>
            <Form onSubmit={handleFollow}>
              <InputGroup>
                <Form.Control
                  placeholder="추가할 친구의 ID 숫자 (예: 2)"
                  value={targetId}
                  onChange={(e) => setTargetId(e.target.value)}
                  type="number"
                  className="bg-light border-0"
                />
                <Button variant="primary" type="submit">팔로우</Button>
              </InputGroup>
              <Form.Text className="text-muted">
                * 현재는 ID(숫자)를 알아야 추가할 수 있습니다.
              </Form.Text>
            </Form>
          </Card.Body>
        </Card>

        <Card className="shadow-sm border-0 rounded-4 p-3">
          <Card.Body>
            <h4 className="fw-bold mb-3">내 팔로잉 목록 ({followingList.length}명)</h4>
            <ListGroup variant="flush">
              {followingList.length === 0 ? (
                <p className="text-center text-muted py-3">아직 팔로우한 친구가 없습니다.</p>
              ) : (
                followingList.map((friend) => (
                  <ListGroup.Item key={friend.id} className="d-flex justify-content-between align-items-center border-0 px-0">
                    <div className="d-flex align-items-center gap-2">
                      <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                        {friend.nickname[0]}
                      </div>
                      <div>
                        <div className="fw-bold">{friend.nickname}</div>
                        <div className="text-muted small">{friend.email}</div>
                      </div>
                    </div>
                    <Button 
                      variant="outline-danger" 
                      size="sm" 
                      className="rounded-pill"
                      onClick={() => handleUnfollow(friend.id)}
                    >
                      언팔로우
                    </Button>
                  </ListGroup.Item>
                ))
              )}
            </ListGroup>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

export default FollowPage;