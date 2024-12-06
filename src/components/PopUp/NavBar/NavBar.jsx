import { useState } from "react";
import styles from "./NavBar.module.scss";
import { DocumentSvg, Building, Mail, Arrow } from "./Svgs";
import { useNavigate } from "react-router-dom";
import settings from "../../../assets/settings-01.png";
import user from "../../../assets/user-01.png";
import logout1 from "../../../assets/log-out-01.png";
import {CreditFolder, Cross} from '../../../components/Modal/Svgs'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../../../store/slices/Admin.slice'
import Loader from "../../Loader/Loader";
import {ChevronIcon} from "../../Svgs/Svgs.jsx";
import PlatformPopup from "../PlatformPopup/PlatformPopup.jsx";

const NavBarItem = ({ Svg, text, path, setActive }) => {
  const navigate = useNavigate();
  return (
    <div className={styles.item} onClick={() => {
      navigate(path)
      setActive(false)
    }}>
      {Svg}
      <h2>{text}</h2>
    </div>
  );
};
const NavBarItemOpenAble = ({ Svg, text, setActive }) => {
  const [opened, setOpened] = useState(false);
  const navigate = useNavigate();

  return (
    <div className={`${styles.item2} ${opened ? styles.active : ""}`}>
      <div className={styles.topDiv} onClick={() => setOpened((prev) => !prev)}>
        <div className={styles.svgWithText}>
          <Mail />
          <h2>Почта</h2>
        </div>
        <Arrow />
      </div>
      <div className={styles.subCategories}>
        <div className={styles.sub} onClick={() => {
          navigate("/")
          setActive(false)
        }}>
          <p>Активные</p>
          <div className={styles.badge}>1</div>
        </div>
        <div className={styles.sub} onClick={() => {
          navigate("/finished")
          setActive(false)
        }}>
          <p>Завершённые</p>
        </div>
      </div>
    </div>
  );
};
const NavBar = ({ isActive, setActive }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const admin = useSelector((state) => state.admin.data);
  if (!admin) return <Loader />

  return (
    <div
      className={`${styles.navBarWrapper} ${isActive ? styles.activeBg : ""}`}
    >
      <div className={`${styles.NavBar} ${isActive ? styles.active2 : ""}`}>
        <div>
          <PlatformPopup />
          <div className={styles.items}>

            {admin.access.includes('Заявки') && <NavBarItemOpenAble setActive={setActive} />}
            {admin.access.includes('Заявки') && <NavBarItem
              setActive={setActive}
              Svg={<DocumentSvg />}
              text={"Заявки"}
              path="/all-applications"
            />}
            {admin.access.includes('Компании') && <NavBarItem
              setActive={setActive}
              Svg={<Building />}
              text={"Компании"}
              path="/companies"
            />}
          </div>
        </div>
        <div className={styles.settings}>
          {admin.superAdmin && <div
            className={styles.itemSettings}
            onClick={() => {
              navigate("/settings")
              setActive(false)
            }}
          >
            <img src={settings} alt={"/"} />
            <p className={styles.settingsText}>Настройки</p>
          </div>}

          <div className={styles.admin}>
            <div className={styles.circle}>
              <img src={user} alt="/" />
            </div>
            <div className={styles.info}>
              <div>
                <h2>{admin.login}</h2>
                <p>{admin.superAdmin ? "Суперадмин" : "Админ"}</p>
              </div>
              <img onClick={() => {
                dispatch(logout())
                navigate("/login")
              }} src={logout1} alt={"/"} />
            </div>
          </div>
        </div>
      </div>
      {isActive && <div onClick={() => setActive(false)} className={styles.cross}><Cross /></div>}
    </div>
  );
};

export default NavBar;
