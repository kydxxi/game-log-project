// src/pages/StatsPage.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 페이지 이동 훅 추가
import api from '../api';
import { Container, Card, ProgressBar, Row, Col, Button } from 'react-bootstrap';

function StatsPage() {
  const [stats, setStats] = useState(null);
  const navigate = useNavigate(); // 이동 함수 사용

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // 5-1. 통계 조회 API 호출
      const response = await api.get('/stats/me?range=monthly');
      setStats(response.data.stats);
    } catch (error) {
      console.warn("API 미구현 상태: 테스트용 가짜 데이터를 보여줍니다.");
      // 백엔드 구현 전까지 보여줄 임시 데이터
      setStats({
        total_minutes: 560,
        by_game: { lol: 300, "valorant": 260 },
        daily: [
          { date: "2025-12-01", minutes: 120 },
          { date: "2025-12-02", minutes: 90 },
          { date: "2025-12-03", minutes: 180 },
          { date: "2025-12-04", minutes: 60 },
        ]
      });
    }
  };

  if (!stats) return <div className="text-center p-5">로딩중...</div>;

  const total = stats.total_minutes;
  const lolPercent = Math.round((stats.by_game.lol / total) * 100) || 0;
  const valPercent = Math.round((stats.by_game.valorant / total) * 100) || 0;

  return (
    <div style={{ background: '#f8f9fa', minHeight: '100vh', padding: '40px 0' }}>
      <Container>

        <h2 className="fw-bold mb-4">📊 이번 달 플레이 분석</h2>
        
        {/* 1. 총 플레이 시간 카드 */}
        <Card className="shadow-sm border-0 rounded-4 mb-4 p-4 text-center">
          <Card.Body>
            <h5 className="text-muted">총 플레이 시간</h5>
            <h1 className="fw-bold display-4 my-3" style={{ color: '#2d3436' }}>
              {Math.floor(stats.total_minutes / 60)}시간 {stats.total_minutes % 60}분
            </h1>
          </Card.Body>
        </Card>

        {/* 2. 게임별 비율 (ProgressBar) */}
        <Card className="shadow-sm border-0 rounded-4 mb-4 p-4">
          <Card.Body>
            <h5 className="fw-bold mb-3">게임 선호도</h5>
            <ProgressBar style={{ height: '30px', borderRadius: '15px' }}>
              <ProgressBar striped variant="primary" now={lolPercent} label={`LoL ${lolPercent}%`} key={1} />
              <ProgressBar striped variant="danger" now={valPercent} label={`Valorant ${valPercent}%`} key={2} />
            </ProgressBar>
            <div className="d-flex justify-content-between mt-2 text-muted small">
              <span>리그 오브 레전드 ({stats.by_game.lol}분)</span>
              <span>발로란트 ({stats.by_game.valorant}분)</span>
            </div>
          </Card.Body>
        </Card>

        {/* 3. 일별 기록 (리스트) */}
        <Card className="shadow-sm border-0 rounded-4 p-4">
          <Card.Body>
            <h5 className="fw-bold mb-3">일별 플레이 로그</h5>
            <Row>
              {stats.daily.map((day, index) => (
                <Col xs={6} md={3} key={index} className="mb-3">
                  <div className="p-3 rounded-3 text-center" style={{ background: '#e9ecef' }}>
                    <div className="fw-bold">{day.date.split('T')[0]}</div>
                    <div className="text-primary">{day.minutes}분</div>
                  </div>
                </Col>
              ))}
            </Row>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

export default StatsPage;