import s from './CheckBox.module.scss'

const CheckBox = ({value}) => {

    return (
        <div className={`${s.checkBox} ${value ? s.active : ''}`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="8" viewBox="0 0 10 8" fill="none">
                <path d="M9 1L3.5 6.5L1 4" stroke="white" strokeWidth="1.6666" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        </div>
    )
}
export default CheckBox