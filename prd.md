Perfect. I would split it into **10 parts**, each being a self-contained section. By the end, you'll have a professional PRD comparable to what a startup PM would hand to an engineering team. Each part will be designed so you can copy-paste it directly into Antigravity.

Here's the structure:

1. **Executive Summary & Product Vision**
2. **User Personas, Goals & User Flows**
3. **Features & Functional Requirements**
4. **UI/UX Design System & Screen-by-Screen Specifications**
5. **Database Schema & Backend Architecture**
6. **OCR + AI Features + Gemini Integration**
7. **API Design & Business Logic**
8. **Technical Architecture, Deployment & Project Structure**
9. **Testing, Edge Cases & Acceptance Criteria**
10. **Instructions for Antigravity (Implementation Guide)**

Each section will be extremely detailed.

I recommend using **Markdown** because Antigravity parses it very well.

---

# PART 1 — PRODUCT REQUIREMENTS DOCUMENT (PRD)

# Tuition Progress Tracker

### Version 1.0

**Status:** Ready for Development

---

# 1. Executive Summary

## Project Name

**Tuition Progress Tracker**

---

## Overview

Tuition Progress Tracker is a **mobile-first web application** designed specifically for a **single tuition center** to replace handwritten mark sheets with an intuitive digital system.

Unlike a traditional school ERP, this application focuses on doing **one job exceptionally well**:

* Recording student marks
* Tracking academic progress
* Sharing results with parents
* Minimizing administrative effort

The primary user (admin) is an older teacher who currently records marks manually on paper. The application must closely mirror this existing workflow rather than forcing a new one.

Parents should have a clean, simple interface where they can quickly see their child's progress over time without needing technical knowledge.

The product must feel handcrafted and trustworthy—not like a generic admin dashboard or AI-generated template.

---

# 2. Vision Statement

The goal is to make entering marks **faster than writing them on paper**, while giving parents meaningful insights that are impossible with handwritten records.

The application should become something the admin enjoys using rather than tolerates.

Every design decision should answer one question:

> **Does this reduce the number of taps or make the experience easier?**

If not, it should be reconsidered.

---

# 3. Product Goals

## Primary Goals

* Replace handwritten mark sheets.
* Minimize the time required to enter marks.
* Make the application extremely easy for an older Android user.
* Allow parents to view progress anytime.
* Automatically calculate rankings and percentages.
* Generate attractive WhatsApp updates.
* Support Gujarati and English equally.
* Use AI to eliminate repetitive data entry.

---

## Secondary Goals

* Attractive UI.
* Smooth animations.
* Accessible.
* Responsive.
* Fast loading.
* Free hosting.
* Easy maintenance.

---

# 4. Success Metrics

The application is considered successful if:

### Admin

* Can create a new test in under **30 seconds**.
* Can enter one student's marks in under **10 seconds**.
* Can import an entire handwritten sheet in under **2 minutes**.
* Can share results to WhatsApp in under **20 seconds**.

---

### Parent

A parent should be able to:

* Open the website.
* Choose language.
* Choose class.
* Choose child.
* View performance.

…all within **30 seconds**.

---

# 5. Target Users

## Primary User

### Tuition Teacher (Admin)

Age:
Approximately 50+

Technical Skills:
Basic smartphone usage.

Primary Device:
Android phone.

Needs:

* Large buttons.
* Clear text.
* Minimal navigation.
* Fast data entry.
* Simple workflows.
* No complicated settings.

Pain Points:

* Handwritten calculations.
* Time-consuming percentage calculations.
* Sharing updates manually.
* Maintaining paper records.

---

## Secondary User

### Parent

Technical Skill:

Basic smartphone user.

Primary Device:

Android phone.

Goals:

* View child's marks.
* Track improvement.
* Compare with class.
* Read teacher notes.

Parents should never feel overwhelmed.

---

# 6. Core Principles

The product should follow these principles throughout development.

## Principle 1

**Mobile First**

Every feature must be designed for Android before desktop.

Desktop is secondary.

---

## Principle 2

**Spreadsheet First**

The spreadsheet is the heart of the application.

Everything should revolve around making spreadsheet editing effortless.

---

## Principle 3

**Fewest Possible Taps**

Every workflow should minimize interactions.

Example:

❌ Create Test

↓

Add Students

↓

Add Subjects

↓

Add Totals

↓

Enter Marks

Instead:

✅ Copy Previous Test

↓

Enter Marks

---

## Principle 4

**Never Surprise the User**

Buttons should always behave predictably.

No hidden actions.

No complex menus.

---

## Principle 5

**Readable Before Beautiful**

Good typography is more important than flashy visuals.

---

## Principle 6

**Parents Should Never See Admin Complexity**

The parent interface should feel like a report card, not an administration system.

---

## Principle 7

**Accessibility**

Large tap targets.

Readable fonts.

High contrast.

Descriptive error messages.

Simple navigation.

---

# 7. Scope

## Included

* Admin panel
* Parent portal
* Student management
* Subject management
* Test management
* OCR
* AI insights
* WhatsApp sharing
* Analytics
* Rankings
* Graphs
* Teacher notes
* Bilingual interface
* Export to CSV/Excel
* Mobile responsiveness

---

## Not Included

Attendance

Fees

Homework

Timetable

Exams outside tuition

Notifications

SMS

Email

Payment gateway

Multiple tuition centers

Teacher accounts

Role management

Authentication for parents

Offline support

---

# 8. Technology Stack

Frontend

* Next.js 15 (App Router)
* TypeScript
* Tailwind CSS
* shadcn/ui
* Framer Motion

Backend

* Supabase
* PostgreSQL
* Row Level Security

Authentication

Single Admin

6-digit PIN

Parents require no login.

AI

Google Gemini Vision

OCR

AI Insights

Charts

Recharts

Deployment

Vercel

Version Control

GitHub

---

# 9. URL Structure

```
/
```

Landing page.

Language selection.

↓

Choose Standard.

↓

Choose Student.

---

```
/std-1
/std-2
...
/std-7
```

Displays students in that standard.

Selecting a student opens their dashboard.

The browser remembers the last selected student.

---

```
/admin
```

PIN entry.

↓

Class selection.

↓

Test selection.

↓

Spreadsheet.

---

# 10. Academic Structure

The tuition contains seven standards.

```
Std 1

Std 2

Std 3

Std 4

Std 5

Std 6

Std 7
```

Each standard contains its own:

* Students
* Subjects
* Tests
* Teacher notes

Subjects are not shared between classes.

Tests are not shared between classes.

---

# 11. Student Rules

A student belongs to exactly one standard.

Students can be:

Active

Archived

Archived students:

Remain visible in historical tests.

Do not appear in future tests.

Student names may be edited.

Students may have a friendly emoji assigned automatically by the system (chosen from a curated list of appropriate emojis—no confusing, negative, or overly whimsical options).

---

# 12. Test Rules

Tests are created manually by the admin.

Examples:

* June Test
* Weekly Test 1
* Unit Test
* August Test

There is no fixed schedule.

Each test stores:

* Name
* Date
* Subjects
* Student marks
* Notes

The preferred workflow is:

```
New Test

↓

Copy Previous Test
```

The system copies:

* Student list
* Subject list
* Maximum marks (totals)

All obtained marks are cleared.

The admin immediately starts entering new marks.

---

# PART 2 — User Personas, User Flows & Information Architecture

---

# 13. User Personas

The application has only **two user types**.

There are intentionally no additional roles, permissions, or complex access controls.

This keeps the application extremely easy to maintain and understand.

---

# Persona 1 — Admin (Primary User)

## Overview

The admin is the tuition teacher.

There is only one admin account.

The admin currently maintains all marks using handwritten paper sheets.

The application should feel like a digital version of that notebook instead of an enterprise dashboard.

---

## Profile

**Role**

Tuition Teacher

**Age**

50+

**Technical Ability**

Basic smartphone usage

