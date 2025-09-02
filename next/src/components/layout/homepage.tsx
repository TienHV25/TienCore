'use client'

import { CrownOutlined, GithubOutlined } from "@ant-design/icons"
import { Result, Button, Card, Typography } from "antd"

const { Title, Paragraph } = Typography

const HomePage = () => {
    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "linear-gradient(135deg, #e0f7fa, #f1f8e9)",
                padding: 20,
            }}
        >
            <Card
                style={{
                    maxWidth: 600,
                    width: "100%",
                    borderRadius: 16,
                    boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
                    textAlign: "center",
                    padding: 24,
                }}
            >
                <Result
                    icon={<CrownOutlined style={{ fontSize: 60, color: "#faad14" }} />}
                    title={
                        <Title level={3} style={{ marginBottom: 0 }}>
                            Fullstack Next/Nest
                        </Title>
                    }
                    subTitle={
                        <Paragraph style={{ fontSize: 16, marginTop: 10 }}>
                            created by <b>@TienCore</b>
                        </Paragraph>
                    }
                    extra={[
                        <Button
                            type="primary"
                            key="github"
                            icon={<GithubOutlined />}
                            href="https://github.com/TienHV25/"
                            target="_blank"
                        >
                            GitHub
                        </Button>,
                        <Button key="learn" href="/auth/login">
                            Sign in
                        </Button>
                    ]}
                />
            </Card>
        </div>
    )
}

export default HomePage
