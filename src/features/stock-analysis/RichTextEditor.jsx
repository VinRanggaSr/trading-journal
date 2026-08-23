import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { TableKit } from '@tiptap/extension-table';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Table as TableIcon,
  Trash2
} from 'lucide-react';
import { cn } from '../../lib/utils';

function ToolbarButton({ active, onClick, children, title }) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={cn(
        'inline-flex h-8 w-8 items-center justify-center rounded-lg text-ink-muted transition-colors hover:bg-bg hover:text-ink',
        active && 'bg-bg text-ink'
      )}
    >
      {children}
    </button>
  );
}

function TableToolbarButton({ onClick, children, title, destructive }) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={cn(
        'inline-flex h-7 items-center gap-1 whitespace-nowrap rounded-md px-2 text-xs font-medium transition-colors',
        destructive ? 'text-red-600 hover:bg-red-50' : 'text-ink-muted hover:bg-white hover:text-ink'
      )}
    >
      {children}
    </button>
  );
}

function ToolbarDivider() {
  return <div className="mx-1 h-5 w-px shrink-0 bg-border" />;
}

export function RichTextEditor({ content, onChange, placeholder, className, tabs }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: placeholder || '' }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Underline,
      TableKit.configure({ table: { resizable: false } })
    ],
    content: content || '',
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: 'tiptap-content min-h-[420px] px-4 py-3 text-sm text-ink focus:outline-none'
      }
    }
  });

  if (!editor) return null;

  const inTable = editor.isActive('table');

  return (
    <div className={cn('rounded-2xl border border-border bg-white shadow-none', className)}>
      <div className="sticky top-0 z-10 rounded-t-2xl bg-white">
      {tabs && <div className="p-2 pb-0">{tabs}</div>}
      <div className="flex flex-wrap items-center gap-1 border-b border-border px-2 py-1.5">
        <ToolbarButton
          title="Bold"
          active={editor.isActive('bold')}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold size={15} />
        </ToolbarButton>
        <ToolbarButton
          title="Italic"
          active={editor.isActive('italic')}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic size={15} />
        </ToolbarButton>
        <ToolbarButton
          title="Underline"
          active={editor.isActive('underline')}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <UnderlineIcon size={15} />
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton
          title="Heading 1"
          active={editor.isActive('heading', { level: 1 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        >
          <Heading1 size={15} />
        </ToolbarButton>
        <ToolbarButton
          title="Heading 2"
          active={editor.isActive('heading', { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          <Heading2 size={15} />
        </ToolbarButton>
        <ToolbarButton
          title="Heading 3"
          active={editor.isActive('heading', { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          <Heading3 size={15} />
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton
          title="Bullet List"
          active={editor.isActive('bulletList')}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List size={15} />
        </ToolbarButton>
        <ToolbarButton
          title="Numbered List"
          active={editor.isActive('orderedList')}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered size={15} />
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton
          title="Align Left"
          active={editor.isActive({ textAlign: 'left' })}
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
        >
          <AlignLeft size={15} />
        </ToolbarButton>
        <ToolbarButton
          title="Align Center"
          active={editor.isActive({ textAlign: 'center' })}
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
        >
          <AlignCenter size={15} />
        </ToolbarButton>
        <ToolbarButton
          title="Align Right"
          active={editor.isActive({ textAlign: 'right' })}
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
        >
          <AlignRight size={15} />
        </ToolbarButton>
        <ToolbarButton
          title="Justify"
          active={editor.isActive({ textAlign: 'justify' })}
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
        >
          <AlignJustify size={15} />
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton
          title="Sisipkan Tabel"
          active={inTable}
          onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
        >
          <TableIcon size={15} />
        </ToolbarButton>
      </div>

      {inTable && (
        <div className="flex flex-wrap items-center gap-1 border-b border-border bg-bg px-2 py-1.5">
          <span className="label-caps pr-1">Tabel</span>
          <TableToolbarButton title="Tambah baris di bawah" onClick={() => editor.chain().focus().addRowAfter().run()}>
            + Baris
          </TableToolbarButton>
          <TableToolbarButton title="Hapus baris ini" onClick={() => editor.chain().focus().deleteRow().run()}>
            - Baris
          </TableToolbarButton>

          <ToolbarDivider />

          <TableToolbarButton
            title="Tambah kolom di kanan"
            onClick={() => editor.chain().focus().addColumnAfter().run()}
          >
            + Kolom
          </TableToolbarButton>
          <TableToolbarButton title="Hapus kolom ini" onClick={() => editor.chain().focus().deleteColumn().run()}>
            - Kolom
          </TableToolbarButton>

          <ToolbarDivider />

          <TableToolbarButton
            title="Hapus seluruh tabel"
            destructive
            onClick={() => editor.chain().focus().deleteTable().run()}
          >
            <Trash2 size={13} />
            Hapus Tabel
          </TableToolbarButton>
        </div>
      )}
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}
