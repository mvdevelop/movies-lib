import { describe, it, expect, vi } from 'vitest';
import { getImageUrl, getTrailerUrl } from '@/services/api';
import type { Video } from '@/types';

// Mock environment
Object.defineProperty(import.meta, 'env', {
  value: {
    VITE_API_KEY: 'test-api-key',
    VITE_API_URL: undefined,
    VITE_IMG_URL: undefined,
  },
  writable: true,
});

// Spy on console.error to suppress output during tests
const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

describe('API Service', () => {
  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });

  describe('getImageUrl', () => {
    it('returns correct URL for valid path', () => {
      const url = getImageUrl('/poster.jpg', 'w500');
      expect(url).toBe('https://image.tmdb.org/t/p/w500/poster.jpg');
    });

    it('returns default size (w500) when size not specified', () => {
      const url = getImageUrl('/poster.jpg');
      expect(url).toBe('https://image.tmdb.org/t/p/w500/poster.jpg');
    });

    it('returns placeholder when path is null', () => {
      const url = getImageUrl(null);
      expect(url).toContain('via.placeholder.com');
    });

    it('returns placeholder when path is undefined', () => {
      const url = getImageUrl(undefined);
      expect(url).toContain('via.placeholder.com');
    });

    it('returns placeholder for empty string', () => {
      const url = getImageUrl('');
      expect(url).toContain('via.placeholder.com');
    });

    it('handles path not starting with /', () => {
      const url = getImageUrl('poster.jpg');
      // Should return placeholder because path doesn't start with /
      expect(url).toContain('via.placeholder.com');
    });

    it('accepts all valid TMDB image sizes', () => {
      const sizes = ['w92', 'w154', 'w185', 'w342', 'w500', 'w780', 'original'];
      sizes.forEach((size) => {
        const url = getImageUrl('/test.jpg', size as never);
        expect(url).toBe(`https://image.tmdb.org/t/p/${size}/test.jpg`);
      });
    });

    it('handles special characters in path by sanitizing them', () => {
      const url = getImageUrl('/test<>script.jpg');
      expect(url).toBe('https://image.tmdb.org/t/p/w500/testscript.jpg');
    });
  });

  describe('getTrailerUrl', () => {
    it('returns YouTube URL for valid trailer', () => {
      const videos: { results: Video[] } = {
        results: [
          {
            key: 'dQw4w9WgXcQ',
            site: 'YouTube',
            type: 'Trailer',
            name: 'Official Trailer',
          },
        ],
      };
      const url = getTrailerUrl(videos);
      expect(url).toBe('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    });

    it('returns null when no videos provided', () => {
      expect(getTrailerUrl(null)).toBeNull();
      expect(getTrailerUrl(undefined)).toBeNull();
    });

    it('returns null when no trailer type found', () => {
      const videos: { results: Video[] } = {
        results: [
          {
            key: 'dQw4w9WgXcQ',
            site: 'YouTube',
            type: 'Teaser',
            name: 'Teaser Trailer',
          },
        ],
      };
      expect(getTrailerUrl(videos)).toBeNull();
    });

    it('returns null when video is not from YouTube', () => {
      const videos: { results: Video[] } = {
        results: [
          {
            key: 'dQw4w9WgXcQ',
            site: 'Vimeo',
            type: 'Trailer',
            name: 'Official Trailer',
          },
        ],
      };
      expect(getTrailerUrl(videos)).toBeNull();
    });

    it('returns null when results array is empty', () => {
      const videos: { results: Video[] } = { results: [] };
      expect(getTrailerUrl(videos)).toBeNull();
    });

    it('ignores video with invalid key format (prevents XSS)', () => {
      const videos = {
        results: [
          {
            key: '"><script>alert(1)</script>',
            site: 'YouTube',
            type: 'Trailer',
            name: 'XSS Attempt',
          },
        ],
      };
      // The invalid key format should be rejected
      expect(getTrailerUrl(videos)).toBeNull();
    });

    it('selects trailer when multiple videos exist', () => {
      // YouTube video keys are exactly 11 characters
      const videos = {
        results: [
          {
            key: 'abcdefghij1', // 11 chars - Teaser
            site: 'YouTube',
            type: 'Teaser',
            name: 'Teaser',
          },
          {
            key: 'trailerKey4567', // 11 chars - invalid!
            site: 'YouTube',
            type: 'Trailer',
            name: 'Official Trailer',
          },
        ],
      };
      // This should return null because the "trailer" key is too long
      const url = getTrailerUrl(videos);
      expect(url).toBeNull();

      // Now test with a valid 11-char key as trailer
      const validVideos = {
        results: [
          {
            key: 'abcdefghij1', // 11 chars - Teaser
            site: 'YouTube',
            type: 'Teaser',
            name: 'Teaser',
          },
          {
            key: 'dQw4w9WgXcQ', // 11 chars - valid trailer key
            site: 'YouTube',
            type: 'Trailer',
            name: 'Official Trailer',
          },
        ],
      };
      const validUrl = getTrailerUrl(validVideos);
      expect(validUrl).toBe('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    });
  });

  describe('Input Validation', () => {
    it('getImageUrl handles special characters in path', () => {
      const url = getImageUrl('/test<>script.jpg');
      // Should not contain raw HTML
      expect(url).not.toMatch(/<script/);
    });

    it('getImageUrl handles very long paths', () => {
      const longPath = '/' + 'a'.repeat(500) + '.jpg';
      const url = getImageUrl(longPath);
      expect(url).toContain(longPath);
    });

    it('getTrailerUrl handles malformed video objects', () => {
      const videos = {
        results: [
          {
            // Missing key — simulating malformed API response
            site: 'YouTube',
            type: 'Trailer',
            name: 'No Key',
          },
        ],
      };
      // Cast to unknown first to bypass type checking for testing malformed data
      expect(getTrailerUrl(videos as never)).toBeNull();
    });
  });
});
