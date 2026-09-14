"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import ImageExtension from "@tiptap/extension-image";
import { useState, useRef, useEffect } from "react";
import {
  Bold,
  Italic,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Undo,
  Redo,
  ImageIcon,
  Upload,
  Link as LinkIcon,
  X,
  Check,
} from "lucide-react";
import { uploadArticleImage } from "@/lib/actions/article";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({
  content,
  onChange,
  placeholder = "Tulis konten artikel di sini...",
}: RichTextEditorProps) {
  const [showImageUrlModal, setShowImageUrlModal] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      ImageExtension.configure({
        allowBase64: true,
        HTMLAttributes: {
          class: "rounded-xl max-w-full my-4 border border-slate-200 dark:border-slate-800 shadow-xs",
        },
      }),
    ],
    content: content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },
    editorProps: {
      attributes: {
        class:
          "prose dark:prose-invert max-w-none min-h-[260px] p-4 text-sm font-sans focus:outline-none leading-relaxed text-slate-900 dark:text-slate-100",
      },
    },
  });

  // Sync internal state if initial content changes asynchronously
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) {
    return (
      <div className="w-full h-64 rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-xs text-slate-400">
        Memuat Rich Text Editor...
      </div>
    );
  }

  const handleAddImageUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (imageUrlInput.trim()) {
      editor.chain().focus().setImage({ src: imageUrlInput.trim() }).run();
      setImageUrlInput("");
      setShowImageUrlModal(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append("file", file);

    const res = await uploadArticleImage(formData);

    if (res.error) {
      setUploadError(res.error);
    } else if (res.url) {
      editor.chain().focus().setImage({ src: res.url }).run();
    }

    setUploadingImage(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="w-full border border-slate-300 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900 transition-colors">
      
      {/* Editor Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-slate-100 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-sans text-xs">
        
        {/* Text Styling */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-all ${
            editor.isActive("bold") ? "bg-slate-300 dark:bg-slate-800 text-[#D32F2F] font-bold" : ""
          }`}
          title="Tebal (Bold)"
        >
          <Bold className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-all ${
            editor.isActive("italic") ? "bg-slate-300 dark:bg-slate-800 text-[#D32F2F]" : ""
          }`}
          title="Miring (Italic)"
        >
          <Italic className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-all ${
            editor.isActive("strike") ? "bg-slate-300 dark:bg-slate-800 text-[#D32F2F]" : ""
          }`}
          title="Coret (Strikethrough)"
        >
          <Strikethrough className="w-4 h-4" />
        </button>

        <div className="w-px h-4 bg-slate-300 dark:bg-slate-800 mx-1" />

        {/* Headings */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-all ${
            editor.isActive("heading", { level: 2 }) ? "bg-slate-300 dark:bg-slate-800 text-[#D32F2F]" : ""
          }`}
          title="Judul 2 (H2)"
        >
          <Heading2 className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-all ${
            editor.isActive("heading", { level: 3 }) ? "bg-slate-300 dark:bg-slate-800 text-[#D32F2F]" : ""
          }`}
          title="Subjudul (H3)"
        >
          <Heading3 className="w-4 h-4" />
        </button>

        <div className="w-px h-4 bg-slate-300 dark:bg-slate-800 mx-1" />

        {/* Lists & Quotes */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-all ${
            editor.isActive("bulletList") ? "bg-slate-300 dark:bg-slate-800 text-[#D32F2F]" : ""
          }`}
          title="Daftar Simbol (Bullet List)"
        >
          <List className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-all ${
            editor.isActive("orderedList") ? "bg-slate-300 dark:bg-slate-800 text-[#D32F2F]" : ""
          }`}
          title="Daftar Angka (Ordered List)"
        >
          <ListOrdered className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-all ${
            editor.isActive("blockquote") ? "bg-slate-300 dark:bg-slate-800 text-[#D32F2F]" : ""
          }`}
          title="Kutipan (Blockquote)"
        >
          <Quote className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-all ${
            editor.isActive("codeBlock") ? "bg-slate-300 dark:bg-slate-800 text-[#D32F2F]" : ""
          }`}
          title="Blok Kode (Code Block)"
        >
          <Code className="w-4 h-4" />
        </button>

        <div className="w-px h-4 bg-slate-300 dark:bg-slate-800 mx-1" />

        {/* Subtask 7: Image Embedding (URL & Direct Upload) */}
        <button
          type="button"
          onClick={() => setShowImageUrlModal((prev) => !prev)}
          className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-[#D32F2F] transition-all flex items-center gap-1 cursor-pointer"
          title="Sisipkan Gambar dari URL"
        >
          <LinkIcon className="w-4 h-4" />
          <span className="text-[11px] font-medium hidden sm:inline">URL Gambar</span>
        </button>

        <label
          className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-emerald-600 dark:text-emerald-400 transition-all flex items-center gap-1 cursor-pointer"
          title="Upload Gambar Langsung ke Supabase Storage"
        >
          <Upload className="w-4 h-4" />
          <span className="text-[11px] font-medium hidden sm:inline">
            {uploadingImage ? "Mengunggah..." : "Upload Gambar"}
          </span>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            disabled={uploadingImage}
            className="hidden"
          />
        </label>

        <div className="w-px h-4 bg-slate-300 dark:bg-slate-800 mx-1 ml-auto" />

        {/* Undo / Redo */}
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-all"
          title="Batal (Undo)"
        >
          <Undo className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-all"
          title="Ulangi (Redo)"
        >
          <Redo className="w-4 h-4" />
        </button>
      </div>

      {/* Popover / Form Insert Image URL */}
      {showImageUrlModal && (
        <form
          onSubmit={handleAddImageUrl}
          className="p-3 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2"
        >
          <ImageIcon className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="url"
            required
            value={imageUrlInput}
            onChange={(e) => setImageUrlInput(e.target.value)}
            placeholder="Masukkan URL Gambar (https://...)"
            className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#D32F2F]"
          />
          <button
            type="submit"
            className="px-3 py-1.5 rounded-lg bg-[#D32F2F] text-white text-xs font-medium hover:bg-[#B91C1C] flex items-center gap-1 cursor-pointer"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Sisipkan</span>
          </button>
          <button
            type="button"
            onClick={() => setShowImageUrlModal(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </form>
      )}

      {/* Upload Error Banner */}
      {uploadError && (
        <div className="p-2.5 px-3 bg-red-500/10 border-b border-red-500/20 text-red-500 text-xs font-medium flex items-center justify-between">
          <span>{uploadError}</span>
          <button onClick={() => setUploadError(null)} className="text-red-500 hover:opacity-80">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Canvas Editor */}
      <EditorContent editor={editor} />
    </div>
  );
}
