import { useSWRConfig } from "swr";
import Modal from "../../Modal/Modal";
import s from "./BlockUser.module.scss";
import { fetcher, url } from "../../../core/axios";
import { notification } from "antd";
import { useNavigate } from "react-router-dom";
import PropTypes from 'prop-types'

export const BlockUser = ({ data, isOpen, setOpen, isUserBlocked }) => {
    const { mutate } = useSWRConfig()
    const navigate = useNavigate()
    const handleDelete = async () => {
        try {
            await mutate(`${url}/admin/client/${data._id}`, fetcher(isUserBlocked ? `${url}/admin/unblockClient/${data._id}` : `${url}/admin/blockClient/${data._id}`, {
                method: 'POST',
            }))
            notification.success({
                message: `Пользователь успешно ${isUserBlocked ? "разблокирован" : "заблокирован"}`,
                duration: 1.5,
                style: { fontFamily: "Inter" }
            })
            setOpen()
        } catch (e) {
            console.log(e)
        }
    }
    console.log(isUserBlocked)
    return (
        <Modal isOpened={isOpen} setOpen={setOpen} icon={!isUserBlocked && "delete"} width={"400px"}>
            <h2>{isUserBlocked ? "Разблокировать" : "Заблокировать"} клиента Евгений?</h2>
            <p>
                Он {isUserBlocked ? "получит" : "потеряет"} доступ к боту. {!isUserBlocked && "Вы сможете разблокировать его позже."}
            </p>
            <div className={s.btns}>
                <button className={s.whiteBtn} onClick={() => setOpen(false)}>
                    Отмена
                </button>
                <button className={!isUserBlocked ? s.blueBtn : s.green} onClick={handleDelete}>
                    {isUserBlocked ? "Разблокировать" : "Заблокировать"}
                </button>
            </div>
        </Modal>
    );
};
BlockUser.propTypes = {
    data: PropTypes.object,
    isOpen: PropTypes.bool,
    setOpen: PropTypes.func
}