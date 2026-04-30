import { describe, expect, test } from 'vitest';
import { canonical } from '../canonical';

describe('canonical', () => {
  test('en homepage', () => {
    expect(canonical('en', '/')).toBe('https://agentos.sh/en/');
  });

  test('en blog index', () => {
    expect(canonical('en', '/blog')).toBe('https://agentos.sh/en/blog/');
  });

  test('en blog post', () => {
    expect(canonical('en', '/blog/announcing-agentos')).toBe(
      'https://agentos.sh/en/blog/announcing-agentos/'
    );
  });

  test('zh homepage', () => {
    expect(canonical('zh', '/')).toBe('https://agentos.sh/zh/');
  });

  test('zh blog post', () => {
    expect(canonical('zh', '/blog/cognitive-memory-beyond-rag')).toBe(
      'https://agentos.sh/zh/blog/cognitive-memory-beyond-rag/'
    );
  });

  test('drops duplicate slashes', () => {
    expect(canonical('en', '//blog//')).toBe('https://agentos.sh/en/blog/');
  });

  test('always emits trailing slash for trailingSlash:true config', () => {
    expect(canonical('en', '/about')).toBe('https://agentos.sh/en/about/');
  });

  test('handles path without leading slash', () => {
    expect(canonical('en', 'about')).toBe('https://agentos.sh/en/about/');
  });

  test('nested route preserves segments', () => {
    expect(canonical('ja', '/legal/privacy')).toBe('https://agentos.sh/ja/legal/privacy/');
  });
});
