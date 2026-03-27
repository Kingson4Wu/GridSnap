interface Props {
  onShareClick: () => void
}

export function Header({ onShareClick }: Props) {
  return (
    <header className="w-full flex items-center justify-between py-3 px-4 border-b border-white/10">
      <div className="w-8" />
      <h1 className="text-lg font-bold tracking-widest text-white">GridSnap</h1>
      <button
        type="button"
        aria-label="Share"
        onClick={onShareClick}
        className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 text-white/60 hover:text-white/80 hover:bg-white/10 transition-colors"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="18" cy="5" r="3"/>
          <circle cx="6" cy="12" r="3"/>
          <circle cx="18" cy="19" r="3"/>
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
        </svg>
      </button>
    </header>
  )
}
