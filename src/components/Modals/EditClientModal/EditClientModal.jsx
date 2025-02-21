import { useState, useEffect } from "react";
import s from "./EditClientModal.module.scss";
import Modal from "../../Modal/Modal";
import { useSWRConfig } from "swr";
import { notification } from "antd";
import { fetcher, url } from "../../../core/axios";

const EditClientModal = ({ isActive, setActive, id }) => {
    const { mutate } = useSWRConfig()
    const [value, setValue] = useState('')
    const handleUpdate = async () => {
        try { // admin/client/:id/name
            await mutate(`${url}/admin/client/${id}`, fetcher(`${url}/admin/client/${id}/name`, {
                method: 'PUT',
                body: JSON.stringify({
                    name: value
                }),
            }))
            notification.success({
                message: "Вы успешно отредактировали имя клиента.",
                duration: 2,
                style: { fontFamily: "Inter" }
            })
            setActive()
        } catch (e) {
            console.log(e)
        }
    }
    return (
        <Modal
            isOpened={isActive}
            text={"Редактировать имя клиента"}
            setOpen={setActive}
            icon={"plus"}
            height={true}
        >
            <div className={s.firstBlock}>
                <p className={s.font}>Имя клиента</p>
                <input value={value} onChange={(e) => setValue(e.target.value)} placeholder="Например, Евгений" />
                <p className={s.font}>Отображается только у вас</p>
            </div>
            <div className={s.secondBlock}>
                <button className={s.white} onClick={setActive}>Отменить</button>
                <button className={s.green} onClick={handleUpdate}>Сохранить</button>
            </div>
        </Modal>
    );
};

export default EditClientModal;
