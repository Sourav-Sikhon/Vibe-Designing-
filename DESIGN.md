---
name: AERONEX
description: A numbered architectural drawing set for one coordinated autonomous delivery network, drawn on warm paper with a single lime revision marker.
colors:
  paper: "#f8f9f7"
  paper-2: "#eff1ee"
  ink: "#141719"
  graphite: "#22292d"
  night: "#101416"
  lime: "#c7f36b"
  mute: "#737b80"
  mute-aa: "#5a6266"
  night-mute: "#a4adb1"
  hair: "rgb(20 23 25 / 0.14)"
  hair-strong: "rgb(20 23 25 / 0.32)"
  hair-night: "rgb(248 249 247 / 0.16)"
  hair-night-strong: "rgb(248 249 247 / 0.34)"
typography:
  display:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.75rem, 6.1vw, 6rem)"
    fontWeight: 500
    lineHeight: 0.98
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.125rem, 4.6vw, 4.25rem)"
    fontWeight: 500
    lineHeight: 1.02
    letterSpacing: "-0.035em"
  title:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.5rem, 2.2vw, 2rem)"
    fontWeight: 500
    lineHeight: 1.12
    letterSpacing: "-0.025em"
  lead:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.0625rem, 1.35vw, 1.3125rem)"
    fontWeight: 400
    lineHeight: 1.55
  body:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Geist Mono, ui-monospace, monospace"
    fontSize: "0.6875rem"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0.08em"
rounded:
  xs: "2px"
  sm: "4px"
  full: "50%"
spacing:
  gutter: "clamp(20px, 3.2vw, 48px)"
  section-y: "clamp(80px, 9.7vw, 140px)"
  column-gap: "clamp(12px, 1.6vw, 24px)"
  max-width: "1320px"
  nav-height: "76px"
components:
  button-primary:
    backgroundColor: "{colors.lime}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.sm}"
    padding: "0 22px"
    height: "48px"
  button-primary-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.lime}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "0 22px"
    height: "48px"
  button-ghost-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  title-block:
    textColor: "{colors.mute-aa}"
    typography: "{typography.label}"
    padding: "7px 12px"
  status-panel:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "10px 16px"
  night-sheet:
    backgroundColor: "{colors.night}"
    textColor: "{colors.paper}"
---

# Design System: AERONEX

## Overview

**Creative North Star: "The Numbered Drawing Set"**

