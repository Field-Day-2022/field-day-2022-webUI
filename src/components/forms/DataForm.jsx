import { useState } from 'react'
import { ProjectField, YearField } from './Fields.jsx'
import { TurtleIcon, LizardIcon, MammalIcon, ArthropodIcon, AmphibianIcon } from '../../assets/icons.jsx'
import TabBar from '../TabBar.jsx'

export default function DataForm({ project, setProject}) {

    const [selectedCritter, setSelectedCritter] = useState('Turtle')

    const critterButtons = [
        { "text": "Turtle", "icon": <TurtleIcon /> },
        { "text": "Lizard", "icon": <LizardIcon className='h-6' /> },
        { "text": "Mammal", "icon": <MammalIcon /> },
        { "text": "Arthropod", "icon": <ArthropodIcon /> },
        { "text": "Amphibian", "icon": <AmphibianIcon /> },
    ]

    return (
        <div className='flex-col p-4'>
            <div className='flex justify-between'>
                <h1 className='heading'>Add New Criter Data</h1>
                <ProjectField setProject={setProject} />
            </div>
            <h2>Choose a session:</h2>
            <div className='flex'>
                <YearField />
            </div>
            <h2>Choose a critter:</h2>
            <div className='flex justify-between bg-neutral-100'>
                <TabBar
                    tabs={critterButtons.map(({ text, icon }) => ({
                        text,
                        icon,
                        onClick: () => setSelectedCritter(text),
                        active: text === selectedCritter,
                    }))}
                />
            </div>
        </div>
    )
}