**Primary Device**

Android Phone

**Secondary Device**

Laptop (rare)

---

## Daily Goals

* Create tests
* Enter marks
* Update marks
* Correct mistakes
* Add new students
* Archive students
* Add/remove subjects
* Share results with parents
* Track class performance

---

## Frustrations

Current problems include:

* Manual calculations
* Rewriting the same student names every month
* Calculating percentages manually
* Sharing results individually
* Managing paper records
* Difficulty finding old records

---

## Success Criteria

The admin should be able to complete common tasks in the fewest possible taps.

The application should never require the admin to "figure out" where something is.

Everything should be obvious.

---

# Persona 2 — Parent

## Overview

Parents only care about one thing:

> "How is my child doing?"

They should never have to navigate an admin-like interface.

---

## Profile

Primary Device

Android Phone

Technical Ability

Basic

Visits

Usually after receiving a WhatsApp message from the tuition teacher.

---

## Goals

* Check latest marks
* Track improvement
* Compare against class average
* Read teacher feedback
* See historical performance

---

## Pain Points

Parents do not want:

Large spreadsheets

Complicated navigation

Confusing charts

Too much information

---

## Success Criteria

Within 30 seconds they should know:

* Current performance
* Improvement
* Areas needing work

---

# 14. Information Architecture

The application contains only three main areas.

```
Website
│
├── Landing Page
│
├── Parent Portal
│
└── Admin Portal
```

Nothing else.

No hidden menus.

No complicated routing.

---

# 15. Navigation Structure

## Public Routes

```
/
```

Landing page

↓

Choose language

↓

Choose standard

↓

Choose student

↓

Student dashboard

---

```
/std-1
/std-2
...
/std-7
```

Displays students of that standard.

Student is selected using:

😊 Emoji

*

Name

The previously selected student is remembered in browser storage.

---

```
/std-7/student-name
```

Direct link to a student dashboard.

Parents can bookmark this page.

---

## Admin Routes

```
/admin
```

↓

Enter 6-digit PIN

↓

Choose Standard

↓

Choose Test

↓

Spreadsheet

No additional dashboard is shown before reaching the spreadsheet.

---

# 16. Parent User Journey

## First Visit

```
Open Website
```

↓

Choose Language

↓

English

or

ગુજરાતી

↓

Choose Standard

↓

Choose Student

↓

Student Dashboard

↓

Done

---

The website stores:

Language

Student

Class

inside browser local storage.

On future visits the application opens directly to the student's dashboard.

---

## Returning Visit

```
Open Website
```

↓

Student Dashboard

No additional steps.

Parents can still switch students manually.

---

# 17. Admin User Journey

## Login

```
Open /admin
```

↓

Enter PIN

↓

Continue

↓

Class Selection

---

## Selecting a Class

Admin sees cards.

```
Std 1

Std 2

Std 3

...

Std 7
```

Large buttons.

Easy to tap.

---

Selecting one opens:

```
Tests
```

Example

```
June Test

July Test

August Test

Weekly Test 1
```

A floating action button appears.

```
+
New Test
```

---

Selecting a test opens

Spreadsheet.

---

# 18. Creating a Test

The primary workflow should always encourage copying the previous test.

```
New Test
```

↓

Popup

```
Test Name

Date

Copy Previous Test

Create
```

When Copy Previous Test is enabled, the application automatically copies:

* Students
* Subjects
* Subject maximum marks

Only obtained marks are cleared.

The admin immediately begins entering new marks.

---

# 19. Editing Marks

This is the most important workflow.

It should require the fewest taps.

---

## Spreadsheet Layout

Example

| Student   | English | Maths | Science |
| --------- | ------- | ----- | ------- |
| 😊 Vrutti | 17/21   | 18/30 | 40/55   |
| 😊 Mansi  | 19/21   | 20/30 | 44/55   |

---

User taps

```
17/21
```

↓

Popup opens

```
Obtained

[17]

Total

[21]

Save

Cancel
```

The **Obtained** field is automatically focused.

After Save:

* popup closes
* spreadsheet updates instantly
* next cell in the same column becomes active

This dramatically speeds up entry.

---

# 20. OCR User Flow

The OCR workflow should feel effortless.

```
Spreadsheet
```

↓

Scan Paper

↓

Camera

↓

Take Photo

↓

Uploading

↓

Gemini Vision

↓

AI extracts

* Class
* Test Name
* Students
* Subjects
* Marks
* Totals

↓

Review Screen

---

Review Screen

Example

```
132 marks detected

128 verified

4 need review
```

Only low-confidence cells are highlighted.

Everything else is accepted automatically.

Admin reviews highlighted cells.

↓

Import

↓

Spreadsheet updates.

---

If AI detects a student not already present:

Popup

```
New Student Found

Name:

Dev

Create Student?

Yes

No
```

No student is automatically created without confirmation.

---

# 21. WhatsApp Sharing Flow

Once marks are finalized, the admin can share results.

```
Spreadsheet

↓

Publish Results

↓

Generate Summary

↓

Generate Share Card

↓

Share
```

The application creates:

* A visually appealing class summary image.
* A WhatsApp message.
* The class URL.

The admin taps:

```
Share on WhatsApp
```

The browser opens WhatsApp with the prepared content.

Example message:

