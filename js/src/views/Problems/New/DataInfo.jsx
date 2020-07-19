import React from 'react';
import Alert from 'react-bootstrap/Alert'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import { FUEL_TYPES } from './../ProblemsTable';

export default function DataInfo({ data }) {
  return (
    <Alert variant="success">
      <Container>
        <Row>
          <Col>{data.Make}</Col>
          <Col>{data.Model}</Col>
          <Col>{data.ModelYear}</Col>
          <Col>{data.RegistrationYear}</Col>
        </Row>
        <Row>
          <Col>{FUEL_TYPES[data.FuelType]}</Col>
          <Col>{data.EngineSize} cm3</Col>
          <Col>{data.EnginePower} kW</Col>
          <Col>{data.EngineCode}</Col>
        </Row>
      </Container>
    </Alert>
  );
}

