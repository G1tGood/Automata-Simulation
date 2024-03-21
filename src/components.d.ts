/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
import { DFAmodel } from "./models/dfa-model/dfa-model";
import { stateIdType, StateModel } from "./models/state-model/state-model";
export { DFAmodel } from "./models/dfa-model/dfa-model";
export { stateIdType, StateModel } from "./models/state-model/state-model";
export namespace Components {
    interface DfaAutomata {
        "model": DFAmodel;
    }
    interface DraggableWrapper {
        "contained": boolean;
    }
    interface StateComponent {
        "model": StateModel;
    }
}
export interface StateComponentCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLStateComponentElement;
}
declare global {
    interface HTMLDfaAutomataElement extends Components.DfaAutomata, HTMLStencilElement {
    }
    var HTMLDfaAutomataElement: {
        prototype: HTMLDfaAutomataElement;
        new (): HTMLDfaAutomataElement;
    };
    interface HTMLDraggableWrapperElement extends Components.DraggableWrapper, HTMLStencilElement {
    }
    var HTMLDraggableWrapperElement: {
        prototype: HTMLDraggableWrapperElement;
        new (): HTMLDraggableWrapperElement;
    };
    interface HTMLStateComponentElementEventMap {
        "destroy": stateIdType;
        "selectState": [stateIdType, boolean];
        "nameChange": [stateIdType, string, string];
        "update": void;
    }
    interface HTMLStateComponentElement extends Components.StateComponent, HTMLStencilElement {
        addEventListener<K extends keyof HTMLStateComponentElementEventMap>(type: K, listener: (this: HTMLStateComponentElement, ev: StateComponentCustomEvent<HTMLStateComponentElementEventMap[K]>) => any, options?: boolean | AddEventListenerOptions): void;
        addEventListener<K extends keyof DocumentEventMap>(type: K, listener: (this: Document, ev: DocumentEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
        addEventListener<K extends keyof HTMLElementEventMap>(type: K, listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
        addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
        removeEventListener<K extends keyof HTMLStateComponentElementEventMap>(type: K, listener: (this: HTMLStateComponentElement, ev: StateComponentCustomEvent<HTMLStateComponentElementEventMap[K]>) => any, options?: boolean | EventListenerOptions): void;
        removeEventListener<K extends keyof DocumentEventMap>(type: K, listener: (this: Document, ev: DocumentEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
        removeEventListener<K extends keyof HTMLElementEventMap>(type: K, listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
        removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
    }
    var HTMLStateComponentElement: {
        prototype: HTMLStateComponentElement;
        new (): HTMLStateComponentElement;
    };
    interface HTMLElementTagNameMap {
        "dfa-automata": HTMLDfaAutomataElement;
        "draggable-wrapper": HTMLDraggableWrapperElement;
        "state-component": HTMLStateComponentElement;
    }
}
declare namespace LocalJSX {
    interface DfaAutomata {
        "model"?: DFAmodel;
    }
    interface DraggableWrapper {
        "contained"?: boolean;
    }
    interface StateComponent {
        "model"?: StateModel;
        "onDestroy"?: (event: StateComponentCustomEvent<stateIdType>) => void;
        "onNameChange"?: (event: StateComponentCustomEvent<[stateIdType, string, string]>) => void;
        "onSelectState"?: (event: StateComponentCustomEvent<[stateIdType, boolean]>) => void;
        "onUpdate"?: (event: StateComponentCustomEvent<void>) => void;
    }
    interface IntrinsicElements {
        "dfa-automata": DfaAutomata;
        "draggable-wrapper": DraggableWrapper;
        "state-component": StateComponent;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "dfa-automata": LocalJSX.DfaAutomata & JSXBase.HTMLAttributes<HTMLDfaAutomataElement>;
            "draggable-wrapper": LocalJSX.DraggableWrapper & JSXBase.HTMLAttributes<HTMLDraggableWrapperElement>;
            "state-component": LocalJSX.StateComponent & JSXBase.HTMLAttributes<HTMLStateComponentElement>;
        }
    }
}
