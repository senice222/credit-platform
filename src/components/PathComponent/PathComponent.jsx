import styles from "./PathComponent.module.scss";
import { ArrowBack } from "../../pages/DetailedApplication/Svgs.jsx";
import { useNavigate } from "react-router-dom";
const PathComponent = ({ first, second, path }) => {
    const navigate = useNavigate()
    return (
        <>
            <div className={styles.responsiveBack}>
                <ArrowBack /> <h3 onClick={() => navigate('/')}>Back</h3>
            </div>
            <div className={styles.PathComponent}>
                <div className={styles.firstItem} onClick={() => navigate(path)}>{first}</div>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={6}
                    height={10}
                    viewBox="0 0 6 10"
                    fill="none"
                >
                    <path
                        d="M1 9L5 5L1 1"
                        stroke="#D0D5DD"
                        strokeWidth="1.33333"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>

                <div className={styles.secondItem}>{second}</div>
            </div>
        </>

    );
};

export default PathComponent;
