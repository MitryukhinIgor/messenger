import axios from 'axios';
import type {
  Credentials,
  SendMessageRequest,
  SendMessageResponse,
  ReceiveNotificationResponse,
} from '../types/greenApi';

const BASE_URL = 'https://api.green-api.com';

function buildUrl(credentials: Credentials, method: string): string {
  const { idInstance, apiTokenInstance } = credentials;
  return `${BASE_URL}/waInstance${idInstance}/${method}/${apiTokenInstance}`;
}

export async function sendMessage(
  credentials: Credentials,
  chatId: string,
  message: string
): Promise<SendMessageResponse> {
  const url = buildUrl(credentials, 'sendMessage');

  const body: SendMessageRequest = {
    chatId,
    message,
  };

  const response = await axios.post<SendMessageResponse>(url, body);
  return response.data;
}

export async function receiveNotification(
  credentials: Credentials
): Promise<ReceiveNotificationResponse | null> {
  const url = buildUrl(credentials, 'receiveNotification');

  const response = await axios.get<ReceiveNotificationResponse | null>(url);
  return response.data;
}

export async function deleteNotification(
  credentials: Credentials,
  receiptId: number
): Promise<void> {
  const { idInstance, apiTokenInstance } = credentials;
  const url = `${BASE_URL}/waInstance${idInstance}/deleteNotification/${apiTokenInstance}/${receiptId}`;

  await axios.delete(url);
}