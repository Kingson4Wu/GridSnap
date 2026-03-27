# Share App Feature Design

**Goal:** Add a share button to the Header that opens a bottom sheet for sharing the GridSnap app URL to social media platforms.

**Architecture:** Share icon added to `Header.tsx`. Clicking it opens `ShareSheet.tsx` (a bottom sheet overlay). Open/close state lives in `App.tsx` and is passed down as props. Platform URL construction and clipboard logic extracted to `src/utils/shareApp.ts`. New i18n strings added to `src/i18n.ts`.

**Tech Stack:** React 18, TypeScript, Tailwind CSS, Clipboard API, Web Share API

---

## Entry Point

A share icon button in the top-right of `Header.tsx`, always visible regardless of whether an image is selected. Uses the same share SVG icon (three dots connected by lines) at 28×28px with a subtle border, matching existing header style.

## Share Sheet

A bottom sheet overlay rendered in `App.tsx` when `shareOpen` state is true. Tapping the backdrop closes it.

**Contents (top to bottom):**
1. Drag handle bar
2. Title: "Share GridSnap" / "分享 GridSnap"
3. Platform icon row: X, WhatsApp, Telegram
4. Copy Link row: shows truncated URL + "Copy" / "复制" button; after click shows "Copied!" / "已复制" for 2 seconds then reverts
5. "More" button (Web Share API) — only rendered when `navigator.share` is defined

## Platform URLs

All platforms share the same app URL: `https://kingson4wu.github.io/GridSnap/`

Share text (English): `"GridSnap — Split any photo into a grid for Instagram"`
Share text (Chinese): `"GridSnap — 把图片切成九宫格，发布到 Instagram"`

| Platform | URL pattern |
|----------|-------------|
| X | `https://twitter.com/intent/tweet?text=<text>&url=<url>` |
| WhatsApp | `https://wa.me/?text=<text>%20<url>` |
| Telegram | `https://t.me/share/url?url=<url>&text=<text>` |

All open in a new tab (`window.open(..., '_blank')`).

## Copy Link

Uses `navigator.clipboard.writeText(url)`. Falls back to creating a temporary `<textarea>` + `document.execCommand('copy')` if Clipboard API is unavailable.

## More (Web Share API)

Calls `navigator.share({ title: 'GridSnap', text, url })`. Only rendered when `typeof navigator.share === 'function'`.

## i18n Strings

```
shareTitle:    zh ? '分享 GridSnap'          : 'Share GridSnap'
shareText:     zh ? 'GridSnap — 把图片切成九宫格，发布到 Instagram'
                  : 'GridSnap — Split any photo into a grid for Instagram'
copyLink:      zh ? '复制'                   : 'Copy'
copied:        zh ? '已复制'                 : 'Copied!'
moreOptions:   zh ? '更多'                   : 'More'
```

## State

`shareOpen: boolean` lives in `App.tsx`. Passed to `Header` (as `onShareClick`) and `ShareSheet` (as `open` + `onClose`).

## Files

- **Create:** `src/components/ShareSheet.tsx`
- **Create:** `src/utils/shareApp.ts`
- **Modify:** `src/components/Header.tsx` — add share icon button, accept `onShareClick` prop
- **Modify:** `src/App.tsx` — add `shareOpen` state, wire up Header and ShareSheet
- **Modify:** `src/i18n.ts` — add share-related strings
