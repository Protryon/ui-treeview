
import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import '@polymer/polymer/lib/elements/dom-if.js';
import '@polymer/polymer/lib/elements/dom-repeat.js';
import '@polymer/polymer/lib/elements/dom-repeat.js';

class UiTreeViewCollapsible extends PolymerElement {
  static get properties() {
      return {
        expanded: {
          type: Boolean,
          value: false,
        },
        inline: {
          type: Boolean,
          value: false,
        },
      };
  }

  toggle() {
    this.$.primary.classList.toggle('expanded', this.expanded = !this.expanded);
  }

  divClasses() {
    return `collapsible${this.expanded ? ' expanded' : ''}${this.inline ? ' inline' : ''}`
  }

  static get template() {
    return html`<style>
    #title {

    }
    :host > div > #body {
      display:none;
    }
    :host > div > #title > #caret {
      vertical-align: center;
      display:inline-block;
      width:8px;
    }

    :host > .expanded > #body {
      margin-left:1em;
      display:block;
    }
    :host > .expanded > #title > .collapsed-indicator {
      display:none;
    }
    :host > .inline > #title > .collapsed-indicator {
      display:none !important;
    }
    :host > .inline #body {
      margin-left:0;
      display:inline-block;
    }
    .inline #caretSvg {
      opacity:0;
    }
    :host > div > #title > #caret > #caretSvg {
      transform:  translate(-2px,1px);
    }
    :host > .expanded > #title > #caret > #caretSvg {
      transform:  translate(-2px,1px) rotate(90deg);
      /*-webkit-transform:  rotate(90deg);*/
    }


  </style>
  <div class$={{divClasses()}} id="primary">
    <span id="title" on-click="toggle">
      <span id="caret">
        <svg xmlns="http://www.w3.org/2000/svg" id="caretSvg" width="14" height="14" viewBox="0 0 14 14">
          <path d="M0 0v16l6-6-6-6z" transform="translate(4,-3)" />
        </svg>
      </span>
      <slot name="title"></slot>
      <span class="collapsed-indicator">
        <slot name="indicator"></slot>
      </span>
    </span>
    <div id="body">
      <slot name="body"></slot>
    </div>
  </div>`;
  }
}

customElements.define('ui-treeview-collapsible', UiTreeViewCollapsible);

class UiTreeViewObject extends PolymerElement {
  static get properties() {
      return {
        expanded: {
          type: Boolean,
          value: false,
        },
        data: {
          type: Object,
          value: {},
        },
      };
  }

  isObject(obj) {
    return typeof obj === 'object' && !(obj instanceof Array);
  }

  isArray(obj) {
    return obj instanceof Array
  }

  isSimple(obj) {
    return !this.isObject(obj) && !this.isArray(obj);
  }

  entries(obj) {
    return Object.keys(obj).map(key => ({key, value: obj[key]}));
  }

  stringify(obj) {
    return JSON.stringify(obj);
  }

  static get template() {
    return html`
<template is="dom-repeat" items="{{entries(data)}}" as="entry">
  <template is="dom-if" if="{{ isObject(entry.value) }}">
    <ui-treeview-collapsible expanded={{expanded}}>
      <span class="title key" slot="title">
        {{entry.key}}:
      </span>
      <span class="indicator" slot="indicator">{...}</span>
      <div class="body value" slot="body">
        <ui-treeview-object data="{{entry.value}}" expanded={{expanded}}></ui-treeview-object>
      </div>
    </ui-treeview-collapsible>
    </template>
    <template is="dom-if" if="{{ isArray(entry.value) }}">
    <template is="dom-if" if="{{!entry.value.length}}">
      <ui-treeview-collapsible expanded inline>
        <span class="title key" slot="title">
          {{entry.key}}:
        </span>
        <div class="body value" slot="body">
          []
        </div>
      </ui-treeview-collapsible>
    </template>
    <template is="dom-if" if="{{entry.value.length}}">
      <ui-treeview-collapsible expanded={{expanded}}>
        <span class="title key" slot="title">
          {{entry.key}}:
        </span>
        <span class="indicator" slot="indicator">[...]</span>
        <div class="body value" slot="body">
          <ui-treeview-array data="{{entry.value}}" expanded={{expanded}}></ui-treeview-array>
        </div>
      </ui-treeview-collapsible>
    </template>
    </template>
    <template is="dom-if" if="{{ isSimple(entry.value) }}">
    <ui-treeview-collapsible expanded inline>
      <span class="title key" slot="title">
        {{entry.key}}:
      </span>
      <span class="indicator" slot="indicator">...</span>
      <ui-treeview-simple data="{{entry.value}}" class="body value" slot="body"></ui-treeview-simple>
    </ui-treeview-collapsible>
  </template>
  
</template>`;
  }
}

customElements.define('ui-treeview-object', UiTreeViewObject);

class UiTreeViewArray extends PolymerElement {
  static get properties() {
      return {
        expanded: {
          type: Boolean,
          value: false,
        },
        data: {
          type: Object,
          value: {},
        },
      };
  }

  isObject(obj) {
    return typeof obj === 'object' && !(obj instanceof Array);
  }

