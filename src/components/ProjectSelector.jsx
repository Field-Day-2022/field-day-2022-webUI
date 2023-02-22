import { useAtom } from "jotai";
import { currentProjectName } from "../utils/jotai";
import Dropdown from "./Dropdown";

export const ProjectSelector = () => {
    const [currentProject, setCurrentProject] = useAtom(currentProjectName);
    
    return (
        <div className='flex items-center px-5 space-x-5'>
            <div>Project: </div>
            <Dropdown
                onClickHandler={(selectedOption) => {
                    if (selectedOption !== currentProject)
                        setCurrentProject(selectedOption.replace(/\s/g, ''));
                }}
                options={['Gateway', 'Virgin River', 'San Pedro']}
            />
        </div>
    )
}