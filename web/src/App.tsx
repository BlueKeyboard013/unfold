import { useMemo, useState } from "react";
import { buildDeck, MINIMUM_SWIPES } from "./deck";
import type { DeckCard } from "./deck";
import { SwipeCard } from "./SwipeCard";
import { STYLE_NAMES } from "./styles";
import "./App.css";

interface Swipe {
  filename: string;
  style: string;
  direction: "left" | "right";
}

function buildStyleProfile(swipes: Swipe[]) {
  const likes = swipes.filter((s) => s.direction === "right");
  const counts = new Map<string, number>();
  for (const like of likes) {
    counts.set(like.style, (counts.get(like.style) ?? 0) + 1);
  }
  const total = likes.length;
  return [...counts.entries()]
    .map(([style, count]) => ({
      style,
      count,
      weight: total === 0 ? 0 : count / total,
    }))
    .sort((a, b) => b.weight - a.weight);
}

function App() {
  const [deck] = useState<DeckCard[]>(() => buildDeck());
  const [index, setIndex] = useState(0);
  const [swipes, setSwipes] = useState<Swipe[]>([]);
  const [showResults, setShowResults] = useState(false);

  const currentCard = deck[index];
  const nextCard = deck[index + 1];

  const canSeeResults = swipes.length >= MINIMUM_SWIPES;
  const profile = useMemo(() => buildStyleProfile(swipes), [swipes]);

  function handleSwipe(direction: "left" | "right") {
    if (!currentCard) return;
    setSwipes((prev) => [
      ...prev,
      { filename: currentCard.filename, style: currentCard.style, direction },
    ]);
    setIndex((prev) => prev + 1);
  }

  if (showResults) {
    return (
      <div className="app-shell">
        <h1>Your Style Profile</h1>
        <p className="subtitle">Based on {swipes.filter((s) => s.direction === "right").length} liked images</p>
        <div className="profile-list">
          {profile.map(({ style, count, weight }) => (
            <div key={style} className="profile-row">
              <div className="profile-label">
                <span>{STYLE_NAMES[style] ?? style}</span>
                <span>{Math.round(weight * 100)}%</span>
              </div>
              <div className="profile-bar-track">
                <div className="profile-bar-fill" style={{ width: `${weight * 100}%` }} />
              </div>
              <span className="profile-count">{count} likes</span>
            </div>
          ))}
          {profile.length === 0 && <p>You didn't like any images yet — try swiping right on a few!</p>}
        </div>
        <button className="secondary-button" onClick={() => setShowResults(false)}>
          Back to swiping
        </button>
      </div>
    );
  }

  if (!currentCard) {
    return (
      <div className="app-shell">
        <h1>That's every image!</h1>
        <p className="subtitle">You've swiped through the whole deck.</p>
        <button className="primary-button" onClick={() => setShowResults(true)}>
          See my style profile
        </button>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <h1>Discover Your Style</h1>
      <p className="subtitle">
        Swipe right if you like it, left if you don't. {swipes.length}/{MINIMUM_SWIPES} minimum swipes
      </p>

      <div className="card-stack">
        {nextCard && <SwipeCard key={nextCard.filename} card={nextCard} onSwipe={() => {}} isTop={false} />}
        <SwipeCard key={currentCard.filename} card={currentCard} onSwipe={handleSwipe} isTop={true} />
      </div>

      <div className="action-buttons">
        <button className="round-button nope" onClick={() => handleSwipe("left")} aria-label="Dislike">
          ✕
        </button>
        <button className="round-button like" onClick={() => handleSwipe("right")} aria-label="Like">
          ♥
        </button>
      </div>

      {canSeeResults && (
        <button className="secondary-button" onClick={() => setShowResults(true)}>
          See my style profile ({swipes.length} swipes)
        </button>
      )}
    </div>
  );
}

export default App;
