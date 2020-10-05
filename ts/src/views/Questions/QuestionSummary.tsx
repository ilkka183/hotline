import React from 'react';
import Alert from 'react-bootstrap/Alert'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import QuestionForm from './QuestionForm';
import { FUEL_TYPE_TEXTS } from './Question';

interface Props {
  data: any,
  className?: string
}

const QuestionSummary: React.FC<Props> = ({ className, data }) => {

  function renderDescription() {
    return QuestionForm.renderText(data.Description);
  }

  return (
    <Alert className={className} variant="success">
      <Container>
        <Row>
          <Col>{data.Make}</Col>
          <Col>{data.Model}</Col>
          <Col>{data.ModelYear}</Col>
          <Col>{data.RegistrationYear}</Col>
          <Col>{data.RegistrationNumber}</Col>
        </Row>
        <Row>
          <Col>{FUEL_TYPE_TEXTS[data.FuelType]}</Col>
          {data.EngineSize && <Col>{data.EngineSize} cm3</Col>}
          {data.EnginePower && <Col>{data.EnginePower} kW</Col>}
          <Col>{data.EngineCode}</Col>
          <Col>{data.VIN}</Col>
        </Row>
        <Row>
          <Col>{data.Title}</Col>
        </Row>
        <Row>
          <Col>{renderDescription()}</Col>
        </Row>
      </Container>
    </Alert>
  );
}

export default QuestionSummary;
