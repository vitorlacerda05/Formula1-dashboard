export interface Driver {
  id: string
  name: string
  team: string
  nationality: string
  number: number
  points: number
  wins: number
  position: number
}

export interface DriverStanding {
  position: number
  driver: string
  team: string
  points: number
  wins: number
}
