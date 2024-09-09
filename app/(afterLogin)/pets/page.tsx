'use client';

import useTestStore from '@/store/testStore';
import { useState } from 'react';
import { ContentLayout } from '@/components/common/layouts/contentLayout';

export default function PetPage() {
  const { A, B, increseA, increseB, testText, setData } = useTestStore();
  const [isNum, setIsNum] = useState(0);
  const [text, setText] = useState('');
  return (
    <ContentLayout>
      <div>
        <div>
          <p>num :{A}</p>
          <button onClick={increseA}>1증가</button>
        </div>
        <div>
          <p>B: {B}</p>
          <input
            type="number"
            onChange={(e) => {
              setIsNum(Number(e.target.value));
            }}
          />
          <button onClick={() => increseB(isNum)}>증가</button>
        </div>
        <div>
          <p>Test Text: {testText}</p>
          <input
            type="text"
            onChange={(e) => {
              setText(e.target.value);
            }}
          />
          <button onClick={() => setData(text)}>텍스트</button>
        </div>
      </div>
    </ContentLayout>
  );
}
