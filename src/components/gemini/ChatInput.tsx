'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Send, Paperclip, Mic, Image, Code, Smile } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDropzone } from 'react-dropzone';

interface ChatInputProps {
  onSendMessage: (message: string, attachments?: any[]) => void;
  disabled?: boolean;
}

export function ChatInput({ onSendMessage, disabled }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState<any[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: useCallback(async (acceptedFiles: File[]) => {
      const newAttachments = await Promise.all(
        acceptedFiles.map(async (file) => {
          const attachment: any = {
            id: Math.random().toString(),
            name: file.name,
            type: file.type.startsWith('image/') ? 'image' : 'document',
            url: URL.createObjectURL(file),
            size: file.size,
            mimeType: file.type,
            file
          };

          // Extract preview for text files
          if (file.type.startsWith('text/') || file.type === 'application/json') {
            try {
              const text = await file.text();
              attachment.preview = text.slice(0, 5000); // Limit preview size
            } catch (error) {
              console.warn('Failed to extract text from file:', error);
            }
          }

          return attachment;
        })
      );
      setAttachments(prev => [...prev, ...newAttachments]);
    }, []),
    noClick: true,
    multiple: true,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
      'text/*': ['.txt', '.md', '.json', '.js', '.ts', '.py', '.html', '.css'],
      'application/json': ['.json']
    }
  });

  const handleSubmit = useCallback((e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!message.trim() && attachments.length === 0) return;
    if (disabled) return;

    onSendMessage(message.trim(), attachments);
    setMessage('');
    setAttachments([]);
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  }, [message, attachments, disabled, onSendMessage]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (e.shiftKey) {
        // Allow new line with Shift+Enter
        return;
      } else {
        // Send message with Enter
        e.preventDefault();
        handleSubmit();
      }
    }
  }, [handleSubmit]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
  }, []);

  const removeAttachment = useCallback((id: string) => {
    setAttachments(prev => {
      const attachment = prev.find(a => a.id === id);
      if (attachment?.url) {
        URL.revokeObjectURL(attachment.url);
      }
      return prev.filter(a => a.id !== id);
    });
  }, []);

  const quickActions = [
    { icon: Image, label: 'Add image', action: () => document.getElementById('image-input')?.click() },
    { icon: Paperclip, label: 'Attach file', action: () => document.getElementById('file-input')?.click() },
    { icon: Code, label: 'Code snippet', action: () => setMessage(prev => prev + '\n```\n\n```') },
    { icon: Smile, label: 'Add emoji', action: () => {} },
  ];

  return (
    <div 
      {...getRootProps()}
      className={cn(
        "relative border-2 border-dashed border-transparent rounded-xl transition-colors",
        isDragActive && "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
      )}
    >
      <input {...getInputProps()} />
      
      {isDragActive && (
        <div className="absolute inset-0 flex items-center justify-center bg-blue-50 dark:bg-blue-900/20 rounded-xl z-10">
          <p className="text-blue-600 dark:text-blue-400 font-medium">Drop files here to attach</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Attachments Preview */}
        {attachments.length > 0 && (
          <div className="flex gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            {attachments.map((attachment) => (
              <div
                key={attachment.id}
                className="relative group flex items-center gap-2 bg-white dark:bg-gray-700 p-2 rounded-lg shadow-sm"
              >
                {attachment.type === 'image' ? (
                  <img
                    src={attachment.url}
                    alt={attachment.name}
                    className="w-10 h-10 object-cover rounded"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded flex items-center justify-center">
                    <Paperclip className="w-4 h-4" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{attachment.name}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(attachment.size)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => removeAttachment(attachment.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-opacity"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Input Area */}
        <div className="flex items-end gap-3 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm">
          {/* Quick Actions */}
          <div className="flex gap-1">
            {quickActions.map((action, index) => (
              <button
                key={index}
                type="button"
                onClick={action.action}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title={action.label}
              >
                <action.icon className="w-5 h-5" />
              </button>
            ))}
          </div>

          {/* Text Input */}
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Type your message... (Shift+Enter for new line)"
              disabled={disabled}
              className="w-full resize-none border-0 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-0 max-h-[120px] min-h-[24px]"
              style={{ height: 'auto' }}
            />
          </div>

          {/* Voice Recording */}
          <button
            type="button"
            onClick={() => setIsRecording(!isRecording)}
            className={cn(
              "p-2 rounded-lg transition-colors",
              isRecording
                ? "bg-red-500 text-white"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            )}
            title={isRecording ? "Stop recording" : "Start voice recording"}
          >
            <Mic className="w-5 h-5" />
          </button>

          {/* Send Button */}
          <button
            type="submit"
            disabled={disabled || (!message.trim() && attachments.length === 0)}
            className={cn(
              "p-2 rounded-lg transition-colors",
              disabled || (!message.trim() && attachments.length === 0)
                ? "bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            )}
            title="Send message"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>

        {/* Hidden File Inputs */}
        <input
          id="image-input"
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            const files = Array.from(e.target.files || []);
            if (files.length > 0) {
              const newAttachments = files.map(file => ({
                id: Math.random().toString(),
                name: file.name,
                type: 'image',
                url: URL.createObjectURL(file),
                size: file.size,
                mimeType: file.type,
                file
              }));
              setAttachments(prev => [...prev, ...newAttachments]);
            }
            e.target.value = '';
          }}
        />
        
        <input
          id="file-input"
          type="file"
          multiple
          className="hidden"
          onChange={(e) => {
            const files = Array.from(e.target.files || []);
            if (files.length > 0) {
              const newAttachments = files.map(file => ({
                id: Math.random().toString(),
                name: file.name,
                type: 'document',
                url: URL.createObjectURL(file),
                size: file.size,
                mimeType: file.type,
                file
              }));
              setAttachments(prev => [...prev, ...newAttachments]);
            }
            e.target.value = '';
          }}
        />

        {/* Helper Text */}
        <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
          Press Enter to send, Shift+Enter for new line • Drag and drop files to attach
        </div>
      </form>
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