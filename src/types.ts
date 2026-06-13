export interface DrawResult {
  issueNumber: string;
  number: number;
  size: "BIG" | "SMALL";
  color: "RED" | "GREEN" | "VIOLET";
}

export type PredictResultType = "SIZE" | "COLOR";

export interface PredictionPayload {
  period: string;
  type: PredictResultType;
  val: "BIG" | "SMALL" | "RED" | "GREEN" | "VIOLET";
  confidence: number;
  modelCode: string;
  hint: string;
}

export interface ModelAccuracy {
  code: string;
  name: string;
  wins: number;
  total: number;
  rate: number;
}

export interface HistoryItem {
  id: string;
  period: string;
  level: string;
  prediction: string;
  predictionType: PredictResultType;
  result: string;
  isWin: boolean;
  timestamp: number;
}
