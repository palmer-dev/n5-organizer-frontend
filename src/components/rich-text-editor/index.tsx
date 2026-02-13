"use client";

import {useEditor, EditorContent} from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {cn} from '@/lib/utils';
import {Bold, Italic, List, ListOrdered, Strikethrough} from 'lucide-react';
import {Button} from '@/components/ui/button';

interface RichTextEditorProps {
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
}

export const RichTextEditor = ({
    value = '',
    onChange,
    placeholder = 'Écrivez quelque chose...',
    disabled = false,
    className
}: RichTextEditorProps) => {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [2, 3],
                },
            }),
        ],
        content: value,
        editable: !disabled,
        onUpdate: ({editor}) => {
            const html = editor.getHTML();
            onChange?.(html);
        },
        editorProps: {
            attributes: {
                class: cn(
                    'prose prose-sm max-w-none focus:outline-none min-h-[150px] px-3 py-2 tiptap-editor',
                    disabled && 'opacity-50 cursor-not-allowed'
                ),
            },
        },
    });

    if (!editor) {
        return null;
    }

    return (
        <div className={cn('border rounded-md', className)}>
            <style>{`
                .tiptap-editor ul {
                    list-style-type: disc;
                    padding-left: 1.5rem;
                    margin: 0.5rem 0;
                }
                .tiptap-editor ol {
                    list-style-type: decimal;
                    padding-left: 1.5rem;
                    margin: 0.5rem 0;
                }
                .tiptap-editor li {
                    display: list-item;
                    margin: 0.25rem 0;
                }
                .tiptap-editor p {
                    margin: 0.5rem 0;
                }
                .tiptap-editor strong {
                    font-weight: 600;
                }
                .tiptap-editor em {
                    font-style: italic;
                }
            `}</style>
            {/* Toolbar */}
            {!disabled && (
                <div className="border-b bg-muted/30 p-2 flex flex-wrap gap-1">
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        disabled={!editor.can().chain().focus().toggleBold().run()}
                        data-active={editor.isActive('bold')}
                        className="h-8 w-8 p-0 data-[active=true]:bg-accent"
                    >
                        <Bold className="h-4 w-4"/>
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        disabled={!editor.can().chain().focus().toggleItalic().run()}
                        data-active={editor.isActive('italic')}
                        className="h-8 w-8 p-0 data-[active=true]:bg-accent"
                    >
                        <Italic className="h-4 w-4"/>
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().toggleStrike().run()}
                        disabled={!editor.can().chain().focus().toggleStrike().run()}
                        data-active={editor.isActive('strike')}
                        className="h-8 w-8 p-0 data-[active=true]:bg-accent"
                    >
                        <Strikethrough className="h-4 w-4"/>
                    </Button>
                    <div className="w-px h-8 bg-border"/>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        data-active={editor.isActive('bulletList')}
                        className="h-8 w-8 p-0 data-[active=true]:bg-accent"
                    >
                        <List className="h-4 w-4"/>
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        data-active={editor.isActive('orderedList')}
                        className="h-8 w-8 p-0 data-[active=true]:bg-accent"
                    >
                        <ListOrdered className="h-4 w-4"/>
                    </Button>
                </div>
            )}

            {/* Editor Content */}
            <div className={cn('relative', !disabled && 'min-h-[150px]')}>
                <EditorContent editor={editor} placeholder={placeholder}/>
            </div>
        </div>
    );
};
