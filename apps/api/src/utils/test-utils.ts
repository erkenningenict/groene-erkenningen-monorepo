export async function getMockFile(fileName: string): Promise<string> {
  return await Bun.file(fileName).text()
}
