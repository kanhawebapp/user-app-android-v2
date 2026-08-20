import {useState} from 'react';

import {getChatMessagesBySessionId} from './chat-messages.api';

import {ChatMessage} from './chat-messages.types';

export const useChatMessages = () => {
  const [data, setData] = useState<ChatMessage[]>([]);

  const [loading, setLoading] = useState(false);

  const [selectedSessionId, setSelectedSessionId] = useState<string>('');

  const fetchMessages = async (sessionId: string) => {
    try {
      setLoading(true);

      setSelectedSessionId(sessionId);

      const res = await getChatMessagesBySessionId(sessionId);
console.log('CHAT MESSAGES HOOK RESPONSE:>>>>', res);
      setData(res || []);
    } catch (error) {
      console.log('CHAT MESSAGES HOOK ERROR:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    data,

    loading,

    selectedSessionId,

    fetchMessages,
  };
};