The page is a set of sheets documenting one coordinated machine network. Each section is a sheet with a number (A-01 to A-11), a Geist Mono title block, hairline rules and, in the hero, an A-L column ruler on the 12-column grid. Paper is warm white, ink is charcoal, annotation is cool gray, and a single electric lime appears only as the revision marker: the primary action, the active sheet, the live-data dot. Night sheets (#101416) invert the same grammar rather than introducing a second one.

Imagery is procedural Three.js only: lit models of an autonomous EV, drone, ground robot and hub, rendered live in the hero and as stills elsewhere. No shipping rasters. Anything that looks like data is demonstration data and says so in the sheet itself.

Density is calm and architectural: large tight-tracked sans headlines, generous section padding, fine 1px lines instead of cards and shadows.

**Key Characteristics:**
- Warm paper, charcoal ink, cool-gray annotation; lime as rare accent.
- 1px hairlines, registration corners, tick rules, mono labels as furniture.
- Radii of 2-4px only; flat, no decorative shadow.
- Geist for everything read, Geist Mono for everything annotated.
- 0.35-0.9s ease-out motion, one curve, no loops except dashed flow lines.

## Colors

A near-monochrome paper-and-ink palette with one saturated accent used as a marker, never as a surface.

### Primary
- **Revision Lime** (`lime`): primary button fill, active sheet tick, status dot, text selection, logo node, lime emissive details on the 3D models, focus ring on night sheets. Carries meaning (action, "now", live) so it stays scarce.

### Neutral
- **Warm Drafting Paper** (`paper`): page ground, panels, nav when scrolled (at 96% opacity).
- **Paper Shade** (`paper-2`): image placeholders, hover fill of menu items, scrollbar track.
- **Charcoal Ink** (`ink`): text, primary hover fill, focus ring, strong rules.
- **Graphite** (`graphite`): scrollbar thumb, vehicle body in 3D.
- **Night Sheet** (`night`): dark sheets (Intelligence, Contact, footer), mobile menu.
- **Annotation Gray** (`mute`): brand secondary, for large text, rules and decorative marks only.
- **Annotation Gray AA** (`mute-aa`): the same hue darkened for small text on paper (the `.muted` class, all mono labels).
- **Night Annotation** (`night-mute`): secondary text on night sheets.
- **Hairlines** (`hair`, `hair-strong`, `hair-night`, `hair-night-strong`): 1px dividers and borders; strong variants for frames, title blocks and ruler ticks.

### 3D material roles
The 3D colour table mirrors the tokens (paper, ink, graphite, night, lime, mute) and adds scene-only neutrals: concrete (#e3e6e1, #cdd1cc), ground (#eceee9), glass (#0e1214), kraft package (#d9d6cc), and sage (#9db39a, #7f9b7d) for vegetation. Roles: painted clearcoat for vehicle bodies, matte for architecture and ground, dark glass for glazing, emissive lime for light details. Day scenes sit on #e9ece7 / #f3f5f1 with fog of the same value, so renders melt into the paper; the night scene uses #171d20 ground.

### Named Rules
**The Revision Marker Rule.** Lime marks action, "now" or live. It is never a background wash, never a heading colour, never decoration.
**The Two Grays Rule.** Small text uses `mute-aa`; `mute` is for large type, rules and 3D. Never set small text in `mute` on paper.
**The Same Grammar Rule.** Night sheets reuse the same furniture with paper-alpha hairlines; they do not get new devices.

## Typography

**Display and Body Font:** Geist (via `geist/font/sans`, fallback ui-sans-serif, system-ui), stylistic sets ss01 and cv11.
**Label/Mono Font:** Geist Mono (fallback ui-monospace).

**Character:** A precise, neutral grotesk set tight at display sizes, paired with a mono used the way a draughtsman letters annotations.

### Hierarchy
- **Display** (500, clamp 2.75rem to 6rem, 0.98, -0.04em): the hero headline only, max 11-12ch measure.
- **Headline** (500, clamp 2.125rem to 4.25rem, 1.02, -0.035em): section titles (`.h2`).
- **Title** (500, clamp 1.5rem to 2rem, 1.12, -0.025em): sub-sections and cards (`.h3`).
- **Lead** (400, clamp 1.0625rem to 1.3125rem, 1.55, max 52ch): intro paragraphs, in `mute-aa`.
- **Body** (400, 1.0625rem, 1.6): running copy; buttons and links at 0.9375rem/500.
- **Label** (Geist Mono, 0.6875rem, +0.08em, uppercase): title blocks, status rows, column letters, Fig. numbers, sample-data captions.

### Named Rules
**The Mono Is Annotation Rule.** Geist Mono is for drawing furniture and data captions. Never use it for headings or running copy.
**The Tracking Scales Rule.** Tighter tracking as size grows (-0.025em to -0.04em); wordmark alone is spaced out at +0.2em, weight 600.

## Layout

A 12-column grid (`grid12`, gap 12-24px) in a 1320px container with fluid gutters (20-48px). Sheets are full-width bands with vertical padding of 80-140px; the hero is 100svh with the headline bottom-left over a left-side paper scrim. A-L column letters with hairline left rules sit under the hero copy at md and up, with a title block right-aligned beneath. Below lg the hero scene becomes a 60svh band and copy flows underneath; the status panel moves into flow.

The sheet-index rail (fixed right, 11 ticks, 22px pitch) appears only at 1380px and wider. Primary navigation collapses to a full-screen night menu below lg. Breakpoints used: 768 (md), 1024 (lg), 1380 (rail).

## Elevation & Depth

Flat. Depth comes from hairline borders, tone shifts (paper to paper-2, paper to night) and the 3D scenes themselves. The one shadow in the UI is the nav dropdown: `0 24px 48px -24px rgb(20 23 25 / 0.28)`. The hero scrim and the 3D blob/contact shadows are the only other soft gradients.

### Named Rules
**The Flat Sheet Rule.** Panels are paper with a 1px `hair-strong` border. No offset or hard shadows, no glow on UI chrome.

## Shapes

Orthogonal and drafted: 4px radius on buttons, panels, images and menus; 3px on menu items; 2px on focus ring corners; 50% only for the 8px status dot. Registration corners are 18px L-shaped 1.5px ink strokes inset 14px from tile corners. Tick rules are 1px lines every 12px, 6px high. Models use small-radius rounded boxes in 3D, never organic blobs.

## Components

### Buttons
- **Shape:** 4px radius, 48px minimum height (44px in nav), 22px side padding, 15px/500 label, trailing 16px stroke arrow.
- **Primary:** lime fill, ink text, lime border. Hover inverts to ink fill with lime text (paper fill with ink text on night sheets). Arrow shifts 4px right.
- **Ghost:** transparent, 1px `hair-strong` border, ink text. Hover fills ink with paper text (inverse on night).
- **Focus:** 2px ink outline, 3px offset (lime on night sheets).
- Transitions 0.35s on colour and border, 0.4s on arrow, all on the ease-out curve.

### Link with arrow
Inline-flex, 15px/500, 1px underline in currentColor, 4px below; arrow shifts 5px on hover.

### Title block
Four-cell mono row (sheet number, name, scale, revision) with 1px `hair-strong` frame and dividers, 7px 12px cell padding. First cell in ink, the rest `mute-aa`. Decorative (aria-hidden), bottom right of a sheet.

### Status panel and sample-data captions
Paper panel, 4px radius, 1px strong border, mono rows separated by hairlines, lime dot with 1px ink ring (shape plus text carry the meaning, not colour). Always carries a "demo" or "sample" caption. Metrics are tagged "target" or "illustrative"; map markers and logs say "sample data".

### Navigation
Transparent over the hero, turning paper at 96% with a hairline and 10px blur after 24px scroll. Links 15px/500 with a 1px underline that scales in from the left over 0.5s. Dropdowns are 420px paper panels. Mobile is a full-screen night sheet revealed by a clip-path wipe (0.7s).

### Sheet index rail
Fixed right margin of ticks. Inactive: 12px by 1px at 45% opacity. Active ("now"): 28px by 3px lime with a 1px ink outline. Mono label (sheet number and name) appears on hover or focus. Flips to paper ink over night sheets.

### Hero callouts
Leader lines project from 3D anchors to HTML labels each frame: a mono FIG. 0N label in `mute-aa` plus a machine name, tied to vehicle, drone and robot.

### Tile registration corners
On hover or focus, four 18px corner marks fade and slide in from 8px while the still pushes in to 1.035 scale over 1.1s.

### Motion
One curve: `cubic-bezier(0.16, 1, 0.3, 1)`. Reveals rise 24px over 0.9s once; hero copy rises 28px with 0.12s stagger over 1.1s; counters count once over 1.6s; dashed flow lines run 1.6s linear; hairlines draw on. Reduced motion shows settled values and static states. Scroll drives the process sheet.

## Do's and Don'ts

### Do:
- **Do** give every new section a sheet number, a mono title block and `data-theme` so the rail and ink flip correctly.
- **Do** label any figure, map value or log as demonstration, sample, target or illustrative on the surface itself.
- **Do** use `mute-aa` for small text, and keep body text at or above 4.5:1.
- **Do** make new imagery procedural, lit from the existing material roles, on the paper or night ground.
- **Do** keep radii at 2-4px and borders at 1px hairlines.

### Don't:
- **Don't** use lime as a background wash, heading colour or decoration.
- **Don't** introduce shadows, glow or gradients on UI chrome beyond the existing dropdown.
- **Don't** replace the drawing furniture with a row of equal cards on stock photography.
- **Don't** use Geist Mono for headings or paragraphs.
- **Don't** ship raster photography or unlabelled metrics.
- **Don't** add looping, bouncing or constantly floating motion.

## Not canonized

Hard-coded hex strings in `ui.tsx` (logo) and `SheetRail.tsx`, and the stray red tail-light emissive (0xff5a4d) in the vehicle model, are build drift, not tokens.
