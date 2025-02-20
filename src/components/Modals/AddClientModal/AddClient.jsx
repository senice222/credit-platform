import { useState } from "react";
import { useSWRConfig } from "swr";
import Modal from "../../Modal/Modal";
import s from "./AddClient.module.scss";
import { fetcher, url } from "../../../core/axios";
import { notification } from "antd";
import PropTypes from 'prop-types'

export const AddClient = ({ isOpened, setOpened }) => {
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [successModal, setSuccessModal] = useState(false);
    const [verificationLink, setVerificationLink] = useState("");
    const { mutate } = useSWRConfig();

    const handleSubmit = async () => {
        if (!name.trim()) {
            notification.error({
                message: "Ошибка",
                description: "Введите имя клиента"
            });
            return;
        }

        setLoading(true);
        try {
            const response = await fetcher(`${url}/admin/createClient`, {
                method: 'POST',
                body: JSON.stringify({ name })
            });

            // Формируем ссылку для верификации
            const botLink = `https://t.me/test182828_bot?start=${response.verificationCode}`;
            setVerificationLink(botLink);
            
            mutate(`${url}/admin/getClients`);
            setOpened(false);
            setSuccessModal(true); // Показываем модальное окно успеха
        } catch (error) {
            notification.error({
                message: "Ошибка",
                description: error.message || "Не удалось зарегистрировать клиента"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(verificationLink);
        notification.success({
            message: "Успешно",
            description: "Ссылка скопирована в буфер обмена"
        });
    };

    if (successModal) {
        return (
            <Modal isOpened={successModal} setOpen={() => setSuccessModal(false)} icon={"check"} text={`Клиент ${name} зарегистрирован!`}>
                <div className={s.successContent}>
                    <p>Ссылка для входа на платформу</p>
                    <div className={s.linkContainer}>
                        <input 
                            type="text" 
                            value={verificationLink}
                            readOnly
                            className={s.linkInput}
                        />
                        <button onClick={handleCopy} className={s.copyButton}>
                            Скопировать
                        </button>
                    </div>
                    <p className={s.hint}>Передайте ему ссылку на платформу и данные для входа</p>
                    <button onClick={() => setSuccessModal(false)} className={s.closeButton}>
                        Закрыть
                    </button>
                </div>
            </Modal>
        );
    }

    return (
        <Modal isOpened={isOpened} setOpen={setOpened} icon={"plus"} text="Зарегистрировать клиента">
            <p style={{ marginBottom: "5px" }}>Имя клиента</p>
            <input
                type="text"
                placeholder="Например, Евгений"
                className={s.searchInput}
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <p style={{ marginTop: "5px" }}>Отображается только у вас</p>
            <div className={s.btns}>
                <button className={s.whiteBtn} onClick={() => setOpened(false)}>
                    Отмена
                </button>
                <button className={s.blueBtn} onClick={handleSubmit} disabled={loading}>
                    {loading ? "Загрузка..." : "Зарегистрировать"}
                </button>
            </div>
        </Modal>
    );
};

AddClient.propTypes = {
    isOpened: PropTypes.bool,
    setOpened: PropTypes.func
}