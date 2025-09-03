'use client'
import { Button, Col, Divider, Form, Input, notification, Row, Card, Typography, message } from 'antd';
import { ArrowLeftOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { sendRequest } from '@/utils/api';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const { Title, Text } = Typography;

const Register = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const onFinish = async (values: any) => {
        const { email, password } = values;
        setLoading(true);
        
        try {
            const res = await sendRequest<IBackendRes<any>>({
                url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/register`,
                method: "POST",
                body: {
                    email,
                    password
                }
            });
            
            if (res?.data) {
                message.success(res?.data?.message || 'Đăng ký thành công! Vui lòng kiểm tra email để kích hoạt tài khoản.');
                
                router.push(`/verify?email=${encodeURIComponent(email)}`);
            } else {
                notification.error({
                    message: "Register error",
                    description: res?.message
                });
            }
        } catch (error) {
            notification.error({
                message: "Register error",
                description: "Có lỗi xảy ra khi đăng ký tài khoản"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
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
                        <Title level={3}>Đăng Ký Tài Khoản</Title>
                        <Text type="secondary">
                            Tạo tài khoản mới để bắt đầu sử dụng hệ thống
                        </Text>
                    </div>

                    <Form
                        name="register"
                        onFinish={onFinish}
                        autoComplete="off"
                        layout="vertical"
                    >
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập email!',
                                },
                                {
                                    type: 'email',
                                    message: 'Email không đúng định dạng!',
                                }
                            ]}
                        >
                            <Input 
                                prefix={<MailOutlined />} 
                                placeholder="example@email.com" 
                                size="large"
                            />
                        </Form.Item>

                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập mật khẩu!',
                                },
                                {
                                    min: 6,
                                    message: 'Mật khẩu phải có ít nhất 6 ký tự!',
                                }
                            ]}
                        >
                            <Input.Password 
                                prefix={<LockOutlined />} 
                                placeholder="********" 
                                size="large"
                            />
                        </Form.Item>

                        <Form.Item
                            label="Confirm Password"
                            name="confirmPassword"
                            dependencies={['password']}
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng xác nhận mật khẩu!',
                                },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('Mật khẩu không khớp!'));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password 
                                prefix={<LockOutlined />} 
                                placeholder="********" 
                                size="large"
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button 
                                type="primary" 
                                htmlType="submit" 
                                block 
                                size="large"
                                loading={loading}
                            >
                                {loading ? 'Đang xử lý...' : 'Đăng ký'}
                            </Button>
                        </Form.Item>
                    </Form>

                    <Divider />

                    <div style={{ textAlign: "center" }}>
                        <Text>Đã có tài khoản? </Text>
                        <Link href={"/auth/login"}>Đăng nhập</Link>
                    </div>
                    
                    <div style={{ textAlign: "center", marginTop: 10 }}>
                        <Link href={"/auth/resend-activation"}>
                            Gửi lại mã kích hoạt
                        </Link>
                    </div>

                    <div style={{ marginTop: 16 }}>
                        <Link href={"/"}>
                            <ArrowLeftOutlined /> Quay lại trang chủ
                        </Link>
                    </div>
                </Card>
            </Col>
        </Row>
    )
}

export default Register;