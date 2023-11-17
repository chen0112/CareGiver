import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { BASE_URL } from '../../types/Constant';

const IdentityVerificationForm: React.FC = () => {
  const [idCard, setIdCard] = useState<string>('');
  const [name, setName] = useState<string>('');
  const { phone } = useParams<{ phone: string }>();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await fetch(`${BASE_URL}/api/verify_identity`, {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ idCard: idCard, name: name, phone: phone })
      });
      const data = await response.json();
      // Handle response data
      console.log(data);
    } catch (error) {
      console.error('Error submitting identity verification:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        身份证号:
        <input
          type="text"
          value={idCard}
          onChange={(e) => setIdCard(e.target.value)}
        />
      </label>
      <label>
        名字:
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>
      <button type="submit">身份验证</button>
    </form>
  );
};

export default IdentityVerificationForm;
