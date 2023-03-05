import Modal from "../components/Modal";
import { FormBuilder } from "../pages";

export default function FormBuilderModal({ showModal, onCancel, onOkay }) {
    return (
        <Modal
            showModal={showModal}
            onCancel={onCancel}
            onOkay={onOkay}
            title='Form Builder'
            text='View, create, and modify forms for data collection. Data Forms describe individual observations of a single entity type. Session Forms describe a collection of data entries across multiple different Data Forms.'
        >
            <div className="w-full-modal-width">
                <FormBuilder />
            </div>
            
        </Modal>
    );
}