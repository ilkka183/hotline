import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup'

MyListGroup.defaultProps = {
  valueProperty: 'Id',
  textProperty: 'Name'
}

export default function MyListGroup({ items, selectedItem, valueProperty, textProperty, onItemSelect }) {
  return (
    <ListGroup>
      {items.map(item => (
        <ListGroup.Item
          key={item[valueProperty]}
          active={item === selectedItem}
          onClick={() => onItemSelect(item)}
        >
          {item[textProperty]}
        </ListGroup.Item>))}
    </ListGroup>
  );
}
