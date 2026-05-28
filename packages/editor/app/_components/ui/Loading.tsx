export function Loading({ size = 16 }: { size?: number }) {
  return (
    <img
      src="/spinner-dots.png"
      alt="loading"
      width={size}
      height={size}
      className="animate-spin-fast"
    />
  )
}
