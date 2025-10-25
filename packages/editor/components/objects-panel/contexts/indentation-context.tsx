import { createContext, useContext } from "react"

export const IndentationContext = createContext<number>(0)

export const IndentationContextProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const indentation = useIndentation()

  return (
    <IndentationContext.Provider value={indentation + 1}>
      {children}
    </IndentationContext.Provider>
  )
}

export const IndentationLevel = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return <IndentationContextProvider>{children}</IndentationContextProvider>
}

export const useIndentation = () => useContext(IndentationContext) ?? 0
