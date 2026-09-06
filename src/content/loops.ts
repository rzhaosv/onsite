import { LabId, RoleId, RoundType } from '../logic/types';

export type Stage = {
  round: RoundType;
  title: string;
  format: string;
  tests: string;
  themes: string[];
  tip: string;
  zh: string;
};

export type Loop = {
  id: LabId;
  name: string;
  short: string;
  tagline: string;
  weeks: string;
  bar: string;
  culture: string;
  stages: Stage[];
  reading: { title: string; why: string }[];
  sources: string[];
};

export const LABS: { id: LabId; name: string }[] = [
  { id: 'anthropic', name: 'Anthropic' },
  { id: 'openai', name: 'OpenAI' },
  { id: 'deepmind', name: 'Google DeepMind' },
  { id: 'meta', name: 'Meta (MSL / FAIR)' },
  { id: 'bigtech', name: 'Big Tech (Google, Apple, Amazon, Microsoft)' },
];

export const ROLES: { id: RoleId; name: string; zh: string }[] = [
  { id: 'swe', name: 'Software Engineer', zh: '软件工程师（Infra/Product）' },
  { id: 'mle', name: 'ML Engineer', zh: '机器学习工程师' },
  { id: 'research', name: 'Research Engineer', zh: '研究工程师' },
  { id: 'applied', name: 'Applied AI / Forward Deployed', zh: '应用 AI 工程师' },
];

export const ROUND_NAMES: Record<RoundType, string> = {
  coding: 'Coding',
  mlcoding: 'ML coding',
  design: 'System design',
  debugging: 'ML debugging',
  behavioral: 'Behavioral',
  values: 'Values & safety',
  research: 'Research discussion',
  quiz: 'Fundamentals quiz',
};

export const ROUND_ZH: Record<RoundType, string> = {
  coding: '编程',
  mlcoding: 'ML 编程',
  design: '系统设计',
  debugging: 'ML 调试',
  behavioral: '行为面',
  values: '价值观 / 安全',
  research: '研究讨论',
  quiz: '基础知识快问快答',
};

