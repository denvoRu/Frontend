import { TableEntity } from "../types/tableEntity";

export const SUBJECTS:{name: string, rating: number, subjects: TableEntity[]}[] = [
  {name: 'Модуль1',  rating: 50,
  subjects: [{name: 'Предмет1', rating: 50, id: '12'},
    {name: 'Предмет2', rating: 40, id: '13'},
    {name: 'Предмет3', rating: 30, id: '14'},
    {name: 'Предмет4', rating: 20, id: '15'},
    {name: 'Предмет5', rating: 10, id: '16'},]},
  {name: 'Модуль2',  rating: 55,
  subjects: [
    {name: 'Предмет1', rating: 50, id: '22'},
    {name: 'Предмет2', rating: 40, id: '23'},
    {name: 'Предмет3', rating: 30, id: '24'},
    {name: 'Предмет4', rating: 20, id: '25'},
    {name: 'Предмет5', rating: 10, id: '26'},
  ]}
]