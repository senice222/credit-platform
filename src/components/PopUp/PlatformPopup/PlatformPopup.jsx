import {useState} from 'react';
import styles from './PlatformPopup.module.scss';
import {ActsFolder, CreditFolder, RequirementsFolder} from "../../Modal/Svgs.jsx";
import {ChevronIcon} from "../../Svgs/Svgs.jsx";
import { ActsUrl, requirementsUrl } from '../../../urls.jsx';
import { useSelector } from 'react-redux';
import axios from '../../../core/axios.js'
import { useNavigate } from 'react-router-dom';

function PlatformPopup() {
    const [isOpen, setIsOpen] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [activeModule, setActiveModule] = useState('Кредиторка');
    const admin = useSelector((state) => state.admin);
    const navigate = useNavigate()

    const openMenu = () => {
        setIsAnimating(false);
        setIsOpen(true);
    };

    const closeMenu = () => {
        setIsAnimating(true);
        setTimeout(() => setIsOpen(false), 300);
    };

    const handleModuleChange = (module) => {
        setActiveModule(module);
        if (module === 'Требования') {
            handleChooseModule(requirementsUrl)
        } else if (module === 'Акты') {
            handleChooseModule(ActsUrl)
        }
        closeMenu();
    };

    const handleChooseModule = async (url) => {
        const {data} = await axios.post('admin/generateTransferKey', {adminId: admin.data._id})
        window.location.href = `${url}/login/${data.transferKey}`
    }
    return (
        <div className={styles.popupContainer}>
            <div className={styles.platformDiv} onClick={() => (isOpen ? closeMenu() : openMenu())}>
                <div>
                    <CreditFolder/>
                    <p>Кредиторка</p>
                </div>
                <ChevronIcon/>
            </div>
            {(isOpen || isAnimating) && (
                <div className={`${styles.popupMenu} ${isAnimating ? styles.closing : ''}  ${isOpen ? styles.open : ''}`}>
                    {admin.data.modulesAccess.includes('Акты') || admin.data.superAdmin && <div
                        className={`${styles.popupMenuItem} ${activeModule === 'Акты' ? styles.active : ''}`}
                        onClick={() => handleModuleChange('Акты')}
                    >
                        <div className={styles.wrapper}>
                            <div className={styles.icon}><ActsFolder /></div>
                            <span>Акты</span>
                        </div>
                        <div className={`${activeModule === 'Акты' ? styles.circle : styles.defaultCircle} `}>
                            <div className={styles.activeCircle} />
                        </div>
                    </div>}
                    {admin.data.modulesAccess.includes('Требования') || admin.data.superAdmin && <div
                        className={`${styles.popupMenuItem} ${activeModule === 'Требования' ? styles.active : ''}`}
                        onClick={() => handleModuleChange('Требования')}
                    >
                        <div className={styles.wrapper}>
                            <div className={styles.icon}><RequirementsFolder /></div>
                            <span>Требования</span>
                        </div>
                        <div className={`${activeModule === 'Требования' ? styles.circle : styles.defaultCircle} `}>
                            <div className={styles.activeCircle} />
                        </div>
                    </div>}
                    {admin.data.modulesAccess.includes('Кредиторка') || admin.data.superAdmin && <div
                        className={`${styles.popupMenuItem} ${activeModule === 'Кредиторка' ? styles.active : ''}`}
                        onClick={() => handleModuleChange('Кредиторка')}
                    >
                        <div className={styles.wrapper}>
                            <div className={styles.icon}><CreditFolder /></div>
                            <span>Кредиторка</span>
                        </div>
                        <div className={`${activeModule === 'Кредиторка' ? styles.circle : styles.defaultCircle} `}>
                            <div className={styles.activeCircle} />
                        </div>
                    </div>}
                    <div className={styles.settings} onClick={() => navigate("/settings-access")}>
                        <div className={styles.settingsIcon}>⚙️</div>
                        <span>Настройки доступа</span>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PlatformPopup;
