export interface Card {
  id: string;
  value: string;
}

export interface Player {
  id: string;
  hand: Card[];
}

export interface Session {
  id: string;
  expiresAt: Date;
  token: string;
  createdAt: Date;
  updatedAt: Date;
  ipAddress?: string | null;
  userAgent?: string | null;
  userId: string;
  user: User;
}

export interface Account {
  id: string;
  accountId: string;
  providerId: string;
  userId: string;
  user: User;
  accessToken?: string | null;
  refreshToken?: string | null;
  idToken?: string | null;
  accessTokenExpiresAt?: Date | null;
  refreshTokenExpiresAt?: Date | null;
  scope?: string | null;
  password?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string; // UUID
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
  createdAt: Date;
  updatedAt: Date;
  sessions: Session[];
  accounts: Account[];
}

export interface Verification {
  id: string;
  identifier: string;
  value: string;
  expiresAt: Date;
  createdAt?: Date | null;
  updatedAt?: Date | null;
}

export enum UserType {
  LEAD_PLAYER,
  PLAYER,
  ADMIN,
}

export enum GameState {
  IDLE,
  QUESTIONS_1,
  QUESTIONS_2,
  BLIND_TEST_1,
  BLIND_TEST_2,
  WHOS_THAT_1,
  WHOS_THAT_2,
  GEOGUESSR,
  FINAL,
  COMPLETED,
}

export interface Game {
  id: string;
  name: string;
  isActive: boolean;
  currentState: GameState;
  deck: Card[];
  players: Record<string, Player>;
}

export interface GameMember {
  id: string;
  gameId: string;
  userId: string;
  userType: UserType;
}
