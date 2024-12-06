import {useState, useEffect} from "react";
import styles from "./Login.module.scss";
import PopUp from "../../components/PopUp/PopUp";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {fetchAuth, fetchAuthMe} from "../../store/slices/Admin.slice";

const Login = () => {
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [visible, setVisible] = useState(false);
    const [text, setText] = useState({text: "", title: ""});
    const handleLoginChange = (e) => setLogin(e.target.value);
    const handlePasswordChange = (e) => setPassword(e.target.value);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false)
    const admin = useSelector((state) => state.admin);

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            if (login && password) {
                dispatch(fetchAuth({login, password}))
            }
        } catch (error) {
            console.error("Ошибка авторизации:", error)
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        const token = localStorage.getItem('token')
        if (token) {
            dispatch(fetchAuthMe())
        }
    }, [])

    useEffect(() => {
        if (admin.error) {
            setText({
                text: "Проверьте введённые данные или обратитесь к администратору",
                title: "Неверный логин или пароль",
            });
            setVisible(true);
        }
        if (admin.data) {
            navigate('/module')
        }
    }, [admin, navigate]);

    return (
        <>
            <PopUp
                visible={visible}
                setVisible={setVisible}
                message={text?.text}
                title={text?.title}
                duration={5000}
            />
            <div className={styles.wrapper}>
                <div className={styles.div}>
                    <h2>Вход в панель</h2>
                    <div className={styles.loginContainer}>
                        <form onSubmit={handleSubmit}>
                            <div className={styles.inputGroup}>
                                <label htmlFor="login">Логин</label>
                                <input
                                    type="text"
                                    id="login"
                                    placeholder="Введите логин"
                                    value={login}
                                    onChange={handleLoginChange}
                                    className={styles.input}
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label htmlFor="password">Пароль</label>
                                <input
                                    type="password"
                                    id="password"
                                    placeholder="Введите пароль"
                                    value={password}
                                    onChange={handlePasswordChange}
                                    className={styles.input}
                                />
                            </div>
                            <button type="submit" className={styles.submitButton}>
                                {/* {loading ? (
                <ClipLoader size={20} color={'#ffffff'} loading={true} />
              ) : ( */}
                                Войти
                                {/* )} */}
                            </button>
                        </form>
                    </div>
                    <p className={styles.note}>
                        Для получения доступа к панели получите данные для входа у администрации.
                    </p>
                </div>
            </div>
        </>
    );
};

export default Login;
