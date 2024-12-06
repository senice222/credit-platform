import { Dropdown, Space } from "antd";
import styles from '../../pages/DetailedApplication/DetailedApplication.module.scss'
import { Dots } from "../../pages/DetailedApplication/Svgs";
import { Trash } from "../Svgs/Svgs";

const TopActions = ({ normalId, status, handleDelete }) => {
    const items = [
        {
            key: "2",
            label: (
                <div className={styles.deleteDiv}>
                    <div className={styles.textDiv}>
                        <p className={styles.text}>Действия с заявкой</p>
                    </div>
                    <p onClick={handleDelete} className={styles.delete}>
                        <Trash />
                        Удалить заявку
                    </p>
                </div>
            ),
        },
    ];

    return (
        <div className={styles.topContainer}>
            <h1>Заявка №{normalId}</h1>
            {/* <div className={styles.select}>
                <Dropdown
                    className={styles.customDropdown}
                    menu={{
                        items,
                    }}
                >
                    <a onClick={(e) => e.preventDefault()}>
                        <Space>
                            {(status === "Рассмотрена" || status === "Отклонена") && (
                                <div className={styles.dots}>
                                    <Dots />
                                </div>
                            )}
                        </Space>
                    </a>
                </Dropdown>
            </div> */}
        </div>
    );
};


export default TopActions