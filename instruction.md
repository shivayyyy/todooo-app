# CivicTask Pro — Product Requirements Document
### v2.0 · Three-Feature UPSC Productivity Web App
**Calendar · Todo Planner · Answer Writing Tracker**

---

| Field | Value |
|---|---|
| Document Version | v2.0 |
| Status | Draft — For Design & Engineering Review |
| Date | April 2026 |
| Target Beta | Q3 2026 |
| Target GA | Q4 2026 |
| Design System | Dark Premium — Navy / Gold / Violet · Fully Responsive Web |

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Product Scope — The Three Features](#2-product-scope--the-three-features)
3. [User Personas](#3-user-personas)
4. [Feature 1 — Smart Calendar](#4-feature-1--smart-calendar)
5. [Feature 2 — Todo Planner](#5-feature-2--todo-planner)
6. [Feature 3 — Answer Writing Tracker](#6-feature-3--answer-writing-tracker)
7. [Design System — Premium Dark Theme](#7-design-system--premium-dark-theme)
8. [Screen-by-Screen Specifications](#8-screen-by-screen-specifications)
9. [Navigation Architecture](#9-navigation-architecture)
10. [Non-Functional Requirements](#10-non-functional-requirements)
11. [Technical Architecture](#11-technical-architecture)
12. [Release Roadmap](#12-release-roadmap)
13. [Open Questions](#13-open-questions)
14. [Appendix](#14-appendix)

---

## 1. Executive Summary

CivicTask Pro v2.0 is a laser-focused, premium dark-theme web application built around three indispensable features for UPSC aspirants — a smart **Calendar**, a structured **Todo Planner**, and an **Answer Writing Tracker**. Everything else has been cut. This document defines the complete product scope, design system, and screen-by-screen specifications for the engineering and design teams.

The core insight driving this simplification: UPSC aspirants do not need fifty features — they need three features done extraordinarily well, with the depth and intelligence that generic productivity apps completely lack.

> **Why These Three?**
> **Calendar** — aspirants lose weeks to poor schedule planning. **Todo Planner** — the syllabus spans 25+ subjects; tracking without a system is chaos. **Answer Writing Tracker** — UPSC Mains is won or lost entirely on answer quality; this is the single most neglected area in all preparation tools, and no existing productivity app addresses it.

---

## 2. Product Scope — The Three Features

The entire product is defined by exactly three features. Every design decision, technical choice, and UX pattern must serve one or more of these three pillars.

| # | Feature | Core Job-to-be-Done | UPSC Relevance |
|---|---|---|---|
| F1 | Smart Calendar | See and manage all study sessions, deadlines, and events on a unified time canvas | Schedule Prelims/Mains dates, exam windows, mock test days, revision blocks |
| F2 | Todo Planner | Create, organise, prioritise, and track tasks mapped to the UPSC syllabus | Cover all 25+ subjects systematically; never miss a topic; track completion % |
| F3 | Answer Writing Tracker | Log, review, and improve answer writing practice — the single biggest Mains differentiator | Track questions attempted, word count, time taken, self-scores, and writing patterns |

---

## 3. User Personas

### 3.1 Primary — Full-Time UPSC Aspirant

| Field | Detail |
|---|---|
| Name / Age | Arjun Sharma, 24 — Delhi |
| Stage | Post-Prelims; preparing for Mains (GS I–IV + Essay + Optional) |
| Daily Routine | 10–12 hours study; uses 2–3 reference books per subject + newspaper |
| Device | Android phone (primary), budget Windows laptop (secondary) |
| Calendar Need | Block study slots per subject; track exam dates; see week at a glance |
| Planner Need | Syllabus-mapped tasks; subject-wise completion; revision queues |
| Answer Writing Need | Log daily GS answers; see word count trends; track improvement over months |
| Key Frustration | "I lose track of which topics I have and haven't covered. I never review my old answers." |

### 3.2 Secondary — Working Professional Aspirant

| Field | Detail |
|---|---|
| Name / Age | Priya Nair, 28 — Bengaluru |
| Stage | First attempt; preparing alongside a software engineering job |
| Daily Routine | 3–4 hours weekdays; 8 hours weekends |
| Device | iPhone + MacBook |
| Calendar Need | Overlay work meetings with study blocks; protect weekend hours |
| Planner Need | Weekly task chunks; smart reprioritisation when work overruns |
| Answer Writing Need | Track weekly answer writing targets; flag when she misses practice days |
| Key Frustration | "I keep planning to write answers but always skip it. I need accountability." |

---

## 4. Feature 1 — Smart Calendar

> A dark-themed, responsive calendar that lets aspirants schedule study sessions, deadlines, exam dates, and revision blocks across Day / Week / Month views. Tasks from the Todo Planner automatically surface as calendar events.

### 4.1 Calendar Views

| View | Description | Default Trigger |
|---|---|---|
| Month View | Full month grid; each day shows up to 3 event chips with overflow "+N more" | Default landing view |
| Week View | Horizontal time-slot grid (30-min slots); drag-and-drop events; primary scheduling view | Click any day in Month View |
| Day View | Single-day detail with time blocks; ideal for dense study days | Click any day in Week View |
| Agenda View | Scrollable list of upcoming events across days; mobile-optimised | Toggle via view switcher |

### 4.2 Event Types

| Event Type | Colour | Source | Editable? |
|---|---|---|---|
| Study Session | Violet `#6C63FF` | Manual or from Todo Planner | Yes |
| UPSC Exam Date | Gold `#C9A84C` | Pre-loaded UPSC calendar + manual | Exam dates read-only; custom yes |
| Mock Test | Teal `#0D9488` | Manual | Yes |
| Revision Block | Amber `#D97706` | Auto-generated by Planner | Yes |
| Answer Writing Session | Pink `#DB2777` | Auto from Answer Writing Tracker | Yes |
| Personal / Other | Slate `#64748B` | Manual | Yes |

### 4.3 Functional Requirements

- Users can create events by clicking any empty time slot or the **+ Add** button.
- Events support: title, type, date/time, duration, subject tag, notes, and recurrence (daily / weekly / custom).
- Drag-and-drop reschedule in Week and Day views on desktop; long-press + drag on mobile.
- Pre-loaded UPSC exam calendar for the 2025–2026 cycle (Prelims notification, Prelims date, Mains dates, Interview window).
- Mini calendar (month thumbnail) always visible in the left sidebar on desktop.
- Colour legend always visible; user can customise event type colours in Settings.
- Keyboard shortcuts: `N` = new event, `T` = today, `W/M/D` = switch views, arrow keys = navigate.
- Responsive: Month view on mobile collapses to a week-strip at top + agenda list below.

### 4.4 Calendar Analytics Strip

A non-intrusive analytics bar at the top of the Calendar page shows:

- Study hours this week vs target
- Days with 0 study sessions this month (streak gap indicator)
- Most studied subject this week
- Next UPSC milestone countdown (e.g., "Prelims in 47 days")

---

## 5. Feature 2 — Todo Planner

> A UPSC-syllabus-aware task management system with priority levels, subject tags, due dates, sub-tasks, and syllabus coverage tracking. Tasks can be promoted to Calendar events with one click.

### 5.1 Task Anatomy

| Field | Type | Required? | Notes |
|---|---|---|---|
| Title | Short text (max 200 chars) | Yes | — |
| Subject Tag | Dropdown — UPSC syllabus tree | Recommended | GS I / II / III / IV / Essay / CSAT / Optional / Personal |
| Topic Tag | Sub-dropdown from Subject Tag | Optional | e.g., "Fundamental Rights" under GS II |
| Priority | Enum: Critical / High / Medium / Low | Yes | Colour-coded: Red / Orange / Blue / Grey |
| Due Date | Date picker | Optional | Overdue items auto-escalate to Critical |
| Sub-tasks | Checklist (max 15 items) | Optional | Inline mini-checklist within task card |
| Notes | Rich text block | Optional | Supports markdown-style formatting |
| Status | Enum: To Do / In Progress / Done / Deferred | Auto | Default: To Do |
| Recurrence | None / Daily / Weekly / Custom | Optional | — |
| Linked Calendar Event | Event reference | Optional | Created via "Schedule on Calendar" action |

### 5.2 Planner Views

| View | Description |
|---|---|
| Today | Tasks due today + overdue. Primary working view. Smart-sorted by priority then deadline. |
| This Week | All tasks across the current week grouped by day. Shows daily task load balance. |
| All Tasks | Full task list with filters and sort. Used for review and planning sessions. |
| By Subject | Tasks grouped by UPSC subject with per-subject completion % progress bar. |
| Syllabus Map | Visual tree of the entire UPSC syllabus; topics with tasks show completion states. |

### 5.3 Syllabus Coverage Engine

- Every subject is pre-loaded with its official UPSC topics as leaf nodes in a tree.
- When a user marks a task tagged to a topic as Done, that topic is marked **Covered** (green).
- If no revision task follows within 14 days, the topic reverts to **Needs Revision** (amber).
- Subject-level completion % = (Covered topics ÷ Total topics) × 100.
- A coverage ring (donut chart) per subject is visible in the By Subject view and sidebar.

### 5.4 Functional Requirements

- **Quick-add**: pressing `Q` anywhere opens a command-palette-style input bar; press Enter to save with defaults.
- Drag tasks between days in the Week view.
- **Bulk actions**: select multiple tasks → mark done / defer / delete / change priority.
- Smart overdue escalation: tasks past due date auto-move to Today view with a red "Overdue" badge.
- **"Schedule on Calendar"** button on any task card opens a time-slot picker and creates a linked calendar event.
- Filters: Subject / Priority / Status / Date range — fully combinable.
- Keyboard: `N` = new task, `E` = edit focused task, `D` = mark done, `Esc` = close panel.

---

## 6. Feature 3 — Answer Writing Tracker

> **Why this feature?** UPSC Mains is entirely written. Answer writing is the single biggest differentiator between selection and rejection — yet it is the most avoided activity in preparation. No productivity app currently tracks answer writing with the granularity UPSC demands. This is CivicTask Pro's unique moat.

### 6.1 What the Tracker Does

The Answer Writing Tracker is a structured log and improvement system for written answer practice. It is not a writing app — it is a **training ledger** that holds aspirants accountable to daily answer writing and helps them identify patterns in their weaknesses over time.

### 6.2 Answer Entry Fields

| Field | Type | Notes |
|---|---|---|
| Question | Text area (max 500 chars) | The actual question attempted; user types or pastes |
| Question Source | Dropdown: PYQ / Mock Test / Self-generated / Coaching material | — |
| GS Paper | Enum: GS I / II / III / IV / Essay / Optional | For Mains practice |
| Topic Tag | Linked to UPSC syllabus tree | Same tag system as Todo Planner |
| Date Attempted | Date picker | Defaults to today |
| Word Count | Number input | Target: 150 words for 10-mark; 250 for 15-mark |
| Time Taken (minutes) | Number input | Target: 7 min for 10-mark; 12 min for 15-mark |
| Marks Obtained (if mock) | Optional: x / max marks | Only if source is Mock Test |
| Self Score (1–10) | Slider | Subjective quality self-assessment |
| Key Mistakes | Multi-select tags | Pre-defined categories + custom (see Appendix) |
| Notes / Improvements | Rich text | Space to write what to do differently next time |
| Photo of Written Answer | Image upload (optional) | For hand-written answers; useful for review |

### 6.3 Tracker Views

| View | Description |
|---|---|
| Daily Log | Today's answer entries; quick-add button prominent; shows daily word count total |
| History | Calendar heatmap — days with answer writing practice; click a day to see entries |
| Analytics | Charts: answers per week, avg word count trend, self-score trend, top mistake categories, subject distribution |
| Question Bank | All questions ever logged — searchable and filterable by paper, topic, date, score |

### 6.4 Analytics (Key Charts)

- **Writing Streak** — consecutive days with at least 1 answer written; prominently displayed
- **Weekly Volume** — bar chart of answers written per day over the last 4 weeks
- **Word Count Trend** — line chart of average word count per answer over time
- **Self-Score Trend** — 30-day rolling average of self-scores; should trend upward
- **Mistake Frequency** — horizontal bar chart of most common mistake tags
- **Subject Coverage** — donut chart of answers by GS paper
- **Weekly Writing Target** — user sets a target (e.g., 10 answers/week); tracker shows progress vs target

### 6.5 Functional Requirements

- Daily reminder notification (configurable time): *"Write at least 1 answer today."*
- Streak break alert: *"You missed yesterday. Your 12-day writing streak has ended."*
- **PYQ Mode** — toggle to a pre-loaded 10-year Mains GS question bank; tap any question to start a new answer entry pre-filled with question text and paper tag.
- **Mistake Pattern Alert** — if the same mistake tag appears in >50% of entries over 2 weeks, a banner surfaces: *"You frequently miss diagrams. Try focusing on this in your next 5 answers."*

---

## 7. Design System — Premium Dark Theme

> **Design Philosophy:** Dark, dense, and distraction-free. The UI should feel like a command center — the kind of interface serious aspirants trust. No pastels, no playful illustrations, no gamification gimmicks. Every pixel serves focus.

### 7.1 Colour Tokens

| Token | Hex | Usage |
|---|---|---|
| `--bg-base` | `#0A0F1E` | Root background; deepest layer |
| `--bg-surface` | `#111827` | Card, panel, modal backgrounds |
| `--bg-elevated` | `#1C2333` | Hover states, dropdowns, table alt rows |
| `--border` | `#2A3447` | All subtle borders and dividers |
| `--gold` | `#C9A84C` | Primary accent; headings, CTA buttons, key data |
| `--violet` | `#6C63FF` | Secondary accent; study sessions, links, active states |
| `--green` | `#10B981` | Completed tasks, positive metrics, streak active |
| `--red` | `#EF4444` | Overdue, errors, streak broken, critical priority |
| `--amber` | `#D97706` | Needs revision, warnings, high priority |
| `--text-hi` | `#F1F5F9` | Primary readable text (titles, values) |
| `--text-mid` | `#A0AEC0` | Secondary text (descriptions, labels) |
| `--text-low` | `#4A5568` | Muted text (timestamps, placeholders) |

### 7.2 Typography

| Role | Font | Size | Weight | Colour |
|---|---|---|---|---|
| Page Title | Inter | 32px / 2rem | Bold 700 | `--gold` |
| Section Heading | Inter | 22px / 1.375rem | SemiBold 600 | `--text-hi` |
| Card Title | Inter | 16px / 1rem | SemiBold 600 | `--text-hi` |
| Body Text | Inter | 14px / 0.875rem | Regular 400 | `--text-mid` |
| Caption / Meta | Inter | 12px / 0.75rem | Regular 400 | `--text-low` |
| Code / Dates | JetBrains Mono | 13px | Regular 400 | `--text-mid` |
| Numbers / Stats | Inter | 28–40px | Bold 700 | `--gold` or `--violet` |

### 7.3 Spacing & Layout Grid

- **Base unit:** 4px — all spacing is multiples of 4px.
- **Layout:** 12-column CSS Grid on desktop; 4-column on tablet; single column on mobile.
- **Sidebar width:** 240px (desktop), 64px collapsed (tablet), hidden on mobile (drawer).
- **Content max-width:** 1280px; centred with 24px horizontal padding.
- **Border radius:** Cards 12px · Inputs 8px · Buttons 8px · Tags/chips 9999px (pill).
- **Shadow:** `box-shadow: 0 4px 24px rgba(0,0,0,0.4)` — dark shadow uses opacity not grey.

### 7.4 Component Library

| Component | Description |
|---|---|
| `TaskCard` | Dark card with left colour border by priority; subject tag chip; due date; completion checkbox; hover reveals action icons |
| `EventChip` | Compact pill with colour dot + truncated title; click expands to EventPopover |
| `EventPopover` | Floating card anchored to chip; full event details + edit/delete actions |
| `SubjectTag` | Pill with subject colour: GS I=Violet, GS II=Blue, GS III=Green, GS IV=Pink, Essay=Amber |
| `PriorityBadge` | Small filled pill: Critical=Red, High=Amber, Medium=Violet, Low=Slate |
| `ProgressRing` | SVG donut chart; gold stroke on navy background; used for subject coverage % |
| `StreakBadge` | Flame icon + number; gold when active; grey when broken |
| `MistakeTag` | Red-tinted chip in Answer Writing Tracker for mistake categories |
| `CommandPalette` | Full-width overlay input triggered by `Q` or search icon |
| `SidebarNavItem` | Icon + label; active: gold left border + gold text + subtle bg fill |
| `StatCard` | Dark card with large number + trend arrow + label; used in analytics strips |
| `CalendarMini` | Compact month thumbnail in sidebar; days with events shown as dots |
| `HeatmapGrid` | GitHub-style contribution grid; used in Answer Writing Tracker history |

### 7.5 Responsive Breakpoints

| Breakpoint | Width | Layout Behaviour |
|---|---|---|
| Mobile (xs) | < 640px | Single column; bottom nav bar (5 icons); sidebar hidden; drawer on hamburger |
| Tablet (sm) | 640–1023px | Sidebar collapsed to 64px icon-only strip; 2-col grid for task cards |
| Desktop (md) | 1024–1279px | Full 240px sidebar; 3-col grid; calendar week view default |
| Wide (lg) | 1280px+ | Same as md; content max-width 1280px with generous whitespace |

---

## 8. Screen-by-Screen Specifications

### Screen 1 — Login & Onboarding
**Route:** `/login` · `/onboarding`
*First touchpoint. Must convey premium quality and UPSC domain credibility instantly.*

| Spec | Detail |
|---|---|
| Layout | Centred card (480px wide) on full dark `#0A0F1E` background; subtle animated gradient orb behind card |
| Header | App logo top-left of card: flame icon + "CivicTask Pro" in gold; tagline: "Your UPSC Command Center" |
| Auth Options | Google OAuth button (primary) + Email/password form (secondary, collapsible) |
| Onboarding | 3-step wizard post-signup: (1) Name + exam target year, (2) Pick optional subject, (3) Set daily study hours goal |
| Animations | Card fade-in on load; input focus: gold border glow; button hover: slight scale + brightness |
| Mobile | Full-screen card; no orb animation (performance); keyboard-aware layout |

---

### Screen 2 — Dashboard
**Route:** `/dashboard`
*Daily landing screen. Shows today at a glance — tasks, calendar preview, writing streak, and next exam countdown. Designed for sub-5-second daily orientation.*

#### Layout — Desktop (3 columns)

| Column | Content |
|---|---|
| Left (240px) | Sidebar: Logo, nav items, CalendarMini widget, Subject Coverage rings (compact) |
| Centre (flex) | Today's date header + countdown strip, Smart Daily Task List, Quick-Add bar at top |
| Right (320px) | Stat cards: Study streak, Answers this week, Syllabus % covered; Mini-calendar next 7 days |

#### Key Components

- **Countdown Strip** — "Prelims 2026 in 47 days" — prominent gold text below date; updates daily.
- **Today's Task List** — top 5 tasks for today (from Planner), sorted by priority; each row shows subject tag + priority badge + checkbox; "See all" link.
- **Quick-Add Bar** — always-visible input at top of task list; type a task and press Enter; subject tag defaults to last used.
- **Writing Streak Card** — flame icon + streak count + last 7 days streak grid (7 small circles, gold = written, grey = missed).
- **Syllabus Coverage Summary** — 4 small ProgressRings for GS I–IV; click to go to Planner > By Subject.
- **Answer Writing Nudge** — if no answer written by 6 PM, amber banner: *"No answer written today — keep the streak alive."*

#### Responsive

- **Tablet:** right column moves below centre; sidebar collapses to icons.
- **Mobile:** single column; bottom nav bar; countdown strip stays at top; stat cards scroll horizontally as carousel.

---

### Screen 3 — Calendar
**Route:** `/calendar`
*Full-featured study calendar. Aspirants schedule study sessions, mark exam dates, and see their week at a glance.*

#### Top Bar

| Section | Content |
|---|---|
| Left | "September 2025" in large gold text; prev/next arrows |
| Centre | View switcher: Month · Week · Day · Agenda — pill toggle |
| Right | "+ Add Event" button (gold filled); Today button; search icon |

#### Month View

| Element | Detail |
|---|---|
| Grid | 7-column (Mon–Sun); each cell fixed row height 120px desktop / 80px mobile |
| Day Cell | Date number top-right; up to 3 event chips; "+N more" overflow link |
| Today | Gold circular highlight on date number; subtle gold border on cell |
| Event Chip | Coloured pill: 10px colour dot + truncated title; click opens EventPopover |
| EventPopover | Floating card: event title, type, time, notes preview; Edit / Delete / Add to Planner |
| Empty Cell | Hover: "+" icon appears; click opens new event sheet for that day |

#### Week View

| Element | Detail |
|---|---|
| Structure | Time axis 08:00–22:00 on left; 7 day columns; 30-min slot rows |
| Event Block | Colour-filled rectangle spanning duration; title + time inside; overlapping events split columns |
| Drag & Drop | Desktop: grab event to move; resize from bottom edge to change duration |
| Current Time | Horizontal gold line with dot at current time; auto-scrolls on load |

#### New Event Sheet

| Spec | Detail |
|---|---|
| Trigger | Click "+ Add Event" or click empty time slot |
| Style | Right-side slide-in panel (480px) on desktop; bottom sheet on mobile |
| Fields | Title, Event Type, Date, Start/End Time, Subject Tag, Recurrence, Notes |
| Save | Gold "Create Event" button; `Esc` or X to cancel |

#### Responsive

| Viewport | Behaviour |
|---|---|
| Mobile Month | Event chips show colour dot only; tap day to open agenda list |
| Mobile Week | Shows 3 days (today ± 1); swipe to navigate |
| Mobile Day | Full-screen; scrollable time slots; FAB (+) for quick add |

---

### Screen 4 — Todo Planner
**Route:** `/planner`
*UPSC syllabus-aware task management. Aspirants create, prioritise, and track study tasks mapped to the official UPSC syllabus structure.*

#### Page Structure

| Section | Content |
|---|---|
| Left Sidebar | Global sidebar + View switcher (Today / This Week / All / By Subject / Syllabus Map) |
| Top Bar | Page title, view label, filter chips (Subject / Priority / Status / Date), "+ Add Task" |
| Main Area | Task list / view content based on active view |
| Right Panel | Task Detail panel (slide-in on task click); empty state shows subject coverage summary |

#### Today View

| Element | Detail |
|---|---|
| Section Header | "Today — [Day, Date]" + task count |
| Overdue Banner | Red strip if overdue tasks exist: "3 tasks overdue — tap to view" |
| Task Cards | Sorted: Overdue > Critical > High > Medium > Low; checkbox, title, subject tag, priority badge, due time, Schedule icon |
| Quick Add | Sticky input bar at bottom; type + Enter to create task with today's due date |
| Empty State | Gold checkmark icon + "All clear for today. Add tasks or review tomorrow." |

#### By Subject View

| Element | Detail |
|---|---|
| Layout | Accordion list; each subject as a collapsible section header |
| Subject Header | Subject name + ProgressRing (%) + task count chip + expand/collapse arrow |
| Expanded | Task cards for that subject |
| Top Summary | Row of 4 small donut rings for GS I–IV with % label beneath |

#### Syllabus Map View

| Element | Detail |
|---|---|
| Structure | Expandable tree of full UPSC syllabus hierarchy |
| Node States | Covered (green dot), Needs Revision (amber dot), Not Started (grey dot), In Progress (violet dot) |
| Interaction | Click a leaf topic to instantly create a task pre-tagged to that topic |
| Search | Real-time filter of the syllabus tree |

#### Task Detail Panel

| Spec | Detail |
|---|---|
| Trigger | Click any task card — right panel slides in on desktop; bottom sheet on mobile |
| Content | All fields editable inline; sub-task checklist; activity log (created, modified, completed) |
| Actions | "Mark Done" (green), "Schedule on Calendar" (violet), "Defer to Tomorrow" (amber), "Delete" (red + confirmation) |

---

### Screen 5 — Answer Writing Tracker
**Route:** `/answers`
*The aspirant's writing practice ledger. Log answers, track patterns, identify weaknesses, and build a daily writing habit with streak accountability.*

#### Page Structure

| Section | Content |
|---|---|
| Left Sidebar | Global sidebar + sub-nav: Daily Log / History / Analytics / Question Bank |
| Top Bar | Page title, today's date, Writing Streak badge (flame + count), "+ Log Answer" button |
| Main Area | View content based on sub-nav selection |

#### Daily Log View

| Element | Detail |
|---|---|
| Date Header | "Today — [Day, Date]" + "X answers written · Y words total" |
| Answer Cards | Question snippet (2 lines), GS Paper tag, self-score bar (1–10), word count, time taken, mistake tags |
| Streak Row | Mini 7-day streak row at top: circles (gold = wrote, grey = missed) |
| Empty State | Amber nudge: *"No answers logged today. Mains is won on writing."* + CTA button |

#### Log Answer Sheet

| Spec | Detail |
|---|---|
| Trigger | "+ Log Answer" button or FAB on mobile |
| Layout | Right slide-in panel (520px) on desktop; full-screen modal on mobile |
| Field Order | 1. Source selector, 2. GS Paper, 3. Topic tag, 4. Question text, 5. Date, 6. Word count + Time (side by side), 7. Self-score slider, 8. Mistake tags (multi-select chips), 9. Notes, 10. Photo upload |
| PYQ Mode | If "PYQ" selected: searchable question bank opens; select a PYQ to auto-fill question field |
| Required Fields | Question + GS Paper + Self-score only; all others optional for speed |
| Save | "Save Entry" gold button; `Cmd/Ctrl+Enter` shortcut |

#### History View

| Element | Detail |
|---|---|
| Top | Heatmap calendar grid (last 12 months); colour intensity = answers count; gold=3+, light=2, muted=1, dark=0 |
| Click a Day | Panel shows all entries for that day |
| Below Map | Monthly summary: answers count, avg self-score, total words, top mistake |

#### Analytics View

| Card | Content |
|---|---|
| Card 1 | Answers per week — bar chart (last 8 weeks) vs weekly target line |
| Card 2 | Self-Score Trend — line chart (last 30 answers) |
| Card 3 | Avg Word Count Trend — line chart vs target thresholds |
| Card 4 | Top Mistakes — horizontal bar chart; top 5 mistake tags |
| Card 5 | GS Paper Distribution — donut chart |
| Card 6 | Streak History — all streaks achieved; longest highlighted in gold |
| Insight Banner | Auto-generated: *"Your most common mistake is 'No Diagram' (38% of entries). Focus on this in your next 5 answers."* |

#### Question Bank View

| Element | Detail |
|---|---|
| Layout | Searchable, filterable list of all logged questions |
| Filters | GS Paper / Topic / Date Range / Self-score range / Source |
| Question Row | GS tag, question snippet, date, self-score, word count; click to see full entry |
| PYQ Bank | Toggle to "UPSC PYQ Mode" — pre-loaded 10-year question bank; tap any question to start new entry |

---

### Screen 6 — Settings
**Route:** `/settings`
*User preferences, notification configuration, exam details, and account management.*

| Section | Content |
|---|---|
| Profile | Name, email, avatar; update password |
| Exam Details | Target exam year, optional subject, daily study hours goal — editable post-onboarding |
| Notifications | Toggle per type; set preferred reminder times; browser notification permission prompt |
| Appearance | Dark mode default; Gold vs Violet accent toggle |
| Data | Clear all data (double-confirmation) |
| Account | Subscription status (Free / Premium); Upgrade CTA; Log out; Delete account |
| Layout | Left nav of categories (desktop); accordion list (mobile) |

---

## 9. Navigation Architecture

### 9.1 Desktop Sidebar

| Spec | Detail |
|---|---|
| Width | 240px expanded; 64px collapsed (icons only) |
| Top Section | Logo + app name; collapse toggle arrow |
| Nav Items | Dashboard, Calendar, Planner, Answer Writing |
| Bottom | Settings, User avatar + name, Streak badge |
| Active State | 3px gold left border + gold icon + gold text + subtle bg fill |
| Collapsed | Icons only; hover shows tooltip label |

### 9.2 Mobile Bottom Nav Bar

| Spec | Detail |
|---|---|
| Items | 5 icons: Dashboard, Calendar, Planner, Answers, Settings |
| Active | Gold filled icon; small gold dot below |
| FAB | Gold floating action button (+) above centre; context-aware: adds task/event/answer based on current screen |
| Height | 64px + safe area inset |

### 9.3 Global Command Palette

| Spec | Detail |
|---|---|
| Trigger | Press `Q` from anywhere; or click search icon in top bar |
| Appearance | Full-width dark overlay; centred search input; max-width 600px |
| Capabilities | Create task, Create event, Log answer, Navigate to screen, Search tasks/events/answers |
| Keyboard | Arrow keys to navigate; Enter to select; Esc to close |

---

## 10. Non-Functional Requirements

| Category | Requirement | Target |
|---|---|---|
| Performance | Initial page load (cold, 4G) | < 2 seconds (LCP) |
| Performance | Interaction response (task create/update) | < 200ms |
| Performance | Calendar render (1 month, 200 events) | < 500ms |
| Offline | Core task & answer log functionality | Full offline via IndexedDB + Service Worker |
| Availability | Monthly uptime SLA | 99.9% |
| Accessibility | WCAG standard | 2.1 AA across all 6 screens |
| Security | Data encryption | AES-256 at rest; TLS 1.3 in transit |
| Auth | Session management | JWT (15 min access) + refresh token (30 days); Google OAuth 2.0 |
| Scalability | Concurrent users | 10,000 concurrent; auto-scale to 100,000 |
| Browser | Support matrix | Chrome 110+, Firefox 110+, Safari 15+, Edge 110+ |
| Responsive | Viewport range | 320px to 1920px; no horizontal scroll on any screen |
| Privacy | Data handling | GDPR compliant; deletion fulfilled within 30 days |

---

## 11. Technical Architecture

| Layer | Technology | Rationale |
|---|---|---|
| Frontend Framework | React 18 + TypeScript | Component model ideal for complex calendar and task UIs |
| Styling | Tailwind CSS + CSS Variables | Utility-first; design tokens via CSS vars for theming |
| State Management | Zustand | Lightweight; avoids Redux boilerplate for a 3-feature app |
| Offline Storage | Dexie.js (IndexedDB wrapper) | Full offline CRUD; sync queue management |
| Calendar UI | Custom-built on CSS Grid + react-dnd | Full control over dark theme + drag-drop |
| Charts | Recharts | React-native charts; customisable to match dark design tokens |
| Backend | Node.js + Fastify + TypeScript | Fast, low-overhead API; type-safe with Zod validation |
| Database | PostgreSQL 15 | Relational; handles task/calendar/answer relationships cleanly |
| Cache | Redis | Session tokens; frequently accessed event caching |
| Auth | Passport.js (Local + Google OAuth) | Battle-tested; supports both auth methods |
| File Storage | Cloudflare R2 | Affordable S3-compatible storage for answer photo uploads |
| Deployment | Vercel (frontend) + Railway (backend + DB) | Zero-config deploys; auto-scaling; affordable at launch scale |
| CI/CD | GitHub Actions | Automated test + lint + deploy on every merge to main |
| Monitoring | Sentry (errors) + Posthog (analytics) | Error tracking + product analytics; generous free tiers |

---

## 12. Release Roadmap

| Phase | Timeline | Scope |
|---|---|---|
| Phase 0 — Foundation | Weeks 1–3 | Project scaffold, design system (Tailwind tokens, component library), auth, routing, offline infrastructure |
| Phase 1 — Todo Planner | Weeks 4–7 | Full Planner: task CRUD, sub-tasks, syllabus tree, coverage engine, Today/Week/Subject/Syllabus views, notifications |
| Phase 2 — Calendar | Weeks 8–11 | Calendar: Month/Week/Day/Agenda views, event CRUD, drag-drop, pre-loaded UPSC exam dates, Planner task integration |
| Phase 3 — Answer Writing | Weeks 12–16 | Answer Writing Tracker: log entry, heatmap history, analytics, PYQ question bank (10 years GS), mistake pattern alerts |
| Phase 4 — Beta | Weeks 17–19 | Closed beta (500 aspirants); bug fixes; performance tuning; accessibility audit; dark theme polish |
| Phase 5 — GA Launch | Week 20 (Q4 2026) | Public launch; premium subscription (Razorpay/Stripe); marketing site |
| Phase 6 — Growth | Q1 2027+ | Hindi localisation; data export; light mode; mentor sharing; mobile native apps |

---

## 13. Open Questions

| # | Question | Owner | Target Resolution |
|---|---|---|---|
| OQ-1 | PYQ database — license from provider (Drishti, Vision IAS) or build manually curated internal database? | Product | Before Phase 3 kickoff |
| OQ-2 | Should the Insight Banner use a rule-based engine or an LLM API call for natural language insights? | Engineering | Before Phase 3 design |
| OQ-3 | Maximum photo upload size for answer photos? (storage cost vs quality tradeoff) | Engineering | Phase 3 design |
| OQ-4 | Should task recurrence logic live on client (IndexedDB) or server? Client risks drift; server adds complexity. | Engineering | Phase 1 design |
| OQ-5 | UPSC Optional subjects: pre-load all 75+ syllabus trees at launch, or top 15 most popular with a "request an optional" flow? | Product | Phase 0 |

---

## 14. Appendix

### 14.1 Subject Tag Reference

| Tag | Full Name | Colour | Scope |
|---|---|---|---|
| GS I | History, Geography, Society | Violet `#7C3AED` | Mains |
| GS II | Polity, Governance, IR | Blue `#0369A1` | Mains |
| GS III | Economy, Environment, Science | Green `#047857` | Mains |
| GS IV | Ethics, Integrity, Aptitude | Pink `#9D174D` | Mains |
| Essay | Essay Paper | Amber `#D97706` | Mains |
| CSAT | Civil Services Aptitude Test | Teal `#0D9488` | Prelims |
| Optional | Optional Subject (user-selected) | Indigo `#3730A3` | Mains |
| Current Affairs | Daily newspaper / current events reading | Gold `#C9A84C` | All |
| Personal | Non-UPSC personal tasks | Slate `#64748B` | General |

### 14.2 Mistake Tag Reference (Answer Writing Tracker)

| Mistake Tag | Description |
|---|---|
| Structure | Answer lacks Introduction / Body / Conclusion structure |
| No Diagram | Failed to include a relevant map, flowchart, or diagram |
| Factual Error | Incorrect data, wrong year, wrong facts cited |
| Off-Topic | Answer deviates from the actual question asked |
| Too Short | Word count significantly below target for the mark allocation |
| Too Long | Exceeded word count; time management issue |
| No Examples | Arguments made without real-world examples or case studies |
| Poor Intro | Opening paragraph fails to set context or define key terms |
| Weak Conclusion | No clear takeaway, way forward, or synthesis in the closing |
| Time Overrun | Took significantly longer than the allocated time |
| Factual Gaps | Key facts or dimensions of the topic were missing entirely |

### 14.3 UPSC CSE Syllabus Summary (Tag Reference)

- **GS Paper I** — Indian Heritage & Culture, History, Geography
- **GS Paper II** — Governance, Constitution, Polity, Social Justice, International Relations
- **GS Paper III** — Technology, Economic Development, Biodiversity, Environment, Security, Disaster Management
- **GS Paper IV** — Ethics, Integrity, Aptitude
- **Essay Paper** — Two essays from varied themes
- **CSAT (Prelims)** — Comprehension, Reasoning, Math, Data Interpretation
- **Optional Papers** — 75+ subjects; top popular: Public Administration, Sociology, History, Geography, PSIR
- **Current Affairs** — Linked to all GS papers; daily ongoing preparation

---

*CivicTask Pro · PRD v2.0 · Three-Feature Edition · Confidential · April 2026*