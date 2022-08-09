import React, { useEffect, useState } from "react";
import "./App.css";
import {
  Card,
  Image,
  Table,
  Form,
  Container,
  Row,
  Col,
  Dropdown,
  DropdownButton,
  ButtonGroup,
  Spinner,
} from "react-bootstrap";

import { ICountry, FILTERBY, getCountries, filterCountries } from "./Helper";
import ErrorBox from "./Components/ErrorBox";

function App() {
  const [countries, setCountries] = useState<ICountry[]>([]);
  const [filteredCountries, setFilteredCountries] = useState<ICountry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filterBy, setFilterBy] = useState(FILTERBY.CAPITAL);
  const [searchWord, setSearchWord] = useState("");

  useEffect(() => {
    setIsLoading(true);

    const fillTable = async () => {
      try {
        const countriesData = await getCountries();

        setCountries(countriesData);
        setFilteredCountries(countriesData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fillTable();
  }, []);

  useEffect(() => {
    const filteredCountries = filterCountries(countries, filterBy, searchWord);

    setFilteredCountries(filteredCountries);
  }, [filterBy, searchWord]);

  return (
    <div className="App">
      <Card className="bg-dark text-white" body>
        <Container>
          <Row>
            <Col>
              <Card.Title style={{ fontSize: "24px", padding: "10px" }}>
                Countries Table
              </Card.Title>
            </Col>
            <Col>
              <Form>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Search</Form.Label>
                  <Form.Control
                    style={{ fontSize: "1.6rem" }}
                    type="text"
                    placeholder="type here..."
                    value={searchWord}
                    onChange={(e) => setSearchWord(e.target.value)}
                  />
                </Form.Group>
              </Form>
              <DropdownButton
                as={ButtonGroup}
                key="secondary"
                id={`dropdown-variants-secondary`}
                variant="secondary"
                title={`Filter by ${filterBy}`}
                size="lg"
                onSelect={(e) => setFilterBy(e || FILTERBY.CAPITAL)}
              >
                <Dropdown.Item eventKey={FILTERBY.CAPITAL} active>
                  Capital
                </Dropdown.Item>
                <Dropdown.Item eventKey={FILTERBY.NAME}>Name</Dropdown.Item>
                <Dropdown.Item eventKey={FILTERBY.REGION}>Region</Dropdown.Item>
              </DropdownButton>
            </Col>
          </Row>
        </Container>

        {isLoading && (
          <Spinner
            animation="border"
            style={{
              width: "10rem",
              height: "10rem",
              margin: "25rem 60rem",
            }}
          />
        )}
        {error && <ErrorBox errorMessage={error} />}
        <Table
          striped
          bordered
          hover
          responsive
          variant="dark"
          style={{ marginTop: "3rem" }}
        >
          <thead>
            <tr>
              <td></td>
              <td>Name</td>
              <td>Capital</td>
              <td>Region</td>
              <td>Flag</td>
            </tr>
          </thead>
          <tbody>
            {!isLoading &&
              filteredCountries.map((country: ICountry, index) => {
                return (
                  <tr key={country.id}>
                    <td>{index + 1}</td>
                    <td>{country.name}</td>
                    <td>{country.capital}</td>
                    <td>{country.region}</td>
                    <td>
                      <Image src={country.flag} fluid rounded />
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </Table>
      </Card>
    </div>
  );
}

export default App;
