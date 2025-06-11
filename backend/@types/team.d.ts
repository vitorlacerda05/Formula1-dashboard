export interface Team {
  id: string
  name: string
  nationality: string
  points: number
  drivers: string[]
  position: number
}

export interface TeamStanding {
  position: number
  team: string
  points: number
  nationality: string
}
