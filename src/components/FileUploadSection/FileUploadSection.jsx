import { Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';

const FileUploadSection = ({ title, fileList, onChange }) => {
    return (
        <div style={{ marginBottom: '20px' }}>
            <h4>{title}</h4>
            <Upload
                beforeUpload={() => false}
                fileList={fileList}
                onChange={onChange}
                multiple
            >
                <button type="button">
                    <UploadOutlined /> Выберите файлы
                </button>
            </Upload>
        </div>
    );
};

FileUploadSection.propTypes = {
    title: PropTypes.string.isRequired,
    fileList: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired
};

export default FileUploadSection; 