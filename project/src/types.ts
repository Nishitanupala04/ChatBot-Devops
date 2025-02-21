export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export interface KnowledgeBaseEntry {
  question: string;
  answer: string;
}