import React, { useEffect, useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';

import remarkMath from 'remark-math';
import rehypeMathjax from 'rehype-mathjax';
import rehypePrism from 'rehype-prism';
import rehypeRaw from 'rehype-raw';
import './index.css';
import 'katex/dist/katex.min.css';
import { MemoizedReactMarkdown } from './memoized-react-markdown';
import { CodeBlock } from './code-block';

interface CustomComponents {
  button: any;
  p?: any;
  code?: any;
  ul?: any;
  ol?: any;
  math?: any;
  inlineMath?: any;
  blockMath?: any;
  h3?: any;
}

interface ICustomMarkdownView {
  source: string;
  showDot?: boolean;
  keywords?: string[];
  handleSendKeyword?: any;
  handleSendMessage?: any;
  className?: string;
  paragraphClass?: string;
}

const CustomMarkdownView = ({
  source,
  keywords = [],
  showDot,
  handleSendKeyword,
  className,
  paragraphClass
}: ICustomMarkdownView) => {
  const [renderedSource, setRenderedSource] = useState<string>('');

  useEffect(() => {
    setRenderedSource(replaceKeywordsWithButtons(source, keywords));
  }, [source, keywords]);

  const onKeywordClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    keyword: string
  ) => {
    if (handleSendKeyword) {
      handleSendKeyword(event, keyword);
    }
  };

  return (
    <MemoizedReactMarkdown
      className={`memoized-react-markdown prose break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0 rounded-xl px-3 py-2 transition-all max-w-[75ch] place-self-start shadow-sm ${className} relative overflow-wrap: break-word align-middle ${paragraphClass}`}
      remarkPlugins={[remarkMath, remarkGfm]}
      rehypePlugins={[rehypeRaw, rehypeMathjax]}
      components={getComponents(onKeywordClick)}
    >
      {extractMarkdown(
        highlightBracketedText(replaceLatexDelimiters(source, showDot))
      )}
    </MemoizedReactMarkdown>
  );
};

