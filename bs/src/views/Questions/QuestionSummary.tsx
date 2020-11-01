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
          <Col>Merkki: {data.Make}</Col>
          <Col>Malli: {data.Model}</Col>
          <Col>Mallivuosi: {data.ModelYear}</Col>
        </Row>
        <Row>
          <Col>Rekisteröintivuosi: {data.RegistrationYear}</Col>
          <Col>Rekisterinumero: {data.RegistrationNumber}</Col>
          <Col>KType: {data.KType}</Col>
        </Row>
        <Row>
          <Col>Käyttövoima: {FUEL_TYPE_TEXTS[data.FuelType]}</Col>
          <Col>Kuutiotilavuus: {data.EngineSize && <>{data.EngineSize} cm3</>}</Col>
          <Col>Teho: {data.EnginePower && <>{data.EnginePower} kW</>}</Col>
        </Row>
        <Row>
          <Col>Moottorin koodi: {data.EngineCode}</Col>
          <Col>VIN: {data.VIN}</Col>
          <Col></Col>
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
