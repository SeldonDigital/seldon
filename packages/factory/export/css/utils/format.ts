import prettier from "prettier"

export async function format(content: string) {
  return await prettier.format(content, {
    parser: "css",
  })
}
