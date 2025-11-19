import {
  formatDate,
  formatRelativeTime,
  formatNumber,
  truncateText,
  capitalize,
  toTitleCase,
  getInitials,
  formatFileSize,
} from '../../utils/formatting';

describe('Formatting Utilities', () => {
  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = new Date('2024-01-15');
      const formatted = formatDate(date);
      expect(formatted).toContain('January');
      expect(formatted).toContain('15');
      expect(formatted).toContain('2024');
    });

    it('should handle invalid dates', () => {
      expect(formatDate('invalid')).toBe('Invalid date');
      expect(formatDate(null)).toBe('');
    });
  });

  describe('formatRelativeTime', () => {
    it('should show "just now" for recent times', () => {
      const now = new Date();
      expect(formatRelativeTime(now)).toBe('just now');
    });

    it('should show minutes ago', () => {
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      expect(formatRelativeTime(fiveMinutesAgo)).toBe('5 minutes ago');
    });

    it('should show hours ago', () => {
      const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
      expect(formatRelativeTime(twoHoursAgo)).toBe('2 hours ago');
    });

    it('should show days ago', () => {
      const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
      expect(formatRelativeTime(threeDaysAgo)).toBe('3 days ago');
    });

    it('should handle empty input', () => {
      expect(formatRelativeTime(null)).toBe('');
    });
  });

  describe('formatNumber', () => {
    it('should format numbers with commas', () => {
      expect(formatNumber(1000)).toBe('1,000');
      expect(formatNumber(1000000)).toBe('1,000,000');
      expect(formatNumber(123456.789)).toContain('123,456');
    });

    it('should handle zero', () => {
      expect(formatNumber(0)).toBe('0');
    });

    it('should handle non-numbers', () => {
      expect(formatNumber('text')).toBe('0');
    });
  });

  describe('truncateText', () => {
    it('should truncate long text', () => {
      const longText = 'a'.repeat(150);
      const truncated = truncateText(longText, 100);
      expect(truncated.length).toBe(103); // 100 + '...'
      expect(truncated.endsWith('...')).toBe(true);
    });

    it('should not truncate short text', () => {
      const shortText = 'short';
      expect(truncateText(shortText, 100)).toBe(shortText);
    });

    it('should handle empty input', () => {
      expect(truncateText(null)).toBe('');
    });
  });

  describe('capitalize', () => {
    it('should capitalize first letter', () => {
      expect(capitalize('hello')).toBe('Hello');
      expect(capitalize('WORLD')).toBe('World');
    });

    it('should handle empty string', () => {
      expect(capitalize('')).toBe('');
      expect(capitalize(null)).toBe('');
    });
  });

  describe('toTitleCase', () => {
    it('should convert to title case', () => {
      expect(toTitleCase('hello world')).toBe('Hello World');
      expect(toTitleCase('the quick brown fox')).toBe('The Quick Brown Fox');
    });

    it('should handle single word', () => {
      expect(toTitleCase('hello')).toBe('Hello');
    });

    it('should handle empty string', () => {
      expect(toTitleCase('')).toBe('');
    });
  });

  describe('getInitials', () => {
    it('should get initials from full name', () => {
      expect(getInitials('John Doe')).toBe('JD');
      expect(getInitials('Jane Mary Smith')).toBe('JS');
    });

    it('should handle single name', () => {
      expect(getInitials('John')).toBe('J');
    });

    it('should handle empty input', () => {
      expect(getInitials('')).toBe('');
      expect(getInitials(null)).toBe('');
    });
  });

  describe('formatFileSize', () => {
    it('should format bytes correctly', () => {
      expect(formatFileSize(0)).toBe('0 Bytes');
      expect(formatFileSize(1024)).toBe('1 KB');
      expect(formatFileSize(1048576)).toBe('1 MB');
      expect(formatFileSize(1073741824)).toBe('1 GB');
    });

    it('should handle decimal values', () => {
      const result = formatFileSize(1536); // 1.5 KB
      expect(result).toContain('1.5');
      expect(result).toContain('KB');
    });
  });
});
