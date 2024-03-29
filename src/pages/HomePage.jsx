import Card from "../components/Card";
import Button from "../components/Button";
import PageWrapper from "./PageWrapper";
import { useAtom } from "jotai";
import { currentPageName } from '../utils/jotai';

export default function HomePage() {
    const [currentPage, setCurrentPage] = useAtom(currentPageName);
    return (
        <PageWrapper>
            <Card className='bg-asu-maroon'>
                <div className="text-white">
                    <h1 className="title">Field Day</h1>
                    <h2 className="subtitle">Data Management Tool</h2>
                    <p>
                        Field Day builds rich, dynamic forms for mobile data collection and query.
                    </p>
                </div>
            </Card>
            <div className="flex">
                <Card className='bg-white'>
                    <h1 className="heading">Overview</h1>
                    <p>
                        Field Day is a set of wildlife data collection and query tools designed to mitigate errors in
                        data collected through the capture-mark-recapture (CMR) process. Field Day consists of a data
                        collection and access tools such as a PWA, a database, as well as supporting documentation.
                        Currently, the application and database are only used by Dr. Bateman and wildlife students.
                        Dr. Bateman would like the application to be designed in such a way that it can be adapted to
                        different projects in the future. Potential users could be state and federal natural resource
                        employees and members of non-profit organizations. Dr. Bateman also mentioned medical doctors
                        and researchers. The application should be designed to accommodate potential users across many
                        diverse fields of study. Any professional that needs to collect and query data in the field
                        should be able to adapt this application to suit their needs.
                    </p>
                </Card>

                {/*TODO set width of cards for webui and overview, rather than changing by amount of text*/}

                <Card className='bg-white'>
                    <h1 className="heading">Enter the WebUI</h1>
                    <p>
                        Field Day is an academic research tool for wildlife students at ASU. The focus of Field Day is
                        to simplify the process of collecting and querying data in a way that also reduces errors.
                        Created by software engineering students, it also serves as practice with interdisciplinary
                        work. Software students learn to understand and meet the needs of clients outside their own
                        domain.-------------------------------------------------------------
                        -------------------------------------------------------------
                        -------------------------------------------------------------
                        -------------------------------------------------------------
                        -------------------------------------------------------------
                        -------------------------------------------------------------

                    </p>
                    <p>&nbsp;</p>
                    <center>
                        <Button text='Enter WebUi' onClick={() => setCurrentPage('Table')} />
                    </center>
                </Card>
            </div>
            <div>
                {/*TODO add hyperlinks to repository and documentation of technology*/}
                <div>
                Tailwind with Vite - https://tailwindcss.com/docs/guides/vite
                React - https://reactjs.org/docs/getting-started.html
                Firebase - https://firebase.google.com/docs
                Firestore - https://cloud.google.com/firestore/docs
                </div>
                {/*TODO add page for quick start guide*/}
                <Card className='bg-white'>
                    <h1 className="heading">What's New About Field Day?</h1>
                    <p>
                     Description of changes with links to quick start guide and documentation
                    </p>
                    <p>&nbsp;</p>
                    <center>
                        <Button style={'position: absolute; left: 50%; transform: translateX(-50%)'} text='Documentation for Software Team' onClick={() => setCurrentPage('New')}/>
                    </center>
                    <p>&nbsp;</p>
                    <center>
                        <Button style={'position: absolute; left: 50%; transform: translateX(-50%)'} text='Documentation for Users' onClick={() => setCurrentPage('Guide')}/>
                    </center>
                </Card>
            </div>

        </PageWrapper>
    )
}
