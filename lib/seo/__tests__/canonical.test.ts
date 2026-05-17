import { describe, expect, test } from 'vitest';
import { canonical } from '../canonical';

describe('canonical', () => {
  test('en homepage drops locale prefix', () => {
    expect(canonical('en', '/')).toBe('https://agentos.sh/');
  });

  test('en blog index drops locale prefix', () => {
    expect(canonical('en', '/blog')).toBe('https://agentos.sh/blog/');
  });

  test('en blog post drops locale prefix', () => {
    expect(canonical('en', '/blog/announcing-agentos')).toBe(
      'https://agentos.sh/blog/announcing-agentos/'
    );
  });

  test('zh homepage keeps locale prefix', () => {
    expect(canonical('zh', '/')).toBe('https://agentos.sh/zh/');
  });

  test('zh blog post keeps locale prefix', () => {
    expect(canonical('zh', '/blog/cognitive-memory-beyond-rag')).toBe(
      'https://agentos.sh/zh/blog/cognitive-memory-beyond-rag/'
    );
  });

  test('drops duplicate slashes', () => {
    expect(canonical('en', '//blog//')).toBe('https://agentos.sh/blog/');
  });

  test('always emits trailing slash for trailingSlash:true config', () => {
    expect(canonical('en', '/about')).toBe('https://agentos.sh/about/');
  });

  test('handles path without leading slash', () => {
    expect(canonical('en', 'about')).toBe('https://agentos.sh/about/');
  });

  test('nested route preserves segments and locale prefix for non-default', () => {
    expect(canonical('ja', '/legal/privacy')).toBe('https://agentos.sh/ja/legal/privacy/');
  });

  test('nested route drops locale prefix for default', () => {
    expect(canonical('en', '/legal/privacy')).toBe('https://agentos.sh/legal/privacy/');
  });
});
