import TabBar from "../components/TabBar"
import { ProjectSelector } from "../components/ProjectSelector"

export default function PageWrapper({children}) {
    return(
        <div className="w-full text-center overflow-auto max-h-full-minus-nav">
            <div className='flex justify-between items-center overflow-auto'>
                <TabBar />
                <ProjectSelector />
            </div>
            {children}
        </div>
    )
}