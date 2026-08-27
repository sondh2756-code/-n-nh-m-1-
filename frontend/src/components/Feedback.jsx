export function Loading({ label = "Đang tải..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4 text-on-surface-variant">
      <div className="w-10 h-10 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      <span className="font-label-caps text-label-caps">{label}</span>
    </div>
  );
}

export function ErrorMessage({ message = "Da co loi xay ra", onRetry }) {
  return (
    <div className="glass-panel rounded-xl p-8 flex flex-col items-center gap-4 text-center">
      <span className="material-symbols-outlined text-error text-4xl">
        error
      </span>
      <p className="text-on-surface-variant font-body-md text-body-md">
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="btn-gradient px-6 py-2 rounded-lg font-headline-lg text-[14px]"
        >
          Thu lai
        </button>
      )}
    </div>
  );
}
