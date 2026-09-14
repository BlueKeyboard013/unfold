const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

export interface StyleWeight {
  style: string;
  count: number;
  weight: number;
}

export interface StyleProfileResponse {
  userId: string;
  totalSwipes: number;
  totalLikes: number;
  hasMinimumSwipes: boolean;
  profile: StyleWeight[];
}

export async function recordSwipe(params: {
  userId: string;
  filename: string;
  style: string;
  direction: "left" | "right";
}): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/v1/swipes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId: params.userId,
      filename: params.filename,
      style: params.style,
      direction: params.direction.toUpperCase(),
    }),
  });
  if (!response.ok) {
    throw new Error(`Failed to record swipe: ${response.status}`);
  }
}

export async function fetchStyleProfile(userId: string): Promise<StyleProfileResponse> {
  const response = await fetch(`${API_BASE_URL}/api/v1/users/${encodeURIComponent(userId)}/style-profile`);
  if (!response.ok) {
    throw new Error(`Failed to fetch style profile: ${response.status}`);
  }
  return response.json();
}
