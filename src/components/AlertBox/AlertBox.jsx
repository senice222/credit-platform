import styles from "../../pages/DetailedApplication/DetailedApplication.module.scss"
import { Alert } from "../../pages/DetailedApplication/Svgs";

const AlertBox = ({ dateAnswer }) => {
  return (
    <div className={styles.alertBox}>
      <Alert />
      <div>
        {dateAnswer ? (
          <>
            <h3>Клиент знает срок рассмотрения заявки</h3>
            <p>Срок ответа установлен до {dateAnswer}</p>
          </>
        ) : (
          <>
            <h3>Клиент пока не знает срок рассмотрения заявки</h3>
            <p>
              Установите срок ответа ниже, чтобы передать заявку на
              рассмотрение.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default AlertBox;
