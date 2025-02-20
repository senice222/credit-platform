import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const pathAccessMap = {
    '/': 'Почта',
    '/finished': 'Почта',
    '/all-applications': 'Заявки',
    '/companies': 'Компании',
    '/clients': 'clientAccess',
    '/settings': 'superAdmin'
};

const useAccessControl = (admin) => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (admin.data) {
            const path = location.pathname;
            let requiredAccess = Object.entries(pathAccessMap).find(([key]) => path.startsWith(key))?.[1];
            console.log(requiredAccess)
            if (path.startsWith('/application') && requiredAccess !== 'superAdmin') {
                requiredAccess = 'Заявки';
            } else if (path.startsWith('/companies') && requiredAccess !== 'superAdmin') {
                requiredAccess = 'Компании';
            } else if (path.startsWith('/clients') && requiredAccess !== 'superAdmin') {
                requiredAccess = 'clientAccess';
            }
            
            if (path === '/settings') {
                requiredAccess = 'superAdmin';
            }

            if (requiredAccess === 'superAdmin') {
                if (!admin.data.superAdmin) {
                    navigate('/notAllowed');
                }
            } else if (requiredAccess === 'clientAccess') {
                if (!admin.data.clientAccess && !admin.data.superAdmin) {
                    navigate('/notAllowed');
                }
            } else if (requiredAccess && !admin.data.access?.includes(requiredAccess)) {
                navigate('/notAllowed');
            }
        }
    }, [location.pathname, admin, navigate]);
};

export default useAccessControl;
