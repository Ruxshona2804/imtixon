import React, { useEffect } from 'react';
import { Modal, Form, Input, TimePicker, Select } from 'antd';
import dayjs from 'dayjs';

const ShiftEditModal = ({ open, onClose, onSave, shiftData, branches }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open && shiftData) {
      form.setFieldsValue({
        name: shiftData.name,
        branch: shiftData.branch,
        start_time: dayjs(shiftData.start_time, 'HH:mm'),
        end_time: dayjs(shiftData.end_time, 'HH:mm'),
      });
    }
  }, [open, shiftData, form]);

  const handleOk = () => {
    form.validateFields().then(values => {
      const payload = {
        name: values.name,
        branch: values.branch,
        start_time: values.start_time.format('HH:mm'),
        end_time: values.end_time.format('HH:mm'),
      };
      onSave(payload);
      form.resetFields();
    });
  };

  const handleCancel = () => {
    onClose();
    form.resetFields();
  };

  return (
    <Modal
      title="Smenani tahrirlash"
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      okText="Saqlash"
      cancelText="Bekor qilish"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Smena nomi"
          name="name"
          rules={[{ required: true, message: 'Smena nomini kiriting' }]}
        >
          <Input placeholder="Masalan: Ertalabki smena" />
        </Form.Item>

        <Form.Item
          label="Filial"
          name="branch"
          rules={[{ required: true, message: 'Filialni tanlang' }]}
        >
          <Select placeholder="Filial tanlang">
            {branches.map(branch => (
              <Select.Option key={branch.id} value={branch.id}>
                {branch.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Boshlanish vaqti"
          name="start_time"
          rules={[{ required: true, message: 'Boshlanish vaqtini tanlang' }]}
        >
          <TimePicker format="HH:mm" className="w-full" />
        </Form.Item>

        <Form.Item
          label="Tugash vaqti"
          name="end_time"
          rules={[{ required: true, message: 'Tugash vaqtini tanlang' }]}
        >
          <TimePicker format="HH:mm" className="w-full" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ShiftEditModal;
