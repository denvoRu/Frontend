import { TableEntity } from "../types/tableEntity";

export const SUBJECTS:{name: string, raiting: number, subjects: TableEntity[]}[] = [
  {name: 'Модуль1',  raiting: 50,
  subjects: [{name: 'Предмет1', raiting: 50, id: '12'},
    {name: 'Предмет2', raiting: 40, id: '13'},
    {name: 'Предмет3', raiting: 30, id: '14'},
    {name: 'Предмет4', raiting: 20, id: '15'},
    {name: 'Предмет5', raiting: 10, id: '16'},]},
  {name: 'Модуль2',  raiting: 55,
  subjects: [
    {name: 'Предмет1', raiting: 50, id: '22'},
    {name: 'Предмет2', raiting: 40, id: '23'},
    {name: 'Предмет3', raiting: 30, id: '24'},
    {name: 'Предмет4', raiting: 20, id: '25'},
    {name: 'Предмет5', raiting: 10, id: '26'},
  ]}
]