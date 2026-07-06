import { Component, ChangeDetectionStrategy, input, signal } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { MatIconButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';

export interface TreeItem {
  id: number;
  level?: number;
  name: string;
  open?: boolean;
  selected?: boolean;
  indeterminate?: boolean;
  readonly?: boolean;
  children?: TreeItem[];
}

@Component({
  selector: 'lib-selectable-tree',
  imports: [NgTemplateOutlet, MatIconButton, MatCheckbox],
  templateUrl: './selectable-tree.component.html',
  styleUrls: ['./selectable-tree.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class SelectableTreeComponent {

  items = input<TreeItem[]>([]);

  openToggle(item: TreeItem) {
    item.open = true;
  }

  closeToggle(item: TreeItem) {
    item.open = false;
  }

  toggle(item: TreeItem, value: boolean) {
    item.selected = value;
    this.updateChildren(item, value);
    this.updateAllStates(this.items());
  }

  private updateChildren(item: TreeItem, value: boolean) {

    item.selected = value;
    item.indeterminate = false;

    item.children?.forEach(child => {
      this.updateChildren(child, value);
    });

  }

  private updateAllStates(lista: TreeItem[]) {
    for (const item of lista) {
      if (item.children?.length) {
        this.updateAllStates(item.children);

        const children = item.children;
        const hasSelectedOrIndeterminate = children.some(x => x.selected || x.indeterminate);
        const allSelected = children.every(x => x.selected);

        const nameLower = item.name.toLowerCase();
        const isEmpresaNode = !nameLower.includes('site') && !nameLower.includes('eqp') && !nameLower.includes('equipamento');

        if (isEmpresaNode) {
          const hasUncheckedChild = children.some(x => !x.selected && !x.indeterminate);
          if (hasUncheckedChild) {
            item.selected = false;
            item.indeterminate = hasSelectedOrIndeterminate;
          } else {
            item.selected = hasSelectedOrIndeterminate;
            item.indeterminate = false;
          }
        } else {
          item.selected = allSelected;
          item.indeterminate = hasSelectedOrIndeterminate && !allSelected;
        }
      }
    }
  }
}
