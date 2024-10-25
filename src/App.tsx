import './App.css';
import { Link, Routes, Route } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import Login from './pages/Login';

function App() {
    return (
        <div className="App">
            <LocalizationProvider dateAdapter={AdapterDateFns} dateFormats={{ keyboardDate: 'yyyy/MM/dd', normalDate: 'yyyy/MM/dd' }}>
                <Routes>
                    <Route
                        path="/"
                        element={
                            <div style={{ fontSize: '24px' }}>
                                <br />
                                <Link to="/login">Login</Link>
                            </div>
                        }
                    />
                    <Route path="/login" element={<Login />} />
                </Routes>
            </LocalizationProvider>
        </div>
    );
}

export default App;
