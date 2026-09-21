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
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { FontFamily } from "@tiptap/extension-font-family";
import { Highlight } from "@tiptap/extension-highlight";
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
  Type,
  Highlighter,
  Palette,
  ChevronDown,
  Plus,
  RotateCcw,
} from "lucide-react";
import { uploadArticleImage } from "@/lib/actions/article";

// Custom Extension for Font Size (e.g. 12px, 14px, 18px, 24px)
const FontSize = Extension.create({
  name: "fontSize",

  addOptions() {
    return {
      types: ["textStyle"],
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element) => element.style.fontSize?.replace(/['"]+/g, "") || null,
            renderHTML: (attributes) => {
              if (!attributes.fontSize) {
                return {};
              }
              return {
                style: `font-size: ${attributes.fontSize}`,
              };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setFontSize:
        (fontSize: string) =>
        ({ chain }: any) => {
          return chain().setMark("textStyle", { fontSize }).run();
        },
      unsetFontSize:
        () =>
        ({ chain }: any) => {
          return chain().setMark("textStyle", { fontSize: null }).removeEmptyTextStyle().run();
        },
    };
  },
});

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

// MS Word Font Presets
const FONT_FAMILIES = [
  { label: "Default (Inter / Sans)", value: "" },
  { label: "Arial (Clean Sans)", value: "Arial, sans-serif" },
  { label: "Georgia (Serif Formal)", value: "Georgia, serif" },
  { label: "Times New Roman (Word Classic)", value: "'Times New Roman', Times, serif" },
  { label: "Courier New (Monospace / Code)", value: "'Courier New', Courier, monospace" },
  { label: "Comic Sans MS (Casual)", value: "'Comic Sans MS', cursive" },
  { label: "Impact (Bold Headline)", value: "Impact, sans-serif" },
  { label: "Trebuchet MS", value: "'Trebuchet MS', sans-serif" },
  { label: "Verdana (Readable)", value: "Verdana, sans-serif" },
];

const FONT_SIZES = [
  { label: "10px", value: "10px" },
  { label: "12px", value: "12px" },
  { label: "14px (Standar)", value: "14px" },
  { label: "16px (Sedang)", value: "16px" },
  { label: "18px (Besar)", value: "18px" },
  { label: "20px (Sangat Besar)", value: "20px" },
  { label: "24px (Judul Kecil)", value: "24px" },
  { label: "28px (Judul)", value: "28px" },
  { label: "32px (Judul Utama)", value: "32px" },
  { label: "36px (Header)", value: "36px" },
  { label: "48px (Raksasa)", value: "48px" },
];

const TEXT_COLORS = [
  { name: "Default Teks", value: "" },
  { name: "Hitam Pekat", value: "#0F172A" },
  { name: "Merah Word", value: "#D32F2F" },
  { name: "Hijau Brazil", value: "#166534" },
  { name: "Kuning Emas", value: "#EAB308" },
  { name: "Biru Royal", value: "#2563EB" },
  { name: "Ungu Violet", value: "#9333EA" },
  { name: "Oranye", value: "#EA580C" },
  { name: "Abu-abu", value: "#64748B" },
  { name: "Putih", value: "#FFFFFF" },
];

const HIGHLIGHT_COLORS = [
  { name: "Tanpa Sorotan", value: "" },
  { name: "Kuning Stabilo", value: "#FEF08A" },
  { name: "Hijau Stabilo", value: "#BBF7D0" },
  { name: "Merah Muda Stabilo", value: "#FECDD3" },
  { name: "Biru Muda Stabilo", value: "#BAE6FD" },
  { name: "Ungu Muda Stabilo", value: "#E9D5FF" },
  { name: "Oranye Stabilo", value: "#FFEDD5" },
];

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
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  const [showFontMenu, setShowFontMenu] = useState(false);
  const [showSizeMenu, setShowSizeMenu] = useState(false);

  const [imageUrlInput, setImageUrlInput] = useState("");
  const [linkUrlInput, setLinkUrlInput] = useState("");
  const [customColor, setCustomColor] = useState("#D32F2F");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      FontFamily,
      FontSize,
      Highlight.configure({
        multicolor: true,
      }),
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
          "prose dark:prose-invert max-w-none min-h-[350px] p-6 sm:p-8 text-base focus:outline-none leading-relaxed text-slate-900 dark:text-slate-100 bg-white dark:bg-[#0B0F17]",
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
      } else if ("error" in res && res.error) {
        setUploadStatus({ type: "error", msg: res.error });
      }
    } catch (err: unknown) {
      setUploadStatus({ type: "error", msg: (err as Error)?.message || "Gagal mengunggah gambar." });
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Font Size Stepper Helpers
  const getCurrentFontSizeNum = (): number => {
    const attrs = editor.getAttributes("textStyle");
    if (attrs.fontSize) {
      const parsed = parseInt(String(attrs.fontSize), 10);
      if (!isNaN(parsed)) return parsed;
    }
    return 16;
  };

  const handleIncreaseFontSize = () => {
    const current = getCurrentFontSizeNum();
    const next = Math.min(72, current + 2);
    (editor.chain().focus() as any).setFontSize(`${next}px`).run();
  };

  const handleDecreaseFontSize = () => {
    const current = getCurrentFontSizeNum();
    const next = Math.max(8, current - 2);
    (editor.chain().focus() as any).setFontSize(`${next}px`).run();
  };

  const wordsCount = editor.getText().trim().split(/\s+/).filter(Boolean).length;
  const charsCount = editor.getText().length;
  const estReadTime = Math.max(1, Math.ceil(wordsCount / 200));

  const activeFontFamily = editor.getAttributes("textStyle").fontFamily || "";
  const activeFontSize = editor.getAttributes("textStyle").fontSize || "";
  const activeTextColor = editor.getAttributes("textStyle").color || "";
  const activeHighlight = editor.getAttributes("highlight").color || "";

  return (
    <div
      className={`w-full border border-slate-300 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm transition-all ${
        isFullscreen
          ? "fixed inset-4 z-50 flex flex-col bg-white dark:bg-[#0E1015] shadow-2xl border-2 border-[#D32F2F]"
          : "bg-white dark:bg-[#0E1015]"
      }`}
    >
      {/* Ribbon Header Toolbar ala Microsoft Word */}
      <div className="bg-slate-100 dark:bg-slate-950/90 border-b border-slate-200 dark:border-slate-800 p-2 select-none">
        
        {/* Row 1: Word Ribbon Tool Controls */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300">
          
          {/* Section 1: Font Family & Font Size Selector (Fitur Word Beneran) */}
          <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 relative">
            
            {/* Font Family Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowFontMenu((prev) => !prev);
                  setShowSizeMenu(false);
                  setShowColorPicker(false);
                  setShowHighlightPicker(false);
                }}
                className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium max-w-[130px] truncate"
                title="Pilih Jenis Font (Font Family)"
              >
                <Type className="w-3.5 h-3.5 text-[#D32F2F] shrink-0" />
                <span className="truncate">
                  {FONT_FAMILIES.find((f) => f.value === activeFontFamily)?.label.split(" ")[0] || "Font"}
                </span>
                <ChevronDown className="w-3 h-3 opacity-60 shrink-0" />
              </button>

              {showFontMenu && (
                <div className="absolute left-0 top-full mt-1.5 z-40 w-52 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl py-1 max-h-60 overflow-y-auto">
                  <div className="px-3 py-1 font-bold text-[10px] text-slate-400 uppercase">Jenis Font Word</div>
                  {FONT_FAMILIES.map((font) => (
                    <button
                      key={font.label}
                      type="button"
                      onClick={() => {
                        if (font.value) {
                          (editor.chain().focus() as any).setFontFamily(font.value).run();
                        } else {
                          (editor.chain().focus() as any).unsetFontFamily().run();
                        }
                        setShowFontMenu(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
                        activeFontFamily === font.value ? "font-bold text-[#D32F2F] bg-red-50 dark:bg-red-950/30" : ""
                      }`}
                      style={{ fontFamily: font.value || "inherit" }}
                    >
                      <span>{font.label}</span>
                      {activeFontFamily === font.value && <Check className="w-3.5 h-3.5 text-[#D32F2F]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="w-[1px] h-4 bg-slate-200 dark:bg-slate-800 my-auto" />

            {/* Font Size Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowSizeMenu((prev) => !prev);
                  setShowFontMenu(false);
                  setShowColorPicker(false);
                  setShowHighlightPicker(false);
                }}
                className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium"
                title="Ukuran Font Teks (Font Size)"
              >
                <span>{activeFontSize || `${getCurrentFontSizeNum()}px`}</span>
                <ChevronDown className="w-3 h-3 opacity-60" />
              </button>

              {showSizeMenu && (
                <div className="absolute left-0 top-full mt-1.5 z-40 w-36 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl py-1 max-h-60 overflow-y-auto">
                  <div className="px-3 py-1 font-bold text-[10px] text-slate-400 uppercase">Ukuran Teks</div>
                  {FONT_SIZES.map((sz) => (
                    <button
                      key={sz.value}
                      type="button"
                      onClick={() => {
                        (editor.chain().focus() as any).setFontSize(sz.value).run();
                        setShowSizeMenu(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
                        activeFontSize === sz.value ? "font-bold text-[#D32F2F] bg-red-50 dark:bg-red-950/30" : ""
                      }`}
                    >
                      <span>{sz.label}</span>
                      {activeFontSize === sz.value && <Check className="w-3.5 h-3.5 text-[#D32F2F]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Font Size Stepper Buttons (A+ / A-) */}
            <button
              type="button"
              onClick={handleIncreaseFontSize}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-[11px] hover:text-[#D32F2F] transition-all"
              title="Perbesar Ukuran Font (A+)"
            >
              A<Plus className="w-2.5 h-2.5 inline -mt-2 -ml-0.5" />
            </button>

            <button
              type="button"
              onClick={handleDecreaseFontSize}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-[11px] hover:text-[#D32F2F] transition-all"
              title="Perkecil Ukuran Font (A-)"
            >
              A<Minus className="w-2.5 h-2.5 inline -mt-2 -ml-0.5" />
            </button>

          </div>

          {/* Section 2: Text Formatting (Bold, Italic, Underline, Strike, Text Color, Highlight) */}
          <div className="flex items-center gap-0.5 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 relative">
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

            <div className="w-[1px] h-4 bg-slate-200 dark:bg-slate-800 my-auto mx-0.5" />

            {/* Text Color Picker */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowColorPicker((prev) => !prev);
                  setShowHighlightPicker(false);
                  setShowFontMenu(false);
                  setShowSizeMenu(false);
                }}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1 transition-all"
                title="Warna Teks (Text Color)"
              >
                <div className="flex flex-col items-center">
                  <Palette className="w-4 h-4 text-slate-700 dark:text-slate-200" />
                  <div
                    className="w-3.5 h-1 rounded-full -mt-0.5 border border-slate-300 dark:border-slate-700"
                    style={{ backgroundColor: activeTextColor || "#D32F2F" }}
                  />
                </div>
                <ChevronDown className="w-2.5 h-2.5 opacity-60" />
              </button>

              {showColorPicker && (
                <div className="absolute left-0 top-full mt-1.5 z-40 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-3">
                  <div className="font-bold text-[10px] text-slate-400 uppercase mb-2">Warna Teks Word</div>
                  <div className="grid grid-cols-5 gap-1.5 mb-3">
                    {TEXT_COLORS.map((clr) => (
                      <button
                        key={clr.name}
                        type="button"
                        onClick={() => {
                          if (clr.value) {
                            (editor.chain().focus() as any).setColor(clr.value).run();
                          } else {
                            (editor.chain().focus() as any).unsetColor().run();
                          }
                          setShowColorPicker(false);
                        }}
                        className="w-7 h-7 rounded-lg border border-slate-300 dark:border-slate-700 flex items-center justify-center transition-transform hover:scale-110"
                        style={{ backgroundColor: clr.value || "#94A3B8" }}
                        title={clr.name}
                      >
                        {activeTextColor === clr.value && <Check className="w-3 h-3 text-white drop-shadow" />}
                      </button>
                    ))}
                  </div>
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-500 font-medium">Custom:</span>
                    <input
                      type="color"
                      value={customColor}
                      onChange={(e) => {
                        setCustomColor(e.target.value);
                        (editor.chain().focus() as any).setColor(e.target.value).run();
                      }}
                      className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Text Highlight / Stabilo Color Picker */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowHighlightPicker((prev) => !prev);
                  setShowColorPicker(false);
                  setShowFontMenu(false);
                  setShowSizeMenu(false);
                }}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1 transition-all"
                title="Warna Sorotan Teks (Highlight Stabilo)"
              >
                <div className="flex flex-col items-center">
                  <Highlighter className="w-4 h-4 text-amber-500" />
                  <div
                    className="w-3.5 h-1 rounded-full -mt-0.5 border border-slate-300 dark:border-slate-700"
                    style={{ backgroundColor: activeHighlight || "#FEF08A" }}
                  />
                </div>
                <ChevronDown className="w-2.5 h-2.5 opacity-60" />
              </button>

              {showHighlightPicker && (
                <div className="absolute left-0 top-full mt-1.5 z-40 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-3">
                  <div className="font-bold text-[10px] text-slate-400 uppercase mb-2">Stabilo / Highlight</div>
                  <div className="grid grid-cols-4 gap-1.5">
                    {HIGHLIGHT_COLORS.map((hl) => (
                      <button
                        key={hl.name}
                        type="button"
                        onClick={() => {
                          if (hl.value) {
                            (editor.chain().focus() as any).setHighlight({ color: hl.value }).run();
                          } else {
                            (editor.chain().focus() as any).unsetHighlight().run();
                          }
                          setShowHighlightPicker(false);
                        }}
                        className="w-8 h-8 rounded-lg border border-slate-300 dark:border-slate-700 flex items-center justify-center transition-transform hover:scale-110"
                        style={{ backgroundColor: hl.value || "#F1F5F9" }}
                        title={hl.name}
                      >
                        {!hl.value ? (
                          <X className="w-3.5 h-3.5 text-slate-400" />
                        ) : (
                          activeHighlight === hl.value && <Check className="w-3.5 h-3.5 text-slate-800" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-all"
              title="Hapus Format Teks & Font (Clear Formatting)"
            >
              <RemoveFormatting className="w-4 h-4" />
            </button>
          </div>

          {/* Section 3: Headings */}
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

          {/* Section 4: Text Alignment */}
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
              title="Rata Kiri Kanan (Justify Word)"
            >
              <AlignJustify className="w-4 h-4" />
            </button>
          </div>

          {/* Section 5: List & Tab Indentation */}
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

          {/* Section 6: Block & Table Elements */}
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

          {/* Section 7: Links & Images */}
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

          {/* Section 8: Undo/Redo & Fullscreen Mode */}
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
      <div className="flex items-center justify-between px-4 py-2 bg-slate-50 dark:bg-slate-950/90 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 font-medium select-none">
        <div className="flex items-center gap-4">
          <span>{wordsCount} Kata</span>
          <span>{charsCount} Karakter</span>
          {activeFontFamily && (
            <span className="hidden md:inline text-slate-400 truncate max-w-[120px]">
              Font: {FONT_FAMILIES.find((f) => f.value === activeFontFamily)?.label.split(" ")[0]}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline text-slate-400">Word-Style Editor Active</span>
          <span>~{estReadTime} mnt baca</span>
        </div>
      </div>
    </div>
  );
}
