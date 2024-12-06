import { useState } from 'react';
import FileUploadSection from '../FileUploadSection/FileUploadSection';
import s from '../../pages/DetailedApplication/DetailedApplication.module.scss';

const ExplanationInfo = ({ onSubmit }) => {
    const [actFiles, setActFiles] = useState([]);
    const [explanationFiles, setExplanationFiles] = useState([]);
    
    const handleSubmit = async () => {
        const formData = new FormData();
        
        // Add act files if any
        actFiles.forEach(file => {
            formData.append('actFiles', file.originFileObj);
        });
        
        // Add explanation files if any
        explanationFiles.forEach(file => {
            formData.append('explanationFiles', file.originFileObj);
        });
        
        // Call the parent's onSubmit with the formData
        await onSubmit(formData);
    };

    return (
        <div className={s.container}>
            <FileUploadSection
                title="Акт сверки"
                fileList={actFiles}
                onChange={({ fileList }) => setActFiles(fileList)}
            />
            1111111
            <FileUploadSection
                title="Пояснительная записка"
                fileList={explanationFiles}
                onChange={({ fileList }) => setExplanationFiles(fileList)}
            />
            
            <button 
                className={s.submitButton}
                onClick={handleSubmit}
                disabled={actFiles.length === 0 && explanationFiles.length === 0}
            >
                Отправить
            </button>
        </div>
    );
};

export default ExplanationInfo;
