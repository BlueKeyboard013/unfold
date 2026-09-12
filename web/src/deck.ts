import labelsData from "./data/styleLabels.json";

export interface DeckCard {
  filename: string;
  style: string;
  imageUrl: string;
}

const GUARANTEED_PER_STYLE = 2;

function shuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function toCard(filename: string, style: string): DeckCard {
  return {
    filename,
    style,
    imageUrl: `/style_images/${encodeURIComponent(filename)}`,
  };
}

/**
 * Builds a swipe deck where the first 20 cards contain exactly two images
 * from every style category (shuffled), so the aggregated profile after the
 * required minimum of 20 swipes always has signal from every style. The
 * remainder of the deck is every other labeled image, shuffled.
 */
export function buildDeck(): DeckCard[] {
  const byStyle = new Map<string, string[]>();
  for (const [filename, style] of Object.entries(labelsData.labels)) {
    const list = byStyle.get(style as string) ?? [];
    list.push(filename);
    byStyle.set(style as string, list);
  }

  const firstTwenty: DeckCard[] = [];
  const rest: DeckCard[] = [];

  for (const [style, filenames] of byStyle) {
    const shuffled = shuffle(filenames);
    const guaranteed = shuffled.slice(0, GUARANTEED_PER_STYLE);
    const remaining = shuffled.slice(GUARANTEED_PER_STYLE);

    guaranteed.forEach((filename) => firstTwenty.push(toCard(filename, style)));
    remaining.forEach((filename) => rest.push(toCard(filename, style)));
  }

  return [...shuffle(firstTwenty), ...shuffle(rest)];
}

export const MINIMUM_SWIPES = 20;
