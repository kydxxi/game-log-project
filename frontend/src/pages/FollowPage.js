// src/pages/FollowPage.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { Container, Card, Button, ListGroup, Form, InputGroup, Tab, Tabs, Badge } from 'react-bootstrap';

function FollowPage() {
  const [followingList, setFollowingList] = useState([]);
  const [followerList, setFollowerList] = useState([]); // 팔로워 목록 추가
  const [targetId, setTargetId] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // 4-3. 내 팔로잉 목록 조회
      const followingRes = await api.get('/follows/me');
      setFollowingList(followingRes.data.following);

      // 4-4. 내 팔로워 목록 조회 (신규 기능!)
      const followerRes = await api.get('/follows/followers/me');
      setFollowerList(followerRes.data.followers);
    } catch (error) {
      console.error('데이터 로딩 실패', error);
    }
  };

  const handleFollow = async (e) => {
    e.preventDefault();
    if (!targetId) return;
    try {
      await api.post(`/follows/${targetId}`); //
      alert('팔로우 성공!');
      setTargetId('');
      fetchData(); // 목록 새로고침
    } catch (error) {
      alert('팔로우 실패 (존재하지 않는 ID거나 이미 친구)');
    }
  };

  const handleUnfollow = async (userId) => {
    if (!window.confirm('팔로우를 취소하시겠습니까?')) return;
    try {
      await api.delete(`/follows/${userId}`); //
      setFollowingList(followingList.filter(user => user.id !== userId));
    } catch (error) {
      alert('언팔로우 실패');
    }
  };

  return (
    <div style={{ background: '#f8f9fa', minHeight: '100vh', padding: '40px 0' }}>
      <Container style={{ maxWidth: '600px' }}>
        {/* 친구 추가 카드 */}
        <Card className="shadow-sm border-0 rounded-4 p-3 mb-4">
          <Card.Body>
            <h5 className="fw-bold mb-3">🤝 친구 찾기</h5>
            <Form onSubmit={handleFollow}>
              <InputGroup>
                <Form.Control
                  placeholder="친구의 ID 숫자 입력 (예: 2)"
                  value={targetId}
                  onChange={(e) => setTargetId(e.target.value)}
                  type="number"
                  className="bg-light border-0"
                />
                <Button variant="primary" type="submit">팔로우</Button>
              </InputGroup>
            </Form>
          </Card.Body>
        </Card>

        {/* 탭 메뉴 (팔로잉, 팔로워) */}
        <Card className="shadow-sm border-0 rounded-4 p-3">
          <Tabs defaultActiveKey="following" id="follow-tabs" className="mb-3" fill>
            
            {/* 탭 1: 팔로잉 목록 */}
            <Tab eventKey="following" title={`팔로잉 ${followingList.length}`}>
              <ListGroup variant="flush">
                {followingList.length === 0 ? <p className="text-center text-muted py-3">팔로우한 친구가 없습니다.</p> : 
                  followingList.map((friend) => (
                    <ListGroup.Item key={friend.id} className="d-flex justify-content-between align-items-center border-0 px-0">
                      <div className="d-flex align-items-center gap-2">
                        <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                          {friend.nickname[0]}
                        </div>
                        <div>
                          <div className="fw-bold">{friend.nickname}</div>
                          <div className="text-muted small">ID: #{friend.id}</div>
                        </div>
                      </div>
                      <Button variant="outline-danger" size="sm" className="rounded-pill" onClick={() => handleUnfollow(friend.id)}>
                        언팔로우
                      </Button>
                    </ListGroup.Item>
                  ))
                }
              </ListGroup>
            </Tab>

            {/* 탭 2: 팔로워 목록 */}
            <Tab eventKey="followers" title={`팔로워 ${followerList.length}`}>
               <ListGroup variant="flush">
                {followerList.length === 0 ? <p className="text-center text-muted py-3">아직 나를 팔로우한 사람이 없습니다.</p> : 
                  followerList.map((fan) => (
                    <ListGroup.Item key={fan.id} className="d-flex align-items-center border-0 px-0">
                      <div className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                        {fan.nickname[0]}
                      </div>
                      <div className="ms-2">
                        <div className="fw-bold">
                          {fan.nickname} 
                          <Badge bg="info" className="ms-2">나를 팔로우함</Badge>
                        </div>
                        <div className="text-muted small">ID: #{fan.id}</div>
                      </div>
                    </ListGroup.Item>
                  ))
                }
              </ListGroup>
            </Tab>

          </Tabs>
        </Card>
      </Container>
    </div>
  );
}

export default FollowPage;