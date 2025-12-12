// src/components/CommentSection.js
import React, { useState, useEffect } from 'react';
import api from '../api';
import { Form, Button, ListGroup } from 'react-bootstrap';

// currentUser: 로그인한 내 정보 (삭제 권한 확인용)
function CommentSection({ sessionId, currentUser }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isOpen, setIsOpen] = useState(false);

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
      console.log('댓글 로딩 실패');
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
      setComments([...comments, res.data.comment]);
      setNewComment('');
    } catch (error) {
      alert('댓글 작성 실패');
    }
  };

  // 댓글 삭제 함수
  const handleDelete = async (commentId) => {
    if (!window.confirm('댓글을 삭제할까요?')) return;

    try {
      // 3-3. 댓글 삭제 API
      await api.delete(`/comments/${commentId}`);
      // 화면에서 바로 제거
      setComments(comments.filter((c) => c.id !== commentId));
    } catch (error) {
      alert('삭제 실패 (본인 댓글만 삭제 가능합니다)');
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
        <div className="mt-3 p-3 rounded-4" style={{ backgroundColor: '#f8f9fa' }}>
          <ListGroup variant="flush" className="mb-3 bg-transparent">
            {comments.length === 0 ? (
              <p className="text-muted small text-center">첫 댓글을 남겨주세요!</p>
            ) : (
              comments.map((c) => (
                <ListGroup.Item key={c.id} className="bg-transparent px-0 py-2 d-flex justify-content-between align-items-start">
                  <div>
                    <span className="fw-bold me-2" style={{ fontSize: '0.9rem' }}>
                      {c.nickname}
                    </span>
                    <span className="text-secondary">{c.content}</span>
                  </div>
                  
                  {/*내 댓글일 때만 삭제 버튼 표시*/}
                  {currentUser && currentUser.id === c.user_id && (
                    <Button 
                      variant="link" 
                      size="sm" 
                      className="text-danger p-0 text-decoration-none"
                      style={{ fontSize: '0.8rem' }}
                      onClick={() => handleDelete(c.id)}
                    >
                      삭제
                    </Button>
                  )}
                </ListGroup.Item>
              ))
            )}
          </ListGroup>

          <Form onSubmit={handleSubmit} className="d-flex gap-2">
            <Form.Control
              size="sm"
              placeholder="댓글을 입력하세요..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="rounded-pill border-0 shadow-sm"
            />
            <Button size="sm" variant="dark" type="submit" className="rounded-pill px-3">등록</Button>
          </Form>
        </div>
      )}
    </div>
  );
}

export default CommentSection;