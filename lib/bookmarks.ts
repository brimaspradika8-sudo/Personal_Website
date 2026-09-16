"use client";

import { soundFx } from "@/lib/audio/sound";

export interface BookmarkedArticle {
  id: string;
  title: string;
  slug: string;
  thumbnail?: string | null;
  created_at?: string;
  saved_at: string;
}

const STORAGE_KEY = "brimas_saved_bookmarks";
const EVENT_NAME = "brimas_bookmarks_updated";

export function getBookmarks(): BookmarkedArticle[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function isBookmarked(articleId: string): boolean {
  const list = getBookmarks();
  return list.some((item) => item.id === articleId || item.slug === articleId);
}

export function toggleBookmark(article: {
  id: string;
  title: string;
  slug: string;
  thumbnail?: string | null;
  created_at?: string | Date;
}): boolean {
  if (typeof window === "undefined") return false;

  const currentList = getBookmarks();
  const existsIndex = currentList.findIndex(
    (item) => item.id === article.id || item.slug === article.slug
  );

  let newStatus = false;
  let newList: BookmarkedArticle[] = [];

  if (existsIndex >= 0) {
    // Remove
    newList = currentList.filter((_, idx) => idx !== existsIndex);
    newStatus = false;
    soundFx.playClick();
  } else {
    // Add
    const newItem: BookmarkedArticle = {
      id: article.id,
      title: article.title,
      slug: article.slug,
      thumbnail: article.thumbnail || null,
      created_at: article.created_at ? new Date(article.created_at).toISOString() : undefined,
      saved_at: new Date().toISOString(),
    };
    newList = [newItem, ...currentList];
    newStatus = true;
    soundFx.playSuccess();
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { newList } }));
  } catch {
    // Storage quota fallback
  }

  return newStatus;
}

export function subscribeBookmarks(callback: (list: BookmarkedArticle[]) => void): () => void {
  if (typeof window === "undefined") return () => {};

  const handler = () => {
    callback(getBookmarks());
  };

  window.addEventListener(EVENT_NAME, handler);
  window.addEventListener("storage", handler);

  return () => {
    window.removeEventListener(EVENT_NAME, handler);
    window.removeEventListener("storage", handler);
  };
}