  isArray(obj) {
    return obj instanceof Array
  }

  isSimple(obj) {
    return !this.isObject(obj) && !this.isArray(obj);
  }

  stringify(obj) {
    return JSON.stringify(obj);
  }

  static get template() {
    return html`
    <template is="dom-repeat" items="{{data}}" as="value" index-as="i">
      <template is="dom-if" if="{{ isObject(value) }}">
        <ui-treeview-collapsible expanded={{expanded}}>
          <span class="title key" slot="title">
          {{i}}:
          </span>
          <span class="indicator" slot="indicator">{...}</span>
          <div class="body value" slot="body">
            <ui-treeview-object data="{{value}}" expanded={{expanded}}></ui-treeview-object>
          </div>
        </ui-treeview-collapsible>
      </template>
      <template is="dom-if" if="{{ isArray(value) }}">
        <template is="dom-if" if="{{!value.length}}">
          <ui-treeview-collapsible expanded inline>
          <span class="title key" slot="title">
          {{i}}:
          </span>
            <span class="indicator" slot="indicator">[...]</span>
            <div class="body value" slot="body">
              [ ]
            </div>
          </ui-treeview-collapsible>
        </template>
        <template is="dom-if" if="{{value.length}}">
          <ui-treeview-collapsible expanded={{expanded}}>
          <span class="title key" slot="title">
          {{i}}:
          </span>
            <span class="indicator" slot="indicator">[...]</span>
            <div class="body value" slot="body">
              <ui-treeview-array data="{{value}}" expanded={{expanded}}></ui-treeview-array>
            </div>
          </ui-treeview-collapsible>
        </template>
      </template>
      <template is="dom-if" if="{{ isSimple(value) }}">
        <ui-treeview-collapsible expanded inline>
          <span class="title key" slot="title">
          {{i}}:
          </span>
          <span class="indicator" slot="indicator">...</span>
          <ui-treeview-simple data="{{value}}" class="body value" slot="body"></ui-treeview-simple>
        </ui-treeview-collapsible>
      </template>
    </template>`;
  }
}

customElements.define('ui-treeview-array', UiTreeViewArray);

class UiTreeViewSimple extends PolymerElement {
  static get properties() {
      return {
        data: {
          type: Object,
          value: {},
        },
      };
  }

  isString(obj) {
    return typeof obj === 'string';
  }

  isNumber(obj) {
    return typeof obj === 'number';
  }

  isOther(obj) {
    return !this.isNumber(obj) && !this.isString(obj);
  }

  static get template() {
    return html`
    <span class="value">
      <template is="dom-if" if="{{isString(data)}}">
        <span class="string">
        "{{data}}"
        </span>
      </template>
      <template is="dom-if" if="{{isNumber(data)}}">
        <span class="number">
        {{data}}
        </span>
      </template>
      <template is="dom-if" if="{{isOther(data)}}">
        <span class="other">
        {{data}}
        </span>
      </template>
    </span>`;
  }
}

customElements.define('ui-treeview-simple', UiTreeViewSimple);

class UiTreeView extends PolymerElement {
  static get properties() {
      return {
        expanded: {
          type: Boolean,
          value: false,
        },
        data: {
          type: Object,
          value: {},
        },
      };
  }

  isObject(obj) {
    return typeof obj === 'object' && !(obj instanceof Array);
  }

  isArray(obj) {
    return obj instanceof Array
  }

  isSimple(obj) {
    return !this.isObject(obj) && !this.isArray(obj);
  }

  keys(obj) {
    return Object.keys(obj);
  }

  stringify(obj) {
    return JSON.stringify(obj);
  }

  created() {
    
  }
  
  display(data) {
      this.data = data;
  }

  ready() {
    try {
      this.data = JSON.parse(this.innerHTML)
    } catch(e) {
      this.data = { error : {
        msg : "Could not parse JSON",
        err : e
      }};
    }
    super.ready();
  }

  static get template() {
    return html`
    <style>
      :host {
        display:block;
      }
      ::shadow /deep/ .title:hover {
        background-color:hsl(230,50%,85%);
        cursor:pointer;
      }
      ::shadow /deep/ * {
        font-family: Consolas, "Liberation Mono", Courier, monospace;
        font-size:16px;
      }
      ::shadow /deep/ .key {
        color:#606aa1;
      }
      ::shadow /deep/ .value .other {
        color: rgb(50, 47, 51);
      }
      ::shadow /deep/ .value .string {
        color: rgb(218, 86, 74);
      }
      ::shadow /deep/ .value .number {
        color: rgb(70, 135, 184);
      }
    </style>
    <template is="dom-if" if="{{ isObject(data) }}">
      <ui-treeview-object data="{{data}}" expanded={{expanded}}></ui-treeview-object>
    </template>
    <template is="dom-if" if="{{ isArray(data) }}" expanded={{expanded}}>
      <ui-treeview-array data="{{data}}"></ui-treeview-array>
    </template>
    <template is="dom-if" if="{{ isSimple(data) }}">
      <ui-treeview-simple data="{{data}}"></ui-treeview-simple>
    </template>`;
  }
}

customElements.define('ui-treeview', UiTreeView);