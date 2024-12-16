export type WordRegionType = 'correct' | 'incorrect' | 'untyped' | 'extra'

export interface Word {
  /** Whether this word was typed and submitted correctly */
  correct: boolean
  /** Regions within the current word */
  regions: WordRegion[]
  /** Index of the first character of the word, based on text displayed to user */
  start: number
  /** Distance to word currently being typed. Positive if before, 0 if current, and negative if after. */
  distanceToCurrent: number
}

export interface WordRegion {
  /** Type for this region */
  type: WordRegionType
  /** Text within the region */
  text: string
}