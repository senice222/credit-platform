import s from './NotAllower.module.scss'
import {useNavigate} from 'react-router-dom'
export const NotAllowed = () => {
    const navigate = useNavigate()
    return (
        <div className={s.NotAllowed}>
            <h2>У вас нет доступа к этому разделу</h2>
            <p>Чтобы получить доступ, запросите его у администрации</p>
            <button onClick={() => navigate('/')}>Вернуться назад</button>
        </div>
    )
}