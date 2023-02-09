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

// TODO: Change stack schema to be just the name of the stack and the order -The Front End will handle the image and type and isNotCompitable issues-
// TODO: Make enums of the available stack names