export const LOOPS: Loop[] = [
  {
    id: 'anthropic',
    name: 'Anthropic',
    short: 'Anthropic',
    tagline: 'Rigour plus safety. The bar is a strong engineer who takes the mission seriously without performing it.',
    weeks: '4 to 8 weeks from recruiter call to offer; rounds 1 to 2 weeks apart.',
    bar: 'Public estimates put end-to-end conversion under 1 percent. The online assessment alone removes most applicants.',
    culture:
      'Interviewers are looking for calibrated thinking about safety, not slogans. Dismissive is a fail; paralysed is a fail; "responsible scaling" is the register. Reference checks happen mid-loop, so how you treat recruiters and past colleagues matters.',
    stages: [
      {
        round: 'coding',
        title: 'Online assessment',
        format: '90 minutes on CodeSignal, typically 4 questions of rising difficulty. Many candidates report needing a perfect score to advance.',
        tests: 'Speed and correctness on practical data-structure problems. Not trick puzzles: clean, complete, tested code.',
        themes: ['string and interval processing', 'hash maps and sorting with stable tie-breaks', 'simulation with edge cases', 'clear helper decomposition'],
        tip: 'Practice timed sets of 4 in 90 minutes. Write tests as you go. A partially correct answer on question 4 is worth less than a bulletproof 1 to 3.',
        zh: '在线笔试 90 分钟 4 题，大量面经反映需要全对才能进下一轮。重点是速度和正确性，不是脑筋急转弯。练定时四题套卷，边写边测。',
      },
      {
        round: 'coding',
        title: 'Coding to a spec, four levels',
        format: '60 to 90 minutes, pair programming. You are given a spec and build it; every 15 minutes the interviewer adds a level of requirements.',
        tests: 'Whether your first version is easy to extend. Naming, type hints, small functions, and calm refactoring under time pressure.',
        themes: [
          'text post-processing for model outputs: dedupe, filter, sort',
          'an in-memory key-value store that grows into TTLs, transactions, then persistence',
          'a rate limiter or job scheduler with added constraints',
          'a small file system or bank ledger with rollback',
        ],
        tip: 'Level 1 should take ten minutes and leave room to grow. Say the trade-off out loud when you choose a data structure. Refactor before adding the next level, not after.',
        zh: '四层递进式编程：先给基础需求，每 15 分钟加一层。考的是第一版是否好扩展。命名、类型标注、小函数、边加需求边重构。',
      },
      {
        round: 'design',
        title: 'System design',
        format: '60 minutes on a whiteboard or doc. Problems come from real Anthropic work.',
        tests: 'Scale reasoning for ML systems, cost awareness, quality control, and where bias or safety enters the pipeline.',
        themes: [
          'a distributed data annotation platform with redundant labelling and agreement checks',
          "a chat service serving a large model: batching, streaming, queueing, fallbacks",
          'a training-data pipeline with dedup, filtering, and provenance',
          'an evaluation harness that runs thousands of prompts reproducibly',
        ],
        tip: 'Name the bottleneck first, then the storage split (metadata, blobs, hot state, vectors). Quantify: requests per second, tokens, dollars per million items.',
        zh: '系统设计围绕真实工作：标注平台、模型服务、数据管线、评测系统。先说瓶颈，再拆存储，一定给数量级和成本。',
      },
      {
        round: 'values',
        title: 'Values and safety conversation',
        format: '45 to 60 minutes with a researcher or senior staff. Open-ended, probing, no right answers but many wrong registers.',
        tests: 'Whether you have actually thought about capabilities and risk. Familiarity with the Responsible Scaling Policy and Constitutional AI at a conceptual level.',
        themes: [
          'when would you ship a capability and when would you hold it',
          'how you weigh helpfulness against harm in a product decision',
          'a time you pushed back on something you believed was unsafe or wrong',
          'what "alignment" means to you in engineering terms',
        ],
        tip: 'Bring one real story where you slowed something down for the right reason. Read the RSP summary and be able to explain ASL levels in your own words.',
        zh: '价值观/安全轮：考你是否真的想过能力与风险。读 RSP 和 Constitutional AI 的概要，用自己的话解释。准备一个你为正确理由踩过刹车的真实故事。',
      },
      {
        round: 'behavioral',
        title: 'Behavioral and team chemistry',
        format: 'Hiring manager and future teammates, 30 to 45 minutes each. Often the last stage.',
        tests: 'Collaboration across research, product, and safety. Learning fast under deadline. Ownership without ego.',
        themes: ['a hard technical problem and what transferred', 'balancing feasibility against ethics with several stakeholders', 'learning a new area under pressure', 'a disagreement you resolved with evidence'],
        tip: 'STAR with numbers. End each story with what you would do differently.',
        zh: '行为面和团队匹配：跨研究/产品/安全的协作，deadline 下快速学习。STAR 结构，带数字，结尾说你会怎么改进。',
      },
    ],
    reading: [
      { title: 'Responsible Scaling Policy (summary)', why: 'Expected background for the values round.' },
      { title: 'Constitutional AI: Harmlessness from AI Feedback', why: 'Know the idea, the loop, and its limits.' },
      { title: 'Core Views on AI Safety', why: 'The register interviewers listen for.' },
      { title: 'Claude model cards and system prompts', why: 'Shows you use the product like an engineer.' },
    ],
    sources: ['Public interview guides (IGotAnOffer, Glassdoor) and 2026 candidate reports on 1point3acres and Xiaohongshu.'],
  },
  {
    id: 'openai',
    name: 'OpenAI',
    short: 'OpenAI',
    tagline: 'Engineering velocity. Ideas into working code, fast, and comfortable ramping in a domain you do not know yet.',
    weeks: '6 to 8 weeks end to end; the virtual onsite is 4 to 6 hours over one or two days.',
    bar: 'Decentralised hiring: you may be considered by several teams at once. Generalists who ramp quickly are favoured.',
    culture: 'Pragmatic and product-minded. Show that you ship. Depth on hardware constraints and inference economics stands out.',
    stages: [
      {
        round: 'coding',
        title: 'Recruiter and technical phone screens',
        format: '30-minute recruiter call, then one or two 60-minute technical screens.',
        tests: 'Fluency. Can you write correct, idiomatic code while talking.',
        themes: ['classic algorithms with a practical framing', 'parsing and stream processing', 'concurrency basics'],
        tip: 'Narrate your plan before typing. Test with a tiny example before declaring done.',
        zh: '电面：流畅度。边说边写，先说计划再敲代码，结束前用小例子验证。',
      },
      {
        round: 'mlcoding',
        title: 'ML coding from scratch',
        format: '60 minutes, live. Implement a component with no framework magic.',
        tests: 'Whether you understand the math well enough to write it: shapes, numerics, and gradients.',
        themes: ['attention block or a small transformer', 'a training loop with proper eval and checkpointing', 'KV cache, quantisation, or speculative decoding sketch', 'tokeniser or data loader'],
        tip: 'Write shapes as comments on every tensor line. Know softmax stability and why layer norm goes where it goes.',
        zh: 'ML 手写编程：不靠框架，写 attention、训练循环、KV cache。每一行 tensor 注释 shape，说清数值稳定性。',
      },
      {
        round: 'design',
        title: 'System design',
        format: '60 minutes.',
        tests: 'Scaling training and inference: GPUs, networking, memory, cost.',
        themes: ['serving a frontier model to millions with tail latency targets', 'distributed training across thousands of accelerators', 'a feature store or eval pipeline for a product team'],
        tip: 'Talk in tokens per second, memory bandwidth, and dollars. Say which part you would build first.',
        zh: '系统设计：训练与推理的规模化。用 tokens/s、显存带宽、成本说话，说清先造哪一块。',
      },
      {
        round: 'debugging',
        title: 'ML debugging',
        format: '45 to 60 minutes. A model or pipeline that does not behave; find out why.',
        tests: 'Hypothesis discipline. Can you isolate a bug in a training run methodically.',
        themes: ['loss does not decrease although code looks right', 'eval numbers too good: leakage', 'NaNs after a few thousand steps', 'throughput collapsed after a change'],
        tip: 'Form three hypotheses, rank by likelihood times cost to test, then test the cheapest first. Say the bisect strategy out loud.',
        zh: 'ML 调试：训练 loss 不降、指标好得可疑、NaN、吞吐骤降。先列三个假设，按概率×验证成本排序，从最便宜的开始验。',
      },
      {
        round: 'research',
        title: 'Research discussion',
        format: '45 minutes on your past work and a paper of their choosing.',
        tests: 'Taste and honesty. What did you actually do, what would you do next, where does it break.',
        themes: ['your best project, end to end', 'a paper you disagree with and why', 'how you would evaluate a new capability'],
        tip: 'Have one project you can go five levels deep on. Know its failure modes better than its results.',
        zh: '研究讨论：一个能挖五层的项目，知道它在哪里会失败。',
      },
      {
        round: 'behavioral',
        title: 'Behavioral and culture',
        format: '45 minutes with the hiring manager.',
        tests: 'Ownership, speed, and handling ambiguity.',
        themes: ['shipping under uncertainty', 'a disagreement with a strong colleague', 'a time you were wrong'],
        tip: 'Show speed with judgment, not speed alone.',
        zh: '行为面：主人翁意识、速度、处理模糊。速度要配判断力。',
      },
    ],
    reading: [
      { title: 'Attention Is All You Need', why: 'You may be asked to write it.' },
      { title: 'Scaling laws and inference-cost papers', why: 'Frame every design answer.' },
      { title: 'OpenAI Model Spec', why: 'Shows product judgment.' },
    ],
    sources: ['Public research-engineer interview guides and 2025 to 2026 candidate reports.'],
  },
  {
    id: 'deepmind',
    name: 'Google DeepMind',
    short: 'DeepMind',
    tagline: 'A PhD defence crossed with an engineering exam. Fundamentals, research taste, and rigour.',
    weeks: '8 to 12 weeks. The loop is long and academic.',
    bar: 'Engineering acceptance is often quoted under 1 percent. The fundamentals quiz catches experienced people who stopped deriving things.',
    culture: 'Academic rigour and formal reasoning. Depth beats breadth. Citations welcome.',
    stages: [
      {
        round: 'quiz',
        title: 'Fundamentals quiz',
        format: '45 minutes of rapid questions, undergraduate depth, no notes.',
        tests: 'Linear algebra, probability, optimisation, and the geometry behind them.',
        themes: ['eigenvalues, SVD, rank and what they mean for compression', 'MLE vs MAP, Bayes, common distributions', 'forward vs reverse-mode autodiff', 'convexity, learning-rate intuition, gradient variance'],
        tip: 'Two weeks of textbook review beats a month of LeetCode for this round. Derive, do not recall.',
        zh: '基础知识快问快答：线代、概率、优化。用两周复习教材比刷题更有用，要会推导。',
      },
      {
        round: 'mlcoding',
        title: 'Coding and implementation',
        format: '60 minutes.',
        tests: 'Correct, efficient implementations of ML primitives and algorithms.',
        themes: ['implement a layer and its gradient', 'k-means, VAE loss, or beam search', 'numerically stable log-sum-exp style problems'],
        tip: 'State complexity and numerical concerns before coding.',
        zh: '编程：ML 原语和算法的正确高效实现，先说复杂度和数值问题。',
      },
      {
        round: 'debugging',
        title: 'ML debugging',
        format: '45 minutes.',
        tests: 'Same discipline as elsewhere, with more emphasis on the math behind the bug.',
        themes: ['dead ReLUs, exploding norms, wrong loss reduction', 'data leakage and eval contamination'],
        tip: 'Connect every symptom to a mechanism.',
        zh: 'ML 调试：每个症状对应一个机制。',
      },
      {
        round: 'design',
        title: 'System design',
        format: '60 minutes.',
        tests: 'Large-scale training and evaluation infrastructure.',
        themes: ['sharding a 100B-parameter model', 'reproducible large-scale evaluation', 'experiment tracking at lab scale'],
        tip: 'Be exact about memory per device and communication cost.',
        zh: '系统设计：大规模训练与评测基础设施，精确到每卡显存和通信开销。',
      },
      {
        round: 'research',
        title: 'Research discussion',
        format: '60 minutes, often with a paper sent in advance.',
        tests: 'Research taste: which directions are promising and why, and where a paper is weak.',
        themes: ['critique of a recent paper: assumptions, baselines, missing ablations', 'propose the next experiment', 'your own work, defended'],
        tip: 'Prepare a written one-page critique. Lead with the strongest limitation, not typos.',
        zh: '研究讨论：读论文找假设、基线、缺失的消融，提出下一个实验。',
      },
      {
        round: 'behavioral',
        title: 'Behavioral',
        format: '45 minutes.',
        tests: 'Collaboration in research teams, handling review, persistence.',
        themes: ['a project that failed and what you learned', 'working with a difficult collaborator'],
        tip: 'Humility with specifics.',
        zh: '行为面：研究团队协作、接受评审、坚持。具体而谦逊。',
      },
    ],
    reading: [
      { title: 'Deep Learning (Goodfellow) chapters 2 to 5', why: 'The quiz round, essentially.' },
      { title: 'Mathematics for Machine Learning (Deisenroth)', why: 'Derivations you will be asked to do live.' },
      { title: 'Two recent DeepMind papers in your area', why: 'For the research discussion.' },
    ],
    sources: ['Public research-engineer interview guides and candidate reports.'],
  },
  {
    id: 'meta',
    name: 'Meta (Superintelligence Labs, FAIR, GenAI)',
    short: 'Meta',
    tagline: 'Classic Big Tech loop with an ML depth round. Fast, structured, and heavily leveled.',
    weeks: '4 to 6 weeks.',
    bar: 'Standard Meta bar with leveling decided by the loop; ML teams add a depth interview.',
    culture: 'Move fast, impact, ownership. Behavioral signal counts toward level.',
    stages: [
      { round: 'coding', title: 'Two coding rounds', format: '45 minutes each, two problems per round.', tests: 'Medium-hard algorithms, clean and fast.', themes: ['graphs and intervals', 'two-pointer and heap problems', 'string parsing'], tip: 'Two problems in 45 minutes means eight minutes of talking and 14 of typing, twice.', zh: '两轮编程，每轮 45 分钟两题。中高难度，干净快速。' },
      { round: 'design', title: 'System or ML system design', format: '45 minutes.', tests: 'Product-scale design, and for ML roles a recommendation or ranking system end to end.', themes: ['news feed ranking', 'ads or recommendation pipeline', 'notification system at scale'], tip: 'Clarify the metric first, then the data flow, then the model, then serving.', zh: '系统/ML 系统设计：先明确指标，再数据流、模型、上线。' },
      { round: 'mlcoding', title: 'ML depth', format: '45 to 60 minutes.', tests: 'Depth in your subfield: training, evaluation, and failure modes.', themes: ['your strongest project in detail', 'trade-offs you made and why'], tip: 'Prepare one project to defend for an hour.', zh: 'ML 深度面：准备一个能讲一小时的项目。' },
      { round: 'behavioral', title: 'Behavioral', format: '45 minutes.', tests: 'Conflict, growth, impact, and scope.', themes: ['biggest impact', 'a conflict you resolved', 'feedback you received'], tip: 'Every story needs a number and a lesson.', zh: '行为面：影响力、冲突、成长。每个故事带数字和收获。' },
    ],
    reading: [{ title: 'Recent Llama technical reports', why: 'Shows familiarity with the stack.' }],
    sources: ['Public Meta interview guides.'],
  },
  {
    id: 'bigtech',
    name: 'Big Tech (Google, Apple, Amazon, Microsoft)',
    short: 'Big Tech',
    tagline: 'The standard loop, executed well. Coding, design, behavioral, leveling.',
    weeks: '4 to 8 weeks.',
    bar: 'Consistent bar across four to five rounds; one weak round is usually survivable, two are not.',
    culture: 'Each company has its rubric: Googleyness, Apple depth, Amazon leadership principles, Microsoft growth mindset.',
    stages: [
      { round: 'coding', title: 'Coding rounds', format: 'Two to three rounds, 45 minutes each.', tests: 'Algorithms and data structures with clear communication.', themes: ['graphs, DP, trees', 'design a small class with constraints'], tip: 'Optimal is expected; clean is what gets Hire instead of Lean Hire.', zh: '编程两到三轮：算法与数据结构。最优是预期，干净才能拿 Hire。' },
      { round: 'design', title: 'System design', format: '45 to 60 minutes.', tests: 'Scalable services and data systems.', themes: ['URL shortener to a global CDN', 'chat, feed, or payment systems', 'rate limiting and consistency'], tip: 'Requirements, estimates, high-level, deep dive, trade-offs. Every time.', zh: '系统设计五步：需求、估算、高层、深挖、取舍。' },
      { round: 'behavioral', title: 'Behavioral', format: '45 minutes.', tests: 'Company rubric.', themes: ['ownership', 'disagreement', 'ambiguity'], tip: 'Map your stories to the rubric words explicitly.', zh: '行为面：把故事对应到公司价值观关键词。' },
    ],
    reading: [{ title: "The company's published interview guide", why: 'Each one tells you the rubric.' }],
    sources: ['Company interview guides.'],
  },
];

export function loopFor(id: LabId): Loop {
  return LOOPS.find((l) => l.id === id) ?? LOOPS[0];
}
