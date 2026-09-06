/**
 * Web-only demo seeding for App Store screenshots.
 * `?demo=<name>&snap=1` writes a canned AppState to localStorage before hydration.
 * Guarded by Platform.OS === 'web'; on iOS `demo` is always null.
 */
import { Platform } from 'react-native';
import { AppState, DEFAULT_STATE, Mock, Story } from '../logic/types';
import { RootStackParamList, TabParamList } from '../navigation';

const STORAGE_KEY = 'onsite.state.v1';
const PLAN_KEY = 'onsite.plan.v1';

export type DemoName = 'welcome' | 'onboard' | 'today' | 'loop' | 'mock' | 'scorecard' | 'drill' | 'drillgraded' | 'stories' | 'plan' | 'me' | 'paywall';
const VALID: DemoName[] = ['welcome', 'onboard', 'today', 'loop', 'mock', 'scorecard', 'drill', 'drillgraded', 'stories', 'plan', 'me', 'paywall'];

export type Demo = {
  name: DemoName;
  screen: keyof RootStackParamList | null;
  tab: keyof TabParamList;
  pro: boolean;
  onboardStep: number;
  snap: boolean;
  mockId: string | null;
  drillId: string | null;
};

const DAY = 86_400_000;

const PLAN = {
  weeks: [
    { title: 'Week 1 — Close the ML coding gap', focus: 'You are strong on systems, thin on writing ML from scratch.', tasks: ['Implement single-head attention from memory, three times, shapes annotated', 'Write a training loop with checkpoint + resume; break it, fix it', 'Two CodeSignal-style timed sets (4 problems, 90 min)', 'Read Constitutional AI; write half a page in your own words', 'One mock: ML coding at OpenAI', 'One full rest day. Not optional.'] },
    { title: 'Week 2 — Design at frontier scale', focus: 'Move from service design to training and inference infrastructure.', tasks: ['Design: annotation platform for 10M items, with QC and cost', 'Design: serving a large model, batching and KV cache budget', 'Memorise three estimation anchors: GPU memory, tokens/s, $/1M tokens', 'One mock: system design at Anthropic', 'Drills: all design cards to grade 4+'] },
    { title: 'Week 3 — Values, stories, and the loop rehearsal', focus: 'The rounds people lose that they think they cannot study for.', tasks: ['Write six STAR stories; sharpen each; time them at 2 minutes', 'Read the RSP summary; prepare two positions you actually hold', 'One mock: values and safety at Anthropic', 'One mock: behavioral, hiring-manager framing', 'Re-run any round scoring below Hire'] },
  ],
  note: 'The biggest risk is that ML coding stays theoretical. Weeks 1 and 2 force you to write it from memory under time; if that lands, the rest of your background carries you.',
  zh: '最大的风险是 ML 手写代码停留在"看懂了"。第一二周强制你在计时下凭记忆写出来。这一关过了，剩下的靠你已有的系统背景就能撑住。安全轮不要背口号，准备两个你真正相信的立场。',
  createdAt: new Date().toISOString(),
};

