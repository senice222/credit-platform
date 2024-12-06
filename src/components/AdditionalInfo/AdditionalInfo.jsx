import styles from '../../pages/DetailedApplication/DetailedApplication.module.scss';

const AdditionalInfo = ({ data }) => {
  const additionalFiles = data.fileExplain?.filter(item => !item.startsWith('https')) || [];

  return additionalFiles.length > 0 ? (
    <div className={styles.item}>
      <div className={styles.log}>
        <h3>Дополнительная информация:</h3>
      </div>
      {additionalFiles.map((item, i) => (
        <div key={i} className={styles.document}>
          <p className={styles.actName}>{item}</p>
        </div>
      ))}
    </div>
  ) : null;
};

export default AdditionalInfo;
