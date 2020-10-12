import React from 'react';
import './Stage.css';
import Character from './Character';

const Stage= (props) => {
    // all the elements for the current stage mapped
    return (
        <div className = "justify-left">
            <h1 className="levels-h1">Stage {props.level}</h1>
            <div className="stage-flex">
                {Object.keys(props.stageData).map((item, index) => 
                    <Character
                        data={props.stageData}
                        character={item}
                        value=''
                        key={item + index} />
                )}
            </div>
        </div>
    );
};

export default Stage;