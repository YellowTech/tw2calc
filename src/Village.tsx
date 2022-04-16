import React from 'react'
import './App.css';
import { Collapse, Button, Card, Row, Col, Form } from 'react-bootstrap'
import LocalStorage from './localStorage'

// calculate the distance between to sets of coords in a hexagonal grid
function calcDistance (xOrigin: number, yOrigin: number, xTarget: number, yTarget: number): number {
  const xToRealX = (x: number, y: number) => y % 2 === 1 ? x + 0.5 : x;
  let xOriginNew = xToRealX(xOrigin, yOrigin);
  let xTargetNew = xToRealX(xTarget, yTarget)
  let mapScale = Math.sqrt(3) / 2;
  let yOriginNew = yOrigin * mapScale;
  let yTargetNew = yTarget * mapScale;
  return Number(Math.sqrt(Math.pow((xTargetNew - xOriginNew), 2) + Math.pow((yTargetNew - yOriginNew), 2)).toFixed(5));
}

function Village (props: { name: string, x: number, y: number, xTarget: number, yTarget: number,
                       remove: () => void,            moveVillageUp: () => void, 
                       moveVillageDown: () => void,   attackDate: number}) {
  const [troop, changeTroop] = LocalStorage.numberHook(props.name + "troop")
  const [isCollapsed, changeCollapsed] = LocalStorage.numberHook(props.name + "collapse")

  const dist = calcDistance(props.x, props.y, props.xTarget, props.yTarget)

  // speed of units
  const map = [
    480, // 0 Leichte Kavallerie
    480, // 1 Berittene Bogenschützen
    540, // 2 Schwere Kavallerie
    540, // 3 Paladin
    840, // 4 Speerträger
    840, // 5 Axtkämpfer
    840, // 6 Bogenschützen
    840, // 7 Berserker
    1080, // 8 Schwertkämpfer
    1440, // 9 Rammen
    1440, // 10 Katapulte
    2100, // 11 Adelsgeschlechter
    3000 // 12 Trebuchet
  ]

  function secondsToDhms(seconds: number) {
      var d = Math.floor(seconds / (3600 * 24));
      var h = Math.floor((seconds % (3600 * 24)) / 3600);
      var m = Math.floor((seconds % 3600) / 60);
      var s = Math.floor(seconds % 60);

      var dDisplay = d > 0 ? d + "d" : "";
      var hDisplay = h > 0 ? h + "h" : "";
      var mDisplay = m > 0 ? m + "m" : "";
      var sDisplay = s > 0 ? s + "s" : "";
      return dDisplay + hDisplay + mDisplay + sDisplay;
  }

  return (
    <div>
      <Card>
        <Card.Header className={"colorful"} onClick={() => changeCollapsed(isCollapsed + 1)}>
          <span className="align-middle">{props.name} at {props.x} | {props.y}</span>
          <Button className="float-right ml-1" variant="danger" size="sm" onClick={e => {props.remove(); e.stopPropagation();}}>Remove</Button>
          <Button className="float-right ml-1" variant="dark" size="sm" onClick={e => { props.moveVillageUp(); e.stopPropagation(); }}>ᐱ</Button>
          <Button className="float-right ml-3" variant="dark" size="sm" onClick={e => { props.moveVillageDown(); e.stopPropagation(); }}>ᐯ</Button>
          {(isCollapsed % 2 !== 0) ? <span className="align-middle float-right d-none d-md-block mt-1">{new Date(props.attackDate - (map[troop] as number * dist * 1000)).toLocaleString()}</span> : <></>}
        </Card.Header>
        <Collapse in={isCollapsed % 2 === 0}>
          <div>
            <Card.Body className="pb-0">
              <Form onSubmit={() => false}>
                <Form.Group controlId="exampleForm.SelectCustom">
                  <Form.Control as="select" custom value={troop} onChange={(e) => changeTroop(Number(e.target.value))} >
                    {/* German Options
                    <option value="0">Leichte Kavallerie -- Schnellstes</option>
                    <option value="1">Berittene Bogenschützen</option>
                    <option value="2">Schwere Kavallerie</option>
                    <option value="3">Paladin</option>
                    <option value="4">Speerträger</option>
                    <option value="5">Axtkämpfer</option>
                    <option value="6">Bogenschützen</option>
                    <option value="7">Berserker</option>
                    <option value="8">Schwertkämpfer</option>
                    <option value="9">Rammen</option>
                    <option value="10">Katapulte</option>
                    <option value="11">Adelsgeschlechter</option>
                    <option value="12">Trebuchet -- Langsamstes</option> */}
                    <option value="0">Light Cavalry -- Fastest</option>
                    <option value="1">Mounted Archer</option>
                    <option value="2">Heavy Cavalry</option>
                    <option value="3">Paladin</option>
                    <option value="4">Spearman</option>
                    <option value="5">Axe Fighter</option>
                    <option value="6">Archer</option>
                    <option value="7">Berserk</option>
                    <option value="8">Swordsman</option>
                    <option value="9">Ram</option>
                    <option value="10">Catapult</option>
                    <option value="11">Nobleman</option>
                    <option value="12">Trebuchet -- Slowest</option>
                  </Form.Control>
                </Form.Group>
              </Form>
              <Row className="justify-content-between">
                <Col sm={3}>
                  <p>Distance: {dist.toFixed(2)}</p>
                </Col>
                <Col sm={3}>
                  <p className="text-center">Travel Time: {secondsToDhms((map[troop] as number * dist))}</p>
                </Col>
                <Col sm={6}>
                  <p className="text-right">Departure Time: {new Date(props.attackDate - (map[troop] as number * dist * 1000)).toLocaleString()}</p>
                </Col>
              </Row>
            </Card.Body>
          </div>
        </Collapse>
      </Card>
      <br/>
    </div>
  ); 
}

export default Village