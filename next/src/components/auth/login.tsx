'use client'
import { Button, Col, Divider, Form, Input, notification, Row, Card, Typography } from 'antd';
import { ArrowLeftOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import Link from 'next/link';
// import { authenticate } from '@/utils/actions';
import { useRouter } from 'next/navigation';
import ModalReactive from './modal.reactive'; 
import { useState } from 'react';
import ModalChangePassword from './modal.change.password';

const { Title, Text } = Typography;

const Login = () => {
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userEmail, setUserEmail] = useState("");

    const [changePassword, setChangePassword] = useState(false);

    const onFinish = async (values: any) => {
        const { username, password } = values;
        setUserEmail("");
        //trigger sign-in
        // const res = await authenticate(username, password);

        // if (res?.error) {
        //     //error
        //     if (res?.code === 2) {
        //         setIsModalOpen(true);
        //         setUserEmail(username);
        //         return;
        //     }
        //     notification.error({
        //         message: "Error login",
        //         description: res?.error
        //     })

        // } else {
        //     //redirect to /dashboard
        //     router.push('/dashboard');
        // }
    };

    return (
        <>
            <Row
                justify="center"
                align="middle"
                style={{
                    minHeight: "100vh",
                    background: "linear-gradient(135deg, #fffbe6, #e6fffb)",
                    padding: 20,
                }}
            >
                <Col xs={24} md={12} lg={8}>
                    <Card
                        style={{
                            borderRadius: 12,
                            boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                        }}
                        bordered={false}
                    >
                        <div style={{ textAlign: "center", marginBottom: 20 }}>
                            <Title level={3}>Đăng Nhập</Title>
                            <Text type="secondary">
                                Vui lòng nhập email và mật khẩu để tiếp tục
                            </Text>
                        </div>

                        <Form
                            name="basic"
                            onFinish={onFinish}
                            autoComplete="off"
                            layout="vertical"
                        >
                            <Form.Item
                                label="Email"
                                name="username"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your email!',
                                    },
                                ]}
                            >
                                <Input prefix={<MailOutlined />} placeholder="example@email.com" />
                            </Form.Item>

                            <Form.Item
                                label="Password"
                                name="password"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your password!',
                                    },
                                ]}
                            >
                                <Input.Password prefix={<LockOutlined />} placeholder="********" />
                            </Form.Item>

                            <Form.Item>
                                <div style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center"
                                }}>
                                    <Button type="primary" htmlType="submit" block>
                                        Login
                                    </Button>
                                    <Button type="link" onClick={() => setChangePassword(true)}>
                                        Quên mật khẩu?
                                    </Button>
                                </div>
                            </Form.Item>
                        </Form>

                        <Divider />

                        <div style={{ textAlign: "center" }}>
                            <Text>Chưa có tài khoản? </Text>
                            <Link href={"/auth/register"}>Đăng ký tại đây</Link>
                        </div>

                        <div style={{ marginTop: 16 }}>
                            <Link href={"/"}>
                                <ArrowLeftOutlined /> Quay lại trang chủ
                            </Link>
                        </div>
                    </Card>
                </Col>
            </Row>

            <ModalReactive
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                userEmail={userEmail}
            />
            <ModalChangePassword
                isModalOpen={changePassword}
                setIsModalOpen={setChangePassword}
            />
        </>
    )
}

export default Login;
