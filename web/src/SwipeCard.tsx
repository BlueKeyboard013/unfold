import { useRef, useState } from "react";
import type { PointerEvent } from "react";
import type { DeckCard } from "./deck";

interface SwipeCardProps {
  card: DeckCard;
  onSwipe: (direction: "left" | "right") => void;
  isTop: boolean;
}

const SWIPE_THRESHOLD = 100;

export function SwipeCard({ card, onSwipe, isTop }: SwipeCardProps) {
  const [drag, setDrag] = useState({ x: 0, y: 0, dragging: false });
  const [imageLoaded, setImageLoaded] = useState(false);
  const startPos = useRef({ x: 0, y: 0 });

  function handlePointerDown(e: PointerEvent<HTMLDivElement>) {
    if (!isTop) return;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    startPos.current = { x: e.clientX, y: e.clientY };
    setDrag({ x: 0, y: 0, dragging: true });
  }

  function handlePointerMove(e: PointerEvent<HTMLDivElement>) {
    if (!drag.dragging) return;
    setDrag({
      x: e.clientX - startPos.current.x,
      y: e.clientY - startPos.current.y,
      dragging: true,
    });
  }

  function handlePointerUp() {
    if (!drag.dragging) return;
    if (Math.abs(drag.x) > SWIPE_THRESHOLD) {
      onSwipe(drag.x > 0 ? "right" : "left");
    }
    setDrag({ x: 0, y: 0, dragging: false });
  }

  const rotation = drag.x / 20;
  const opacity = isTop ? 1 : 0.6;
  const scale = isTop ? 1 : 0.96;

  return (
    <div
      className="swipe-card"
      style={{
        transform: `translate(${drag.x}px, ${drag.y}px) rotate(${rotation}deg) scale(${scale})`,
        opacity,
        transition: drag.dragging ? "none" : "transform 0.3s ease, opacity 0.3s ease",
        zIndex: isTop ? 2 : 1,
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <img
        src={card.imageUrl}
        alt="Interior design reference"
        draggable={false}
        onLoad={() => setImageLoaded(true)}
        style={{ opacity: imageLoaded ? 1 : 0, transition: "opacity 0.15s ease" }}
      />
      {!imageLoaded && <div className="swipe-card-spinner" aria-hidden="true" />}
      {isTop && drag.x > 30 && <div className="badge badge-like">LIKE</div>}
      {isTop && drag.x < -30 && <div className="badge badge-nope">NOPE</div>}
    </div>
  );
}
