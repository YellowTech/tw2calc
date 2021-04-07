import React, { Component, FormEvent, ChangeEvent, useState, useEffect } from 'react'
import './App.css';
import { Container, Nav, Navbar, Collapse, Button, Card, Row, Col, Form, InputGroup, FormControl} from 'react-bootstrap'
import LocalStorage from './localStorage'
import Village from './Village'

// @ts-ignore
import DateTimePicker from 'react-datetime-picker';

function App() {
  const [xTarget, changeXTarget] = LocalStorage.numberHook("xTarget");
  const [yTarget, changeYTarget] = LocalStorage.numberHook("yTarget");
  const [villages, changeVillages] = LocalStorage.stringHook("villages", JSON.stringify({villages: []}));
  const [newVillageName, changeNewVillageName] = useState("");
  const [newVillageX, changeNewVillageX] = useState("0");
  const [newVillageY, changeNewVillageY] = useState("0");
  const [attackDate, changeAttackDate] = LocalStorage.stringHook("attackDate", (new Date()).setHours((new Date()).getHours() + 4).toString())
  const [isCollapsed, changeCollapsed] = LocalStorage.numberHook("myVillagesCollapse")

  let villagesArray : [[string, number, number, boolean]] = JSON.parse(villages).villages;

  const removeVillage = (name: string) => {
    let newVillages = villagesArray.filter(e => e[0] !== name);
    localStorage.removeItem(name + "collapse")
    localStorage.removeItem(name + "troop")
    changeVillages(JSON.stringify({villages: newVillages}))
  }

  const moveVillage = (index: number, up: boolean) => {
    let newVillages = [...villagesArray]
    if(up){
      if (index > 0) {
        let a = newVillages[index - 1]
        newVillages[index - 1] = newVillages[index]
        newVillages[index] = a
      }
    } else {
      if (index < villagesArray.length - 1) {
        let a = newVillages[index + 1]
        newVillages[index + 1] = newVillages[index]
        newVillages[index] = a
      }
    }
    changeVillages(JSON.stringify({ villages: newVillages }))
  }
  
  const addVillage = (name: string, x: number, y: number) => {
    let newVillages = [...villagesArray]
    newVillages.push([name, x, y, true])
    changeVillages(JSON.stringify({villages: newVillages}))
  }

  const toggleVillage = (index: number) => {
    let newVillages = [...villagesArray]
    newVillages[index][3] = !newVillages[index][3]
    changeVillages(JSON.stringify({ villages: newVillages }))
  }

  // Structure of site:
  // Navbar
  // Target Village
  // Your Villages
  // List of your Villages
  // Add new Village

  return (
    <div>
      {/* Navbar */}
      <Navbar bg="dark" variant="dark" expand="sm">
        <Navbar.Brand>TW2 Calculator</Navbar.Brand>
      </Navbar>
      <br/>
      <Container>
        {/* Target Village */}
        <Form onSubmit={(e) => e.preventDefault()}>
          <h5>Target Village</h5>
          <InputGroup className="mb-2">
            <InputGroup.Prepend>
              <InputGroup.Text>Target X / Y</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl value={xTarget} type="number" onChange={(e) => changeXTarget(Number(e.target.value))} placeholder="X" />
            <FormControl value={yTarget} type="number" onChange={(e) => changeYTarget(Number(e.target.value))} placeholder="Y" />
          </InputGroup>
          <div className="text-center">
            Attack Arrival Time: <DateTimePicker maxDetail={"second"} locale={"ch"} className="noBorder" value={new Date(Number(attackDate))} 
                                  onChange={(date: Date) => changeAttackDate(date.setMilliseconds(0).toString())} calendarIcon={null} clearIcon={null} />
          </div>
        </Form>
        <br />
        <br />
        {/* Your Villages */}
        <h5 className="mb-3">Your Villages</h5>
        <div>
          <Card>
            <Card.Header className={"colorful2"} onClick={() => changeCollapsed(isCollapsed + 1)}>
              <span className="align-middle">Your {villagesArray.length} Villages</span>
              <Button className="float-right" variant="dark" size="sm" onClick={e => { changeVillages(JSON.stringify({ villages: villagesArray.sort() })); e.stopPropagation()}}>Sort Alphabetically</Button>
            </Card.Header>
            <Collapse in={isCollapsed % 2 === 0}>
              <div>
                <Card.Body className="pb-0">
                  <Form onSubmit={() => false}>
                    <div key={`inline-checkbox`} className="mb-3">
                      {
                        villagesArray.map((village, index) => {
                          return (<Form.Check className="mr-3" inline label={village[0]} type="checkbox" id={`inline-checkbox-${index}`} checked={village[3]} onChange={() => toggleVillage(index)} />)
                        })
                      }
                    </div>
                  </Form>
                </Card.Body>
              </div>
            </Collapse>
          </Card>
          <br />
        </div>
        
        {/* List of your villages */}
        {
          villagesArray.map((village, index) => {
            if(!village[3]){
              return (<></>);
            }
            return (<Village key={index} name={village[0]} x={village[1]} y={village[2]} xTarget={xTarget} yTarget={yTarget} remove={() => removeVillage(village[0])} 
              moveVillageUp={() => moveVillage(index, true)} moveVillageDown={() => moveVillage(index, false)} attackDate={Number(attackDate)}/>)
          })
        }
        <br />

        {/* Add new Village */}
        <Form onSubmit={(e) => { (villagesArray.filter(e => e[0] === newVillageName).length > 0) ? alert("Vilage name already exists!") : addVillage(newVillageName, Number(newVillageX), Number(newVillageY)); changeNewVillageName(""); changeNewVillageX("0"); changeNewVillageY("0"); e.preventDefault() }}>
          <h5>Add New Village</h5>
          <InputGroup className="mb-2">
            <FormControl value={newVillageName} type="text" onChange={e => changeNewVillageName(e.target.value)} placeholder="Name" />
            <InputGroup.Append className={"input-group-prepend"}>
              <InputGroup.Text>X / Y</InputGroup.Text>
            </InputGroup.Append>
            <FormControl value={newVillageX} type="number" onChange={e => changeNewVillageX(e.target.value)} placeholder="X" />
            <FormControl value={newVillageY} type="number" onChange={e => changeNewVillageY(e.target.value)} placeholder="Y" />
            <InputGroup.Append>
              <Button type="submit" value="Submit" className="float-right" variant="success" size="sm">Add</Button>
            </InputGroup.Append>
          </InputGroup>
        </Form>
        
        <br />
        <br />
        <br />
        <footer className="pt-4 my-md-5 pt-md-5 border-top text-center">
          <p>This webpage is open-source and can be found on <a href="https://github.com/YellowTech/tw2calc">Github</a></p>
        </footer>
      </Container>
    </div>
  );
}

export default App;
