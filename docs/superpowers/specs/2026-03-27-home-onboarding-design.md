# Home Screen Onboarding Design

**Goal:** Add a 3-step guide to the empty home screen so first-time users immediately understand what the app does.

**Architecture:** Pure UI addition to the existing empty state in `App.tsx`. No new state, no new hooks. Steps are static content rendered when `imageSrc` is null, above the `ImagePicker` button. Text is added to `i18n.ts`.

**Tech Stack:** React, Tailwind CSS, existing `i18n.ts`

---

## Behaviour

- Steps are visible **only when no image is selected** (the `!imageSrc` branch in `App.tsx`)
- When the user selects a photo, the crop UI takes over — steps are gone
- A thin divider (`<hr>`) separates the steps from the select-photo button
- Steps follow the existing `navigator.language` i18n: Chinese for `zh-*`, English otherwise

## Content

**English:**
1. Select a photo from your library
2. Choose grid layout & aspect ratio
3. Save tiles & post them in order

**Chinese:**
1. 从相册选取一张图片
2. 选择网格类型和比例
3. 保存切图，按顺序发布

## Visual Design

- Numbered circle badge: `#e94560` border, semi-transparent red fill, red number
- Step text: `text-white/55`, small (`text-sm`)
- Divider: `border-white/10` between steps and the select button
- No animation, no transitions — static content
