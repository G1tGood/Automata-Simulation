import { stateIdType, StateModel } from './../src/models/state-model/state-model';
import { DFAmodel } from '../src/models/dfa-model/dfa-model';
import { TransitionTable } from "../src/models/transitionTableModel";

export * from './components';

export class StateModelImp implements StateModel {
    static currentId = 0;
    private id: stateIdType;
    private name: string;
    private accepting: boolean;
    public onChange : Function;

    constructor (name: string, accepting: boolean) {
        this.id = StateModelImp.currentId;
        this.name = name;
        this.accepting = accepting;
        StateModelImp.currentId += 1;
    }

    inform() {
        this.onChange();
    }

    setName(name: string) : void{
        this.name = name;

        this.inform();
    }
    getName() : string {
        return this.name;
    }
    setAccepting(accepting: boolean) : void {
        this.accepting = accepting;

        this.inform();
    }
    isAccepting() : boolean {
        return this.accepting;
    }
    getId() : stateIdType{
        return this.id;
    }
}

export class TransitionTableDFAImp<StateIdentifierType, transitionLetterType> implements TransitionTable<StateIdentifierType, transitionLetterType, StateIdentifierType> {
    private transitions : Map<StateIdentifierType, Map<transitionLetterType, StateIdentifierType>>;

    constructor(){
        this.transitions = new Map();
    }

    hasTransitionLetter(transitionLetter: transitionLetterType): boolean {
        for (let stateId of this.transitions.keys()) {
            if (this.transitions.get(stateId).has(transitionLetter)) {
                return true;
            }
        }
        return false;
    }

    changeTransitionLetter(oldTransitionLetter : transitionLetterType, newTransitionLetter : transitionLetterType): void {
        if (oldTransitionLetter == newTransitionLetter)
            return;
        if (this.hasTransitionLetter(newTransitionLetter)) {
            throw new Error("can't change transition letter: new transition letter " + newTransitionLetter + " already has subscribed transitions!");
        }

        let toState : StateIdentifierType;
        for (let stateId of this.transitions.keys()) {
            if (this.transitions.get(stateId).has(oldTransitionLetter)) {
                toState = this.transitions.get(stateId).get(oldTransitionLetter);
                this.transitions.get(stateId).delete(oldTransitionLetter);
                this.transitions.get(stateId).set(newTransitionLetter, toState);
            }
        }
    }

    addState(stateIdentifier: StateIdentifierType): void {
        if (this.transitions.has(stateIdentifier))
            throw new Error("state " + stateIdentifier + " already exists");
        this.transitions.set(stateIdentifier, new Map());
    }

    removeState(stateIdentifier: StateIdentifierType): void {
        if (!this.transitions.has(stateIdentifier))
            throw new Error("state " + stateIdentifier + " does not exists");
        this.transitions.delete(stateIdentifier);
        for (let key of this.transitions.keys()) {
            for (let transition_letter of this.transitions.get(key).keys()) {
                if (this.transitions.get(key).get(transition_letter) === stateIdentifier)
                    this.transitions.get(key).delete(transition_letter);
            }
        }
    }

    removeTransition(stateIdentifier: StateIdentifierType, transitionLetter: transitionLetterType): void {
        if (!this.transitions.has(stateIdentifier))
            throw new Error("state " + stateIdentifier + " does not exists");
        if (!this.transitions.get(stateIdentifier).has(transitionLetter))
            throw new Error("no transition with letter " + transitionLetter + " from the state " + stateIdentifier);

        this.transitions.get(stateIdentifier).delete(transitionLetter);
    }

    addTransition(stateIdentifier: StateIdentifierType, transitionLetter: transitionLetterType, to: StateIdentifierType): void {
        if (!this.transitions.has(stateIdentifier))
            throw new Error("state " + stateIdentifier + " does not exists");
        if (this.transitions.get(stateIdentifier).has(transitionLetter))
            throw new Error("transition with letter " + transitionLetter + " from the state " + stateIdentifier + "already exists");
        
        this.transitions.get(stateIdentifier).set(transitionLetter, to);
    }

    removeTransitionLetter(transitionLetter : transitionLetterType) {
        for (let stateIdentifier of this.transitions.keys()) {
            if (this.transitions.get(stateIdentifier).has(transitionLetter))
                this.transitions.get(stateIdentifier).delete(transitionLetter);
        }
    }

    getTransition(stateIdentifier : StateIdentifierType, transitionLetter : transitionLetterType) {
        if (!this.transitions.has(stateIdentifier))
            throw new Error("state " + stateIdentifier + " does not exists");
        if (!this.transitions.get(stateIdentifier).has(transitionLetter))
            throw new Error("no transition with letter " + transitionLetter + " from the state " + stateIdentifier);

        return this.transitions.get(stateIdentifier).get(transitionLetter);
    }

    hasTransition(stateIdentifier : StateIdentifierType, transitionLetter : transitionLetterType) {
        if (!this.transitions.has(stateIdentifier))
            return false;
        if (!this.transitions.get(stateIdentifier).has(transitionLetter))
            return false;
        return true;
    }
}

export class DFAmodellImp implements DFAmodel {
    protected transitionTable : TransitionTableDFAImp<stateIdType, string>;
    protected states : Map<stateIdType, StateModel>;
    protected startState : stateIdType | null;
    protected alphaBet : Set<string>;
    public onChange: Function;

