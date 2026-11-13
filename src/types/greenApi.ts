export interface Credentials {
    idInstance: string;
    apiTokenInstance: string;
  }

  export interface SendMessageRequest {
    chatId: string;   // формат: "79991234567@c.us"
    message: string; 
  }
  
  export interface SendMessageResponse {
    idMessage: string; // уникальный ID отправленного сообщения
  }

  export interface ReceiveNotificationResponse {
    receiptId: number;         // ID уведомления, нужен для удаления
    body: NotificationBody;
  }
  
  export interface NotificationBody {
    typeWebhook: string;       // тип события
    timestamp: number;         // время события 
    idMessage: string;         // ID сообщения
    senderData?: SenderData;
    messageData?: MessageData;
  }
  
  export interface SenderData {
    chatId: string;            // ID чата отправителя
    sender: string;            // номер отправителя
    senderName?: string;
  }
  
  export interface MessageData {
    typeMessage: string;       // "textMessage", "imageMessage" и т.д.
    textMessageData?: TextMessageData;
  }
  
  export interface TextMessageData {
    textMessage: string;       // сам текст сообщения
  }

  // Внутренний тип для хранения сообщений в чате

  export interface ChatMessage {
    id: string;               
    text: string;      
    type: 'incoming' | 'outgoing';
    timestamp: number;   
  }