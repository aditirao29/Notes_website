import './Navbar.css'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo">Notefy</div>
      <ul className='together'>
        <div className="nav-links">
          <li><Link to='Home'>Home</Link></li>
          <li><Link to='Features'>Features</Link></li>
          <li><Link to='About'>About</Link></li>
          <li className='contact'><Link to='Contact'>Contact Us</Link></li>
        </div>
        <div className='navbuttons'>
          <Link to='/signup'><button className='signup'>Sign Up</button></Link>
          <Link  to='/login'><button className='login'>Login</button></Link>
        </div>
      </ul>
    </nav>
  )
}

export default Navbar
