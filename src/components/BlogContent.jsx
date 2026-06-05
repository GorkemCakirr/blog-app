"use client";

import { useEffect, useState, useRef } from "react";
import LeftNav from "./left-nav";
import { useTheme } from "next-themes";
import parse from "html-react-parser";
import { SafeImage } from "./safe-image";

const styles = `<style>
  .mdx-content {
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    line-height: 1.8;
    max-width: 65ch;
  }

  .mdx-content h1, .mdx-content h2, .mdx-content h3,
  .mdx-content h4, .mdx-content h5, .mdx-content h6 {
    font-weight: 600;
    line-height: 1.25;
  }

  .mdx-content h1 {
    font-size: clamp(2.5rem, 5vw, 4rem);
    letter-spacing: -0.02em;
    margin: 3rem 0 2rem;
    display: none;
  }

  .mdx-content h2 {
    font-size: clamp(1.75rem, 3vw, 2.5rem);
    letter-spacing: -0.01em;
    padding-bottom: 0.75rem;
    margin: 3rem 0 1.5rem;
  }

  .mdx-content h3 {
    font-size: clamp(1.25rem, 2vw, 1.75rem);
    margin: 2.5rem 0 1rem;
  }

  .mdx-content h4 {
    font-size: 1.25rem;
    margin: 2rem 0 0.75rem;
  }

  .mdx-content p {
    margin-top: 1.5em;
    margin-bottom: 1.5em;
  }

  .mdx-content a {
    text-decoration: none;
    font-family: 'SF Mono', 'Fira Code', 'Consolas', monospace;
    font-size: 0.95em;
  }

  .mdx-content a:hover {
    text-decoration: underline;
  }

  .mdx-content ul, .mdx-content ol {
    margin-top: 1.5em;
    margin-bottom: 1.5em;
    padding-left: 1.625em;
  }

  .mdx-content ul { list-style-type: disc; }
  .mdx-content ol { list-style-type: decimal; }

  .mdx-content li {
    margin-top: 0.75em;
    margin-bottom: 0.75em;
  }

  .mdx-content blockquote {
    margin-top: 2rem;
    margin-bottom: 2rem;
    padding-left: 1.5em;
    border-left-width: 3px;
    font-style: italic;
  }

  .mdx-content code {
    font-family: 'SF Mono', 'Fira Code', 'Consolas', monospace;
    font-size: 0.9em;
    padding: 0.2em 0.4em;
    border-radius: 3px;
  }

  .mdx-content pre {
    margin-top: 2rem;
    margin-bottom: 2rem;
    padding: 1.25em;
    border-radius: 5px;
    overflow-x: auto;
  }

  .mdx-content img {
    margin-top: 2.5rem;
    margin-bottom: 2.5rem;
    max-width: 100%;
    height: auto;
    border-radius: 5px;
  }

  .mdx-content table {
    width: 100%;
    margin-top: 2.5rem;
    margin-bottom: 2.5rem;
    border-collapse: collapse;
  }

  .mdx-content th, .mdx-content td {
    padding: 1rem;
    border-width: 1px;
  }

  /* Light theme */
  .mdx-content {
    color: #1a1a1a;
    background-color: #ffffff;
  }

  .mdx-content h1, .mdx-content h2, .mdx-content h3,
  .mdx-content h4, .mdx-content h5, .mdx-content h6 {
    color: #000;
  }

  .mdx-content h2 {
    border-bottom: 1px solid #e5e5e5;
  }

  .mdx-content a {
    color: #0070f3;
  }

  .mdx-content code {
    background-color: #f5f5f5;
    color: #333;
  }

  .mdx-content pre {
    background-color: #f5f5f5;
    color: #333;
    border: 1px solid #e5e5e5;
  }

  .mdx-content blockquote {
    border-color: #d4d4d4;
    color: #525252;
  }

  .mdx-content th, .mdx-content td {
    border-color: #e5e5e5;
  }

  /* Dark theme */
  .dark .mdx-content {
    color: #e5e5e5;
    background-color: var(--background);
  }

  .dark .mdx-content h1, .dark .mdx-content h2,
  .dark .mdx-content h3, .dark .mdx-content h4,
  .dark .mdx-content h5, .dark .mdx-content h6 {
    color: #ffffff;
  }

  .dark .mdx-content h2 {
    border-bottom: 1px solid #404040;
  }

  .dark .mdx-content a {
    color: #58a6ff;
  }

  .dark .mdx-content code {
    background-color: #2d2d2d;
    color: #e1e1e1;
  }

  .dark .mdx-content pre {
    background-color: #2d2d2d;
    color: #e1e1e1;
    border: 1px solid #404040;
  }

  .dark .mdx-content blockquote {
    border-color: #525252;
    color: #a3a3a3;
  }

  .dark .mdx-content th, .dark .mdx-content td {
    border-color: #404040;
  }

  /* StatBox Component */
  .mdx-content .stat-box {
    display: block;
    padding: 1.5rem 0;
    border-left: 3px solid #0070f3;
    padding-left: 1.25rem;
    margin: 2rem 0;
  }

  .mdx-content .stat-box-number {
    display: block;
    font-family: 'SF Mono', 'Fira Code', 'Consolas', monospace;
    font-size: clamp(1.75rem, 3vw, 2.25rem);
    font-weight: 700;
    line-height: 1.2;
    color: #0070f3;
  }

  .mdx-content .stat-box-label {
    display: block;
    margin-top: 0.5rem;
    font-size: 0.95rem;
    opacity: 0.8;
  }

  .dark .mdx-content .stat-box {
    border-left-color: #58a6ff;
  }

  .dark .mdx-content .stat-box-number {
    color: #58a6ff;
  }

  /* Callout Component */
  .mdx-content .callout {
    border-left: 3px solid;
    border-top: 1px solid;
    border-bottom: 1px solid;
    border-right: none;
    border-radius: 0;
    padding: 1.5rem 2rem;
    margin: 2.5rem 0;
    background: transparent;
  }

  .mdx-content .callout-insight {
    border-left-color: #3b82f6;
    border-top-color: #e5e5e5;
    border-bottom-color: #e5e5e5;
  }

  .dark .mdx-content .callout-insight {
    border-left-color: #60a5fa;
    border-top-color: #404040;
    border-bottom-color: #404040;
  }

  .mdx-content .callout-warning {
    border-left-color: #f59e0b;
    border-top-color: #e5e5e5;
    border-bottom-color: #e5e5e5;
  }

  .dark .mdx-content .callout-warning {
    border-left-color: #fbbf24;
    border-top-color: #404040;
    border-bottom-color: #404040;
  }

  .mdx-content .callout-tip {
    border-left-color: #10b981;
    border-top-color: #e5e5e5;
    border-bottom-color: #e5e5e5;
  }

  .dark .mdx-content .callout-tip {
    border-left-color: #34d399;
    border-top-color: #404040;
    border-bottom-color: #404040;
  }

  .mdx-content .callout-content {
    font-size: 1rem;
    line-height: 1.7;
  }

  /* PullQuote Component */
  .mdx-content .pull-quote {
    font-size: clamp(1.5rem, 3vw, 2rem);
    font-weight: 500;
    font-style: italic;
    text-align: center;
    border-top: 1px solid #e5e5e5;
    border-bottom: 1px solid #e5e5e5;
    border-left: none;
    padding: 2.5rem 1rem;
    margin: 3rem 0;
    background: transparent;
    color: #1a1a1a;
  }

  .dark .mdx-content .pull-quote {
    color: #e5e5e5;
    border-top-color: #404040;
    border-bottom-color: #404040;
  }

  /* ComparisonTable Component */
  .mdx-content .comparison-table-wrapper {
    overflow-x: auto;
    margin: 2.5rem 0;
  }

  .mdx-content .comparison-table {
    width: 100%;
    border-collapse: collapse;
  }

  .mdx-content .comparison-table th {
    background: transparent;
    color: #1a1a1a;
    font-family: 'SF Mono', 'Fira Code', 'Consolas', monospace;
    font-weight: 600;
    font-size: 0.875rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    padding: 1rem;
    text-align: left;
    border-bottom: 2px solid #1a1a1a;
  }

  .mdx-content .comparison-table td {
    padding: 1rem;
    border-bottom: 1px solid #e5e5e5;
  }

  .dark .mdx-content .comparison-table th {
    background: transparent;
    color: #ffffff;
    border-bottom-color: #ffffff;
  }

  .dark .mdx-content .comparison-table td {
    border-color: #404040;
  }
</style>`;

