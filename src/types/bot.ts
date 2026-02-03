

export type BotButton = {
  label: string;
  goTo?: string;
  url?: string;
};

export type BotNode = {
  id: string;
  text?: string;
  buttons?: BotButton[];
  url?: string;
  image?: string;
};


export type VacancyLike = {
  id: string;
  title: string;
  url?: string;
}
