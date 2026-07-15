---
name: Serene Logic
colors:
  surface: '#f8fafa'
  surface-dim: '#d8dada'
  surface-bright: '#f8fafa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f4'
  surface-container: '#eceeee'
  surface-container-high: '#e6e8e9'
  surface-container-highest: '#e1e3e3'
  on-surface: '#191c1d'
  on-surface-variant: '#42474d'
  inverse-surface: '#2e3131'
  inverse-on-surface: '#eff1f1'
  outline: '#72787e'
  outline-variant: '#c2c7ce'
  surface-tint: '#3f627e'
  primary: '#3c5f7b'
  on-primary: '#ffffff'
  primary-container: '#557895'
  on-primary-container: '#fcfcff'
  inverse-primary: '#a7cbeb'
  secondary: '#4a654e'
  on-secondary: '#ffffff'
  secondary-container: '#c9e8cb'
  on-secondary-container: '#4e6952'
  tertiary: '#7f521f'
  on-tertiary: '#ffffff'
  tertiary-container: '#9b6a35'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#cbe6ff'
  primary-fixed-dim: '#a7cbeb'
  on-primary-fixed: '#001e30'
  on-primary-fixed-variant: '#254a65'
  secondary-fixed: '#cceace'
  secondary-fixed-dim: '#b0ceb2'
  on-secondary-fixed: '#07200f'
  on-secondary-fixed-variant: '#334d38'
  tertiary-fixed: '#ffdcbd'
  tertiary-fixed-dim: '#f7bb7e'
  on-tertiary-fixed: '#2c1600'
  on-tertiary-fixed-variant: '#663d0b'
  background: '#f8fafa'
  on-background: '#191c1d'
  surface-variant: '#e1e3e3'
  sage-muted: '#A3B8A5'
  blue-slate: '#4A667E'
  warm-sand: '#F2E8DF'
  canvas-bg: '#FBFCFC'
  node-border: '#E1E8ED'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 60px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  title-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '500'
    lineHeight: 28px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
  sidebar-width: 320px
  max-content-width: 1440px
---

## Brand & Style

The design system moves away from the technical density of traditional automation tools toward a "calm productivity" aesthetic. It targets non-technical users who may find logic-based workflows intimidating. The emotional response should be one of capability and tranquility—"I can build this without breaking anything."

The design style is a blend of **Soft Minimalism** and **Modern Corporate**. It prioritizes heavy whitespace, low-contrast UI boundaries, and a "breathable" layout. By reducing visual noise and utilizing soft color transitions, the interface feels like a guided experience rather than a complex engineering tool. The inclusion of a persistent sidebar chat interface emphasizes the "guided building" philosophy, acting as a supportive co-pilot throughout the user journey.

## Colors

The palette is anchored in "Soft Blues" and "Sages" to evoke stability and growth. 

- **Primary (Steel Blue):** Used for primary actions and active states. It provides enough contrast for legibility while remaining softer than pure black or navy.
- **Secondary (Sage):** Applied to success states, completion indicators, and "natural" flow elements.
- **Tertiary (Warm Sand):** Reserved for highlights or gentle warnings, offering a human touch to the logic-heavy environment.
- **Neutral (Cool Gray/White):** The background utilizes a near-white canvas to minimize eye strain and maximize the sense of openness.

Avoid using high-vibrancy reds or oranges (found in the reference data) except for critical destructive actions. Most "errors" should be presented in a muted terracotta to maintain the calm atmosphere.

## Typography

This design system uses **Plus Jakarta Sans** as the primary typeface for its soft, rounded terminals and approachable geometric construction. It feels modern and friendly without sacrificing professional clarity. 

For technical metadata and small labels, **Inter** is used to ensure maximum legibility at small scales. 

**Usage Guidelines:**
- Use `display-lg` exclusively for onboarding and empty-state "hero" moments.
- `title-md` is the standard for node titles within the workflow canvas.
- Maintain generous line heights (1.5x) for body text to keep instructions easy to digest.
- Avoid all-caps except for the smallest `label-sm` category to prevent the UI from "shouting" at the user.

## Layout & Spacing

The layout utilizes a **Fixed Grid** for administrative screens and a **Fluid Canvas** for the workflow builder.

- **Workflow Canvas:** Uses an invisible 8px dot grid. Nodes are spaced with a minimum of 48px between them to ensure the layout never feels cramped.
- **The Guide (Sidebar):** A fixed 320px sidebar on the right (or left) for the chat interface. It should use an internal padding of 24px to keep conversations readable.
- **Margins:** Generous 40px margins on desktop create a "frame" around the content, pushing the focus toward the center of the screen.
- **Responsive Behavior:** On tablets, the sidebar can be collapsed into a floating action button (FAB) or a bottom-sheet to preserve canvas space.

## Elevation & Depth

To maintain a "calm" feel, this design system avoids heavy shadows and high-contrast stacking. 

- **Tonal Layers:** The primary method of depth. The background is `#FBFCFC`, and primary containers (like the Chat Sidebar or Node Inspectors) use a pure white `#FFFFFF` surface.
- **Ambient Shadows:** Only used for "floating" elements like nodes or active menus. Shadows are extremely diffused: `0px 4px 20px rgba(90, 125, 154, 0.08)`. Note the subtle blue tint in the shadow to keep it integrated with the brand palette.
- **Ghost Borders:** Non-interactive containers use a 1px border in `#E1E8ED` instead of a shadow to define their boundaries without adding visual weight.
- **Glassmorphism:** Applied sparingly to the navigation header and floating toolbars to allow the workflow's colors to peek through, creating a sense of continuity.

## Shapes

The shape language is "Fully Rounded." 

- **Nodes & Cards:** Use a 16px (`rounded-lg`) corner radius to appear soft and tactile.
- **Buttons & Inputs:** Use an 8px (`rounded-md`) radius for a professional yet accessible feel.
- **Chat Bubbles:** Utilize a asymmetrical rounding (e.g., 16px on three corners, 4px on the bottom-trailing corner) to indicate directionality in the guided building experience.
- **Connection Lines:** In the workflow builder, lines between nodes should be curved (Bezier) rather than right-angled to maintain the "soft" visual narrative.

## Components

- **Nodes (Automation Steps):** Should look like soft cards with a colored left-accent bar (Sage for triggers, Blue for actions). Icons within nodes should be "duotone" and simplified.
- **Guided Chat Interface:** Uses a "message thread" metaphor. The AI's messages are styled in the `warm-sand` background to feel distinct and supportive.
- **Primary Buttons:** Use a solid `primary_color_hex` with white text. Hover states should simply involve a slight darkening of the hue, avoiding abrupt transitions.
- **Input Fields:** Soft gray backgrounds (`#F1F4F7`) that transition to a white background with a blue border on focus. This "pop" clearly indicates where the user is typing.
- **Chips:** Used for tags or data-mapping variables. They should be pill-shaped and use high-transparency versions of the primary/secondary colors (e.g., 10% opacity).
- **Empty States:** Use hand-drawn style illustrations or soft 3D shapes to guide the user to their first action, reinforcing the "non-technical" friendliness of the tool.