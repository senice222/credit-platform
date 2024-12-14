import { url } from '../../core/axios';
import Clarifications from '../../pages/DetailedApplication/Clarification/Clarification';
import styles from '../../pages/DetailedApplication/DetailedApplication.module.scss';
import HighlightedText from '../../pages/DetailedApplication/HighlightedText/HighlightedText';
import { Document } from '../../pages/DetailedApplication/Svgs';

const HistoryLog = ({ data }) => {
  const renderDocuments = (documents) => {
    if (!documents || documents.length === 0) return null;

    return (
      <div className={styles.fileList} style={{ marginLeft: "15px", marginTop: "10px" }}>
        {documents.map((fileUrl, fileIndex) => (
          <div key={fileIndex} className={styles.fileItem}>
            <a href={`${url}/uploads/${fileUrl}`} download>
              <Document />
              <div className={styles.fileName}>{fileUrl}</div>
            </a>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={styles.logs}>
      {data?.history?.map((item, index) => (
        <div key={index} className={styles.right}>
          <div className={item.type ? styles.questionRight : ''}>
            {item.admin && (
              <div style={{width: "40%"}}>
                <p style={{ marginTop: "10px", color: "#344054" }}>
                  {item.admin}
                </p>
              </div>
            )}
            <div
              className={
                item.status
                  ? styles.statusStyle
                  : item.type
                    ? styles.questionText
                    : styles.log
              }
            >
              {item.status === "answer" ? (
                item.combinedClarifications && (
                  <Clarifications clarificationsAnswer={item.combinedClarifications} />
                )
              ) : (
                <HighlightedText text={item.label} />
              )}
            </div>
            {item.clarifications && renderDocuments(item.clarifications)}
            {item.files?.buyer?.length > 0 && renderDocuments(item.files.buyer)}
            {item.files?.seller?.length > 0 && renderDocuments(item.files.seller)}
            {item.fileUrls && renderDocuments(item.fileUrls)}
          </div>
        </div>
      )) || <p>loading..</p>}
    </div>
  );
};

export default HistoryLog;
