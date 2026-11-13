import { useState, useEffect, useRef } from 'react';
import {
  sendMessage,
  receiveNotification,
  deleteNotification,
} from '../../api/greenApi';
import type { Credentials, ChatMessage } from '../../types/greenApi';
import './ChatWindow.css';

interface ChatWindowProps {
  credentials: Credentials;
  onLogout: () => void;
}

function ChatWindow({ credentials, onLogout }: ChatWindowProps) {
  const [phone, setPhone] = useState('');
  const [chatId, setChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  const chatIdRef = useRef<string | null>(null);

  useEffect(() => {
    chatIdRef.current = chatId;
  }, [chatId]);

  useEffect(() => {
    let isCancelled = false;

    const poll = async () => {
      while (!isCancelled) {
        try {
          const notification = await receiveNotification(credentials);

          if (!notification) {
            continue;
          }

          const { receiptId, body } = notification;

          if (
            body.typeWebhook === 'incomingMessageReceived' &&
            body.messageData?.typeMessage === 'textMessage'
          ) {
            const incomingChatId = body.senderData?.chatId;
            const text = body.messageData.textMessageData?.textMessage;
            console.log(incomingChatId)
            console.log(chatIdRef.current)
            if (incomingChatId === chatIdRef.current && text) {
              setMessages((prev) => [
                ...prev,
                {
                  id: body.idMessage,
                  text,
                  type: 'incoming',
                  timestamp: (body.timestamp || Date.now() / 1000) * 1000,
                },
              ]);
            }
          }

          await deleteNotification(credentials, receiptId);
        } catch (err) {
          console.error('Polling error:', err);
          await new Promise((resolve) => setTimeout(resolve, 3000));
        }
      }
    };

    poll();

    return () => {
      isCancelled = true;
    };
  }, [credentials]);

  const handleCreateChat = (e: React.FormEvent) => {
    e.preventDefault();

    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length < 10) {
      setError('Введите корректный номер телефона');
      return;
    }

    setError('');
    setChatId(`${cleaned}@c.us`);
    setMessages([]);
    setPhone('');
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!chatId || !input.trim()) return;

    const text = input.trim();
    setInput('');

    try {
      const response = await sendMessage(credentials, chatId, text);

      setMessages((prev) => [
        ...prev,
        {
          id: response.idMessage,
          text,
          type: 'outgoing',
          timestamp: Date.now(),
        },
      ]);
    } catch (err) {
      console.error(err);
      setError('Не удалось отправить сообщение');
    }
  };

  const handleBack = () => {
    setChatId(null);
    setMessages([]);
  };

  return (
    <div className="chat-container">
      <aside className="chat-sidebar">
        <div className="chat-sidebar-header">
          <span>Чаты</span>
          <button className="logout-btn" onClick={onLogout}>
            Выйти
          </button>
        </div>

        <form className="new-chat-form" onSubmit={handleCreateChat}>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Номер: 79991234567"
          />
          <button type="submit">+</button>
        </form>

        {chatId && (
          <div className="chat-list-item active">
            <div className="chat-list-avatar">💬</div>
            <div className="chat-list-info">
              <div className="chat-list-name">{chatId.split('@')[0]}</div>
              <div className="chat-list-last">
                {messages.length > 0
                  ? messages[messages.length - 1].text
                  : 'Нет сообщений'}
              </div>
            </div>
          </div>
        )}
      </aside>

      <main className="chat-main">
        {!chatId ? (
          <div className="chat-empty">
            <p>Введите номер телефона слева, чтобы начать чат</p>
          </div>
        ) : (
          <>
            <header className="chat-header">
              <button className="back-btn" onClick={handleBack}>
                ←
              </button>
              <div className="chat-header-info">
                <div className="chat-header-name">{chatId.split('@')[0]}</div>
                <div className="chat-header-status">в сети</div>
              </div>
            </header>

            <div className="chat-messages">
              {messages.length === 0 ? (
                <div className="chat-empty">
                  <p>Напишите первое сообщение</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`message message-${msg.type}`}
                  >
                    <div className="message-text">{msg.text}</div>
                    <div className="message-time">
                      {new Date(msg.timestamp).toLocaleTimeString('ru-RU', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>

            <form className="chat-input-form" onSubmit={handleSend}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Напишите сообщение..."
                autoFocus
              />
              <button type="submit">➤</button>
            </form>

            {error && <div className="chat-error">{error}</div>}
          </>
        )}
      </main>
    </div>
  );
}

export default ChatWindow;