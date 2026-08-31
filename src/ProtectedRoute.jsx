import {Navigate , Outlet} from 'react-router-dom';
const ProtectedRoute = ({ isAuthenticated , user}) => {
    if (!isAuthenticated){
        return <Navigate replace to="/login"/>;
    }
    if (user?.role !== "admin"){
        return <Navigate replace to="/"/>;
    }
    return <Outlet/>;
}
export default ProtectedRoute;