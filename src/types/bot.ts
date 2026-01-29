

export type BotButton = {
  label: string;
  goTo: string;
};

export type BotNode = {
  id: string;
  text?: string;
  buttons?: BotButton[];
};
