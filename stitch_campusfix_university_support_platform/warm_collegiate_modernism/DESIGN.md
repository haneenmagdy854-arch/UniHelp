---
name: Warm Collegiate Modernism
colors:
  surface: '#fbf9f3'
  surface-dim: '#dcdad4'
  surface-bright: '#fbf9f3'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3ee'
  surface-container: '#f0eee8'
  surface-container-high: '#eae8e2'
  surface-container-highest: '#e4e2dd'
  on-surface: '#1b1c19'
  on-surface-variant: '#414944'
  inverse-surface: '#30312d'
  inverse-on-surface: '#f2f1eb'
  outline: '#717973'
  outline-variant: '#c1c8c2'
  surface-tint: '#3d6754'
  primary: '#3a6350'
  on-primary: '#ffffff'
  primary-container: '#527c68'
  on-primary-container: '#edfff3'
  inverse-primary: '#a4d0b9'
  secondary: '#7a5649'
  on-secondary: '#ffffff'
  secondary-container: '#fdcdbc'
  on-secondary-container: '#795548'
  tertiary: '#336452'
  on-tertiary: '#ffffff'
  tertiary-container: '#4c7d6a'
  on-tertiary-container: '#edfff4'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#bfedd5'
  primary-fixed-dim: '#a4d0b9'
  on-primary-fixed: '#002115'
  on-primary-fixed-variant: '#254e3d'
  secondary-fixed: '#ffdbcf'
  secondary-fixed-dim: '#ebbcac'
  on-secondary-fixed: '#2e150b'
  on-secondary-fixed-variant: '#603f33'
  tertiary-fixed: '#b9eed6'
  tertiary-fixed-dim: '#9ed1bb'
  on-tertiary-fixed: '#002116'
  on-tertiary-fixed-variant: '#1d4f3e'
  background: '#fbf9f3'
  on-background: '#1b1c19'
  surface-variant: '#e4e2dd'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Inter
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 30px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.03em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.25rem
  gutter-tablet: 1rem
  gutter-mobile: 0.75rem
  margin: 2rem
  margin-tablet: 1.5rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system establishes an approachable, reassuring, and operationally rigorous environment for university service requests, facility repairs, and campus workflows. The identity bridges institutional stewardship with consumer-grade software polish: calm rather than chaotic, warm rather than sterile, and structured for swift resolution.

The visual style blends **Organic Tactility** with **Modern SaaS Dashboard Precision**. Natural campus architectural tones (limestone, terracotta, foliage, aged woodwork) soften traditional utilitarian ticketing software. UI elements rely on generous surface areas, soft boundaries, curved structural containers, and understated physical depth. 

The emotional response should evoke:
- **Trust & Accountability:** Administrative reliability without bureaucratic friction.
- **Relief & Clarity:** Immediate cognitive ease for stressed students and busy campus staff reporting issues.
- **Campus Pride:** An elevated, collegiate atmosphere honoring shared physical spaces.

## Colors

The palette is rooted in an organic collegiate atmosphere, moving away from harsh synthetic blues toward grounding greens, warm woods, and masonry neutrals.

### Palette Architecture
- **Primary (`#527C68` - Deep Sage Green):** Used for primary calls to action, selected active states, focused indicators, and prominent operational controls.
- **Secondary (`#795548` - Warm Brown):** Used for structural navigation anchors, institutional markers, metadata tags, and warm secondary actions.
- **Tertiary (`#A8DCC5` - Mint Green):** Accent tone for highlights, status tint fills, badge backdrops, and active soft badges.
- **Dark Supporting Accents:**
  - **Dark Olive (`#354B3E`):** High-emphasis headers, top-tier interactive emphasis, and deep iconography.
  - **Dark Brown (`#4B382E`):** Primary body text, table data cells, and strong semantic borders.
- **Neutral Foundations:**
  - **Canvas Base (`#FAF8F2` - Cream White):** Main screen canvas, reducing glare during extended operations.
  - **Surface Layer 1 (`#F3EBDD` - Warm Beige):** Card backdrops, table header rows, sidebars, and structural wells.
  - **Surface Layer 2 / Borders (`#DCCDB8` - Soft Sand):** Dividers, inactive border strokes, and recessed inputs.

### Semantic Status Badges
Status indicators must balance legibility with low visual fatigue:
- **Pending:** Soft Yellow background (`#FDF5D9`) with Dark Amber text (`#8C630D`) and subtle border (`#F5D98E`).
- **In Progress:** Mint tint background (`#EDF7F2`) with Deep Sage text (`#354B3E`) and Mint border (`#A8DCC5`).
- **Resolved:** Muted Emerald background (`#E6F4EA`) with Forest text (`#1E5E3A`) and border (`#A3D9B1`).
- **Returned / Reassigned:** Soft Teal background (`#E0F2F1`) with Deep Teal text (`#004D40`) and border (`#80CBC4`).
- **Urgent / Hazard:** Muted Terracotta tint (`#FBEEE8`) with Deep Terracotta text (`#8E3618`) and border (`#D98C70`).

## Typography

The type system prioritizes exceptional legibility across dense administrative tables, mobile defect reporting, and institutional dispatch boards.

- **Primary Font Family:** Inter is configured for universal numerical tabular clarity, neutral form inputs, and crisp multi-scale rendering.
- **Bilingual & Localization Parity:** When rendering Arabic alongside or instead of English, fall back cleanly to `Cairo` or `Tajawal`. Ensure Arabic line-heights are bumped by 10-15% across all levels to maintain baseline optical balance without clipping ascenders/descenders.
- **Numbers & Data:** Enable `tnum` (tabular numbers) across ticket counts, floor room numbers, dispatch timestamps, and metric summary tiles.

