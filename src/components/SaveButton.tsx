interface Props {
  disabled: boolean
  loading: boolean
  onClick: () => void
}

export function SaveButton({ disabled, loading, onClick }: Props) {
  return (
    <button
      type="button"
      disabled={disabled || loading}
      onClick={onClick}
      className="w-12 h-12 rounded-full flex-none flex items-center justify-center
        bg-[#e94560] text-white transition-colors
        disabled:opacity-40 disabled:cursor-not-allowed
        hover:bg-[#c73652] active:scale-95"
    >
      {loading ? (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="animate-spin">
          <circle cx="10" cy="10" r="8" stroke="white" strokeWidth="2" strokeOpacity="0.3" />
          <path d="M10 2a8 8 0 0 1 8 8" stroke="white" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ) : (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 15V3M7 10l5 5 5-5M3 18v1a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-1" />
        </svg>
      )}
    </button>
  )
}
