import Link from 'next/link';
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react';

export default function Results(props: any) {
    const [result, setResult] = useState({
        id: 1,
        subject: "",
        result: "",
        limit: 7,
        lang: "",
        age: 5,
        type: ""
    });
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const router = useRouter();
    const resultId = router.query.id;
    const handleNewsLetter = async () => {
        if (!email) return;
        const response = await fetch(`http://localhost:8000/email/`, {
            method: 'POST',
            body: JSON.stringify({ email }),
            headers: { 'Content-Type': 'application/json' },
        })
    }
    const fetchData = async () => {
        try {
            const response = await fetch(`http://localhost:8000/result/${resultId}`);
            const json = await response.json();
            if (json === null) {
                throw new Error("Empty Results");
            }
            setResult(json);
        } catch (error) {
            setLoading(false);
            console.log(error);
        }

    }
    useEffect(() => {
        if (!router.isReady) return;
        fetchData();
    }, [router.isReady])


    return <><div className="navbar bg-base-100">
        <div className="flex-1">
            <Link href="/" className="btn btn-ghost normal-case text-xl">
                Home
            </Link>
        </div>
        <div className="flex-none">
            <div className="dropdown dropdown-end">
                <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                    <div className="w-10 rounded-full">
                        <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
                    </div>
                </label>
                <ul tabIndex={0} className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
                    <li onClick={() => router.push('/signup')}><a>Login</a></li>
                </ul>
            </div>
        </div>
    </div>
        {result.result ?
            <>
                <div className="card w-100 bg-base-100 shadow-xl">
                    <figure><img src="https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg" alt="Shoes" /></figure>
                    <div className="card-body">
                        <button className="btn btn-primary" onClick={() => router.push('/')}>Search another term</button>
                        <h2 className="card-title">{result.subject}</h2>
                        <p>{result.result}</p>
                        <div className='flex flex-row items-center justify-end fill-white'>
                            <button onClick={() => { navigator?.clipboard && navigator.clipboard.writeText(result.result) }}>
                                <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" className="octicon octicon-copy js-clipboard-copy-icon m-2">
                                    <path fillRule="evenodd" d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 010 1.5h-1.5a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-1.5a.75.75 0 011.5 0v1.5A1.75 1.75 0 019.25 16h-7.5A1.75 1.75 0 010 14.25v-7.5z"></path><path fillRule="evenodd" d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0114.25 11h-7.5A1.75 1.75 0 015 9.25v-7.5zm1.75-.25a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-7.5a.25.25 0 00-.25-.25h-7.5z"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </> : <></>}
        <footer className="footer p-10 bg-base-200 text-base-content">
            <div>
                <span className="footer-title">Newsletter</span>
                <div className="form-control w-80">
                    <label className="label">
                        <span className="label-text">Enter your email address</span>
                    </label>
                    <div className="relative">
                        <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="username@site.com" className="input input-bordered w-full pr-16" required />
                        <button className="btn btn-primary absolute top-0 right-0 rounded-l-none" onClick={handleNewsLetter}>Subscribe</button>
                    </div>
                </div>
            </div>
        </footer>
    </>
}
