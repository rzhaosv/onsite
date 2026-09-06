# Onsite — 小红书 / XHS launch drafts

Positioning: honest, high-craft, no hype. The audience is Chinese-diaspora engineers preparing for frontier AI lab and Big Tech loops. They are smart, skeptical of 割韭菜, and they pay for things that look serious. Never promise offers. Never mention cheating tools except to say we do not build them.

Rules for every post:
- Lead with a specific, checkable fact about a real interview loop. Value first, product second.
- One screenshot per post, the scorecard or the loop breakdown. Never a mockup with fake numbers.
- Close with a soft line, not a CTA scream. 评论区 questions are the growth engine.
- Reply to every comment in the first 6 hours. That is the whole algorithm.

---

## Post 1 — 面经拆解 (the hook post)

**封面文案:** Anthropic 面试为什么这么难？拆给你看

**正文:**
把公开面经里 Anthropic 的流程整理了一遍，说几个大家最常踩的坑：

1️⃣ **线上笔试 90 分钟 4 题，很多人反馈要全对才进下一轮。** 不是脑筋急转弯，是速度 + 正确性。练法：定时四题套卷，边写边测，第 4 题写不完也别慌，前 3 题必须干净。

2️⃣ **编程轮是"四层递进"。** 给你一个 spec，每 15 分钟加一层需求。考的根本不是算法，是你第一版代码好不好扩展。第一层十分钟写完、留好扩展点，比一口气写个复杂版本有用得多。

3️⃣ **系统设计出真题。** 标注平台、模型服务、数据管线。一定要给数量级和成本，先说瓶颈再拆存储。

4️⃣ **价值观/安全轮最容易被低估。** 不要背口号，也不要装作无所谓——两种都会挂。准备一个"你为了正确的理由踩过刹车"的真实故事。

我把这些整理进了一个 app 叫 Onsite，每一轮该练什么、AI 面试官会追问、结束给你一张跟真实 debrief 一样的评分卡（Strong Hire / Hire / Lean No Hire / No Hire）。有中文解析。

不保证 offer。offer 是你自己刷出来的。我们只能保证你练的是对的东西。

#北美求职 #面经 #Anthropic #OpenAI #刷题 #转码 #大厂面试

---

## Post 2 — 评分卡 (the proof post)

**封面文案:** 我让 AI 面试官给我打了个分，它说 Hire 不是 Strong Hire

**正文:**
做了一轮 Anthropic 系统设计的模拟面试，题目是"设计一个百万级标注平台"。

我自认为答得不错：给了数量级、说了存储怎么拆、质量控制讲了三重标注 + kappa + 金标题。

评分卡给我 **Hire，不是 Strong Hire**。理由写得很扎心：

> 「用数字驱动设计、直接点到 lease 争用这个非显而易见的瓶颈，质量控制是专家级的。差在没算成本，也没提标注偏差与公平性——在 Anthropic 这两点是加分项。」

这就是我想要的反馈。不是"你很棒继续加油"，是告诉我差的那 20% 具体在哪。

顺带给了本周要做的三件事，第一条是"把同一个系统按每百万条算一次成本，练到 25 分钟内讲完"。

app 叫 Onsite。中文解析可以开。

#模拟面试 #系统设计 #北美求职 #面试准备 #AI工具

---

## Post 3 — 立场帖 (the trust post)

**封面文案:** 我不做面试作弊工具，说说为什么

**正文:**
最近很多"面试实时提词"的工具。我做面试准备 app，但明确不做这个，原因不是道德优越感，是三条实际的：

1. **会被发现。** 眼神、停顿、答案的形状都不一样。资深面试官一轮能感觉出来。
2. **代价不对称。** 被抓到不是"这次没过"，是 offer 撤回 + 公司内部记录。有些公司会同步给合作方。
3. **最关键：过了也接不住。** 靠提词进去，onboarding 三个月照样露馅，那时候损失的是简历上的一段经历。

Onsite 只做面试之前的事：轮次拆解、按你的日期做计划、会追问的模拟面试、诚实的评分卡。App 里有一条明确写着：不要在真实面试中使用任何外部辅助。

慢一点，但是你的。

#求职 #面试 #职场诚信 #北美找工作

---

## Post 4 — 计划帖 (the utility post)

**封面文案:** 距离面试还有 4 周，这个计划表拿去用

**正文:**
最常见的问题不是"该刷什么题"，是"顺序错了"。

一个 4 周计划长这样（ML 方向、系统强 ML 弱的人）：

**W1 补 ML 手写**：凭记忆写 attention 三遍标 shape；训练循环 + checkpoint 恢复，故意写坏再修；两套 90 分钟四题；读 Constitutional AI 写半页；一次 OpenAI ML coding 模拟；**一整天完整休息，不是奖励是计划的一部分**。

**W2 上规模设计**：标注平台带 QC 和成本；大模型服务的 batching 和 KV cache 预算；背三个估算锚点（显存 / tokens per second / 每百万 token 成本）。

**W3 价值观 + 故事**：六个 STAR 故事，每个压到两分钟；准备两个你真正相信的安全立场；把低于 Hire 的轮次重跑。

Onsite 会按你填的面试日期和你自己说的弱项自动生成，弱的轮次排在最前面。

休息日是排进去的，不是省出来的。这条比什么都重要。

#面试准备 #学习计划 #北美求职 #自律

---

## Post 5 — 情绪帖 (the resonance post, post last)

**封面文案:** 给还在准备的你

**正文:**
写给一种人：爸妈不太懂你具体在做什么，但知道你在"考一个很难的东西"；你每天六点半起来刷题，怕的不是失败，是让他们失望。

说三句话：

**第一，进度是你自己的。** 论坛上那个"三周拿 offer"的帖子不是你的基准线，你昨天的自己才是。

**第二，反馈要诚实的。** 只会夸你的准备是甜的毒药。你需要有人告诉你"这轮 Lean No Hire，因为你没给数字"。疼，但省时间。

**第三，没有任何工具能给你 offer。** 能给你 offer 的是那些你不想起床还是起了的早上。工具最多是路上的一块路牌——告诉你方向对不对，走还是你走。

Onsite 是我做的那块路牌。做得很认真，但也就是块路牌。

祝你面上。

#北美求职 #留学生 #努力 #成长 #面试

---

## Cadence
- Day 1: Post 1 (面经拆解). Day 3: Post 2 (评分卡). Day 6: Post 3 (立场). Day 9: Post 4 (计划). Day 13: Post 5 (情绪).
- Repeat the loop-breakdown format for OpenAI and DeepMind; those are posts 6 and 7.
- Reply to every comment within 6 hours. Answer the interview question in the comment itself; do not deflect to the app.

## Other channels
- **1point3acres**: one long post per lab, formatted as a 面经 summary with a footnote that the app exists. Do not lead with the app or it gets removed.
- **Reddit r/cscareerquestions**: story-first, product last, English version of Post 3 (the anti-cheating stance) performs best.
- **LinkedIn**: Post 4 (the plan) with the screenshot of the week view.
