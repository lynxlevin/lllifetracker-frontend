import { Navigate, Link } from 'react-router-dom';
import useUserAPI from '../hooks/useUserAPI';
// import AppIcon from '../components/AppIcon';

const Top = () => {
    const { isLoggedIn } = useUserAPI();

    // if (isLoggedIn === true) {
    //     return <Navigate to='/ambitions' />;
    // }
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
