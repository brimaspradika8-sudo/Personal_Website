"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import ImageExtension from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableHeader from "@tiptap/extension-table-header";
import TableCell from "@tiptap/extension-table-cell";
import { Extension } from "@tiptap/core";
import { useState, useRef, useEffect } from "react";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Quote,
  Code,
  Undo,
  Redo,
  ImageIcon,
  Upload,
  Link as LinkIcon,
  Unlink,
  X,
  Check,
  Table as TableIcon,
  Minus,
  Maximize2,
  Minimize2,
  Indent as IndentIcon,
  Outdent as OutdentIcon,
  RemoveFormatting,
} from "lucide-react";
import { uploadArticleImage } from "@/lib/actions/article";

// Custom Extension to make Tab & Shift+Tab work like MS Word (Indent / Insert Tab space)
const WordTabExtension = Extension.create({
  name: "wordTab",
  addKeyboardShortcuts() {
    return {
      Tab: () => {
        if (
          this.editor.isActive("bulletList") ||
          this.editor.isActive("orderedList")
        ) {
          return this.editor.commands.sinkListItem("listItem");
        }
        // Insert 4 spaces / tab indentation
        return this.editor.commands.insertContent("    ");
      },
      "Shift-Tab": () => {
        if (
          this.editor.isActive("bulletList") ||
          this.editor.isActive("orderedList")
        ) {
          return this.editor.commands.liftListItem("listItem");
        }
        return true;
      },
    };
  },
});

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({
  content,
  onChange,
}: RichTextEditorProps) {
  const [showImageUrlModal, setShowImageUrlModal] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showTableMenu, setShowTableMenu] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [linkUrlInput, setLinkUrlInput] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      WordTabExtension,
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-[#D32F2F] font-semibold underline underline-offset-2 hover:opacity-80 transition-opacity",
        },
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: "border-collapse table-auto w-full my-4 border border-slate-300 dark:border-slate-800",
        },
      }),
      TableRow,
      TableHeader.configure({
        HTMLAttributes: {
          class: "border border-slate-300 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/60 px-3 py-2 text-left font-bold text-xs",
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: "border border-slate-300 dark:border-slate-800 px-3 py-2 text-xs",
        },
      }),
      ImageExtension.configure({
        allowBase64: true,
        HTMLAttributes: {
          class: "rounded-xl max-w-full my-4 border border-slate-200 dark:border-slate-800 shadow-md",
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
          "prose dark:prose-invert max-w-none min-h-[300px] p-6 text-sm font-sans focus:outline-none leading-relaxed text-slate-900 dark:text-slate-100 bg-white dark:bg-[#0B0F17]",
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
      <div className="w-full h-72 rounded-2xl border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center text-xs text-slate-400 gap-2">
        <div className="w-6 h-6 border-2 border-[#D32F2F] border-t-transparent rounded-full animate-spin" />
        <span>Memuat Rich Text Editor ala Word...</span>
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

  const handleSetLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (linkUrlInput.trim()) {
      editor.chain().focus().setLink({ href: linkUrlInput.trim() }).run();
      setLinkUrlInput("");
      setShowLinkModal(false);
    }
  };

  const handleUnsetLink = () => {
    editor.chain().focus().unsetLink().run();
  };

  // Helper file upload dengan fallback otomatis ke Data URL (Base64) jika Supabase gagal/error
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setUploadStatus(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await uploadArticleImage(formData);

      if ("url" in res && res.url) {
        editor.chain().focus().setImage({ src: res.url }).run();
        setUploadStatus({ type: "success", msg: "Gambar berhasil diunggah ke Supabase Storage!" });
      } else {
        // Fallback: Gunakan FileReader Base64 Data URL jika Supabase error / bucket belum siap
        const reader = new FileReader();
        reader.onload = () => {
          const base64Url = reader.result as string;
          if (base64Url) {
            editor.chain().focus().setImage({ src: base64Url }).run();
            setUploadStatus({ type: "success", msg: "Gambar dimasukkan (menggunakan mode fallback lokal)." });
          }
        };
        reader.readAsDataURL(file);
      }
    } catch {
      // Emergency Base64 Fallback
      const reader = new FileReader();
      reader.onload = () => {
        const base64Url = reader.result as string;
        if (base64Url) {
          editor.chain().focus().setImage({ src: base64Url }).run();
          setUploadStatus({ type: "success", msg: "Gambar berhasil dimasukkan." });
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const wordsCount = editor.getText().trim().split(/\s+/).filter(Boolean).length;
  const charsCount = editor.getText().length;
  const estReadTime = Math.max(1, Math.ceil(wordsCount / 200));

  return (
    <div
      className={`w-full border border-slate-300 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm transition-all ${
        isFullscreen
          ? "fixed inset-4 z-50 flex flex-col bg-white dark:bg-[#0E1015] shadow-2xl border-2 border-[#D32F2F]"
          : "bg-white dark:bg-[#0E1015]"
      }`}
    >
      {/* Ribbon Header Toolbar ala Microsoft Word */}
      <div className="bg-slate-100 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 p-2 font-sans">
        
        {/* Row 1: Word Ribbon Tool Category Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300">
          
          {/* Format Teks */}
          <div className="flex items-center gap-0.5 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`p-1.5 rounded-lg transition-all ${
                editor.isActive("bold")
                  ? "bg-[#D32F2F] text-white font-bold"
                  : "hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
              title="Tebal / Bold (Ctrl+B)"
            >
              <Bold className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`p-1.5 rounded-lg transition-all ${
                editor.isActive("italic")
                  ? "bg-[#D32F2F] text-white"
                  : "hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
              title="Miring / Italic (Ctrl+I)"
            >
              <Italic className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className={`p-1.5 rounded-lg transition-all ${
                editor.isActive("underline")
                  ? "bg-[#D32F2F] text-white"
                  : "hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
              title="Garis Bawah / Underline (Ctrl+U)"
            >
              <UnderlineIcon className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={`p-1.5 rounded-lg transition-all ${
                editor.isActive("strike")
                  ? "bg-[#D32F2F] text-white"
                  : "hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
              title="Coretan / Strikethrough"
            >
              <Strikethrough className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-all"
              title="Hapus Format Teks (Clear Formatting)"
            >
              <RemoveFormatting className="w-4 h-4" />
            </button>
          </div>

          {/* Heading / Style Selector */}
          <div className="flex items-center gap-0.5 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              className={`p-1.5 rounded-lg transition-all ${
                editor.isActive("heading", { level: 1 })
                  ? "bg-[#D32F2F] text-white font-bold"
                  : "hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
              title="Judul Utama / Heading 1 (H1)"
            >
              <Heading1 className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className={`p-1.5 rounded-lg transition-all ${
                editor.isActive("heading", { level: 2 })
                  ? "bg-[#D32F2F] text-white font-bold"
                  : "hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
              title="Subjudul / Heading 2 (H2)"
            >
              <Heading2 className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              className={`p-1.5 rounded-lg transition-all ${
                editor.isActive("heading", { level: 3 })
                  ? "bg-[#D32F2F] text-white font-bold"
                  : "hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
              title="Judul Bagian / Heading 3 (H3)"
            >
              <Heading3 className="w-4 h-4" />
            </button>
          </div>

          {/* Text Alignment */}
          <div className="flex items-center gap-0.5 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => (editor.chain().focus() as any).setTextAlign("left").run()}
              className={`p-1.5 rounded-lg transition-all ${
                editor.isActive({ textAlign: "left" })
                  ? "bg-[#D32F2F] text-white"
                  : "hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
              title="Rata Kiri"
            >
              <AlignLeft className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => (editor.chain().focus() as any).setTextAlign("center").run()}
              className={`p-1.5 rounded-lg transition-all ${
                editor.isActive({ textAlign: "center" })
                  ? "bg-[#D32F2F] text-white"
                  : "hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
              title="Rata Tengah"
            >
              <AlignCenter className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => (editor.chain().focus() as any).setTextAlign("right").run()}
              className={`p-1.5 rounded-lg transition-all ${
                editor.isActive({ textAlign: "right" })
                  ? "bg-[#D32F2F] text-white"
                  : "hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
              title="Rata Kanan"
            >
              <AlignRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => (editor.chain().focus() as any).setTextAlign("justify").run()}
              className={`p-1.5 rounded-lg transition-all ${
                editor.isActive({ textAlign: "justify" })
                  ? "bg-[#D32F2F] text-white"
                  : "hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
              title="Rata Kiri Kanan (Justify)"
            >
              <AlignJustify className="w-4 h-4" />
            </button>
          </div>

          {/* List & Tab Indentation */}
          <div className="flex items-center gap-0.5 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`p-1.5 rounded-lg transition-all ${
                editor.isActive("bulletList")
                  ? "bg-[#D32F2F] text-white"
                  : "hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
              title="Daftar Simbol / Bullet List"
            >
              <List className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={`p-1.5 rounded-lg transition-all ${
                editor.isActive("orderedList")
                  ? "bg-[#D32F2F] text-white"
                  : "hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
              title="Daftar Angka / Numbered List"
            >
              <ListOrdered className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => {
                if (editor.isActive("bulletList") || editor.isActive("orderedList")) {
                  editor.chain().focus().sinkListItem("listItem").run();
                } else {
                  editor.chain().focus().insertContent("    ").run();
                }
              }}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
              title="Tab / Indent Masuk (Tab)"
            >
              <IndentIcon className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => {
                if (editor.isActive("bulletList") || editor.isActive("orderedList")) {
                  editor.chain().focus().liftListItem("listItem").run();
                }
              }}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
              title="Outdent / Geser Kiri (Shift+Tab)"
            >
              <OutdentIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Block & Table Elements */}
          <div className="flex items-center gap-0.5 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={`p-1.5 rounded-lg transition-all ${
                editor.isActive("blockquote")
                  ? "bg-[#D32F2F] text-white"
                  : "hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
              title="Kutipan / Blockquote"
            >
              <Quote className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              className={`p-1.5 rounded-lg transition-all ${
                editor.isActive("codeBlock")
                  ? "bg-[#D32F2F] text-white"
                  : "hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
              title="Blok Kode / Code Block"
            >
              <Code className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
              title="Garis Pembatas (Horizontal Rule)"
            >
              <Minus className="w-4 h-4" />
            </button>

            {/* Table Menu Toggle */}
            <button
              type="button"
              onClick={() => setShowTableMenu((prev) => !prev)}
              className={`p-1.5 rounded-lg transition-all flex items-center gap-1 ${
                editor.isActive("table")
                  ? "bg-[#D32F2F] text-white"
                  : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
              }`}
              title="Menu Tabel Word"
            >
              <TableIcon className="w-4 h-4" />
              <span className="text-[11px] font-bold hidden sm:inline">Tabel</span>
            </button>
          </div>

          {/* Links & Images */}
          <div className="flex items-center gap-0.5 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setShowLinkModal(true)}
              className={`p-1.5 rounded-lg transition-all ${
                editor.isActive("link")
                  ? "bg-[#D32F2F] text-white"
                  : "hover:bg-slate-100 dark:hover:bg-slate-800 text-[#D32F2F]"
              }`}
              title="Sisipkan Tautan (Link)"
            >
              <LinkIcon className="w-4 h-4" />
            </button>

            {editor.isActive("link") && (
              <button
                type="button"
                onClick={handleUnsetLink}
                className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-500 transition-all"
                title="Hapus Tautan"
              >
                <Unlink className="w-4 h-4" />
              </button>
            )}

            <button
              type="button"
              onClick={() => setShowImageUrlModal((prev) => !prev)}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-all"
              title="Gambar dari URL"
            >
              <ImageIcon className="w-4 h-4" />
            </button>

            <label
              className="p-1.5 rounded-lg hover:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 transition-all flex items-center gap-1 cursor-pointer font-bold"
              title="Upload Gambar (Otomatis ke Supabase / Base64 Fallback)"
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
          </div>

          {/* Controls Right: Undo/Redo & Fullscreen */}
          <div className="flex items-center gap-0.5 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 ml-auto">
            <button
              type="button"
              onClick={() => editor.chain().focus().undo().run()}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
              title="Batal / Undo (Ctrl+Z)"
            >
              <Undo className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => editor.chain().focus().redo().run()}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
              title="Ulangi / Redo (Ctrl+Y)"
            >
              <Redo className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setIsFullscreen((prev) => !prev)}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-[#D32F2F] transition-all"
              title={isFullscreen ? "Kecilkan Layar" : "Layar Penuh (Fullscreen Word Mode)"}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>

        </div>

        {/* Table Menu Sub-bar */}
        {showTableMenu && (
          <div className="mt-2 p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex flex-wrap items-center gap-1.5 text-xs">
            <span className="font-bold text-[11px] text-slate-500 uppercase px-2">Menu Tabel:</span>
            <button
              type="button"
              onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
              className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-[#D32F2F] hover:text-white transition-all font-medium"
            >
              Buat Tabel 3x3
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().addRowAfter().run()}
              className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-[#D32F2F] hover:text-white transition-all font-medium"
            >
              + Baris Bawah
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().addColumnAfter().run()}
              className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-[#D32F2F] hover:text-white transition-all font-medium"
            >
              + Kolom Kanan
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().deleteRow().run()}
              className="px-2.5 py-1 rounded-lg bg-red-500/10 hover:bg-red-500 hover:text-white text-red-500 transition-all font-medium"
            >
              Hapus Baris
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().deleteColumn().run()}
              className="px-2.5 py-1 rounded-lg bg-red-500/10 hover:bg-red-500 hover:text-white text-red-500 transition-all font-medium"
            >
              Hapus Kolom
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().deleteTable().run()}
              className="px-2.5 py-1 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition-all"
            >
              Hapus Seluruh Tabel
            </button>
          </div>
        )}

      </div>

      {/* Popover / Form Modal Insert Link */}
      {showLinkModal && (
        <form
          onSubmit={handleSetLink}
          className="p-3 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2"
        >
          <LinkIcon className="w-4 h-4 text-[#D32F2F] shrink-0" />
          <input
            type="url"
            required
            value={linkUrlInput}
            onChange={(e) => setLinkUrlInput(e.target.value)}
            placeholder="Masukkan URL Tautan (https://...)"
            className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#D32F2F]"
          />
          <button
            type="submit"
            className="px-3 py-1.5 rounded-lg bg-[#D32F2F] text-white text-xs font-medium hover:bg-[#B91C1C] flex items-center gap-1 cursor-pointer"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Simpan Link</span>
          </button>
          <button
            type="button"
            onClick={() => setShowLinkModal(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </form>
      )}

      {/* Popover / Form Modal Insert Image URL */}
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
            placeholder="Masukkan Direct URL Gambar (https://...)"
            className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#D32F2F]"
          />
          <button
            type="submit"
            className="px-3 py-1.5 rounded-lg bg-[#D32F2F] text-white text-xs font-medium hover:bg-[#B91C1C] flex items-center gap-1 cursor-pointer"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Sisipkan Gambar</span>
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

      {/* Status Banner (Upload Feedback) */}
      {uploadStatus && (
        <div
          className={`p-2.5 px-4 text-xs font-medium flex items-center justify-between border-b ${
            uploadStatus.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
              : "bg-red-500/10 border-red-500/20 text-red-500"
          }`}
        >
          <span>{uploadStatus.msg}</span>
          <button onClick={() => setUploadStatus(null)} className="hover:opacity-80">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Canvas Editor (Surat / Dokumen Word Canvas) */}
      <div className={`flex-1 overflow-y-auto ${isFullscreen ? "h-full" : ""}`}>
        <EditorContent editor={editor} />
      </div>

      {/* Status Counter Bar Footer ala Word */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-50 dark:bg-slate-950/80 border-t border-slate-200 dark:border-slate-800 text-[11px] font-mono text-slate-500 font-medium">
        <div className="flex items-center gap-4">
          <span>{wordsCount} Kata</span>
          <span>{charsCount} Karakter</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline text-slate-400">Tekan [Tab] untuk Indentasi</span>
          <span>~{estReadTime} mnt baca</span>
        </div>
      </div>
    </div>
  );
}
