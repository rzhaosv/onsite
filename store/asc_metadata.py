"""Set Onsite App Store metadata + screenshots via ASC API. Idempotent. Run from landed/.credentials with PYTHONPATH=."""
import asc, json, os, glob, time
APP='6809073495'
SUBS=('6809073904','6809074565')
SHOTS=sorted(glob.glob('/Users/raymondzhao/workspace/onsite/store/screenshots/0*.png'))
DESC="""Preparation for the interview loops at Anthropic, OpenAI, Google DeepMind, Meta and Big Tech. What each round actually tests, a plan built backwards from your interview date, an AI interviewer that asks the follow-ups, and a debrief scorecard written the way a real one is written.

THE LOOPS, ROUND BY ROUND
Anthropic's ninety-minute online assessment, its four-level coding round where requirements are added as you build, its ML system design problems, and the values and safety conversation. OpenAI's ML coding from scratch, system design in tokens and dollars, and ML debugging. DeepMind's fundamentals quiz and research critique. Meta and Big Tech loops too. For every round: the format, what it is really testing, the themes that recur, and how to prepare for it specifically.

A PLAN BUILT TO YOUR DATE
Tell Onsite when the interview is and where you are weak. You get a week-by-week plan that front-loads your worst round, with concrete tasks, reading, scheduled mocks and scheduled rest.

MOCK ROUNDS WITH REAL FOLLOW-UPS
Not a list of questions. An interviewer that opens the round, pushes on the vague parts, asks for numbers, and goes one level deeper, then ends the round the way a real one ends.

A DEBRIEF SCORECARD, NOT A PAT ON THE BACK
Strong Hire, Hire, Lean No Hire, No Hire. Scored by dimension, with what worked, what was missing, and the three drills to do this week. It is calibrated to be honest, because flattery costs you the offer.

DRILLS THAT COME BACK
A graded question bank on spaced repetition. Answer weakly and the card returns tomorrow; answer well and it returns in weeks.

STORIES, SHARPENED
Your STAR stories rewritten into two-minute answers using only your own facts. Nothing invented; missing numbers are marked for you to fill.

中文解析
Turn on Chinese coaching notes and they appear under every scorecard, drill grade and loop round. The practice itself stays in English, because the interviews are.

PRIVATE
No account and no sign-in. Your plan, transcripts, grades and stories stay on your device.

HONEST ABOUT WHAT THIS IS
Onsite is independent and not affiliated with, endorsed by or connected to any company named here. Loop descriptions come from public sources and change without notice. Mock interviews are simulations, not predictions. This is preparation before an interview, never assistance during one. No offer is guaranteed: the reps are yours.

ONSITE PRO
Your plan, one full mock with its scorecard, ten graded drills and one sharpened story are free. Onsite Pro unlocks unlimited mocks, the full drill bank with grading, and unlimited story sharpening: weekly with a 3-day free trial, or yearly. Payment is charged to your Apple ID at confirmation of purchase or when the trial ends. Subscriptions renew automatically unless cancelled at least 24 hours before the end of the period. Manage or cancel in your Apple ID settings.

Terms of Use (EULA): https://tryforma.app/onsite/terms.html
Privacy Policy: https://tryforma.app/onsite/privacy.html"""
KEYWORDS="interview prep,mock interview,system design,ai interview,coding interview,tech interview,faang,ml,career,面经"
PROMO="Round-by-round prep for Anthropic, OpenAI and DeepMind loops. A plan for your weeks, an AI interviewer that asks follow-ups, and a scorecard that tells you the truth."
def ok(r,what):
    if 'data' in r: return r['data']
    print('FAIL',what,json.dumps(r)[:600]); return None
