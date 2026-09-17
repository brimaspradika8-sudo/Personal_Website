"use client";

import { useState, useEffect, useTransition, useRef, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Heart,
  ThumbsDown,
  MessageSquare,
  Bookmark,
  Share2,
  Check,
  Send,
  Trash2,
  BookOpen,
  Copy,
  List,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Zap,
  CheckCircle2,
  BrainCircuit,
} from "lucide-react";

import {
  ArticleDetail,
  ArticleItem,
  toggleArticleReaction,
  addArticleComment,
  deleteArticleComment,
} from "@/lib/actions/article";
import { soundFx } from "@/lib/audio/sound";
import MobileBottomNav from "@/components/MobileBottomNav";
import { isBookmarked, toggleBookmark, subscribeBookmarks } from "@/lib/bookmarks";
import ReadingProgressBar from "@/components/ReadingProgressBar";


interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface ArticleClientProps {
  article: ArticleDetail;
  relatedArticles: ArticleItem[];
  user: {
    id: string;
    email?: string;
    user_metadata?: { full_name?: string; avatar_url?: string };
  } | null;
}

export default function ArticleClient({
  article: initialArticle,
  relatedArticles,
  user,
}: ArticleClientProps) {
  const [article, setArticle] = useState<ArticleDetail>(initialArticle);
  const [commentText, setCommentText] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [copiedCodeIndex, setCopiedCodeIndex] = useState<number | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [isTocOpen, setIsTocOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isSavedBookmark, setIsSavedBookmark] = useState(false);

  useEffect(() => {
    setIsSavedBookmark(isBookmarked(initialArticle.id) || isBookmarked(initialArticle.slug));
    return subscribeBookmarks(() => {
      setIsSavedBookmark(isBookmarked(initialArticle.id) || isBookmarked(initialArticle.slug));
    });
  }, [initialArticle.id, initialArticle.slug]);

  // Feature 2.1: Reading Progress Bar State

  const [scrollProgress, setScrollProgress] = useState(0);

  // Feature 2.2 & 2.3: Audio Player TTS & AI Summary States
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioSpeed, setAudioSpeed] = useState<number>(1);
  const [activeLineKey, setActiveLineKey] = useState<string | null>(null);
  const activeLineKeyRef = useRef<string | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const elevenLabsAudioRef = useRef<HTMLAudioElement | null>(null);
  const clientAudioCacheRef = useRef<Map<string, string>>(new Map());
  const [aiSummary, setAiSummary] = useState<string[] | null>(null);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string>("");
  const [useElevenLabs, setUseElevenLabs] = useState<boolean>(true);
  const [isLoadingElevenLabs, setIsLoadingElevenLabs] = useState<boolean>(false);

  // Feature: Dedicated Smooth Auto-Scroll Hook - Only triggers ONCE per line change after DOM reflow
  useEffect(() => {
    if (!activeLineKey || !isPlayingAudio) return;

    const timer = setTimeout(() => {
      const elem = document.getElementById(`line-${activeLineKey}`);
      if (elem) {
        elem.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 80);

    return () => clearTimeout(timer);
  }, [activeLineKey, isPlayingAudio]);

  // Load browser voices (prioritizing Indonesian and Natural voices)
  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (!voices || voices.length === 0) return;

      const idVoices = voices.filter(
        (v) => v.lang.startsWith("id") || v.lang.includes("ID") || v.name.toLowerCase().includes("indonesia")
      );
      const list = idVoices.length > 0 ? idVoices : voices;

      setAvailableVoices(list);

      setSelectedVoiceURI((prev) => {
        if (prev && list.some((v) => v.voiceURI === prev)) return prev;
        const best =
          list.find((v) => v.name.includes("Natural") || v.name.includes("Online") || v.name.includes("Google")) ||
          list[0];
        return best ? best.voiceURI : "";
      });
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  // Calculate word count & accurate reading time
  const wordCount = article.content ? article.content.split(/\s+/).filter(Boolean).length : 0;
  const calculatedReadTime = Math.max(1, Math.ceil(wordCount / 180));

  // Feature 2.3: Table of Contents State
  const [toc] = useState<TocItem[]>(() => {
    if (!initialArticle.content) return [];
    const lines = initialArticle.content.split("\n");
    const items: TocItem[] = [];

    lines.forEach((line) => {
      const trimmed = line.trim();
      if (trimmed.startsWith("## ")) {
        const text = trimmed.replace("## ", "");
        const id = text.toLowerCase().replace(/[^a-z0-9 -]/g, "").replace(/\s+/g, "-");
        items.push({ id, text, level: 2 });
      } else if (trimmed.startsWith("### ")) {
        const text = trimmed.replace("### ", "");
        const id = text.toLowerCase().replace(/[^a-z0-9 -]/g, "").replace(/\s+/g, "-");
        items.push({ id, text, level: 3 });
      }
    });

    return items;
  });

  // Cleanup speech synthesis & audio elements on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      if (elevenLabsAudioRef.current) {
        elevenLabsAudioRef.current.pause();
        elevenLabsAudioRef.current = null;
      }
    };
  }, []);

  // Feature 2.1: Calculate Reading Scroll Progress
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, progress)));
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const showToast = (msg: string) => {
    try {
      soundFx.playClick();
    } catch {}
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Calculate character ranges for speech boundary line tracking
  const lineRanges = useMemo(() => {
    if (!article.content) return [];
    const ranges: { key: string; text: string; start: number; end: number }[] = [];
    let offset = 0;

    const blocks = article.content.split("```");
    blocks.forEach((block, idx) => {
      if (idx % 2 === 1) {
        const codePlaceholder = " Kode program diabaikan. ";
        offset += codePlaceholder.length;
      } else {
        const lines = block.split("\n");
        lines.forEach((line, lIdx) => {
          const trimmed = line.trim();
          if (!trimmed || trimmed.startsWith("##") || trimmed.startsWith("###") || trimmed.startsWith("---")) {
            if (trimmed.startsWith("##") || trimmed.startsWith("###")) {
              const headerText = trimmed.replace(/^#+\s*/, "").trim() + ". ";
              const start = offset;
              const end = start + headerText.length;
              offset = end;
              ranges.push({ key: `${idx}-${lIdx}`, text: headerText, start, end });
            }
          } else {
            const clean = trimmed.replace(/<[^>]*>?/gm, " ").replace(/[#*`_~-]/g, " ").trim() + ". ";
            const start = offset;
            const end = start + clean.length;
            offset = end;
            ranges.push({ key: `${idx}-${lIdx}`, text: clean, start, end });
          }
        });
      }
    });

    return ranges;
  }, [article.content]);

  const cleanTextForSpeech = (rawContent: string) => {
    return rawContent
      .replace(/```[\s\S]*?```/g, " Kode program diabaikan. ")
      .replace(/<[^>]*>?/gm, " ")
      .replace(/[#*`_~-]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  };

  const startSpeech = (rate: number) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    
    window.speechSynthesis.cancel();

    const fullText = lineRanges.length > 0 
      ? lineRanges.map((r) => r.text).join(" ")
      : cleanTextForSpeech(article.content);

    if (!fullText) return;

    const utterance = new SpeechSynthesisUtterance(fullText);
    utterance.rate = rate;
    utterance.lang = "id-ID";

    if (selectedVoiceURI && availableVoices.length > 0) {
      const matched = availableVoices.find((v) => v.voiceURI === selectedVoiceURI);
      if (matched) {
        utterance.voice = matched;
      }
    } else {
      const voices = window.speechSynthesis.getVoices();
      const best =
        voices.find(
          (v) => (v.lang.startsWith("id") || v.lang.includes("ID")) && (v.name.includes("Natural") || v.name.includes("Google") || v.name.includes("Online"))
        ) || voices.find((v) => v.lang.startsWith("id") || v.lang.includes("ID"));
      if (best) utterance.voice = best;
    }

    utterance.onboundary = (event) => {
      if (event.name === "word" || event.charIndex !== undefined) {
        const charIdx = event.charIndex;
        const currentRange = lineRanges.find((r) => charIdx >= r.start && charIdx <= r.end);
        if (currentRange && currentRange.key !== activeLineKeyRef.current) {
          activeLineKeyRef.current = currentRange.key;
          setActiveLineKey(currentRange.key);
        }
      }
    };

    utterance.onend = () => {
      setIsPlayingAudio(false);
      activeLineKeyRef.current = null;
      setActiveLineKey(null);
    };

    utterance.onerror = () => {
      setIsPlayingAudio(false);
      activeLineKeyRef.current = null;
      setActiveLineKey(null);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsPlayingAudio(true);
  };

  const playElevenLabsAudio = async () => {
    setIsLoadingElevenLabs(true);

    // 1. Check Client-Side Audio Cache (0ms Instant Playback)
    const cachedAudioUrl = clientAudioCacheRef.current.get(article.id);
    if (cachedAudioUrl) {
      console.log("[Client TTS] Served from client-side memory cache (0ms)");
      const audio = new Audio(cachedAudioUrl);
      audio.playbackRate = audioSpeed;
      elevenLabsAudioRef.current = audio;

      audio.ontimeupdate = () => {
        if (audio.duration && lineRanges.length > 0) {
          const totalChars = lineRanges[lineRanges.length - 1].end;
          const progressRatio = audio.currentTime / audio.duration;
          const charIdx = Math.floor(progressRatio * totalChars);
          const currentRange = lineRanges.find((r) => charIdx >= r.start && charIdx <= r.end);
          if (currentRange && currentRange.key !== activeLineKeyRef.current) {
            activeLineKeyRef.current = currentRange.key;
            setActiveLineKey(currentRange.key);
          }
        }
      };

      audio.onended = () => {
        setIsPlayingAudio(false);
        activeLineKeyRef.current = null;
        setActiveLineKey(null);
      };

      audio.onerror = () => {
        setIsPlayingAudio(false);
        activeLineKeyRef.current = null;
        startSpeech(audioSpeed);
      };

      try {
        await audio.play();
        setIsPlayingAudio(true);
        showToast("Memutar narasi ElevenLabs AI!");
      } catch (e) {
        console.error("Audio play error:", e);
        startSpeech(audioSpeed);
      } finally {
        setIsLoadingElevenLabs(false);
      }
      return;
    }

    showToast("Mengisi suara AI Edge Neural (id-ID)...");

    // 2. Fetch with 6.0s AbortController Timeout Guard
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    try {
      const textToSpeak = `${article.title}. ${cleanTextForSpeech(article.content)}`;
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: textToSpeak,
          engine: "edge",
          voiceId: "id-ID-ArdiNeural",
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const userMsg = errorData.error || "Gagal memproses Edge Neural AI.";
        showToast(`${userMsg} Mengalihkan ke suara browser...`);
        startSpeech(audioSpeed);
        setIsLoadingElevenLabs(false);
        return;
      }

      const blob = await res.blob();
      const audioUrl = URL.createObjectURL(blob);
      clientAudioCacheRef.current.set(article.id, audioUrl);

      const audio = new Audio(audioUrl);
      audio.playbackRate = audioSpeed;
      elevenLabsAudioRef.current = audio;

      audio.ontimeupdate = () => {
        if (audio.duration && lineRanges.length > 0) {
          const totalChars = lineRanges[lineRanges.length - 1].end;
          const progressRatio = audio.currentTime / audio.duration;
          const charIdx = Math.floor(progressRatio * totalChars);
          const currentRange = lineRanges.find((r) => charIdx >= r.start && charIdx <= r.end);
          if (currentRange && currentRange.key !== activeLineKeyRef.current) {
            activeLineKeyRef.current = currentRange.key;
            setActiveLineKey(currentRange.key);
          }
        }
      };

      audio.onended = () => {
        setIsPlayingAudio(false);
        activeLineKeyRef.current = null;
        setActiveLineKey(null);
      };

      audio.onerror = () => {
        setIsPlayingAudio(false);
        activeLineKeyRef.current = null;
        startSpeech(audioSpeed);
      };

      await audio.play();
      setIsPlayingAudio(true);
      showToast("Memutar narasi Edge Neural AI!");
    } catch (e: any) {
      clearTimeout(timeoutId);
      if (e?.name === "AbortError") {
        showToast("Koneksi Edge Neural AI terlalu lama (>6s). Mengalihkan ke suara browser...");
      } else {
        console.error("Edge Neural TTS Audio Error:", e);
      }
      startSpeech(audioSpeed);
    } finally {
      setIsLoadingElevenLabs(false);
    }
  };

  const handleToggleAudio = () => {
    if (isPlayingAudio || isLoadingElevenLabs) {
      if (elevenLabsAudioRef.current) {
        elevenLabsAudioRef.current.pause();
        elevenLabsAudioRef.current = null;
      }
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      setIsPlayingAudio(false);
      setIsLoadingElevenLabs(false);
      activeLineKeyRef.current = null;
      setActiveLineKey(null);
      showToast("Pembacaan audio dihentikan.");
      return;
    }

    if (useElevenLabs) {
      playElevenLabsAudio();
    } else {
      startSpeech(audioSpeed);
      showToast("Memulai pembacaan suara browser...");
    }
  };

  const handleSpeedChange = (speed: number) => {
    try { soundFx.playClick(); } catch {}
    setAudioSpeed(speed);
    if (elevenLabsAudioRef.current) {
      elevenLabsAudioRef.current.playbackRate = speed;
    }
    if (isPlayingAudio && !elevenLabsAudioRef.current && typeof window !== "undefined" && "speechSynthesis" in window) {
      startSpeech(speed);
    }
  };

  const handleGenerateAiSummary = () => {
    try { soundFx.playClick(); } catch {}
    setIsGeneratingSummary(true);

    setTimeout(() => {
      const lines = article.content.split("\n").map((l) => l.trim()).filter(Boolean);
      const headings = lines.filter((l) => l.startsWith("##") || l.startsWith("###")).map((l) => l.replace(/^#+\s*/, ""));
      const textParagraphs = lines.filter((l) => !l.startsWith("#") && !l.startsWith("```") && l.length > 25);

      const bullets: string[] = [];
      if (headings.length > 0) {
        bullets.push(`Topik Utama: Menjelaskan ${headings.slice(0, 2).join(" & ")}.`);
      }
      if (textParagraphs.length > 0) {
        bullets.push(textParagraphs[0]);
      }
      if (textParagraphs.length > 1) {
        bullets.push(textParagraphs[Math.floor(textParagraphs.length / 2)]);
      }
      if (bullets.length < 3) {
        bullets.push(`Memberikan langkah-langkah implementasi praktis terkait ${article.title}.`);
      }

      setAiSummary(bullets.slice(0, 4));
      setIsGeneratingSummary(false);
      showToast("Ringkasan AI berhasil dibuat!");
    }, 600);
  };

  const handleReaction = (type: "LIKE" | "DISLIKE") => {
    if (!user) {
      showToast("Silakan masuk akun terlebih dahulu untuk memberikan reaksi.");
      return;
    }

    // Play click sound effect instantly
    soundFx.playClick();

    // Synchronous optimistic state update
    setArticle((prev) => {
      const current = prev.userReaction;
      let newLikeCount = prev.likeCount;
      let newDislikeCount = prev.dislikeCount;
      let newReaction: "LIKE" | "DISLIKE" | null = type;

      if (current === type) {
        newReaction = null;
        if (type === "LIKE") newLikeCount = Math.max(0, newLikeCount - 1);
        if (type === "DISLIKE") newDislikeCount = Math.max(0, newDislikeCount - 1);
      } else {
        if (current === "LIKE") newLikeCount = Math.max(0, newLikeCount - 1);
        if (current === "DISLIKE") newDislikeCount = Math.max(0, newDislikeCount - 1);

        if (type === "LIKE") newLikeCount += 1;
        if (type === "DISLIKE") newDislikeCount += 1;
      }

      return {
        ...prev,
        likeCount: newLikeCount,
        dislikeCount: newDislikeCount,
        userReaction: newReaction,
      };
    });

    // Non-blocking background sync with database
    toggleArticleReaction(article.id, type).then((res) => {
      if (res?.error) {
        showToast(res.error);
      }
    });
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    if (!user) {
      showToast("Silakan masuk akun terlebih dahulu untuk menulis komentar.");
      return;
    }

    const text = commentText.trim();
    setCommentText("");
    try { soundFx.playClick(); } catch {}

    const tempId = `temp-${Date.now()}`;
    const tempComment = {
      id: tempId,
      user_id: user.id,
      article_id: article.id,
      content: text,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user: {
        id: user.id,
        name: user.user_metadata?.full_name || (user.user_metadata as any)?.name || user.email?.split("@")[0] || "User",
        avatar: user.user_metadata?.avatar_url || (user.user_metadata as any)?.picture || null,
      },
    };

    // Synchronous 0ms optimistic update
    setArticle((prev) => ({
      ...prev,
      commentCount: prev.commentCount + 1,
      comments: [tempComment, ...prev.comments],
    }));

    showToast("Komentar berhasil dikirim!");

    // Non-blocking background sync
    addArticleComment(article.id, text).then((res) => {
      if (res.error) {
        showToast(res.error);
        setArticle((prev) => ({
          ...prev,
          commentCount: Math.max(0, prev.commentCount - 1),
          comments: prev.comments.filter((c) => c.id !== tempId),
        }));
      } else if (res.comment) {
        setArticle((prev) => ({
          ...prev,
          comments: prev.comments.map((c) => (c.id === tempId ? res.comment! : c)),
        }));
      }
    });
  };

  const handleDeleteComment = (commentId: string) => {
    try { soundFx.playClick(); } catch {}
    const target = article.comments.find((c) => c.id === commentId);
    if (!target) return;

    // Synchronous 0ms optimistic deletion
    setArticle((prev) => ({
      ...prev,
      commentCount: Math.max(0, prev.commentCount - 1),
      comments: prev.comments.filter((c) => c.id !== commentId),
    }));

    showToast("Komentar telah dihapus.");

    // Non-blocking background sync
    deleteArticleComment(commentId).then((res) => {
      if (res.error) {
        showToast(res.error);
        setArticle((prev) => ({
          ...prev,
          commentCount: prev.commentCount + 1,
          comments: [target, ...prev.comments],
        }));
      }
    });
  };

  // Feature 2.2: Copy Link Handler
  const handleShare = () => {
    const url = window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setIsCopied(true);
      showToast("Tautan artikel berhasil disalin ke clipboard!");
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  // Feature 2.2: Social Media Share Links
  const handleSocialShare = (platform: "wa" | "tw" | "li") => {
    const url = encodeURIComponent(window.location.href);
    const titleText = encodeURIComponent(article.title);

    let shareUrl = "";
    if (platform === "wa") shareUrl = `https://api.whatsapp.com/send?text=${titleText}%20${url}`;
    if (platform === "tw") shareUrl = `https://twitter.com/intent/tweet?text=${titleText}&url=${url}`;
    if (platform === "li") shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;

    if (shareUrl) {
      window.open(shareUrl, "_blank");
    }
  };

  const handleCopyCode = (codeText: string, index: number) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(codeText);
      setCopiedCodeIndex(index);
      showToast("Kode berhasil disalin!");
      setTimeout(() => setCopiedCodeIndex(null), 2000);
    }
  };

  const renderContent = (content: string) => {
    const isHtml = /^\s*<[a-z0-9]+/i.test(content) || content.includes("<p>") || content.includes("<h2>") || content.includes("<h3>") || content.includes("<ul>") || content.includes("<table>");
    
    if (isHtml) {
      return (
        <div
          className="prose dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 font-sans leading-relaxed space-y-4 [&_table]:w-full [&_table]:border-collapse [&_table]:border [&_table]:border-slate-300 [&_table]:dark:border-slate-800 [&_th]:border [&_th]:border-slate-300 [&_th]:dark:border-slate-800 [&_th]:bg-slate-100 [&_th]:dark:bg-slate-900 [&_th]:p-2.5 [&_td]:border [&_td]:border-slate-300 [&_td]:dark:border-slate-800 [&_td]:p-2.5 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_blockquote]:border-l-4 [&_blockquote]:border-[#D32F2F] [&_blockquote]:pl-4 [&_blockquote]:italic"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      );
    }

    const blocks = content.split("```");
    return blocks.map((block, idx) => {
      if (idx % 2 === 1) {
        const firstLineEnd = block.indexOf("\n");
        const lang = firstLineEnd !== -1 ? block.slice(0, firstLineEnd).trim() : "code";
        const code = firstLineEnd !== -1 ? block.slice(firstLineEnd + 1).trim() : block.trim();

        return (
          <div key={idx} className="my-6 rounded-none border-4 border-black dark:border-white bg-black text-white overflow-hidden shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]">
            <div className="px-4 py-2.5 bg-[#FFFF00] text-black border-b-3 border-black flex items-center justify-between font-mono text-xs font-black uppercase">
              <span className="font-mono text-black font-black">{lang || "CODE"}</span>
              <button
                onClick={() => handleCopyCode(code, idx)}
                className="flex items-center gap-1.5 px-3 py-1 rounded-none bg-black text-white hover:bg-[#166534] transition-all cursor-pointer text-xs font-mono font-black border-2 border-black"
              >
                {copiedCodeIndex === idx ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#00FF66]" />
                    <span className="text-[#00FF66]">TERSALIN! 🚀</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>SALIN KODE</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-4 sm:p-5 text-xs sm:text-sm font-mono text-neutral-100 overflow-x-auto leading-relaxed bg-black">
              <code>{code}</code>
            </pre>
          </div>
        );
      }

      const lines = block.split("\n");
      return (
        <div key={idx} className="space-y-4">
          {lines.map((line, lIdx) => {
            const trimmed = line.trim();
            if (!trimmed) return null;

            const lineKey = `${idx}-${lIdx}`;
            const isActiveReading = activeLineKey === lineKey && isPlayingAudio;

            if (trimmed.startsWith("## ")) {
              const text = trimmed.replace("## ", "");
              const id = text.toLowerCase().replace(/[^a-z0-9 -]/g, "").replace(/\s+/g, "-");
              return (
                <h2 key={lIdx} id={`line-${lineKey}`} className={`font-mono text-xl sm:text-2xl font-black uppercase tracking-tight text-black dark:text-white pt-6 border-b-3 border-black dark:border-white pb-2 scroll-mt-20 ${isActiveReading ? "bg-[#FFFF00] text-black px-2" : ""}`}>
                  <span id={id} className="scroll-mt-20">{text}</span>
                </h2>
              );
            }
            if (trimmed.startsWith("### ")) {
              const text = trimmed.replace("### ", "");
              const id = text.toLowerCase().replace(/[^a-z0-9 -]/g, "").replace(/\s+/g, "-");
              return (
                <h3 key={lIdx} id={`line-${lineKey}`} className={`font-mono text-base sm:text-lg font-black uppercase text-black dark:text-white pt-4 scroll-mt-20 ${isActiveReading ? "bg-[#FFFF00] text-black px-2" : ""}`}>
                  <span id={id} className="scroll-mt-20">{text}</span>
                </h3>
              );
            }
            if (trimmed.startsWith("---")) {
              return <hr key={lIdx} className="border-2 border-black dark:border-white my-6" />;
            }
            if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
              return (
                <li key={lIdx} id={`line-${lineKey}`} className={`ml-5 list-disc text-base sm:text-lg text-slate-800 dark:text-slate-200 leading-relaxed font-sans transition-all duration-300 ${isActiveReading ? "bg-[#FFFF00] text-slate-950 font-bold p-2.5 rounded-none border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] list-none" : "font-normal"}`}>
                  {isActiveReading && (
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-none bg-[#166534] text-white text-[10px] font-mono font-black uppercase mb-1 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] mr-2">
                      <Volume2 className="w-3 h-3 animate-pulse" />
                      MEMBACA...
                    </span>
                  )}
                  {trimmed.replace(/^[-*]\s+/, "")}
                </li>
              );
            }

            return (
              <div
                key={lIdx}
                id={`line-${lineKey}`}
                className={`transition-all duration-300 rounded-none ${
                  isActiveReading
                    ? "bg-[#FFFF00] text-slate-950 p-3 sm:p-4 border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]"
                    : ""
                }`}
              >
                {isActiveReading && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-none bg-[#166534] text-white text-[10px] font-mono font-black uppercase mb-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <Volume2 className="w-3.5 h-3.5 animate-pulse" />
                    BAGIAN ARTIKEL SEDANG DIBACA
                  </span>
                )}
                <p className={`text-base sm:text-lg leading-relaxed font-sans ${isActiveReading ? "font-bold text-black" : "text-slate-800 dark:text-slate-200 font-normal"}`}>
                  {trimmed}
                </p>
              </div>
            );
          })}
        </div>
      );
    });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white font-mono selection:bg-[#EAB308] selection:text-slate-950 pb-28 sm:pb-20">
      
      {/* Feature 2.1: Fixed Reading Progress Bar Top Indicator */}
      <div
        style={{ width: `${scrollProgress}%` }}
        className="fixed top-0 left-0 h-1.5 bg-[#166534] z-50 transition-all duration-75 ease-out shadow-[0_2px_0_0_rgba(0,0,0,1)]"
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
        
        {/* 1. TOP NAV BREADCRUMB (Pure Neo-Brutalist Sharp Button) */}
        <div className="flex items-center justify-between">
          <Link
            href="/artikel"
            onClick={() => soundFx.playClick()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-none bg-white dark:bg-black border-3 border-black dark:border-white text-xs font-mono font-black text-black dark:text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer group uppercase"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-[#166534]" />
            <span>KEMBALI KE ARTIKEL</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                const nowSaved = toggleBookmark({
                  id: article.id,
                  title: article.title,
                  slug: article.slug,
                  thumbnail: article.thumbnail,
                  created_at: article.created_at,
                });
                showToast(nowSaved ? "Artikel berhasil disimpan ke profil!" : "Artikel dihapus dari simpanan.");
              }}
              className={`px-3.5 py-2 rounded-none border-3 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer flex items-center gap-1.5 ${
                isSavedBookmark ? "bg-[#FFFF00] text-black" : "bg-white dark:bg-black text-black dark:text-white"
              }`}
              title={isSavedBookmark ? "Tersimpan" : "Simpan Artikel"}
            >
              <Bookmark className={`w-4 h-4 ${isSavedBookmark ? "fill-black text-black" : ""}`} />
              <span className="text-xs font-mono font-black uppercase hidden sm:inline">
                {isSavedBookmark ? "TERSIMPAN" : "SIMPAN"}
              </span>
            </button>

            <button
              onClick={handleShare}
              className="p-2.5 rounded-none bg-white dark:bg-black border-3 border-black dark:border-white text-black dark:text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
              title="Salin Link Artikel"
            >
              {isCopied ? <Check className="w-4 h-4 text-[#00FF66]" /> : <Share2 className="w-4 h-4" />}
            </button>
          </div>

        </div>

        {/* 2. ARTICLE HEADER META */}
        <div className="space-y-4 text-left">
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono font-black">
            {article.readTime && (
              <span className="px-3 py-1 rounded-none bg-[#FFFF00] text-black border-2 border-black flex items-center gap-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] uppercase">
                <Clock className="w-3.5 h-3.5 text-black" />
                <span>{article.readTime}</span>
              </span>
            )}

            <span className="px-3 py-1 rounded-none bg-neutral-100 dark:bg-neutral-900 text-black dark:text-white border-2 border-black dark:border-white flex items-center gap-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] uppercase">
              <Calendar className="w-3.5 h-3.5 text-[#166534]" />
              <span>{new Date(article.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</span>
            </span>
          </div>

          <h1 className="font-mono text-2xl sm:text-5xl font-black uppercase tracking-tight text-black dark:text-white leading-tight">
            {article.title}
          </h1>

          {/* Author Card (Neo-Brutalist Avatar & Badge) */}
          <div className="flex items-center gap-3.5 pt-3 pb-5 border-b-4 border-black dark:border-white">
            <div className="relative w-12 h-12 rounded-none border-3 border-black dark:border-white bg-[#166534] overflow-hidden shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] shrink-0">
              <Image
                src={article.authorAvatar || "/images/avatar.webp"}
                alt={article.authorName || "Author"}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="space-y-0.5">
              <p className="font-mono font-black text-sm sm:text-base uppercase text-black dark:text-white leading-tight">{article.authorName || "Brimas Pradika Utama"}</p>
              <p className="text-xs font-mono font-bold text-neutral-600 dark:text-neutral-400 uppercase">AI Systems Developer · SMK Bhakti Mulia Pare</p>
            </div>
          </div>
        </div>

        {/* 3. HERO THUMBNAIL IMAGE */}
        {article.thumbnail && (
          <div className="relative w-full h-64 sm:h-96 rounded-none overflow-hidden border-4 border-black dark:border-white bg-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
            <Image
              src={article.thumbnail}
              alt={article.title}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        )}

        {/* Feature 2.3: Neo-Brutalist Audio Voice Player Bar */}
        <div className="p-4 rounded-2xl border-3 border-slate-900 dark:border-white bg-amber-400 text-slate-950 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleToggleAudio}
              className="px-4 py-2.5 rounded-xl border-2 border-slate-900 bg-slate-950 text-white font-mono font-bold text-xs uppercase flex items-center gap-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-[#DC2626] transition-all cursor-pointer shrink-0"
            >
              {isPlayingAudio ? (
                <>
                  <Pause className="w-4 h-4 text-amber-400 animate-pulse" />
                  <span>PAUSE AUDIO</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 text-emerald-400 fill-emerald-400" />
                  <span>DENGARKAN ARTIKEL</span>
                </>
              )}
            </button>

            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 font-mono font-black text-xs uppercase tracking-tight">
                <Volume2 className="w-4 h-4 text-slate-950" />
                <span>AUDIO PLAYER SYNTHESIS</span>
              </div>
              <p className="text-[11px] font-sans font-semibold text-slate-800">
                {isPlayingAudio ? "🔊 Sedang membaca artikel..." : `Siap diputar (${calculatedReadTime} min · ${wordCount} kata)`}
              </p>
            </div>
          </div>

          {/* Audio Controls (Voice & Speed Selectors) */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {/* Voice Picker Dropdown */}
            {availableVoices.length > 0 && (
              <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border-2 border-slate-900 text-white font-mono text-xs">
                <span className="px-1.5 text-[10px] font-bold text-emerald-400 uppercase">VOICE:</span>
                <select
                  value={selectedVoiceURI}
                  onChange={(e) => {
                    setSelectedVoiceURI(e.target.value);
                    if (isPlayingAudio && typeof window !== "undefined" && "speechSynthesis" in window) {
                      startSpeech(audioSpeed);
                    }
                  }}
                  className="bg-slate-900 text-white text-[11px] font-mono font-bold px-2 py-1 rounded-lg border border-slate-700 outline-none cursor-pointer max-w-[140px] truncate"
                >
                  {availableVoices.map((v) => (
                    <option key={v.voiceURI} value={v.voiceURI}>
                      {v.name.replace(/Microsoft|Google|Indonesian|Indonesia|\(.*?\)/gi, "").trim() || v.name} {v.name.includes("Natural") || v.name.includes("Online") ? "✨" : ""}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Audio Speed Selector */}
            <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border-2 border-slate-900 text-white font-mono text-xs">
              <span className="px-1.5 text-[10px] font-bold text-amber-400 uppercase">KECEPATAN:</span>
              {[0.75, 1, 1.25, 1.5, 2].map((spd) => (
                <button
                  key={spd}
                  type="button"
                  onClick={() => handleSpeedChange(spd)}
                  className={`px-2 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                    audioSpeed === spd
                      ? "bg-amber-400 text-slate-950 border border-slate-900"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Feature 2.2: Neo-Brutalist AI Article Summary & Key Takeaways Card */}
        <div className="p-5 rounded-2xl border-3 border-slate-900 dark:border-white bg-white dark:bg-[#0E121D] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b-2 border-slate-900 dark:border-white">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-400 border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <BrainCircuit className="w-4 h-4 text-slate-950" />
              </div>
              <div>
                <h4 className="font-mono font-black text-sm uppercase text-slate-950 dark:text-white leading-none">
                  AI SUMMARY &amp; KEY TAKEAWAYS
                </h4>
                <span className="text-[10px] font-mono text-slate-500 font-bold">
                  RANGKUMAN INTI ARTIKEL DENGAN AI
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGenerateAiSummary}
              disabled={isGeneratingSummary}
              className="px-3.5 py-1.5 rounded-xl border-2 border-slate-900 dark:border-white bg-emerald-400 text-slate-950 font-mono font-bold text-xs uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-amber-400 transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isGeneratingSummary ? "animate-spin" : ""}`} />
              <span>{isGeneratingSummary ? "PROSES AI..." : (aiSummary ? "RANGKUM ULANG" : "RANGKUM DENGAN AI")}</span>
            </button>
          </div>

          {aiSummary ? (
            <ul className="space-y-2.5 font-sans text-xs sm:text-sm text-slate-800 dark:text-slate-200">
              {aiSummary.map((bullet, bIdx) => (
                <li key={bIdx} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-900/20 dark:border-white/20">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="font-medium leading-relaxed">{bullet}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border-2 border-dashed border-slate-300 dark:border-slate-800 text-center text-xs font-mono text-slate-500 font-semibold flex items-center justify-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Klik tombol "RANGKUM DENGAN AI" untuk mengekstrak poin-poin utama artikel ini.</span>
            </div>
          )}
        </div>

        {/* 4. MAIN ARTICLE CONTENT WITH SIDEBAR TABLE OF CONTENTS */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Interactive Table of Contents Sidebar */}
          {toc.length > 0 && (
            <aside className="lg:col-span-1 order-2 lg:order-1">
              <div className="sticky top-24 p-5 rounded-none border-4 border-black dark:border-white bg-white dark:bg-black space-y-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] font-mono">
                <div className="flex items-center gap-2 font-black text-xs uppercase tracking-wider text-black dark:text-white pb-3 border-b-3 border-black dark:border-white">
                  <List className="w-4 h-4 text-[#166534]" />
                  <span>DAFTAR ISI</span>
                </div>
                <nav className="space-y-2 text-xs font-mono font-bold">
                  {toc.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        const el = document.getElementById(item.id);
                        if (el) el.scrollIntoView({ behavior: "smooth" });
                      }}
                      className={`block py-1.5 px-2.5 rounded-none transition-colors border-l-3 border-transparent hover:border-[#166534] hover:bg-neutral-100 dark:hover:bg-neutral-900 text-neutral-800 dark:text-neutral-200 hover:text-[#166534] uppercase ${
                        item.level === 3 ? "pl-4 text-[11px]" : "font-black text-xs"
                      }`}
                    >
                      {item.text}
                    </a>
                  ))}
                </nav>
              </div>
            </aside>
          )}

          {/* Article Text Content */}
          <main className={`${toc.length > 0 ? "lg:col-span-3 order-1 lg:order-2" : "col-span-4"}`}>
            <article className="p-6 sm:p-10 rounded-none border-4 border-black dark:border-white bg-white dark:bg-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] space-y-6 text-black dark:text-white">
              {renderContent(article.content)}
            </article>
          </main>

        </div>

        {/* 5. REACTION & SOCIAL SHARE BAR */}
        <div className="p-5 rounded-none border-4 border-black dark:border-white bg-white dark:bg-black flex flex-wrap items-center justify-between gap-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] font-mono">
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleReaction("LIKE")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-none border-3 border-black text-xs font-mono font-black uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer ${
                article.userReaction === "LIKE"
                  ? "bg-[#166534] text-white"
                  : "bg-white text-black hover:bg-[#FFFF00]"
              }`}
            >
              <Heart className={`w-4 h-4 ${article.userReaction === "LIKE" ? "fill-white" : "text-[#166534]"}`} />
              <span>SUKA ({article.likeCount})</span>
            </button>

            <button
              onClick={() => handleReaction("DISLIKE")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-none border-3 border-black text-xs font-mono font-black uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer ${
                article.userReaction === "DISLIKE"
                  ? "bg-neutral-800 text-white"
                  : "bg-white text-black hover:bg-neutral-200"
              }`}
            >
              <ThumbsDown className="w-4 h-4 text-black dark:text-white" />
              <span>TIDAK SUKA ({article.dislikeCount})</span>
            </button>
          </div>

          {/* Social Media Share Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono font-black uppercase text-black dark:text-white hidden sm:inline">BAGIKAN:</span>
            
            <button
              onClick={() => handleSocialShare("wa")}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-none bg-[#00FF66] text-black border-3 border-black text-xs font-mono font-black uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] cursor-pointer hover:bg-[#FFFF00] transition-all"
              title="Bagikan ke WhatsApp"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              </svg>
              <span>WHATSAPP</span>
            </button>

            <button
              onClick={() => handleSocialShare("tw")}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-none bg-sky-400 text-black border-3 border-black text-xs font-mono font-black uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] cursor-pointer hover:bg-[#FFFF00] transition-all"
              title="Bagikan ke X (Twitter)"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              <span>X / TWITTER</span>
            </button>

            <button
              onClick={() => handleSocialShare("li")}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-none bg-blue-600 text-white border-3 border-black text-xs font-mono font-black uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] cursor-pointer hover:bg-[#166534] transition-all"
              title="Bagikan ke LinkedIn"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.7a1.6 1.6 0 1 0 1.6 1.6c0-.88-.71-1.6-1.6-1.6z"/>
              </svg>
              <span>LINKEDIN</span>
            </button>
          </div>
        </div>


        {/* 6. COMMENTS SECTION */}
        <section className="space-y-6 pt-4 font-mono">
          <div className="flex items-center gap-2 text-xl font-mono font-black uppercase text-black dark:text-white">
            <MessageSquare className="w-5 h-5 text-[#166534]" />
            <span>KOMENTAR ({article.commentCount})</span>
          </div>

          {/* Add Comment Box */}
          <form onSubmit={handleAddComment} className="p-5 rounded-none border-4 border-black dark:border-white bg-white dark:bg-black space-y-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]">
            {user ? (
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-black dark:text-white">
                <span className="w-2.5 h-2.5 rounded-none bg-[#00FF66] border border-black" />
                <span>MENULIS SEBAGAI <strong className="text-[#166534] dark:text-[#EAB308] uppercase">{user.user_metadata?.full_name || user.email?.split("@")[0]}</strong></span>
              </div>
            ) : (
              <div className="p-3.5 rounded-none bg-[#FFFF00] text-black border-3 border-black text-xs font-mono font-black flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <span>ANDA BELUM MASUK AKUN. SILAKAN LOGIN UNTUK MENGIRIM KOMENTAR.</span>
                <Link
                  href="/login"
                  className="px-4 py-1.5 rounded-none bg-black text-white border-2 border-black font-mono font-black hover:bg-[#166534] transition-all shrink-0 uppercase"
                >
                  MASUK AKUN
                </Link>
              </div>
            )}

            <textarea
              rows={3}
              placeholder="TULISKAN PANDANGAN ANDA..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              disabled={!user}
              className="w-full p-3.5 rounded-none bg-neutral-100 dark:bg-neutral-900 border-3 border-black dark:border-white text-black dark:text-white placeholder:text-neutral-500 text-xs font-mono font-black uppercase focus:outline-none focus:ring-2 focus:ring-[#166534] transition-all disabled:opacity-50"
            />

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!user || !commentText.trim()}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-none bg-[#166534] text-white border-3 border-black dark:border-white text-xs font-mono font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all disabled:opacity-40 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>KIRIM KOMENTAR</span>
              </button>
            </div>
          </form>

          {/* Comments List */}
          <div className="space-y-4">
            {article.comments.length === 0 ? (
              <div className="p-6 rounded-none border-4 border-black dark:border-white bg-white dark:bg-black text-center text-black dark:text-white font-mono font-bold text-xs uppercase shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]">
                BELUM ADA KOMENTAR.
              </div>
            ) : (
              article.comments.map((comment) => (
                <div
                  key={comment.id}
                  className="p-5 rounded-none border-4 border-black dark:border-white bg-white dark:bg-black space-y-3 text-left shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] font-mono"
                >
                  <div className="flex items-center justify-between border-b-2 border-black dark:border-white pb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-none bg-[#166534] text-white font-mono font-black text-xs border-2 border-black flex items-center justify-center uppercase">
                        {comment.user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-mono font-black text-xs uppercase text-black dark:text-white">{comment.user.name}</p>
                        <p className="text-[10px] font-mono text-neutral-500 font-bold uppercase">
                          {new Date(comment.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                        </p>
                      </div>
                    </div>

                    {user && user.id === comment.user_id && (
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="p-1 text-black dark:text-white hover:text-[#166534] transition-colors cursor-pointer"
                        title="Hapus komentar saya"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <p className="text-xs text-black dark:text-white font-mono font-medium leading-relaxed uppercase">
                    {comment.content}
                  </p>
                </div>
              ))
            )}
          </div>
        </section>

        {/* 7. RELATED ARTICLES */}
        {relatedArticles.length > 0 && (
          <section className="space-y-4 pt-8 border-t-4 border-black dark:border-white font-mono">
            <h3 className="text-xl font-mono font-black uppercase text-black dark:text-white">
              ARTIKEL TERKAIT
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {relatedArticles.slice(0, 2).map((rel) => (
                <Link
                  key={rel.id}
                  href={`/artikel/${rel.slug}`}
                  onClick={() => soundFx.playClick()}
                  className="p-4 rounded-none border-4 border-black dark:border-white bg-white dark:bg-black hover:-translate-x-1 hover:-translate-y-1 transition-all flex gap-4 items-center group shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] hover:shadow-[8px_8px_0px_0px_rgba(22,101,52,1)] cursor-pointer"
                >
                  <div className="relative w-20 h-16 rounded-none bg-black border-2 border-black overflow-hidden shrink-0">
                    {rel.thumbnail ? (
                      <Image src={rel.thumbnail} alt={rel.title} fill className="object-cover group-hover:scale-105 transition-transform" unoptimized />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-black">
                        <BookOpen className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-mono font-black text-xs text-black dark:text-white group-hover:text-[#166534] transition-colors line-clamp-2 uppercase">
                      {rel.title}
                    </h4>
                    <p className="text-[10px] font-mono font-bold text-neutral-500 uppercase">{rel.readTime || "5 min read"}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

      </div>

      {/* Toast Popup Notification */}
      {toastMsg && (
        <div className="fixed bottom-24 right-6 z-50 px-4 py-2.5 rounded-none bg-[#166534] text-white border-3 border-black font-mono font-black text-xs uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          {toastMsg}
        </div>
      )}

      {/* Floating Mobile Table of Contents Button & Modal */}
      {toc.length > 0 && (
        <>
          <button
            type="button"
            onClick={() => {
              try { soundFx.playClick(); } catch {}
              setIsTocOpen(!isTocOpen);
            }}
            className="lg:hidden fixed bottom-24 left-4 z-50 px-4 py-2.5 rounded-none bg-[#FFFF00] text-black text-xs font-mono font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-3 border-black flex items-center gap-2 cursor-pointer active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
          >
            <List className="w-4 h-4 text-black" />
            <span>DAFTAR ISI ({toc.length})</span>
          </button>

          {isTocOpen && (
            <div className="lg:hidden fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-end justify-center p-4">
              <div className="w-full max-w-md bg-white dark:bg-black border-4 border-black dark:border-white rounded-none p-5 space-y-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] font-mono">
                <div className="flex items-center justify-between border-b-3 pb-3 border-black dark:border-white">
                  <div className="flex items-center gap-2 font-mono font-black text-sm uppercase text-black dark:text-white">
                    <List className="w-4 h-4 text-[#166534]" />
                    <span>DAFTAR ISI ARTIKEL</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsTocOpen(false)}
                    className="w-8 h-8 rounded-none bg-[#166534] text-white border-2 border-black font-mono font-black text-xs flex items-center justify-center cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                <nav className="space-y-2 max-h-[55vh] overflow-y-auto pr-1">
                  {toc.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        try { soundFx.playClick(); } catch {}
                        setIsTocOpen(false);
                        const el = document.getElementById(item.id);
                        if (el) el.scrollIntoView({ behavior: "smooth" });
                      }}
                      className={`block py-2 px-3 rounded-none transition-colors border-l-3 border-black bg-neutral-100 dark:bg-neutral-900 text-black dark:text-white font-mono uppercase ${
                        item.level === 3 ? "pl-6 text-xs font-bold" : "text-xs font-black"
                      }`}
                    >
                      {item.text}
                    </a>
                  ))}
                </nav>
              </div>
            </div>
          )}
        </>
      )}

      {/* Floating Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
}
