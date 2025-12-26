// src/pages/ArticlePage.tsx
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import AuthorCard from "./AuthorCard";
import { articles } from "./articles";
import { authors } from "./author";

const ArticlePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const article = articles.find(a => a.slug === slug);

  if (!article) return <div className="text-center py-20">Article not found</div>;

  const [content, setContent] = useState("");

  useEffect(() => {
    fetch(article.content)
      .then((res) => res.text())
      .then((text) => setContent(text));
  }, [article.content]);

  const author = authors[article.authorId];

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
        <ReactMarkdown
            components={{
                h1: ({ node, ...props }) => <h1 className="text-4xl font-bold my-4" {...props} />,
                h2: ({ node, ...props }) => <h2 className="text-3xl font-semibold my-3" {...props} />,
                h3: ({ node, ...props }) => <h3 className="text-2xl font-semibold my-2" {...props} />,
                p: ({ node, ...props }) => <p className="text-base leading-7 my-2" {...props} />,
                ul: ({ node, ...props }) => <ul className="!list-disc pl-6 my-2" {...props} />,
                ol: ({ node, ...props }) => <ol className="!list-decimal pl-6 my-2" {...props} />,
                code: ({ node, className, children, ...props }) => (
                <code className="bg-gray-100 px-1 rounded text-sm font-mono" {...props}>
                    {children}
                </code>
                ),
                blockquote: ({ node, ...props }) => (
                <blockquote className="border-l-4 border-gray-300 pl-4 italic my-2" {...props} />
                ),
                a: ({ node, ...props }) => (
                <a className="text-blue-600 underline hover:text-blue-800" {...props} />
                ),
            }}
            >
            {content}
        </ReactMarkdown>

      {author && <AuthorCard author={author} published={article.published} />}

      <div className="border-t border-gray-300 mt-6 pt-4 text-sm text-gray-600">
        <p>
          Feedback? Suggestions? Want to{" "}
          <a href="/writing" className="text-blue-600 underline">
            write an article
          </a>{" "}
          yourself?
        </p>
        <p>
          Send an email to{" "}
          <a href="mailto:webmaster@smach.us" className="small-link text-blue-600 underline">
            webmaster@smach.us
          </a>
        </p>
      </div>
    </div>
  );
};

export default ArticlePage;