export default function BlogContent({
  sourceHTML,
  sourceFrontmatter,
  formattedDate,
}) {
  const [headings, setHeadings] = useState([]);
  const [activeHeading, setActiveHeading] = useState("");
  const contentRef = useRef(null);
  const { theme } = useTheme();

  const styledHTML = `
    ${styles}
    <div class="mdx-content">
      ${sourceHTML}
    </div>
  `;

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
    }
  }, [sourceHTML]);

  useEffect(() => {
    if (!contentRef.current) return;

    const headingElements = contentRef.current.querySelectorAll("h1, h2, h3");
    const extractedHeadings = Array.from(headingElements).map((heading) => {
      const id =
        heading.id ||
        heading.textContent
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/\s+/g, "-")
          .replace(/[^\w-]+/g, "");

      if (!heading.id) heading.id = id;

      return {
        id,
        text: heading.textContent,
        level: parseInt(heading.tagName[1]),
      };
    });

    setHeadings(extractedHeadings);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveHeading(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-64px 0px -80% 0px",
        threshold: 0,
      }
    );

    headingElements.forEach((heading) => {
      observer.observe(heading);
    });

    return () => {
      observer.disconnect();
    };
  }, [theme]);

  return (
    <>
      <div className="grid py-12 md:py-20 px-4 md:px-6 grid-cols-4 col-span-full">
        <div className="col-span-full md:col-span-3">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-tight text-gray-900 dark:text-white">
            {sourceFrontmatter.title}
          </h1>

          <div className="col-span-full mt-10 mb-12 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center text-gray-900 dark:text-white">
              <div className="h-14 w-14 mr-4 rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-700">
                <SafeImage
                  src={`${process.env.NEXT_PUBLIC_BASE_URL}/divmagic-700.png`}
                  alt="Author Photo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="text-lg font-semibold block">DivMagic Team</span>
                <time className="text-gray-500 dark:text-gray-400 font-mono text-sm tracking-wide">
                  {formattedDate}
                </time>
              </div>
            </div>
          </div>

          <div ref={contentRef} className="col-span-1 lg:col-span-3">
            {parse(styledHTML)}
          </div>
        </div>
        <div className="hidden md:block break-words ml-8 col-span-1">
          <LeftNav
            headings={headings}
            activeHeading={activeHeading}
            setActiveHeading={setActiveHeading}
          />
        </div>
      </div>
    </>
  );
}
