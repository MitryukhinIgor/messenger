import { useState } from 'react';
import type { Credentials } from '../../types/greenApi';
import './LoginForm.css';

interface LoginFormProps {
  onLogin: (credentials: Credentials) => void;
}

function LoginForm({ onLogin }: LoginFormProps) {
  const [idInstance, setIdInstance] = useState('');
  const [apiTokenInstance, setApiTokenInstance] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!idInstance.trim() || !apiTokenInstance.trim()) {
      setError('Заполните оба поля');
      return;
    }

    setError('');
    onLogin({
      idInstance: idInstance.trim(),
      apiTokenInstance: apiTokenInstance.trim(),
    });
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h1>Telegram chat</h1>
        <p className="login-subtitle">Войдите с данными GREEN-API</p>

        <label>
          ID Instance
          <input
            type="text"
            value={idInstance}
            onChange={(e) => setIdInstance(e.target.value)}
            placeholder="введите idInstance"
            autoComplete="off"
          />
        </label>

        <label>
          API Token Instance
          <input
            type="text"
            value={apiTokenInstance}
            onChange={(e) => setApiTokenInstance(e.target.value)}
            placeholder="введите apiTokenInstance"
            autoComplete="off"
          />
        </label>

        {error && <div className="login-error">{error}</div>}

        <button type="submit">Войти</button>
      </form>
    </div>
  );
}

export default LoginForm;