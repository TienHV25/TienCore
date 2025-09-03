'use client'
import React, { useState } from 'react';
import { Button, Col, Divider, Form, Input, message, notification, Row } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { sendRequest } from '@/utils/api';
import { useRouter } from 'next/navigation';
import ModalReactive from './modal.reactive';

const Verify = (props: any) => {
    const { email } = props; 

    const router = useRouter()

    const [isModalOpen, setIsModalOpen] = useState(false);

    const onFinish = async (values: any) => {
        const { email, code } = values;
        const res = await sendRequest<IBackendRes<any>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/verify-activation`,
            method: "POST",
            body: {
                email,
                code
            }
        })
        if (res?.data) {
            message.success("Kích hoạt tài khoản thành công.")
            router.push(`/auth/login`);
        } else {
            notification.error({
                message: "Verify error",
                description: res?.message
            })
        }
    };

    return (
        <Row justify={"center"} style={{ marginTop: "30px" }}>
            <Col xs={24} md={16} lg={8}>
                <fieldset style={{
                    padding: "15px",
                    margin: "5px",
                    border: "1px solid #ccc",
                    borderRadius: "5px"
                }}>
                    <legend>Kích hoạt tài khoản</legend>
                    <Form
                        name="basic"
                        onFinish={onFinish}
                        autoComplete="off"
                        layout='vertical'
                    >
                        <Form.Item
                            label="Email"
                            name="email"
                            initialValue={email}
                            hidden
                        >
                            <Input disabled />
                        </Form.Item>
                        <div>
                            Mã code đã được gửi tới email <strong>{email}</strong>, vui lòng kiểm tra email.
                        </div>
                        <Divider />

                        <Form.Item
                            label="Code"
                            name="code"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your code!',
                                },
                            ]}
                        >
                            <Input placeholder="Nhập mã kích hoạt" />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" block>
                                Kích hoạt tài khoản
                            </Button>
                        </Form.Item>
                    </Form>
                    
                    <Link href={"/"}><ArrowLeftOutlined /> Quay lại trang chủ</Link>
                    <Divider />
                    <div style={{ textAlign: "center" }}>
                        Đã có tài khoản? <Link href={"/auth/login"}>Đăng nhập</Link>
                    </div>
                    <div style={{ textAlign: "center", marginTop: "10px" }}>
                        <Button type="link" onClick={() => setIsModalOpen(true)}>
                            Gửi lại mã kích hoạt
                        </Button>
                    </div>
                </fieldset>
            </Col>

            <ModalReactive
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                userEmail={email}
            />
        </Row>
    )
}

export default Verify;