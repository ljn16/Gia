import React, { useState } from 'react';

const AdvancedOptions = ({ onOptionsChange }) => {  //* AdvancedOptions component | ACCEPTS: onOptionsChange prop
    const [epochs, setEpochs] = useState('');
    const [layers, setLayers] = useState('');
    const [loss, setLoss] = useState('');

    const handleEpochsChange = (e) => {
        setEpochs(e.target.value);
        onOptionsChange({ epochs: e.target.value, layers, loss });  //
    };

    const handleLayersChange = (e) => {
        setLayers(e.target.value);
        onOptionsChange({ epochs, layers: e.target.value, loss });
    };

    const handleLossChange = (e) => {
        setLoss(e.target.value);
        onOptionsChange({ epochs, layers, loss: e.target.value });
    };

    return (
        <div>
            <div>
                <label>Number of Epochs:</label>
                <input type="number" value={epochs} onChange={handleEpochsChange} />
            </div>
            <div>
                <label>Layers:</label>
                <input type="number" value={layers} onChange={handleLayersChange} />
            </div>
            <div>
                <label>Loss:</label>
                <input type="text" value={loss} onChange={handleLossChange} />
            </div>
        </div>
    );
};

export default AdvancedOptions;