import { useSWRConfig } from "swr";
import Modal from "../../Modal/Modal";
import s from "./DeleteApplication.module.scss";
import { fetcher, url } from "../../../core/axios";
import { notification } from "antd";
import { useNavigate } from "react-router-dom";
import PropTypes from 'prop-types'

export const DeleteApplication = ({ data, isOpen, setOpen }) => {
    const {mutate} = useSWRConfig()
    const navigate = useNavigate()
    const handleDelete = () => {
        try {
            mutate(`${url}/application/getAll`, fetcher(`${url}/application/delete/${data.owner}`, {
                method: "DELETE",
                body: JSON.stringify({
                    _id: data._id
                })
            }))
            notification.success({
                message: "Заявка успешно удалена",
                duration: 1.5,
                style: { fontFamily: "Inter" }
            })
            navigate('/all-applications')
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <Modal isOpened={isOpen} setOpen={setOpen} icon={"delete"}>
            <h2>Вы уверены, что хотите удалить заявку?</h2>
            <p>
                Это действие удалит заявку из панели и в том числе у клиента в боте.
                После нажатия кнопки “Удалить” его нельзя будет отменить.
            </p>
            <div className={s.btns}>
                <button className={s.whiteBtn} onClick={() => setOpen(false)}>
                    Отмена
                </button>
                <button className={s.blueBtn} onClick={handleDelete}>
                    Удалить
                </button>
            </div>
        </Modal>
    );
};
DeleteApplication.propTypes = {
    data: PropTypes.object,
    isOpen: PropTypes.bool,
    setOpen: PropTypes.func
}