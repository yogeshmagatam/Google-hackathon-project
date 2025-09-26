'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Message } from '@/types';
import { cn, formatTimestamp } from '@/lib/utils';
import { User, Bot, Copy, ThumbsUp, ThumbsDown, MoreVertical } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { prism } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.sender === 'user';
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div 
      className={cn(
        "flex gap-3 group",
        isUser ? "justify-end" : "justify-start"
      )}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.3, 
        ease: "easeOut",
        type: "spring",
        stiffness: 200,
        damping: 20
      }}
    >
      {!isUser && (
        <motion.div 
          className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-md"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 20 }}
          whileHover={{ scale: 1.1, rotate: 5 }}
        >
          <Bot className="w-5 h-5 text-white" />
        </motion.div>
      )}

      <motion.div 
        className={cn(
          'max-w-3xl rounded-2xl px-4 py-3 relative shadow-sm border',
          isUser
            ? 'bg-blue-600 text-white border-blue-500'
            : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700'
        )}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.05, duration: 0.2 }}
        whileHover={{ scale: 1.02 }}
      >
        <div className="prose prose-sm max-w-none dark:prose-invert">
          {isUser ? (
            <p className="whitespace-pre-wrap mb-0 text-white">{message.text}</p>
          ) : (
            <ReactMarkdown
              components={{
                p: ({ children }) => (
                  <p className="mb-2 last:mb-0 text-gray-900 dark:text-gray-100">
                    {children}
                  </p>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc list-inside mb-2 space-y-1 text-gray-900 dark:text-gray-100">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal list-inside mb-2 space-y-1 text-gray-900 dark:text-gray-100">
                    {children}
                  </ol>
                ),
                strong: ({ children }) => (
                  <strong className="font-semibold text-gray-900 dark:text-gray-100">
                    {children}
                  </strong>
                ),
                code: ({ children, ...props }: any) => {
                  const content = String(children);
                  const isMultiline = /\n/.test(content.trim());
                  if (isMultiline) {
                    return (
                      <div className="relative my-3 group/code">
                        <pre className="rounded-lg bg-gray-900 text-gray-100 border border-gray-800 px-3 py-3 overflow-x-auto text-sm">
                          <code {...props}>{content.replace(/\n$/, '')}</code>
                        </pre>
                        <button
                          onClick={() => navigator.clipboard.writeText(content)}
                          className="absolute top-2 right-2 p-1.5 bg-gray-800 hover:bg-gray-700 text-white rounded text-xs opacity-0 group-hover/code:opacity-100 transition-all duration-200"
                          title="Copy code"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                    );
                  }
                  return (
                    <code
                      className="bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-1.5 py-0.5 rounded font-mono text-sm border border-blue-200 dark:border-blue-800"
                      {...props}
                    >
                      {children}
                    </code>
                  );
                },
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-2 bg-blue-50/50 dark:bg-blue-900/20 py-2 rounded-r">
                    {children}
                  </blockquote>
                ),
                h1: ({ children }) => (
                  <h1 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-lg font-bold mb-2 text-gray-900 dark:text-gray-100">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-md font-bold mb-2 text-gray-900 dark:text-gray-100">
                    {children}
                  </h3>
                )
              }}
            >
              {message.text}
            </ReactMarkdown>
          )}
        </div>

        {message.attachments?.length ? (
          <div className="mt-3 space-y-2">
            {message.attachments.map(att => (
              <div
                key={att.id}
                className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
              >
                {att.type === 'image' ? (
                  <img
                    src={att.url}
                    alt={att.name}
                    className="w-12 h-12 object-cover rounded border border-gray-200 dark:border-gray-600"
                  />
                ) : (
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded flex items-center justify-center border border-blue-200 dark:border-blue-800">
                    <span className="text-xs font-mono text-blue-800 dark:text-blue-300">
                      {att.type}
                    </span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate text-gray-900 dark:text-gray-100">
                    {att.name}
                  </p>
                  {att.size && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatFileSize(att.size)}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : null}

        <div
          className={cn(
            'flex items-center justify-between mt-3 pt-2 border-t opacity-0 group-hover:opacity-100 transition-opacity duration-200',
            isUser
              ? 'border-blue-400/30 text-blue-100'
              : 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400'
          )}
        >
          <div className="flex items-center gap-2 text-xs">
            <span>{formatTimestamp(message.timestamp)}</span>
            {message.provider && message.provider !== 'system' && (
              <>
                <span className="text-gray-400 dark:text-gray-500">•</span>
                <span className="capitalize font-medium">{message.provider}</span>
              </>
            )}
            {message.responseTime && (
              <>
                <span className="text-gray-400 dark:text-gray-500">•</span>
                <span className="font-mono">{message.responseTime}ms</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={handleCopy}
              className={cn(
                'p-1.5 rounded-md transition-all duration-200',
                isUser
                  ? 'hover:bg-blue-500/30'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700',
                copied
                  ? 'text-green-500'
                  : isUser
                    ? 'text-blue-100'
                    : 'text-gray-500 dark:text-gray-400'
              )}
              title={copied ? 'Copied!' : 'Copy message'}
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
            {!isUser && (
              <>
                <button
                  className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 hover:text-green-600 dark:hover:text-green-400"
                  title="Good response"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                </button>
                <button
                  className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 hover:text-red-600 dark:hover:text-red-400"
                  title="Poor response"
                >
                  <ThumbsDown className="w-3.5 h-3.5" />
                </button>
              </>
            )}
            <button
              className={cn(
                'p-1.5 rounded-md transition-all duration-200',
                isUser
                  ? 'hover:bg-blue-500/30 text-blue-100'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400'
              )}
              title="More options"
            >
              <MoreVertical className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </motion.div>

      {isUser && (
        <motion.div
          className="w-8 h-8 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center flex-shrink-0 shadow-md"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 300, damping: 20 }}
          whileHover={{ scale: 1.1, rotate: -5 }}
        >
          <User className="w-5 h-5 text-white" />
        </motion.div>
      )}
    </motion.div>
  );
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}