import JSZip from "jszip"
import { DOMParser } from "xmldom"
import fs from "fs"

const parseMathElement = (element) => {
  if (!element || element.nodeType !== 1) return ""

  let latex = ""

  switch (element.tagName) {
    case "m:f": {
      const num = element.getElementsByTagName("m:num")[0]
      const den = element.getElementsByTagName("m:den")[0]
      latex += `\\frac{${parseMathElement(num)}}{${parseMathElement(den)}}`
      break
    }
    case "m:sSup": {
      const base = element.getElementsByTagName("m:e")[0]
      const sup = element.getElementsByTagName("m:sup")[0]
      latex += `${parseMathElement(base)}^{${parseMathElement(sup)}}`
      break
    }
    case "m:sSub": {
      const base = element.getElementsByTagName("m:e")[0]
      const sub = element.getElementsByTagName("m:sub")[0]
      latex += `${parseMathElement(base)}_{${parseMathElement(sub)}}`
      break
    }
    case "m:rad": {
      const radicand = element.getElementsByTagName("m:e")[0]
      latex += `\\sqrt{${parseMathElement(radicand)}}`
      break
    }
    case "m:t": {
      latex += element.textContent || ""
      break
    }
    default: {
      for (let i = 0; i < element.childNodes.length; i++) {
        latex += parseMathElement(element.childNodes[i])
      }
    }
  }

  return latex
}

const extractContent = (element) => {
  let content = ""

  if (!element) return content

  // Process each child node
  for (let i = 0; i < element.childNodes.length; i++) {
    const child = element.childNodes[i]

    if (child.nodeType === 1) {
      // Process Math Objects
      if (child.tagName === "m:oMath") {
        content += parseMathElement(child)
      }
      // Process Regular Text
      else if (child.tagName === "w:t") {
        content += child.textContent
      }
      // Process Other Elements Recursively
      else {
        content += extractContent(child)
      }
    }
  }

  return content
}

export const extractQuestions = async (filePath) => {
  try {
    const buffer = fs.readFileSync(filePath)
    const zip = new JSZip()
    const content = await zip.loadAsync(buffer)
    const documentXml = await content.file("word/document.xml").async("text")
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(documentXml, "text/xml")

    const paragraphs = xmlDoc.getElementsByTagName("w:p")
    const lines = []

    for (let i = 0; i < paragraphs.length; i++) {
      const paragraph = paragraphs[i]
      const text = extractContent(paragraph).trim()

      if (text) {
        lines.push(text)
      }
    }

    console.log(lines)
    return lines
  } catch (error) {
    console.error("Error while extracting the text:", error)
    throw error
  }
}

extractQuestions("./public/temp/testdoc.docx")
