import {useEffect} from "react";
import styles from './ChooseModule.module.scss'
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {fetchAuthMe} from "../../store/slices/Admin.slice";
import Loader from "../../components/Loader/Loader";
import useAccessControl from "../../hooks/useAccessControl";
import ModuleCard from "../../components/ModuleCard/ModuleCard.jsx";
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

    if (admin.loading) {
        return <Loader/>;
    }

    return (
        <div className={styles.wrapper}>
            <h1 className={styles.title}>Выберите модуль</h1>
            <div className={styles.modulesWrapp}>
                <div className={styles.modules}>
                    <ModuleCard icon={<ActsFolder/>} url={"https://consultantnlgpanel.ru/login"} title="Акты"/>
                    <ModuleCard icon={<RequirementsFolder/>} url={"https://orders.consultantnlgpanel.ru/login"} title="Требования"/>
                    <ModuleCard icon={<CreditFolder/>} url={"/"} title="Кредиторка"/>
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
                        <div style={{cursor: "pointer"}}>
                            <Logout />
                        </div>
                    </div>
                    <button className={styles.settings} onClick={() => navigate("/settings-access")}>
                        <Settings />
                        Настройки доступа
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChooseModule;
