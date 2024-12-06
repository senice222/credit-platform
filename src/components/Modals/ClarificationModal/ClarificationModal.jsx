import { useState } from 'react';
import s from './ClarificationModal.module.scss'
import Modal from '../../Modal/Modal'
import UploadButton from '../../../pages/DetailedApplication/UploadButton/UploadButton'
import { useSWRConfig } from 'swr';
import { fetcher, url } from '../../../core/axios';
import PropTypes from 'prop-types';
import { notification } from 'antd';
import { useSelector } from 'react-redux'

const ClarificationModal = ({ data, isOpen, setOpen }) => {
  const { mutate } = useSWRConfig()
  const [comments, setComments] = useState('')
  const [uploads, setUploads] = useState([])
  const login = useSelector(state => state.admin.data.login)

  const handleClarification = async () => {
    const formData = new FormData()
    formData.append('_id', data._id)
    formData.append('text', comments)
    formData.append('admin', login)
    uploads.forEach((file) => formData.append('files', file.file))

    try {
      await mutate(`${url}/application/detailed/${data._id}`, fetcher(`${url}/application/get-clarifications/${data.owner}`, {
        method: 'POST',
        body: formData
      }))
      notification.success({
        message: "Заявка успешно отправлена на уточнение",
        duration: 1.5,
        style: { fontFamily: "Inter" }
      })
      setOpen(false)
    } catch (e) {
      console.log(e)
    }
  }
  const isButtonDisabled = !(uploads.length > 0 && uploads.some(upload => upload.uploaded)) && comments.trim() === '';
  return (
    <Modal isOpened={isOpen} height={"auto"} setOpen={setOpen} long={true}>
      <h2>Передать заявку на уточнение</h2>
      <p>Клиенту будет предложено дополнить заявку - текстом и файлами.</p>
      <div className={s.firstBlock}>
        <UploadButton uploads={uploads} setUploads={setUploads} />
        <div className={s.textareaDiv}>
          <h2>Комментарий <span>*</span></h2>
          <textarea maxLength={4096} value={comments} onChange={(e) => setComments(e.target.value)} placeholder={"Введите описание"} />
        </div>
        <div className={s.btns}>
          <button className={s.whiteBtn} onClick={() => setOpen(false)}>Закрыть</button>
          <button
            className={s.blueBtn}
            onClick={handleClarification}
            disabled={isButtonDisabled}
          >
            Передать на уточнение
          </button>
        </div>
      </div>
    </Modal>
  )
}

ClarificationModal.propTypes = {
  data: PropTypes.object,
  isOpen: PropTypes.boolean,
  setOpen: PropTypes.func
};


export default ClarificationModal