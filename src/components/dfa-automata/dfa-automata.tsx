import { Component, Host, h, Prop, State, getAssetPath } from '@stencil/core';
import { DFAmodel } from '../../models/dfa-model/dfa-model';
import { StateModel, stateIdType } from '../../models/state-model/state-model';
import { DFAmodellImp, StateModelImp } from '../../index';
import { LeaderLine } from '../../leader-line';
import 'bootstrap';
import $ from 'jquery';
import { relative } from 'path';

function funcOnError(fn : Function) {
  return function(_target: any, _propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = function(...args: any[]) {
      try {
        return originalMethod.apply(this, args);
      }
      catch (error) {
        fn(error);
      }
    };

    return descriptor;
  };
}

@Component({
  tag: 'dfa-automata',
  styleUrl: 'dfa-automata.css',
  assetsDirs: ['src/assets/dfa-automata-assets/'],
  shadow: false,
})
export class DfaAutomata {
  @Prop() model : DFAmodel;
  @State() selectedAState : boolean;
  @State() isRunning : boolean;
  @State() selectedStateId : stateIdType;
  @State() isEdittingLetter : boolean;
  @State() addingLetter : boolean;
  edittedLetter : string; // the letter now eddited
  transitionArrows : Array<any> = [];

  updateArrows() {
    this.transitionArrows.forEach(leaderLine => {
      leaderLine.position();
    });
  }

  handleSelect(stateId : stateIdType, makeTransition : boolean) {
    if (makeTransition && this.selectedAState) {
      let letter : string = this.askForTransitionLetter();
      this.model.addTransition(this.selectedStateId, letter, stateId);
    }
    else if (!makeTransition) {
      this.disselectAll();
      this.selectedStateId = stateId;
      this.selectedAState = true;
    }
  }

  handleNameChange(stateId : stateIdType, oldName : string, newName : string) {
    for (let currentStateId of this.model.getStates()) {
      if (this.model.getState(currentStateId).getName() === newName && stateId != currentStateId) {
        this.model.getState(stateId).setName(oldName);
        throw new Error("cant change name of state " + oldName + " to " + newName +": state with name " + newName + " already exists");
      }
    }
  }

  askForTransitionLetter() {
    let newTransitionLetter = window.prompt("please enter the transition letter");
    if (newTransitionLetter != null)
      newTransitionLetter = newTransitionLetter.trim();
    return newTransitionLetter;
  }

  destroy(stateId : stateIdType) : void {
    this.selectedAState = false;
    this.model.removeState(stateId);
  }

  async run(word : string) {
    if (!this.model.isRunable())
      throw new Error("cannot run");

    for (let letter of word) {
      if (!this.model.hasLetter(letter))
        throw new Error("letter '" + letter + "' in '" + word + "' is not in the alphaBet");
    }

    this.isRunning = true;
    const runGenerator = this.model.iterateRunningStates(word)();
    let currentStateId : stateIdType;
    for (currentStateId of runGenerator) {
      this.selectedStateId = currentStateId;
      this.selectedAState = true;
      console.log('at state '+ currentStateId + " now");
      await this.stepButtonPress();
    }
    this.notify("word '" + word + "' " + (this.model.getState(currentStateId).isAccepting()? "accepted!" : "not accepted"));
    this.selectedAState = false;
    this.isRunning = false;
  }  