function mocks(now: number): Mock[] {
  return [
    {
      id: 'demo-mock-1',
      at: new Date(now - 3 * 3600_000).toISOString(),
      lab: 'anthropic',
      round: 'design',
      question: 'Design a distributed annotation platform for millions of texts and images with quality control.',
      durationSec: 2280,
      messages: [
        { role: 'interviewer', text: 'Let us design a system. We need to annotate millions of texts and images, with multiple annotators per item and quality controls. Where do you want to start?', at: new Date(now - 3 * 3600_000).toISOString() },
        { role: 'candidate', text: 'I want to pin down scale and the quality bar first. Say 10 million items a quarter, 3 labels each, so 30 million judgements, roughly 4 per second sustained. That decides whether task assignment can be a database query or needs a queue.', at: new Date(now - 3 * 3600_000 + 60_000).toISOString() },
        { role: 'interviewer', text: 'Good. Take 4 per second. What is the storage split, and what is the first bottleneck you expect?', at: new Date(now - 3 * 3600_000 + 90_000).toISOString() },
        { role: 'candidate', text: 'Postgres for item metadata and judgements, object storage for the raw assets with signed URLs, Redis for in-flight task leases. The first bottleneck is not throughput, it is lease contention: annotators pulling the same next item. I would shard the task queue by dataset and hand out leases with a TTL.', at: new Date(now - 3 * 3600_000 + 170_000).toISOString() },
        { role: 'interviewer', text: "How do you know the labels are any good?", at: new Date(now - 3 * 3600_000 + 200_000).toISOString() },
        { role: 'candidate', text: "Three things. Overlap: every item gets 3 labels, and I track pairwise agreement with Cohen's kappa per annotator. Gold: 5 percent of tasks are known-answer items seeded invisibly, which gives a live accuracy number per person. And drift: I watch kappa weekly, because guidelines change and people get faster and worse.", at: new Date(now - 3 * 3600_000 + 280_000).toISOString() },
      ],
      scorecard: {
        overall: 3,
        verdict: 'Hire',
        summary: 'Strong instincts on scale reasoning and quality control, with real numbers rather than hand-waving. Went to lease contention as the bottleneck, which is the right non-obvious answer. Did not get to cost per million items or bias monitoring before time ran out.',
        dimensions: [
          { key: 'scale', label: 'Scale reasoning', score: 3, note: 'Quantified early and used the number to make decisions.' },
          { key: 'storage', label: 'Storage design', score: 3, note: 'Sensible split; did not justify Postgres over alternatives.' },
          { key: 'quality', label: 'Quality control', score: 4, note: 'Overlap, gold questions and drift; exactly the right three.' },
          { key: 'cost', label: 'Cost awareness', score: 2, note: 'Never priced the pipeline; a gap at this scale.' },
          { key: 'comms', label: 'Communication', score: 3, note: 'Clear, led the conversation without rambling.' },
        ],
        strengths: ['Numbers before architecture', 'Found the real bottleneck', 'Quality control was expert-level'],
        gaps: ['No cost model', 'Bias and annotator fairness never came up', 'Did not discuss failure or recovery'],
        nextDrills: ['Price this exact pipeline per million items, with assumptions stated', 'Prepare a two-minute answer on bias monitoring in labelling', 'Redo the design and reach cost within 25 minutes'],
        zh: '这一轮偏强。你用数字驱动设计、直接点到 lease 争用这个非显而易见的瓶颈，质量控制部分（三重标注 + kappa + 金标题）是专家级的。差在没算成本，也没提标注偏差与公平性——在 Anthropic 这两点是加分项，缺了就卡在 Hire 而不是 Strong Hire。下一步：把同一个系统按每百万条算一次成本，练到 25 分钟内讲完。',
      },
    },
  ];
}

function stories(now: number): Story[] {
  return [
    {
      id: 'demo-story-1',
      title: 'The migration nobody wanted',
      situation: 'Our payments service was on a database version going end of life in 9 weeks. Nobody owned it.',
      task: 'I picked it up because the risk was mine to carry if it broke.',
      action: 'Wrote a shadow-read layer, migrated read traffic first, kept dual writes for two weeks, and built a one-command rollback we rehearsed twice.',
      result: 'Cut over with 0 minutes of downtime and no data loss. The rehearsal caught a bug that would have cost us hours.',
      tags: ['ownership', 'reliability'],
      sharpened:
        'Our payments database was going end of life in nine weeks and nobody owned the migration, so I took it, because if it broke at 3am it was going to be my pager anyway. I did it in three moves. First a shadow-read layer so I could compare old and new answers on live traffic without risking anything. Then read traffic moved over while writes went to both for two weeks, which let me watch real error rates instead of guessing. Last, a one-command rollback that we actually rehearsed, twice. The second rehearsal caught a bug in how we handled a null currency field that would have cost us hours mid-cutover. We cut over with zero downtime and no data loss. What I would do differently: I rehearsed the rollback but never rehearsed the decision to use it, so we had no agreed threshold. Now I write the abort criteria before the runbook.',
      updatedAt: new Date(now - 2 * DAY).toISOString(),
    },
  ];
}

