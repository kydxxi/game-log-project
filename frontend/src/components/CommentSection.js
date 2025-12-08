// src/components/CommentSection.js
import React, { useState, useEffect } from 'react';
import api from '../api';
import { Form, Button, ListGroup } from 'react-bootstrap';

function CommentSection({ sessionId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isOpen, setIsOpen] = useState(false); // 댓글창 열기/닫기 상태

  // 댓글창을 열 때 데이터를 가져옵니다 (API 절약)
  useEffect(() => {
    if (isOpen) {
      fetchComments();
    }
  }, [isOpen]);

  const fetchComments = async () => {
    try {
      // 3-2. 댓글 조회 API
      const res = await api.get(`/comments?session_id=${sessionId}`);
      setComments(res.data.comments);
    } catch (error) {
      // 백엔드 미구현 시 조용히 넘어감 (또는 테스트 데이터)
      console.log('댓글 API 아직 미구현');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      // 3-1. 댓글 작성 API
      const res = await api.post('/comments', {
        session_id: sessionId,
        content: newComment
      });
      
      // 성공하면 리스트에 바로 추가 (새로고침 없이)
      setComments([...comments, res.data.comment]);
      setNewComment('');
    } catch (error) {
      alert('댓글 작성 실패 ');
    }
  };

  return (
    <div className="mt-3">
      <Button 
        variant="link" 
        className="text-decoration-none p-0 text-muted"
        onClick={() => setIsOpen(!isOpen)}
      >
        💬 댓글 {isOpen ? '접기' : '달기'}
      </Button>

      {isOpen && (
        <div className="mt-3 p-3 bg-light rounded-3">
          {/* 댓글 목록 */}
          <ListGroup variant="flush" className="mb-3 bg-transparent">
            {comments.length === 0 ? (
              <p className="text-muted small text-center">첫 댓글을 남겨주세요!</p>
            ) : (
              comments.map((c) => (
                <ListGroup.Item key={c.id} className="bg-transparent px-0 py-2">
                  <small className="fw-bold me-2">User {c.user_id}</small>
                  <span className="text-secondary">{c.content}</span>
                </ListGroup.Item>
              ))
            )}
          </ListGroup>

          {/* 댓글 입력폼 */}
          <Form onSubmit={handleSubmit} className="d-flex gap-2">
            <Form.Control
              size="sm"
              placeholder="댓글을 입력하세요..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <Button size="sm" variant="dark" type="submit">등록</Button>
          </Form>
        </div>
      )}
    </div>
  );
}

export default CommentSection;