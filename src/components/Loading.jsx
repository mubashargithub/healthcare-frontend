import React from 'react';
import { Loader2 } from 'lucide-react';

const Loading = () => {
    return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <Loader2 className="h-12 w-12 text-primary-600 animate-spin" />
        </div>
    );
};

export default Loading;
