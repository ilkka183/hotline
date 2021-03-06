import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup'

interface Props {
  items: any[],
  selectedItem: any,
  valueProperty: string,
  textProperty: string,
  onItemSelect: (item: any) => void
}

const defaultProps = {
  valueProperty: 'Id',
  textProperty: 'Name'
}

const MyListGroup: React.FC<Props> = ({ items, selectedItem, valueProperty, textProperty, onItemSelect }) => {
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

MyListGroup.defaultProps = defaultProps;

export default MyListGroup;

