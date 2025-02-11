import { useSWRConfig } from "swr";
import Modal from "../../Modal/Modal";
import s from "./AddClient.module.scss";
import { fetcher, url } from "../../../core/axios";
import { notification } from "antd";
import { useNavigate } from "react-router-dom";
import PropTypes from 'prop-types'

export const AddClient = ({ isOpened, setOpened }) => {

    return (
        <Modal isOpened={isOpened} setOpen={setOpened} icon={"plus"} text="Зарегистрировать клиента">
            <p style={{ marginBottom: "5px" }}>Имя клиента</p>
            <input
                type="search"
                placeholder="Например, Евгений"
                className={s.searchInput}
            />
            <p style={{ marginTop: "5px" }}>Отображается только у вас</p>
            <div className={s.btns}>
                <button className={s.whiteBtn} onClick={() => setOpen(false)}>
                    Отмена
                </button>
                <button className={s.blueBtn}>
                    Зарегистрировать
                </button>
            </div>
        </Modal>
    );
};
AddClient.propTypes = {
    isOpen: PropTypes.bool,
    setOpen: PropTypes.func
}