## Layout & Spacing

The layout is built on a responsive 12-column grid designed for dense information tracking paired with comfortable viewing regions:

- **Desktop (1024px+):** 12-column fluid grid inside a 1440px maximum container. Margins: `2rem` (`space-xl`), Gutters: `1.25rem`. Sidebar navigation is docked left at a fixed `260px` width.
- **Tablet (768px - 1023px):** 8-column layout. Margins: `1.5rem` (`space-lg`), Gutters: `1rem` (`space-md`). Secondary sidebars collapse into overlay slide-overs or tab bars.
- **Mobile (under 768px):** 4-column layout. Margins: `1rem` (`space-md`), Gutters: `0.75rem`. Views collapse into a single vertical sequence with bottom-pinned primary navigation and floating quick-action buttons.

Component internal rhythm strictly leverages the `space-*` scale to maintain alignment between complex form fields, activity timelines, and tabular matrices.

## Elevation & Depth

Visual hierarchy combines warm tonal surface stacking with ambient diffuse shadows tinted by foliage and earth pigments, steering clear of stark artificial black dropshadows.

- **Level 0 (Flat / Canvas):** Surface color `#FAF8F2`. Background workspace for tables and boards.
- **Level 1 (Structural Cards / Panels):** Surface `#FFFFFF` or `#F3EBDD`, paired with a 1px border of `#DCCDB8`. Shadow: `0 2px 8px -2px rgba(75, 56, 46, 0.05), 0 1px 3px 0 rgba(75, 56, 46, 0.03)`.
- **Level 2 (Hovered Cards & Dropdowns):** Shadow: `0 8px 16px -4px rgba(53, 75, 62, 0.08), 0 2px 6px -1px rgba(75, 56, 46, 0.04)`. Border remains `#DCCDB8`.
- **Level 3 (Modals & Sticky Slide-outs):** Surface `#FFFFFF`. Shadow: `0 16px 32px -8px rgba(53, 75, 62, 0.12), 0 4px 12px -2px rgba(75, 56, 46, 0.06)`. Accompanied by a 24% opacity backdrop scrim tinted with `#354B3E`.

## Shapes

The interface embraces organic curvature to soften administrative rigidity:

- **Cards & Data Panels:** Styled with `rounded-2xl` (1rem to 1.5rem depending on viewport scale) to emphasize warmth and separation between tasks.
- **Inputs & Form Controls:** Standardized to `rounded-xl` (0.75rem to 1rem) for an ergonomic, tactile capture experience.
- **Chips, Pills, & Status Badges:** Fully rounded (`rounded-full`) to immediately contrast against rectangular input cards.
- **Buttons:** Medium curvature (`rounded-lg` / `rounded-xl`) matching adjacent input elements to maintain unified form baselines.

## Components

### Buttons
- **Primary:** Background `#527C68`, text `#FFFFFF`, border none, hover background `#354B3E`. Height: 44px (touch/desktop parity). Border-radius: `rounded-xl`. Active state transforms subtly to 98% scale.
- **Secondary:** Background `#F3EBDD`, text `#4B382E`, border 1px solid `#DCCDB8`, hover background `#FAF8F2` with border `#527C68`.
- **Destructive/Critical:** Background `#FBEEE8`, text `#8E3618`, border 1px solid `#D98C70`, hover background `#D98C70` with text `#FFFFFF`.

### Chips & Status Badges
- Built as full pill shapes (`rounded-full`) with `0.25rem` vertical and `0.75rem` horizontal padding.
- Typography: `label-sm` or `label-md` with `600` weight.
- Always include an internal leading 6px colored dot indicator for enhanced color-blind accessibility.

### Input Fields & Controls
- Base background `#FFFFFF` framed by a 1.5px border of `#DCCDB8`.
- Focused state: border `#527C68` with a 3px soft focus ring of `rgba(168, 220, 197, 0.4)`.
- Helper and placeholder text set in `#795548` at 65% opacity. Error states use `#D98C70` with inline validation iconography.

### Checkboxes & Radios
- Size: 20x20px with `rounded-md` (checkbox) and `rounded-full` (radio).
- Inactive: border 1.5px `#DCCDB8`, background `#FAF8F2`.
- Active: background `#527C68`, border `#527C68`, inner icon/dot pure white `#FFFFFF`.

### Cards & Ticket Containers
- Primary card: background `#FFFFFF`, border 1px solid `#DCCDB8`, border-radius `rounded-2xl`, internal padding `space-lg`.
- Highlighted / Selected card: soft mint background tint `#F4FAF7` and 1.5px border `#527C68`.

### Tables & Data Grids
- Header row: background `#F3EBDD`, uppercase text in `label-sm`, color `#4B382E`, bottom border 1.5px `#DCCDB8`.
- Table rows: alternating row zebra striping using `#FAF8F2` and `#FFFFFF`. Hover row transition to `#F7F4EC`.
- Cells: vertical padding `space-md`, horizontal padding `space-md`, inline status pills and building/room tags anchored cleanly to column starts.

### Tabs & Navigation Pills
- Container: pill well with background `#F3EBDD` and `space-xs` inner padding.
- Active Tab: background `#FFFFFF`, text `#354B3E`, shadow level 1, border-radius `rounded-lg`.
- Inactive Tab: text `#795548`, hover text `#4B382E`.