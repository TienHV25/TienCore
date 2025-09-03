'use client'
import { useSearchParams, redirect } from 'next/navigation';
import { Suspense } from 'react';
import Verify from "@/components/auth/verify";

const VerifyContent = () => {
    const searchParams = useSearchParams();
    const email = searchParams.get('email');

    // Redirect if email parameter not exist
    if (!email) {
        redirect('/auth/login');
    }

    return (
        <Verify email={email} />
    );
};

const VerifyPage = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <VerifyContent />
        </Suspense>
    );
};

export default VerifyPage;