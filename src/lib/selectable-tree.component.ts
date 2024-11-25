import { NgStyle, NgTemplateOutlet } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';

@Component({
  selector: 'lib-selectable-tree',
  standalone: true,
  imports: [NgTemplateOutlet, NgStyle, MatIconButton, MatCheckbox],
  templateUrl: './selectable-tree.component.html',
  styleUrls: ['./selectable-tree.component.scss'],
})
export class SelectableTreeComponent  implements OnInit {

  @Input('items') set _items(value) {
    this.items = value;
    //console.log(value)
  };

  items = [
    {id: 1, level: 0, name: 'Teste 1', open: false, selected: false, children: [{id: 21, level: 1, name: 'Teste 1.2'}]},
    {id: 2, level: 0, name: 'Teste 2', selected: false},
  ];

  constructor() { }

  ngOnInit(): void {
  }

  updateItem(lista, item) {
    for(let i=0; i<lista.length; i++) {
      if (lista[i].id === item.id && lista[i].name === item.name) {
        lista[i] = item;
        return;
      }

      if (lista[i].children !== undefined && lista[i].children !== null && lista[i].children.length > 0) {
        this.updateItem(lista[i].children, item);
      }
    }
  }

  checkItem(lista, item, value) {
    for(let i=0; i<lista.length; i++) {
      if (lista[i].id === item.id && lista[i].name === item.name) {
        lista[i].selected = value;
        if (lista[i].children !== undefined && lista[i].children !== null && lista[i].children.length > 0) {
          this.checkChildrenItem(lista[i].children, value);
        }
      } else {
        if (lista[i].children !== undefined && lista[i].children !== null && lista[i].children.length > 0) {
          this.checkItem(lista[i].children, item, value);
        }
      }
      if (lista[i].children.length > 0) {
        const allSelected = lista[i].children.every(t=> t.selected === true);
        lista[i].selected = allSelected;
        lista[i].indeterminate = allSelected === false && lista[i].children.some(t=> t.selected === true);
      }
      //console.log(lista[i].name, lista[i].children.length > 0 && lista[i].children.every(t=> t.selected === true))
    }
  }

  checkChildrenItem(lista, value) {
    for(let i=0; i<lista.length; i++) {
      lista[i].selected = value;

      if (lista[i].children !== undefined && lista[i].children !== null && lista[i].children.length > 0) {
        this.checkChildrenItem(lista[i].children, value);
      }

    }
  }

  openToggle(item) {
    item.open = true;
    this.updateItem(this.items, item);
    this.items = Object.assign([], this.items);
  }

  closeToggle(item) {
    item.open = false;
    this.updateItem(this.items, item);
    this.items = Object.assign([], this.items);
  }

  toggle(item, value){
    item.selected = value;
    this.checkItem(this.items, item, value);
    this.items = Object.assign([], this.items, true);
  }

}
