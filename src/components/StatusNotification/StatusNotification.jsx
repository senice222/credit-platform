import styles from '../../pages/DetailedApplication/DetailedApplication.module.scss';
import notific from "../../assets/Screenshot_3.png";

const StatusNotification = ({ data }) => {
  if (data.status === "На уточнении") {
    return (
      <div className={styles.closedDivText}>
        <img src={notific} alt="/" />
        <p>Уточнения появятся здесь</p>
      </div>
    );
  }

  if (data.status === "Отклонена" || data.status === "Рассмотрена") {
    return (
      <div className={styles.closedDivText}>
        <img src={notific} alt="/" />
        <p>Заявка закрыта</p>
      </div>
    );
  }

  return null;
};

export default StatusNotification;
