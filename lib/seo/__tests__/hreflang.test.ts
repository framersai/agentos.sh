import { describe, expect, test } from 'vitest';
import { hreflangAlternates } from '../hreflang';

describe('hreflangAlternates', () => {
  test('homepage emits all 8 locales + x-default', () => {
    const result = hreflangAlternates('/');
    expect(result['en']).toBe('https://agentos.sh/en/');
    expect(result['zh']).toBe('https://agentos.sh/zh/');
    expect(result['ko']).toBe('https://agentos.sh/ko/');
    expect(result['ja']).toBe('https://agentos.sh/ja/');
    expect(result['es']).toBe('https://agentos.sh/es/');
    expect(result['de']).toBe('https://agentos.sh/de/');
    expect(result['fr']).toBe('https://agentos.sh/fr/');
    expect(result['pt']).toBe('https://agentos.sh/pt/');
    expect(result['x-default']).toBe('https://agentos.sh/en/');
  });

  test('result has exactly 9 keys (8 locales + x-default)', () => {
    expect(Object.keys(hreflangAlternates('/'))).toHaveLength(9);
  });

  test('blog post propagates path to every locale', () => {
    const result = hreflangAlternates('/blog/announcing-agentos');
    expect(result['en']).toBe('https://agentos.sh/en/blog/announcing-agentos/');
    expect(result['zh']).toBe('https://agentos.sh/zh/blog/announcing-agentos/');
    expect(result['x-default']).toBe('https://agentos.sh/en/blog/announcing-agentos/');
  });

  test('nested path preserved across all locales', () => {
    const result = hreflangAlternates('/legal/privacy');
    expect(result['ja']).toBe('https://agentos.sh/ja/legal/privacy/');
    expect(result['de']).toBe('https://agentos.sh/de/legal/privacy/');
  });
});
