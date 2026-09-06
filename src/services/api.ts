import { DrillCard, LabId, Message, Profile, RoundType, Scorecard, Story } from '../logic/types';

const API_URL = 'https://tryforma.app/api/onsite';
const APP_TOKEN = 'onsite_v1_7c4d9';

export type ApiFailure = { ok: false; reason: 'network' | 'server' | 'rate_limited' };

async function post(body: object): Promise<{ ok: true; json: any } | ApiFailure> {
  let res: Response;
  try {
    res = await fetch(API_URL, { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-onsite-app': APP_TOKEN }, body: JSON.stringify(body) });
  } catch {
    return { ok: false, reason: 'network' };
  }
  if (res.status === 429) return { ok: false, reason: 'rate_limited' };
  if (!res.ok) return { ok: false, reason: 'server' };
  try {
    const json = await res.json();
    if (!json || typeof json !== 'object') return { ok: false, reason: 'server' };
    return { ok: true, json };
  } catch {
    return { ok: false, reason: 'server' };
  }
}

export type PlanWeek = { title: string; focus: string; tasks: string[] };
export type Plan = { weeks: PlanWeek[]; note: string; zh: string; createdAt: string };

export async function buildPlan(profile: Profile, weeksLeft: number): Promise<{ ok: true; plan: Plan } | ApiFailure> {
  const r = await post({ mode: 'plan', profile, weeksLeft });
  if (!r.ok) return r;
  const weeks = Array.isArray(r.json.weeks) ? r.json.weeks : [];
  if (!weeks.length) return { ok: false, reason: 'server' };
  return { ok: true, plan: { weeks, note: str(r.json.note), zh: str(r.json.zh), createdAt: new Date().toISOString() } };
}

export async function mockTurn(input: { lab: LabId; round: RoundType; role: string; question?: string; messages: Message[]; zh: boolean }): Promise<{ ok: true; reply: string } | ApiFailure> {
  const r = await post({ mode: 'mock', ...input, messages: input.messages.map((m) => ({ role: m.role, text: m.text })) });
  if (!r.ok) return r;
  const reply = str(r.json.reply);
  return reply ? { ok: true, reply } : { ok: false, reason: 'server' };
}

export async function mockFinish(input: { lab: LabId; round: RoundType; role: string; question?: string; messages: Message[]; zh: boolean }): Promise<{ ok: true; scorecard: Scorecard } | ApiFailure> {
  const r = await post({ mode: 'mock', ...input, finish: true, messages: input.messages.map((m) => ({ role: m.role, text: m.text })) });
  if (!r.ok) return r;
  const s = r.json.scorecard;
  if (!s || typeof s.overall !== 'number') return { ok: false, reason: 'server' };
  return { ok: true, scorecard: s as Scorecard };
}

export async function gradeDrill(card: DrillCard, answer: string, zh: boolean): Promise<{ ok: true; grade: number; feedback: string; missing: string[]; zh: string } | ApiFailure> {
  const r = await post({ mode: 'grade', card: { prompt: card.prompt, keys: card.keys }, answer, zh });
  if (!r.ok) return r;
  return { ok: true, grade: Math.max(0, Math.min(5, Number(r.json.grade) || 0)), feedback: str(r.json.feedback), missing: Array.isArray(r.json.missing) ? r.json.missing : [], zh: str(r.json.zh) };
}

export async function sharpenStory(story: Story, lab: LabId, zh: boolean): Promise<{ ok: true; sharpened: string; notes: string[]; zh: string } | ApiFailure> {
  const r = await post({ mode: 'sharpen', story, lab, zh });
  if (!r.ok) return r;
  return { ok: true, sharpened: str(r.json.sharpened), notes: Array.isArray(r.json.notes) ? r.json.notes : [], zh: str(r.json.zh) };
}

function str(v: unknown): string {
  return typeof v === 'string' ? v.trim() : '';
}

export function failureText(reason: ApiFailure['reason']): string {
  if (reason === 'network') return 'No connection. The coach needs one.';
  if (reason === 'rate_limited') return 'Too many requests this hour. Take a breath and come back shortly.';
  return 'The coach is unavailable right now. Try again in a moment.';
}
