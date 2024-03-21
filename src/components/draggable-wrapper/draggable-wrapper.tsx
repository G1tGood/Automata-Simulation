// used & inspired by code in https://www.w3schools.com/howto/howto_js_draggable.asp. Thanks w3schools :P

import { Component, Host, h, Element, Prop } from '@stencil/core';
import 'bootstrap/dist/css/bootstrap.min.css';

@Component({
  tag: 'draggable-wrapper',
  styleUrl: 'draggable-wrapper.css',
  shadow: false,
})
export class DraggableWrapper {
  @Element() thisElement!: HTMLElement;
  @Prop() contained = false;

  componentDidLoad() {
    DraggableWrapper.makeDraggable(this.thisElement, this.contained ? this.thisElement.parentElement : null);
  }
  
  // this function was inspired by w3schools
  static makeDraggable(elmnt : HTMLElement, container : HTMLElement = null) {
    let offsetX : number = 0, offsetY : number = 0, posX : number = 0, posY : number = 0;
    elmnt.onmousedown = dragMouseDown;
  
    function dragMouseDown(e : MouseEvent) {
      // get the mouse cursor position at startup:
      posX = e.clientX;
      posY = e.clientY;
      document.onmouseup = closeDragElement;
      // call a function whenever the cursor moves:
      document.onmousemove = elementDrag;
    }
  
    function elementDrag(e : MouseEvent) {
      // calculate the new cursor position:
      let maxX : number, maxY : number, minX : number, minY : number;
      if (container === null) {
        maxX = Infinity;
        minX = -Infinity;
        maxY = Infinity;
        minY = -Infinity;
      }
      else {
        const containerBoundingRect = container.getBoundingClientRect();
        let containerStyle = window.getComputedStyle(container);
        if (containerStyle.position === 'static') {
          maxX = containerBoundingRect.right + window.scrollX - elmnt.offsetWidth;
          minX = containerBoundingRect.left + window.scrollX;
          maxY = containerBoundingRect.bottom + window.scrollY - elmnt.offsetHeight;
          minY = containerBoundingRect.top + window.scrollY;
        }
        else {
          maxX = containerBoundingRect.right - containerBoundingRect.left - elmnt.offsetWidth;
          minX = 0;
          maxY = containerBoundingRect.bottom - containerBoundingRect.top - elmnt.offsetHeight;
          minY = 0;
        }
      }
      // distance the mouse moved from last event
      offsetX = posX - e.clientX;
      offsetY = posY - e.clientY;
      // new position of the mouse relative to the view port
      posX = e.clientX;
      posY = e.clientY;
      // set the element's new position:
      // move the position of the element in relation to the parent element the offset the mouse moved
      elmnt.style.top = Math.min(maxY, Math.max(minY, elmnt.offsetTop - offsetY)) + "px";
      elmnt.style.left = Math.min(maxX, Math.max(minX, elmnt.offsetLeft - offsetX)) + "px";
    }
  
    function closeDragElement() {
      /* stop moving when mouse button is released:*/
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }
}
