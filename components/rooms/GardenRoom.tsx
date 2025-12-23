
import React from 'react';
import { AppView } from '../../types';
import RoomLayout from './RoomLayout';

const GardenRoom: React.FC<{ setView: (v: AppView) => void }> = ({ setView }) => {
    return (
        <RoomLayout roomType={AppView.BOO_GARDEN} setView={setView} disableHint={true}>
            <div className="w-full h-full flex items-center justify-center">
                {/* Area giardino per future espansioni */}
            </div>
        </RoomLayout>
    );
};

export default GardenRoom;