v=asc.api('GET',f'/v1/apps/{APP}/appStoreVersions?filter[platform]=IOS&limit=1&fields[appStoreVersions]=versionString,appStoreState')['data'][0]
VID=v['id']; print('version', v['attributes'])
locs=asc.api('GET',f'/v1/appStoreVersions/{VID}/appStoreVersionLocalizations')['data']
en=next((l for l in locs if l['attributes']['locale']=='en-US'),None)
attrs={'description':DESC,'keywords':KEYWORDS[:100],'promotionalText':PROMO[:170],'supportUrl':'https://tryforma.app/onsite/','marketingUrl':'https://tryforma.app/onsite/'}
if en: r=asc.api('PATCH',f"/v1/appStoreVersionLocalizations/{en['id']}",{'data':{'type':'appStoreVersionLocalizations','id':en['id'],'attributes':attrs}})
else: r=asc.api('POST','/v1/appStoreVersionLocalizations',{'data':{'type':'appStoreVersionLocalizations','attributes':dict(attrs,locale='en-US'),'relationships':{'appStoreVersion':{'data':{'type':'appStoreVersions','id':VID}}}}})
en=ok(r,'version loc'); print('version localization ok')
infos=asc.api('GET',f'/v1/apps/{APP}/appInfos')['data']
for info in infos:
    il=asc.api('GET',f"/v1/appInfos/{info['id']}/appInfoLocalizations")['data']
    l=next((x for x in il if x['attributes']['locale']=='en-US'),None)
    a={'subtitle':'Mock rounds & real scorecards','privacyPolicyUrl':'https://tryforma.app/onsite/privacy.html'}
    if l: r=asc.api('PATCH',f"/v1/appInfoLocalizations/{l['id']}",{'data':{'type':'appInfoLocalizations','id':l['id'],'attributes':a}})
    else: r=asc.api('POST','/v1/appInfoLocalizations',{'data':{'type':'appInfoLocalizations','attributes':dict(a,locale='en-US'),'relationships':{'appInfo':{'data':{'type':'appInfos','id':info['id']}}}}})
    print('appInfo loc', 'ok' if 'data' in r else json.dumps(r)[:300])
    r=asc.api('PATCH',f"/v1/appInfos/{info['id']}",{'data':{'type':'appInfos','id':info['id'],'relationships':{'primaryCategory':{'data':{'type':'appCategories','id':'EDUCATION'}},'secondaryCategory':{'data':{'type':'appCategories','id':'BUSINESS'}}}}})
    print('categories', 'ok' if 'data' in r else json.dumps(r)[:300])
r=asc.api('PATCH',f'/v1/apps/{APP}',{'data':{'type':'apps','id':APP,'attributes':{'contentRightsDeclaration':'DOES_NOT_USE_THIRD_PARTY_CONTENT'}}}); print('content rights', 'ok' if 'data' in r else json.dumps(r)[:200])
r=asc.api('PATCH',f'/v1/appStoreVersions/{VID}',{'data':{'type':'appStoreVersions','id':VID,'attributes':{'copyright':'2026 RZ International LLC','releaseType':'AFTER_APPROVAL'}}}); print('version attrs', 'ok' if 'data' in r else json.dumps(r)[:200])
rd=asc.api('GET',f'/v1/appStoreVersions/{VID}/appStoreReviewDetail')
NOTES=('Onsite is an educational interview-preparation app with no account or sign-in. FLOW: onboarding asks which companies you are interviewing at, your role, your interview date and a free-text background, then builds a week-by-week study plan via our server (Google Gemini). '
 'TABS: Today (plan + readiness + start a mock), Loops (static, curated round-by-round descriptions of publicly reported interview processes), Drill (practice questions; you type an answer and the model grades it 0-5 against listed key points), Stories (your own STAR stories; the model rewrites them for delivery without inventing facts), Me (settings, restore purchases, disclaimers). '
 'MOCK: pick a company and round, the model plays the interviewer for that round with follow-ups, and "End" produces a simulated debrief scorecard (Strong Hire / Hire / Lean No Hire / No Hire) with per-dimension notes. It is clearly labelled a simulation. '
 'IMPORTANT: this app is preparation BEFORE an interview only. It provides no real-time or on-screen assistance during a live interview, has no screen capture, no overlay and no audio listening, and the Terms explicitly prohibit use during an interview where outside help is not permitted. '
 'Company names (Anthropic, OpenAI, Google DeepMind, Meta) are used descriptively to identify publicly reported interview formats. The app states in onboarding, on the Me tab, on the paywall, in the description and in the Terms that it is independent, not affiliated with or endorsed by any of them, and that no offer is guaranteed. No company logos or trademarks are used. '
 'Free tier: plan, 1 mock with scorecard, 10 graded drills, 1 sharpened story. Onsite Pro (weekly with 3-day trial, or yearly) unlocks unlimited use. Restore Purchases is on the Me tab and the paywall. No demo account needed.')
