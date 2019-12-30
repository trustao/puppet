import fs from 'fs'
import path from 'path'

export const readFile = (filePath) => {
  try {
    return fs.readFileSync(path.resolve(__static, filePath), {encoding: 'utf8'})
  } catch (e) {
    console.error(e)
  }
}

export const getPath = (path) => {
  return path.resolve(__static, path)
}