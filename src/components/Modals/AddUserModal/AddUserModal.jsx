import { useState, useEffect } from "react";
import s from "./AddUserModal.module.scss";
import Modal from "../../Modal/Modal";
import CheckBox from './CheckBox/CheckBox';
import { useSWRConfig } from "swr";
import { fetcher, url } from "../../../core/axios";
import { useSelector } from "react-redux";
import { Warning } from "../../Svgs/Svgs";

const AddUserModal = ({ isActive, setActive, admin }) => {
    const [fullName, setFullName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [comment, setComment] = useState("");
    const [mail, setMail] = useState(false);
    const [application, setApplication] = useState(false);
    const [company, setCompany] = useState(false);
    const [roles, setRoles] = useState(false);
    const [blocked, setBlocked] = useState(false)
    const { mutate } = useSWRConfig()
    const [isSuper, setSuper] = useState(false)
    const login = useSelector(state => state.admin.data.login)
    const [acts, setActs] = useState(false);
    const [requirements, setRequirements] = useState(false);
    const [creditors, setCreditors] = useState(false);

    useEffect(() => {
        if (admin === null) {
            setFullName('')
            setUsername('')
            setPassword('')
            setComment('')
            setMail(false)
            setApplication(false)
            setCompany(false)
            setRoles(false)
            setBlocked(false)
            setSuper(false)
            setActs(false)
            setRequirements(false)
            setCreditors(false)
        } else if (admin) {
            setFullName(admin.fio)
            setUsername(admin.login)
            setComment(admin.comment)
            setMail(admin.access.includes("Почта"))
            setApplication(admin.access.includes("Заявки"))
            setCompany(admin.access.includes("Компании"))
            setBlocked(true)
            setPassword(admin.passwordHash)
            setSuper(admin.superAdmin)
            setActs(admin.modulesAccess?.includes("Акты"))
            setRequirements(admin.modulesAccess?.includes("Требования"))
            setCreditors(admin.modulesAccess?.includes("Кредиторка"))
        }
    }, [admin])

    const handleCreate = async () => {
        if (!admin) {
            const bodyParams = {
                login: username, password: password, comment, access: [], superAdmin: isSuper, modulesAccess: []
            }
            if (isSuper) {
                bodyParams.access.push("Почта");
                bodyParams.access.push("Заявки");
                bodyParams.access.push("Компании");
                bodyParams.modulesAccess.push("Акты");
                bodyParams.modulesAccess.push("Требования");
                bodyParams.modulesAccess.push("Кредиторка");
            } else {
                if (mail) bodyParams.access.push("Почта");
                if (application) bodyParams.access.push("Заявки");
                if (company) bodyParams.access.push("Компании");
                if (acts) bodyParams.modulesAccess.push("Акты");
                if (requirements) bodyParams.modulesAccess.push("Требования");
                if (creditors) bodyParams.modulesAccess.push("Кредиторка");
            }
            await mutate(`${url}/admins`, fetcher(`${url}/admin/create`, {
                method: "POST",
                body: JSON.stringify(bodyParams)
            }))
            setFullName('')
            setUsername('')
            setPassword('')
            setComment('')
            setMail(false)
            setApplication(false)
            setCompany(false)
            setRoles(false)
            setBlocked(false)
            setActive()
            setSuper(false)
        } else {
            const bodyParams = {
                fio: fullName, login: username, comment, access: [], superAdmin: isSuper, modulesAccess: []
            }
            if (isSuper) {
                bodyParams.access.push("Почта");
                bodyParams.access.push("Заявки");
                bodyParams.access.push("Компании");
                bodyParams.modulesAccess.push("Акты");
                bodyParams.modulesAccess.push("Требования");
                bodyParams.modulesAccess.push("Кредиторка");
            } else {
                if (mail) bodyParams.access.push("Почта");
                if (application) bodyParams.access.push("Заявки");
                if (company) bodyParams.access.push("Компании");
                if (acts) bodyParams.modulesAccess.push("Акты");
                if (requirements) bodyParams.modulesAccess.push("Требования");
                if (creditors) bodyParams.modulesAccess.push("Кредиторка");
            }

            await mutate(`${url}/admins`, fetcher(`${url}/admin/${admin._id}`, {
                method: "PUT",
                body: JSON.stringify(bodyParams)
            }))
            setActive()
        }
    };

    return (
        <Modal
            isOpened={isActive}
            text={admin ? "Изменить пользователя" : "Добавить пользователя"}
            setOpen={setActive}
            long={true}
            icon={"plus"}
        >
            <div className={s.firstBlock}>
                <div className={s.doubleInputs}>
                    <div className={s.textareaDiv}>
                        <h2>
                            Логин <span>*</span>
                        </h2>
                        <input
                            disabled={blocked}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder={"username"}
                        />
                    </div>
                    <div className={s.textareaDiv}>
                        <h2>Пароль <span>*</span></h2>
                        <input
                            disabled={blocked}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder={"••••••••"}
                        />
                    </div>
                </div>
                {
                    admin && (
                        <div className={s.warning}>
                            <Warning />
                            <div className={s.wrapperWarning}>
                                <h2>Логин и пароль поменять не получится</h2>
                                <p>Чтобы их изменить, удалите пользователя в таблице и добавьте нового.</p>
                            </div>
                        </div>
                    )
                }
                <div className={s.textareaDiv}>
                    <h2>Комментарий </h2>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder={"например, Системный администратор"}
                    />
                </div>
                <div className={s.textareaDiv}>
                    {admin?.login !== login && !isSuper && (<h2>Доступ к модулям <span>*</span></h2>)}
                    {!isSuper && <div className={s.checkBoxes}>
                        <div 
                            className={`${s.checkBoxBlock} ${acts ? s.active : ''}`} 
                            onClick={() => setActs((value) => !value)}
                        >
                            <div className={s.topContainer}>
                                <h5>Акты</h5>
                                <CheckBox value={acts} />
                            </div>
                        </div>
                        <div 
                            className={`${s.checkBoxBlock} ${requirements ? s.active : ''}`} 
                            onClick={() => setRequirements((value) => !value)}
                        >
                            <div className={s.topContainer}>
                                <h5>Требования</h5>
                                <CheckBox value={requirements} />
                            </div>
                        </div>
                        <div 
                            className={`${s.checkBoxBlock} ${creditors ? s.active : ''}`} 
                            onClick={() => setCreditors((value) => !value)}
                        >
                            <div className={s.topContainer}>
                                <h5>Кредиторка</h5>
                                <CheckBox value={creditors} />
                            </div>
                        </div>
                    </div>}
                </div>
                <div className={s.textareaDiv}>
                    {admin?.login !== login && (<h2>Доступ к разделам <span>*</span></h2>)}
                    {!isSuper && <div className={s.checkBoxes}>
                        <div className={`${s.checkBoxBlock} ${mail ? s.active : ''}`} onClick={() => setMail((value) => !value)}>
                            <div className={s.topContainer}>
                                <h5>Почта</h5>
                                <CheckBox value={mail} />
                            </div>
                        </div>
                        <div className={`${s.checkBoxBlock} ${application ? s.active : ''}`} onClick={() => setApplication((value) => !value)}>
                            <div className={s.topContainer}>
                                <h5>Заявки</h5>
                                <CheckBox value={application} />
                            </div>
                        </div>
                        <div className={`${s.checkBoxBlock} ${company ? s.active : ''}`} onClick={() => setCompany((value) => !value)}>
                            <div className={s.topContainer}>
                                <h5>Компании</h5>
                                <CheckBox value={company} />
                            </div>
                        </div>
                    </div>}
                    {
                        admin?.login !== login && (
                            <div onClick={() => setSuper((value) => !value)} className={s.superAdminBlock}>
                                <div className={s.checkBOxic}><CheckBox value={isSuper} /></div>
                                <div className={s.rightDiv}>
                                    <h5>Сделать суперадмином</h5>
                                    <p>У суперадмина есть доступ ко всем разделам панели, и к возможности добавлять и изменять новых пользователей.</p>
                                </div>
                            </div>
                        )
                    }
                </div>
                <div className={s.btns}>
                    <button className={s.whiteBtn} onClick={() => setActive(false)}>Отмена</button>
                    <button className={s.blueBtn} onClick={handleCreate}>{admin ? "Изменить" : "Создать"}</button>
                </div>
            </div>
        </Modal>
    );
};

export default AddUserModal;
