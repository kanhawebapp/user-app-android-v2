import type {ChatMessage} from '../types';

const MAX_REPLY_LENGTH = 50;

export const truncateText = (text: string, maxLength: number): string => {
  if (!text) {
    return '';
  }
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

export const formatMessageTime = (date: Date): string => {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return '--:--';
  }
  return date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
};

export const parseTime = (timeStr: string): Date => {
  if (!timeStr) {
    return new Date();
  }

  if (timeStr.includes('T')) {
    return new Date(timeStr);
  }

  const now = new Date();
  const [time, modifier] = timeStr.split(' ');

  if (!time || !modifier) {
    return new Date();
  }

  let [hours, minutes, seconds = 0] = time.split(':').map(Number);

  if (modifier === 'PM' && hours !== 12) {
    hours += 12;
  }
  if (modifier === 'AM' && hours === 12) {
    hours = 0;
  }

  const parsed = new Date(now);
  parsed.setHours(hours ?? 0);
  parsed.setMinutes(minutes ?? 0);
  parsed.setSeconds(seconds ?? 0);

  return parsed;
};

export const generateMessageId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs
    .toString()
    .padStart(2, '0')}`;
};

export const formatWaitTime = (minutes: number): string => {
  if (minutes < 1) {
    return 'Less than a minute';
  }
  if (minutes === 1) {
    return '1 minute';
  }
  return `${minutes} minutes`;
};
