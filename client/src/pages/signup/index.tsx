import Link from 'next/link';
export default function signup() {
    return <div className='h-screen w-screen flex flex-col items-center justify-center'>
        <Link href="https://fimple.authlink.me" target="_blank" rel="noopener noreferrer">
            <button type="button" style={{
                border: "none", background: "transparent", outline: "none",
            }}
            >
                <img src="https://otpless-cdn.s3.ap-south-1.amazonaws.com/otpless_button.svg" style={{ width: '300px' }} />
            </button>
        </Link>
    </div >
}