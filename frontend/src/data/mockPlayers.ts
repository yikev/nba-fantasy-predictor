export type SeasonAverages = {
  points: number;
  reboundsTotal: number;
  assists: number;
  steals: number;
  blocks: number;
  turnovers: number;
  fieldGoalsAttempted: number;
  fieldGoalsMade: number;
  threePointersAttempted: number;
  threePointersMade: number;
  freeThrowsAttempted: number;
  freeThrowsMade: number;
  numMinutes: number;
};

export type Player = {
  id: string;
  fullName: string;
  team: string;
  position: string;
  seasonAverages: SeasonAverages;
  last5FantasyPoints: number[];
  predictedNextFantasyPoints: number;
};

export const MOCK_PLAYERS: Player[] = [
  {
    id: "shai-gilgeous-alexander",
    fullName: "Shai Gilgeous-Alexander",
    team: "OKC",
    position: "G",
    seasonAverages: {
      points: 30.2,
      reboundsTotal: 5.5,
      assists: 6.3,
      steals: 2.0,
      blocks: 0.9,
      turnovers: 2.4,
      fieldGoalsAttempted: 20.6,
      fieldGoalsMade: 11.1,
      threePointersAttempted: 4.8,
      threePointersMade: 1.7,
      freeThrowsAttempted: 9.2,
      freeThrowsMade: 8.1,
      numMinutes: 34.6,
    },
    last5FantasyPoints: [46.1, 54.3, 41.7, 58.9, 49.2],
    predictedNextFantasyPoints: 52.4,
  },
  {
    id: "nikola-jokic",
    fullName: "Nikola Jokic",
    team: "DEN",
    position: "C",
    seasonAverages: {
      points: 26.1,
      reboundsTotal: 12.3,
      assists: 9.1,
      steals: 1.3,
      blocks: 0.8,
      turnovers: 3.1,
      fieldGoalsAttempted: 18.1,
      fieldGoalsMade: 10.1,
      threePointersAttempted: 3.1,
      threePointersMade: 1.1,
      freeThrowsAttempted: 6.0,
      freeThrowsMade: 4.9,
      numMinutes: 34.0,
    },
    last5FantasyPoints: [62.0, 55.4, 71.2, 49.8, 66.5],
    predictedNextFantasyPoints: 63.7,
  },
  {
    id: "stephen-curry",
    fullName: "Stephen Curry",
    team: "GSW",
    position: "G",
    seasonAverages: {
      points: 26.8,
      reboundsTotal: 4.4,
      assists: 5.1,
      steals: 1.0,
      blocks: 0.4,
      turnovers: 2.8,
      fieldGoalsAttempted: 19.1,
      fieldGoalsMade: 8.8,
      threePointersAttempted: 11.3,
      threePointersMade: 4.6,
      freeThrowsAttempted: 5.2,
      freeThrowsMade: 4.7,
      numMinutes: 33.2,
    },
    last5FantasyPoints: [38.2, 44.9, 57.1, 33.5, 49.0],
    predictedNextFantasyPoints: 45.3,
  },
];