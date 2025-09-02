'use client'
import { Layout } from 'antd';
const AdminFooter = () => {
     const { Footer} = Layout;
    return(
        <div> 
            <Footer style={{ textAlign: 'center' }}>
               TienCore ©{new Date().getFullYear()} Created by @TienCore
            </Footer>
        </div>
    )
}

export default AdminFooter