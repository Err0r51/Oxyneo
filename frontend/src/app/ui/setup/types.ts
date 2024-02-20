export interface StepComponentProps {
    onNext: (data: object) => void;
    onBack: () => void;
  }

export interface IStock {
    name: string
    symbol: string
    description: string
}

export interface IStockDictionary {
    [id: string]: IStock
}