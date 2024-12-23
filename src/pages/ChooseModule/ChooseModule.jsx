import {useEffect} from "react";
import styles from './ChooseModule.module.scss'
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {fetchAuthMe} from "../../store/slices/Admin.slice";
import Loader from "../../components/Loader/Loader";
import useAccessControl from "../../hooks/useAccessControl";
import ModuleCard from "../../components/ModuleCard/ModuleCard.jsx";
import { logout } from "../../store/slices/Admin.slice";
import axios from '../../core/axios.js'
import { ActsUrl, requirementsUrl } from "../../urls.jsx";
import {
    ActsFolder,
    CreditFolder,
    Logout,
    RequirementsFolder,
    Settings,
    UserProfile
} from "../../components/Modal/Svgs.jsx";

const ChooseModule = () => {
    const dispatch = useDispatch();
    const admin = useSelector((state) => state.admin);
    const navigate = useNavigate();
    useEffect(() => {
        dispatch(fetchAuthMe());
    }, []);

    useEffect(() => {
        if (!admin.data && !admin.loading) {
            navigate("/login");
        }
    }, [admin]);
    useAccessControl(admin)

    const handleChooseModule = async (url) => {
        const {data} = await axios.post('admin/generateTransferKey', {adminId: admin.data._id})
        window.location.href = `${url}/login/${data.transferKey}`
    }

    if (admin.loading) {
        return <Loader/>;
    }
    if (!admin.data) {
        return <Navigate to="/login"/>
    }
    // https://orders.consultantnlgpanel.ru
    return (
        <div className={styles.wrapper}>
            <h1 className={styles.title}>Выберите модуль</h1>
            <div className={styles.modulesWrapp}>
                <div className={styles.modules}>
                    {(admin.data.superAdmin || admin.data.modulesAccess?.includes("Акты")) && (
                        <ModuleCard 
                            icon={<ActsFolder/>} 
                            onClick={() => handleChooseModule(ActsUrl)} 
                            title="Акты"
                        />
                    )}
                    {(admin.data.superAdmin || admin.data.modulesAccess?.includes("Требования")) && (
                        <ModuleCard 
                            icon={<RequirementsFolder/>} 
                            onClick={() => handleChooseModule(requirementsUrl)} 
                            title="Требования"
                        />
                    )}
                    {(admin.data.superAdmin || admin.data.modulesAccess?.includes("Кредиторка")) && (
                        <ModuleCard 
                            icon={<CreditFolder/>} 
                            onClick={() => navigate("/")} 
                            title="Кредиторка"
                        />
                    )}
                </div>
                <div className={styles.profile}>
                    <div className={styles.userInfo}>
                        <div className={styles.avatar}>
                            <UserProfile/>
                        </div>
                        <div className={styles.userDetails}>
                            <div>{admin.data.login}</div>
                            <div className={styles.role}>{admin.data.superAdmin ? "Супер-администратор" : "Администратор"}</div>
                        </div>
                        <div onClick={() => {
                            dispatch(logout())
                            navigate("/login")
                        }} style={{cursor: "pointer"}}>
                            <Logout />
                        </div>
                    </div>
                    {admin.data.superAdmin && (
                        <button className={styles.settings} onClick={() => navigate("/settings-access")}>
                            <Settings />
                            Настройки доступа
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChooseModule;
