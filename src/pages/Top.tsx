import { Link } from 'react-router-dom';
// import AppIcon from '../components/AppIcon';

const Top = () => {
    return (
        <div style={{ fontSize: '24px' }}>
            <br />
            <Link to='/login'>Login</Link>
            <br />
            <br />
            <Link to='/ambitions'>Ambitions</Link>
            <br />
            <br />
            <Link to='/memos'>Memos</Link>
            <br />
            <br />
            <Link to='/action-tracks'>ActionTracks</Link>
        </div>
    );
};

export default Top;
