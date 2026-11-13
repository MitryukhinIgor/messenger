import { useState } from 'react';
import LoginForm from './components/LoginForm/LoginForm';
import ChatWindow from './components/ChatWindow/ChatWindow';
import type { Credentials } from './types/greenApi';

function App() {
  const [credentials, setCredentials] = useState<Credentials | null>(null);

  if (!credentials) {
    return <LoginForm onLogin={setCredentials} />;
  }

  return (
    <ChatWindow
      credentials={credentials}
      onLogout={() => setCredentials(null)}
    />
  );
}

export default App;