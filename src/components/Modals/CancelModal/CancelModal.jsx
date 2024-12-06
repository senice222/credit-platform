import { useState } from 'react';
import Modal from '../../Modal/Modal'
import s from './CancelModal.module.scss'
import PropTypes from 'prop-types';
import { useSWRConfig } from 'swr';
import { fetcher, url } from '../../../core/axios';
import { notification } from 'antd';

const CancelModal = ({ id, productId, isOpened, setOpened }) => {
  const [comments, setComments] = useState('')
  const { mutate } = useSWRConfig()

  const closeApplication = () => {
    mutate(`${url}/application/detailed/${productId}`, fetcher(`${url}/application/close-status/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        _id: productId,
        comments,
        status: "На уточнение"
      }),
    }))
    notification.success({
      message: "Заявка успешно отклонена",
      duration: 1.5,
      style: {fontFamily: "Inter"}
    })
    setComments('')
    setOpened(false)
  }

  return (
    <Modal isOpened={isOpened} setOpen={setOpened}>
      <h2>Отмена заявки</h2>
      <p>Укажите причину отмены заявки</p>
      <div className={s.firstBlock}>
        <div className={s.textareaDiv}>
          <h2>Комментарий <span>*</span></h2>
          <textarea maxLength={4096} value={comments} onChange={(e) => setComments(e.target.value)} placeholder={"Введите причину"} />
        </div>
        <div className={s.btns}>
          <button className={s.whiteBtn} onClick={() => setOpened(false)}>Закрыть</button>
          <button className={s.blueBtn} onClick={closeApplication}>Отменить заявку</button>
        </div>
      </div>
    </Modal>
  )
}

CancelModal.propTypes = {
  id: PropTypes.string,
  productId: PropTypes.string,
  isOpened: PropTypes.boolean,
  setOpened: PropTypes.func
};

export default CancelModal