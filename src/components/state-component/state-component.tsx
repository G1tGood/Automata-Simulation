import { Component, h, Host, State, Prop, EventEmitter, Event as StencilEvent, Listen, Element} from '@stencil/core';
import { stateIdType, StateModel } from '../../models/state-model/state-model';
import $ from 'jquery';


@Component({
  tag: 'state-component',
  styleUrl: 'state-component.css',
  shadow: true,
})
export class StateNode {
  @Prop() model : StateModel;
  @State() editName : string;
  @State() editing : boolean;
  @Element() thiscomp;
  @StencilEvent() destroy : EventEmitter<stateIdType>;
  @StencilEvent() selectState : EventEmitter<[stateIdType, boolean]>;
  @StencilEvent() nameChange : EventEmitter<[stateIdType, string, string]>;
  @StencilEvent() update: EventEmitter<void>
  

  componentWillLoad() {
    this.editing = false;
    this.editName = "";
  }

  @Listen('dblclick')
  handleEdit() {
    this.editName = this.model.getName();
    this.editing = true;
  }

  handleChange(event) {
    if (this.editing) {
      this.editName = event.target.value;
    }
  }

  handleSubmit() {
    const newName : string = this.editName.trim();
    const oldName = this.model.getName();
    if (newName && this.editing) {
      this.editing = false;
      this.model.setName(newName);
      console.log('submitted! ' + newName);
      console.log("old name: " + oldName + " new name: " + newName);
      this.nameChange.emit([this.model.getId(), oldName, newName]);
    }
  }

  handleDestroy() {
    this.destroy.emit(this.model.getId());
  }

  @Listen('click')
  handleSelect(ev : MouseEvent) {
    this.selectState.emit([this.model.getId(), ev.ctrlKey]);
  }

  render() {
    return (
      <Host>
        <div class="text-circle">
          {
          this.model.isAccepting()? 
          <div class="ring stack"></div>
          : 
          null
          }
          {this.editing? 
          <input
          class="stack name" 
          type="text" 
          onInput={e => this.handleChange(e)} 
          onBlur={_ => this.handleSubmit()} 
          value={this.editName} 
          />
          :
          <span class="stack name">{this.model.getName()}</span>
          }
        </div>
      </Host>
    );
  }
  componentDidRender() {
    // make the font size fit in the outer circle
    let name : JQuery<HTMLElement>, textCircle : JQuery<HTMLElement>;
    if (this.thiscomp.shadowRoot !== null) {
      name = $((this.thiscomp).shadowRoot).find('.name');
      textCircle = $((this.thiscomp).shadowRoot).find('.text-circle');
    }
    else {
      name = $(this.thiscomp).find('.name');
      textCircle = $(this.thiscomp).find('.text-circle');
    }

    let currentShowTextLength = (this.editing ? this.editName : this.model.getName()).length;
    let circleWidth = parseFloat(textCircle.css('width'));
    let defaultFontSize = parseFloat(textCircle.css('fontSize'));
    let newFontSize = ((currentShowTextLength * defaultFontSize) > circleWidth)? (circleWidth / currentShowTextLength) : defaultFontSize;
    $(name).css('font-size', newFontSize + 'px');

    if (this.editing) name[0].focus();
    
    this.update.emit();
  }
}
