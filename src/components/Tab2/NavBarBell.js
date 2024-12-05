import Container from 'react-bootstrap/Container';
import { Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function NavBarBell() {
  return (
    <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand className='fw-bold nav-Brand ms-3' href="#home"> 
           {/* <img src="https://cdn.pixabay.com/photo/2016/12/27/13/10/logo-1933884_640.png" className="me-2" alt="logo" /> */}
           Tab2
          </Navbar.Brand>
      </Container>
    </Navbar>
  );
}

export default NavBarBell;