import { useEffect, useState } from "react"

export function useObjectURL(file: File | null): string | null {
  const [objectURL, setObjectURL] = useState<string | null>(null)

  useEffect(() => {
    if (!file) {
      setObjectURL(null)
      return
    }

    const url = URL.createObjectURL(file)
    setObjectURL(url)

    // Free memory whenever this component is unmounted or file changes
    return () => {
      URL.revokeObjectURL(url)
    }
  }, [file])

  return objectURL
}
