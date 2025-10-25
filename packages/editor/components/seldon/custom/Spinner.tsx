// TODO: Create a Seldon component for this
export function Spinner() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <img
        src="/spinner-dots.png"
        alt="Loading"
        width={16}
        height={16}
        className="animate-spin-fast"
      />
    </div>
  )
}
