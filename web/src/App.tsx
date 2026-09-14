import { useState } from "react";
import { buildDeck, MINIMUM_SWIPES } from "./deck";
import type { DeckCard } from "./deck";
import { SwipeCard } from "./SwipeCard";
import { STYLE_NAMES } from "./styles";
import { fetchStyleProfile, recordSwipe } from "./api";
import type { StyleProfileResponse } from "./api";
import { getOrCreateUserId } from "./userId";
import "./App.css";

function App() {
  const [userId] = useState<string>(() => getOrCreateUserId());
  const [deck] = useState<DeckCard[]>(() => buildDeck());
  const [index, setIndex] = useState(0);
  const [swipeCount, setSwipeCount] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [profile, setProfile] = useState<StyleProfileResponse | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  const currentCard = deck[index];
  const nextCard = deck[index + 1];

  const canSeeResults = swipeCount >= MINIMUM_SWIPES;

  function handleSwipe(direction: "left" | "right") {
    if (!currentCard) return;
    recordSwipe({
      userId,
      filename: currentCard.filename,
      style: currentCard.style,
      direction,
    }).catch((err) => console.error("Failed to record swipe", err));
    setSwipeCount((prev) => prev + 1);
    setIndex((prev) => prev + 1);
  }

  async function handleSeeResults() {
    setShowResults(true);
    setLoadingProfile(true);
    setProfileError(null);
    try {
      const result = await fetchStyleProfile(userId);
      setProfile(result);
    } catch (err) {
      setProfileError("Couldn't load your style profile. Is the backend running?");
      console.error(err);
    } finally {
      setLoadingProfile(false);
    }
  }

  if (showResults) {
    return (
      <div className="app-shell">
        <h1>Your Style Profile</h1>
        {loadingProfile && <p className="subtitle">Loading your style profile…</p>}
        {profileError && <p className="subtitle">{profileError}</p>}
        {profile && (
          <>
            <p className="subtitle">Based on {profile.totalLikes} liked images</p>
            <div className="profile-list">
              {profile.profile.map(({ style, count, weight }) => (
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
              {profile.profile.length === 0 && (
                <p>You didn't like any images yet — try swiping right on a few!</p>
              )}
            </div>
          </>
        )}
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
        <button className="primary-button" onClick={handleSeeResults}>
          See my style profile
        </button>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <h1>Discover Your Style</h1>
      <p className="subtitle">
        Swipe right if you like it, left if you don't. {swipeCount}/{MINIMUM_SWIPES} minimum swipes
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
        <button className="secondary-button" onClick={handleSeeResults}>
          See my style profile ({swipeCount} swipes)
        </button>
      )}
    </div>
  );
}

export default App;
