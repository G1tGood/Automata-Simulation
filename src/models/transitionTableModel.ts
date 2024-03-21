export interface TransitionTable<StateIdentifierType, transitionLetterType, ToType> {
    // state identifiers managing
    addState(stateIdentifier : StateIdentifierType) : void
    removeState(stateIdentifier : StateIdentifierType) : void

    // transition managing
    removeTransition(stateIdentifier : StateIdentifierType, transitionLetter : transitionLetterType) : void
    addTransition(stateIdentifier : StateIdentifierType, transitionLetter : transitionLetterType, to : ToType) : void
    getTransition(stateIdentifier : StateIdentifierType, transitionLetter : transitionLetterType) : ToType
    hasTransition(stateIdentifier : StateIdentifierType, transitionLetter : transitionLetterType) : boolean

    // transition letters managing
    removeTransitionLetter(transitionLetter : transitionLetterType) : void
    changeTransitionLetter(oldTransitionLetter : transitionLetterType, newTransitionLetter : transitionLetterType) : void
    hasTransitionLetter(transitionLetter : transitionLetterType) : boolean;
}