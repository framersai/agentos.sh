'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check } from 'lucide-react';
import { useCallback } from 'react';
import { useTheme } from 'next-themes';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';

interface MarkdownRendererProps {
  content: string;
}

function CodeBlock({ language, children }: { language: string; children: string }) {
  const { copied, copy } = useCopyToClipboard();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const copyCode = useCallback(() => {
    copy(children);
  }, [children, copy]);

  return (
    <div className="relative group my-4">
      <div className="absolute right-2 top-2 z-10">
        <button
          onClick={copyCode}
          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors opacity-0 group-hover:opacity-100"
          aria-label="Copy code"
        >
          {copied ? (
            <Check className="w-4 h-4 text-green-400" />
          ) : (
            <Copy className="w-4 h-4 text-gray-400" />
          )}
        </button>
      </div>
      <SyntaxHighlighter
        language={language || 'text'}
        style={isDark ? oneDark : oneLight}
        customStyle={{
          margin: 0,
          borderRadius: '0.75rem',
          padding: '1.5rem',
          fontSize: '0.875rem',
          background: isDark ? '#1e1e2e' : '#fafafa',
        }}
        showLineNumbers={children.split('\n').length > 5}
        lineNumberStyle={{
          minWidth: '2.5rem',
          paddingRight: '1rem',
          color: '#6b7280',
          userSelect: 'none',
        }}
      >
        {children}
      </SyntaxHighlighter>
    </div>
  );
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <article className="agentos-prose prose prose-lg dark:prose-invert max-w-none
      prose-headings:text-[var(--color-text-primary)] prose-headings:font-bold
      prose-h1:text-3xl prose-h1:mb-6 prose-h1:mt-8
      prose-h2:text-[1.75rem] prose-h2:mb-5 prose-h2:mt-12 prose-h2:pb-3 prose-h2:border-b prose-h2:border-[var(--color-border-subtle)] prose-h2:tracking-tight prose-h2:leading-tight
      prose-h3:text-xl prose-h3:mb-3 prose-h3:mt-8 prose-h3:tracking-tight
      prose-h4:text-lg prose-h4:mb-2 prose-h4:mt-5
      prose-p:text-[var(--color-text-secondary)] prose-p:leading-[1.75]
      prose-a:text-[var(--color-text-link)] prose-a:font-medium prose-a:underline prose-a:decoration-[var(--color-text-link)]/50 prose-a:decoration-2 prose-a:underline-offset-[3px] hover:prose-a:decoration-[var(--color-text-link)] hover:prose-a:text-[var(--color-accent-hover)]
      prose-strong:text-[var(--color-text-primary)] prose-strong:font-semibold
      prose-code:text-[var(--color-text-link)] prose-code:bg-[var(--color-background-tertiary)] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:before:content-none prose-code:after:content-none
      prose-pre:bg-transparent prose-pre:p-0 prose-pre:my-0
      prose-ul:text-[var(--color-text-secondary)] prose-ul:list-none prose-ul:pl-0 prose-ul:my-6
      prose-ol:text-[var(--color-text-secondary)] prose-ol:list-decimal prose-ol:pl-6 prose-ol:my-6
      prose-li:text-[var(--color-text-secondary)] prose-li:my-2 prose-li:leading-[1.7]
      prose-blockquote:border-l-2 prose-blockquote:border-[var(--color-accent-primary)] prose-blockquote:bg-gradient-to-r prose-blockquote:from-[var(--color-background-secondary)] prose-blockquote:to-transparent prose-blockquote:py-3 prose-blockquote:px-5 prose-blockquote:rounded-r-lg prose-blockquote:not-italic prose-blockquote:text-[var(--color-text-secondary)]
      [&_blockquote_p:first-of-type]:before:content-none [&_blockquote_p:last-of-type]:after:content-none
      prose-table:border-collapse prose-table:w-full prose-table:overflow-x-auto
      prose-thead:bg-[var(--color-background-secondary)]
      prose-th:text-[var(--color-text-primary)] prose-th:font-semibold prose-th:px-4 prose-th:py-3 prose-th:border prose-th:border-[var(--color-border-subtle)] prose-th:text-left prose-th:text-sm
      prose-td:px-4 prose-td:py-3 prose-td:border prose-td:border-[var(--color-border-subtle)] prose-td:text-[var(--color-text-secondary)] prose-td:text-sm
      prose-tr:even:bg-[var(--color-background-secondary)]/30
      prose-hr:border-[var(--color-border-subtle)] prose-hr:my-12
      prose-img:rounded-xl prose-img:shadow-lg
    ">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          code({ node: _node, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const isInline = !match && !String(children).includes('\n');

            if (isInline) {
              return (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            }

            return (
              <CodeBlock language={match?.[1] || 'text'}>
                {String(children).replace(/\n$/, '')}
              </CodeBlock>
            );
          },
          table({ node: _node, children, ...props }) {
            return (
              <div className="overflow-x-auto my-6 rounded-xl border border-[var(--color-border-subtle)]">
                <table {...props}>{children}</table>
              </div>
            );
          },
          a({ node: _node, href, children, ...props }) {
            const isExternal = href?.startsWith('http');
            return (
              <a
                href={href}
                target={isExternal ? '_blank' : undefined}
                rel={isExternal ? 'noopener noreferrer' : undefined}
                {...props}
              >
                {children}
              </a>
            );
          },
          h1({ node: _node, children, ...props }) {
            const id = String(children).toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
            return <h1 id={id} {...props}>{children}</h1>;
          },
          h2({ node: _node, children, ...props }) {
            const id = String(children).toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
            return <h2 id={id} {...props}>{children}</h2>;
          },
          h3({ node: _node, children, ...props }) {
            const id = String(children).toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
            return <h3 id={id} {...props}>{children}</h3>;
          },
          ul({ node: _node, children, ...props }) {
            // Custom unordered list: each <li> gets a cyan→purple
            // gradient dot bullet positioned to the left, replacing
            // the default disc marker. The actual marker is rendered
            // in the <li> renderer below as a positioned pseudo-style
            // span; here we just suppress prose-ul defaults.
            return (
              <ul {...props} className="space-y-2.5 my-6 pl-0 list-none">
                {children}
              </ul>
            );
          },
          li({ node: _node, children, ...props }) {
            return (
              <li
                {...props}
                className="relative pl-7 leading-[1.7] text-[var(--color-text-secondary)] marker:hidden"
              >
                <span
                  aria-hidden
                  className="absolute left-1 top-[0.7em] block h-2 w-2 rounded-full"
                  style={{
                    background:
                      'linear-gradient(135deg, hsl(180, 95%, 60%) 0%, hsl(270, 85%, 65%) 100%)',
                    boxShadow: '0 0 8px hsla(180, 95%, 60%, 0.45)',
                  }}
                />
                {children}
              </li>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
}
