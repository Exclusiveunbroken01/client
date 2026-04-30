export const truncateText = (text: string, maxLength: number): string => {
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
};

export const formatNGN = (
  amount?: number | string | null
) => {
  const safe = Number(amount ?? 0);
  return `₦${safe.toLocaleString('en-NG')}`;
};

export const parseTime = (timeStr: string): string => timeStr.slice(11, 16);
export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h${mins > 0 ? ` ${mins}m` : ''}`;
};
export const getStopLabel = (stops: number): string => {
  if (stops === 0) return 'Non-stop';
  if (stops === 1) return '1 stop';
  return `${stops}+ stops`;
};
export const getStopValue = (stops: number): number => Math.min(stops, 2);

export const formatDateDDMMYY = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);

  return `${day}${month}${year}`;
};