// Function to remove markdown wrapper from input e.g ```markdown {content} ```
function extractMarkdown(content) {
  // Regular expression to match content between ```markdown and ```
  const regex = /```markdown\n([\s\S]*?)\n```/;

  // Execute the regex to find matches
  const match = regex.exec(content);

  // If a match is found, return the first capturing group, which is the content
  if (match) {
    return match[1];
  }

  // Return null if no markdown block is found
  return content;
}
export const convertChildrenToMarkdown = (element) => {
  const markdownLines = [];

  element.childNodes.forEach((child) => {
    if (child.nodeType === Node.TEXT_NODE) {
      markdownLines.push(child.textContent.trim());
    } else if (child.nodeType === Node.ELEMENT_NODE) {
      switch (child.tagName.toLowerCase()) {
        case 'p':
          markdownLines.push(child.textContent.trim());
          break;
        case 'h1':
          markdownLines.push(`# ${child.textContent.trim()}`);
          break;
        case 'h2':
          markdownLines.push(`## ${child.textContent.trim()}`);
          break;
        case 'h3':
          markdownLines.push(`### ${child.textContent.trim()}`);
          break;
        case 'h4':
          markdownLines.push(`#### ${child.textContent.trim()}`);
          break;
        case 'h5':
          markdownLines.push(`##### ${child.textContent.trim()}`);
          break;
        case 'h6':
          markdownLines.push(`###### ${child.textContent.trim()}`);
          break;
        case 'ul':
          child.querySelectorAll('li').forEach((li) => {
            markdownLines.push(`- ${li.textContent.trim()}`);
          });
          break;
        case 'ol':
          child.querySelectorAll('li').forEach((li, index) => {
            markdownLines.push(`${index + 1}. ${li.textContent.trim()}`);
          });
          break;
        case 'pre':
          markdownLines.push(`\`\`\`\n${child.textContent.trim()}\n\`\`\``);
          break;
        case 'code':
          markdownLines.push(`\`${child.textContent.trim()}\``);
          break;
        default:
          markdownLines.push(child.textContent.trim());
          break;
      }
    }
  });

  return markdownLines.join('\n');
};
export const stripMarkdown = (markdown: string) => {
  return markdown
    .replace(/#+\s/g, '') // Headers
    .replace(/(\*\*|__)/g, '') // Bold
    .replace(/(\*|_)/g, '') // Italic
    .replace(/`{1,3}[^`](.*?)`{1,3}/g, '$1') // Inline code
    .replace(/```[\s\S]*?```/g, '') // Code block
    .replace(/!\[(.*?)\]\(.*?\)/g, '$1') // Images
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Links
    .replace(/^\s*\n/gm, '') // Empty lines
    .replace(/^\s+/g, '') // Leading whitespace
    .replace(/\s+$/g, '') // Trailing whitespace
    .replace(/^- /gm, '') // List items
    .replace(/^\d+\.\s/gm, '') // Numbered list items
    .replace(/\n+/g, ' ') // New lines
    .replace(/-\s/g, '') // Hyphen list items
    .replace(/^\d+\.\s/gm, '') // Ordered list items
    .trim();
};
const highlightBracketedText = (text) => {
  if (text) {
    return text.replace(/\[\[\[(.*?)\]\]\]/g, '<strong>$1</strong>');
  } else {
    return text;
  }
};

function replaceKeywordsWithButtons(
  source: string,
  keywords: string[]
): string {
  return keywords.reduce((modifiedSource, keyword, index) => {
    const keywordButton = `<button class="clickable-keyword" data-keyword="${keyword}" data-index="${index}">${keyword}</button>`;
    return modifiedSource.replace(new RegExp(keyword, 'g'), keywordButton);
  }, source);
}

function replaceLatexDelimiters(source: string, showDot = false): string {
  const latexRemoved = source
    ?.replaceAll('\\[', '$')
    .replaceAll('\\]', '$')
    .replaceAll('\\(', '$')
    .replaceAll('\\)', '$');

  return showDot ? `${latexRemoved} ⚫` : latexRemoved;
}

function getComponents(onKeywordClick: any): CustomComponents {
  return {
    button: (props: any) => (
      <button {...props} onClick={(e) => onKeywordClick(e, props.children)} />
    ),
    code: CodeBlockComponent,
    ul: ListComponent,
    ol: OrderedListComponent,
    p: ParagraphComponent,
    math: MathComponent,
    inlineMath: InlineMathComponent,
    blockMath: BlockMathComponent,
    h3: H3
  };
}

const CodeBlockComponent = ({
  node,
  inline,
  className,
  children,
  ...props
}) => {
  if (children?.length && children[0] == '▍') {
    return <span className="mt-1 cursor-default animate-pulse">▍</span>;
  }

  const match = /language-(\w+)/.exec(className || '');
  console.log('Language match', match);

  return inline ? (
    <code className={className} {...props}>
      {children}
    </code>
  ) : (
    <CodeBlock
      key={Math.random()}
      language={(match && match[1]) || ''}
      value={String(children).replace(/\n$/, '')}
      {...props}
    />
  );
};

const H3 = ({ children }) => <h3 className="mt-6 !text-[1rem]">{children}</h3>;

const ListComponent = ({ children }) => (
  <ul className="list-disc my-6 ml-6 [&>li]:mt-2 list-outside [&_svg]:inline-block">
    {children}
  </ul>
);

const OrderedListComponent = ({ children }) => (
  <ol className="list-decimal my-6 ml-6 [&>li]:mt-2 list-outside [&_svg]:inline-block">
    {children}
  </ol>
);

const ParagraphComponent = ({ children }) => (
  <p className="leading-7 [&:not(:first-child)]:mt-6 whitespace-pre-wrap overflow-wrap: break-word [&_svg]:inline-block">
    {children}
  </p>
);

const MathComponent = ({ value }: any) => <InlineMath math={value} />;

const InlineMathComponent = ({ value }: any) => <InlineMath math={value} />;

const BlockMathComponent = ({ value }: any) => <BlockMath math={value} />;

export default CustomMarkdownView;
