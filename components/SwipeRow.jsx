"use client";

import { useRef, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02Icon } from "@hugeicons/core-free-icons";
import "./SwipeRow.css";

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export default function SwipeRow({
  children,
  actions = [{ id: "delete", label: "Delete" }],
  actionColor = "#e5484d",
  drawerColor = "#3f3f46",
  rowColor = "#27272a",
  textColor = "#f5f5f5",
  height = 64,
  radius = 16,
  actionWidth = 80,
  direction = "left",
  snapBounce = 0.2,
  resistance = 0.55,
  collapseMs = 200,
  commitAt = 0.6,
  fullSwipe = true,
  disabled = false,
  onAction,
  onCommit,
  className = "",
  style,
}) {
  const [offset, setOffset] = useState(0);
  const [dragging, setDragging] = useState(false);
  const start = useRef({ x: 0, offset: 0 });
  const sign = direction === "left" ? -1 : 1;
  const maxOffset = actions.length * actionWidth;

  const finish = (rawOffset) => {
    const exposed = sign * rawOffset;
    const shouldCommit = fullSwipe && exposed >= Math.max(commitAt * 100, maxOffset + actionWidth / 2);
    if (shouldCommit && actions[0]) {
      const action = actions[0];
      onAction?.(action);
      setOffset(sign * 1000);
      window.setTimeout(() => onCommit?.(action), collapseMs);
      return;
    }
    const open = exposed > maxOffset / 2;
    setOffset(sign * (open ? maxOffset : 0));
  };

  const onPointerDown = (event) => {
    if (disabled) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    start.current = { x: event.clientX, offset };
    setDragging(true);
  };

  const onPointerMove = (event) => {
    if (!dragging) return;
    const delta = (event.clientX - start.current.x) * sign;
    const next = start.current.offset + delta;
    const resistanceFactor = next > maxOffset ? resistance : 1;
    setOffset(sign * clamp((sign * next) * resistanceFactor, 0, Math.max(maxOffset, event.currentTarget.parentElement?.offsetWidth ?? maxOffset)));
  };

  const onPointerUp = () => {
    if (!dragging) return;
    setDragging(false);
    finish(offset);
  };

  const act = (action) => {
    onAction?.(action);
    if (action === actions[0] || action.dismiss) {
      setOffset(sign * 1000);
      window.setTimeout(() => onCommit?.(action), collapseMs);
      return;
    }
    action.onSelect?.();
    setOffset(0);
  };

  return (
    <div
      className={`swipe-row${className ? ` ${className}` : ""}`}
      data-direction={direction}
      data-dragging={dragging ? "" : undefined}
      style={{
        "--sr-h": `${height}px`,
        "--sr-r": `${radius}px`,
        "--sr-a": `${actionWidth}px`,
        "--sr-row": rowColor,
        "--sr-text": textColor,
        "--sr-drawer": drawerColor,
        "--sr-action": actionColor,
        "--sr-collapse": `${collapseMs}ms`,
        ...style,
      }}
    >
      <div className="swipe-row__clip">
        <div className="swipe-row__rail">
          {actions.map((action, index) => (
            <button
              key={action.id}
              type="button"
              className="swipe-row__action"
              onClick={() => act(action)}
              style={{
                [direction === "left" ? "right" : "left"]: index * actionWidth,
                background: index === 0 ? actionColor : action.color ?? drawerColor,
              }}
            >
              <span className="swipe-row__glyph">
                <span className="swipe-row__icon">
                  {action.icon ?? (index === 0 ? <HugeiconsIcon icon={Delete02Icon} size={20} strokeWidth={2} /> : null)}
                </span>
                <span>{action.label}</span>
              </span>
            </button>
          ))}
        </div>
        <div
          className="swipe-row__surface"
          style={{ transform: `translateX(${offset}px)` }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
