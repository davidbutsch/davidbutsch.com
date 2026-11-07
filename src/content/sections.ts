import type { SectionId } from "./types"

/** Display order of the sections. Contents come from the markdown dirs. */
export const sectionMeta = [
  { id: "experience", label: "Experience", path: "experience" },
  { id: "education", label: "Education", path: "education" },
  { id: "projects", label: "Projects", path: "projects" },
] as const satisfies readonly {
  id: SectionId
  label: string
  path: string
}[]
