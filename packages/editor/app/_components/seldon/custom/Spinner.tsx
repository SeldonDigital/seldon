// TODO: Create a Seldon component for this
export function Spinner() {
  return (
    <div
      style={{
        display: "flex",
        height: "100%",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <img
        src="/spinner-dots.png"
        alt="Loading"
        width={16}
        height={16}
        style={{ animation: "spin 0.6s linear infinite" }}
      />
    </div>
  )
}
