export type stateIdType = number;
export interface StateModel {
    setName(name : string)
    getName() : string
    setAccepting(accepting : Boolean) : void
    isAccepting() : boolean
    getId() : stateIdType
}