import React, { useRef, useEffect, useState } from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough, 
  Heading2, 
  Heading3, 
  List, 
  ListOrdered, 
  Quote, 
  Link2, 
  RotateCcw,
  Eraser
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
  className?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = 'Write a detailed summary about this article...',
  minHeight = '140px',
  className = ''
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  // Sync value into contentEditable when value changes externally
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      if (!isFocused || !editorRef.current.innerHTML) {
        editorRef.current.innerHTML = value || '';
      }
    }
  }, [value, isFocused]);

  const handleInput = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      // If content is just empty tags or break, consider it empty string
      if (html === '<br>' || html === '<p><br></p>' || html.trim() === '') {
        onChange('');
      } else {
        onChange(html);
      }
    }
  };

  const executeCommand = (command: string, arg: string | undefined = undefined) => {
    if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand(command, false, arg);
      handleInput();
    }
  };

  const handleAddLink = () => {
    const url = prompt('Enter URL (e.g. https://example.com):');
    if (url) {
      executeCommand('createLink', url);
    }
  };

  const isEmpty = !value || value === '<br>' || value === '<p><br></p>';

  return (
    <div 
      className={`bg-slate-50 border border-slate-200/80 rounded-xl overflow-hidden transition-all ${
        isFocused ? 'ring-2 ring-brand/20 border-brand/50' : 'hover:border-slate-300'
      } ${className}`}
    >
      {/* Formatting Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-slate-100/80 border-b border-slate-200/80 text-slate-600">
        <button
          type="button"
          onClick={() => executeCommand('bold')}
          className="p-1.5 rounded-lg hover:bg-white hover:text-slate-900 transition-colors"
          title="Bold (Ctrl+B)"
          aria-label="Bold"
        >
          <Bold className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => executeCommand('italic')}
          className="p-1.5 rounded-lg hover:bg-white hover:text-slate-900 transition-colors"
          title="Italic (Ctrl+I)"
          aria-label="Italic"
        >
          <Italic className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => executeCommand('underline')}
          className="p-1.5 rounded-lg hover:bg-white hover:text-slate-900 transition-colors"
          title="Underline (Ctrl+U)"
          aria-label="Underline"
        >
          <Underline className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => executeCommand('strikeThrough')}
          className="p-1.5 rounded-lg hover:bg-white hover:text-slate-900 transition-colors"
          title="Strikethrough"
          aria-label="Strikethrough"
        >
          <Strikethrough className="w-4 h-4" />
        </button>

        <span className="w-px h-4 bg-slate-300 mx-1" aria-hidden="true" />

        <button
          type="button"
          onClick={() => executeCommand('formatBlock', '<h2>')}
          className="p-1.5 rounded-lg hover:bg-white hover:text-slate-900 transition-colors font-bold text-xs"
          title="Heading 2"
          aria-label="Heading 2"
        >
          <Heading2 className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => executeCommand('formatBlock', '<h3>')}
          className="p-1.5 rounded-lg hover:bg-white hover:text-slate-900 transition-colors font-bold text-xs"
          title="Heading 3"
          aria-label="Heading 3"
        >
          <Heading3 className="w-4 h-4" />
        </button>

        <span className="w-px h-4 bg-slate-300 mx-1" aria-hidden="true" />

        <button
          type="button"
          onClick={() => executeCommand('insertUnorderedList')}
          className="p-1.5 rounded-lg hover:bg-white hover:text-slate-900 transition-colors"
          title="Bullet List"
          aria-label="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => executeCommand('insertOrderedList')}
          className="p-1.5 rounded-lg hover:bg-white hover:text-slate-900 transition-colors"
          title="Numbered List"
          aria-label="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => executeCommand('formatBlock', '<blockquote>')}
          className="p-1.5 rounded-lg hover:bg-white hover:text-slate-900 transition-colors"
          title="Quote"
          aria-label="Quote"
        >
          <Quote className="w-4 h-4" />
        </button>

        <span className="w-px h-4 bg-slate-300 mx-1" aria-hidden="true" />

        <button
          type="button"
          onClick={handleAddLink}
          className="p-1.5 rounded-lg hover:bg-white hover:text-slate-900 transition-colors"
          title="Insert Link"
          aria-label="Insert Link"
        >
          <Link2 className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => executeCommand('removeFormat')}
          className="p-1.5 rounded-lg hover:bg-white hover:text-slate-900 transition-colors"
          title="Clear Formatting"
          aria-label="Clear Formatting"
        >
          <Eraser className="w-4 h-4" />
        </button>
      </div>

      {/* Content Editable Area */}
      <div className="relative">
        {isEmpty && !isFocused && (
          <div 
            onClick={() => editorRef.current?.focus()}
            className="absolute top-4 left-5 text-sm text-slate-400 select-none pointer-events-none font-medium"
          >
            {placeholder}
          </div>
        )}
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setIsFocused(false);
            handleInput();
          }}
          style={{ minHeight }}
          className="p-4 sm:p-5 outline-none font-medium text-slate-700 text-sm leading-relaxed prose prose-sm max-w-none focus:outline-none"
        />
      </div>
    </div>
  );
}