> 📚 June Test Results – Std 7
> Class Average: 82.4%
> Highest Score: 94.6%
> Individual student reports: [https://example.com/std-7](https://example.com/std-7)

---

# 22. Parent Dashboard Flow

After selecting a student:

```
Student Dashboard
```

↓

Overall Score

↓

Progress Graph

↓

Subject Cards

↓

Teacher Notes

↓

Comparison

↓

Previous Tests

---

Everything should fit naturally on a phone.

Scrolling should feel comfortable.

No nested menus.

---

# 23. Screen Hierarchy

## Landing Page

```
Logo

↓

Tuition Name

↓

Language

↓

Standards

↓

Footer
```

---

## Standard Page

```
Header

↓

Student Selection

↓

Footer
```

---

## Student Dashboard

```
Header

↓

Student Card

↓

Overall Performance

↓

Graphs

↓

Subjects

↓

Teacher Notes

↓

Comparison

↓

History
```

---

## Admin

```
PIN

↓

Classes

↓

Tests

↓

Spreadsheet

↓

Analytics

↓

Share
```

---

# 24. Breadcrumbs

Parents do not need breadcrumbs.

Admin should always see:

```
Std 7

>

June Test
```

at the top of the spreadsheet.

---

# 25. Navigation Rules

The application should never have more than **one primary action** visible at a time.

Examples:

Spreadsheet

Primary Action:

```
Save
```

Tests Screen

Primary Action:

```
New Test
```

Student Dashboard

Primary Action:

```
Switch Student
```

This keeps the interface focused and uncluttered.

---

# 26. Loading States

Every screen should include thoughtful loading states.

Examples:

* Skeleton cards while dashboards load.
* Skeleton table rows while spreadsheets load.
* Progress indicator during OCR.
* Animated progress while AI generates insights.
* Disabled buttons while saving.

Never show a blank screen.

---

# 27. Empty States

When there is no data, the application should guide the user.

Examples:

**No Tests Yet**

> "Create your first test to start tracking student progress."

**No Students**

> "Add your first student to this class."

**No Subjects**

> "Add at least one subject before creating a test."

Each empty state should include a clear call-to-action button.

---

# 28. Error Handling

Errors should be friendly and actionable.

Examples:

* "Unable to save changes. Please check your internet connection and try again."
* "The uploaded image couldn't be read clearly. Please retake the photo in better lighting."
* "Incorrect PIN. Please try again."

Avoid technical jargon or raw error messages.

---
# PART 3 — Functional Requirements

---

# 29. Functional Overview

This section defines every functional feature of the application.

Every feature should prioritize:

* Mobile-first usability
* Fewest possible taps
* High accessibility
* Fast performance
* Simple mental model
* Minimal maintenance

The application should never feel like an ERP.

It should feel like a purpose-built tool for one tuition teacher.

---

# MODULE 1 — Language Selection

## Purpose

Allow every user to use the application entirely in either English or Gujarati.

---

## Requirements

On first visit:

Display

```
Choose Language

🇬🇧 English

🇮🇳 ગુજરાતી
```

After selection:

Store preference in Local Storage.

Automatically restore it on future visits.

---

## Scope

Every piece of text must be translated.

Including:

* Buttons
* Errors
* Labels
* Tooltips
* Notes
* AI Insights
* Empty States
* Confirmation dialogs

Nothing should remain untranslated.

---

## Switching Language

A language switch should always be available.

Changing language must:

* Not reload the page.
* Not lose entered data.
* Update instantly.

---

# MODULE 2 — Homepage

## Route

```
/
```

---

## Purpose

Serve as the main entry point.

---

## Layout

```
Tuition Name

↓

Language

↓

Choose Standard

Std 1

Std 2

...

Std 7
```

No unnecessary text.

No marketing.

No login.

---

## Requirements

Each class should appear as a large touch-friendly card.

Example

```
📘 Std 7
```

Cards should animate slightly when tapped.

---

# MODULE 3 — Standard Selection

## Route

```
/std-7
```

---

## Purpose

Allow parents to select their child.

---

## Layout

```
Std 7

🙂 Vrutti

😀 Mansi

😊 Devin

😄 Rudra
```

Each student card displays

* Emoji
* Name

Emoji is assigned automatically.

Admin cannot choose emoji.

Only appropriate emojis should be used.

---

## Requirements

Remember selected student.

Next visit opens directly.

Parents may switch students anytime.

---

# MODULE 4 — Student Dashboard

This is the most important parent page.

---

## Layout Order

### Header

Student emoji

Student name

Current class

Latest test

---

### Overall Percentage

Large percentage

Example

```
87.4%
```

Below it

```
+3.1%

Since previous test
```

---

### Progress Graph

Line chart.

X-axis

Tests.

Y-axis

Overall percentage.

Animated on load.

---

### Subject Cards

Each subject appears as a card.

Example

```
Maths

87%

22 / 25
```

Color coded.

---

### Teacher Notes

Two sections.

General Note

Subject Notes

Each note includes

* Test name
* Date
* Text

---

### Comparison

Display

```
Your Child

87.4%
```

```
Class Average

80.1%
```

```
Highest Score

94.7%
```

Do NOT reveal highest scoring student's identity.

---

### Previous Tests

List

```
June Test

July Test

August Test
```

Parents can switch between historical tests.

---

# MODULE 5 — Admin Authentication

Route

```
/admin
```

---

Requirements

Show only

```
Enter PIN
```

Six digits.

Numeric keypad on mobile.

---

Validation

Incorrect PIN

↓

Shake animation.

↓

Show

```
Incorrect PIN.
```

Never reveal:

* number of attempts
* security details

---

Session

Remain logged in until manually logging out.

---

# MODULE 6 — Class Management

Admin can

* Rename class
* Archive class (future-proof)
* View class analytics

Current classes

```
Std 1

Std 2

...

Std 7
```

---

Each class stores

* Students
* Subjects
* Tests

independently.

---

# MODULE 7 — Student Management

Admin can

Add

Edit

Archive

Restore

Delete (soft delete only)

---

## Student Fields

Name

Emoji

Status

Created Date

Archived Date

---

Emoji

Automatically assigned.

Must come from curated list.

Examples

😀 😊 😎 🤓 😄 🙂

Avoid

💀 🤡 👹 👺 💩 😡 😭

---

Archived Student

Remains visible

Historical tests

Does not appear

Future tests

---

Adding Student

Student added today.

Should appear only

Future tests.

Never modify old tests.

---

# MODULE 8 — Subject Management

Each class has different subjects.

Subjects belong only to one class.

---

Admin can

Add

Rename

Delete

Reorder

Archive

---

Deleting Subject

Show confirmation.

Explain

```
Deleting this subject removes it
from every test.

Continue?
```

---

Subject Fields

Name

Display Order

Archived

Created Date

---

# MODULE 9 — Test Management

Tests belong to one class.

---

Fields

Name

Date

Status

Created Date

---

Status

Draft

Published

Archived

---

Admin can

Create

Rename

Duplicate

Archive

Delete

Restore

Edit

---

Delete

Archive only.

Never permanently delete.

---

# MODULE 10 — Copy Previous Test

This should become the default workflow.

Admin taps

```
New Test
```

Popup

```
Test Name

Test Date

Copy Previous Test ☑

Cancel

Create
```

---

If enabled

Copy

Student list

Subject list

Subject totals

Teacher notes template

Empty marks

---

Do NOT copy

Obtained marks

AI insights

Historical notes

Percentages

---

# MODULE 11 — Spreadsheet

This is the core of the application.

Everything should be optimized around this screen.

---

Layout

| Student | English | Maths | Science |
| ------- | ------- | ----- | ------- |

---

Requirements

Sticky Header

Sticky Student Column

Horizontal Scroll

Vertical Scroll

Large Cells

Responsive

Fast

---

Each Cell

Displays

```
17 / 21
```

---

Tap

↓

Popup

```
Obtained

17

Total

21

Save

Cancel
```

Obtained field automatically focused.

---

Save

Immediately updates spreadsheet.

Automatically activates next student

same subject.

---

Cancel

Close popup.

No changes.

---

Unsaved Changes

If leaving page

Show

```
Discard changes?
```

---

# MODULE 12 — Spreadsheet Features

Required

Search Student

Jump to Student

Freeze Header

Freeze First Column

Auto Calculate

Responsive

Keyboard Navigation (Desktop)

Touch Optimized (Mobile)

---

Future Ready

Bulk Paste

CSV Import

Excel Import

---

# MODULE 13 — Automatic Calculations

Every save should automatically calculate

Subject Percentage

Student Percentage

Overall Percentage

Class Average

Highest Score

Lowest Score

Rank

Most Improved

---

Calculations

Store only

Obtained

Total

Everything else

Calculated.

---

# MODULE 14 — Ranking Logic

Ranking based on

Overall Percentage.

Formula

```
All Obtained Marks

÷

All Total Marks

×

100
```

Rounded

One decimal place.

---

Ties

Same percentage

↓

Same rank.

Example

```
1

1

3
```

---

# MODULE 15 — Analytics

Every class should have an Analytics page.

---

Display

Average Percentage

Highest Percentage

Lowest Percentage

Top Student (admin only)

Most Improved

Students Declined

Subject Averages

Student Count

Recent Trend

---

Charts

Line

Bar

Donut

Progress Cards

---

# MODULE 16 — Teacher Notes

Notes belong to

Test

Subject

---

General Notes

Unlimited.

---

Subject Notes

Unlimited.

---

Each note stores

Author

Date

Language

Content

---

Parents see only published notes.

---

# MODULE 17 — AI Insights

Gemini generates

```
Maths declined by 5%.

Science improved by 8%.

Three students may need
additional support.
```

---

Admin can

Edit

Delete

Regenerate

Hide

Publish

---

AI never publishes automatically.

---

# MODULE 18 — Export

Admin

↓

Export

↓

CSV

Excel

---

Export includes

Students

Subjects

Tests

Marks

Notes

Percentages

Ranks

---

# MODULE 19 — WhatsApp Sharing

Admin taps

```
Share Results
```

System generates

Class Summary Card

*

Share Message

*

Class Link

---

Generated Message

```
📚 June Test Results

Class Average

81.4%

Highest

94.6%

View Results

website.com/std-7
```

---

Share Button

```
Share on WhatsApp
```

Should use the Web Share API where supported, falling back to opening WhatsApp with the prepared message if direct sharing isn't available.

---

# MODULE 20 — Search

Admin Search

Students

Subjects

Tests

Instant.

No page reload.

---

# MODULE 21 — Auto Save

Every save should

Persist immediately.

No Save Page button.

Only Save Cell.

---

Display

```
Saved ✓
```

for 2 seconds.

---

# MODULE 22 — Audit History (Recommended)

Although there is only one admin, maintain an internal history of changes for recovery and troubleshooting.

Track:

* What changed
* Previous value
* New value
* Timestamp

Example:

* English mark changed from `17/21` → `19/21`
* Subject renamed from "Math" → "Mathematics"

This history does not need a UI in v1 but should be stored in the database if practical.

---

# MODULE 23 — Functional Acceptance Criteria

The application is considered functionally complete when:

* Admin can manage all classes, students, subjects, and tests without developer assistance.
* A new test can be created by copying the previous test.
* Marks can be entered quickly through the spreadsheet interface.
* OCR imports handwritten sheets with a review step.
* Parents can view only the selected student's dashboard.
* Rankings, percentages, and analytics are calculated automatically.
* Teacher notes and AI insights are displayed correctly.
* WhatsApp sharing generates a polished summary and shareable link.
* All functionality works seamlessly in both English and Gujarati.
* The application is fully usable on Android phones without requiring desktop interactions.

---

# PART 4 — UI / UX DESIGN SYSTEM (Mobile-First Spreadsheet Experience)

---

# 30. Design Philosophy

This application must NOT look like:

* ERP software
* School management system
* AI-generated dashboard
* Corporate admin panel

It MUST feel like:

> A simple, calm, handcrafted tuition tool that replaces paper.

---

## Core UI Principles

### 1. Mobile First (Non-Negotiable)

Everything is designed for:

* Android phones
* One-hand usage
* Thumb navigation

Desktop is secondary.

---

### 2. Spreadsheet is the Core UI

The spreadsheet is not a feature.

It is the product.

Everything revolves around it.

---

### 3. Minimal Cognitive Load

At any point, user should understand:

* Where am I?
* What can I do?
* What is the next action?

Nothing more.

---

### 4. No Visual Noise

Avoid:

* Over-animation
* Gradient-heavy UI
* Glassmorphism
* Excess icons
* Decorative UI elements

Use only what helps usability.

---

# 31. Design System

## Typography

Primary Font:

* Inter OR Geist

Rules:

* Large base font (16–18px minimum)
* Student names: bold
* Marks: medium weight
* Labels: muted gray

---

## Color System

### Primary Colors

* Blue → actions
* Green → success
* Red → error
* Yellow → warning
* Gray → neutral

---

### Performance Colors

Used across graphs and subject cards:

🟢 Excellent → 90%+

🔵 Good → 75–89%

🟡 Average → 50–74%

🔴 Needs Improvement → <50%

---

### Background

* White / off-white base
* Light gray surfaces for cards
* No dark-heavy theme required for v1

---

## Spacing System

Use strict 8px grid:

* 8px
* 16px
* 24px
* 32px

No random spacing.

---

## Border Radius

* Cards: 12px
* Buttons: 10px
* Inputs: 8px
* Modals: 16px

---

## Shadows

Very subtle only:

* Soft elevation
* No harsh shadows
* No neon glow

---

# 32. Component System

## Buttons

### Primary Button

Used for main actions:

* Save
* Create Test
* Share WhatsApp

Style:

* Filled
* Blue
* Large touch area
* Rounded

---

### Secondary Button

* Cancel
* Back
* Edit

Style:

* Outlined or light gray

---

### Danger Button

* Delete
* Archive

Style:

* Red with confirmation step

---

## Cards

Used for:

* Students
* Subjects
* Classes
* Test summaries

Rules:

* Large padding
* Emoji optional
* Always clickable

---

## Inputs

* Large text fields
* Auto-focus primary field
* Numeric keypad for marks
* No clutter

---

## Modals

Used for:

* Editing marks
* Creating tests
* Confirmations

Rules:

* Centered on mobile
* Full-screen modal on small devices
* Always has:

  * Save / Confirm
  * Cancel

---

# 33. Spreadsheet UI (MOST IMPORTANT)

This is the heart of the system.

---

## Layout Structure

```
--------------------------------------------------
| Student | Eng | Maths | Sci | Hindi | ...      |
--------------------------------------------------
| 😀 A    | 17/21 | 20/30 | 40/50 | ...          |
| 😀 B    | 18/21 | 22/30 | 39/50 | ...          |
--------------------------------------------------
```

---

## Sticky Elements

Must have:

* Sticky top row (subjects)
* Sticky first column (students)

---

## Cell Design

Each cell shows:

```
17 / 21
```

Below optional:

```
80%
```

(subtle, optional, low opacity)

---

## Interaction

### Tap Cell

Opens modal:

```
Obtained [ 17 ]
Total    [ 21 ]

[Save]   [Cancel]
```

---

### Auto Focus Rules

* Focus ALWAYS starts on "Obtained"
* Press Next → moves horizontally
* Press Save → moves vertically to next student

---

### Keyboard Behavior (Desktop)

* Enter → Save
* Tab → Next cell
* Arrow keys → navigate grid

---

### Mobile Behavior

* Tap → edit
* Save → auto jump to next cell

---

## Auto Save Indicator

After save:

```
Saved ✓
```

for 1.5–2 seconds.

---

# 34. Test Selection UI

Admin view:

```
Std 7
```

Cards:

* June Test
* July Test
* Weekly Test
* Unit Test

```

Each card shows:
- Date
- Completion status
- Number of students filled

---

Primary Action:

```

* New Test

```

---

# 35. Student Selection UI

Parent view:

```

Std 7

```

Cards:

```

😀 Vrutti
😀 Mansi
😀 Kevan

```

Rules:
- Emoji left
- Name right
- Large tap target
- Entire card clickable

---

# 36. Student Dashboard UI

## Header

```

😀 Vrutti
Std 7

```

---

## Overall Score Card

Large center display:

```

87.4%
↑ +3.1%

```

---

## Progress Chart

Line graph:
- Smooth curve
- Light grid
- Animated entry

---

## Subject Cards

Each subject:

```

Maths
87%
22 / 25

```

Color coded by performance.

---

## Comparison Block

```

Your Child      87.4%
Class Average   80.1%
Top Score       94.6%

```

---

## Notes Section

- Expandable cards
- Timestamped
- Bilingual support

---

## History

List of tests:

```

June Test
July Test
August Test

```

Click → detailed breakdown.

---

# 37. Admin Dashboard UI Flow

Step-based flow:

### Step 1: PIN

```

[ • • • • • • ]

```

---

### Step 2: Class Selection

Big grid of classes.

---

### Step 3: Test Selection

List + “New Test” button.

---

### Step 4: Spreadsheet

Full screen grid.

---

No extra navigation layers.

---

# 38. Modals & Popups

## Mark Editing Modal

```

---

Obtained: [ 17 ]
Total:    [ 21 ]

[ Save ]
[ Cancel ]
----------

```

Rules:
- Opens instantly
- No lag
- Auto-focus input
- Closes fast

---

## Confirm Delete Modal

Always explicit:

```

Are you sure?

This cannot be undone.

```

---

# 39. Animations

Keep animations subtle.

---

## Allowed Animations

- Fade in (150–200ms)
- Slide up modal
- Button press scale (0.98)
- Smooth graph transitions

---

## Not Allowed

- Heavy bounce animations
- Excess loading spinners
- Flashy transitions
- Parallax effects

---

# 40. Loading States

## Skeleton UI

Use for:
- Student lists
- Spreadsheet
- Dashboard cards

---

## OCR Loading

```

Scanning...
Analyzing handwriting...
Processing marks...

```

with progress bar.

---

# 41. Empty States

Examples:

### No Students

```

No students yet
Add your first student to begin

```

Button:
```

* Add Student

```

---

### No Tests

```

No tests created yet
Create your first test

```

---

# 42. Accessibility Rules

- Minimum font size: 16px
- Buttons ≥ 44px height
- High contrast text
- No color-only meaning
- Tap targets spaced properly
- Works on low-end Android devices

---

# 43. Responsive Behavior

## Mobile (Primary)

- Single column layout
- Full-screen modals
- Swipe-friendly UI

---

## Tablet

- Spreadsheet becomes more visible
- Side-by-side panels allowed

---

## Desktop

- Spreadsheet fully expanded
- Keyboard navigation enabled

---

# 44. UI Consistency Rules

- One style for all cards
- One modal system
- One button system
- One spacing system
- One typography system

No exceptions.

---

# 45. UX Golden Rule

> If a feature requires explanation, it is too complex.

---
# PART 6 — OCR + AI SYSTEM (Gemini Vision Integration)

This is the most “magical” part of the entire product.

It converts handwritten mark sheets into structured digital data with minimal admin effort.

---

# 63. OCR System Overview

## Goal

Allow admin to:

> Take a photo of a handwritten marksheet → instantly convert it into spreadsheet-ready data.

---

## Input Example

Admin uploads image like:

* Monthly test sheet
* Handwritten marks table
* Paper-based record (like your sample)

---

## Output Example

Structured JSON:

```json id="ocr1"
{
  "class": "Std 7",
  "test_name": "June Test",
  "students": [
    {
      "name": "Vrutti",
      "marks": {
        "English": { "obtained": 17, "total": 21 },
        "Maths": { "obtained": 20, "total": 30 }
      }
    }
  ]
}
```

---

# 64. OCR Workflow (End-to-End)

```id="flow1"
Upload Image
   ↓
Preprocess Image
   ↓
Send to Gemini Vision
   ↓
Structured Extraction
   ↓
Confidence Scoring
   ↓
Review Screen
   ↓
Admin Confirmation
   ↓
Save to Database
   ↓
Update Spreadsheet
```

---

# 65. Image Preprocessing (IMPORTANT)

Before sending to AI:

## Steps

* Convert to high contrast
* Remove shadows
* Slight sharpening
* Normalize rotation
* Crop unnecessary margins

---

## Goal

Improve handwriting recognition accuracy.

---

# 66. Gemini Vision Prompt Design

We send a strict structured prompt.

---

## SYSTEM PROMPT

```text id="prompt1"
You are an OCR system for extracting exam marks from handwritten school/tuition mark sheets.

Return ONLY valid JSON.

Do not include explanations.

Rules:
- Extract student names exactly as written.
- Extract subjects exactly as shown.
- Each mark is in format: obtained / total.
- If unclear, mark confidence low.
- Do not guess missing values.
```

---

## OUTPUT FORMAT (STRICT)

```json id="format1"
{
  "class": "",
  "test_name": "",
  "subjects": [],
  "students": [
    {
      "name": "",
      "marks": {
        "subject_name": {
          "obtained": 0,
          "total": 0,
          "confidence": 0.0
        }
      }
    }
  ]
}
```

---

# 67. Confidence Scoring System

Each extracted value includes:

```ts id="conf1"
confidence: 0.0 → 1.0
```

---

## Rules

* 0.9–1.0 → auto accept
* 0.7–0.89 → highlight lightly
* <0.7 → requires manual review

---

# 68. Review Screen (CRITICAL UX)

After OCR:

```id="review1"
132 marks detected

128 high confidence
4 need review
```

---

## UI Behavior

### High confidence

* Pre-filled
* Not highlighted

### Low confidence

* Yellow highlight
* Editable
* Requires admin check

---

## Example

```id="review2"
Vrutti → Maths → 18/30 ⚠
```

Admin taps → corrects value → saves

---

# 69. Auto Mapping Logic

AI sometimes returns:

```
Maths
Mathematics
MATH
Math
```

We normalize using:

## Subject Matching Algorithm

* lowercase
* trim spaces
* fuzzy match (Levenshtein distance)
* map to existing subject list

---

# 70. New Student Detection

If OCR finds unknown student:

```id="new1"
Devik (new)
```

System behavior:

Popup:

```
New Student Detected

Devik

Create student?
[Yes] [No]
```

---

# 71. Duplicate Handling

If student already exists:

* Match by name similarity
* Ask confirmation only if uncertain

---

# 72. Error Handling

If OCR fails:

```id="err1"
Could not read image clearly
```

Show options:

* Retake photo
* Upload again
* Manual entry fallback

---

# 73. Manual Override Mode

Admin can always switch to:

> “Edit Mode”

This bypasses OCR and allows direct spreadsheet entry.

---

# 74. WhatsApp Share Card Generator (AI + UI)

After test completion:

System generates:

## Visual Card

Includes:

* Class name
* Test name
* Class average
* Highest score
* Subject averages bar chart

---

## Example Card Content

```id="wa1"
📚 Std 7 - June Test

Class Average: 81.4%
Top Score: 94.6%

Maths ████████ 84%
Science ██████ 76%
English █████████ 89%
```

---

## Output Formats

* Image (for WhatsApp)
* Text message
* Shareable link

---

# 75. AI Insight Generation

Gemini also generates teacher summary:

---

## Prompt

```text id="ai1"
Analyze this class performance data.

Provide:
- improvement areas
- strong subjects
- weak subjects
- student attention suggestions

Keep it short and simple.
```

---

## Output Example

```
Maths performance dropped by 6%.

Science improved significantly.

3 students need extra practice in English.

Overall class performance is stable.
```

---

# 76. AI Guardrails

AI must NEVER:

* modify marks
* override admin input
* publish automatically
* invent students
* guess uncertain data

AI can only:

* suggest
* summarize
* structure
* highlight issues

---

# 77. OCR Cost Optimization Strategy

Since Gemini Vision is used:

* Only send image once per scan
* Cache result temporarily
* Avoid repeated calls during review

---

# 78. Performance Expectations

OCR flow must complete in:

* 2–6 seconds typical
* max 10 seconds worst case

---

# 79. Data Mapping to Database

OCR output maps to:

## students table

* name → students.name

## subjects table

* subject list → subjects.name

## marks table

* obtained → marks.obtained
* total → marks.total

## tests table

* test_name → tests.name

---

# 80. Final OCR Pipeline Summary

```id="pipe1"
Image Upload
   ↓
Preprocessing
   ↓
Gemini Vision OCR
   ↓
Structured JSON
   ↓
Confidence Scoring
   ↓
Mapping to DB Schema
   ↓
Review UI
   ↓
Admin Confirmation
   ↓
Save
   ↓
Spreadsheet Update
```
# PART 7 — API DESIGN & BUSINESS LOGIC

This section defines exactly how the system behaves at the code level.

The goal is to make implementation in Antigravity **direct, deterministic, and low-ambiguity**.

We assume:

* Next.js (App Router)
* Supabase backend
* Server Actions preferred over complex REST where possible

---

# 81. API Design Philosophy

## Core Rules

* No over-engineered REST APIs
* Prefer Server Actions over API routes
* Every mutation must be atomic
* No business logic in frontend
* Frontend = UI only
* Backend = logic + validation

---

# 82. Core Data Operations Map

| Feature            | Layer           |
| ------------------ | --------------- |
| Create test        | Server Action   |
| Update mark        | Server Action   |
| Copy test          | Server Action   |
| OCR upload         | Server Action   |
| Student management | Server Action   |
| Subject management | Server Action   |
| Analytics          | Query functions |
| Parent dashboard   | Query functions |

---

# 83. Server Actions (ADMIN)

---

## 83.1 createTest()

```ts id="api1"
createTest({
  classId,
  name,
  date,
  copyPreviousTest: boolean
})
```

---

### Logic

If `copyPreviousTest = true`:

1. Fetch latest test for class
2. Clone structure:

   * students list
   * subjects list
   * totals
3. Create new test
4. Create empty marks rows

---

### Output

```ts id="api2"
{
  testId: string
}
```

---

# 84. updateMark()

```ts id="api3"
updateMark({
  testId,
  studentId,
  subjectId,
  obtained,
  total
})
```

---

## Validation Rules

* obtained ≤ total
* total > 0
* student must belong to class
* subject must belong to class

---

## Logic

1. Upsert into `marks`
2. Recalculate derived values (NOT stored)
3. Return updated cell

---

## Response

```ts id="api4"
{
  success: true,
  updatedPercentage: number
}
```

---

# 85. bulkUpdateMarks()

Used for OCR and spreadsheet paste.

```ts id="api5"
bulkUpdateMarks({
  testId,
  marks: [
    {
      studentId,
      subjectId,
      obtained,
      total
    }
  ]
})
```

---

## Logic

* Batch insert/update
* Use Supabase transaction
* Skip invalid rows
* Return error report for failed rows

---

# 86. createStudent()

```ts id="api6"
createStudent({
  classId,
  name
})
```

---

## Logic

* Assign random approved emoji
* Insert student
* Return student object

---

# 87. archiveStudent()

```ts id="api7"
archiveStudent({
  studentId
})
```

---

## Logic

* Set status = archived
* Remove from future tests only
* Keep all historical marks intact

---

# 88. createSubject()

```ts id="api8"
createSubject({
  classId,
  name
})
```

---

## Logic

* Insert subject
* Assign next order_index

---

# 89. reorderSubjects()

```ts id="api9"
reorderSubjects({
  classId,
  orderedSubjectIds: string[]
})
```

---

## Logic

* Update order_index for each subject

---

# 90. createOrUpdateNote()

```ts id="api10"
createOrUpdateNote({
  testId,
  studentId?,
  subjectId?,
  type,
  content,
  language
})
```

---

## Logic

* Upsert note
* Allow multiple notes per test

---

# 91. generateAIInsights()

```ts id="api11"
generateAIInsights({
  testId
})
```

---

## Logic

1. Fetch all marks
2. Compute:

   * averages
   * trends
   * weak subjects
3. Send to Gemini
4. Store draft insight

---

# 92. publishInsights()

```ts id="api12"
publishInsights({
  insightId
})
```

---

## Logic

* status = published
* visible to parents

---

# 93. OCR upload handler

```ts id="api13"
uploadOCRImage({
  file
})
```

---

## Steps

1. Upload image to Supabase Storage
2. Get public URL
3. Send to Gemini Vision
4. Parse structured JSON
5. Return review payload

---

# 94. confirmOCRImport()

```ts id="api14"
confirmOCRImport({
  testId,
  parsedData
})
```

---

## Logic

1. Validate structure
2. Match students
3. Match subjects
4. Insert into marks table
5. Return summary

---

# 95. getClassData()

Used for parent portal.

```ts id="api15"
getClassData({
  classId
})
```

---

## Returns

* students
* subjects
* tests
* marks (optional filtered)
* notes

---

# 96. getStudentDashboard()

```ts id="api16"
getStudentDashboard({
  studentId
})
```

---

## Returns

* all marks for student
* subject-wise aggregation
* overall percentage history
* class comparison
* notes
* rankings

---

# 97. Business Logic Layer

---

# 98. Ranking Engine

```ts id="logic1"
rankStudents(testId)
```

---

## Steps

1. Fetch all students in class
2. Compute:

```ts id="logic2"
overall = sum(obtained) / sum(total)
```

3. Sort descending
4. Assign rank

---

## Tie Handling

If equal percentage:

* same rank assigned
* skip next rank accordingly

---

# 99. Percentage Engine

---

## Subject Percentage

```ts id="logic3"
(obtained_sum / total_sum) * 100
```

---

## Overall Percentage

```ts id="logic4"
sum(all obtained) / sum(all total) * 100
```

---

## Class Average

```ts id="logic5"
avg(student_overall_percentages)
```

---

# 100. Copy Test Engine

This is critical logic.

---

## Function

```ts id="logic6"
cloneTest(previousTestId)
```

---

## Steps

1. Fetch previous test
2. Create new test row
3. Copy:

   * subjects
   * students snapshot
   * total marks structure
4. Create blank marks rows

---

## DO NOT copy:

* obtained marks
* AI insights
* old notes
* rankings

---

# 101. Data Integrity Rules

---

## Rule 1

Marks must always belong to valid:

* student
* subject
* test

---

## Rule 2

No orphan marks allowed

---

## Rule 3

Archived students:

* cannot receive new marks
* remain in history

---

## Rule 4

Subjects cannot be hard deleted if used in tests

Only archive allowed

---

# 102. Error Handling Strategy

---

## Standard Response

```ts id="err1"
{
  success: false,
  error: string,
  code: string
}
```

---

## Common Errors

* INVALID_MARKS
* STUDENT_NOT_FOUND
* SUBJECT_NOT_FOUND
* TEST_LOCKED
* OCR_FAILED

---

# 103. Performance Strategy

Since dataset is small:

* No caching layer needed
* Direct DB queries are fine
* Index all foreign keys
* Use batch inserts for OCR

---

# 104. Security Rules

---

## Admin-only operations

* createTest
* updateMark
* delete/archive anything
* OCR upload

---

## Public operations

* read-only access
* student dashboard
* class dashboard

---

# 105. Transaction Safety

Critical operations must use DB transactions:

* bulkUpdateMarks
* cloneTest
* OCR import

Ensures no partial writes.

--- 

# PART 8 — TECH ARCHITECTURE, DEPLOYMENT & PROJECT STRUCTURE

This section defines how the system is built, organized, and deployed.

The goal is:

> A clean Next.js project that Antigravity can generate and maintain without confusion.

---

# 106. System Architecture Overview

## High-Level Stack

```id="arch1"
Frontend: Next.js 15 (App Router)
Backend: Supabase (PostgreSQL + Storage + Auth)
Styling: Tailwind CSS
UI Components: shadcn/ui
Animations: Framer Motion
Charts: Recharts
AI: Gemini Vision API
Deployment: Vercel
Repo: GitHub
```

---

## Architecture Style

* Monolithic frontend (Next.js)
* Backend-as-a-Service (Supabase)
* Server Actions for business logic
* No separate backend server

---

# 107. System Flow

## Admin Flow

```id="flow1"
Next.js UI
   ↓
Server Actions
   ↓
Supabase DB
   ↓
Realtime UI Update
```

---

## Parent Flow

```id="flow2"
Next.js Public Pages
   ↓
Supabase Read Queries
   ↓
Computed Dashboard Data
```

---

## OCR Flow

```id="flow3"
Image Upload (Next.js)
   ↓
Supabase Storage
   ↓
Gemini Vision API
   ↓
Structured JSON
   ↓
Review UI
   ↓
DB Insert
```

---

# 108. Project Folder Structure

This is VERY IMPORTANT for Antigravity.

```id="folder1"
src/
│
├── app/
│   ├── (public)/
│   │   ├── page.tsx                 # Landing
│   │   ├── std/[class]/page.tsx     # Class page
│   │   ├── student/[id]/page.tsx    # Student dashboard
│   │
│   ├── (admin)/
│   │   ├── admin/page.tsx           # PIN entry
│   │   ├── admin/[class]/page.tsx   # Class list
│   │   ├── admin/test/[id]/page.tsx # Spreadsheet
│   │
│   ├── api/ (optional minimal use)
│
├── components/
│   ├── ui/
│   ├── spreadsheet/
│   ├── charts/
│   ├── cards/
│   ├── modals/
│
├── lib/
│   ├── supabase/
│   ├── actions/        # server actions
│   ├── ai/             # Gemini logic
│   ├── utils/
│   ├── constants/
│
├── services/
│   ├── marks.service.ts
│   ├── test.service.ts
│   ├── student.service.ts
│
├── hooks/
│
├── store/
│   ├── ui-store.ts
│
├── types/
│
└── styles/
```

---

# 109. Key Architectural Decisions

## 1. Server Actions First

All writes go through:

* createTest()
* updateMark()
* bulkUpdateMarks()

No direct client DB writes.

---

## 2. Supabase as Source of Truth

Everything is stored in Supabase.

No local caching of important data.

---

## 3. Stateless Frontend

* No server memory
* No session state except admin PIN
* All state comes from DB

---

## 4. Computation Strategy

All derived values:

* percentages
* rankings
* averages

are computed in:

```id="comp1"
server actions OR utility functions
```

NOT stored in DB.

---

# 110. Environment Variables

```id="env1"
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

SUPABASE_SERVICE_ROLE_KEY=

GEMINI_API_KEY=

NEXT_PUBLIC_APP_URL=
```

---

# 111. Supabase Setup

## Tables

Already defined in Part 5:

* classes
* students
* subjects
* tests
* marks
* notes
* ai_insights
* audit_logs

---

## Storage Buckets

```id="bucket1"
ocr-images
share-cards
```

---

## RLS Policies

### Public Read

* SELECT allowed on:

  * students
  * subjects
  * tests
  * marks (published only)
  * notes (published only)

---

### Admin Full Access

* INSERT / UPDATE / DELETE all tables

Controlled via server actions using service role key.

---

# 112. Deployment Strategy (Vercel)

---

## Steps

1. Push to GitHub
2. Connect repo to Vercel
3. Add environment variables
4. Deploy

---

## Build Settings

* Framework: Next.js
* Node: 18+
* Output: default

---

## Performance Settings

Enable:

* Edge functions (where useful)
* Image optimization
* ISR for public pages

---

# 113. Route Strategy

## Public Routes

```id="route1"
/
std/[class]
student/[id]
```

---

## Admin Routes

```id="route2"
admin
admin/[class]
admin/test/[id]
```

---

## API Routes (minimal usage)

Only for:

* OCR webhook fallback (optional)
* file upload proxy (optional)

Most logic uses Server Actions.

---

# 114. Build Strategy

## Phase 1

* Database setup
* Admin spreadsheet
* Basic student system

---

## Phase 2

* Parent dashboard
* Ranking system
* Notes system

---

## Phase 3

* OCR integration
* AI insights
* WhatsApp sharing

---

## Phase 4

* Polish UI
* Animations
* Optimization

---

# 115. Performance Optimization

## Strategy

* Server components for read-heavy pages
* Client components only where needed (spreadsheet)
* Lazy load charts
* Debounce mark updates

---

## Spreadsheet Optimization

* Virtualized rows (if needed)
* Batch updates
* Avoid full re-render on each cell edit

---

# 116. Security Model

## Admin Security

* 6-digit PIN stored hashed
* Session stored in HTTP-only cookie
* Server action validation required

---

## Public Security

* No sensitive data exposed
* Read-only access only
* No student personal data beyond name/emoji

---

# 117. Logging & Debugging

## Logs stored for:

* OCR failures
* Mark updates
* Test cloning
* AI generation

---

## Audit logs

Used for rollback/debugging.

---

# 118. Scaling Strategy (Future Proofing)

Even though this is a single tuition system:

Design allows:

* multiple classes
* multiple tests
* potential multi-tuition expansion later

WITHOUT rewriting schema.

---

# 119. Failure Recovery Strategy

If something breaks:

* Supabase is source of truth
* CSV export allows full recovery
* Audit logs track changes

---

# 120. Production Checklist

Before launch:

* [ ] All environment variables set
* [ ] RLS enabled
* [ ] OCR tested with real images
* [ ] Spreadsheet performance tested
* [ ] WhatsApp sharing tested on Android
* [ ] Language switching tested
* [ ] Mobile layout verified

---
# PART 9 — TESTING, EDGE CASES & ACCEPTANCE CRITERIA

This section ensures the system is **production-safe, error-resistant, and real-world usable**.

The goal is:

> Even in messy real-life conditions (bad handwriting, wrong inputs, missing data), the system should not break.

---

# 121. Testing Philosophy

We do NOT test like a corporate SaaS.

We test like a real tuition center:

* fast typing
* mistakes during entry
* unclear handwriting
* missing students
* duplicate entries
* low internet speed

---

# 122. Critical Edge Case Categories

We group edge cases into 6 categories:

1. Data Entry Errors
2. OCR Failures
3. UI/UX Edge Cases
4. Data Integrity Issues
5. Network Issues
6. Logical Calculation Errors

---

# 123. Data Entry Edge Cases

## 123.1 Invalid Mark Input

### Case

User enters:

```id="ec1"
25/20
```

### Expected

* Show validation error
* Prevent save

```id="ec1a"
Obtained cannot exceed Total
```

---

## 123.2 Empty Input

User leaves fields blank.

### Expected

* Allow temporarily
* Mark as incomplete
* Highlight cell in yellow

---

## 123.3 Partial Entry

Only obtained entered, no total.

### Expected

* Save blocked OR flagged
* Must complete both fields

---

## 123.4 Rapid Editing

User quickly edits multiple cells.

### Expected

* Debounce saves (300–500ms)
* Prevent race conditions

---

# 124. OCR Edge Cases

---

## 124.1 Low Quality Image

Blurry or dark image.

### Expected

* OCR fails gracefully
* Prompt:

```text id="ocr1"
Image unclear. Please retake.
```

---

## 124.2 Misread Student Name

Example:

```id="ocr2"
"Vruttl" instead of "Vrutti"
```

### Expected

* Suggest closest match
* Ask confirmation

---

## 124.3 Missing Subject Column

AI fails to detect subject.

### Expected

* Mark as "unmapped"
* Show in review screen

---

## 124.4 Extra Unknown Student

OCR detects:

```id="ocr3"
"Devk"
```

### Expected

* Show "New Student Detected"
* Ask confirmation before creation

---

## 124.5 Mixed Layout Paper

If handwritten sheet is messy:

### Expected

* Partial extraction allowed
* Show confidence per row

---

# 125. UI/UX Edge Cases

---

## 125.1 Slow Internet

### Expected Behavior

* Show loading skeletons
* Allow offline typing (temporary cache)
* Sync when reconnected

---

## 125.2 Large Class (Future Proof)

Even if 50+ students:

* spreadsheet must remain usable
* enable vertical scroll optimization
* sticky headers required

---

## 125.3 Small Screen Phones

On small Android devices:

* no horizontal overflow bugs
* subjects must scroll horizontally
* student column must remain fixed

---

## 125.4 Accidental Navigation

If user leaves spreadsheet:

```id="ux1"
Unsaved changes detected
```

Options:

* Stay
* Leave

---

# 126. Data Integrity Edge Cases

---

## 126.1 Duplicate Marks Entry

Same student + subject + test edited twice rapidly.

### Expected

* Last write wins
* OR version control prevents overwrite conflict

---

## 126.2 Deleted Subject in Old Test

If subject is archived:

* old marks remain intact
* subject still visible in historical view

---

## 126.3 Student Archived Mid-Test

If student is archived:

* remains in existing tests
* excluded from future tests

---

## 126.4 Test Copy Error

If copy previous fails:

* fallback to empty test structure
* show warning

---

# 127. Calculation Edge Cases

---

## 127.1 Division by Zero

If total = 0:

* show 0%
* do NOT crash

---

## 127.2 Missing Marks

If incomplete data:

* exclude from ranking temporarily

---

## 127.3 Tie Scores

If same percentage:

* assign same rank
* skip next rank properly

Example:

```id="calc1"
A - 1
B - 1
C - 3
```

---

# 128. OCR + Spreadsheet Sync Edge Cases

---

## 128.1 Partial OCR Import

If only 80% successful:

* import successful rows
* highlight failed rows

---

## 128.2 Duplicate Import

Same sheet uploaded twice:

* detect similarity
* warn user:

```id="ocrwarn"
This test already exists. Continue?
```

---

## 128.3 Manual Override After OCR

Admin edits OCR data:

* changes must overwrite OCR data cleanly
* no duplication allowed

---

# 129. Parent View Edge Cases

---

## 129.1 No Data Yet

If student has no tests:

```id="p1"
No results available yet
```

---

## 129.2 Missing Subject Data

Show:

* “Not available”

instead of crashing charts

---

## 129.3 Switching Students

Ensure:

* previous state cleared
* no data leakage between students

---

# 130. Performance Edge Cases

---

## 130.1 Large Spreadsheet Rendering

If many rows:

* use virtualization (React Window if needed)
* avoid full re-render on edit

---

## 130.2 Heavy OCR Load

If multiple uploads:

* queue system
* process sequentially

---

# 131. Security Edge Cases

---

## 131.1 Wrong PIN Attempts

* simple retry allowed
* no lockout needed (single admin system)

---

## 131.2 Direct URL Access

If user tries:

```id="sec1"
/admin/test/xyz
```

without login:

* redirect to PIN page

---

## 131.3 Public Data Leakage

Ensure:

* no admin-only data exposed in client bundle

---

# 132. Acceptance Criteria (FINAL SYSTEM CHECK)

The system is considered production-ready ONLY if:

---

## Admin Must Be Able To:

* Create a test in < 30 seconds
* Copy previous test successfully
* Enter marks via spreadsheet smoothly
* Use OCR with review step
* Add/edit/archive students
* Add/edit/archive subjects
* Share WhatsApp report
* Fix mistakes easily

---

## Parent Must Be Able To:

* Open site in < 30 seconds
* Select student easily
* View progress graph
* Understand performance instantly
* Compare with class average
* Read teacher notes

---

## System Must:

* Never lose data
* Never crash on bad input
* Handle OCR errors gracefully
* Work smoothly on Android phones
* Support bilingual UI fully
* Calculate all stats correctly

---

## UX Must:

* Feel like spreadsheet, not ERP
* Require minimal taps
* Be readable and calm
* Avoid clutter completely

---

# 133. Final Validation Checklist

Before launch:

* [ ] OCR tested with real paper images
* [ ] Spreadsheet tested with 7+ subjects
* [ ] Parent flow tested on mobile
* [ ] WhatsApp sharing tested on Android
* [ ] Language switching verified
* [ ] Offline/slow network tested
* [ ] Edge cases validated

---
# PART 10 — ANTIGRAVITY IMPLEMENTATION GUIDE (FINAL BUILD SPEC)

This is the **execution blueprint**.

If Parts 1–9 define *what to build*, this defines:

> exactly how Antigravity should build it step-by-step without confusion.

No ambiguity. No architectural decisions left open.

---

# 134. Build Strategy (IMPORTANT)

We build in this order:

```id="build1"
1. Database (Supabase)
2. Core UI Shell (Next.js)
3. Admin Spreadsheet (MVP CORE)
4. Student + Parent Portal
5. Test + Class System
6. Ranking + Calculations
7. OCR System
8. AI Insights
9. WhatsApp Sharing
10. Polish + Animations + Language
```

---

# 135. Hard Rules for Implementation

These rules MUST NOT be violated:

## Rule 1 — Spreadsheet First

If spreadsheet is not working:

> Nothing else matters.

---

## Rule 2 — No Overengineering

No:

* microservices
* complex state machines
* Redux
* backend servers

Only:

* Next.js
* Supabase
* Server Actions

---

## Rule 3 — UI Simplicity

Every screen must answer:

> “What is the one action here?”

---

## Rule 4 — Mobile First Always

Admin is on Android phone 97% of the time.

---

# 136. Phase 1 — Database Setup (DAY 1)

Create Supabase tables exactly from Part 5:

* classes
* students
* subjects
* tests
* marks
* notes
* ai_insights
* audit_logs

---

## Must add indexes immediately:

```sql id="idx1"
marks(test_id)
marks(student_id)
marks(subject_id)
students(class_id)
subjects(class_id)
tests(class_id)
```

---

# 137. Phase 2 — Core App Shell

## Routes to create first:

```id="routes1"
/
std/[class]
student/[id]
admin
admin/[class]
admin/test/[id]
```

---

## Layout Rules:

* public layout ≠ admin layout
* no shared UI confusion
* admin always isolated

---

# 138. Phase 3 — Spreadsheet MVP (CRITICAL)

This is the FIRST functional milestone.

---

## Must Implement:

### Grid structure

* sticky header
* sticky student column
* scroll both directions

---

### Cell editing

* tap → modal
* edit obtained + total
* save → instant update

---

### Server Action

```ts id="sa1"
updateMark()
```

---

## Success Criteria:

* 100 marks can be entered without lag
* no page reload required
* mobile usable with thumb only

---

# 139. Phase 4 — Test System

## Features:

* create test
* copy previous test
* list tests
* archive test

---

## Critical Feature:

### COPY PREVIOUS TEST

Must replicate:

* students
* subjects
* total marks

BUT NOT:

* obtained marks

---

# 140. Phase 5 — Student System

## Admin:

* add student
* archive student
* emoji auto-assign

## Parent:

* select student
* view dashboard

---

# 141. Phase 6 — Ranking Engine

Trigger after every:

* mark update
* test completion

---

## Must compute:

* overall %
* class average
* rank
* improvement

---

## Formula:

```id="rank1"
sum(obtained) / sum(total) * 100
```

---

# 142. Phase 7 — Parent Dashboard

Must include:

* progress graph
* subject cards
* comparison vs class
* notes
* test history

---

## Must be:

* instant load
* mobile optimized
* no admin UI leakage

---

# 143. Phase 8 — OCR SYSTEM

---

## Pipeline:

```id="ocrflow"
Upload image
→ preprocess
→ Gemini Vision
→ structured JSON
→ confidence scoring
→ review UI
→ confirm import
```

---

## Critical Rule:

> OCR NEVER writes directly to DB without review

---

## Output format must match:

* students
* subjects
* marks (obtained/total)

---

# 144. Phase 9 — AI INSIGHTS

Trigger on:

* test completion

---

## Must generate:

* weak subjects
* strong subjects
* improvement areas

---

## Must NOT:

* modify marks
* auto publish

---

# 145. Phase 10 — WhatsApp Sharing

---

## Must generate:

* summary text
* class average
* top score
* share link

---

## Must support:

* Android WhatsApp deep link
* Web Share API fallback

---

# 146. UI RULES (STRICT)

---

## Spreadsheet rules:

* one tap edit
* no dropdown overload
* no extra buttons inside grid
* always keep grid visible

---

## Modal rules:

* always full screen on mobile
* always auto-focus input
* always 2 buttons only:

  * Save
  * Cancel

---

## Animation rules:

* subtle only
* no bounce
* no heavy transitions

---

# 147. Language System

---

## Must support:

* English
* Gujarati

---

## Rule:

EVERY STRING must come from:

```ts id="lang1"
t("key")
```

---

No hardcoded text allowed.

---

# 148. Performance Constraints

---

## Must ensure:

* spreadsheet loads < 1.5s
* mark update < 300ms perceived
* OCR < 10s max
* dashboard < 2s load

---

# 149. Failure Handling Rules

---

## If anything fails:

* show friendly message
* never crash UI
* allow retry

---

## Example:

```id="fail1"
Could not save. Try again.
```

---

# 150. FINAL ACCEPTANCE CHECKLIST (LAUNCH READY)

System is complete ONLY IF:

---

## Admin:

* can run entire class from phone
* can create test in < 30 seconds
* can enter marks like spreadsheet
* can scan paper and import
* can share WhatsApp update

---

## Parent:

* opens link → sees child instantly
* understands progress in 10 seconds
* sees comparison clearly
* reads teacher notes easily

---

## System:

* no crashes
* no data loss
* consistent calculations
* fast on Android
* clean bilingual UI

---

# 151. FINAL BUILD PRINCIPLE

> If a feature adds complexity but not speed, remove it.

---

