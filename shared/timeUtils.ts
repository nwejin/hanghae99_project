export function timeCheck(dateData: string | { seconds: number; nanoseconds: number }) {
  let date: Date;

  if (typeof dateData === 'string') {
    date = new Date(dateData);
  } else if (dateData.seconds !== undefined && dateData.nanoseconds !== undefined) {
    date = new Date(dateData.seconds * 1000 + dateData.nanoseconds / 1000000);
  } else {
    throw new Error('Invalid date data format');
  }

  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const interval = Math.floor(seconds / 31536000);
  if (interval > 1) return `${interval}년 전`;

  const months = Math.floor(seconds / 2592000);
  if (months > 1) return `${months}개월 전`;

  const weeks = Math.floor(seconds / 604800);
  if (weeks > 1) return `${weeks}주 전`;

  const days = Math.floor(seconds / 86400);
  if (days > 1) return `${days}일 전`;

  const hours = Math.floor(seconds / 3600);
  if (hours > 1) return `${hours}시간 전`;

  const minutes = Math.floor(seconds / 60);
  if (minutes > 1) return `${minutes}분 전`;

  return '방금 전';
}
