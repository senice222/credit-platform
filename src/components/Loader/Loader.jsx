import style from './Loader.module.scss'
import {ClipLoader} from "react-spinners";

const Loader = () => {
    return (
        <div className={style.center}>
            <ClipLoader size={50} color={"#123abc"} loading={true}/>
        </div>
    );
};

export default Loader;