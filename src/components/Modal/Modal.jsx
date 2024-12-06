import s from "./Modal.module.scss";
import { Cross, Folder, Plus, Trash } from "./Svgs";
import { useEffect } from "react";

const Modal = ({ children, isOpened, height, setOpen, long, icon, text }) => {
  useEffect(() => {
    if (isOpened) {
      document.body.style.overflowY = "hidden";
    } else {
      document.body.style.overflowY = "auto";
    }
  }, [isOpened]);
  return (
    <div
      onClick={setOpen}
      className={`${s.bgModal} ${isOpened ? s.activeBg : ""}`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`${s.content} ${height ? s.height : ""} ${long ? s.long : ""}`}
      >
        <div className={s.topDiv}>
          <div className={s.left}>
            <div className={`${icon === "delete" ? s.folderDiv2 : s.folderDiv}`}>
              {icon === "plus" ? <Plus /> : icon === "delete" ? <Trash /> : <Folder />}
            </div>
            <h2>{text && text}</h2>
          </div>
          <div onClick={setOpen} className={s.cross}>
            <Cross />
          </div>
        </div>
        <div className={s.contWrapper}>
          <div className={s.modalCont}>{children}</div>
        </div>
      </div>
    </div>
  );
};
export default Modal;
