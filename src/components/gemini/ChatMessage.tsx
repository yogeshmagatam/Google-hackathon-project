'use client';

import React from 'react';
import { Message } from '@/types';
import { cn, formatTimestamp } from '@/lib/utils';
import { User, Bot, Copy, ThumbsUp, ThumbsDown, MoreVertical } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/styles/tomorrow';

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
    <div className={cn(
      "flex gap-3 group",
      isUser ? "justify-end" : "justify-start"
    )}>
      {!isUser && (
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
          <Bot className="w-5 h-5 text-white" />
        </div>
      )}

      <div className={cn(
        "max-w-3xl rounded-2xl px-4 py-3 relative",
        isUser
          ? "bg-blue-600 text-white"
          : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
      )}>
        {/* Message Content */}
        <div className="prose prose-sm max-w-none">
          {isUser ? (
            <p className="whitespace-pre-wrap mb-0">{message.text}</p>
          ) : (
            <ReactMarkdown
              components={{
                p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
                strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                code: ({ className, children, ...props }: any) => {
                  const match = /language-(\w+)/.exec(className || '');
                  const language = match ? match[1] : '';
                  const isInline = !language;
                  
                  if (!isInline && language) {
                    return (
                      <div className="relative">
                        <SyntaxHighlighter
                          style={tomorrow as any}
                          language={language}
                          PreTag="div"
                          className="rounded-lg !mt-2 !mb-2"
                          {...props}
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                        <button
                          onClick={() => navigator.clipboard.writeText(String(children))}
                          className="absolute top-2 right-2 p-1 bg-gray-700 hover:bg-gray-600 text-white rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                    );
                  }
                  
                  return (
                    <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-sm" {...props}>
                      {children}
                    </code>
                  );
                },
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-2">
                    {children}
                  </blockquote>
                ),
                h1: ({ children }) => <h1 className="text-xl font-bold mb-2">{children}</h1>,
                h2: ({ children }) => <h2 className="text-lg font-bold mb-2">{children}</h2>,
                h3: ({ children }) => <h3 className="text-md font-bold mb-2">{children}</h3>,
              }}
            >
              {message.text}
            </ReactMarkdown>
          )}
        </div>

        {/* Attachments */}
        {message.attachments && message.attachments.length > 0 && (
          <div className="mt-3 space-y-2">
            {message.attachments.map((attachment) => (
              <div
                key={attachment.id}
                className="flex items-center gap-2 p-2 bg-white dark:bg-gray-700 rounded-lg"
              >
                {attachment.type === 'image' ? (
                  <img
                    src={attachment.url}
                    alt={attachment.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-200 dark:bg-gray-600 rounded flex items-center justify-center">
                    <span className="text-xs font-mono">{attachment.type}</span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{attachment.name}</p>
                  {attachment.size && (
                    <p className="text-xs text-gray-500">{formatFileSize(attachment.size)}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Message Actions */}
        <div className={cn(
          "flex items-center justify-between mt-2 pt-2 border-t opacity-0 group-hover:opacity-100 transition-opacity",
          isUser 
            ? "border-blue-500/30 text-blue-100" 
            : "border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400"
        )}>
          <div className="flex items-center gap-2 text-xs">
            <span>{formatTimestamp(message.timestamp)}</span>
            {message.provider && message.provider !== 'system' && (
              <>
                <span>•</span>
                <span className="capitalize">{message.provider}</span>
              </>
            )}
            {message.responseTime && (
              <>
                <span>•</span>
                <span>{message.responseTime}ms</span>
              </>
            )}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleCopy}
              className={cn(
                "p-1 rounded hover:bg-white/10 transition-colors",
                copied && "text-green-500"
              )}
              title={copied ? "Copied!" : "Copy message"}
            >
              <Copy className="w-3 h-3" />
            </button>
            
            {!isUser && (
              <>
                <button
                  className="p-1 rounded hover:bg-white/10 transition-colors"
                  title="Good response"
                >
                  <ThumbsUp className="w-3 h-3" />
                </button>
                <button
                  className="p-1 rounded hover:bg-white/10 transition-colors"
                  title="Poor response"
                >
                  <ThumbsDown className="w-3 h-3" />
                </button>
              </>
            )}
            
            <button
              className="p-1 rounded hover:bg-white/10 transition-colors"
              title="More options"
            >
              <MoreVertical className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {isUser && (
        <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
          <User className="w-5 h-5 text-white" />
        </div>
      )}
    </div>
  );
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}