ra={'contactFirstName':'Ruihao','contactLastName':'Zhao','contactPhone':'+14155550100','contactEmail':'ray@thezenithlabs.com','demoAccountRequired':False,'notes':NOTES}
if rd.get('data'): r=asc.api('PATCH',f"/v1/appStoreReviewDetails/{rd['data']['id']}",{'data':{'type':'appStoreReviewDetails','id':rd['data']['id'],'attributes':ra}})
else: r=asc.api('POST','/v1/appStoreReviewDetails',{'data':{'type':'appStoreReviewDetails','attributes':ra,'relationships':{'appStoreVersion':{'data':{'type':'appStoreVersions','id':VID}}}}})
print('review detail', 'ok' if 'data' in r else json.dumps(r)[:300])
if en and SHOTS:
    sets=asc.api('GET',f"/v1/appStoreVersionLocalizations/{en['id']}/appScreenshotSets?fields[appScreenshotSets]=screenshotDisplayType")['data']
    st=next((s for s in sets if s['attributes']['screenshotDisplayType']=='APP_IPHONE_67'),None)
    if not st: st=ok(asc.api('POST','/v1/appScreenshotSets',{'data':{'type':'appScreenshotSets','attributes':{'screenshotDisplayType':'APP_IPHONE_67'},'relationships':{'appStoreVersionLocalization':{'data':{'type':'appStoreVersionLocalizations','id':en['id']}}}}}),'set')
    have=[x['attributes']['fileName'] for x in asc.api('GET',f"/v1/appScreenshotSets/{st['id']}/appScreenshots?fields[appScreenshots]=fileName")['data']]
    for f in SHOTS:
        if os.path.basename(f) in have: continue
        r=asc.upload_asset('/v1/appScreenshots',{'data':{'type':'appScreenshots','attributes':{'fileName':os.path.basename(f)},'relationships':{'appScreenshotSet':{'data':{'type':'appScreenshotSets','id':st['id']}}}}},f,'appScreenshots')
        print('  shot', os.path.basename(f), 'ok' if 'data' in r else json.dumps(r)[:200])
for sid in SUBS:
    cur=asc.api('GET',f'/v1/subscriptions/{sid}/appStoreReviewScreenshot')
    if cur.get('data'): print('sub', sid, 'review shot exists'); continue
    r=asc.upload_asset('/v1/subscriptionAppStoreReviewScreenshots',{'data':{'type':'subscriptionAppStoreReviewScreenshots','attributes':{'fileName':'paywall.png'},'relationships':{'subscription':{'data':{'type':'subscriptions','id':sid}}}}},'/Users/raymondzhao/workspace/onsite/store/screenshots/paywall.png','subscriptionAppStoreReviewScreenshots')
    print('sub', sid, 'review shot', 'ok' if 'data' in r else json.dumps(r)[:300])
time.sleep(3)
for sid in SUBS: print('sub state', asc.api('GET',f'/v1/subscriptions/{sid}?fields[subscriptions]=name,state')['data']['attributes'])
print('DONE')
