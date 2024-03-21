import { stateIdType, StateModel } from '../state-model/state-model'

export interface DFAmodel {
    // states managing
    addState(name : string, accepting : boolean) : void
    removeState(stateId : stateIdType) : void
    hasState(stateId : stateIdType) : boolean
    getState(stateId : stateIdType) : StateModel
    getStartState() : stateIdType | null
    setStartState(stateId : stateIdType) : void
    getStates() : Array<stateIdType>;
    setAccepting(stateId : stateIdType, accepting : boolean) : void

    // transitions managing
    addTransition(stateId : stateIdType, trans_letter : string, toStateId : stateIdType) : void
    removeTransition(stateId : stateIdType, trans_letter : string) : void
    hasTransition(stateId : stateIdType, trans_letter : string) : boolean
    getTransition(stateId : stateIdType, trans_letter : string) : stateIdType

    // alphaBet managing
    addAlphaBetLetter(trans_letter : string) : void
    removeAlphaBetLetter(trans_letter : string) : void
    hasLetter(trans_letter : string) : boolean
    changeLetter(oldLetter : string, newLetter : string) : void
    getAlphaBet() : Set<string>

    // runing the automata
    isRunable() : boolean
    iterateRunningStates(word : string) : () => Generator<stateIdType> // an iterator instance of function that runs of the automata
}