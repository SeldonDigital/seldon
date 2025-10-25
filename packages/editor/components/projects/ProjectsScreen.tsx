export const ProjectsScreen = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="mx-auto my-14 gap-16 w-full max-w-7xl px-4 text-white flex flex-col flex-1 relative pb-24">
      <div
        className="absolute left-0 w-full h-[600px] -top-[500px]"
        style={{
          borderRadius: "173.776px",
          opacity: "0.8",
          background:
            "linear-gradient(90deg, #FF4F4F 0%, #EBEB00 20%, #45E66D 40%, #3FB5FF 70%, #FF4F4F 100%)",

          filter: "blur(284.8788757324219px)",
        }}
      />
      {children}
    </div>
  )
}