  stepButtonPress() : Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const button = $('#step-button')[0];
      if (button) {
        const buttonClickListener = () => {
          button.removeEventListener('click', buttonClickListener);
          resolve();
        };
        button.addEventListener('click', buttonClickListener);
      } else {
        reject(new Error('Button not found'));
      }
    });
  }

  addLetter(letter : string) : void {
    if (letter.length === 1) {
      this.model.addAlphaBetLetter(letter);
      this.addingLetter = false;
    }
    else {
      throw new Error("letter must be 1 character");
    }
  }

  addState(name : string, accepting : boolean) : void {
    if (name === "") throw new Error("name must not be empty");
    this.model.addState(name, accepting);
  }

  reset() : void {
    this.model = new DFAmodellImp();
    this.selectedAState = false;
    this.isRunning = false;
    this.addingLetter = false;
    this.isEdittingLetter = false;
  }

  notify(alert : string) : void {
    console.log(alert);
  }

  disselectAll() : void {
    if (this.selectedAState)
      $('#state' + this.selectedStateId).removeClass("selected-state");
    this.selectedAState = false;
  }

  submitLetterChange(letter: string) : void {
    if (letter.length == 1) {
      this.model.changeLetter(this.edittedLetter, letter);
    }
    else {
      throw new Error("letter must be of length 1");
    }
    this.isEdittingLetter = false;
  }

  editLetter(letter: string) : void {
    this.edittedLetter = letter;
    this.isEdittingLetter = true;
  }

  removeLetter(letter : string) : void {
    this.model.removeAlphaBetLetter(letter);
  }

  setStartState() {
    if (!this.selectedAState)
      throw new Error("no state selected");
    this.model.setStartState(this.selectedStateId);
  }

  toggleAccepting() {
    if (!this.selectedAState)
      throw new Error("no state selected");
    const state = this.model.getState(this.selectedStateId);
    this.model.setAccepting(this.selectedStateId, !state.isAccepting());
  }

  componentDidRender() {
    this.transitionArrows.forEach(leaderLine => {
      leaderLine.remove();
    });
    this.transitionArrows = [];
    for (let stateId of this.model.getStates()) {
      for (let letter of this.model.getAlphaBet()) {
        if (this.model.hasTransition(stateId, letter)) {
          this.transitionArrows.push(new LeaderLine(
            ($('#state'+stateId)[0]),
            $('#state'+this.model.getTransition(stateId, letter))[0],
            {middleLabel: letter, path:'arc', color:'black', shape:'circle'}
          ));
        }
      }
    }
    if ($("#new-letter-input")[0])
      $("#new-letter-input")[0].focus();
    if ($("#change-letter-input")[0])
      $("#change-letter-input")[0].focus();

    if ($("#step-button")[0] != undefined) {
      if (!this.isRunning)
        ($("#step-button")[0] as HTMLButtonElement).disabled = true;
      else
        ($("#step-button")[0] as HTMLButtonElement).disabled = false;
    }

    let stateModelImp : StateModelImp;
    for (let stateId of this.model.getStates()) {
      stateModelImp = this.model.getState(stateId) as StateModelImp;
      stateModelImp.onChange = function() {
        const stateElem : any = $("#state"+this.getId())[0];
        if (stateElem) {
          stateElem.model = null;
          stateElem.model = this;
        }
      }
    }
  }

  
  render() {
    let header = <h class="gradient-title">Hello, and Welcome, to Yoav's automata simulation!</h>;


    let statesComponenets = this.model.getStates().map(function (state : stateIdType) {
      let stateComp : HTMLElement =
      <draggable-wrapper contained={true}>
        <state-component
        id={"state"+state}
        class={(this.selectedAState && this.selectedStateId == state)? "selected-state" : ""}
        model={this.model.getState(state)}
        onSelectState={ev => this.handleSelect(...ev.detail)}
        onDestroy={ev => this.destroy(ev.detail)}
        onMouseMove={()=>this.updateArrows()}
        onUpdate={()=>this.model.inform()}
        onNameChange={(ev)=>{this.handleNameChange(...ev.detail)}}
        />
      </draggable-wrapper>;

      
      return stateComp;
    }, this);


    let alphaBet =
    <table 
    id="alphaBet-table"
    class="table table-hover table-bordered"
    >
      <col style={{width:"25%", height:"100%"}} />
      <col style={{width:"75%", height:"100%"}} />
      <col style={{width:"25%", height:"100%"}} />
      <thead w-25>
      <tr>
        <th></th>
        <th>alphaBet</th>
        <th></th>
      </tr>
      </thead>
      <tbody>
        {
          Array.from(this.model.getAlphaBet()).map(function(letter) {
            let res =
            <tr class="reveal-container">
              <td>
                <div style={{'width': '30%', 'height': '30%', 'overflow': 'hidden', 'margin': 'auto'}}>
                    <input
                    class="hover-reveal"
                    style={{'width':'100%', 'height':'100%','object-fit': 'contain'}}
                    type='image'
                    alt='remove transition letter'
                    src={getAssetPath('assets/dfa-automata-assets/images/remove-icon.png')}
                    onClick={() => this.removeLetter(letter)}/>
                </div>
              </td>
              <td>
              {
              (this.isEdittingLetter && this.edittedLetter == letter)? 
              <input 
              id="change-letter-input"
              type="text" 
              maxlength="1"
              value={this.edittedLetter} 
              onKeyDown={(ev : KeyboardEvent)=>{
                if (ev.code === "Enter") this.submitLetterChange((ev.target as HTMLInputElement).value);
                if (ev.code === "Escape") this.isEdittingLetter = false;
              }}
              onBlur={()=>{this.isEdittingLetter = false;}}
              /> 
              : 
              <h>{letter}</h>
              }
              </td>
              
              {
               (!this.isEdittingLetter || this.edittedLetter !== letter)? 
                <td>
                  <div style={{'width': '30%', 'height': '30%', 'overflow': 'hidden', 'text-align': 'center'}}>
                    <input
                    class="hover-reveal"
                    style={{'width':'100%', 'height':'100%','object-fit': 'contain'}}
                    type='image'
                    alt='edit transition letter'
                    src={getAssetPath('assets/dfa-automata-assets/images/edit-icon.png')}
                    onClick={() => this.editLetter(letter)}/>
                  </div>
                </td>
                :
                null
              }
            </tr>;
            return res;
          }, this)
        }
      <tr>
        <td></td>
        <td class="bg-success" onClick={() => { {this.addingLetter = true;} }} style={{ 'cursor':'pointer'}}>
          {
          this.addingLetter ?
          <input 
          class="transparent-input"
          id="new-letter-input"
          type="text" 
          maxlength="1"  
          onKeyDown={(ev : KeyboardEvent)=>{
            if (ev.code === "Enter") this.addLetter((ev.target as HTMLInputElement).value);
            if (ev.code === "Escape") this.addingLetter = false;
          }}
          onBlur={()=>{this.addingLetter = false;}}/> 
          :
          "+"
          }
        </td>
        <td></td>
      </tr>
    </tbody>
    </table>;

    let a : Set<number> = new Set();
    let transitionTableElement =
    this.model.getStates().length === 0 || this.model.getAlphaBet().size === 0?
    null
    :
    <table id="transitions-table" class="my-table table table-bordered">
      <thead>
        <tr>
          <th></th>
          {
          Array.from(this.model.getAlphaBet()).map(function (letter : string) {
            return <th scope='col'>
            { letter }
            </th>
          }, this)
          }
        </tr>
      </thead>
      <tbody>
        {
         this.model.getStates().map(function (stateId : stateIdType) {
          return <tr>
            <th>{ this.model.getState(stateId).getName() }</th>
            {
               Array.from(this.model.getAlphaBet()).map(function (letter : string){
                return <td>
                { 
                  (this.model.hasTransition(stateId, letter)) ?
                  this.model.getState(this.model.getTransition(stateId, letter)).getName()
                  :
                  ""
                }
                </td>
              }, this)
            }
          </tr>
        }, this)
        }
      </tbody>
    </table>;

    
    let newStateElement = 
    <div class="input-group mb-3">
      <input id="new-state-input" type="text" class="form-control" placeholder="new state name" aria-label="new state name" aria-describedby="basic-addon2"/>
      <div class="input-group-append">
        <button class="btn btn-outline-secondary" type="button" id ="new-state-button" onClick={() => {
          const newStateInput : HTMLInputElement = ($('#new-state-input')[0] as HTMLInputElement);
          this.addState(newStateInput.value, false);
          newStateInput.value = "";
        }}>+</button>
      </div>
    </div>;

    let resetButton = <button type='button' id="reset-button" class="btn btn-danger" value="RESET" onClick={()=>this.reset()}/>;

    let runElement = 
    <div class="input-group mb-3">
      <input id="run-input" type="text" style={{'width':'10px'}} class="form-control" placeholder="word" aria-label="word" aria-describedby="basic-addon2"/>
      <div class="input-group-append">
        <button class="btn btn-outline-secondary" id="run-button" type="button" onClick={
          () => {
            const runInput : HTMLInputElement = ($('#run-input')[0] as HTMLInputElement);
            this.run(runInput.value);
            runInput.value = "";
            }}>run</button>
      </div>
    </div>;

  let setStartStateElement =
      <button class="btn-primary btn-success" id="set-start-state-button" type="button" onClick={
        () => this.setStartState()
          }>set start state</button>;

    let setAcceptingElement =
      <button class="btn-primary btn-success" id="set-accepting-button" type="button" onClick={
        () => {
          this.toggleAccepting();
          }}>set accepting state</button>;
  
  
    let runStepButton : HTMLButtonElement = 
    <div>
    <button type='button' id="step-button" class="btn btn-primary btn-success">
      step
    </button>
    </div>

    let footer = newStateElement + resetButton + runElement + runStepButton;
    
    return (
      <Host>
        <div id="overlay" class={this.isRunning? "" : ""}>
          {header}
          <div id="states-container" class="my-container">
            {statesComponenets}
          </div>
          {newStateElement}
          {transitionTableElement}
          {alphaBet}
          {runElement}
          {setStartStateElement}
          {setAcceptingElement}
        </div>
        {runStepButton}
      </Host>
    );
  }
}
