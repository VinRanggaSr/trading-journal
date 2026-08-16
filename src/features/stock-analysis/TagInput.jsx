import { useState } from 'react';
import { X } from 'lucide-react';
import { tagColor } from '../../lib/tagColor';

export function TagInput({ id, value, onChange, placeholder }) {
  const [draft, setDraft] = useState('');
  const tags = value
    ? value
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)
    : [];

  function commitDraft() {
    const trimmed = draft.trim();
    if (!trimmed || tags.includes(trimmed)) {
      setDraft('');
      return;
    }
    onChange([...tags, trimmed].join(','));
    setDraft('');
  }

  function removeTag(tag) {
    onChange(tags.filter((t) => t !== tag).join(','));
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      commitDraft();
    } else if (e.key === 'Backspace' && draft === '' && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  }

  return (
    <div className="flex min-h-10 w-full flex-wrap items-center gap-1.5 rounded-xl border border-border bg-bg px-3 py-1.5 focus-within:ring-2 focus-within:ring-ink/20">
      {tags.map((tag) => {
        const color = tagColor(tag);
        return (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-full py-0.5 pl-2 pr-1 text-xs font-medium"
            style={{ backgroundColor: `${color}1A`, color }}
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="rounded-full p-0.5 hover:bg-black/10"
            >
              <X size={11} strokeWidth={2.5} />
            </button>
          </span>
        );
      })}
      <input
        id={id}
        type="text"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={commitDraft}
        placeholder={tags.length === 0 ? placeholder : ''}
        className="min-w-[80px] flex-1 border-none bg-transparent py-1 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:ring-0"
      />
    </div>
  );
}