function base(now: number, extra: Partial<AppState> = {}): AppState {
  const d = new Date(now + 24 * DAY);
  return {
    ...DEFAULT_STATE,
    onboarded: true,
    profile: {
      labs: ['anthropic', 'openai'],
      role: 'mle',
      interviewDate: d.toISOString().slice(0, 10),
      years: '2-4',
      background: '3 years backend at a fintech, strong on distributed systems, weak on ML coding. Targeting Anthropic infra.',
      zh: true,
      name: 'Wei',
    },
    mocks: mocks(now),
    stories: stories(now),
    drills: {
      a3: { due: new Date(now + 3 * DAY).toISOString(), interval: 3, ease: 2.5, reps: 2, lastGrade: 4, lastNote: 'Strong on QC, thin on cost.' },
      o1: { due: new Date(now + DAY).toISOString(), interval: 1, ease: 2.3, reps: 1, lastGrade: 3, lastNote: 'Shapes right, missed the mask ordering.' },
      s1: { due: new Date(now + 6 * DAY).toISOString(), interval: 6, ease: 2.6, reps: 3, lastGrade: 5, lastNote: 'Tight and specific.' },
    },
    freeMocksUsed: 1,
    freeGradesUsed: 3,
    activeDays: Array.from({ length: 11 }, (_, i) => {
      const dd = new Date(now - i * DAY);
      return `${dd.getFullYear()}-${String(dd.getMonth() + 1).padStart(2, '0')}-${String(dd.getDate()).padStart(2, '0')}`;
    }),
    createdAt: new Date(now - 12 * DAY).toISOString(),
    ...extra,
  };
}

function buildState(name: DemoName, now: number): AppState | null {
  if (name === 'welcome' || name === 'onboard') return null;
  if (name === 'paywall') return base(now, { mocks: [], freeMocksUsed: 1 });
  return base(now);
}

function screenFor(name: DemoName): { screen: keyof RootStackParamList | null; tab: keyof TabParamList } {
  switch (name) {
    case 'loop':
      return { screen: 'Loop', tab: 'Loops' };
    case 'mock':
      return { screen: 'Mock', tab: 'Today' };
    case 'scorecard':
      return { screen: 'Scorecard', tab: 'Today' };
    case 'drill':
      return { screen: 'Tabs', tab: 'Drill' };
    case 'drillgraded':
      return { screen: 'DrillCard', tab: 'Drill' };
    case 'stories':
      return { screen: 'Tabs', tab: 'Stories' };
    case 'plan':
      return { screen: 'Plan', tab: 'Today' };
    case 'me':
      return { screen: 'Tabs', tab: 'Me' };
    case 'paywall':
      return { screen: 'Paywall', tab: 'Today' };
    default:
      return { screen: 'Tabs', tab: 'Today' };
  }
}

function read(): Demo | null {
  if (Platform.OS !== 'web') return null;
  if (typeof window === 'undefined' || !window.location || !window.localStorage) return null;
  const params = new URLSearchParams(window.location.search);
  const name = params.get('demo') as DemoName | null;
  if (!name || !VALID.includes(name)) return null;
  const now = Date.now();
  const state = buildState(name, now);
  try {
    if (state) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      window.localStorage.setItem(PLAN_KEY, JSON.stringify(PLAN));
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
      window.localStorage.removeItem(PLAN_KEY);
    }
  } catch {
    /* ignore */
  }
  const { screen, tab } = screenFor(name);
  return {
    name,
    screen,
    tab,
    pro: name !== 'paywall',
    onboardStep: name === 'onboard' ? Number(params.get('step') ?? 1) : 0,
    snap: params.get('snap') === '1',
    mockId: name === 'mock' || name === 'scorecard' ? 'demo-mock-1' : null,
    drillId: name === 'drillgraded' ? 'a3' : null,
  };
}

export const demo: Demo | null = read();
