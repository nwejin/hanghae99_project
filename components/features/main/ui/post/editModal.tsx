'use client';
import { useState } from 'react';

interface EditModalProps {
  postId: string;
  initialContents: string;
  onClose: () => void;
}

export default function EditModal({ postId, initialContents, onClose }: EditModalProps) {
  const [newContents, setNewContents] = useState(initialContents);

  const handleUpdatePost = async () => {
    try {
      const response = await fetch('/api/post', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, contents: newContents }),
      });

      if (response.ok) {
        alert('게시글이 수정되었습니다.');
        onClose();
      } else {
        alert('수정에 실패했습니다.');
      }
    } catch (error) {
      console.error('게시글 수정 에러:', error);
      alert('게시글 수정 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6">
        <h2 className="mb-4 text-xl font-semibold">게시글 수정</h2>
        <textarea
          className="w-full rounded-md border p-2"
          rows={4}
          value={newContents}
          onChange={(e) => setNewContents(e.target.value)}
        />
        <div className="mt-4 flex justify-end space-x-2">
          <button className="rounded bg-gray-300 px-4 py-2" onClick={onClose}>
            취소
          </button>
          <button className="rounded bg-primary px-4 py-2 text-white" onClick={handleUpdatePost}>
            수정하기
          </button>
        </div>
      </div>
    </div>
  );
}
