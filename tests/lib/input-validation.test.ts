/**
 * Unit tests for Input Validation and Sanitization
 */

import { describe, it, expect } from 'vitest';
import validator from 'validator';

describe('Input Validation', () => {
  describe('Address Validation', () => {
    it('should sanitize address inputs', () => {
      const dirtyAddress = '<script>alert("xss")</script>123 Main St';
      const sanitized = validator.escape(validator.trim(dirtyAddress));
      
      expect(sanitized).not.toContain('<script>');
      expect(sanitized).not.toContain('alert');
    });

    it('should trim whitespace from addresses', () => {
      const address = '  123 Main St  ';
      const trimmed = validator.trim(address);
      
      expect(trimmed).toBe('123 Main St');
      expect(trimmed).not.toMatch(/^\s|\s$/);
    });

    it('should handle empty addresses', () => {
      const empty = '';
      const trimmed = validator.trim(empty);
      
      expect(trimmed).toBe('');
    });

    it('should escape HTML special characters', () => {
      const address = '123 Main St <tag> & "quotes"';
      const escaped = validator.escape(address);
      
      expect(escaped).toContain('&lt;');
      expect(escaped).toContain('&gt;');
      expect(escaped).toContain('&amp;');
      expect(escaped).toContain('&quot;');
    });
  });

  describe('Email Validation', () => {
    it('should validate correct email format', () => {
      expect(validator.isEmail('test@example.com')).toBe(true);
      expect(validator.isEmail('user.name+tag@example.co.uk')).toBe(true);
    });

    it('should reject invalid emails', () => {
      expect(validator.isEmail('invalid')).toBe(false);
      expect(validator.isEmail('invalid@')).toBe(false);
      expect(validator.isEmail('@invalid.com')).toBe(false);
      expect(validator.isEmail('invalid@.com')).toBe(false);
    });

    it('should handle edge case emails', () => {
      expect(validator.isEmail('')).toBe(false);
      expect(validator.isEmail('a@b')).toBe(false);
      expect(validator.isEmail('test @example.com')).toBe(false);
    });

    it('should normalize emails', () => {
      const email = '  TEST@EXAMPLE.COM  ';
      const normalized = validator.normalizeEmail(email);
      
      expect(normalized).toBe('test@example.com');
    });
  });

  describe('Coordinate Validation', () => {
    it('should validate Delaware latitude range', () => {
      // Delaware latitude: ~38.45 to 39.84
      const validLat = 39.158168; // Wilmington
      const invalidLat = 45.0; // Too far north
      
      expect(validator.isFloat(String(validLat), { min: 38.4, max: 39.9 })).toBe(true);
      expect(validator.isFloat(String(invalidLat), { min: 38.4, max: 39.9 })).toBe(false);
    });

    it('should validate Delaware longitude range', () => {
      // Delaware longitude: ~-75.79 to -74.98
      const validLon = -75.52767; // Wilmington
      const invalidLon = -80.0; // Too far west
      
      expect(validator.isFloat(String(validLon), { min: -76.0, max: -74.9 })).toBe(true);
      expect(validator.isFloat(String(invalidLon), { min: -76.0, max: -74.9 })).toBe(false);
    });

    it('should handle coordinate edge cases', () => {
      expect(validator.isFloat('NaN')).toBe(false);
      expect(validator.isFloat('Infinity')).toBe(false);
      expect(validator.isFloat('abc')).toBe(false);
    });
  });

  describe('Phone Number Validation', () => {
    it('should validate US phone numbers', () => {
      expect(validator.isMobilePhone('3025551234', 'en-US')).toBe(true);
      expect(validator.isMobilePhone('(302) 555-1234', 'en-US')).toBe(true);
    });

    it('should reject invalid phone numbers', () => {
      expect(validator.isMobilePhone('123', 'en-US')).toBe(false);
      expect(validator.isMobilePhone('abc', 'en-US')).toBe(false);
    });
  });

  describe('SQL Injection Prevention', () => {
    it('should escape SQL special characters', () => {
      const malicious = "'; DROP TABLE users; --";
      const escaped = validator.escape(malicious);
      
      expect(escaped).not.toContain("'");
      expect(escaped).not.toContain(';');
      expect(escaped).toContain('&#x27;'); // Escaped single quote
    });

    it('should handle common SQL injection patterns', () => {
      const patterns = [
        "1' OR '1'='1",
        "admin'--",
        "' UNION SELECT * FROM users--",
        "1; DROP TABLE users;--",
      ];
      
      patterns.forEach(pattern => {
        const escaped = validator.escape(pattern);
        expect(escaped).not.toContain("'");
        expect(escaped).not.toContain(';');
      });
    });
  });

  describe('XSS Prevention', () => {
    it('should escape XSS script tags', () => {
      const xss = '<script>alert("XSS")</script>';
      const escaped = validator.escape(xss);
      
      expect(escaped).not.toContain('<script>');
      expect(escaped).toContain('&lt;script&gt;');
    });

    it('should escape event handlers', () => {
      const xss = '<img src=x onerror=alert("XSS")>';
      const escaped = validator.escape(xss);
      
      expect(escaped).not.toContain('<img');
      expect(escaped).not.toContain('onerror');
    });

    it('should handle javascript: protocol', () => {
      const xss = 'javascript:alert("XSS")';
      const escaped = validator.escape(xss);
      
      // Escaped version is safe
      expect(escaped).toContain('javascript');
      expect(escaped).not.toContain('<');
    });
  });

  describe('URL Validation', () => {
    it('should validate HTTP(S) URLs', () => {
      expect(validator.isURL('https://example.com')).toBe(true);
      expect(validator.isURL('http://example.com')).toBe(true);
    });

    it('should reject invalid URLs', () => {
      expect(validator.isURL('javascript:alert(1)')).toBe(false);
      expect(validator.isURL('not a url')).toBe(false);
      expect(validator.isURL('//invalid')).toBe(false);
    });

    it('should validate with protocol restriction', () => {
      expect(validator.isURL('https://example.com', {
        protocols: ['https'],
        require_protocol: true,
      })).toBe(true);
      
      expect(validator.isURL('http://example.com', {
        protocols: ['https'],
        require_protocol: true,
      })).toBe(false);
    });
  });

  describe('Numeric Input Validation', () => {
    it('should validate integers', () => {
      expect(validator.isInt('123')).toBe(true);
      expect(validator.isInt('-456')).toBe(true);
      expect(validator.isInt('0')).toBe(true);
    });

    it('should reject non-integers', () => {
      expect(validator.isInt('123.45')).toBe(false);
      expect(validator.isInt('abc')).toBe(false);
      expect(validator.isInt('12.0')).toBe(false);
    });

    it('should validate floats', () => {
      expect(validator.isFloat('123.45')).toBe(true);
      expect(validator.isFloat('-67.89')).toBe(true);
    });

    it('should validate number ranges', () => {
      expect(validator.isInt('50', { min: 1, max: 100 })).toBe(true);
      expect(validator.isInt('0', { min: 1, max: 100 })).toBe(false);
      expect(validator.isInt('101', { min: 1, max: 100 })).toBe(false);
    });
  });

  describe('String Length Validation', () => {
    it('should validate string length', () => {
      expect(validator.isLength('test', { min: 1, max: 10 })).toBe(true);
      expect(validator.isLength('', { min: 1 })).toBe(false);
      expect(validator.isLength('very long string', { max: 10 })).toBe(false);
    });

    it('should handle Unicode correctly', () => {
      const emoji = '😀😀😀';
      expect(validator.isLength(emoji, { min: 3, max: 3 })).toBe(true);
    });
  });

  describe('Alphanumeric Validation', () => {
    it('should validate alphanumeric strings', () => {
      expect(validator.isAlphanumeric('abc123')).toBe(true);
      expect(validator.isAlphanumeric('ABC')).toBe(true);
      expect(validator.isAlphanumeric('123')).toBe(true);
    });

    it('should reject non-alphanumeric characters', () => {
      expect(validator.isAlphanumeric('abc-123')).toBe(false);
      expect(validator.isAlphanumeric('abc 123')).toBe(false);
      expect(validator.isAlphanumeric('abc@123')).toBe(false);
    });
  });

  describe('Date Validation', () => {
    it('should validate ISO dates', () => {
      expect(validator.isISO8601('2025-12-13T15:30:00Z')).toBe(true);
      expect(validator.isISO8601('2025-12-13')).toBe(true);
    });

    it('should reject invalid dates', () => {
      expect(validator.isISO8601('2025-13-45')).toBe(false);
      expect(validator.isISO8601('not a date')).toBe(false);
    });
  });

  describe('UUID Validation', () => {
    it('should validate UUIDs', () => {
      expect(validator.isUUID('550e8400-e29b-41d4-a716-446655440000')).toBe(true);
      expect(validator.isUUID('550e8400-e29b-41d4-a716-446655440000', 4)).toBe(true);
    });

    it('should reject invalid UUIDs', () => {
      expect(validator.isUUID('not-a-uuid')).toBe(false);
      expect(validator.isUUID('550e8400-e29b-41d4-a716')).toBe(false);
    });
  });
});