    constructor () {
        this.transitionTable = new TransitionTableDFAImp<stateIdType, string>();
        this.states = new Map();
        this.startState = null;
        this.alphaBet = new Set();
    }

    setAccepting(stateId: number, accepting : boolean): void {
        this.getState(stateId).setAccepting(accepting);
        console.log("set accepting");
        this.inform();
    }

    changeLetter(oldLetter: string, newLetter: string): void {
        if (oldLetter === newLetter)
            return;
        if (!this.alphaBet.has(oldLetter))
            throw new Error("cannot change: no such letter '" + oldLetter + "' in the alphaBet");
        if (this.alphaBet.has(newLetter))
            throw new Error("cannot change: new letter '" + newLetter + "' already in the alphaBet");

        this.alphaBet.delete(oldLetter);
        this.alphaBet.add(newLetter);
        this.transitionTable.changeTransitionLetter(oldLetter, newLetter);
    }

    getState(stateId: number): StateModel {
        if (!this.states.has(stateId))
            throw new Error("the DFA has not state with identifier " + stateId);

        return this.states.get(stateId);
    }

    hasLetter(trans_letter : string): boolean {
        return this.alphaBet.has(trans_letter);
    }

    getAlphaBet(): Set<string> {
        return this.alphaBet;
    }

    getStartState(): number {
        return this.startState;
    }

    hasTransition(stateId: stateIdType, trans_letter: string): boolean {
        return this.transitionTable.hasTransition(stateId, trans_letter);
    }

    getTransition(stateId: stateIdType, trans_letter: string): stateIdType {
        return this.transitionTable.getTransition(stateId, trans_letter);
    }

    addState(name : string, accepting : boolean): void {
        if (Array.from(this.states.values()).find(function (state) {
            return state.getName() == name;
        }) != undefined)
            throw new Error("can't have the same name on two different states");
        let newState = new StateModelImp(name, accepting);
        this.states.set(newState.getId(), newState);
        this.transitionTable.addState(newState.getId());

        this.inform();
    }

    hasState(stateId : stateIdType) {
        return this.states.has(stateId);
    }

    removeState(stateId: stateIdType): void {
        if (!this.states.has(stateId))
            throw new Error("No such state with id " + stateId);
        this.states.delete(stateId);
        this.transitionTable.removeState(stateId);

        this.inform();
    }

    addTransition(stateId: stateIdType, trans_letter: string, toStateId: stateIdType): void {
        if (!this.alphaBet.has(trans_letter))
            throw new Error("No Such Letter " + trans_letter + " in the AlphaBet");
        if (!this.states.has(stateId))
            throw new Error("No such state as " + stateId);
        
        this.transitionTable.addTransition(stateId, trans_letter, toStateId);

        this.inform();
    }

    removeTransition(stateId: stateIdType, trans_letter: string): void {
        if (!this.alphaBet.has(trans_letter))
            throw new Error("No Such Letter " + trans_letter + " in the AlphaBet");
        if (!this.states.has(stateId))
            throw new Error("No such state as " + stateId);
        this.transitionTable.removeTransition(stateId, trans_letter);

        this.inform();
    }

    setStartState(stateId: stateIdType): void {
        this.startState = stateId;

        this.inform();
    }

    addAlphaBetLetter(transLetter: string): void {
        if (transLetter.length != 1)
            throw new Error("transition letters can't have more or less than one letter");
        if (this.alphaBet.has(transLetter))
            throw new Error("letter '".concat(transLetter, "' already in the alphaBet"));
        this.alphaBet.add(transLetter);

        this.inform();
    }

    removeAlphaBetLetter(transLetter: string): void {
        if (!this.alphaBet.has(transLetter))
            throw new Error("letter '" + transLetter + "' is already in the alphaBet");
        this.alphaBet.delete(transLetter);
        this.transitionTable.removeTransitionLetter(transLetter);

        this.inform();
    }

    isRunable(): boolean {
        if (this.startState == null)
            return false;
        for (let stateId of this.states.keys()) {
            for (let transitionLetter of this.alphaBet) {
                if (!this.transitionTable.hasTransition(stateId, transitionLetter))
                    return false;
            }
        }
        return true;
    }

    iterateRunningStates (word: string): () => Generator<stateIdType> {
        if (!this.isRunable())
            throw new Error("the DFA cannot be run, the transition table is not complete OR there is no starting state");
        let current_state : stateIdType = this.startState;
        const transitionTable = this.transitionTable;
        const alphaBet = this.alphaBet;
        return function* () {
            yield current_state;
            for (let i = 0; i < word.length; i++) {
                if (!alphaBet.has(word[i]))
                    throw new Error("letter '" + word[i] + "' of the given word '" + word + "' is not in the alphaBet");
                current_state = transitionTable.getTransition(current_state, word[i]);
                yield current_state;
            }
        }
    }

    run (word : string) : boolean {
        let runGenerator = this.iterateRunningStates(word);
        let stateId : stateIdType;
        for (stateId of runGenerator()) {}
        return this.states.get(stateId).isAccepting();
    }

    getStates() {
        return Array.from(this.states.keys());
    }

    inform() {
        this.onChange();
    }
}