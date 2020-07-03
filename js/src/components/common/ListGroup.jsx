import React from 'react';

ListGroup.defaultProps = {
  valueProperty: '_id',
  textProperty: 'name'
}

export default function ListGroup({ items, selectedItem, valueProperty, textProperty, onItemSelect }) {
  return (
    <ul className="list-group">
      {items.map(item => (
        <li
          className={item === selectedItem ? "list-group-item active" : "list-group-item"}
          key={item[valueProperty]}
          onClick={() => onItemSelect(item)}
        >
          {item[textProperty]}
        </li>))}
    </ul>      
  );
}
