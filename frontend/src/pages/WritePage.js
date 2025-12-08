// src/pages/WritePage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { Container, Form, Button, Card, FloatingLabel, Row, Col } from 'react-bootstrap';

function WritePage() {
  const [gameCode, setGameCode] = useState('lol');
  const [playDate, setPlayDate] = useState('');
  const [playTime, setPlayTime] = useState('');
  const [feeling, setFeeling] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/sessions', {
        game_code: gameCode,
        play_date: playDate,
        play_time_minutes: Number(playTime),
        feeling: feeling,
        screenshot_url: null
      });
      alert('기록 완료! 💾');
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      alert('저장 실패 ㅠㅠ');
    }
  };

  return (
    <div style={{ 
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', 
      minHeight: '100vh', 
      padding: '40px 0' // 상하 여백 추가
    }}>
      <Container style={{ maxWidth: '600px' }}>
        
        {/*홈으로 돌아가기 버튼*/}
        <div className="mb-4">
          <Button 
            variant="outline-secondary" 
            className="rounded-pill px-3 fw-bold border-0"
            onClick={() => navigate('/dashboard')}
            style={{ background: 'rgba(255,255,255,0.8)', color: '#495057', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}
          >
            ← 홈으로 돌아가기
          </Button>
        </div>

        <Card className="shadow-lg border-0 rounded-5 p-4" style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
          <Card.Body>
            <div className="text-center mb-4">
              <h2 className="fw-bold" style={{ color: '#333' }}>Game Log</h2>
              <p className="text-muted small">오늘의 플레이를 기록합니다</p>
            </div>
            
            <Form onSubmit={handleSubmit}>
              {/* 1. 게임 선택 */}
              <Form.Label className="fw-bold ms-1 text-secondary">어떤 게임을 하셨나요?</Form.Label>
              <Row className="g-3 mb-4">
                <Col xs={6}>
                  <div 
                    onClick={() => setGameCode('lol')}
                    className="p-3 rounded-4 text-center"
                    style={{ 
                      cursor: 'pointer',
                      border: gameCode === 'lol' ? '3px solid #3b82f6' : '2px solid #e9ecef',
                      background: gameCode === 'lol' ? '#eff6ff' : '#fff',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ fontSize: '2rem' }}>⚔️</div>
                    <div className="fw-bold mt-2" style={{ color: gameCode === 'lol' ? '#3b82f6' : '#6c757d' }}>League of Legends</div>
                  </div>
                </Col>
                <Col xs={6}>
                  <div 
                    onClick={() => setGameCode('valorant')}
                    className="p-3 rounded-4 text-center"
                    style={{ 
                      cursor: 'pointer',
                      border: gameCode === 'valorant' ? '3px solid #ef4444' : '2px solid #e9ecef',
                      background: gameCode === 'valorant' ? '#fef2f2' : '#fff',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ fontSize: '2rem' }}>🔫</div>
                    <div className="fw-bold mt-2" style={{ color: gameCode === 'valorant' ? '#ef4444' : '#6c757d' }}>Valorant</div>
                  </div>
                </Col>
              </Row>

              {/* 2. 날짜 & 시간 */}
              <Row className="mb-2">
                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label className="fw-bold ms-1 text-secondary">플레이 날짜</Form.Label>
                    <Form.Control 
                      type="date" 
                      value={playDate} 
                      onChange={(e) => setPlayDate(e.target.value)} 
                      required 
                      className="rounded-4 border-0 py-3 px-4"
                      style={{ backgroundColor: '#f1f3f5', fontSize: '1.1rem' }}
                    />
                  </Form.Group>
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label className="fw-bold ms-1 text-secondary">플레이 타임</Form.Label>
                    <div className="d-flex align-items-center rounded-4 px-3" style={{ backgroundColor: '#f1f3f5' }}>
                      <Form.Control 
                        type="number" 
                        placeholder="60" 
                        value={playTime} 
                        onChange={(e) => setPlayTime(e.target.value)} 
                        required 
                        className="border-0 bg-transparent py-3"
                        style={{ fontSize: '1.1rem', backgroundColor: 'transparent' }} 
                      />
                      <span className="text-muted fw-bold pe-2">분</span>
                    </div>
                  </Form.Group>
                </Col>
              </Row>

              {/* 3. 소감 */}
              <Form.Group className="mb-5">
                <Form.Label className="fw-bold ms-1 text-secondary">한줄 소감</Form.Label>
                <Form.Control 
                  as="textarea" 
                  rows={3}
                  placeholder="오늘 게임은 어땠나요?" 
                  value={feeling}
                  onChange={(e) => setFeeling(e.target.value)}
                  className="rounded-4 border-0 p-3"
                  style={{ backgroundColor: '#f1f3f5', resize: 'none' }} 
                />
              </Form.Group>

              {/* 저장 버튼 */}
              <Button 
                variant="dark" 
                type="submit" 
                className="w-100 rounded-pill py-3 fw-bold fs-5 shadow-sm"
                style={{ background: '#2d3436', border: 'none' }}
              >
                기록 남기기 ✨
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

export default WritePage;