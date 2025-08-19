import Navbar from '../components/Navbar'
import human from '../assets/notemaking_human.jpg'
import { Link } from 'react-router-dom'
import './LandingPage.css'

function LandingPage() {
    return (
      <>
        <Navbar/>
          <div className='hero-section'>
            <img className='hero-image' src={human} alt='Woman writing'/>
            <p className='hero-text'>Organize your<br/>
            thoughts. <span className='boost'> BOOST </span> <br/>
            your productivity.</p>
            <button><Link to='/signup'> Get Started → </Link></button>
          </div>
      </>   
    )
}

export default LandingPage