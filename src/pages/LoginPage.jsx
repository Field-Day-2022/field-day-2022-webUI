import Button from "../components/Button";
import Card from "../components/Card";
import {GoogleIcon, LizardIcon} from "../assets/icons";
import PageWrapper from "./PageWrapper";

export default function LoginPage({ auth }) {

    const LOADING_MESSAGE = 'Loading Google\'s authentication.'
    const LOGIN_MESSAGE = 'Click login to sign in with your ASURITE ID.'

    return (
        <PageWrapper>
            <div className="pt-10">
                <h1 className="title">Field Day</h1>
                <h2 className="subtitle">Data Management Tool</h2>
            </div>
            <Card className='bg-white mx-auto w-96'>
                <div className="flex flex-col space-y-5">
                    <p>
                        {(auth.loading ? LOADING_MESSAGE : LOGIN_MESSAGE)}
                    </p>
                    <Button
                        disabled={auth.loading}
                        text={(!auth.loading ? 'Login' : 'Please wait.')}
                        onClick={() =>
                            auth.login()
                        }
                        icon={<GoogleIcon className="w-6 mx-auto bg-white p-0.5 rounded-full" />}
                    />
                </div>
            </Card>
            <LizardIcon className="text-asu-maroon h-48 mx-auto rotate-45" />
        </PageWrapper>
    );
}