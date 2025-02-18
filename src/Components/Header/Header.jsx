import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';

export function Header() {
    return (
        <header>
            <div className='inner-content'>
                <div className='left-side'>
                    <h2>Here Your E-commerce</h2>
                    <p>Here you will find the products you want.Enjoy your time.</p>
                    <Link to="/all" className='see-more-btn'>
                        <span>See Now</span>
                        <FontAwesomeIcon icon={faChevronRight} />
                    </Link>
                </div>
                <div className='right-side'> 
                    <img src="/ecommerce.jpg" alt="products" />
                </div>
            </div>
        </header>
    );
}

export default Header;
