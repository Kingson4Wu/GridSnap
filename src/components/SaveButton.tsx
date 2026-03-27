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
      className="w-full py-4 rounded-xl font-semibold text-base transition-colors
        bg-[#e94560] text-white
        disabled:opacity-40 disabled:cursor-not-allowed
        hover:bg-[#c73652] active:scale-95"
    >
      {loading ? '处理中...' : '保存到相册'}
    </button>
  )
}
