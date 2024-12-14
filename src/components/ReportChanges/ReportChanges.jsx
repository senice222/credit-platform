import AdditionalInfo from '../AdditionalInfo/AdditionalInfo';
// import ExplanationInfo from '../ExplanationInfo/ExplanationInfo';
import HistoryLog from '../HistoryLog/HistoryLog';
import StatusNotification from '../StatusNotification/StatusNotification';
import style from './ReportChanges.module.scss'

const ReportChanges = ({ data, filesObj }) => {
  return (
    <div className={style.reportContainer}>
      <h2 className={style.h2}>Изменения по заявке</h2>
      {/* <ActInfo data={data} filesObj={filesObj} /> */}
      {/* <ExplanationInfo data={data} filesObj={filesObj} /> */}
      <AdditionalInfo data={data} />
      <HistoryLog data={data} />
      <StatusNotification data={data} />
    </div>
  );
};

export default ReportChanges;
