import { ListType } from "./list";
import { TableEntity } from "./tableEntity";

export type Modules = {content: Module[]} & ListType
export type ModulesWithSubjects = {content: ModuleWithSubjects[]} & ListType

export type Module = {name: string, rating: number, id: string}
export type ModuleWithSubjects = {name: string, rating: number, id: string, subjects: TableEntity[]}