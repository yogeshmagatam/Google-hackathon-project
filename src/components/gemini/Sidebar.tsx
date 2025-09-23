'use client';

import React, { useState } from 'react';
import { useConversations } from '@/contexts/ConversationContext';
import { cn, formatTimestamp } from '@/lib/utils';
import {
  Search,
  Plus,
  MessageCircle,
  Pin,
  MoreVertical,
  Trash2,
  Edit3,
  Download,
  Settings,
  History,
  Star,
  Filter
} from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isMobile: boolean;
}

export function Sidebar({ isOpen, onClose, isMobile }: SidebarProps) {
  const {
    conversations,
    currentConversation,
    createNewConversation,
    selectConversation,
    deleteConversation,
    pinConversation,
    unpinConversation,
    exportConversation,
    searchConversations
  } = useConversations();

  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'pinned' | 'recent'>('all');
  const [isSearching, setIsSearching] = useState(false);

  const filteredConversations = React.useMemo(() => {
    let result = conversations;
    
    if (searchQuery) {
      result = searchConversations(searchQuery);
    }
    
    switch (filter) {
      case 'pinned':
        result = result.filter(conv => conv.isPinned);
        break;
      case 'recent':
        result = result.filter(conv => {
          const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
          return conv.updatedAt > dayAgo;
        });
        break;
    }
    
    return result.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return b.updatedAt.getTime() - a.updatedAt.getTime();
    });
  }, [conversations, searchQuery, filter, searchConversations]);

  const handleNewChat = () => {
    createNewConversation();
    if (isMobile) onClose();
  };

  const handleSelectConversation = (id: string) => {
    selectConversation(id);
    if (isMobile) onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={handleNewChat}
          className="w-full flex items-center gap-3 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span className="font-medium">New conversation</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="p-4 space-y-3 border-b border-gray-200 dark:border-gray-700">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-gray-600"
          />
        </div>
        
        <div className="flex gap-2">
          {[
            { id: 'all', label: 'All', icon: MessageCircle },
            { id: 'pinned', label: 'Pinned', icon: Pin },
            { id: 'recent', label: 'Recent', icon: History }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setFilter(id as any)}
              className={cn(
                "flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-colors",
                filter === id
                  ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
              )}
            >
              <Icon className="w-3 h-3" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-gray-500 dark:text-gray-400">
            <MessageCircle className="w-8 h-8 mb-2" />
            <p className="text-sm">
              {searchQuery ? 'No conversations found' : 'No conversations yet'}
            </p>
          </div>
        ) : (
          <div className="p-2">
            {filteredConversations.map((conversation) => (
              <ConversationItem
                key={conversation.id}
                conversation={conversation}
                isActive={currentConversation?.id === conversation.id}
                onClick={() => handleSelectConversation(conversation.id)}
                onPin={() => conversation.isPinned ? unpinConversation(conversation.id) : pinConversation(conversation.id)}
                onDelete={() => deleteConversation(conversation.id)}
                onExport={() => exportConversation(conversation.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <button className="w-full flex items-center gap-3 p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
          <Settings className="w-4 h-4" />
          <span className="text-sm">Settings</span>
        </button>
      </div>
    </div>
  );
}

interface ConversationItemProps {
  conversation: any;
  isActive: boolean;
  onClick: () => void;
  onPin: () => void;
  onDelete: () => void;
  onExport: () => void;
}

function ConversationItem({ conversation, isActive, onClick, onPin, onDelete, onExport }: ConversationItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(conversation.title);

  const handleSaveTitle = () => {
    // TODO: Update conversation title
    setIsEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveTitle();
    } else if (e.key === 'Escape') {
      setTitle(conversation.title);
      setIsEditing(false);
    }
  };

  return (
    <div
      className={cn(
        "group relative p-3 rounded-lg cursor-pointer transition-colors mb-1",
        isActive
          ? "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
          : "hover:bg-gray-100 dark:hover:bg-gray-700"
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {conversation.isPinned && (
              <Pin className="w-3 h-3 text-blue-500" />
            )}
            {isEditing ? (
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={handleSaveTitle}
                onKeyDown={handleKeyPress}
                className="flex-1 text-sm font-medium bg-transparent border-0 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded px-1"
                autoFocus
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {conversation.title}
              </h3>
            )}
          </div>
          
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <span>{conversation.messages.length} messages</span>
            <span>•</span>
            <span>{formatTimestamp(conversation.updatedAt)}</span>
          </div>
          
          {conversation.tags && conversation.tags.length > 0 && (
            <div className="flex gap-1 mt-2">
              {conversation.tags.slice(0, 2).map((tag: string) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
              {conversation.tags.length > 2 && (
                <span className="text-xs text-gray-500">+{conversation.tags.length - 2}</span>
              )}
            </div>
          )}
        </div>

        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button
              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-opacity"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreVertical className="w-4 h-4 text-gray-500" />
            </button>
          </DropdownMenu.Trigger>
          
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className="min-w-[160px] bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-lg p-1 z-50"
              sideOffset={5}
            >
              <DropdownMenu.Item
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(true);
                }}
              >
                <Edit3 className="w-4 h-4" />
                Rename
              </DropdownMenu.Item>
              
              <DropdownMenu.Item
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  onPin();
                }}
              >
                <Pin className="w-4 h-4" />
                {conversation.isPinned ? 'Unpin' : 'Pin'}
              </DropdownMenu.Item>
              
              <DropdownMenu.Item
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  onExport();
                }}
              >
                <Download className="w-4 h-4" />
                Export
              </DropdownMenu.Item>
              
              <DropdownMenu.Separator className="h-px bg-gray-200 dark:bg-gray-700 my-1" />
              
              <DropdownMenu.Item
                className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm('Are you sure you want to delete this conversation?')) {
                    onDelete();
                  }
                }}
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </div>
  );
}