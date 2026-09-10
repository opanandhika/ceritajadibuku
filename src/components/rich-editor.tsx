"use client";

import { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import type { JSONContent } from "@tiptap/react";
import { Bold, Italic, List, Quote, Heading2, Pilcrow } from "lucide-react";
import type { Section } from "@/domain/model";

function contentFor(section: Section): JSONContent {
  if (section.richContent) {
    try { return JSON.parse(section.richContent) as JSONContent; } catch { /* Recover using the plain-text projection. */ }
  }
  return { type: "doc", content: section.text.split("\n\n").map((paragraph) => ({ type: "paragraph", content: paragraph ? [{ type: "text", text: paragraph }] : [] })) };
}
export function RichEditor({ section, onChange, readOnly }: { section: Section; onChange: (text: string, json: string) => void; readOnly: boolean }) {
  const editor = useEditor({
    extensions: [StarterKit.configure({ link: false, underline: false, heading: { levels: [2] } })],
    immediatelyRender: false,
    content: contentFor(section),
    editorProps: { attributes: { "aria-label": "Isi naskah", role: "textbox", "aria-multiline": "true", spellcheck: "true" } },
    onUpdate: ({ editor }) => onChange(editor.getText({ blockSeparator: "\n\n" }), JSON.stringify(editor.getJSON())),
  });
  useEffect(() => {
    if (!editor) return;
    editor.setEditable(!readOnly, false);
    if (editor.getText({ blockSeparator: "\n\n" }) !== section.text) editor.commands.setContent(contentFor(section), { emitUpdate: false });
  }, [editor, section, readOnly]);
  if (!editor) return <p className="muted">Menyiapkan ruang menulis…</p>;
  const controls = [
    { label: "Paragraf", icon: Pilcrow, active: editor.isActive("paragraph"), action: () => editor.chain().focus().setParagraph().run() },
    { label: "Judul bagian", icon: Heading2, active: editor.isActive("heading"), action: () => editor.chain().focus().toggleHeading({ level: 2 }).run() },
    { label: "Tebal", icon: Bold, active: editor.isActive("bold"), action: () => editor.chain().focus().toggleBold().run() },
    { label: "Miring", icon: Italic, active: editor.isActive("italic"), action: () => editor.chain().focus().toggleItalic().run() },
    { label: "Kutipan", icon: Quote, active: editor.isActive("blockquote"), action: () => editor.chain().focus().toggleBlockquote().run() },
    { label: "Daftar", icon: List, active: editor.isActive("bulletList"), action: () => editor.chain().focus().toggleBulletList().run() },
  ];
  return <div className="rich-editor">
    {!readOnly && <div className="editor-toolbar" aria-label="Format tulisan">{controls.map(({ label, icon: Icon, active, action }) => <button key={label} type="button" title={label} aria-label={label} aria-pressed={active} onClick={action}><Icon size={18} /></button>)}</div>}
    <EditorContent editor={editor} />
  </div>;
}
