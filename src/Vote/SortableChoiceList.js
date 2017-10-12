import React from 'react'
import {
  SortableContainer,
  SortableElement,
  SortableHandle
} from 'react-sortable-hoc';

const DragHandle = SortableHandle(() => <span>::</span>); // This can be any component you want

const SortableItem = SortableElement(({ value }) => {
  return (
    <li>
      <DragHandle />
      <h3>{value.title}</h3>
      {value.desc}
    </li>
  );
});

/**
 * The container element for a drag and sort list.
 */
const SortableChoiceList = SortableContainer(({ items }) => {
  if (items.length === 0) {
    items = ["Select options to rank"]
  }
  return (
    <ul className="Vote-choices">
      {Object.keys(items).map((key, index) => (
        <SortableItem key={`item-${index}`} index={index} value={items[key]} />
      ))}
    </ul>
  );
});

export default SortableChoiceList;