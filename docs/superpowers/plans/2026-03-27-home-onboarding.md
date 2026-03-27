# Home Screen Onboarding Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a 3-step how-to guide above the select-photo button on the empty home screen.

**Architecture:** Two file changes only. Add a `steps` array to `src/i18n.ts`, then render the steps in the `!imageSrc` branch of `src/App.tsx` above the `ImagePicker`. No new components, no new state.

**Tech Stack:** React 18, TypeScript, Tailwind CSS, Vitest + @testing-library/react

---

### Task 1: Add step strings to i18n.ts

**Files:**
- Modify: `src/i18n.ts`
- Test: `src/i18n.test.ts` (create)

- [ ] **Step 1: Write the failing test**

Create `src/i18n.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { t } from './i18n'

describe('t.steps', () => {
  it('has exactly 3 steps', () => {
    expect(t.steps).toHaveLength(3)
  })

  it('each step is a non-empty string', () => {
    for (const step of t.steps) {
      expect(typeof step).toBe('string')
      expect(step.length).toBeGreaterThan(0)
    }
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test -- --reporter=verbose 2>&1 | grep -A 5 "t.steps"
```

Expected: FAIL — `t.steps` is `undefined`, `toHaveLength` throws.

- [ ] **Step 3: Add `steps` to i18n.ts**

Replace the contents of `src/i18n.ts` with:

```ts
const zh = navigator.language.startsWith('zh')

export const t = {
  selectPhoto: zh ? '点击选取图片' : 'Tap to select a photo',
  changePhoto: zh ? '重新选取图片' : 'Change photo',
  saveFailed:  zh ? '保存失败，请重试' : 'Save failed, please try again',
  ratio:       zh ? '比例' : 'Ratio',
  steps: zh
    ? ['从相册选取一张图片', '选择网格类型和比例', '保存切图，按顺序发布']
    : ['Select a photo from your library', 'Choose grid layout & aspect ratio', 'Save tiles & post them in order'],
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm test -- --reporter=verbose 2>&1 | grep -A 5 "t.steps"
```

Expected: 2 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/i18n.ts src/i18n.test.ts
git commit -m "feat: add step strings to i18n"
```

---

### Task 2: Render steps in the home empty state

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1: Write the failing test**

Add to `src/i18n.test.ts`:

```ts
import { render, screen } from '@testing-library/react'
import App from './App'

describe('Home empty state', () => {
  it('shows all 3 onboarding steps before image is selected', () => {
    render(<App />)
    for (const step of t.steps) {
      expect(screen.getByText(step)).toBeInTheDocument()
    }
  })
})
```

Also add the import at the top of `src/i18n.test.ts`:

```ts
import { render, screen } from '@testing-library/react'
import App from './App'
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test -- --reporter=verbose 2>&1 | grep -A 5 "Home empty state"
```

Expected: FAIL — step text not found in DOM.

- [ ] **Step 3: Add the steps UI to App.tsx**

In `src/App.tsx`, replace the `!imageSrc` branch:

```tsx
{!imageSrc ? (
  <main className="flex-1 p-4 flex flex-col gap-4">
    <div className="flex flex-col gap-3">
      {t.steps.map((step, i) => (
        <div key={i} className="flex items-start gap-3">
          <div className="w-5 h-5 rounded-full border border-[#e94560] bg-[#e94560]/15 text-[#e94560] text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
            {i + 1}
          </div>
          <span className="text-sm text-white/55">{step}</span>
        </div>
      ))}
    </div>
    <hr className="border-white/10" />
    <ImagePicker onImageSelected={handleImageSelected} />
  </main>
) : (
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test -- --reporter=verbose 2>&1 | grep -E "PASS|FAIL|steps|Home empty"
```

Expected: all tests PASS.

- [ ] **Step 5: Build to verify no type errors**

```bash
npm run build 2>&1 | tail -5
```

Expected: `✓ built in ...ms`

- [ ] **Step 6: Commit**

```bash
git add src/App.tsx src/i18n.test.ts
git commit -m "feat: show 3-step onboarding guide on home empty state"
```
