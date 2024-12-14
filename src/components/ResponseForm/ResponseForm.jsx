import { ArrowLeft, CrossReport } from "../../pages/DetailedApplication/Svgs";
import UploadButton from "../../pages/DetailedApplication/UploadButton/UploadButton";
import { Pencil } from "../Svgs/Svgs";
import styles from '../../pages/DetailedApplication/DetailedApplication.module.scss';

const ResponseForm = ({
    data,
    setOpened,
    setCancel,
    uploads,
    setUploads,
    comments,
    setComments,
    handleAnswer,
    explanationFiles,
    setExplanationFiles,
    loading,
}) => {
    const isButtonDisabled = !(uploads.length > 0 && uploads.some(upload => upload.uploaded)) && comments.trim() === '';

    return (
        <div className={styles.report}>
            <div className={styles.sendAnswer}>
                <div style={{ width: '30%' }}>
                    <h2 className={styles.h2}>Отправить ответ</h2>
                </div>
                <div className={styles.btns}>
                    <button onClick={() => setOpened(true)} className={styles.redBtn}>
                        <CrossReport /> Отклонить заявку
                    </button>
                    <button onClick={() => setCancel(true)} className={styles.whiteBtn}>
                        <Pencil style={{ stroke: "#067647" }} /> На уточнение
                    </button>
                </div>
            </div>
            {/* <div className={styles.hr} /> */}
            <hr />
            {data.status !== "Отклонена" &&
                data.status !== "Рассмотрена" &&
                data.status !== "На уточнении" ? (
                <>

                    <div className={styles.firstBlock}>
                        <div className={styles.uploadBtns}>
                            <div>
                                <p>Пакет документов для покупателя</p>
                                <UploadButton uploads={uploads} setUploads={setUploads} />
                            </div>
                            <div>
                                <p>Пакет документов для продавца</p>
                                <UploadButton uploads={explanationFiles} setUploads={setExplanationFiles} />
                            </div>
                        </div>
                        <div className={styles.textareaDiv}>
                            <h2>Комментарий</h2>
                            <textarea
                                maxLength={4096}
                                value={comments}
                                onChange={(e) => setComments(e.target.value)}
                                placeholder="Введите описание"
                            />
                        </div>
                        <button
                            className={styles.finalBtn}
                            disabled={isButtonDisabled}
                            onClick={handleAnswer}
                        >
                            {loading ? <p>Загрузка..</p> : <div><ArrowLeft /> Отправить ответ и закрыть заявку</div>}
                        </button>
                    </div>
                </>
            ) : (
                <button className={styles.cancelledBtn}>
                    <ArrowLeft />
                    {data.status === "На уточнении"
                        ? "Заявка на уточнении"
                        : "Заявка закрыта"}
                </button>
            )}
        </div>
    );
};

export default ResponseForm;
