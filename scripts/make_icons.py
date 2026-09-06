#!/usr/bin/env python3
"""Onsite icons: ink-navy ground, a gold waypoint mark (a bold chevron pointing up-right with a dot: the sign on the road)."""
import os
from PIL import Image, ImageDraw

ROOT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "assets")
NAVY = (11, 15, 20, 255); NAVY2 = (18, 24, 32, 255); GOLD = (245, 196, 81, 255); PAPER = (244, 246, 248, 255)

def draw(size, transparent=False):
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0) if transparent else NAVY)
    d = ImageDraw.Draw(img)
    u = size / 1024
    if not transparent:
        # subtle vignette square
        d.rounded_rectangle([60 * u, 60 * u, size - 60 * u, size - 60 * u], radius=int(120 * u), fill=NAVY2)
    # the mark: a thick upward chevron (like a road sign) in gold
    w = int(120 * u)
    pts = [(300 * u, 640 * u), (512 * u, 400 * u), (724 * u, 640 * u)]
    d.line(pts, fill=GOLD, width=w, joint="curve")
    for p in (pts[0], pts[2]):
        d.ellipse([p[0] - w / 2, p[1] - w / 2, p[0] + w / 2, p[1] + w / 2], fill=GOLD)
    d.ellipse([512 * u - w / 2, 400 * u - w / 2, 512 * u + w / 2, 400 * u + w / 2], fill=GOLD)
    # a paper dot above: the destination
    r = int(46 * u)
    d.ellipse([512 * u - r, 250 * u - r, 512 * u + r, 250 * u + r], fill=PAPER)
    return img

os.makedirs(ROOT, exist_ok=True)
draw(1024).convert("RGB").save(os.path.join(ROOT, "icon.png"))
fg = draw(1024, transparent=True)
c = Image.new("RGBA", (1024, 1024), (0, 0, 0, 0)); c.paste(fg.resize((680, 680), Image.LANCZOS), (172, 172)); c.save(os.path.join(ROOT, "adaptive-icon.png"))
s = Image.new("RGBA", (1024, 1024), (0, 0, 0, 0)); s.paste(fg.resize((600, 600), Image.LANCZOS), (212, 212)); s.save(os.path.join(ROOT, "splash-icon.png"))
draw(96, transparent=True).save(os.path.join(ROOT, "notification-icon.png"))
draw(64).convert("RGB").save(os.path.join(ROOT, "favicon.png"))
print("icons written")
