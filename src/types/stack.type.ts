export enum StackType {
  front = 'front',
  back = 'back',
  tools = 'tools',
  full = 'front back'
}

export type Stack = {
  name: string;
  image: string;
  type: StackType;
  order: number;
  isNotCompitable?: boolean;
}