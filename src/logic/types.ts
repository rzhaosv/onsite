export type LabId = 'anthropic' | 'openai' | 'deepmind' | 'meta' | 'bigtech';
export type RoleId = 'swe' | 'mle' | 'research' | 'applied';
export type RoundType = 'coding' | 'mlcoding' | 'design' | 'debugging' | 'behavioral' | 'values' | 'research' | 'quiz';

export type Profile = {
  labs: LabId[];
  role: RoleId;
  /** ISO date of the next interview, or null if not scheduled. */
  interviewDate: string | null;
  years: '0-1' | '2-4' | '5-8' | '9+';
  background: string;
  /** Show coaching notes in Chinese alongside English. */
  zh: boolean;
  name: string;
};

export type Dimension = { key: string; label: string; score: number; note: string };

export type Scorecard = {
  overall: number; // 1-4 scale like a real debrief: 1 no hire, 2 lean no, 3 lean hire, 4 strong hire
  verdict: 'Strong Hire' | 'Hire' | 'Lean No Hire' | 'No Hire';
  summary: string;
  dimensions: Dimension[];
  strengths: string[];
  gaps: string[];
  nextDrills: string[];
  zh?: string; // coaching in Chinese when enabled
};

export type Message = { role: 'interviewer' | 'candidate'; text: string; at: string };

export type Mock = {
  id: string;
  at: string;
  lab: LabId;
  round: RoundType;
  question: string;
  messages: Message[];
  scorecard: Scorecard | null;
  durationSec: number;
};

export type DrillCard = {
  id: string;
  lab: LabId | 'all';
  round: RoundType;
  prompt: string;
  hint: string;
  /** Key points a strong answer covers. */
  keys: string[];
};

export type DrillState = {
  /** SM-2-ish: next due (ISO), interval days, ease, reps */
  due: string;
  interval: number;
  ease: number;
  reps: number;
  lastGrade: number | null; // 0-5
  lastNote: string;
};

export type Story = {
  id: string;
  title: string;
  situation: string;
  task: string;
  action: string;
  result: string;
  tags: string[];
  sharpened: string | null;
  updatedAt: string;
};

export type AppState = {
  onboarded: boolean;
  profile: Profile;
  mocks: Mock[];
  drills: Record<string, DrillState>;
  stories: Story[];
  freeMocksUsed: number;
  freeGradesUsed: number;
  /** yyyy-mm-dd of days with any activity, for the streak */
  activeDays: string[];
  createdAt: string | null;
};

export const DEFAULT_PROFILE: Profile = {
  labs: ['anthropic'],
  role: 'swe',
  interviewDate: null,
  years: '2-4',
  background: '',
  zh: true,
  name: '',
};

export const DEFAULT_STATE: AppState = {
  onboarded: false,
  profile: DEFAULT_PROFILE,
  mocks: [],
  drills: {},
  stories: [],
  freeMocksUsed: 0,
  freeGradesUsed: 0,
  activeDays: [],
  createdAt: null,
};

export const FREE_MOCKS = 1;
export const FREE_GRADES = 10;
