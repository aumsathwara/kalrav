import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function translateClassNameToGujarati(name: string): string {
  const numMap: Record<string, string> = {
    "0": "૦", "1": "૧", "2": "૨", "3": "૩", "4": "૪",
    "5": "૫", "6": "૬", "7": "૭", "8": "૮", "9": "૯"
  }
  
  const lowercaseName = name.toLowerCase()
  let translated = name
  
  if (lowercaseName.startsWith("std ") || lowercaseName.startsWith("std. ")) {
    translated = name.replace(/std\.?\s+/i, "ધોરણ ")
  } else if (lowercaseName.startsWith("class ")) {
    translated = name.replace(/class\s+/i, "ધોરણ ")
  } else if (lowercaseName.startsWith("standard ")) {
    translated = name.replace(/standard\s+/i, "ધોરણ ")
  } else {
    // If it's a raw number or standard name without prefix, prepend "ધોરણ " if it contains digits
    if (/\d/.test(name)) {
      translated = "ધોરણ " + name
    }
  }
  
  // Translate numbers to Gujarati digits
  return translated
    .split("")
    .map(char => numMap[char] || char)
    .join("")
}

export function sortClassesNaturally<T extends { name: string }>(classesList: T[]): T[] {
  return [...classesList].sort((a, b) => {
    const matchA = a.name.match(/\d+/)
    const matchB = b.name.match(/\d+/)
    
    if (matchA && matchB) {
      const numA = parseInt(matchA[0], 10)
      const numB = parseInt(matchB[0], 10)
      if (numA !== numB) {
        return numA - numB
      }
    }
    
    return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' })
  })
}
