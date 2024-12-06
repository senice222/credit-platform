import styles from './DetailedApplication.module.scss'
import PathComponent from '../../components/PathComponent/PathComponent'
import AlertBox from '../../components/AlertBox/AlertBox'
import TopActions from '../../components/TopActions/TopActions'
import ApplicationDetails from '../../components/ApplicationDetails/ApplicationDetails'
import moment from 'moment'
import useSWR, { useSWRConfig } from 'swr'
import { notification } from 'antd'
import $api, { fetcher, url } from '../../core/axios'
import { useParams } from 'react-router-dom'
import ResponseForm from '../../components/ResponseForm/ResponseForm'
import { useState } from 'react'
import { useSelector } from "react-redux";
import ReportChanges from '../../components/ReportChanges/ReportChanges'
import { Docs, Pdf } from './Svgs'
import ClarificationModal from '../../components/Modals/ClarificationModal/ClarificationModal'

const DetailedApplication = () => {
  const { id } = useParams();
  const { data } = useSWR(`${url}/application/detailed/${id}`, fetcher);
  const { mutate } = useSWRConfig();
  const [comments, setComments] = useState("");
  const [isOpened, setOpened] = useState(false);
  const [isCancel, setCancel] = useState(false);
  const [uploads, setUploads] = useState([]);
  const [explanationFiles, setExplanationFiles] = useState([]);
  const admin = useSelector((state) => state.admin.data);
  const [loading, setLoading] = useState(false);


  const handleAnswer = async () => {
    const formData = new FormData();
    formData.append("_id", data._id);
    formData.append("comments", comments);
    formData.append("admin", admin.login);
    formData.append("status", "Рассмотрена");

    // Add buyer documents
    uploads.forEach((file) => {
      formData.append("buyerFiles", file.file);
    });

    // Add seller documents
    explanationFiles.forEach((file) => {
      formData.append("sellerFiles", file.file);
    });

    try {
      setLoading(true)
      await $api.put(`/application/reviewed/${data.owner}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      mutate(`${url}/application/detailed/${id}`);
      notification.success({
        message: "Заявка успешно рассмотрена",
        duration: 1.5,
        style: { fontFamily: "Inter" },
      });
      setLoading(false)
    } catch (e) {
      console.error("Upload failed:", e);
      notification.error({
        message: "Ошибка при отправке заявки",
        description: e.message,
      });
    }
  };

  const dateOnChange = async (date, id, _id) => {
    try {
      await mutate(`${url}/application/getAll`, fetcher(`${url}/application/set-date/${id}`, {
        method: 'POST',
        body: JSON.stringify({
          _id,
          date: date.toISOString(),
        }),
      }))
      notification.success({
        message: "Дата ответа успешно установлена",
        duration: 2,
      })
    } catch (e) {
      console.log(e)
    }
  };

  const filesObj = {
    ".pdf": <Pdf />,
    ".docx": <Docs />,
  };

  if (!data) return null;

  return (
    <>
      <ClarificationModal data={data} isOpen={isCancel} setOpen={() => setCancel(false)} />
      <div className={styles.DetailedApplication}>
        <PathComponent
          first="Активные заявки"
          second={`Заявка №${data.normalId}`}
          path="/"
        />

        <TopActions
          normalId={data.normalId}
          status={data.status}
          handleDelete={() => {/* handle delete logic */ }}
        />

        <div className={styles.infoContainer}>
          <h2>Информация о заявке</h2>
        </div>

        <AlertBox dateAnswer={data.dateAnswer} />

        {/* <CompanyInfo 
        data={data}
        dateOnChange={dateOnChange}
        disabledDate={disabledDate}
      /> */}

        <ApplicationDetails data={data} />

        <ResponseForm
          data={data}
          setOpened={setOpened}
          setCancel={setCancel}
          uploads={uploads}
          setUploads={setUploads}
          explanationFiles={explanationFiles}
          setExplanationFiles={setExplanationFiles}
          comments={comments}
          setComments={setComments}
          handleAnswer={handleAnswer}
          loading={loading}
        />
        <ReportChanges data={data} filesObj={filesObj} />
      </div>
    </>
  )
}

export default DetailedApplication